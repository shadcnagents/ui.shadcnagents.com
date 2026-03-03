"use client"

import { useState, useEffect } from "react"
import { useChat } from "@ai-sdk/react"
import {
  useCostTracker,
  CostDisplay,
  LiveCostMeter,
  UsageTimeline,
  ModelCostComparison,
  BudgetAlertBanner,
  MODEL_PRICING,
} from "../components/cost-tracker"
import { motion } from "motion/react"

export default function CostTrackerDemo() {
  const [budget] = useState({
    session: 0.50,
    daily: 5.00,
    monthly: 50.00,
  })

  const [dismissed, setDismissed] = useState(false)

  const costTracker = useCostTracker(budget)
  const alert = costTracker.getBudgetAlert()
  const projection = costTracker.estimateMonthlyProjection()

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    body: { model: costTracker.currentModel },
    onFinish: (message) => {
      // Estimate tokens (rough approximation for demo)
      const inputTokens = messages.reduce((sum, m) => sum + Math.ceil(m.content.length / 4), 0)
      const outputTokens = Math.ceil(message.content.length / 4)

      costTracker.trackUsage({
        model: costTracker.currentModel,
        inputTokens,
        outputTokens,
      })
    },
  })

  // Simulate some initial data for demo
  useEffect(() => {
    if (costTracker.metrics.usageHistory.length === 0) {
      const demoData = [
        { model: "gpt-4o-mini", inputTokens: 500, outputTokens: 200 },
        { model: "gpt-4o-mini", inputTokens: 800, outputTokens: 350 },
        { model: "gpt-4o", inputTokens: 300, outputTokens: 450 },
        { model: "claude-3-5-sonnet", inputTokens: 600, outputTokens: 280 },
        { model: "gpt-4o-mini", inputTokens: 400, outputTokens: 180 },
      ]
      demoData.forEach((d, i) => {
        setTimeout(() => costTracker.trackUsage(d), i * 100)
      })
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="mx-auto max-w-6xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold tracking-tight">Cost Tracker</h1>
              <p className="text-sm text-muted-foreground">
                Real-time token usage and cost monitoring
              </p>
            </div>

            {/* Live cost badge */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Session</p>
                <motion.p
                  key={costTracker.metrics.sessionCost}
                  initial={{ scale: 1.05 }}
                  animate={{ scale: 1 }}
                  className="text-lg font-bold tabular-nums"
                >
                  ${costTracker.metrics.sessionCost.toFixed(4)}
                </motion.p>
              </div>
              <div className="h-8 w-px bg-border" />
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Today</p>
                <p className="text-lg font-bold tabular-nums">
                  ${costTracker.metrics.todayCost.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        {/* Budget Alert */}
        {!dismissed && alert !== "none" && (
          <div className="mb-6">
            <BudgetAlertBanner alert={alert} onDismiss={() => setDismissed(true)} />
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[1fr,380px]">
          {/* Main Content */}
          <div className="space-y-6">
            {/* Cost Overview Cards */}
            <div className="grid grid-cols-3 gap-4">
              <LiveCostMeter
                cost={costTracker.metrics.sessionCost}
                budget={budget.session}
                label="Session"
              />
              <LiveCostMeter
                cost={costTracker.metrics.todayCost}
                budget={budget.daily}
                label="Today"
              />
              <LiveCostMeter
                cost={projection}
                budget={budget.monthly}
                label="Projected/mo"
              />
            </div>

            {/* Main Cost Display */}
            <CostDisplay
              metrics={costTracker.metrics}
              budget={budget}
              alert={alert}
            />

            {/* Usage Timeline */}
            <UsageTimeline history={costTracker.metrics.usageHistory} />

            {/* Chat Interface */}
            <div className="rounded-xl border border-border/50 bg-card">
              <div className="border-b border-border/50 px-4 py-3 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-medium">Test Chat</h2>
                  <p className="text-xs text-muted-foreground">
                    Using {MODEL_PRICING[costTracker.currentModel]?.name || costTracker.currentModel}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Est. cost per message</p>
                  <p className="text-sm font-mono">
                    ~${((MODEL_PRICING[costTracker.currentModel]?.input || 0.15) * 0.001).toFixed(4)}
                  </p>
                </div>
              </div>

              {/* Messages */}
              <div className="h-[250px] overflow-y-auto p-4">
                {messages.length === 0 ? (
                  <div className="flex h-full items-center justify-center">
                    <p className="text-sm text-muted-foreground/50">
                      Send messages to track costs...
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
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="rounded-2xl rounded-bl-sm bg-muted px-4 py-3">
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
                        </div>
                      </div>
                    )}
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
                    disabled={isLoading}
                    className="flex-1 rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none placeholder:text-muted-foreground/50 focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
                  >
                    Send
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Model Selection */}
            <ModelCostComparison
              selectedModel={costTracker.currentModel}
              onSelectModel={costTracker.setCurrentModel}
              inputTokens={1000}
              outputTokens={500}
            />

            {/* Budget Settings */}
            <div className="rounded-xl border border-border/50 bg-card p-4">
              <h3 className="text-sm font-semibold mb-3">Budget Limits</h3>
              <div className="space-y-3">
                <BudgetRow label="Session" value={budget.session} current={costTracker.metrics.sessionCost} />
                <BudgetRow label="Daily" value={budget.daily} current={costTracker.metrics.todayCost} />
                <BudgetRow label="Monthly" value={budget.monthly} current={costTracker.metrics.totalCost} />
              </div>
            </div>

            {/* Quick Stats */}
            <div className="rounded-xl border border-border/50 bg-card p-4">
              <h3 className="text-sm font-semibold mb-3">Statistics</h3>
              <div className="space-y-2 text-xs">
                <StatRow
                  label="Total Requests"
                  value={costTracker.metrics.usageHistory.length.toString()}
                />
                <StatRow
                  label="Avg. Tokens/Request"
                  value={
                    costTracker.metrics.usageHistory.length > 0
                      ? Math.round(
                          (costTracker.metrics.totalInputTokens + costTracker.metrics.totalOutputTokens) /
                            costTracker.metrics.usageHistory.length
                        ).toLocaleString()
                      : "0"
                  }
                />
                <StatRow
                  label="Input/Output Ratio"
                  value={
                    costTracker.metrics.totalOutputTokens > 0
                      ? (costTracker.metrics.totalInputTokens / costTracker.metrics.totalOutputTokens).toFixed(2)
                      : "—"
                  }
                />
                <StatRow
                  label="Avg. Cost/Request"
                  value={
                    costTracker.metrics.usageHistory.length > 0
                      ? `$${(costTracker.metrics.totalCost / costTracker.metrics.usageHistory.length).toFixed(4)}`
                      : "$0"
                  }
                />
              </div>
            </div>

            {/* Controls */}
            <div className="rounded-xl border border-border/50 bg-card p-4">
              <h3 className="text-sm font-semibold mb-3">Controls</h3>
              <div className="space-y-2">
                <button
                  onClick={() => costTracker.reset("session")}
                  className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
                >
                  Reset Session
                </button>
                <button
                  onClick={() => costTracker.reset("all")}
                  className="w-full rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/20"
                >
                  Clear All Data
                </button>
              </div>
            </div>

            {/* Features */}
            <div className="rounded-xl border border-dashed border-border/50 bg-muted/20 p-4">
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Features
              </h3>
              <ul className="space-y-1.5 text-xs text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="size-1 rounded-full bg-emerald-500" />
                  Real-time token counting
                </li>
                <li className="flex items-center gap-2">
                  <div className="size-1 rounded-full bg-emerald-500" />
                  Per-model cost calculation
                </li>
                <li className="flex items-center gap-2">
                  <div className="size-1 rounded-full bg-emerald-500" />
                  Budget alerts & warnings
                </li>
                <li className="flex items-center gap-2">
                  <div className="size-1 rounded-full bg-emerald-500" />
                  Usage history & analytics
                </li>
                <li className="flex items-center gap-2">
                  <div className="size-1 rounded-full bg-emerald-500" />
                  Monthly projections
                </li>
                <li className="flex items-center gap-2">
                  <div className="size-1 rounded-full bg-emerald-500" />
                  LocalStorage persistence
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function BudgetRow({
  label,
  value,
  current,
}: {
  label: string
  value: number
  current: number
}) {
  const percentage = (current / value) * 100
  const isOver = percentage >= 100

  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-muted-foreground">{label}</span>
        <span className={`font-mono tabular-nums ${isOver ? "text-destructive" : ""}`}>
          ${current.toFixed(2)} / ${value.toFixed(2)}
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <motion.div
          className={`h-full ${
            isOver
              ? "bg-destructive"
              : percentage >= 70
              ? "bg-amber-500"
              : "bg-emerald-500"
          }`}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, percentage)}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  )
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-mono tabular-nums">{value}</span>
    </div>
  )
}
