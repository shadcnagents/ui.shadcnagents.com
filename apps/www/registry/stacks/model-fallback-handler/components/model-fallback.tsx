"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "motion/react"

// ============================================================================
// TYPES
// ============================================================================

export interface Provider {
  id: string
  name: string
  model: string
  priority: number
  color: string
  icon: React.ReactNode
}

export type ProviderStatus = "healthy" | "degraded" | "down" | "unknown"

export interface ProviderHealth {
  status: ProviderStatus
  latency?: number
  lastCheck: Date
  errorCount: number
  lastError?: string
}

export interface FallbackEvent {
  id: string
  timestamp: Date
  fromProvider: string
  toProvider: string
  reason: string
  errorCode?: number
}

export interface FallbackState {
  activeProvider: Provider
  providerHealth: Map<string, ProviderHealth>
  fallbackHistory: FallbackEvent[]
  isProcessing: boolean
}

// ============================================================================
// DEFAULT PROVIDERS
// ============================================================================

export const DEFAULT_PROVIDERS: Provider[] = [
  {
    id: "openai",
    name: "OpenAI",
    model: "gpt-4o",
    priority: 1,
    color: "#10a37f",
    icon: <OpenAIIcon />,
  },
  {
    id: "anthropic",
    name: "Anthropic",
    model: "claude-sonnet-4-20250514",
    priority: 2,
    color: "#d4a574",
    icon: <AnthropicIcon />,
  },
  {
    id: "google",
    name: "Google",
    model: "gemini-2.0-flash",
    priority: 3,
    color: "#4285f4",
    icon: <GoogleIcon />,
  },
]

// ============================================================================
// HOOK: useModelFallback
// ============================================================================

interface UseModelFallbackOptions {
  providers?: Provider[]
  maxRetriesPerProvider?: number
  onFallback?: (event: FallbackEvent) => void
  onAllProvidersFailed?: () => void
}

interface SendMessageOptions {
  messages: Array<{ role: string; content: string }>
  onChunk?: (chunk: string) => void
  onComplete?: (response: string, provider: Provider) => void
  onError?: (error: Error, provider: Provider) => void
}

export function useModelFallback(options: UseModelFallbackOptions = {}) {
  const {
    providers = DEFAULT_PROVIDERS,
    maxRetriesPerProvider = 2,
    onFallback,
    onAllProvidersFailed,
  } = options

  const sortedProviders = [...providers].sort((a, b) => a.priority - b.priority)

  const [state, setState] = useState<FallbackState>({
    activeProvider: sortedProviders[0],
    providerHealth: new Map(
      providers.map((p) => [
        p.id,
        {
          status: "unknown" as ProviderStatus,
          lastCheck: new Date(),
          errorCount: 0,
        },
      ])
    ),
    fallbackHistory: [],
    isProcessing: false,
  })

  const retryCountRef = useRef<Map<string, number>>(new Map())
  const abortControllerRef = useRef<AbortController | null>(null)

  // Update provider health
  const updateHealth = useCallback(
    (providerId: string, update: Partial<ProviderHealth>) => {
      setState((prev) => {
        const newHealth = new Map(prev.providerHealth)
        const current = newHealth.get(providerId) || {
          status: "unknown" as ProviderStatus,
          lastCheck: new Date(),
          errorCount: 0,
        }
        newHealth.set(providerId, {
          ...current,
          ...update,
          lastCheck: new Date(),
        })
        return { ...prev, providerHealth: newHealth }
      })
    },
    []
  )

  // Record fallback event
  const recordFallback = useCallback(
    (from: Provider, to: Provider, reason: string, errorCode?: number) => {
      const event: FallbackEvent = {
        id: crypto.randomUUID(),
        timestamp: new Date(),
        fromProvider: from.id,
        toProvider: to.id,
        reason,
        errorCode,
      }

      setState((prev) => ({
        ...prev,
        fallbackHistory: [event, ...prev.fallbackHistory].slice(0, 50),
        activeProvider: to,
      }))

      onFallback?.(event)
    },
    [onFallback]
  )

  // Get next available provider
  const getNextProvider = useCallback(
    (currentId: string): Provider | null => {
      const currentIndex = sortedProviders.findIndex((p) => p.id === currentId)
      for (let i = currentIndex + 1; i < sortedProviders.length; i++) {
        const health = state.providerHealth.get(sortedProviders[i].id)
        if (health?.status !== "down") {
          return sortedProviders[i]
        }
      }
      // Wrap around to try providers before current
      for (let i = 0; i < currentIndex; i++) {
        const health = state.providerHealth.get(sortedProviders[i].id)
        if (health?.status !== "down") {
          return sortedProviders[i]
        }
      }
      return null
    },
    [sortedProviders, state.providerHealth]
  )

  // Send message with automatic fallback
  const sendMessage = useCallback(
    async (opts: SendMessageOptions) => {
      const { messages, onChunk, onComplete, onError } = opts

      setState((prev) => ({ ...prev, isProcessing: true }))
      abortControllerRef.current = new AbortController()

      let currentProvider = state.activeProvider
      let fullResponse = ""

      const tryProvider = async (provider: Provider): Promise<boolean> => {
        const retryCount = retryCountRef.current.get(provider.id) || 0

        if (retryCount >= maxRetriesPerProvider) {
          updateHealth(provider.id, { status: "down", errorCount: retryCount })
          return false
        }

        try {
          const startTime = Date.now()

          const response = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              messages,
              provider: provider.id,
              model: provider.model,
            }),
            signal: abortControllerRef.current?.signal,
          })

          const latency = Date.now() - startTime

          if (!response.ok) {
            const errorCode = response.status
            retryCountRef.current.set(provider.id, retryCount + 1)

            // Check for rate limit or server errors
            if ([429, 500, 502, 503, 504].includes(errorCode)) {
              updateHealth(provider.id, {
                status: errorCode === 429 ? "degraded" : "down",
                errorCount: retryCount + 1,
                lastError: `HTTP ${errorCode}`,
              })

              const nextProvider = getNextProvider(provider.id)
              if (nextProvider) {
                recordFallback(
                  provider,
                  nextProvider,
                  errorCode === 429 ? "Rate limited" : "Server error",
                  errorCode
                )
                return tryProvider(nextProvider)
              }
            }

            throw new Error(`HTTP ${errorCode}`)
          }

          // Success - reset retry count and update health
          retryCountRef.current.set(provider.id, 0)
          updateHealth(provider.id, {
            status: "healthy",
            latency,
            errorCount: 0,
          })

          // Stream the response
          const reader = response.body?.getReader()
          const decoder = new TextDecoder()

          if (reader) {
            while (true) {
              const { done, value } = await reader.read()
              if (done) break

              const chunk = decoder.decode(value)
              fullResponse += chunk
              onChunk?.(chunk)
            }
          }

          currentProvider = provider
          return true
        } catch (error) {
          if ((error as Error).name === "AbortError") {
            return true // Aborted, don't retry
          }

          retryCountRef.current.set(provider.id, retryCount + 1)
          updateHealth(provider.id, {
            status: "degraded",
            errorCount: retryCount + 1,
            lastError: (error as Error).message,
          })

          onError?.(error as Error, provider)

          // Try next provider
          const nextProvider = getNextProvider(provider.id)
          if (nextProvider) {
            recordFallback(provider, nextProvider, (error as Error).message)
            return tryProvider(nextProvider)
          }

          return false
        }
      }

      const success = await tryProvider(currentProvider)

      setState((prev) => ({ ...prev, isProcessing: false }))

      if (success) {
        onComplete?.(fullResponse, currentProvider)
      } else {
        onAllProvidersFailed?.()
      }

      return { success, response: fullResponse, provider: currentProvider }
    },
    [
      state.activeProvider,
      maxRetriesPerProvider,
      updateHealth,
      getNextProvider,
      recordFallback,
      onAllProvidersFailed,
    ]
  )

  // Manual provider switch
  const switchProvider = useCallback(
    (providerId: string) => {
      const provider = sortedProviders.find((p) => p.id === providerId)
      if (provider) {
        setState((prev) => ({ ...prev, activeProvider: provider }))
      }
    },
    [sortedProviders]
  )

  // Health check all providers
  const checkHealth = useCallback(async () => {
    for (const provider of sortedProviders) {
      try {
        const startTime = Date.now()
        const response = await fetch("/api/chat/health", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ provider: provider.id }),
        })
        const latency = Date.now() - startTime

        updateHealth(provider.id, {
          status: response.ok ? "healthy" : "degraded",
          latency,
          errorCount: response.ok ? 0 : 1,
        })
      } catch {
        updateHealth(provider.id, {
          status: "unknown",
          errorCount: 1,
          lastError: "Health check failed",
        })
      }
    }
  }, [sortedProviders, updateHealth])

  // Stop processing
  const stop = useCallback(() => {
    abortControllerRef.current?.abort()
    setState((prev) => ({ ...prev, isProcessing: false }))
  }, [])

  // Reset all provider health
  const reset = useCallback(() => {
    retryCountRef.current.clear()
    setState((prev) => ({
      ...prev,
      activeProvider: sortedProviders[0],
      providerHealth: new Map(
        providers.map((p) => [
          p.id,
          {
            status: "unknown" as ProviderStatus,
            lastCheck: new Date(),
            errorCount: 0,
          },
        ])
      ),
      fallbackHistory: [],
    }))
  }, [sortedProviders, providers])

  return {
    ...state,
    providers: sortedProviders,
    sendMessage,
    switchProvider,
    checkHealth,
    stop,
    reset,
  }
}

// ============================================================================
// PROVIDER STATUS GRID
// ============================================================================

interface ProviderStatusGridProps {
  providers: Provider[]
  health: Map<string, ProviderHealth>
  activeProviderId: string
  onSelect?: (providerId: string) => void
}

export function ProviderStatusGrid({
  providers,
  health,
  activeProviderId,
  onSelect,
}: ProviderStatusGridProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {providers.map((provider) => {
        const providerHealth = health.get(provider.id)
        const isActive = provider.id === activeProviderId

        return (
          <motion.button
            key={provider.id}
            onClick={() => onSelect?.(provider.id)}
            className={`relative rounded-xl border p-4 text-left transition-all ${
              isActive
                ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                : "border-border/50 bg-card hover:border-border hover:bg-muted/50"
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Active indicator */}
            {isActive && (
              <motion.div
                layoutId="active-provider"
                className="absolute -top-px -right-px rounded-bl-lg rounded-tr-xl bg-primary px-2 py-0.5"
              >
                <span className="text-[10px] font-semibold text-primary-foreground">
                  ACTIVE
                </span>
              </motion.div>
            )}

            <div className="flex items-start gap-3">
              {/* Provider icon */}
              <div
                className="flex size-10 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${provider.color}15` }}
              >
                <div style={{ color: provider.color }}>{provider.icon}</div>
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">{provider.name}</span>
                  <StatusDot status={providerHealth?.status || "unknown"} />
                </div>
                <p className="truncate text-xs text-muted-foreground">
                  {provider.model}
                </p>
                {providerHealth?.latency && (
                  <p className="mt-1 text-[10px] text-muted-foreground/70">
                    {providerHealth.latency}ms latency
                  </p>
                )}
              </div>
            </div>

            {/* Error indicator */}
            {providerHealth?.errorCount > 0 && (
              <div className="mt-3 flex items-center gap-1.5 rounded-lg bg-destructive/10 px-2 py-1">
                <AlertIcon className="size-3 text-destructive" />
                <span className="text-[10px] font-medium text-destructive">
                  {providerHealth.errorCount} error
                  {providerHealth.errorCount > 1 ? "s" : ""}
                </span>
              </div>
            )}
          </motion.button>
        )
      })}
    </div>
  )
}

// ============================================================================
// FALLBACK TIMELINE
// ============================================================================

interface FallbackTimelineProps {
  events: FallbackEvent[]
  providers: Provider[]
}

export function FallbackTimeline({ events, providers }: FallbackTimelineProps) {
  const getProvider = (id: string) => providers.find((p) => p.id === id)

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="rounded-full bg-muted p-3">
          <CheckIcon className="size-5 text-muted-foreground" />
        </div>
        <p className="mt-2 text-sm text-muted-foreground">No fallbacks yet</p>
        <p className="text-xs text-muted-foreground/70">
          System is running on primary provider
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <AnimatePresence mode="popLayout">
        {events.slice(0, 10).map((event) => {
          const from = getProvider(event.fromProvider)
          const to = getProvider(event.toProvider)

          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex items-center gap-3 rounded-lg border border-border/50 bg-card p-3"
            >
              {/* From provider */}
              <div className="flex items-center gap-2">
                <div
                  className="flex size-7 items-center justify-center rounded-md"
                  style={{ backgroundColor: `${from?.color}15` }}
                >
                  <div className="scale-75" style={{ color: from?.color }}>
                    {from?.icon}
                  </div>
                </div>
                <span className="text-xs font-medium">{from?.name}</span>
              </div>

              {/* Arrow */}
              <div className="flex items-center gap-1">
                <div className="h-px w-4 bg-border" />
                <ArrowRightIcon className="size-3 text-muted-foreground" />
                <div className="h-px w-4 bg-border" />
              </div>

              {/* To provider */}
              <div className="flex items-center gap-2">
                <div
                  className="flex size-7 items-center justify-center rounded-md"
                  style={{ backgroundColor: `${to?.color}15` }}
                >
                  <div className="scale-75" style={{ color: to?.color }}>
                    {to?.icon}
                  </div>
                </div>
                <span className="text-xs font-medium">{to?.name}</span>
              </div>

              {/* Reason */}
              <div className="ml-auto flex items-center gap-2">
                <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-600 dark:text-amber-400">
                  {event.reason}
                </span>
                <span className="text-[10px] text-muted-foreground/60">
                  {formatTime(event.timestamp)}
                </span>
              </div>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}

// ============================================================================
// ACTIVE PROVIDER BADGE
// ============================================================================

interface ActiveProviderBadgeProps {
  provider: Provider
  health?: ProviderHealth
  isProcessing?: boolean
}

export function ActiveProviderBadge({
  provider,
  health,
  isProcessing,
}: ActiveProviderBadgeProps) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-card px-3 py-1.5">
      <div
        className="flex size-5 items-center justify-center rounded-md"
        style={{ backgroundColor: `${provider.color}15` }}
      >
        <div className="scale-75" style={{ color: provider.color }}>
          {provider.icon}
        </div>
      </div>

      <span className="text-xs font-medium">{provider.name}</span>

      <StatusDot status={health?.status || "unknown"} />

      {isProcessing && (
        <motion.div
          className="size-2 rounded-full bg-primary"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      )}
    </div>
  )
}

// ============================================================================
// STATUS DOT
// ============================================================================

function StatusDot({ status }: { status: ProviderStatus }) {
  const colors: Record<ProviderStatus, string> = {
    healthy: "bg-emerald-500",
    degraded: "bg-amber-500",
    down: "bg-red-500",
    unknown: "bg-zinc-400",
  }

  return (
    <span className="relative flex size-2">
      <span
        className={`absolute inline-flex size-full animate-ping rounded-full opacity-75 ${colors[status]}`}
        style={{ animationDuration: "2s" }}
      />
      <span
        className={`relative inline-flex size-2 rounded-full ${colors[status]}`}
      />
    </span>
  )
}

// ============================================================================
// HEALTH CHECK PANEL
// ============================================================================

interface HealthCheckPanelProps {
  providers: Provider[]
  health: Map<string, ProviderHealth>
  onCheckHealth: () => void
  isChecking?: boolean
}

export function HealthCheckPanel({
  providers,
  health,
  onCheckHealth,
  isChecking,
}: HealthCheckPanelProps) {
  const healthyCount = Array.from(health.values()).filter(
    (h) => h.status === "healthy"
  ).length

  return (
    <div className="rounded-xl border border-border/50 bg-card p-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold">System Health</h3>
          <p className="text-xs text-muted-foreground">
            {healthyCount}/{providers.length} providers healthy
          </p>
        </div>

        <button
          onClick={onCheckHealth}
          disabled={isChecking}
          className="flex items-center gap-1.5 rounded-lg bg-muted px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted/80 disabled:opacity-50"
        >
          <RefreshIcon
            className={`size-3.5 ${isChecking ? "animate-spin" : ""}`}
          />
          Check All
        </button>
      </div>

      {/* Health bar */}
      <div className="mt-3 flex h-2 gap-1 overflow-hidden rounded-full">
        {providers.map((provider) => {
          const h = health.get(provider.id)
          const colors: Record<ProviderStatus, string> = {
            healthy: "bg-emerald-500",
            degraded: "bg-amber-500",
            down: "bg-red-500",
            unknown: "bg-zinc-300 dark:bg-zinc-600",
          }

          return (
            <motion.div
              key={provider.id}
              className={`flex-1 ${colors[h?.status || "unknown"]}`}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: providers.indexOf(provider) * 0.1 }}
            />
          )
        })}
      </div>

      {/* Legend */}
      <div className="mt-3 flex flex-wrap gap-3">
        {providers.map((provider) => {
          const h = health.get(provider.id)
          return (
            <div key={provider.id} className="flex items-center gap-1.5">
              <StatusDot status={h?.status || "unknown"} />
              <span className="text-[10px] text-muted-foreground">
                {provider.name}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ============================================================================
// UTILITIES
// ============================================================================

function formatTime(date: Date): string {
  return date.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })
}

// ============================================================================
// ICONS
// ============================================================================

function OpenAIIcon() {
  return (
    <svg className="size-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z" />
    </svg>
  )
}

function AnthropicIcon() {
  return (
    <svg className="size-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M13.827 3.52h3.603L24 20.48h-3.603l-6.57-16.96zm-7.258 0h3.767L16.906 20.48h-3.674l-1.343-3.461H5.017l-1.344 3.46H0L6.57 3.522zm4.132 10.501L8.453 7.687l-2.248 6.334h4.496z" />
    </svg>
  )
}

function GoogleIcon() {
  return (
    <svg className="size-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
    </svg>
  )
}

function AlertIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
      />
    </svg>
  )
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m4.5 12.75 6 6 9-13.5"
      />
    </svg>
  )
}

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
      />
    </svg>
  )
}

function RefreshIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
      />
    </svg>
  )
}
