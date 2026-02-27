"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

const MODEL_LIMITS: Record<string, number> = {
  "claude-sonnet-4-5": 200000,
  "gpt-4o": 128000,
  "gemini-1.5-pro": 1000000,
}

// Rough estimate: 1 token ≈ 4 chars for English
function estimateTokens(text: string) {
  return Math.round(text.length / 4)
}

export function TokenCounter({
  model = "gpt-4o",
  value,
  onChange,
}: {
  model?: string
  value: string
  onChange: (v: string) => void
}) {
  const limit = MODEL_LIMITS[model] ?? 128000
  const tokens = estimateTokens(value)
  const pct = Math.min((tokens / limit) * 100, 100)

  const R = 18
  const circ = 2 * Math.PI * R
  const dash = (pct / 100) * circ

  const color =
    pct < 50 ? "text-emerald-500 stroke-emerald-500"
    : pct < 80 ? "text-amber-500 stroke-amber-500"
    : "text-red-500 stroke-red-500"

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">Context window</span>
        <div className="flex items-center gap-2">
          <svg width="32" height="32" className="-rotate-90">
            <circle cx="16" cy="16" r={R} className="stroke-border/40" strokeWidth="3" fill="none" />
            <circle
              cx="16" cy="16" r={R}
              className={color.split(" ")[1]}
              strokeWidth="3" fill="none"
              strokeDasharray={`${dash} ${circ}`}
              strokeLinecap="round"
              style={{ transition: "stroke-dasharray 0.2s ease" }}
            />
          </svg>
          <span className={cn("font-mono text-xs", color.split(" ")[0])}>
            {tokens.toLocaleString()} / {(limit / 1000).toFixed(0)}k
          </span>
        </div>
      </div>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type your prompt…"
        className="h-32 w-full resize-none rounded-lg border border-border/40 bg-muted/20 p-3 text-sm outline-none placeholder:text-muted-foreground/30"
      />
    </div>
  )
}