"use client"

import { useState, useCallback, useRef, useMemo } from "react"
import { motion, AnimatePresence } from "motion/react"

// ============================================================================
// TYPES
// ============================================================================

export interface DedupedRequest {
  id: string
  key: string
  url: string
  method: string
  status: "pending" | "completed" | "cached" | "error"
  response?: unknown
  error?: Error
  timestamp: Date
  completedAt?: Date
  cachedFrom?: string // ID of original request if this was deduplicated
  duplicateCount: number
}

export interface DeduplicatorStats {
  totalRequests: number
  cachedResponses: number
  pendingRequests: number
  errorCount: number
  cacheHitRate: number
  avgResponseTime: number
}

export interface DeduplicatorConfig {
  timeWindow?: number // Dedup window in ms (default: 5000)
  maxCacheSize?: number // Max cached requests (default: 100)
  keyGenerator?: (url: string, options?: RequestInit) => string
}

// ============================================================================
// REQUEST DEDUPLICATOR STORE
// ============================================================================

class RequestDeduplicatorStore {
  private requests: Map<string, DedupedRequest> = new Map()
  private pendingPromises: Map<string, Promise<unknown>> = new Map()
  private timeWindow: number
  private maxCacheSize: number
  private keyGenerator: (url: string, options?: RequestInit) => string
  private responseTimes: number[] = []

  constructor(config: DeduplicatorConfig = {}) {
    this.timeWindow = config.timeWindow || 5000
    this.maxCacheSize = config.maxCacheSize || 100
    this.keyGenerator = config.keyGenerator || this.defaultKeyGenerator
  }

  private defaultKeyGenerator(url: string, options?: RequestInit): string {
    const method = options?.method || "GET"
    const body = options?.body ? String(options.body) : ""
    return `${method}:${url}:${body}`
  }

  // Execute a request with deduplication
  async execute<T>(
    url: string,
    options?: RequestInit,
    fetcher?: () => Promise<T>
  ): Promise<{ data: T; cached: boolean; request: DedupedRequest }> {
    const key = this.keyGenerator(url, options)
    const now = Date.now()

    // Check for cached response within time window
    const cached = this.findCachedRequest(key, now)
    if (cached && cached.status === "completed" && cached.response !== undefined) {
      // Update duplicate count
      cached.duplicateCount++

      // Create a record for this duplicate request
      const duplicateRequest: DedupedRequest = {
        id: crypto.randomUUID(),
        key,
        url,
        method: options?.method || "GET",
        status: "cached",
        response: cached.response,
        timestamp: new Date(),
        completedAt: new Date(),
        cachedFrom: cached.id,
        duplicateCount: 0,
      }
      this.addRequest(duplicateRequest)

      return { data: cached.response as T, cached: true, request: duplicateRequest }
    }

    // Check for pending request with same key
    const pendingPromise = this.pendingPromises.get(key)
    if (pendingPromise) {
      const existingRequest = Array.from(this.requests.values())
        .find(r => r.key === key && r.status === "pending")

      if (existingRequest) {
        existingRequest.duplicateCount++
      }

      const result = await pendingPromise
      const completedRequest = Array.from(this.requests.values())
        .find(r => r.key === key && r.status === "completed")

      const duplicateRequest: DedupedRequest = {
        id: crypto.randomUUID(),
        key,
        url,
        method: options?.method || "GET",
        status: "cached",
        response: result,
        timestamp: new Date(),
        completedAt: new Date(),
        cachedFrom: completedRequest?.id,
        duplicateCount: 0,
      }
      this.addRequest(duplicateRequest)

      return { data: result as T, cached: true, request: duplicateRequest }
    }

    // Create new request
    const request: DedupedRequest = {
      id: crypto.randomUUID(),
      key,
      url,
      method: options?.method || "GET",
      status: "pending",
      timestamp: new Date(),
      duplicateCount: 0,
    }
    this.addRequest(request)

    // Execute the request
    const startTime = Date.now()
    const promise = fetcher ? fetcher() : fetch(url, options).then(r => r.json())
    this.pendingPromises.set(key, promise)

    try {
      const result = await promise
      const endTime = Date.now()
      this.responseTimes.push(endTime - startTime)

      // Update request status
      request.status = "completed"
      request.response = result
      request.completedAt = new Date()

      return { data: result as T, cached: false, request }
    } catch (error) {
      request.status = "error"
      request.error = error as Error
      request.completedAt = new Date()
      throw error
    } finally {
      this.pendingPromises.delete(key)
    }
  }

  private findCachedRequest(key: string, now: number): DedupedRequest | undefined {
    return Array.from(this.requests.values())
      .filter(r => r.key === key && r.status === "completed")
      .find(r => now - r.timestamp.getTime() < this.timeWindow)
  }

  private addRequest(request: DedupedRequest): void {
    // Enforce max cache size
    if (this.requests.size >= this.maxCacheSize) {
      const oldest = Array.from(this.requests.values())
        .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())[0]
      if (oldest) {
        this.requests.delete(oldest.id)
      }
    }
    this.requests.set(request.id, request)
  }

  // Get all requests
  getAll(): DedupedRequest[] {
    return Array.from(this.requests.values())
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  }

  // Get requests by status
  getByStatus(status: DedupedRequest["status"]): DedupedRequest[] {
    return this.getAll().filter(r => r.status === status)
  }

  // Get statistics
  getStats(): DeduplicatorStats {
    const all = this.getAll()
    const cached = all.filter(r => r.status === "cached").length
    const pending = all.filter(r => r.status === "pending").length
    const errors = all.filter(r => r.status === "error").length
    const total = all.length

    return {
      totalRequests: total,
      cachedResponses: cached,
      pendingRequests: pending,
      errorCount: errors,
      cacheHitRate: total > 0 ? (cached / total) * 100 : 0,
      avgResponseTime: this.responseTimes.length > 0
        ? this.responseTimes.reduce((a, b) => a + b, 0) / this.responseTimes.length
        : 0,
    }
  }

  // Clear all
  clear(): void {
    this.requests.clear()
    this.pendingPromises.clear()
    this.responseTimes = []
  }

  // Clear old entries
  clearOld(maxAge: number = this.timeWindow * 2): void {
    const now = Date.now()
    for (const [id, request] of this.requests) {
      if (now - request.timestamp.getTime() > maxAge) {
        this.requests.delete(id)
      }
    }
  }

  // Get size
  size(): number {
    return this.requests.size
  }
}

// ============================================================================
// HOOK: useRequestDeduplicator
// ============================================================================

interface UseRequestDeduplicatorOptions extends DeduplicatorConfig {
  onRequestStart?: (request: DedupedRequest) => void
  onRequestComplete?: (request: DedupedRequest, cached: boolean) => void
  onRequestError?: (request: DedupedRequest, error: Error) => void
  onDuplicate?: (originalId: string, duplicateCount: number) => void
}

export function useRequestDeduplicator(options: UseRequestDeduplicatorOptions = {}) {
  const { onRequestStart, onRequestComplete, onRequestError, onDuplicate, ...config } = options

  const storeRef = useRef(new RequestDeduplicatorStore(config))
  const [version, setVersion] = useState(0)

  // Force re-render
  const refresh = useCallback(() => setVersion(v => v + 1), [])

  // Execute a deduplicated request
  const dedupFetch = useCallback(
    async <T,>(
      url: string,
      options?: RequestInit,
      fetcher?: () => Promise<T>
    ): Promise<T> => {
      const prevSize = storeRef.current.size()

      try {
        const { data, cached, request } = await storeRef.current.execute<T>(
          url,
          options,
          fetcher
        )

        if (!cached) {
          onRequestStart?.(request)
        }

        onRequestComplete?.(request, cached)

        if (cached && request.cachedFrom) {
          const original = storeRef.current.getAll().find(r => r.id === request.cachedFrom)
          if (original) {
            onDuplicate?.(original.id, original.duplicateCount)
          }
        }

        refresh()
        return data
      } catch (error) {
        const requests = storeRef.current.getAll()
        const failedRequest = requests.find(r => r.status === "error")
        if (failedRequest) {
          onRequestError?.(failedRequest, error as Error)
        }
        refresh()
        throw error
      }
    },
    [onRequestStart, onRequestComplete, onRequestError, onDuplicate, refresh]
  )

  // Get all requests
  const getRequests = useCallback((): DedupedRequest[] => {
    return storeRef.current.getAll()
  }, [])

  // Get stats
  const getStats = useCallback((): DeduplicatorStats => {
    return storeRef.current.getStats()
  }, [])

  // Clear all
  const clearAll = useCallback(() => {
    storeRef.current.clear()
    refresh()
  }, [refresh])

  // Clear old entries
  const clearOld = useCallback((maxAge?: number) => {
    storeRef.current.clearOld(maxAge)
    refresh()
  }, [refresh])

  return {
    dedupFetch,
    getRequests,
    getStats,
    clearAll,
    clearOld,
    requestCount: storeRef.current.size(),
  }
}

// ============================================================================
// STATUS BADGE
// ============================================================================

interface StatusBadgeProps {
  status: DedupedRequest["status"]
  size?: "sm" | "md"
}

export function StatusBadge({ status, size = "sm" }: StatusBadgeProps) {
  const config = {
    pending: {
      label: "Pending",
      color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30",
      icon: <LoadingIcon className="size-3 animate-spin" />,
    },
    completed: {
      label: "Completed",
      color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
      icon: <CheckIcon className="size-3" />,
    },
    cached: {
      label: "Cached",
      color: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30",
      icon: <CacheIcon className="size-3" />,
    },
    error: {
      label: "Error",
      color: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30",
      icon: <ErrorIcon className="size-3" />,
    },
  }

  const { label, color, icon } = config[status]
  const sizeClasses = size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-xs"

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border font-semibold ${color} ${sizeClasses}`}
    >
      {icon}
      {label}
    </span>
  )
}

// ============================================================================
// STATS PANEL
// ============================================================================

interface StatsPanelProps {
  stats: DeduplicatorStats
}

export function StatsPanel({ stats }: StatsPanelProps) {
  return (
    <div className="rounded-xl border border-border/50 bg-card p-4">
      <h3 className="text-sm font-semibold mb-4">Deduplication Statistics</h3>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatCard
          label="Total Requests"
          value={stats.totalRequests.toString()}
          icon={<RequestIcon className="size-4" />}
          color="blue"
        />
        <StatCard
          label="Cache Hits"
          value={stats.cachedResponses.toString()}
          icon={<CacheIcon className="size-4" />}
          color="purple"
        />
        <StatCard
          label="Hit Rate"
          value={`${stats.cacheHitRate.toFixed(1)}%`}
          icon={<ChartIcon className="size-4" />}
          color="emerald"
        />
      </div>

      {/* Progress bar for cache hit rate */}
      <div className="mt-4">
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          <span>Cache Efficiency</span>
          <span>{stats.cachedResponses} / {stats.totalRequests} requests cached</span>
        </div>
        <div className="flex h-2 overflow-hidden rounded-full bg-muted">
          <motion.div
            className="bg-gradient-to-r from-purple-500 to-emerald-500"
            initial={{ width: 0 }}
            animate={{ width: `${stats.cacheHitRate}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Additional stats */}
      <div className="mt-4 grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
        <div>
          <p className="text-lg font-bold">{stats.pendingRequests}</p>
          <p className="text-xs text-muted-foreground">Pending</p>
        </div>
        <div>
          <p className="text-lg font-bold">
            {stats.avgResponseTime > 0 ? `${stats.avgResponseTime.toFixed(0)}ms` : "-"}
          </p>
          <p className="text-xs text-muted-foreground">Avg Response Time</p>
        </div>
      </div>
    </div>
  )
}

function StatCard({
  label,
  value,
  icon,
  color,
}: {
  label: string
  value: string
  icon: React.ReactNode
  color: "blue" | "purple" | "emerald"
}) {
  const colorClasses = {
    blue: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    purple: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  }

  return (
    <div className="rounded-lg border border-border/50 bg-background p-3">
      <div className={`inline-flex rounded-md p-1.5 ${colorClasses[color]}`}>{icon}</div>
      <p className="mt-2 text-lg font-bold">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  )
}

// ============================================================================
// REQUEST LIST
// ============================================================================

interface RequestListProps {
  requests: DedupedRequest[]
  onClear?: () => void
  title?: string
  maxHeight?: string
}

export function RequestList({
  requests,
  onClear,
  title = "Requests",
  maxHeight = "400px",
}: RequestListProps) {
  if (requests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="rounded-full bg-muted p-3">
          <RequestIcon className="size-6 text-muted-foreground" />
        </div>
        <p className="mt-2 text-sm text-muted-foreground">No requests yet</p>
        <p className="text-xs text-muted-foreground/70">
          Make API calls to see deduplication in action
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium">{title}</span>
        {onClear && (
          <button
            onClick={onClear}
            className="text-xs text-destructive hover:underline"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="space-y-2 overflow-y-auto" style={{ maxHeight }}>
        <AnimatePresence>
          {requests.map((request, index) => (
            <motion.div
              key={request.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.03 }}
              className="rounded-lg border border-border/50 bg-background p-3"
            >
              <div className="flex items-start justify-between gap-2">
                <StatusBadge status={request.status} />
                {request.duplicateCount > 0 && (
                  <span className="text-[10px] text-purple-600 dark:text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full">
                    +{request.duplicateCount} deduped
                  </span>
                )}
              </div>

              <div className="mt-2 flex items-center gap-2">
                <span className="text-[10px] font-mono bg-muted px-1.5 py-0.5 rounded">
                  {request.method}
                </span>
                <p className="text-xs truncate flex-1 text-muted-foreground">
                  {request.url}
                </p>
              </div>

              <div className="mt-2 flex items-center gap-3 text-[10px] text-muted-foreground/70">
                <span>{formatRelativeTime(request.timestamp)}</span>
                {request.cachedFrom && (
                  <>
                    <span>•</span>
                    <span className="text-purple-500">From cache</span>
                  </>
                )}
                {request.completedAt && request.status === "completed" && (
                  <>
                    <span>•</span>
                    <span>
                      {request.completedAt.getTime() - request.timestamp.getTime()}ms
                    </span>
                  </>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

// ============================================================================
// REQUEST TIMELINE
// ============================================================================

interface RequestTimelineProps {
  requests: DedupedRequest[]
}

export function RequestTimeline({ requests }: RequestTimelineProps) {
  if (requests.length === 0) return null

  const grouped = useMemo(() => {
    const groups = new Map<string, DedupedRequest[]>()
    for (const request of requests) {
      const existing = groups.get(request.key) || []
      existing.push(request)
      groups.set(request.key, existing)
    }
    return Array.from(groups.entries())
  }, [requests])

  return (
    <div className="rounded-xl border border-border/50 bg-card p-4">
      <h3 className="text-sm font-semibold mb-4">Request Timeline</h3>

      <div className="space-y-4">
        {grouped.slice(0, 5).map(([key, reqs]) => {
          const original = reqs.find(r => r.status === "completed" && !r.cachedFrom)
          const cached = reqs.filter(r => r.status === "cached")

          return (
            <div key={key} className="relative pl-4 border-l-2 border-border/50">
              <div className="absolute -left-1.5 top-0 size-3 rounded-full bg-emerald-500" />

              <div className="space-y-1">
                <p className="text-xs font-medium truncate">{key.split(":")[1]}</p>
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                  <span>1 original</span>
                  {cached.length > 0 && (
                    <>
                      <span>•</span>
                      <span className="text-purple-500">{cached.length} deduplicated</span>
                    </>
                  )}
                </div>
              </div>
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

function formatRelativeTime(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(diff / 60000)

  if (seconds < 5) return "Just now"
  if (seconds < 60) return `${seconds}s ago`
  if (minutes < 60) return `${minutes}m ago`
  return date.toLocaleTimeString()
}

// ============================================================================
// ICONS
// ============================================================================

function LoadingIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
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

function CacheIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
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

function RequestIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
    </svg>
  )
}

function ChartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
    </svg>
  )
}
