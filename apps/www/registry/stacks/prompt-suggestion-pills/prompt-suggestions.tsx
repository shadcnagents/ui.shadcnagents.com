"use client"

import { motion } from "motion/react"
import { cn } from "@/lib/utils"

const SUGGESTIONS = [
  { icon: "⬡", label: "Understand code", text: "Explain this codebase to me" },
  { icon: "⚡", label: "Write tests", text: "Write unit tests for my API routes" },
  { icon: "⬢", label: "Find bugs", text: "Find security vulnerabilities" },
  { icon: "✦", label: "Refactor", text: "Refactor this component to use hooks" },
]

export function PromptSuggestions({
  onSelect,
}: {
  onSelect: (text: string) => void
}) {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-6 py-12">
      <div className="text-center">
        <h2 className="text-xl font-semibold tracking-tight">What can I help you build?</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Select a suggestion or type your own below
        </p>
      </div>

      <div className="grid w-full grid-cols-2 gap-2">
        {SUGGESTIONS.map((s, i) => (
          <motion.button
            key={s.text}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            onClick={() => onSelect(s.text)}
            className="flex flex-col items-start rounded-xl border border-border/40 p-4 text-left transition-all hover:border-foreground/20 hover:bg-muted/30"
          >
            <span className="text-xl">{s.icon}</span>
            <span className="mt-2 text-sm font-medium leading-snug">{s.text}</span>
            <span className="mt-0.5 text-xs text-muted-foreground/50">{s.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  )
}