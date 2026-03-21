"use client"

import { useCallback, useState } from "react"
import { useChat } from "@ai-sdk/react"
import { motion } from "motion/react"

import {
  RateLimitMetricsPanel,
  RateLimitStatus,
  RetryQueue,
  useRateLimiter,
} from "../components/rate-limiter"

export default function RateLimitDemo() {
  const rateLimiter = useRateLimiter({
    maxRetries: 5,
    baseDelay: 1000,
    maxDelay: 10000,
    jitterFactor: 0.3,
    circuitBreakerThreshold: 5,
    circuitBreakerResetTime: 15000,
  })

  const [testingBurst, setTestingBurst] = useState(false)

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    setMessages,
  } = useChat({
    onResponse: (response) => {
      rateLimiter.updateFromHeaders(response.headers)
    },
    onError: (error) => {
      rateLimiter.recordError(error.message)
    },
  })

  // Simulate burst requests to trigger rate limiting
  const simulateBurst = useCallback(async () => {
    setTestingBurst(true)

    const requests = Array.from({ length: 8 }, (_, i) => ({
      id: crypto.randomUUID(),
      index: i,
    }))

    await Promise.allSettled(
      requests.map(async ({ id }) => {
        try {
          await rateLimiter.executeWithRetry(async () => {
            const response = await fetch("/api/chat", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                messages: [{ role: "user", content: "Test message" }],
              }),
            })

            if (!response.ok) {
              const error: any = new Error(`HTTP ${response.status}`)
              error.status = response.status
              throw error
            }

            rateLimiter.updateFromHeaders(response.headers)
            return response
          }, id)
        } catch {
          // Handled by rateLimiter
        }
      })
    )

    setTestingBurst(false)
  }, [rateLimiter])

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="mx-auto max-w-5xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold tracking-tight">
                Rate Limit Handler
              </h1>
              <p className="text-sm text-muted-foreground">
                Production-ready rate limiting with exponential backoff
              </p>
            </div>
            <RateLimitStatus
              state={rateLimiter.state}
              metrics={rateLimiter.metrics}
              compact
            />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8">
        <div className="grid gap-6 lg:grid-cols-[1fr,320px]">
          {/* Main Chat Area */}
          <div className="space-y-6">
            {/* Status Card */}
            <RateLimitStatus
              state={rateLimiter.state}
              metrics={rateLimiter.metrics}
            />

            {/* Chat Interface */}
            <div className="rounded-xl border border-border/50 bg-card">
              <div className="border-b border-border/50 px-4 py-3">
                <h2 className="text-sm font-medium">Chat Interface</h2>
                <p className="text-xs text-muted-foreground">
                  Send messages to test rate limiting
                </p>
              </div>

              {/* Messages */}
              <div className="h-[300px] overflow-y-auto p-4">
                {messages.length === 0 ? (
                  <div className="flex h-full items-center justify-center">
                    <p className="text-sm text-muted-foreground/50">
                      Send a message or simulate a burst...
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {messages.map((m) => (
                      <div
                        key={m.id}
                        className={`flex ${
                          m.role === "user" ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                            m.role === "user"
                              ? "rounded-br-sm bg-primary text-primary-foreground"
                              : "rounded-bl-sm bg-muted"
                          }`}
                        >
                          {m.content}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="border-t border-border/50 p-4">
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <input
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Type a message..."
                    disabled={isLoading || rateLimiter.state === "circuit-open"}
                    className="flex-1 rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none placeholder:text-muted-foreground/50 focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={
                      isLoading ||
                      !input.trim() ||
                      rateLimiter.state === "circuit-open"
                    }
                    className="rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
                  >
                    Send
                  </button>
                </form>
              </div>
            </div>

            {/* Retry Queue */}
            <RetryQueue items={rateLimiter.retryQueue} />
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Test Controls */}
            <div className="rounded-xl border border-border/50 bg-card p-4">
              <h3 className="mb-3 text-sm font-semibold">Test Controls</h3>
              <div className="space-y-2">
                <button
                  onClick={simulateBurst}
                  disabled={
                    testingBurst || rateLimiter.state === "circuit-open"
                  }
                  className="w-full rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-amber-600 disabled:opacity-50"
                >
                  {testingBurst ? (
                    <span className="flex items-center justify-center gap-2">
                      <motion.div
                        className="size-3 rounded-full border-2 border-white border-t-transparent"
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                      Sending 8 requests...
                    </span>
                  ) : (
                    "Simulate Burst (8 requests)"
                  )}
                </button>

                <button
                  onClick={rateLimiter.reset}
                  className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
                >
                  Reset Rate Limiter
                </button>

                <button
                  onClick={() => setMessages([])}
                  className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
                >
                  Clear Messages
                </button>
              </div>
            </div>

            {/* Metrics */}
            <div className="rounded-xl border border-border/50 bg-card p-4">
              <h3 className="mb-3 text-sm font-semibold">Metrics</h3>
              <RateLimitMetricsPanel metrics={rateLimiter.metrics} />
            </div>

            {/* Configuration */}
            <div className="rounded-xl border border-border/50 bg-card p-4">
              <h3 className="mb-3 text-sm font-semibold">Configuration</h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Max Retries</span>
                  <span className="font-mono">5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Base Delay</span>
                  <span className="font-mono">1000ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Max Delay</span>
                  <span className="font-mono">10000ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Jitter Factor</span>
                  <span className="font-mono">0.3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Circuit Threshold
                  </span>
                  <span className="font-mono">5 errors</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Circuit Reset</span>
                  <span className="font-mono">15s</span>
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
                  Exponential backoff with jitter
                </li>
                <li className="flex items-center gap-2">
                  <div className="size-1 rounded-full bg-emerald-500" />
                  Circuit breaker pattern
                </li>
                <li className="flex items-center gap-2">
                  <div className="size-1 rounded-full bg-emerald-500" />
                  Real-time retry queue
                </li>
                <li className="flex items-center gap-2">
                  <div className="size-1 rounded-full bg-emerald-500" />
                  Rate limit header parsing
                </li>
                <li className="flex items-center gap-2">
                  <div className="size-1 rounded-full bg-emerald-500" />
                  Automatic state management
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
