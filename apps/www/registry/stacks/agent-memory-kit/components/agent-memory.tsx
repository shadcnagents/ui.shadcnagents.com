"use client"

import { useCallback, useMemo, useRef, useState } from "react"
import { AnimatePresence, motion } from "motion/react"

// ============================================================================
// TYPES
// ============================================================================

export interface Memory {
  id: string
  content: string
  embedding?: number[]
  type: "short_term" | "long_term" | "episodic" | "semantic"
  importance: number
  accessCount: number
  createdAt: Date
  lastAccessedAt: Date
  metadata?: Record<string, unknown>
  associations?: string[] // IDs of related memories
}

export interface ConversationContext {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export interface MemoryStats {
  shortTermCount: number
  longTermCount: number
  episodicCount: number
  semanticCount: number
  totalAccesses: number
  avgImportance: number
}

export interface MemoryConfig {
  shortTermLimit?: number
  longTermLimit?: number
  importanceThreshold?: number
  decayRate?: number
  consolidationInterval?: number
}

export interface MemorySearchResult {
  memory: Memory
  relevanceScore: number
}

// ============================================================================
// MEMORY STORE
// ============================================================================

class MemoryStore {
  private memories: Map<string, Memory> = new Map()
  private shortTermLimit: number
  private longTermLimit: number
  private importanceThreshold: number
  private decayRate: number

  constructor(config: MemoryConfig = {}) {
    this.shortTermLimit = config.shortTermLimit || 10
    this.longTermLimit = config.longTermLimit || 100
    this.importanceThreshold = config.importanceThreshold || 0.6
    this.decayRate = config.decayRate || 0.1
  }

  // Add a new memory
  add(
    memory: Omit<Memory, "id" | "accessCount" | "createdAt" | "lastAccessedAt">
  ): Memory {
    const newMemory: Memory = {
      ...memory,
      id: crypto.randomUUID(),
      accessCount: 0,
      createdAt: new Date(),
      lastAccessedAt: new Date(),
    }

    // Enforce limits
    this.enforceLimit(memory.type)

    this.memories.set(newMemory.id, newMemory)
    return newMemory
  }

  // Retrieve a memory by ID
  get(id: string): Memory | undefined {
    const memory = this.memories.get(id)
    if (memory) {
      memory.accessCount++
      memory.lastAccessedAt = new Date()
    }
    return memory
  }

  // Get all memories of a type
  getByType(type: Memory["type"]): Memory[] {
    return Array.from(this.memories.values())
      .filter((m) => m.type === type)
      .sort((a, b) => b.lastAccessedAt.getTime() - a.lastAccessedAt.getTime())
  }

  // Search memories by content (simple keyword matching)
  search(query: string, limit = 5): MemorySearchResult[] {
    const queryLower = query.toLowerCase()
    const results: MemorySearchResult[] = []

    for (const memory of this.memories.values()) {
      const contentLower = memory.content.toLowerCase()

      // Simple relevance scoring
      let score = 0
      const words = queryLower.split(/\s+/)

      for (const word of words) {
        if (contentLower.includes(word)) {
          score += 0.2
        }
      }

      // Boost by importance and recency
      score *= 1 + memory.importance * 0.5
      score *= 1 + Math.min(1, memory.accessCount / 10) * 0.3

      const hoursSinceAccess =
        (Date.now() - memory.lastAccessedAt.getTime()) / 3600000
      score *= Math.exp(-hoursSinceAccess * 0.01) // Decay factor

      if (score > 0) {
        results.push({ memory, relevanceScore: Math.min(1, score) })
      }
    }

    return results
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, limit)
  }

  // Consolidate short-term to long-term memory
  consolidate(): Memory[] {
    const shortTermMemories = this.getByType("short_term")
    const consolidated: Memory[] = []

    for (const memory of shortTermMemories) {
      if (
        memory.importance >= this.importanceThreshold ||
        memory.accessCount >= 3
      ) {
        // Promote to long-term
        const longTermMemory: Memory = {
          ...memory,
          type: "long_term",
          lastAccessedAt: new Date(),
        }
        this.memories.set(memory.id, longTermMemory)
        consolidated.push(longTermMemory)
      }
    }

    return consolidated
  }

  // Apply decay to importance scores
  decay(): void {
    for (const memory of this.memories.values()) {
      if (memory.type === "short_term") {
        memory.importance *= 1 - this.decayRate

        // Remove very low importance short-term memories
        if (memory.importance < 0.1) {
          this.memories.delete(memory.id)
        }
      }
    }
  }

  // Get all memories
  getAll(): Memory[] {
    return Array.from(this.memories.values()).sort(
      (a, b) => b.lastAccessedAt.getTime() - a.lastAccessedAt.getTime()
    )
  }

  // Get statistics
  getStats(): MemoryStats {
    const memories = Array.from(this.memories.values())

    return {
      shortTermCount: memories.filter((m) => m.type === "short_term").length,
      longTermCount: memories.filter((m) => m.type === "long_term").length,
      episodicCount: memories.filter((m) => m.type === "episodic").length,
      semanticCount: memories.filter((m) => m.type === "semantic").length,
      totalAccesses: memories.reduce((sum, m) => sum + m.accessCount, 0),
      avgImportance:
        memories.length > 0
          ? memories.reduce((sum, m) => sum + m.importance, 0) / memories.length
          : 0,
    }
  }

  // Clear all memories
  clear(): void {
    this.memories.clear()
  }

  // Clear memories by type
  clearByType(type: Memory["type"]): void {
    for (const [id, memory] of this.memories) {
      if (memory.type === type) {
        this.memories.delete(id)
      }
    }
  }

  // Size
  size(): number {
    return this.memories.size
  }

  // Enforce memory limits by evicting least accessed
  private enforceLimit(type: Memory["type"]): void {
    const limit =
      type === "short_term" ? this.shortTermLimit : this.longTermLimit
    const memories = this.getByType(type)

    if (memories.length >= limit) {
      // Find least important/accessed memory
      const sortedByPriority = memories.sort(
        (a, b) => a.importance * a.accessCount - b.importance * b.accessCount
      )
      const toRemove = sortedByPriority[0]
      if (toRemove) {
        this.memories.delete(toRemove.id)
      }
    }
  }
}

// ============================================================================
// HOOK: useAgentMemory
// ============================================================================

interface UseAgentMemoryOptions extends MemoryConfig {
  onMemoryAdded?: (memory: Memory) => void
  onMemoryConsolidated?: (memories: Memory[]) => void
  onMemoryDecayed?: () => void
}

export function useAgentMemory(options: UseAgentMemoryOptions = {}) {
  const { onMemoryAdded, onMemoryConsolidated, onMemoryDecayed, ...config } =
    options

  const storeRef = useRef(new MemoryStore(config))
  const [version, setVersion] = useState(0)

  // Force re-render
  const refresh = useCallback(() => setVersion((v) => v + 1), [])

  // Add a memory
  const addMemory = useCallback(
    (
      content: string,
      type: Memory["type"],
      importance: number,
      metadata?: Record<string, unknown>
    ): Memory => {
      const memory = storeRef.current.add({
        content,
        type,
        importance,
        metadata,
      })
      onMemoryAdded?.(memory)
      refresh()
      return memory
    },
    [onMemoryAdded, refresh]
  )

  // Search memories
  const searchMemories = useCallback(
    (query: string, limit = 5): MemorySearchResult[] => {
      return storeRef.current.search(query, limit)
    },
    []
  )

  // Get context for a query (returns relevant memories formatted)
  const getContextForQuery = useCallback(
    (query: string, maxTokens = 2000): string => {
      const results = storeRef.current.search(query, 10)

      let context = ""
      let estimatedTokens = 0

      for (const result of results) {
        const memoryText = `[${result.memory.type}] ${result.memory.content}\n`
        const tokens = memoryText.length / 4 // Rough estimate

        if (estimatedTokens + tokens > maxTokens) break

        context += memoryText
        estimatedTokens += tokens
      }

      return context
    },
    []
  )

  // Consolidate memories
  const consolidateMemories = useCallback(() => {
    const consolidated = storeRef.current.consolidate()
    if (consolidated.length > 0) {
      onMemoryConsolidated?.(consolidated)
      refresh()
    }
    return consolidated
  }, [onMemoryConsolidated, refresh])

  // Decay memories
  const decayMemories = useCallback(() => {
    storeRef.current.decay()
    onMemoryDecayed?.()
    refresh()
  }, [onMemoryDecayed, refresh])

  // Get all memories
  const getAllMemories = useCallback((): Memory[] => {
    return storeRef.current.getAll()
  }, [])

  // Get memories by type
  const getMemoriesByType = useCallback((type: Memory["type"]): Memory[] => {
    return storeRef.current.getByType(type)
  }, [])

  // Get stats
  const getStats = useCallback((): MemoryStats => {
    return storeRef.current.getStats()
  }, [])

  // Clear all
  const clearAll = useCallback(() => {
    storeRef.current.clear()
    refresh()
  }, [refresh])

  // Clear by type
  const clearByType = useCallback(
    (type: Memory["type"]) => {
      storeRef.current.clearByType(type)
      refresh()
    },
    [refresh]
  )

  return {
    addMemory,
    searchMemories,
    getContextForQuery,
    consolidateMemories,
    decayMemories,
    getAllMemories,
    getMemoriesByType,
    getStats,
    clearAll,
    clearByType,
    memoryCount: storeRef.current.size(),
  }
}

// ============================================================================
// MEMORY TYPE BADGE
// ============================================================================

interface MemoryTypeBadgeProps {
  type: Memory["type"]
  size?: "sm" | "md"
}

export function MemoryTypeBadge({ type, size = "sm" }: MemoryTypeBadgeProps) {
  const config = {
    short_term: {
      label: "Short-Term",
      color:
        "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30",
      icon: <ClockIcon className="size-3" />,
    },
    long_term: {
      label: "Long-Term",
      color:
        "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30",
      icon: <ArchiveIcon className="size-3" />,
    },
    episodic: {
      label: "Episodic",
      color:
        "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
      icon: <FilmIcon className="size-3" />,
    },
    semantic: {
      label: "Semantic",
      color:
        "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
      icon: <BrainIcon className="size-3" />,
    },
  }

  const { label, color, icon } = config[type]
  const sizeClasses =
    size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-xs"

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
// MEMORY STATS PANEL
// ============================================================================

interface MemoryStatsPanelProps {
  stats: MemoryStats
}

export function MemoryStatsPanel({ stats }: MemoryStatsPanelProps) {
  const totalMemories =
    stats.shortTermCount +
    stats.longTermCount +
    stats.episodicCount +
    stats.semanticCount

  return (
    <div className="rounded-xl border border-border/50 bg-card p-4">
      <h3 className="text-sm font-semibold mb-4">Memory Statistics</h3>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard
          label="Short-Term"
          value={stats.shortTermCount.toString()}
          icon={<ClockIcon className="size-4" />}
          color="blue"
        />
        <StatCard
          label="Long-Term"
          value={stats.longTermCount.toString()}
          icon={<ArchiveIcon className="size-4" />}
          color="purple"
        />
        <StatCard
          label="Episodic"
          value={stats.episodicCount.toString()}
          icon={<FilmIcon className="size-4" />}
          color="amber"
        />
        <StatCard
          label="Semantic"
          value={stats.semanticCount.toString()}
          icon={<BrainIcon className="size-4" />}
          color="emerald"
        />
      </div>

      {/* Memory distribution bar */}
      {totalMemories > 0 && (
        <div className="mt-4">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Memory Distribution</span>
            <span>{totalMemories} total</span>
          </div>
          <div className="flex h-2 overflow-hidden rounded-full bg-muted">
            <motion.div
              className="bg-blue-500"
              initial={{ width: 0 }}
              animate={{
                width: `${(stats.shortTermCount / totalMemories) * 100}%`,
              }}
              transition={{ duration: 0.5 }}
            />
            <motion.div
              className="bg-purple-500"
              initial={{ width: 0 }}
              animate={{
                width: `${(stats.longTermCount / totalMemories) * 100}%`,
              }}
              transition={{ duration: 0.5 }}
            />
            <motion.div
              className="bg-amber-500"
              initial={{ width: 0 }}
              animate={{
                width: `${(stats.episodicCount / totalMemories) * 100}%`,
              }}
              transition={{ duration: 0.5 }}
            />
            <motion.div
              className="bg-emerald-500"
              initial={{ width: 0 }}
              animate={{
                width: `${(stats.semanticCount / totalMemories) * 100}%`,
              }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      )}

      {/* Additional stats */}
      <div className="mt-4 grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
        <div>
          <p className="text-lg font-bold">{stats.totalAccesses}</p>
          <p className="text-xs text-muted-foreground">Total Accesses</p>
        </div>
        <div>
          <p className="text-lg font-bold">
            {(stats.avgImportance * 100).toFixed(0)}%
          </p>
          <p className="text-xs text-muted-foreground">Avg Importance</p>
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
  color: "blue" | "purple" | "amber" | "emerald"
}) {
  const colorClasses = {
    blue: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    purple: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
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
// MEMORY LIST
// ============================================================================

interface MemoryListProps {
  memories: Memory[]
  onClear?: () => void
  title?: string
}

export function MemoryList({
  memories,
  onClear,
  title = "Memories",
}: MemoryListProps) {
  if (memories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="rounded-full bg-muted p-3">
          <BrainIcon className="size-6 text-muted-foreground" />
        </div>
        <p className="mt-2 text-sm text-muted-foreground">No memories yet</p>
        <p className="text-xs text-muted-foreground/70">
          Interact with the agent to create memories
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

      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        <AnimatePresence>
          {memories.map((memory, index) => (
            <motion.div
              key={memory.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.05 }}
              className="rounded-lg border border-border/50 bg-background p-3"
            >
              <div className="flex items-start justify-between gap-2">
                <MemoryTypeBadge type={memory.type} />
                <ImportanceMeter importance={memory.importance} />
              </div>

              <p className="mt-2 text-sm line-clamp-2">{memory.content}</p>

              <div className="mt-2 flex items-center gap-3 text-[10px] text-muted-foreground/70">
                <span>{memory.accessCount} accesses</span>
                <span>•</span>
                <span>{formatRelativeTime(memory.lastAccessedAt)}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

// ============================================================================
// IMPORTANCE METER
// ============================================================================

function ImportanceMeter({ importance }: { importance: number }) {
  const percentage = importance * 100
  const color =
    percentage >= 80
      ? "text-emerald-500"
      : percentage >= 50
        ? "text-amber-500"
        : "text-zinc-500"

  return (
    <div className="flex items-center gap-1">
      <div className="flex gap-0.5">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`size-1.5 rounded-full ${
              i < Math.round(importance * 5) ? "bg-current" : "bg-muted"
            } ${color}`}
          />
        ))}
      </div>
      <span className={`text-[10px] ${color}`}>{percentage.toFixed(0)}%</span>
    </div>
  )
}

// ============================================================================
// SEARCH RESULTS
// ============================================================================

interface SearchResultsProps {
  results: MemorySearchResult[]
  query: string
}

export function SearchResults({ results, query }: SearchResultsProps) {
  if (!query) return null

  if (results.length === 0) {
    return (
      <div className="rounded-lg border border-border/50 bg-card p-4 text-center">
        <p className="text-sm text-muted-foreground">
          No memories found for "{query}"
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="text-xs text-muted-foreground mb-2">
        Found {results.length} relevant memories
      </div>

      {results.map((result) => (
        <motion.div
          key={result.memory.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-lg border border-border/50 bg-card p-3"
        >
          <div className="flex items-start justify-between gap-2">
            <MemoryTypeBadge type={result.memory.type} />
            <span className="text-xs text-emerald-600 dark:text-emerald-400">
              {(result.relevanceScore * 100).toFixed(0)}% match
            </span>
          </div>
          <p className="mt-2 text-sm">{result.memory.content}</p>
        </motion.div>
      ))}
    </div>
  )
}

// ============================================================================
// CONTEXT PREVIEW
// ============================================================================

interface ContextPreviewProps {
  context: string
  tokenEstimate?: number
}

export function ContextPreview({
  context,
  tokenEstimate,
}: ContextPreviewProps) {
  if (!context) {
    return (
      <div className="rounded-lg border border-dashed border-border/50 bg-muted/30 p-4 text-center">
        <p className="text-sm text-muted-foreground">
          Context will appear here when relevant memories are found
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-border/50 bg-card p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium">Memory Context</span>
        {tokenEstimate && (
          <span className="text-xs text-muted-foreground">
            ~{tokenEstimate} tokens
          </span>
        )}
      </div>
      <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-mono bg-muted/50 rounded p-2 max-h-40 overflow-auto">
        {context}
      </pre>
    </div>
  )
}

// ============================================================================
// CONSOLIDATION BUTTON
// ============================================================================

interface ConsolidationButtonProps {
  onConsolidate: () => Memory[]
  shortTermCount: number
}

export function ConsolidationButton({
  onConsolidate,
  shortTermCount,
}: ConsolidationButtonProps) {
  const [lastConsolidated, setLastConsolidated] = useState<number>(0)

  const handleConsolidate = () => {
    const consolidated = onConsolidate()
    setLastConsolidated(consolidated.length)
    setTimeout(() => setLastConsolidated(0), 2000)
  }

  return (
    <button
      onClick={handleConsolidate}
      disabled={shortTermCount === 0}
      className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm hover:bg-muted transition-colors disabled:opacity-50"
    >
      <ConsolidateIcon className="size-4" />
      <span>Consolidate</span>
      {lastConsolidated > 0 && (
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-600"
        >
          +{lastConsolidated} promoted
        </motion.span>
      )}
    </button>
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

function ClockIcon({ className }: { className?: string }) {
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
        d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
      />
    </svg>
  )
}

function ArchiveIcon({ className }: { className?: string }) {
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
        d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
      />
    </svg>
  )
}

function FilmIcon({ className }: { className?: string }) {
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
        d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z"
      />
    </svg>
  )
}

function BrainIcon({ className }: { className?: string }) {
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
        d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
      />
    </svg>
  )
}

function ConsolidateIcon({ className }: { className?: string }) {
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
        d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
      />
    </svg>
  )
}
