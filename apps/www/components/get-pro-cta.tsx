"use client"

import Link from "next/link"
import { ArrowRight, Check, Sparkles } from "lucide-react"

import { siteConfig } from "@/config/site"

const features = [
  "All stacks with full source",
  "Agent orchestration patterns",
  "Lifetime access & updates",
]

export function GetProCta() {
  return (
    <div className="group relative overflow-hidden border border-border bg-card">
      {/* Subtle animated gradient glow on hover */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <div className="relative flex flex-col gap-3 p-4">
        {/* Header */}
        <div className="flex items-center gap-1.5">
          <Sparkles className="size-3.5 text-primary" />
          <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">
            Pro Access
          </span>
        </div>

        {/* Value prop */}
        <p className="text-sm font-semibold leading-snug text-foreground">
          {siteConfig.counts.stacks}+ production-ready stacks
        </p>

        {/* Feature list */}
        <ul className="flex flex-col gap-1.5">
          {features.map((feature) => (
            <li key={feature} className="flex items-center gap-2 text-[11px] text-muted-foreground">
              <Check className="size-3 shrink-0 text-primary" />
              {feature}
            </li>
          ))}
        </ul>

        {/* CTA button with shine effect */}
        <Link
          href="/pricing"
          className="relative mt-1 inline-flex items-center justify-center gap-1.5 overflow-hidden bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-md hover:shadow-primary/20"
        >
          {/* Shine sweep on hover */}
          <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          <span className="relative flex items-center gap-1.5">
            Unlock All Access
            <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
          </span>
        </Link>
      </div>
    </div>
  )
}
