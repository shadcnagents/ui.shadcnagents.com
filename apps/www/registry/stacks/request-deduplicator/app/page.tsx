"use client"

import { useCallback, useState } from "react"
import { motion } from "motion/react"

import {
  RequestList,
  RequestTimeline,
  StatsPanel,
  StatusBadge,
  useRequestDeduplicator,
} from "../components/request-deduplicator"

export default function RequestDeduplicatorDemo() {
  const [burstCount, setBurstCount] = useState(5)
  const [timeWindow, setTimeWindow] = useState(5000)
  const [testingBurst, setTestingBurst] = useState(false)

  const deduplicator = useRequestDeduplicator({
    timeWindow,
    maxCacheSize: 100,
    onRequestComplete: (request, cached) => {
      console.log(`Request ${request.id} completed (cached: ${cached})`)
    },
    onDuplicate: (originalId, count) => {
      console.log(`Request ${originalId} has ${count} deduplicated requests`)
    },
  })

  // Simulate burst requests to test deduplication
  const simulateBurst = useCallback(async () => {
    setTestingBurst(true)

    // Simulate multiple identical requests
    const requests = Array.from({ length: burstCount }, () => ({
      id: crypto.randomUUID(),
    }))

    await Promise.allSettled(
      requests.map(async () => {
        try {
          await deduplicator.dedupFetch(
            "/api/test",
            { method: "POST" },
            async () => {
              // Simulate API delay
              await new Promise((resolve) =>
                setTimeout(resolve, 500 + Math.random() * 500)
              )
              return { success: true, timestamp: Date.now() }
            }
          )
        } catch {
          // Handled by deduplicator
        }
      })
    )

    setTestingBurst(false)
  }, [deduplicator, burstCount])

  // Simulate different endpoints
  const simulateVaried = useCallback(async () => {
    setTestingBurst(true)

    const endpoints = [
      "/api/users",
      "/api/products",
      "/api/orders",
      "/api/users",
      "/api/products",
    ]

    await Promise.allSettled(
      endpoints.map(async (endpoint) => {
        try {
          await deduplicator.dedupFetch(
            endpoint,
            { method: "GET" },
            async () => {
              await new Promise((resolve) =>
                setTimeout(resolve, 300 + Math.random() * 300)
              )
              return { endpoint, data: [] }
            }
          )
        } catch {
          // Handled by deduplicator
        }
      })
    )

    setTestingBurst(false)
  }, [deduplicator])

  const requests = deduplicator.getRequests()
  const stats = deduplicator.getStats()

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="mx-auto max-w-5xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold tracking-tight">
                Request Deduplicator
              </h1>
              <p className="text-sm text-muted-foreground">
                Prevent duplicate API requests with intelligent caching
              </p>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge
                status={stats.pendingRequests > 0 ? "pending" : "completed"}
                size="md"
              />
              <span className="text-sm text-muted-foreground">
                {stats.cacheHitRate.toFixed(0)}% hit rate
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8">
        <div className="grid gap-6 lg:grid-cols-[1fr,320px]">
          {/* Main Content */}
          <div className="space-y-6">
            {/* Stats Panel */}
            <StatsPanel stats={stats} />

            {/* Request List */}
            <div className="rounded-xl border border-border/50 bg-card">
              <div className="border-b border-border/50 px-4 py-3">
                <h2 className="text-sm font-medium">Request History</h2>
                <p className="text-xs text-muted-foreground">
                  Watch as duplicate requests are automatically deduplicated
                </p>
              </div>

              <div className="p-4">
                <RequestList
                  requests={requests}
                  onClear={deduplicator.clearAll}
                  maxHeight="300px"
                />
              </div>
            </div>

            {/* Timeline */}
            <RequestTimeline requests={requests} />
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Test Controls */}
            <div className="rounded-xl border border-border/50 bg-card p-4">
              <h3 className="mb-3 text-sm font-semibold">Test Controls</h3>
              <div className="space-y-4">
                {/* Burst count slider */}
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">
                    Burst Size: {burstCount} requests
                  </label>
                  <input
                    type="range"
                    min="2"
                    max="10"
                    value={burstCount}
                    onChange={(e) => setBurstCount(Number(e.target.value))}
                    className="w-full accent-primary"
                  />
                </div>

                {/* Time window slider */}
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">
                    Dedup Window: {timeWindow / 1000}s
                  </label>
                  <input
                    type="range"
                    min="1000"
                    max="10000"
                    step="1000"
                    value={timeWindow}
                    onChange={(e) => setTimeWindow(Number(e.target.value))}
                    className="w-full accent-primary"
                  />
                </div>

                <div className="space-y-2 pt-2">
                  <button
                    onClick={simulateBurst}
                    disabled={testingBurst}
                    className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
                  >
                    {testingBurst ? (
                      <span className="flex items-center justify-center gap-2">
                        <motion.div
                          className="size-3 rounded-full border-2 border-primary-foreground border-t-transparent"
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        />
                        Processing...
                      </span>
                    ) : (
                      `Send ${burstCount} Identical Requests`
                    )}
                  </button>

                  <button
                    onClick={simulateVaried}
                    disabled={testingBurst}
                    className="w-full rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-purple-700 disabled:opacity-50"
                  >
                    Send Mixed Requests
                  </button>

                  <button
                    onClick={deduplicator.clearAll}
                    className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
                  >
                    Clear All
                  </button>
                </div>
              </div>
            </div>

            {/* Configuration */}
            <div className="rounded-xl border border-border/50 bg-card p-4">
              <h3 className="mb-3 text-sm font-semibold">Configuration</h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Time Window</span>
                  <span className="font-mono">{timeWindow}ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Max Cache Size</span>
                  <span className="font-mono">100</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Key Generator</span>
                  <span className="font-mono">method:url:body</span>
                </div>
              </div>
            </div>

            {/* Feature List */}
            <div className="rounded-xl border border-dashed border-border/50 bg-muted/20 p-4">
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Features
              </h3>
              <ul className="space-y-1.5 text-xs text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="size-1 rounded-full bg-emerald-500" />
                  Automatic request deduplication
                </li>
                <li className="flex items-center gap-2">
                  <div className="size-1 rounded-full bg-emerald-500" />
                  Configurable time window
                </li>
                <li className="flex items-center gap-2">
                  <div className="size-1 rounded-full bg-emerald-500" />
                  In-flight request coalescing
                </li>
                <li className="flex items-center gap-2">
                  <div className="size-1 rounded-full bg-emerald-500" />
                  Cache hit rate metrics
                </li>
                <li className="flex items-center gap-2">
                  <div className="size-1 rounded-full bg-emerald-500" />
                  Custom key generation
                </li>
                <li className="flex items-center gap-2">
                  <div className="size-1 rounded-full bg-emerald-500" />
                  Zero dependencies
                </li>
              </ul>
            </div>

            {/* How It Works */}
            <div className="rounded-xl border border-border/50 bg-card p-4">
              <h3 className="mb-3 text-sm font-semibold">How It Works</h3>
              <div className="space-y-3 text-xs text-muted-foreground">
                <div className="flex gap-2">
                  <span className="size-5 flex items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] font-bold">
                    1
                  </span>
                  <p>
                    Request comes in, key is generated from method + URL + body
                  </p>
                </div>
                <div className="flex gap-2">
                  <span className="size-5 flex items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] font-bold">
                    2
                  </span>
                  <p>Check if identical request exists within time window</p>
                </div>
                <div className="flex gap-2">
                  <span className="size-5 flex items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] font-bold">
                    3
                  </span>
                  <p>Return cached response or wait for in-flight request</p>
                </div>
                <div className="flex gap-2">
                  <span className="size-5 flex items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] font-bold">
                    4
                  </span>
                  <p>Cache response for future duplicates</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
