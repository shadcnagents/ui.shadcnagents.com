"use client"

import { useCallback, useRef, useState } from "react"
import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"

import { siteConfig } from "@/config/site"

const CELL_SIZE = 28

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [cells, setCells] = useState<{ key: string; x: number; y: number; opacity: number }[]>([])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = Math.floor((e.clientX - rect.left) / CELL_SIZE) * CELL_SIZE
    const y = Math.floor((e.clientY - rect.top) / CELL_SIZE) * CELL_SIZE
    const key = `${x}-${y}`

    setCells((prev) => {
      const exists = prev.find((c) => c.key === key)
      if (exists) {
        return prev.map((c) =>
          c.key === key ? { ...c, opacity: 1 } : { ...c, opacity: Math.max(0, c.opacity - 0.12) }
        ).filter((c) => c.opacity > 0)
      }
      return [
        ...prev.map((c) => ({ ...c, opacity: Math.max(0, c.opacity - 0.12) })).filter((c) => c.opacity > 0),
        { key, x, y, opacity: 1 },
      ]
    })
  }, [])

  const handleMouseLeave = useCallback(() => {
    const fade = () => {
      setCells((prev) => {
        const next = prev.map((c) => ({ ...c, opacity: c.opacity - 0.08 })).filter((c) => c.opacity > 0)
        if (next.length > 0) requestAnimationFrame(fade)
        return next
      })
    }
    fade()
  }, [])

  return (
    <section
      className="relative min-h-[85vh] w-full overflow-hidden bg-background"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Grid container - contained within border frame */}
      <div className="pointer-events-none absolute inset-6 overflow-hidden sm:inset-10 md:inset-14">
        {/* Static grid lines */}
        <div
          ref={containerRef}
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, var(--border) 1px, transparent 1px),
              linear-gradient(to bottom, var(--border) 1px, transparent 1px)
            `,
            backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px`,
            opacity: 0.5,
          }}
        />

        {/* Top fade gradient */}
        <div className="absolute inset-x-0 top-0 z-[1] h-28 bg-gradient-to-b from-background via-background/50 to-transparent" />

        {/* Bottom fade gradient */}
        <div className="absolute inset-x-0 bottom-0 z-[1] h-28 bg-gradient-to-t from-background via-background/50 to-transparent" />

        {/* Left fade gradient */}
        <div className="absolute inset-y-0 left-0 z-[1] w-20 bg-gradient-to-r from-background via-background/30 to-transparent" />

        {/* Right fade gradient */}
        <div className="absolute inset-y-0 right-0 z-[1] w-20 bg-gradient-to-l from-background via-background/30 to-transparent" />

        {/* Interactive hover cells - single box per position */}
        <div className="absolute inset-0">
          {cells.map((cell) => (
            <div
              key={cell.key}
              className="absolute transition-opacity duration-150"
              style={{
                left: cell.x,
                top: cell.y,
                width: CELL_SIZE,
                height: CELL_SIZE,
                backgroundColor: `oklch(0.65 0.28 250 / ${cell.opacity * 0.85})`,
                backgroundImage: cell.opacity < 0.7
                  ? `repeating-conic-gradient(oklch(0.65 0.28 250 / ${cell.opacity * 0.6}) 0% 25%, transparent 0% 50%)`
                  : "none",
                backgroundSize: "4px 4px",
              }}
            />
          ))}
        </div>
      </div>

      {/* Content container */}
      <div className="relative z-10 mx-auto flex min-h-[85vh] max-w-5xl flex-col items-center justify-center px-4 py-20">
        {/* Announcement banner - sharp edges with blinking corner accents */}
        <Link
          href="/stacks"
          className="group relative mb-10 inline-flex items-center gap-2 border border-sky-500/50 bg-sky-500/5 px-5 py-2.5 text-sm text-sky-600 transition-all hover:border-sky-500/70 hover:bg-sky-500/10 dark:text-sky-400"
        >
          {/* Blinking corner accents */}
          <span className="absolute -left-1 -top-1 size-2 animate-pulse bg-sky-500" />
          <span className="absolute -bottom-1 -right-1 size-2 animate-pulse bg-sky-500 [animation-delay:500ms]" />
          <span>
            Introducing {siteConfig.counts.stacks}+ AI SDK stacks. Built for production.
          </span>
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>

        {/* Main heading - normal font */}
        <h1 className="mb-6 text-center text-4xl font-medium leading-[1.1] tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
          Open Source AI SDK Components
          <br />
          & Agent Patterns for Next.js
        </h1>

        {/* Subheading */}
        <p className="mb-10 max-w-2xl text-center text-lg leading-relaxed text-muted-foreground sm:text-xl">
          shadcnagents is an all-in-one component library for building AI agents
          powered by the Vercel AI SDK. Copy-paste stacks for chat, tool calling,
          and orchestration.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          {/* Primary button */}
          <Link
            href="/stacks"
            className="group inline-flex items-center gap-2 bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90"
          >
            <span>View all stacks</span>
            <Sparkles className="size-4 transition-transform group-hover:rotate-12" />
          </Link>

          {/* Secondary button */}
          <Link
            href="/docs"
            className="inline-flex items-center gap-2 border border-border bg-background px-7 py-3.5 text-sm font-medium text-foreground transition-all hover:bg-muted"
          >
            Get started for free
          </Link>
        </div>
      </div>

    </section>
  )
}
