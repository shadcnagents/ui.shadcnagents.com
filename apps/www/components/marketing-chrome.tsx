"use client"

import { usePathname } from "next/navigation"

import { siteConfig } from "@/config/site"

const MARKETING_PATHS = ["/", "/pricing"]

const tickerItems = [
  `${siteConfig.counts.stacks}+ AI SDK Stacks`,
  "Next.js 16 + React 19",
  "Tailwind v4",
  "Copy & Paste Ready",
  "Chat · Agents · Workflows",
  "Turbopack",
  "Open Source",
  "Tool Calling Patterns",
  "Streaming UI",
  "Human-in-the-Loop",
]

export function MarketingChrome() {
  const pathname = usePathname()

  if (!pathname || !MARKETING_PATHS.includes(pathname)) return null

  return (
    <>
      {/* Scrolling ticker */}
      <div className="relative z-10 w-full overflow-hidden border-b border-foreground/10 bg-muted/40 backdrop-blur-sm">
        <div className="flex w-max animate-[ticker_40s_linear_infinite] items-center gap-8 py-2.5 hover:[animation-play-state:paused]">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex shrink-0 items-center gap-8">
              {tickerItems.map((item) => (
                <span
                  key={item}
                  className="flex shrink-0 items-center gap-2 font-mono text-[11px] tracking-wide text-foreground/60"
                >
                  <span
                    className="size-1 rounded-full bg-foreground/30"
                    aria-hidden
                  />
                  {item}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Diagonal crosshatch rails */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-y-0 left-0 z-40 bg-[size:4px_4px] [background-image:repeating-linear-gradient(315deg,rgba(0,0,0,0.15)_0_1px,transparent_0_50%)] dark:[background-image:repeating-linear-gradient(315deg,rgba(255,255,255,0.15)_0_1px,transparent_0_50%)]"
        style={{ width: "clamp(12px, 3vw, 40px)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-y-0 z-40 w-px bg-foreground/10"
        style={{ left: "clamp(12px, 3vw, 40px)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-y-0 right-0 z-40 bg-[size:4px_4px] [background-image:repeating-linear-gradient(315deg,rgba(0,0,0,0.15)_0_1px,transparent_0_50%)] dark:[background-image:repeating-linear-gradient(315deg,rgba(255,255,255,0.15)_0_1px,transparent_0_50%)]"
        style={{ width: "clamp(12px, 3vw, 40px)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-y-0 z-40 w-px bg-foreground/10"
        style={{ right: "clamp(12px, 3vw, 40px)" }}
      />
    </>
  )
}
