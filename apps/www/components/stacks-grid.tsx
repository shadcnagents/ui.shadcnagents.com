"use client"

import { useRef, useState, useEffect } from "react"
import Link from "next/link"
import { Lock, Eye } from "lucide-react"
import { motion } from "motion/react"

import { stacksConfig, isSubCategory, type StackItem } from "@/config/stacks"
import { cn } from "@/lib/utils"
import { stackPreviewRegistry } from "@/components/stack-previews"
import { getBrandForStack, getBrandKeyForStack } from "@/config/brands"
import { brandIconMap } from "@/components/brand-icons"

interface FlatStack extends StackItem {
  categoryName: string
  categoryId: string
  hasPreview: boolean
}

function flattenStacks(): FlatStack[] {
  const result: FlatStack[] = []
  const seen = new Set<string>()

  for (const category of stacksConfig) {
    for (const item of category.items) {
      if (isSubCategory(item)) {
        for (const child of item.children) {
          const slug = child.link.replace("/stacks/", "")
          if (seen.has(slug)) continue
          seen.add(slug)
          result.push({
            ...child,
            categoryName: category.name,
            categoryId: category.id,
            hasPreview: slug in stackPreviewRegistry,
          })
        }
      } else {
        const slug = item.link.replace("/stacks/", "")
        if (seen.has(slug)) continue
        seen.add(slug)
        result.push({
          ...item,
          categoryName: category.name,
          categoryId: category.id,
          hasPreview: slug in stackPreviewRegistry,
        })
      }
    }
  }

  return result
}

function PreviewCard({ stack, index }: { stack: FlatStack; index: number }) {
  const slug = stack.link.replace("/stacks/", "")
  const PreviewComponent = stackPreviewRegistry[slug]
  const brand = getBrandForStack(slug)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: "200px" }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.6) }}
    >
      <Link
        href={stack.link}
        className="group relative flex flex-col overflow-hidden border border-border bg-card transition-all hover:border-primary/30 hover:shadow-md hover:shadow-primary/5"
      >
        {/* Preview area */}
        <div
          ref={containerRef}
          className="relative h-[220px] overflow-hidden bg-background"
        >
          {PreviewComponent && isVisible ? (
            <div
              className="pointer-events-none absolute left-0 top-0 origin-top-left"
              style={{
                width: "200%",
                height: "200%",
                transform: "scale(0.5)",
                ...(brand ? { "--primary": brand.accent, "--color-primary": brand.accent } as React.CSSProperties : {}),
              }}
            >
              <div className="flex h-full w-full items-center justify-center p-6">
                <PreviewComponent />
              </div>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="flex flex-col items-center gap-2 text-muted-foreground/30">
                <Eye className="size-5" />
                <span className="text-[10px] uppercase tracking-wider">Preview</span>
              </div>
            </div>
          )}

          {/* Fade-out gradient at bottom */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-card to-transparent" />

          {/* Pro badge */}
          {stack.tier === "pro" && (
            <div className="absolute right-2 top-2 flex items-center gap-1 bg-blue-500 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-white">
              <Lock className="size-2.5" />
              Pro
            </div>
          )}
        </div>

        {/* Info bar */}
        <div className="flex items-start justify-between gap-2 border-t border-border p-3">
          <div className="min-w-0">
            <p className="truncate text-xs font-medium text-foreground group-hover:text-primary transition-colors">
              {stack.text}
            </p>
            <p className="mt-0.5 truncate text-[11px] text-muted-foreground/60">
              {stack.description}
            </p>
          </div>
          {brand ? (() => {
            const brandKey = getBrandKeyForStack(slug)
            const BrandIcon = brandKey ? brandIconMap[brandKey] : undefined
            return (
              <span className="shrink-0 mt-0.5 flex items-center gap-1">
                {BrandIcon ? (
                  <BrandIcon className="size-3 text-muted-foreground/60" />
                ) : (
                  <span className="size-1.5 rounded-full" style={{ background: brand.accent }} />
                )}
                <span className="text-[9px] font-medium text-muted-foreground/50">{brand.name}</span>
              </span>
            )
          })() : (
            <span className="shrink-0 mt-0.5 text-[9px] font-medium uppercase tracking-wider text-muted-foreground/40">
              {stack.categoryName}
            </span>
          )}
        </div>
      </Link>
    </motion.div>
  )
}

export function StacksGrid() {
  const allStacks = flattenStacks()
  const [filter, setFilter] = useState<"all" | "free" | "pro">("all")

  const filtered = allStacks.filter((s) => {
    if (filter === "free") return s.tier === "free"
    if (filter === "pro") return s.tier === "pro"
    return true
  })

  return (
    <div className="space-y-6">
      {/* Filter chips */}
      <div className="flex items-center gap-2">
        {(["all", "free", "pro"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "px-3 py-1 text-[11px] font-medium uppercase tracking-wider transition-colors",
              filter === f
                ? "bg-foreground text-background"
                : "bg-muted text-muted-foreground hover:text-foreground"
            )}
          >
            {f === "all" ? `All (${allStacks.length})` : f === "free" ? `Free (${allStacks.filter(s => s.tier === "free").length})` : `Pro (${allStacks.filter(s => s.tier === "pro").length})`}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((stack, i) => (
          <PreviewCard key={stack.link} stack={stack} index={i} />
        ))}
      </div>
    </div>
  )
}
