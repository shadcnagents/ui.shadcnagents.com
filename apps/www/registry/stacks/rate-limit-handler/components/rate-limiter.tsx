"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"

// ============================================================================
// TYPES
// ============================================================================

export type RateLimitState = "healthy" | "warning" | "limited" | "circuit-open"

export interface RateLimitConfig {
  maxRetries?: number
  baseDelay?: number
  maxDelay?: number
  jitterFactor?: number
  circuitBreakerThreshold?: number
  circuitBreakerResetTime?: number
}

export interface RetryQueueItem {
  id: string
  attempt: number
  maxAttempts: number
  nextRetryAt: number
  status: "waiting" | "retrying" | "success" | "failed"
}

export interface RateLimitMetrics {
  requestsThisMinute: number
  tokensThisMinute: number
  remainingRequests: number | null
  remainingTokens: number | null
  resetAt: number | null
  consecutiveErrors: number
  lastError: string | null
}

// ============================================================================
// RATE LIMITER HOOK
// ============================================================================

const DEFAULT_CONFIG: Required<RateLimitConfig> = {
  maxRetries: 5,
  baseDelay: 1000,
  maxDelay: 60000,
  jitterFactor: 0.3,
  circuitBreakerThreshold: 5,
  circuitBreakerResetTime: 30000,
}

function calculateBackoff(attempt: number, config: Required<RateLimitConfig>): number {
  const exponentialDelay = Math.min(
    config.baseDelay * Math.pow(2, attempt),
    config.maxDelay
  )
  const jitter = exponentialDelay * config.jitterFactor * (Math.random() * 2 - 1)
  return Math.max(0, exponentialDelay + jitter)
}

export function useRateLimiter(userConfig?: RateLimitConfig) {
  const config = { ...DEFAULT_CONFIG, ...userConfig }

  const [state, setState] = useState<RateLimitState>("healthy")
  const [metrics, setMetrics] = useState<RateLimitMetrics>({
    requestsThisMinute: 0,
    tokensThisMinute: 0,
    remainingRequests: null,
    remainingTokens: null,
    resetAt: null,
    consecutiveErrors: 0,
    lastError: null,
  })
  const [retryQueue, setRetryQueue] = useState<RetryQueueItem[]>([])

  const circuitOpenUntil = useRef<number>(0)

  // Update state based on metrics
  useEffect(() => {
    if (Date.now() < circuitOpenUntil.current) {
      setState("circuit-open")
    } else if (metrics.consecutiveErrors >= config.circuitBreakerThreshold) {
      circuitOpenUntil.current = Date.now() + config.circuitBreakerResetTime
      setState("circuit-open")
    } else if (metrics.remainingRequests !== null && metrics.remainingRequests < 10) {
      setState("limited")
    } else if (metrics.remainingRequests !== null && metrics.remainingRequests < 50) {
      setState("warning")
    } else {
      setState("healthy")
    }
  }, [metrics, config.circuitBreakerThreshold, config.circuitBreakerResetTime])

  const updateFromHeaders = useCallback((headers: Headers) => {
    const remaining = headers.get("x-ratelimit-remaining-requests")
    const remainingTokens = headers.get("x-ratelimit-remaining-tokens")
    const reset = headers.get("x-ratelimit-reset-requests")

    setMetrics(prev => ({
      ...prev,
      remainingRequests: remaining ? parseInt(remaining) : prev.remainingRequests,
      remainingTokens: remainingTokens ? parseInt(remainingTokens) : prev.remainingTokens,
      resetAt: reset ? Date.now() + parseResetTime(reset) : prev.resetAt,
      consecutiveErrors: 0,
      lastError: null,
    }))
  }, [])

  const recordError = useCallback((error: string, statusCode?: number) => {
    setMetrics(prev => ({
      ...prev,
      consecutiveErrors: prev.consecutiveErrors + 1,
      lastError: error,
    }))
  }, [])

  const addToRetryQueue = useCallback((id: string): RetryQueueItem => {
    const item: RetryQueueItem = {
      id,
      attempt: 1,
      maxAttempts: config.maxRetries,
      nextRetryAt: Date.now() + calculateBackoff(0, config),
      status: "waiting",
    }
    setRetryQueue(prev => [...prev, item])
    return item
  }, [config])

  const updateRetryItem = useCallback((id: string, updates: Partial<RetryQueueItem>) => {
    setRetryQueue(prev =>
      prev.map(item => item.id === id ? { ...item, ...updates } : item)
    )
  }, [])

  const removeFromQueue = useCallback((id: string) => {
    setRetryQueue(prev => prev.filter(item => item.id !== id))
  }, [])

  const executeWithRetry = useCallback(async <T,>(
    fn: () => Promise<T>,
    requestId?: string
  ): Promise<T> => {
    const id = requestId || crypto.randomUUID()
    let attempt = 0

    while (attempt < config.maxRetries) {
      // Check circuit breaker
      if (Date.now() < circuitOpenUntil.current) {
        const waitTime = circuitOpenUntil.current - Date.now()
        await new Promise(resolve => setTimeout(resolve, waitTime))
      }

      try {
        if (attempt > 0) {
          updateRetryItem(id, { status: "retrying", attempt: attempt + 1 })
        }

        const result = await fn()

        if (attempt > 0) {
          updateRetryItem(id, { status: "success" })
          setTimeout(() => removeFromQueue(id), 2000)
        }

        setMetrics(prev => ({
          ...prev,
          requestsThisMinute: prev.requestsThisMinute + 1,
          consecutiveErrors: 0,
        }))

        return result
      } catch (error: any) {
        attempt++

        const is429 = error?.status === 429 || error?.message?.includes("429")

        if (is429 && attempt < config.maxRetries) {
          const delay = calculateBackoff(attempt - 1, config)

          if (attempt === 1) {
            addToRetryQueue(id)
          }

          updateRetryItem(id, {
            nextRetryAt: Date.now() + delay,
            attempt,
          })

          recordError(`Rate limited (attempt ${attempt}/${config.maxRetries})`, 429)
          await new Promise(resolve => setTimeout(resolve, delay))
        } else {
          if (attempt > 0) {
            updateRetryItem(id, { status: "failed" })
            setTimeout(() => removeFromQueue(id), 3000)
          }
          recordError(error?.message || "Unknown error", error?.status)
          throw error
        }
      }
    }

    throw new Error("Max retries exceeded")
  }, [config, addToRetryQueue, updateRetryItem, removeFromQueue, recordError])

  const reset = useCallback(() => {
    setMetrics({
      requestsThisMinute: 0,
      tokensThisMinute: 0,
      remainingRequests: null,
      remainingTokens: null,
      resetAt: null,
      consecutiveErrors: 0,
      lastError: null,
    })
    setRetryQueue([])
    circuitOpenUntil.current = 0
    setState("healthy")
  }, [])

  return {
    state,
    metrics,
    retryQueue,
    executeWithRetry,
    updateFromHeaders,
    recordError,
    reset,
  }
}

function parseResetTime(reset: string): number {
  // Handle formats like "1s", "30s", "1m", or milliseconds
  if (reset.endsWith("ms")) return parseInt(reset)
  if (reset.endsWith("s")) return parseInt(reset) * 1000
  if (reset.endsWith("m")) return parseInt(reset) * 60000
  return parseInt(reset)
}

// ============================================================================
// STATUS INDICATOR COMPONENT
// ============================================================================

const stateConfig = {
  healthy: {
    color: "bg-emerald-500",
    glow: "shadow-emerald-500/50",
    label: "Healthy",
    description: "All systems operational",
  },
  warning: {
    color: "bg-amber-500",
    glow: "shadow-amber-500/50",
    label: "Warning",
    description: "Approaching rate limit",
  },
  limited: {
    color: "bg-red-500",
    glow: "shadow-red-500/50",
    label: "Limited",
    description: "Rate limit active",
  },
  "circuit-open": {
    color: "bg-purple-500",
    glow: "shadow-purple-500/50",
    label: "Circuit Open",
    description: "Requests paused",
  },
}

export function RateLimitStatus({
  state,
  metrics,
  compact = false,
}: {
  state: RateLimitState
  metrics: RateLimitMetrics
  compact?: boolean
}) {
  const config = stateConfig[state]

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <motion.div
          className={`size-2 rounded-full ${config.color} shadow-lg ${config.glow}`}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <span className="text-xs font-medium text-muted-foreground">
          {config.label}
        </span>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-border/50 bg-card p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <motion.div
            className={`size-3 rounded-full ${config.color} shadow-lg ${config.glow}`}
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          <div>
            <p className="text-sm font-semibold">{config.label}</p>
            <p className="text-xs text-muted-foreground">{config.description}</p>
          </div>
        </div>

        {metrics.remainingRequests !== null && (
          <div className="text-right">
            <p className="text-2xl font-bold tabular-nums">
              {metrics.remainingRequests}
            </p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
              requests left
            </p>
          </div>
        )}
      </div>

      {/* Progress bar */}
      {metrics.remainingRequests !== null && (
        <div className="mt-4">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <motion.div
              className={`h-full ${config.color}`}
              initial={{ width: "100%" }}
              animate={{
                width: `${Math.min(100, (metrics.remainingRequests / 100) * 100)}%`
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>
      )}

      {/* Error display */}
      <AnimatePresence>
        {metrics.lastError && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 overflow-hidden"
          >
            <div className="rounded-lg bg-destructive/10 px-3 py-2">
              <p className="text-xs text-destructive">{metrics.lastError}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ============================================================================
// RETRY QUEUE VISUALIZATION
// ============================================================================

export function RetryQueue({ items }: { items: RetryQueueItem[] }) {
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 100)
    return () => clearInterval(interval)
  }, [])

  if (items.length === 0) return null

  return (
    <div className="rounded-xl border border-border/50 bg-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold">Retry Queue</h3>
        <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
          {items.length} pending
        </span>
      </div>

      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {items.map((item) => {
            const timeUntilRetry = Math.max(0, item.nextRetryAt - now)
            const progress = item.status === "waiting"
              ? Math.min(100, ((now - (item.nextRetryAt - 5000)) / 5000) * 100)
              : 100

            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="relative overflow-hidden rounded-lg border border-border/30 bg-muted/30"
              >
                {/* Progress background */}
                <motion.div
                  className={`absolute inset-y-0 left-0 ${
                    item.status === "success"
                      ? "bg-emerald-500/20"
                      : item.status === "failed"
                      ? "bg-destructive/20"
                      : "bg-primary/10"
                  }`}
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.1 }}
                />

                <div className="relative flex items-center justify-between px-3 py-2">
                  <div className="flex items-center gap-2">
                    {item.status === "waiting" && (
                      <div className="size-1.5 animate-pulse rounded-full bg-amber-500" />
                    )}
                    {item.status === "retrying" && (
                      <motion.div
                        className="size-1.5 rounded-full bg-blue-500"
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                      />
                    )}
                    {item.status === "success" && (
                      <div className="size-1.5 rounded-full bg-emerald-500" />
                    )}
                    {item.status === "failed" && (
                      <div className="size-1.5 rounded-full bg-destructive" />
                    )}

                    <span className="font-mono text-xs text-muted-foreground">
                      {item.id.slice(0, 8)}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">
                      Attempt {item.attempt}/{item.maxAttempts}
                    </span>

                    {item.status === "waiting" && timeUntilRetry > 0 && (
                      <span className="font-mono text-xs font-medium tabular-nums">
                        {(timeUntilRetry / 1000).toFixed(1)}s
                      </span>
                    )}

                    {item.status === "retrying" && (
                      <span className="text-xs font-medium text-blue-500">
                        Retrying...
                      </span>
                    )}

                    {item.status === "success" && (
                      <span className="text-xs font-medium text-emerald-500">
                        Success
                      </span>
                    )}

                    {item.status === "failed" && (
                      <span className="text-xs font-medium text-destructive">
                        Failed
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}

// ============================================================================
// METRICS PANEL
// ============================================================================

export function RateLimitMetricsPanel({ metrics }: { metrics: RateLimitMetrics }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <MetricCard
        label="Requests/min"
        value={metrics.requestsThisMinute}
        maxValue={100}
      />
      <MetricCard
        label="Tokens/min"
        value={metrics.tokensThisMinute}
        maxValue={100000}
        format="compact"
      />
      <MetricCard
        label="Errors"
        value={metrics.consecutiveErrors}
        maxValue={5}
        variant={metrics.consecutiveErrors > 0 ? "danger" : "default"}
      />
      <MetricCard
        label="Reset in"
        value={metrics.resetAt ? Math.max(0, Math.floor((metrics.resetAt - Date.now()) / 1000)) : null}
        suffix="s"
        variant="muted"
      />
    </div>
  )
}

function MetricCard({
  label,
  value,
  maxValue,
  suffix,
  format,
  variant = "default",
}: {
  label: string
  value: number | null
  maxValue?: number
  suffix?: string
  format?: "compact"
  variant?: "default" | "danger" | "muted"
}) {
  const displayValue = value === null
    ? "—"
    : format === "compact"
    ? Intl.NumberFormat("en", { notation: "compact" }).format(value)
    : value.toLocaleString()

  return (
    <div className="rounded-lg border border-border/30 bg-muted/20 p-3">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className={`mt-1 text-xl font-bold tabular-nums ${
        variant === "danger" && value && value > 0
          ? "text-destructive"
          : variant === "muted"
          ? "text-muted-foreground"
          : ""
      }`}>
        {displayValue}
        {suffix && <span className="text-sm font-normal">{suffix}</span>}
      </p>
      {maxValue && value !== null && (
        <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-muted">
          <div
            className={`h-full transition-all ${
              variant === "danger" ? "bg-destructive" : "bg-primary"
            }`}
            style={{ width: `${Math.min(100, (value / maxValue) * 100)}%` }}
          />
        </div>
      )}
    </div>
  )
}
