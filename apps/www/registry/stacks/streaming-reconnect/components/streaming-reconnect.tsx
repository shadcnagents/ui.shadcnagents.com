"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"

// ============================================================================
// TYPES
// ============================================================================

export type ConnectionState =
  | "disconnected"
  | "connecting"
  | "connected"
  | "reconnecting"
  | "failed"

export interface StreamEvent {
  id: string
  type: "data" | "reconnect" | "error" | "heartbeat"
  timestamp: Date
  data?: string
  error?: string
}

export interface ReconnectConfig {
  maxRetries?: number
  baseDelay?: number
  maxDelay?: number
  heartbeatInterval?: number
  idleTimeout?: number
  onReconnect?: (attempt: number) => void
  onMaxRetriesReached?: () => void
  onConnectionChange?: (state: ConnectionState) => void
}

export interface StreamingState {
  connectionState: ConnectionState
  lastEventId: string | null
  reconnectAttempts: number
  events: StreamEvent[]
  bytesReceived: number
  messagesReceived: number
  lastHeartbeat: Date | null
  partialContent: string
}

// ============================================================================
// HOOK: useStreamingReconnect
// ============================================================================

interface UseStreamingReconnectOptions extends ReconnectConfig {
  url?: string
}

export function useStreamingReconnect(options: UseStreamingReconnectOptions = {}) {
  const {
    url = "/api/chat",
    maxRetries = 5,
    baseDelay = 1000,
    maxDelay = 30000,
    heartbeatInterval = 30000,
    idleTimeout = 60000,
    onReconnect,
    onMaxRetriesReached,
    onConnectionChange,
  } = options

  const [state, setState] = useState<StreamingState>({
    connectionState: "disconnected",
    lastEventId: null,
    reconnectAttempts: 0,
    events: [],
    bytesReceived: 0,
    messagesReceived: 0,
    lastHeartbeat: null,
    partialContent: "",
  })

  const abortControllerRef = useRef<AbortController | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const heartbeatTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const idleTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Update connection state
  const setConnectionState = useCallback(
    (newState: ConnectionState) => {
      setState((prev) => ({ ...prev, connectionState: newState }))
      onConnectionChange?.(newState)
    },
    [onConnectionChange]
  )

  // Add event to log
  const addEvent = useCallback((event: Omit<StreamEvent, "id" | "timestamp">) => {
    const newEvent: StreamEvent = {
      ...event,
      id: crypto.randomUUID(),
      timestamp: new Date(),
    }
    setState((prev) => ({
      ...prev,
      events: [newEvent, ...prev.events].slice(0, 100),
    }))
  }, [])

  // Calculate backoff delay with jitter
  const getBackoffDelay = useCallback(
    (attempt: number) => {
      const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay)
      const jitter = delay * 0.2 * Math.random()
      return delay + jitter
    },
    [baseDelay, maxDelay]
  )

  // Clear all timeouts
  const clearTimeouts = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = null
    }
    if (heartbeatTimeoutRef.current) {
      clearTimeout(heartbeatTimeoutRef.current)
      heartbeatTimeoutRef.current = null
    }
    if (idleTimeoutRef.current) {
      clearTimeout(idleTimeoutRef.current)
      idleTimeoutRef.current = null
    }
  }, [])

  // Reset idle timeout
  const resetIdleTimeout = useCallback(() => {
    if (idleTimeoutRef.current) {
      clearTimeout(idleTimeoutRef.current)
    }
    idleTimeoutRef.current = setTimeout(() => {
      addEvent({ type: "error", error: "Idle timeout - no data received" })
      setConnectionState("reconnecting")
    }, idleTimeout)
  }, [idleTimeout, addEvent, setConnectionState])

  // Process SSE data
  const processSSEData = useCallback(
    (data: string, eventId?: string) => {
      setState((prev) => ({
        ...prev,
        bytesReceived: prev.bytesReceived + data.length,
        messagesReceived: prev.messagesReceived + 1,
        lastEventId: eventId || prev.lastEventId,
        partialContent: prev.partialContent + data,
      }))

      addEvent({ type: "data", data: data.slice(0, 100) })
      resetIdleTimeout()
    },
    [addEvent, resetIdleTimeout]
  )

  // Connect to stream
  const connect = useCallback(
    async (
      messages: Array<{ role: string; content: string }>,
      onChunk?: (chunk: string) => void,
      onComplete?: (content: string) => void
    ) => {
      // Abort any existing connection
      abortControllerRef.current?.abort()
      clearTimeouts()

      abortControllerRef.current = new AbortController()
      setConnectionState("connecting")

      const attemptConnection = async (attempt: number): Promise<boolean> => {
        if (attempt >= maxRetries) {
          setConnectionState("failed")
          onMaxRetriesReached?.()
          addEvent({ type: "error", error: "Max reconnection attempts reached" })
          return false
        }

        try {
          const headers: HeadersInit = {
            "Content-Type": "application/json",
          }

          // Include Last-Event-ID for resumption
          if (state.lastEventId) {
            headers["Last-Event-ID"] = state.lastEventId
          }

          const response = await fetch(url, {
            method: "POST",
            headers,
            body: JSON.stringify({
              messages,
              lastEventId: state.lastEventId,
              resumeFrom: state.partialContent.length,
            }),
            signal: abortControllerRef.current?.signal,
          })

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`)
          }

          setConnectionState("connected")
          setState((prev) => ({ ...prev, reconnectAttempts: 0 }))

          if (attempt > 0) {
            addEvent({ type: "reconnect", data: `Reconnected on attempt ${attempt + 1}` })
            onReconnect?.(attempt)
          }

          // Process the stream
          const reader = response.body?.getReader()
          const decoder = new TextDecoder()
          let fullContent = state.partialContent

          if (reader) {
            let buffer = ""

            while (true) {
              const { done, value } = await reader.read()

              if (done) {
                setConnectionState("disconnected")
                onComplete?.(fullContent)
                return true
              }

              const chunk = decoder.decode(value, { stream: true })
              buffer += chunk

              // Parse SSE format
              const lines = buffer.split("\n")
              buffer = lines.pop() || ""

              for (const line of lines) {
                if (line.startsWith("data: ")) {
                  const data = line.slice(6)
                  if (data === "[DONE]") {
                    continue
                  }

                  try {
                    const parsed = JSON.parse(data)
                    const content = parsed.choices?.[0]?.delta?.content || parsed.content || ""

                    if (content) {
                      fullContent += content
                      processSSEData(content, parsed.id)
                      onChunk?.(content)
                    }
                  } catch {
                    // Plain text chunk
                    fullContent += data
                    processSSEData(data)
                    onChunk?.(data)
                  }
                } else if (line.startsWith("id: ")) {
                  const eventId = line.slice(4)
                  setState((prev) => ({ ...prev, lastEventId: eventId }))
                } else if (line.startsWith(": ")) {
                  // Heartbeat comment
                  setState((prev) => ({ ...prev, lastHeartbeat: new Date() }))
                  addEvent({ type: "heartbeat" })
                }
              }
            }
          }

          return true
        } catch (error) {
          if ((error as Error).name === "AbortError") {
            return true // Intentionally aborted
          }

          const errorMessage = (error as Error).message
          addEvent({ type: "error", error: errorMessage })

          // Check if we should retry
          if (attempt < maxRetries - 1) {
            setState((prev) => ({
              ...prev,
              reconnectAttempts: attempt + 1,
            }))
            setConnectionState("reconnecting")

            const delay = getBackoffDelay(attempt)
            addEvent({
              type: "reconnect",
              data: `Retrying in ${Math.round(delay / 1000)}s (attempt ${attempt + 2}/${maxRetries})`,
            })

            await new Promise((resolve) => {
              reconnectTimeoutRef.current = setTimeout(resolve, delay)
            })

            return attemptConnection(attempt + 1)
          }

          return false
        }
      }

      return attemptConnection(0)
    },
    [
      url,
      maxRetries,
      state.lastEventId,
      state.partialContent,
      clearTimeouts,
      setConnectionState,
      addEvent,
      getBackoffDelay,
      processSSEData,
      onReconnect,
      onMaxRetriesReached,
    ]
  )

  // Disconnect
  const disconnect = useCallback(() => {
    abortControllerRef.current?.abort()
    clearTimeouts()
    setConnectionState("disconnected")
  }, [clearTimeouts, setConnectionState])

  // Reset state
  const reset = useCallback(() => {
    disconnect()
    setState({
      connectionState: "disconnected",
      lastEventId: null,
      reconnectAttempts: 0,
      events: [],
      bytesReceived: 0,
      messagesReceived: 0,
      lastHeartbeat: null,
      partialContent: "",
    })
  }, [disconnect])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort()
      clearTimeouts()
    }
  }, [clearTimeouts])

  return {
    ...state,
    connect,
    disconnect,
    reset,
  }
}

// ============================================================================
// CONNECTION STATUS BAR
// ============================================================================

interface ConnectionStatusBarProps {
  state: ConnectionState
  reconnectAttempts: number
  maxRetries: number
  lastEventId: string | null
  bytesReceived: number
  onReconnect?: () => void
}

export function ConnectionStatusBar({
  state,
  reconnectAttempts,
  maxRetries,
  lastEventId,
  bytesReceived,
  onReconnect,
}: ConnectionStatusBarProps) {
  const statusConfig: Record<
    ConnectionState,
    { color: string; bgColor: string; icon: React.ReactNode; label: string }
  > = {
    disconnected: {
      color: "text-zinc-500",
      bgColor: "bg-zinc-500/10",
      icon: <DisconnectedIcon className="size-4" />,
      label: "Disconnected",
    },
    connecting: {
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      icon: <SpinnerIcon className="size-4 animate-spin" />,
      label: "Connecting...",
    },
    connected: {
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
      icon: <ConnectedIcon className="size-4" />,
      label: "Connected",
    },
    reconnecting: {
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
      icon: <SpinnerIcon className="size-4 animate-spin" />,
      label: `Reconnecting (${reconnectAttempts + 1}/${maxRetries})...`,
    },
    failed: {
      color: "text-red-500",
      bgColor: "bg-red-500/10",
      icon: <FailedIcon className="size-4" />,
      label: "Connection Failed",
    },
  }

  const config = statusConfig[state]

  return (
    <div className={`flex items-center justify-between rounded-lg px-3 py-2 ${config.bgColor}`}>
      <div className="flex items-center gap-2">
        <div className={config.color}>{config.icon}</div>
        <span className={`text-sm font-medium ${config.color}`}>{config.label}</span>

        {state === "connected" && (
          <motion.div
            className="size-2 rounded-full bg-emerald-500"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </div>

      <div className="flex items-center gap-4">
        {lastEventId && (
          <span className="text-xs text-muted-foreground">
            Event: {lastEventId.slice(0, 8)}...
          </span>
        )}

        <span className="text-xs text-muted-foreground">
          {formatBytes(bytesReceived)} received
        </span>

        {state === "failed" && onReconnect && (
          <button
            onClick={onReconnect}
            className="rounded-md bg-primary px-2 py-1 text-xs font-medium text-primary-foreground hover:bg-primary/90"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  )
}

// ============================================================================
// EVENT LOG
// ============================================================================

interface EventLogProps {
  events: StreamEvent[]
  maxHeight?: number
}

export function EventLog({ events, maxHeight = 300 }: EventLogProps) {
  const eventColors: Record<StreamEvent["type"], string> = {
    data: "text-emerald-500",
    reconnect: "text-amber-500",
    error: "text-red-500",
    heartbeat: "text-blue-500",
  }

  const eventIcons: Record<StreamEvent["type"], React.ReactNode> = {
    data: <DataIcon className="size-3" />,
    reconnect: <ReconnectIcon className="size-3" />,
    error: <ErrorIcon className="size-3" />,
    heartbeat: <HeartbeatIcon className="size-3" />,
  }

  if (events.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center text-center">
        <p className="text-sm text-muted-foreground">No events yet</p>
      </div>
    )
  }

  return (
    <div
      className="space-y-1 overflow-y-auto font-mono text-xs"
      style={{ maxHeight }}
    >
      <AnimatePresence mode="popLayout">
        {events.map((event) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-start gap-2 rounded-md bg-muted/50 px-2 py-1.5"
          >
            <span className={eventColors[event.type]}>{eventIcons[event.type]}</span>

            <span className="text-muted-foreground">
              {formatTime(event.timestamp)}
            </span>

            <span className={`font-semibold uppercase ${eventColors[event.type]}`}>
              {event.type}
            </span>

            {event.data && (
              <span className="flex-1 truncate text-foreground">{event.data}</span>
            )}

            {event.error && (
              <span className="flex-1 truncate text-red-500">{event.error}</span>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

// ============================================================================
// STREAM PROGRESS
// ============================================================================

interface StreamProgressProps {
  bytesReceived: number
  messagesReceived: number
  reconnectAttempts: number
  lastHeartbeat: Date | null
}

export function StreamProgress({
  bytesReceived,
  messagesReceived,
  reconnectAttempts,
  lastHeartbeat,
}: StreamProgressProps) {
  return (
    <div className="grid grid-cols-4 gap-4">
      <MetricCard
        label="Bytes Received"
        value={formatBytes(bytesReceived)}
        icon={<BytesIcon className="size-4" />}
      />
      <MetricCard
        label="Messages"
        value={messagesReceived.toString()}
        icon={<MessagesIcon className="size-4" />}
      />
      <MetricCard
        label="Reconnects"
        value={reconnectAttempts.toString()}
        icon={<ReconnectIcon className="size-4" />}
        highlight={reconnectAttempts > 0}
      />
      <MetricCard
        label="Last Heartbeat"
        value={lastHeartbeat ? formatTime(lastHeartbeat) : "—"}
        icon={<HeartbeatIcon className="size-4" />}
      />
    </div>
  )
}

function MetricCard({
  label,
  value,
  icon,
  highlight,
}: {
  label: string
  value: string
  icon: React.ReactNode
  highlight?: boolean
}) {
  return (
    <div
      className={`rounded-lg border p-3 ${
        highlight ? "border-amber-500/50 bg-amber-500/5" : "border-border/50 bg-card"
      }`}
    >
      <div className="flex items-center gap-2 text-muted-foreground">{icon}</div>
      <p className="mt-2 text-lg font-semibold">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  )
}

// ============================================================================
// UTILITIES
// ============================================================================

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B"
  const k = 1024
  const sizes = ["B", "KB", "MB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    fractionalSecondDigits: 3,
  })
}

// ============================================================================
// ICONS
// ============================================================================

function ConnectedIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  )
}

function DisconnectedIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  )
}

function SpinnerIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
    </svg>
  )
}

function FailedIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
    </svg>
  )
}

function DataIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
  )
}

function ReconnectIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3" />
    </svg>
  )
}

function ErrorIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
    </svg>
  )
}

function HeartbeatIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
    </svg>
  )
}

function BytesIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
    </svg>
  )
}

function MessagesIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
    </svg>
  )
}
