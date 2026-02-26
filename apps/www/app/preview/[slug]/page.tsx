"use client"

import { Suspense, use, useEffect } from "react"
import { useSearchParams } from "next/navigation"

import { getAllStacks } from "@/config/stacks"
import { stackPreviewRegistry } from "@/components/stack-previews"

function makeThemeVars(base: Record<string, string>) {
  const vars: Record<string, string> = {}
  for (const [key, value] of Object.entries(base)) {
    vars[key] = value
    vars[`--color-${key.slice(2)}`] = value
  }
  return vars
}

const themePresets: Record<string, Record<string, string>> = {
  default: makeThemeVars({
    "--primary": "oklch(0.205 0 0)",
    "--primary-foreground": "oklch(0.985 0 0)",
    "--accent": "oklch(0.97 0 0)",
    "--accent-foreground": "oklch(0.205 0 0)",
    "--muted": "oklch(0.97 0 0)",
    "--muted-foreground": "oklch(0.556 0 0)",
  }),
  blue: makeThemeVars({
    "--primary": "oklch(0.546 0.245 262.881)",
    "--primary-foreground": "oklch(0.985 0 0)",
    "--accent": "oklch(0.932 0.032 255)",
    "--accent-foreground": "oklch(0.21 0.066 265)",
    "--muted": "oklch(0.932 0.032 255)",
    "--muted-foreground": "oklch(0.556 0.02 260)",
  }),
  green: makeThemeVars({
    "--primary": "oklch(0.596 0.171 149.214)",
    "--primary-foreground": "oklch(0.985 0 0)",
    "--accent": "oklch(0.94 0.03 155)",
    "--accent-foreground": "oklch(0.21 0.06 150)",
    "--muted": "oklch(0.94 0.03 155)",
    "--muted-foreground": "oklch(0.556 0.02 150)",
  }),
  orange: makeThemeVars({
    "--primary": "oklch(0.606 0.213 41.116)",
    "--primary-foreground": "oklch(0.985 0 0)",
    "--accent": "oklch(0.94 0.04 55)",
    "--accent-foreground": "oklch(0.21 0.06 40)",
    "--muted": "oklch(0.94 0.04 55)",
    "--muted-foreground": "oklch(0.556 0.02 45)",
  }),
  rose: makeThemeVars({
    "--primary": "oklch(0.577 0.245 27.325)",
    "--primary-foreground": "oklch(0.985 0 0)",
    "--accent": "oklch(0.94 0.03 15)",
    "--accent-foreground": "oklch(0.21 0.06 20)",
    "--muted": "oklch(0.94 0.03 15)",
    "--muted-foreground": "oklch(0.556 0.02 15)",
  }),
  violet: makeThemeVars({
    "--primary": "oklch(0.541 0.281 293.009)",
    "--primary-foreground": "oklch(0.985 0 0)",
    "--accent": "oklch(0.93 0.04 290)",
    "--accent-foreground": "oklch(0.21 0.08 290)",
    "--muted": "oklch(0.93 0.04 290)",
    "--muted-foreground": "oklch(0.556 0.02 290)",
  }),
}

interface PreviewPageProps {
  params: Promise<{ slug: string }>
}

export default function PreviewPage({ params }: PreviewPageProps) {
  const { slug } = use(params)

  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background">
          <p className="text-sm text-muted-foreground/40">Loading...</p>
        </div>
      }
    >
      <PreviewContent slug={slug} />
    </Suspense>
  )
}

function PreviewContent({ slug }: { slug: string }) {
  const searchParams = useSearchParams()

  const theme = searchParams.get("theme") || "default"
  const radius = searchParams.get("radius") || "0.5rem"
  const customColor = searchParams.get("color") || ""

  const allStacks = getAllStacks()
  const pattern = allStacks.find((p) => p.link === `/stacks/${slug}`)
  const PreviewComponent = stackPreviewRegistry[slug]

  // Build theme vars
  const themeVars: Record<string, string> = {
    ...(themePresets[theme] || themePresets.default),
    "--radius": radius,
    "--radius-lg": radius,
    "--radius-md": radius !== "0" ? `calc(${radius} - 2px)` : "0",
    "--radius-sm": radius !== "0" ? `calc(${radius} - 4px)` : "0",
    "--radius-xl": radius !== "0" ? `calc(${radius} + 4px)` : "0",
  }
  if (customColor) {
    themeVars["--primary"] = customColor
    themeVars["--color-primary"] = customColor
  }

  useEffect(() => {
    document.title = pattern
      ? `${pattern.text} — shadcnagents Preview`
      : `Preview — shadcnagents`
  }, [pattern])

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-background p-8"
      style={themeVars as React.CSSProperties}
    >
      {PreviewComponent ? (
        <div className="w-full">
          <PreviewComponent />
        </div>
      ) : (
        <p className="text-sm text-muted-foreground/40">
          Preview not available
        </p>
      )}
    </div>
  )
}
