"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { AnimatePresence, motion } from "motion/react"

// ============================================================================
// MODEL PRICING (per 1M tokens, as of 2025)
// ============================================================================

export const MODEL_PRICING: Record<
  string,
  { input: number; output: number; name: string }
> = {
  "gpt-4o": { input: 2.5, output: 10.0, name: "GPT-4o" },
  "gpt-4o-mini": { input: 0.15, output: 0.6, name: "GPT-4o Mini" },
  "gpt-4-turbo": { input: 10.0, output: 30.0, name: "GPT-4 Turbo" },
  "claude-3-5-sonnet": { input: 3.0, output: 15.0, name: "Claude 3.5 Sonnet" },
  "claude-3-5-haiku": { input: 0.8, output: 4.0, name: "Claude 3.5 Haiku" },
  "claude-3-opus": { input: 15.0, output: 75.0, name: "Claude 3 Opus" },
  "gemini-1.5-pro": { input: 1.25, output: 5.0, name: "Gemini 1.5 Pro" },
  "gemini-1.5-flash": { input: 0.075, output: 0.3, name: "Gemini 1.5 Flash" },
}

// ============================================================================
// TYPES
// ============================================================================

export interface TokenUsage {
  inputTokens: number
  outputTokens: number
  timestamp: number
  model: string
  conversationId?: string
}

export interface CostMetrics {
  totalInputTokens: number
  totalOutputTokens: number
  totalCost: number
  sessionCost: number
  todayCost: number
  usageHistory: TokenUsage[]
}

export interface BudgetConfig {
  daily?: number
  monthly?: number
  session?: number
}

export type BudgetAlert = "none" | "warning" | "critical" | "exceeded"

// ============================================================================
// COST TRACKER HOOK
// ============================================================================

const STORAGE_KEY = "ai-cost-tracker"

function loadStoredMetrics(): CostMetrics {
  if (typeof window === "undefined") {
    return {
      totalInputTokens: 0,
      totalOutputTokens: 0,
      totalCost: 0,
      sessionCost: 0,
      todayCost: 0,
      usageHistory: [],
    }
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      // Filter today's usage
      const today = new Date().toDateString()
      const todayUsage =
        parsed.usageHistory?.filter(
          (u: TokenUsage) => new Date(u.timestamp).toDateString() === today
        ) || []

      const todayCost = todayUsage.reduce((sum: number, u: TokenUsage) => {
        const pricing = MODEL_PRICING[u.model] || MODEL_PRICING["gpt-4o-mini"]
        return sum + calculateCost(u.inputTokens, u.outputTokens, pricing)
      }, 0)

      return {
        ...parsed,
        todayCost,
        sessionCost: 0, // Reset session on page load
      }
    }
  } catch {
    // Ignore storage errors
  }

  return {
    totalInputTokens: 0,
    totalOutputTokens: 0,
    totalCost: 0,
    sessionCost: 0,
    todayCost: 0,
    usageHistory: [],
  }
}

function calculateCost(
  inputTokens: number,
  outputTokens: number,
  pricing: { input: number; output: number }
): number {
  return (
    (inputTokens / 1_000_000) * pricing.input +
    (outputTokens / 1_000_000) * pricing.output
  )
}

export function useCostTracker(budget?: BudgetConfig) {
  const [metrics, setMetrics] = useState<CostMetrics>(loadStoredMetrics)
  const [currentModel, setCurrentModel] = useState<string>("gpt-4o-mini")

  // Persist to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(metrics))
    }
  }, [metrics])

  const trackUsage = useCallback((usage: Omit<TokenUsage, "timestamp">) => {
    const pricing = MODEL_PRICING[usage.model] || MODEL_PRICING["gpt-4o-mini"]
    const cost = calculateCost(usage.inputTokens, usage.outputTokens, pricing)

    setMetrics((prev) => {
      const newUsage: TokenUsage = {
        ...usage,
        timestamp: Date.now(),
      }

      return {
        totalInputTokens: prev.totalInputTokens + usage.inputTokens,
        totalOutputTokens: prev.totalOutputTokens + usage.outputTokens,
        totalCost: prev.totalCost + cost,
        sessionCost: prev.sessionCost + cost,
        todayCost: prev.todayCost + cost,
        usageHistory: [...prev.usageHistory.slice(-999), newUsage],
      }
    })
  }, [])

  const getBudgetAlert = useCallback((): BudgetAlert => {
    if (!budget) return "none"

    if (budget.session && metrics.sessionCost >= budget.session)
      return "exceeded"
    if (budget.daily && metrics.todayCost >= budget.daily) return "exceeded"
    if (budget.monthly && metrics.totalCost >= budget.monthly) return "exceeded"

    if (budget.session && metrics.sessionCost >= budget.session * 0.9)
      return "critical"
    if (budget.daily && metrics.todayCost >= budget.daily * 0.9)
      return "critical"
    if (budget.monthly && metrics.totalCost >= budget.monthly * 0.9)
      return "critical"

    if (budget.session && metrics.sessionCost >= budget.session * 0.7)
      return "warning"
    if (budget.daily && metrics.todayCost >= budget.daily * 0.7)
      return "warning"
    if (budget.monthly && metrics.totalCost >= budget.monthly * 0.7)
      return "warning"

    return "none"
  }, [budget, metrics])

  const estimateMonthlyProjection = useCallback((): number => {
    const daysInMonth = 30
    const today = new Date()
    const dayOfMonth = today.getDate()

    if (dayOfMonth === 0 || metrics.todayCost === 0) return 0

    const avgDailyCost = metrics.totalCost / Math.max(1, dayOfMonth)
    return avgDailyCost * daysInMonth
  }, [metrics])

  const reset = useCallback((scope: "session" | "all" = "session") => {
    if (scope === "all") {
      setMetrics({
        totalInputTokens: 0,
        totalOutputTokens: 0,
        totalCost: 0,
        sessionCost: 0,
        todayCost: 0,
        usageHistory: [],
      })
      if (typeof window !== "undefined") {
        localStorage.removeItem(STORAGE_KEY)
      }
    } else {
      setMetrics((prev) => ({
        ...prev,
        sessionCost: 0,
      }))
    }
  }, [])

  return {
    metrics,
    currentModel,
    setCurrentModel,
    trackUsage,
    getBudgetAlert,
    estimateMonthlyProjection,
    reset,
  }
}

// ============================================================================
// COST DISPLAY COMPONENT
// ============================================================================

function formatCost(cost: number): string {
  if (cost < 0.01) return `$${(cost * 100).toFixed(3)}¢`
  if (cost < 1) return `$${cost.toFixed(4)}`
  return `$${cost.toFixed(2)}`
}

function formatTokens(tokens: number): string {
  if (tokens >= 1_000_000) return `${(tokens / 1_000_000).toFixed(2)}M`
  if (tokens >= 1_000) return `${(tokens / 1_000).toFixed(1)}K`
  return tokens.toString()
}

export function CostDisplay({
  metrics,
  budget,
  alert,
  showDetails = true,
}: {
  metrics: CostMetrics
  budget?: BudgetConfig
  alert: BudgetAlert
  showDetails?: boolean
}) {
  const alertColors = {
    none: "bg-emerald-500",
    warning: "bg-amber-500",
    critical: "bg-orange-500",
    exceeded: "bg-red-500",
  }

  return (
    <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
      {/* Main Cost Display */}
      <div className="p-4 border-b border-border/30">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Session Cost
            </p>
            <motion.p
              key={metrics.sessionCost}
              initial={{ scale: 1.1, color: "hsl(var(--primary))" }}
              animate={{ scale: 1, color: "hsl(var(--foreground))" }}
              className="text-3xl font-bold tabular-nums tracking-tight"
            >
              {formatCost(metrics.sessionCost)}
            </motion.p>
          </div>

          <div className="flex items-center gap-2">
            <motion.div
              className={`size-2.5 rounded-full ${alertColors[alert]}`}
              animate={alert !== "none" ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 1, repeat: Infinity }}
            />
            <span className="text-xs font-medium capitalize text-muted-foreground">
              {alert === "none" ? "On track" : alert}
            </span>
          </div>
        </div>

        {/* Budget progress */}
        {budget?.session && (
          <div className="mt-3">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Session budget</span>
              <span>{formatCost(budget.session)}</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <motion.div
                className={`h-full ${alertColors[alert]}`}
                initial={{ width: "0%" }}
                animate={{
                  width: `${Math.min(100, (metrics.sessionCost / budget.session) * 100)}%`,
                }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Token Breakdown */}
      {showDetails && (
        <div className="p-4 grid grid-cols-2 gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Input Tokens
            </p>
            <p className="text-lg font-semibold tabular-nums">
              {formatTokens(metrics.totalInputTokens)}
            </p>
            <p className="text-xs text-blue-500">
              {formatCost((metrics.totalInputTokens / 1_000_000) * 0.15)}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Output Tokens
            </p>
            <p className="text-lg font-semibold tabular-nums">
              {formatTokens(metrics.totalOutputTokens)}
            </p>
            <p className="text-xs text-purple-500">
              {formatCost((metrics.totalOutputTokens / 1_000_000) * 0.6)}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================================================
// LIVE COST METER
// ============================================================================

export function LiveCostMeter({
  cost,
  budget,
  label = "Current",
}: {
  cost: number
  budget?: number
  label?: string
}) {
  const percentage = budget ? Math.min(100, (cost / budget) * 100) : 0
  const radius = 40
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  const getColor = () => {
    if (!budget) return "stroke-primary"
    if (percentage >= 100) return "stroke-red-500"
    if (percentage >= 90) return "stroke-orange-500"
    if (percentage >= 70) return "stroke-amber-500"
    return "stroke-emerald-500"
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <svg width="100" height="100" className="-rotate-90">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            strokeWidth="8"
            className="stroke-muted"
          />
          {/* Progress circle */}
          <motion.circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            strokeWidth="8"
            strokeLinecap="round"
            className={getColor()}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            style={{ strokeDasharray: circumference }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            key={cost}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            className="text-lg font-bold tabular-nums"
          >
            {formatCost(cost)}
          </motion.span>
          {budget && (
            <span className="text-[10px] text-muted-foreground">
              / {formatCost(budget)}
            </span>
          )}
        </div>
      </div>
      <span className="mt-2 text-xs font-medium text-muted-foreground">
        {label}
      </span>
    </div>
  )
}

// ============================================================================
// USAGE TIMELINE
// ============================================================================

export function UsageTimeline({ history }: { history: TokenUsage[] }) {
  const recentHistory = history.slice(-20)

  if (recentHistory.length === 0) {
    return (
      <div className="rounded-xl border border-border/50 bg-card p-4">
        <h3 className="text-sm font-semibold mb-3">Usage Timeline</h3>
        <p className="text-xs text-muted-foreground text-center py-8">
          No usage yet
        </p>
      </div>
    )
  }

  const maxTokens = Math.max(
    ...recentHistory.map((u) => u.inputTokens + u.outputTokens)
  )

  return (
    <div className="rounded-xl border border-border/50 bg-card p-4">
      <h3 className="text-sm font-semibold mb-3">Usage Timeline</h3>
      <div className="flex items-end gap-1 h-24">
        {recentHistory.map((usage, i) => {
          const height =
            ((usage.inputTokens + usage.outputTokens) / maxTokens) * 100
          const inputRatio =
            usage.inputTokens / (usage.inputTokens + usage.outputTokens)

          return (
            <motion.div
              key={i}
              className="flex-1 flex flex-col justify-end min-w-[4px] group relative"
              initial={{ height: 0 }}
              animate={{ height: `${height}%` }}
              transition={{ duration: 0.3, delay: i * 0.02 }}
            >
              {/* Input tokens (blue) */}
              <div
                className="w-full bg-blue-500 rounded-t-sm"
                style={{ height: `${inputRatio * 100}%` }}
              />
              {/* Output tokens (purple) */}
              <div
                className="w-full bg-purple-500 rounded-b-sm"
                style={{ height: `${(1 - inputRatio) * 100}%` }}
              />

              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                <div className="bg-popover border border-border rounded-lg px-2 py-1 text-xs whitespace-nowrap shadow-lg">
                  <div className="font-medium">
                    {MODEL_PRICING[usage.model]?.name || usage.model}
                  </div>
                  <div className="text-muted-foreground">
                    {formatTokens(usage.inputTokens)} in /{" "}
                    {formatTokens(usage.outputTokens)} out
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-3">
        <div className="flex items-center gap-1.5">
          <div className="size-2 rounded-full bg-blue-500" />
          <span className="text-[10px] text-muted-foreground">Input</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="size-2 rounded-full bg-purple-500" />
          <span className="text-[10px] text-muted-foreground">Output</span>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// MODEL COST COMPARISON
// ============================================================================

export function ModelCostComparison({
  selectedModel,
  onSelectModel,
  inputTokens = 1000,
  outputTokens = 500,
}: {
  selectedModel: string
  onSelectModel: (model: string) => void
  inputTokens?: number
  outputTokens?: number
}) {
  const models = useMemo(() => {
    return Object.entries(MODEL_PRICING)
      .map(([id, pricing]) => ({
        id,
        ...pricing,
        cost: calculateCost(inputTokens, outputTokens, pricing),
      }))
      .sort((a, b) => a.cost - b.cost)
  }, [inputTokens, outputTokens])

  const maxCost = Math.max(...models.map((m) => m.cost))

  return (
    <div className="rounded-xl border border-border/50 bg-card p-4">
      <h3 className="text-sm font-semibold mb-3">Model Comparison</h3>
      <p className="text-xs text-muted-foreground mb-4">
        Cost for {formatTokens(inputTokens)} input +{" "}
        {formatTokens(outputTokens)} output
      </p>

      <div className="space-y-2">
        {models.map((model) => (
          <button
            key={model.id}
            onClick={() => onSelectModel(model.id)}
            className={`w-full text-left rounded-lg p-2 transition-colors ${
              selectedModel === model.id
                ? "bg-primary/10 border border-primary/30"
                : "hover:bg-muted/50 border border-transparent"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium">{model.name}</span>
              <span className="text-xs font-mono tabular-nums">
                {formatCost(model.cost)}
              </span>
            </div>
            <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
              <motion.div
                className={`h-full ${
                  selectedModel === model.id
                    ? "bg-primary"
                    : "bg-muted-foreground/30"
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${(model.cost / maxCost) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

// ============================================================================
// BUDGET ALERT BANNER
// ============================================================================

export function BudgetAlertBanner({
  alert,
  onDismiss,
}: {
  alert: BudgetAlert
  onDismiss?: () => void
}) {
  if (alert === "none") return null

  const config = {
    warning: {
      bg: "bg-amber-500/10 border-amber-500/30",
      text: "text-amber-600 dark:text-amber-400",
      icon: "⚠️",
      message: "Approaching budget limit",
    },
    critical: {
      bg: "bg-orange-500/10 border-orange-500/30",
      text: "text-orange-600 dark:text-orange-400",
      icon: "🔥",
      message: "90% of budget used",
    },
    exceeded: {
      bg: "bg-red-500/10 border-red-500/30",
      text: "text-red-600 dark:text-red-400",
      icon: "🚨",
      message: "Budget exceeded!",
    },
  }

  const c = config[alert]

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className={`rounded-lg border ${c.bg} p-3 flex items-center justify-between`}
      >
        <div className="flex items-center gap-2">
          <span>{c.icon}</span>
          <span className={`text-sm font-medium ${c.text}`}>{c.message}</span>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-muted-foreground hover:text-foreground"
          >
            <svg
              className="size-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </motion.div>
    </AnimatePresence>
  )
}
