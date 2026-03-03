"use client"

import { useState, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "motion/react"
import {
  useAgentMemory,
  MemoryTypeBadge,
  MemoryStatsPanel,
  MemoryList,
  SearchResults,
  ContextPreview,
  ConsolidationButton,
  type Memory,
} from "@/components/agent-memory"

// Example memories for quick population
const EXAMPLE_MEMORIES = [
  {
    content: "User prefers dark mode and minimalist interfaces",
    type: "semantic" as const,
    importance: 0.9,
  },
  {
    content: "User asked about React performance optimization yesterday",
    type: "episodic" as const,
    importance: 0.7,
  },
  {
    content: "Current conversation is about building an AI chatbot",
    type: "short_term" as const,
    importance: 0.8,
  },
  {
    content: "User's name is Alex and they work at a startup",
    type: "long_term" as const,
    importance: 0.85,
  },
  {
    content: "User mentioned they like TypeScript over JavaScript",
    type: "semantic" as const,
    importance: 0.75,
  },
]

export default function AgentMemoryKitPage() {
  const [input, setInput] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState<Memory["type"]>("short_term")
  const [importance, setImportance] = useState(0.7)
  const [viewMode, setViewMode] = useState<"all" | "by_type" | "search">("all")

  const {
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
    memoryCount,
  } = useAgentMemory({
    shortTermLimit: 10,
    longTermLimit: 50,
    importanceThreshold: 0.6,
    decayRate: 0.1,
  })

  const stats = getStats()
  const allMemories = getAllMemories()

  // Get search results
  const searchResults = useMemo(() => {
    if (!searchQuery) return []
    return searchMemories(searchQuery, 5)
  }, [searchQuery, searchMemories])

  // Get context for search query
  const context = useMemo(() => {
    if (!searchQuery) return ""
    return getContextForQuery(searchQuery, 1000)
  }, [searchQuery, getContextForQuery])

  // Add a memory
  const handleAddMemory = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      if (!input.trim()) return

      addMemory(input, selectedType, importance)
      setInput("")
    },
    [input, selectedType, importance, addMemory]
  )

  // Populate with examples
  const populateExamples = useCallback(() => {
    EXAMPLE_MEMORIES.forEach((memory) => {
      addMemory(memory.content, memory.type, memory.importance)
    })
  }, [addMemory])

  // Get memories for current view
  const displayedMemories = useMemo(() => {
    if (viewMode === "search") return searchResults.map((r) => r.memory)
    if (viewMode === "by_type") return getMemoriesByType(selectedType)
    return allMemories
  }, [viewMode, searchResults, selectedType, getMemoriesByType, allMemories])

  return (
    <div className="min-h-svh bg-gradient-to-b from-background to-muted/30 p-6 md:p-10">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-purple-500/10 px-4 py-1.5 text-sm text-purple-600 dark:text-purple-400 mb-4">
            <BrainIcon className="size-4" />
            <span className="font-medium">Agent Memory Kit</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            Human-Like Memory for AI
          </h1>
          <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
            Mem0-inspired memory patterns with short-term, long-term, episodic, and
            semantic memory. Build agents that remember, learn, and personalize.
          </p>
        </div>

        {/* Stats */}
        <MemoryStatsPanel stats={stats} />

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <ConsolidationButton
            onConsolidate={consolidateMemories}
            shortTermCount={stats.shortTermCount}
          />

          <button
            onClick={decayMemories}
            className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm hover:bg-muted transition-colors"
          >
            <DecayIcon className="size-4" />
            <span>Apply Decay</span>
          </button>

          <button
            onClick={populateExamples}
            disabled={memoryCount > 0}
            className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm hover:bg-muted transition-colors disabled:opacity-50"
          >
            <SparklesIcon className="size-4" />
            <span>Load Examples</span>
          </button>
        </div>

        {/* Add Memory Form */}
        <div className="rounded-xl border border-border/50 bg-card p-4 space-y-4">
          <h2 className="text-sm font-semibold">Add New Memory</h2>

          <form onSubmit={handleAddMemory} className="space-y-4">
            {/* Memory Type Selection */}
            <div className="flex flex-wrap gap-2">
              {(["short_term", "long_term", "episodic", "semantic"] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSelectedType(type)}
                  className={`transition-opacity ${
                    selectedType === type ? "opacity-100" : "opacity-50 hover:opacity-75"
                  }`}
                >
                  <MemoryTypeBadge type={type} size="md" />
                </button>
              ))}
            </div>

            {/* Importance Slider */}
            <div>
              <label className="text-xs text-muted-foreground block mb-1">
                Importance: {(importance * 100).toFixed(0)}%
              </label>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.1"
                value={importance}
                onChange={(e) => setImportance(parseFloat(e.target.value))}
                className="w-full max-w-xs"
              />
            </div>

            {/* Content Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter memory content..."
                className="flex-1 rounded-lg border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="rounded-lg bg-foreground px-6 py-2 text-sm font-medium text-background hover:bg-foreground/90 transition-colors disabled:opacity-50"
              >
                Add
              </button>
            </div>
          </form>
        </div>

        {/* Search */}
        <div className="rounded-xl border border-border/50 bg-card p-4 space-y-4">
          <h2 className="text-sm font-semibold">Search Memories</h2>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setViewMode("search")
            }}
            placeholder="Search for relevant memories..."
            className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />

          {searchQuery && (
            <>
              <SearchResults results={searchResults} query={searchQuery} />
              <ContextPreview
                context={context}
                tokenEstimate={Math.round(context.length / 4)}
              />
            </>
          )}
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">View:</span>
          <div className="flex rounded-lg border border-border bg-card p-0.5">
            {(["all", "by_type"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => {
                  setViewMode(mode)
                  setSearchQuery("")
                }}
                className={`px-3 py-1 text-xs rounded-md transition-colors ${
                  viewMode === mode
                    ? "bg-foreground text-background"
                    : "hover:bg-muted"
                }`}
              >
                {mode === "all" ? "All Memories" : "By Type"}
              </button>
            ))}
          </div>

          {viewMode === "by_type" && (
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as Memory["type"])}
              className="rounded-md border border-border bg-background px-2 py-1 text-xs"
            >
              <option value="short_term">Short-Term</option>
              <option value="long_term">Long-Term</option>
              <option value="episodic">Episodic</option>
              <option value="semantic">Semantic</option>
            </select>
          )}
        </div>

        {/* Memory List */}
        <div className="rounded-xl border border-border/50 bg-card p-4">
          <MemoryList
            memories={displayedMemories}
            onClear={clearAll}
            title={
              viewMode === "all"
                ? `All Memories (${memoryCount})`
                : viewMode === "by_type"
                  ? `${selectedType.replace("_", " ")} Memories`
                  : `Search Results (${searchResults.length})`
            }
          />
        </div>

        {/* How it works */}
        <div className="rounded-xl border border-border/50 bg-muted/30 p-6">
          <h3 className="text-sm font-semibold mb-4">Memory Types Explained</h3>

          <div className="grid gap-4 md:grid-cols-2">
            <MemoryTypeCard
              type="short_term"
              title="Short-Term Memory"
              description="Temporary storage for current conversation context. Decays over time, can be promoted to long-term if accessed frequently or deemed important."
            />
            <MemoryTypeCard
              type="long_term"
              title="Long-Term Memory"
              description="Persistent storage for important information. Survives across sessions, consolidated from short-term memory based on importance."
            />
            <MemoryTypeCard
              type="episodic"
              title="Episodic Memory"
              description="Stores specific events and experiences with temporal context. Useful for 'yesterday we discussed...' type recalls."
            />
            <MemoryTypeCard
              type="semantic"
              title="Semantic Memory"
              description="General knowledge and facts about the user or domain. 'User prefers TypeScript' or 'User works in fintech' style information."
            />
          </div>
        </div>

        {/* Attribution */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            Inspired by{" "}
            <a
              href="https://github.com/mem0ai/mem0"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground"
            >
              Mem0
            </a>{" "}
            — Memory layer for AI applications
          </p>
        </div>
      </div>
    </div>
  )
}

function MemoryTypeCard({
  type,
  title,
  description,
}: {
  type: Memory["type"]
  title: string
  description: string
}) {
  return (
    <div className="rounded-lg border border-border/50 bg-background p-3">
      <MemoryTypeBadge type={type} size="md" />
      <p className="mt-2 font-medium text-sm">{title}</p>
      <p className="mt-1 text-xs text-muted-foreground">{description}</p>
    </div>
  )
}

function BrainIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
    </svg>
  )
}

function DecayIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6 9 12.75l4.286-4.286a11.948 11.948 0 0 1 4.306 6.43l.776 2.898m0 0 3.182-5.511m-3.182 5.51-5.511-3.181" />
    </svg>
  )
}

function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
    </svg>
  )
}
