"use client"

import { useState, useRef, useCallback, useEffect, useMemo } from "react"
import { motion, AnimatePresence, useSpring, useMotionValue, useMotionValueEvent } from "motion/react"
import { cn } from "@/lib/utils"
import { PreviewRenderer } from "@/components/hero-previews"

/* -------------------------------------------------------------------------- */
/*                                   Types                                     */
/* -------------------------------------------------------------------------- */

interface TabContent {
  id: string
  label: string
  description: string
}

interface FractionalSliderTabsProps {
  tabs?: TabContent[]
  className?: string
  leftContent?: React.ReactNode
}

/* -------------------------------------------------------------------------- */
/*                              Default Content                                */
/* -------------------------------------------------------------------------- */

const defaultTabs: TabContent[] = [
  {
    id: "generate",
    label: "generateText",
    description: "Generate text with any model",
  },
  {
    id: "stream",
    label: "streamText",
    description: "Stream text in real-time",
  },
  {
    id: "tools",
    label: "tool",
    description: "Give models the ability to act",
  },
  {
    id: "agent",
    label: "Agent",
    description: "Human-in-the-loop workflows",
  },
  {
    id: "object",
    label: "generateObject",
    description: "Structured output with validation",
  },
]

/* -------------------------------------------------------------------------- */
/*                              Audio Engine                                   */
/* -------------------------------------------------------------------------- */

class AudioEngine {
  private ctx: AudioContext | null = null
  private gainNode: GainNode | null = null
  private lastTickTime = 0
  private tickDebounce = 25

  private init() {
    if (this.ctx) return
    this.ctx = new AudioContext()
    this.gainNode = this.ctx.createGain()
    this.gainNode.connect(this.ctx.destination)
    this.gainNode.gain.value = 0.08
  }

  tick(frequency = 2400, duration = 0.015) {
    const now = Date.now()
    if (now - this.lastTickTime < this.tickDebounce) return
    this.lastTickTime = now

    try {
      this.init()
      if (!this.ctx || !this.gainNode) return

      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()

      osc.connect(gain)
      gain.connect(this.gainNode)

      osc.frequency.value = frequency
      osc.type = "sine"

      const t = this.ctx.currentTime
      gain.gain.setValueAtTime(0.3, t)
      gain.gain.exponentialRampToValueAtTime(0.001, t + duration)

      osc.start(t)
      osc.stop(t + duration)
    } catch {}
  }

  snap(frequency = 1800) {
    try {
      this.init()
      if (!this.ctx || !this.gainNode) return

      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()

      osc.connect(gain)
      gain.connect(this.gainNode)

      osc.frequency.value = frequency
      osc.type = "triangle"

      const t = this.ctx.currentTime
      gain.gain.setValueAtTime(0.4, t)
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06)

      osc.start(t)
      osc.stop(t + 0.06)
    } catch {}
  }

  select() {
    try {
      this.init()
      if (!this.ctx || !this.gainNode) return

      const frequencies = [1200, 1600]
      frequencies.forEach((freq, i) => {
        const osc = this.ctx!.createOscillator()
        const gain = this.ctx!.createGain()

        osc.connect(gain)
        gain.connect(this.gainNode!)

        osc.frequency.value = freq
        osc.type = "sine"

        const t = this.ctx!.currentTime + i * 0.02
        gain.gain.setValueAtTime(0.25, t)
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04)

        osc.start(t)
        osc.stop(t + 0.04)
      })
    } catch {}
  }
}

/* -------------------------------------------------------------------------- */
/*                              Ruler Component                                */
/* -------------------------------------------------------------------------- */

function Ruler({
  totalTicks,
  progress,
  tabCount,
  audio,
}: {
  totalTicks: number
  progress: ReturnType<typeof useSpring>
  tabCount: number
  audio: AudioEngine
}) {
  const [currentProgress, setCurrentProgress] = useState(0)
  const lastTickIndex = useRef(-1)
  const ticksPerSection = Math.floor(totalTicks / tabCount)

  useMotionValueEvent(progress, "change", (latest: number) => {
    setCurrentProgress(latest)

    const tickIndex = Math.floor(latest * totalTicks)
    if (tickIndex !== lastTickIndex.current) {
      const isSectionBoundary = tickIndex % ticksPerSection === 0
      audio.tick(isSectionBoundary ? 2000 : 2800, isSectionBoundary ? 0.025 : 0.012)
      lastTickIndex.current = tickIndex
    }
  })

  const getTickHeight = (tickIndex: number) => {
    const tickProgress = tickIndex / totalTicks
    const distance = Math.abs(tickProgress - currentProgress)

    if (distance < 0.005) return 28
    if (distance < 0.012) return 22
    if (distance < 0.025) return 16
    if (distance < 0.045) return 12
    if (distance < 0.07) return 9

    const isSectionStart = tickIndex % ticksPerSection === 0
    return isSectionStart ? 10 : 6
  }

  const getTickOpacity = (tickIndex: number) => {
    const tickProgress = tickIndex / totalTicks
    const distance = Math.abs(tickProgress - currentProgress)

    if (distance < 0.005) return 1
    if (distance < 0.012) return 0.9
    if (distance < 0.025) return 0.7
    if (distance < 0.045) return 0.5
    if (distance < 0.07) return 0.35

    const isSectionStart = tickIndex % ticksPerSection === 0
    return isSectionStart ? 0.25 : 0.15
  }

  return (
    <div className="relative h-10 flex items-end">
      <div className="absolute inset-x-0 bottom-0 flex justify-between">
        {Array.from({ length: totalTicks + 1 }).map((_, i) => (
          <motion.div
            key={i}
            className="w-px origin-bottom flex-shrink-0 bg-foreground"
            animate={{
              height: getTickHeight(i),
              opacity: getTickOpacity(i),
            }}
            transition={{
              height: { type: "spring", stiffness: 800, damping: 35 },
              opacity: { duration: 0.1 },
            }}
          />
        ))}
      </div>

      <motion.div
        className="absolute bottom-0 w-0.5 bg-foreground rounded-full"
        style={{
          left: `${currentProgress * 100}%`,
          x: "-50%",
        }}
        animate={{ height: 32 }}
        transition={{ type: "spring", stiffness: 600, damping: 30 }}
      />
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*                           Preview Block Component                           */
/* -------------------------------------------------------------------------- */

function PreviewBlock({ content }: { content: TabContent }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 30,
        opacity: { duration: 0.2 }
      }}
      className="h-full flex flex-col"
    >
      <div className="flex-1 min-h-[320px]">
        <PreviewRenderer id={content.id} />
      </div>
    </motion.div>
  )
}

/* -------------------------------------------------------------------------- */
/*                       Main FractionalSliderTabs                             */
/* -------------------------------------------------------------------------- */

export function FractionalSliderTabs({
  tabs = defaultTabs,
  className,
  leftContent,
}: FractionalSliderTabsProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const rulerRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)
  const audio = useMemo(() => new AudioEngine(), [])

  const rawProgress = useMotionValue(0)
  const progress = useSpring(rawProgress, {
    stiffness: 300,
    damping: 30,
    mass: 0.8
  })

  const handleInteraction = useCallback((clientX: number) => {
    if (!rulerRef.current) return

    const rect = rulerRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const newProgress = Math.max(0, Math.min(1, x / rect.width))

    rawProgress.set(newProgress)

    const nearestIndex = Math.round(newProgress * (tabs.length - 1))
    if (nearestIndex !== activeIndex) {
      setActiveIndex(nearestIndex)
    }
  }, [tabs.length, activeIndex, rawProgress])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    isDragging.current = true
    handleInteraction(e.clientX)
  }, [handleInteraction])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging.current) return
    handleInteraction(e.clientX)
  }, [handleInteraction])

  const handleMouseUp = useCallback(() => {
    if (!isDragging.current) return
    isDragging.current = false

    const targetProgress = activeIndex / (tabs.length - 1)
    rawProgress.set(targetProgress)
    audio.snap()
  }, [activeIndex, tabs.length, rawProgress, audio])

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    isDragging.current = true
    handleInteraction(e.touches[0].clientX)
  }, [handleInteraction])

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging.current) return
    handleInteraction(e.touches[0].clientX)
  }, [handleInteraction])

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()

    const delta = e.deltaX !== 0 ? e.deltaX : e.deltaY
    const currentProgress = rawProgress.get()
    const step = 0.015
    const newProgress = Math.max(0, Math.min(1, currentProgress + (delta > 0 ? step : -step)))

    rawProgress.set(newProgress)

    const nearestIndex = Math.round(newProgress * (tabs.length - 1))
    if (nearestIndex !== activeIndex) {
      setActiveIndex(nearestIndex)
    }
  }, [tabs.length, activeIndex, rawProgress])

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseup", handleMouseUp)
    window.addEventListener("touchmove", handleTouchMove, { passive: false })
    window.addEventListener("touchend", handleMouseUp)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
      window.removeEventListener("touchmove", handleTouchMove)
      window.removeEventListener("touchend", handleMouseUp)
    }
  }, [handleMouseMove, handleMouseUp, handleTouchMove])

  const handleTabClick = useCallback((index: number) => {
    setActiveIndex(index)
    rawProgress.set(index / (tabs.length - 1))
    audio.select()
  }, [tabs.length, rawProgress, audio])

  useEffect(() => {
    if (!isDragging.current) {
      rawProgress.set(activeIndex / (tabs.length - 1))
    }
  }, [activeIndex, tabs.length, rawProgress])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault()
      const newIndex = Math.max(0, activeIndex - 1)
      setActiveIndex(newIndex)
      rawProgress.set(newIndex / (tabs.length - 1))
      audio.select()
    } else if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault()
      const newIndex = Math.min(tabs.length - 1, activeIndex + 1)
      setActiveIndex(newIndex)
      rawProgress.set(newIndex / (tabs.length - 1))
      audio.select()
    }
  }, [activeIndex, tabs.length, rawProgress, audio])

  const activeTab = tabs[activeIndex]
  const totalTicks = 120

  return (
    <div
      tabIndex={0}
      onKeyDown={handleKeyDown}
      role="tablist"
      aria-label="SDK examples"
      className={cn(
        "w-full select-none outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-xl",
        className
      )}
    >
      {/* Two-column layout: Left (title + tabs) | Right (content) */}
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-start">
        {/* Left Column: Title + Tab Labels */}
        <div className="flex flex-col gap-6">
          {/* Custom left content (title, description, etc.) */}
          {leftContent}

          {/* Tab Labels */}
          <div className="flex flex-wrap items-center gap-2">
            {tabs.map((tab, i) => {
              const isActive = i === activeIndex
              return (
                <motion.button
                  key={tab.id}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`tabpanel-${tab.id}`}
                  onClick={() => handleTabClick(i)}
                  className={cn(
                    "relative px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap",
                    isActive
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground/80"
                  )}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-tab-bg"
                      className="absolute inset-0 bg-muted rounded-md"
                      transition={{ type: "spring", stiffness: 500, damping: 35 }}
                    />
                  )}
                  <span className="relative z-10 font-mono text-xs">{tab.label}</span>
                </motion.button>
              )
            })}
          </div>
        </div>

        {/* Right Column: Preview */}
        <div
          className="min-h-[380px]"
          role="tabpanel"
          id={`tabpanel-${activeTab.id}`}
          aria-labelledby={activeTab.id}
        >
          <AnimatePresence mode="wait">
            <PreviewBlock key={activeTab.id} content={activeTab} />
          </AnimatePresence>
        </div>
      </div>

      {/* Full-width Ruler at bottom */}
      <div
        ref={rulerRef}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onWheel={handleWheel}
        className="relative mt-8 cursor-grab active:cursor-grabbing touch-none"
      >
        <Ruler
          totalTicks={totalTicks}
          progress={progress}
          tabCount={tabs.length}
          audio={audio}
        />
      </div>
    </div>
  )
}

export default FractionalSliderTabs
