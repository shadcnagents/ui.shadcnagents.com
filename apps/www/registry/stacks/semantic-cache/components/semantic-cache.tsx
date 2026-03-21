"use client"

import { useCallback, useMemo, useRef, useState } from "react"
import { AnimatePresence, motion } from "motion/react"

// ============================================================================
// TYPES
// ============================================================================

export interface CacheEntry {
  id: string
  query: string
  queryEmbedding: number[]
  response: string
  model: string
  tokensUsed: number
  costSaved: number
  createdAt: Date
  lastAccessedAt: Date
  hitCount: number
}

export interface CacheStats {
  totalQueries: number
  cacheHits: number
  cacheMisses: number
  tokensSaved: number
  costSaved: number
  hitRate: number
}

export interface CacheConfig {
  similarityThreshold?: number
  maxEntries?: number
  ttlMs?: number
  model?: string
}

export interface CacheResult {
  hit: boolean
  response?: string
  similarity?: number
  entry?: CacheEntry
  latencyMs: number
}

// ============================================================================
// MODEL PRICING (per 1K tokens)
// ============================================================================

const MODEL_PRICING: Record<string, { input: number; output: number }> = {
  "gpt-4o": { input: 0.0025, output: 0.01 },
  "gpt-4o-mini": { input: 0.00015, output: 0.0006 },
  "gpt-4-turbo": { input: 0.01, output: 0.03 },
  "claude-sonnet-4-20250514": { input: 0.003, output: 0.015 },
  "claude-3-5-sonnet": { input: 0.003, output: 0.015 },
  "gemini-2.0-flash": { input: 0.000075, output: 0.0003 },
}

// ============================================================================
// COSINE SIMILARITY
// ============================================================================

function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0

  let dotProduct = 0
  let normA = 0
  let normB = 0

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }

  const magnitude = Math.sqrt(normA) * Math.sqrt(normB)
  return magnitude === 0 ? 0 : dotProduct / magnitude
}

// ============================================================================
// IN-MEMORY CACHE STORE
// ============================================================================

class SemanticCacheStore {
  private entries: Map<string, CacheEntry> = new Map()
  private maxEntries: number
  private ttlMs: number

  constructor(maxEntries = 1000, ttlMs = 3600000) {
    this.maxEntries = maxEntries
    this.ttlMs = ttlMs
  }

  add(entry: CacheEntry): void {
    // Evict oldest if at capacity
    if (this.entries.size >= this.maxEntries) {
      const oldest = Array.from(this.entries.values()).sort(
        (a, b) => a.lastAccessedAt.getTime() - b.lastAccessedAt.getTime()
      )[0]
      if (oldest) this.entries.delete(oldest.id)
    }

    this.entries.set(entry.id, entry)
  }

  findSimilar(
    embedding: number[],
    threshold: number
  ): { entry: CacheEntry; similarity: number } | null {
    const now = Date.now()
    let bestMatch: { entry: CacheEntry; similarity: number } | null = null

    for (const entry of this.entries.values()) {
      // Check TTL
      if (now - entry.createdAt.getTime() > this.ttlMs) {
        this.entries.delete(entry.id)
        continue
      }

      const similarity = cosineSimilarity(embedding, entry.queryEmbedding)

      if (similarity >= threshold) {
        if (!bestMatch || similarity > bestMatch.similarity) {
          bestMatch = { entry, similarity }
        }
      }
    }

    if (bestMatch) {
      // Update access time and hit count
      bestMatch.entry.lastAccessedAt = new Date()
      bestMatch.entry.hitCount++
    }

    return bestMatch
  }

  getAll(): CacheEntry[] {
    return Array.from(this.entries.values()).sort(
      (a, b) => b.lastAccessedAt.getTime() - a.lastAccessedAt.getTime()
    )
  }

  clear(): void {
    this.entries.clear()
  }

  size(): number {
    return this.entries.size
  }
}

// ============================================================================
// HOOK: useSemanticCache
// ============================================================================

interface UseSemanticCacheOptions extends CacheConfig {
  onCacheHit?: (entry: CacheEntry, similarity: number) => void
  onCacheMiss?: (query: string) => void
}

export function useSemanticCache(options: UseSemanticCacheOptions = {}) {
  const {
    similarityThreshold = 0.92,
    maxEntries = 1000,
    ttlMs = 3600000, // 1 hour
    model = "gpt-4o-mini",
    onCacheHit,
    onCacheMiss,
  } = options

  const storeRef = useRef(new SemanticCacheStore(maxEntries, ttlMs))

  const [stats, setStats] = useState<CacheStats>({
    totalQueries: 0,
    cacheHits: 0,
    cacheMisses: 0,
    tokensSaved: 0,
    costSaved: 0,
    hitRate: 0,
  })

  const [lastResult, setLastResult] = useState<CacheResult | null>(null)

  // Get embedding for a query
  const getEmbedding = useCallback(async (text: string): Promise<number[]> => {
    const response = await fetch("/api/cache/embed", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    })

    if (!response.ok) {
      throw new Error("Failed to get embedding")
    }

    const data = await response.json()
    return data.embedding
  }, [])

  // Check cache and return result
  const checkCache = useCallback(
    async (query: string): Promise<CacheResult> => {
      const startTime = performance.now()

      try {
        const embedding = await getEmbedding(query)
        const match = storeRef.current.findSimilar(
          embedding,
          similarityThreshold
        )

        const latencyMs = performance.now() - startTime

        if (match) {
          // Cache hit
          const result: CacheResult = {
            hit: true,
            response: match.entry.response,
            similarity: match.similarity,
            entry: match.entry,
            latencyMs,
          }

          setStats((prev) => {
            const newHits = prev.cacheHits + 1
            const newTotal = prev.totalQueries + 1
            return {
              ...prev,
              totalQueries: newTotal,
              cacheHits: newHits,
              tokensSaved: prev.tokensSaved + match.entry.tokensUsed,
              costSaved: prev.costSaved + match.entry.costSaved,
              hitRate: (newHits / newTotal) * 100,
            }
          })

          setLastResult(result)
          onCacheHit?.(match.entry, match.similarity)
          return result
        } else {
          // Cache miss
          const result: CacheResult = {
            hit: false,
            latencyMs,
          }

          setStats((prev) => {
            const newMisses = prev.cacheMisses + 1
            const newTotal = prev.totalQueries + 1
            return {
              ...prev,
              totalQueries: newTotal,
              cacheMisses: newMisses,
              hitRate: (prev.cacheHits / newTotal) * 100,
            }
          })

          setLastResult(result)
          onCacheMiss?.(query)
          return result
        }
      } catch (error) {
        return {
          hit: false,
          latencyMs: performance.now() - startTime,
        }
      }
    },
    [getEmbedding, similarityThreshold, onCacheHit, onCacheMiss]
  )

  // Add response to cache
  const addToCache = useCallback(
    async (
      query: string,
      response: string,
      tokensUsed: number
    ): Promise<void> => {
      const embedding = await getEmbedding(query)
      const pricing = MODEL_PRICING[model] || MODEL_PRICING["gpt-4o-mini"]
      const costSaved = (tokensUsed / 1000) * (pricing.input + pricing.output)

      const entry: CacheEntry = {
        id: crypto.randomUUID(),
        query,
        queryEmbedding: embedding,
        response,
        model,
        tokensUsed,
        costSaved,
        createdAt: new Date(),
        lastAccessedAt: new Date(),
        hitCount: 0,
      }

      storeRef.current.add(entry)
    },
    [getEmbedding, model]
  )

  // Clear cache
  const clearCache = useCallback(() => {
    storeRef.current.clear()
    setStats({
      totalQueries: 0,
      cacheHits: 0,
      cacheMisses: 0,
      tokensSaved: 0,
      costSaved: 0,
      hitRate: 0,
    })
    setLastResult(null)
  }, [])

  // Get all cached entries
  const getCachedEntries = useCallback((): CacheEntry[] => {
    return storeRef.current.getAll()
  }, [])

  return {
    stats,
    lastResult,
    checkCache,
    addToCache,
    clearCache,
    getCachedEntries,
    cacheSize: storeRef.current.size(),
  }
}

// ============================================================================
// CACHE HIT INDICATOR
// ============================================================================

interface CacheHitIndicatorProps {
  result: CacheResult | null
}

export function CacheHitIndicator({ result }: CacheHitIndicatorProps) {
  if (!result) return null

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={result.hit ? "hit" : "miss"}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 ${
          result.hit
            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
            : "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400"
        }`}
      >
        {result.hit ? (
          <>
            <CacheIcon className="size-4" />
            <span className="text-xs font-semibold">CACHE HIT</span>
            <span className="text-xs opacity-70">
              {(result.similarity! * 100).toFixed(1)}% similar
            </span>
            <span className="text-xs opacity-50">
              {result.latencyMs.toFixed(0)}ms
            </span>
          </>
        ) : (
          <>
            <MissIcon className="size-4" />
            <span className="text-xs font-semibold">CACHE MISS</span>
            <span className="text-xs opacity-50">
              {result.latencyMs.toFixed(0)}ms
            </span>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  )
}

// ============================================================================
// CACHE SAVINGS PANEL
// ============================================================================

interface CacheSavingsPanelProps {
  stats: CacheStats
}

export function CacheSavingsPanel({ stats }: CacheSavingsPanelProps) {
  return (
    <div className="rounded-xl border border-border/50 bg-card p-4">
      <h3 className="text-sm font-semibold mb-4">Cache Performance</h3>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard
          label="Hit Rate"
          value={`${stats.hitRate.toFixed(1)}%`}
          icon={<PercentIcon className="size-4" />}
          color={
            stats.hitRate > 50
              ? "emerald"
              : stats.hitRate > 25
                ? "amber"
                : "zinc"
          }
        />
        <StatCard
          label="Cost Saved"
          value={`$${stats.costSaved.toFixed(4)}`}
          icon={<DollarIcon className="size-4" />}
          color="emerald"
        />
        <StatCard
          label="Tokens Saved"
          value={stats.tokensSaved.toLocaleString()}
          icon={<TokenIcon className="size-4" />}
          color="blue"
        />
        <StatCard
          label="Cache Hits"
          value={`${stats.cacheHits}/${stats.totalQueries}`}
          icon={<CacheIcon className="size-4" />}
          color="purple"
        />
      </div>

      {/* Hit/Miss ratio bar */}
      <div className="mt-4">
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          <span>Hits: {stats.cacheHits}</span>
          <span>Misses: {stats.cacheMisses}</span>
        </div>
        <div className="flex h-2 overflow-hidden rounded-full bg-muted">
          <motion.div
            className="bg-emerald-500"
            initial={{ width: 0 }}
            animate={{
              width:
                stats.totalQueries > 0
                  ? `${(stats.cacheHits / stats.totalQueries) * 100}%`
                  : "0%",
            }}
            transition={{ duration: 0.5 }}
          />
          <motion.div
            className="bg-zinc-400"
            initial={{ width: 0 }}
            animate={{
              width:
                stats.totalQueries > 0
                  ? `${(stats.cacheMisses / stats.totalQueries) * 100}%`
                  : "0%",
            }}
            transition={{ duration: 0.5 }}
          />
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
  color: "emerald" | "amber" | "zinc" | "blue" | "purple"
}) {
  const colorClasses = {
    emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    zinc: "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400",
    blue: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    purple: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  }

  return (
    <div className="rounded-lg border border-border/50 bg-background p-3">
      <div className={`inline-flex rounded-md p-1.5 ${colorClasses[color]}`}>
        {icon}
      </div>
      <p className="mt-2 text-lg font-bold">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  )
}

// ============================================================================
// SIMILARITY METER
// ============================================================================

interface SimilarityMeterProps {
  similarity: number
  threshold: number
}

export function SimilarityMeter({
  similarity,
  threshold,
}: SimilarityMeterProps) {
  const percentage = similarity * 100
  const isAboveThreshold = similarity >= threshold

  return (
    <div className="rounded-lg border border-border/50 bg-card p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium">Similarity Score</span>
        <span
          className={`text-lg font-bold ${
            isAboveThreshold ? "text-emerald-500" : "text-amber-500"
          }`}
        >
          {percentage.toFixed(1)}%
        </span>
      </div>

      <div className="relative h-3 bg-muted rounded-full overflow-hidden">
        {/* Threshold marker */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-foreground/30 z-10"
          style={{ left: `${threshold * 100}%` }}
        />

        {/* Similarity bar */}
        <motion.div
          className={`h-full ${isAboveThreshold ? "bg-emerald-500" : "bg-amber-500"}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>

      <div className="flex justify-between mt-1">
        <span className="text-[10px] text-muted-foreground">0%</span>
        <span className="text-[10px] text-muted-foreground">
          Threshold: {(threshold * 100).toFixed(0)}%
        </span>
        <span className="text-[10px] text-muted-foreground">100%</span>
      </div>
    </div>
  )
}

// ============================================================================
// CACHE ENTRIES LIST
// ============================================================================

interface CacheEntriesListProps {
  entries: CacheEntry[]
  onClear: () => void
}

export function CacheEntriesList({ entries, onClear }: CacheEntriesListProps) {
  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="rounded-full bg-muted p-3">
          <CacheIcon className="size-6 text-muted-foreground" />
        </div>
        <p className="mt-2 text-sm text-muted-foreground">Cache is empty</p>
        <p className="text-xs text-muted-foreground/70">
          Send some messages to populate the cache
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-muted-foreground">
          {entries.length} cached responses
        </span>
        <button
          onClick={onClear}
          className="text-xs text-destructive hover:underline"
        >
          Clear All
        </button>
      </div>

      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {entries.map((entry) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-lg border border-border/50 bg-background p-3"
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-medium line-clamp-2">{entry.query}</p>
              <div className="shrink-0 flex items-center gap-1">
                <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600">
                  {entry.hitCount} hits
                </span>
              </div>
            </div>

            <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
              {entry.response}
            </p>

            <div className="mt-2 flex items-center gap-3 text-[10px] text-muted-foreground/70">
              <span>{entry.model}</span>
              <span>•</span>
              <span>{entry.tokensUsed} tokens</span>
              <span>•</span>
              <span>${entry.costSaved.toFixed(4)} saved</span>
              <span>•</span>
              <span>{formatRelativeTime(entry.lastAccessedAt)}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// ============================================================================
// COST PROJECTION
// ============================================================================

interface CostProjectionProps {
  stats: CacheStats
  projectionDays?: number
}

export function CostProjection({
  stats,
  projectionDays = 30,
}: CostProjectionProps) {
  const dailyQueries = stats.totalQueries || 1
  const dailySavings = stats.costSaved || 0

  const projectedQueries = dailyQueries * projectionDays
  const projectedSavings = dailySavings * projectionDays
  const projectedTokens = stats.tokensSaved * projectionDays

  return (
    <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4">
      <h3 className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-3">
        {projectionDays}-Day Projection
      </h3>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            ${projectedSavings.toFixed(2)}
          </p>
          <p className="text-xs text-muted-foreground">Estimated savings</p>
        </div>
        <div>
          <p className="text-2xl font-bold">
            {(projectedTokens / 1000000).toFixed(2)}M
          </p>
          <p className="text-xs text-muted-foreground">Tokens saved</p>
        </div>
        <div>
          <p className="text-2xl font-bold">
            {projectedQueries.toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground">Est. queries</p>
        </div>
      </div>

      <p className="mt-3 text-xs text-muted-foreground">
        Based on current hit rate of {stats.hitRate.toFixed(1)}%
      </p>
    </div>
  )
}

// ============================================================================
// UTILITIES
// ============================================================================

function formatRelativeTime(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)

  if (minutes < 1) return "Just now"
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  return date.toLocaleDateString()
}

// ============================================================================
// ICONS
// ============================================================================

function CacheIcon({ className }: { className?: string }) {
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
        d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125"
      />
    </svg>
  )
}

function MissIcon({ className }: { className?: string }) {
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
        d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
      />
    </svg>
  )
}

function PercentIcon({ className }: { className?: string }) {
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
        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
      />
    </svg>
  )
}

function DollarIcon({ className }: { className?: string }) {
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
        d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  )
}

function TokenIcon({ className }: { className?: string }) {
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
        d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5"
      />
    </svg>
  )
}
