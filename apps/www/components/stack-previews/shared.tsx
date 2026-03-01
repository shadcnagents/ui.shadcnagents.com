"use client"

import { useMemo, useRef } from "react"
import { motion, useInView, type UseInViewOptions } from "motion/react"

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

/* ─── ShimmeringText ─── */

export function ShimmeringText({
  text,
  duration = 2,
  delay = 0,
  repeat = true,
  repeatDelay = 0.5,
  className,
  startOnView = true,
  once = false,
  inViewMargin,
  spread = 2,
  color,
  shimmerColor,
}: {
  text: string
  duration?: number
  delay?: number
  repeat?: boolean
  repeatDelay?: number
  className?: string
  startOnView?: boolean
  once?: boolean
  inViewMargin?: UseInViewOptions["margin"]
  spread?: number
  color?: string
  shimmerColor?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once, margin: inViewMargin })

  const dynamicSpread = useMemo(() => text.length * spread, [text, spread])
  const shouldAnimate = !startOnView || isInView

  return (
    <motion.span
      ref={ref}
      className={[
        "relative inline-block bg-[length:250%_100%,auto] bg-clip-text text-transparent",
        "[--base-color:var(--muted-foreground)] [--shimmer-color:var(--foreground)]",
        "[background-repeat:no-repeat,padding-box]",
        "[--shimmer-bg:linear-gradient(90deg,transparent_calc(50%-var(--spread)),var(--shimmer-color),transparent_calc(50%+var(--spread)))]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={
        {
          "--spread": `${dynamicSpread}px`,
          ...(color && { "--base-color": color }),
          ...(shimmerColor && { "--shimmer-color": shimmerColor }),
          backgroundImage: `var(--shimmer-bg), linear-gradient(var(--base-color), var(--base-color))`,
        } as React.CSSProperties
      }
      initial={{ backgroundPosition: "100% center", opacity: 0 }}
      animate={
        shouldAnimate
          ? { backgroundPosition: "0% center", opacity: 1 }
          : {}
      }
      transition={{
        backgroundPosition: {
          repeat: repeat ? Infinity : 0,
          duration,
          delay,
          repeatDelay,
          ease: "linear",
        },
        opacity: { duration: 0.3, delay },
      }}
    >
      {text}
    </motion.span>
  )
}
