"use client"

import { AnimatePresence, motion } from "motion/react"

/* ─── Motion Constants ─── */

export const SPRING = { type: "spring" as const, stiffness: 400, damping: 30 }

export const FADE_UP = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
}

export const STAGGER = { staggerChildren: 0.06 }

/* ─── Shared Keyframes (inject once via <style>) ─── */

export const WAVE_KEYFRAMES = `
@keyframes dot-pulse{0%,80%,100%{opacity:.15;transform:translateY(0)}40%{opacity:.6;transform:translateY(-4px)}}
@keyframes gt-blink{0%,100%{opacity:1}50%{opacity:0}}
`

/* ─── PulseDotsLoader ─── */

export function WaveDotsLoader() {
  return (
    <div className="flex items-center justify-center gap-1">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="size-[5px] rounded-full bg-foreground"
          style={{
            animation: "dot-pulse 1.4s ease-in-out infinite",
            animationDelay: `${i * 0.16}s`,
          }}
        />
      ))}
    </div>
  )
}

/* ─── SuggestionPills ─── */

export function SuggestionPills({
  suggestions,
  onSelect,
}: {
  suggestions: string[]
  onSelect: (text: string) => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 4 }}
      transition={{ duration: 0.25 }}
      className="flex flex-wrap gap-2"
    >
      {suggestions.map((s) => (
        <button
          key={s}
          onClick={() => onSelect(s)}
          className="rounded-full border border-border/60 bg-card/50 px-3 py-1.5 text-sm text-muted-foreground transition-all duration-150 hover:border-foreground/20 hover:bg-card hover:text-foreground"
        >
          {s}
        </button>
      ))}
    </motion.div>
  )
}
