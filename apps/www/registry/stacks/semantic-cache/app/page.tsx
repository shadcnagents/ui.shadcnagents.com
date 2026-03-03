"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "motion/react"
import {
  useSemanticCache,
  CacheHitIndicator,
  CacheSavingsPanel,
  SimilarityMeter,
  CacheEntriesList,
  CostProjection,
} from "@/components/semantic-cache"

// Example queries that demonstrate semantic similarity
const EXAMPLE_QUERIES = [
  {
    category: "Similar Questions",
    queries: [
      "What is machine learning?",
      "Explain what machine learning is",
      "Can you tell me about ML?",
      "Define machine learning for me",
    ],
  },
  {
    category: "Different Topics",
    queries: [
      "How do I make pasta?",
      "What's the weather like?",
      "Tell me a joke",
      "Who invented the telephone?",
    ],
  },
]

export default function SemanticCachePage() {
  const [input, setInput] = useState("")
  const [response, setResponse] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [selectedModel, setSelectedModel] = useState("gpt-4o-mini")
  const [threshold, setThreshold] = useState(0.92)
  const [showSimilarity, setShowSimilarity] = useState(false)
  const [currentSimilarity, setCurrentSimilarity] = useState(0)

  const {
    stats,
    lastResult,
    checkCache,
    addToCache,
    clearCache,
    getCachedEntries,
  } = useSemanticCache({
    similarityThreshold: threshold,
    model: selectedModel,
    onCacheHit: (entry, similarity) => {
      setCurrentSimilarity(similarity)
      setShowSimilarity(true)
    },
    onCacheMiss: () => {
      setShowSimilarity(false)
    },
  })

  const handleSubmit = useCallback(
    async (query: string) => {
      if (!query.trim()) return

      setIsLoading(true)
      setResponse("")
      setInput(query)

      try {
        // First, check the cache
        const cacheResult = await checkCache(query)

        if (cacheResult.hit && cacheResult.response) {
          // Cache hit - use cached response
          setResponse(cacheResult.response)
        } else {
          // Cache miss - call the LLM
          const res = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt: query, model: selectedModel }),
          })

          const data = await res.json()
          setResponse(data.text)

          // Add to cache for future queries
          await addToCache(query, data.text, data.usage?.totalTokens || 100)
        }
      } catch (error) {
        console.error("Error:", error)
        setResponse("An error occurred. Please try again.")
      } finally {
        setIsLoading(false)
      }
    },
    [checkCache, addToCache, selectedModel]
  )

  return (
    <div className="min-h-svh bg-gradient-to-b from-background to-muted/30 p-6 md:p-10">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-1.5 text-sm text-emerald-600 dark:text-emerald-400 mb-4">
            <DatabaseIcon className="size-4" />
            <span className="font-medium">Semantic Response Cache</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            Cut LLM Costs by 80%
          </h1>
          <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
            Intelligent caching using embeddings and cosine similarity. Semantically
            similar queries return cached responses instantly—no API call needed.
          </p>
        </div>

        {/* Stats Panel */}
        <CacheSavingsPanel stats={stats} />

        {/* Configuration */}
        <div className="flex flex-wrap items-center gap-4 rounded-xl border border-border/50 bg-card p-4">
          <div className="flex-1 min-w-[200px]">
            <label className="text-xs text-muted-foreground block mb-1">
              Model
            </label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-sm"
            >
              <option value="gpt-4o-mini">GPT-4o Mini</option>
              <option value="gpt-4o">GPT-4o</option>
              <option value="gpt-4-turbo">GPT-4 Turbo</option>
            </select>
          </div>

          <div className="flex-1 min-w-[200px]">
            <label className="text-xs text-muted-foreground block mb-1">
              Similarity Threshold: {(threshold * 100).toFixed(0)}%
            </label>
            <input
              type="range"
              min="0.7"
              max="0.99"
              step="0.01"
              value={threshold}
              onChange={(e) => setThreshold(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
        </div>

        {/* Example Queries */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-muted-foreground">
            Try these queries to see caching in action:
          </h2>

          {EXAMPLE_QUERIES.map((group) => (
            <div key={group.category}>
              <p className="text-xs text-muted-foreground mb-2">{group.category}</p>
              <div className="flex flex-wrap gap-2">
                {group.queries.map((query) => (
                  <button
                    key={query}
                    onClick={() => handleSubmit(query)}
                    disabled={isLoading}
                    className="rounded-full border border-border bg-card px-3 py-1.5 text-sm hover:bg-muted transition-colors disabled:opacity-50"
                  >
                    {query}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSubmit(input)
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a query or try the examples above..."
            className="flex-1 rounded-lg border border-border bg-card px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="rounded-lg bg-foreground px-6 py-3 text-sm font-medium text-background hover:bg-foreground/90 transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <LoadingSpinner className="size-4" />
            ) : (
              "Send"
            )}
          </button>
        </form>

        {/* Result */}
        <AnimatePresence mode="wait">
          {(response || isLoading) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="rounded-xl border border-border/50 bg-card p-6"
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <MessageIcon className="size-5 text-muted-foreground" />
                  <span className="text-sm font-medium">Response</span>
                </div>
                <CacheHitIndicator result={lastResult} />
              </div>

              {isLoading ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <LoadingSpinner className="size-4" />
                  <span className="text-sm">
                    {lastResult?.hit ? "Retrieving from cache..." : "Generating response..."}
                  </span>
                </div>
              ) : (
                <p className="text-sm leading-relaxed">{response}</p>
              )}

              {/* Similarity meter on cache hit */}
              {showSimilarity && lastResult?.hit && (
                <div className="mt-4">
                  <SimilarityMeter
                    similarity={currentSimilarity}
                    threshold={threshold}
                  />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Cost Projection */}
        {stats.totalQueries > 0 && <CostProjection stats={stats} />}

        {/* Cache Entries */}
        <div className="rounded-xl border border-border/50 bg-card p-6">
          <h3 className="text-sm font-semibold mb-4">Cached Responses</h3>
          <CacheEntriesList entries={getCachedEntries()} onClear={clearCache} />
        </div>

        {/* How it works */}
        <div className="rounded-xl border border-border/50 bg-muted/30 p-6">
          <h3 className="text-sm font-semibold mb-4">How Semantic Caching Works</h3>
          <div className="grid gap-4 md:grid-cols-3">
            <Step
              number={1}
              title="Embed Query"
              description="Convert the user's query into a vector embedding using a small, fast model."
            />
            <Step
              number={2}
              title="Compare Similarity"
              description="Calculate cosine similarity against all cached query embeddings."
            />
            <Step
              number={3}
              title="Return or Generate"
              description="If similarity exceeds threshold, return cached response. Otherwise, call LLM and cache result."
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function Step({
  number,
  title,
  description,
}: {
  number: number
  title: string
  description: string
}) {
  return (
    <div className="flex gap-3">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-foreground text-background text-sm font-bold">
        {number}
      </div>
      <div>
        <p className="font-medium text-sm">{title}</p>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </div>
    </div>
  )
}

function DatabaseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
    </svg>
  )
}

function MessageIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
    </svg>
  )
}

function LoadingSpinner({ className }: { className?: string }) {
  return (
    <svg className={`animate-spin ${className}`} fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  )
}
