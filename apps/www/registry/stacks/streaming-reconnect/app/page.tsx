"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import {
  useStreamingReconnect,
  ConnectionStatusBar,
  EventLog,
  StreamProgress,
} from "../components/streaming-reconnect"

export default function StreamingReconnectDemo() {
  const [messages, setMessages] = useState<
    Array<{ id: string; role: "user" | "assistant"; content: string }>
  >([])
  const [input, setInput] = useState("")
  const [showEventLog, setShowEventLog] = useState(true)
  const [simulateDisconnect, setSimulateDisconnect] = useState(false)
  const [disconnectAfter, setDisconnectAfter] = useState(50) // bytes
  const bottomRef = useRef<HTMLDivElement>(null)

  const {
    connectionState,
    lastEventId,
    reconnectAttempts,
    events,
    bytesReceived,
    messagesReceived,
    lastHeartbeat,
    partialContent,
    connect,
    disconnect,
    reset,
  } = useStreamingReconnect({
    maxRetries: 5,
    baseDelay: 1000,
    maxDelay: 10000,
    onReconnect: (attempt) => {
      console.log(`Reconnected on attempt ${attempt + 1}`)
    },
    onMaxRetriesReached: () => {
      console.log("Max retries reached")
    },
    onConnectionChange: (state) => {
      console.log("Connection state:", state)
    },
  })

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || connectionState === "connecting") return

    const userMessage = {
      id: crypto.randomUUID(),
      role: "user" as const,
      content: input.trim(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")

    const assistantId = crypto.randomUUID()
    setMessages((prev) => [
      ...prev,
      { id: assistantId, role: "assistant", content: "" },
    ])

    // Build message body with simulation flags
    const body = {
      messages: [...messages, userMessage].map((m) => ({
        role: m.role,
        content: m.content,
      })),
      simulateDisconnect,
      disconnectAfter,
    }

    await connect(
      body.messages,
      (chunk) => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, content: m.content + chunk } : m
          )
        )
      },
      (fullContent) => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, content: fullContent } : m
          )
        )
      }
    )
  }

  const handleDisconnect = () => {
    disconnect()
  }

  const handleReset = () => {
    reset()
    setMessages([])
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar - Event Log */}
      <AnimatePresence>
        {showEventLog && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 380, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="shrink-0 border-r border-border/50 overflow-hidden"
          >
            <div className="flex h-full flex-col">
              {/* Header */}
              <div className="shrink-0 border-b border-border/50 p-4">
                <h2 className="text-sm font-semibold">Stream Events</h2>
                <p className="text-xs text-muted-foreground">
                  Real-time connection events
                </p>
              </div>

              {/* Metrics */}
              <div className="shrink-0 border-b border-border/50 p-4">
                <StreamProgress
                  bytesReceived={bytesReceived}
                  messagesReceived={messagesReceived}
                  reconnectAttempts={reconnectAttempts}
                  lastHeartbeat={lastHeartbeat}
                />
              </div>

              {/* Event log */}
              <div className="flex-1 overflow-hidden p-4">
                <EventLog events={events} maxHeight={400} />
              </div>

              {/* Controls */}
              <div className="shrink-0 border-t border-border/50 p-4 space-y-3">
                <button
                  onClick={handleReset}
                  className="w-full rounded-lg bg-muted px-4 py-2 text-sm font-medium transition-colors hover:bg-muted/80"
                >
                  Reset Connection
                </button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Header */}
        <header className="shrink-0 border-b border-border/50 bg-background/80 backdrop-blur-sm">
          <div className="flex h-14 items-center justify-between px-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowEventLog(!showEventLog)}
                className="rounded-lg p-2 hover:bg-muted transition-colors"
              >
                <SidebarIcon className="size-5 text-muted-foreground" />
              </button>
              <div>
                <h1 className="text-sm font-semibold">Streaming Reconnect Handler</h1>
                <p className="text-xs text-muted-foreground">
                  Auto-recovery for dropped SSE connections
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {connectionState === "connected" && (
                <button
                  onClick={handleDisconnect}
                  className="rounded-lg bg-destructive/10 px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/20"
                >
                  Force Disconnect
                </button>
              )}
            </div>
          </div>

          {/* Connection status */}
          <div className="px-4 pb-3">
            <ConnectionStatusBar
              state={connectionState}
              reconnectAttempts={reconnectAttempts}
              maxRetries={5}
              lastEventId={lastEventId}
              bytesReceived={bytesReceived}
              onReconnect={() => {
                // Retry last message
                if (messages.length > 0) {
                  const lastUserMessage = [...messages]
                    .reverse()
                    .find((m) => m.role === "user")
                  if (lastUserMessage) {
                    connect(
                      messages.map((m) => ({ role: m.role, content: m.content })),
                      () => {},
                      () => {}
                    )
                  }
                }
              }}
            />
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <div className="flex h-full flex-col">
            {/* Simulation controls */}
            <div className="shrink-0 border-b border-border/50 bg-muted/30 px-4 py-3">
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={simulateDisconnect}
                    onChange={(e) => setSimulateDisconnect(e.target.checked)}
                    className="rounded border-border"
                  />
                  <span className="text-xs font-medium">Simulate Disconnect</span>
                </label>

                {simulateDisconnect && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">After</span>
                    <input
                      type="number"
                      value={disconnectAfter}
                      onChange={(e) => setDisconnectAfter(Number(e.target.value))}
                      className="w-20 rounded-md border border-border bg-background px-2 py-1 text-xs"
                      min={10}
                      max={500}
                    />
                    <span className="text-xs text-muted-foreground">bytes</span>
                  </div>
                )}

                <span className="text-xs text-muted-foreground">
                  Test automatic reconnection with message recovery
                </span>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4">
              {messages.length === 0 ? (
                <EmptyState />
              ) : (
                <div className="mx-auto max-w-3xl space-y-4">
                  <AnimatePresence mode="popLayout">
                    {messages.map((m) => (
                      <motion.div
                        key={m.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${
                          m.role === "user" ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                            m.role === "user"
                              ? "rounded-br-sm bg-primary text-primary-foreground"
                              : "rounded-bl-sm bg-muted"
                          }`}
                        >
                          {m.content || (
                            <span className="flex items-center gap-2">
                              <LoadingDots />
                              <span className="text-xs text-muted-foreground">
                                Streaming...
                              </span>
                            </span>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* Partial content recovery indicator */}
                  {partialContent &&
                    connectionState === "reconnecting" &&
                    messages[messages.length - 1]?.content === "" && (
                      <div className="flex justify-start">
                        <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 px-3 py-2">
                          <div className="flex items-center gap-2">
                            <RecoveryIcon className="size-4 text-amber-500" />
                            <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
                              Recovering {partialContent.length} bytes...
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                  <div ref={bottomRef} />
                </div>
              )}
            </div>

            {/* Input */}
            <div className="shrink-0 border-t border-border/50 p-4">
              <form
                onSubmit={handleSubmit}
                className="mx-auto flex max-w-3xl gap-2"
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Send a message to test streaming..."
                  disabled={connectionState === "connecting" || connectionState === "reconnecting"}
                  className="flex-1 rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none placeholder:text-muted-foreground/50 focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={
                    connectionState === "connecting" ||
                    connectionState === "reconnecting" ||
                    !input.trim()
                  }
                  className="rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

function EmptyState() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
      <div className="rounded-full bg-muted p-4">
        <StreamIcon className="size-8 text-muted-foreground" />
      </div>
      <div>
        <p className="text-sm font-medium">Resilient Streaming</p>
        <p className="mt-1 text-xs text-muted-foreground max-w-sm">
          Send a message to test streaming. Enable &quot;Simulate Disconnect&quot;
          to see automatic reconnection with message recovery.
        </p>
      </div>

      <div className="mt-4 grid gap-2 text-left">
        <FeatureItem text="Automatic reconnection with exponential backoff" />
        <FeatureItem text="Last-Event-ID tracking for stream resumption" />
        <FeatureItem text="Partial message recovery on reconnect" />
        <FeatureItem text="Real-time connection state monitoring" />
      </div>
    </div>
  )
}

function FeatureItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex size-5 items-center justify-center rounded-full bg-emerald-500/10">
        <CheckIcon className="size-3 text-emerald-500" />
      </div>
      <span className="text-xs text-muted-foreground">{text}</span>
    </div>
  )
}

function LoadingDots() {
  return (
    <div className="flex gap-1">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="size-1.5 rounded-full bg-muted-foreground/40"
          animate={{ y: [0, -4, 0] }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.1,
          }}
        />
      ))}
    </div>
  )
}

// ============================================================================
// ICONS
// ============================================================================

function SidebarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
    </svg>
  )
}

function StreamIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5m.75-9 3-3 2.148 2.148A12.061 12.061 0 0 1 16.5 7.605" />
    </svg>
  )
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
  )
}

function RecoveryIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3" />
    </svg>
  )
}
