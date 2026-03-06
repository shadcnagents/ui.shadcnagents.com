"use client"

import { DitherMosaic } from "@/components/ui/dither-mosaic"
import { AnimatedLogo } from "@/components/ui/animated-logo"

export function DitherMosaicDemo() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-12 md:py-20">
      <div className="mb-10 text-center">
        <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          Brand Identity
        </p>
        <h2 className="text-2xl tracking-tight md:text-3xl">
          <span className="block font-heading text-[1.1em]">
            Dithered Mosaic Pattern.
          </span>
          <span className="block font-mono font-medium tracking-[-0.07em]">
            Animated. Procedural. Unique.
          </span>
        </h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Large demo */}
        <div className="relative aspect-square overflow-hidden border border-border bg-background">
          <DitherMosaic
            colorFg="#0066FF"
            pxSize={3}
            blockCount={40}
            minBlockSize={50}
            animationSpeed={0.12}
            matrix="bayer8"
          />
        </div>

        {/* Logo sizes demo */}
        <div className="flex flex-col gap-6">
          {/* Different sizes */}
          <div className="flex flex-1 flex-col gap-4 border border-border bg-background p-6">
            <h3 className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
              Logo Sizes
            </h3>
            <div className="flex flex-wrap items-end gap-6">
              <div className="flex flex-col items-center gap-2">
                <AnimatedLogo size={24} colorFg="#0066FF" />
                <span className="font-mono text-[10px] text-muted-foreground">24px</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <AnimatedLogo size={32} colorFg="#0066FF" />
                <span className="font-mono text-[10px] text-muted-foreground">32px</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <AnimatedLogo size={48} colorFg="#0066FF" />
                <span className="font-mono text-[10px] text-muted-foreground">48px</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <AnimatedLogo size={64} colorFg="#0066FF" />
                <span className="font-mono text-[10px] text-muted-foreground">64px</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <AnimatedLogo size={96} colorFg="#0066FF" />
                <span className="font-mono text-[10px] text-muted-foreground">96px</span>
              </div>
            </div>
          </div>

          {/* Color variants */}
          <div className="flex flex-1 flex-col gap-4 border border-border bg-background p-6">
            <h3 className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
              Color Variants
            </h3>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex flex-col items-center gap-2">
                <AnimatedLogo size={48} colorFg="#0066FF" />
                <span className="font-mono text-[10px] text-muted-foreground">Blue</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <AnimatedLogo size={48} colorFg="#000000" />
                <span className="font-mono text-[10px] text-muted-foreground">Black</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <AnimatedLogo size={48} colorFg="#10B981" />
                <span className="font-mono text-[10px] text-muted-foreground">Green</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <AnimatedLogo size={48} colorFg="#8B5CF6" />
                <span className="font-mono text-[10px] text-muted-foreground">Purple</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <AnimatedLogo size={48} colorFg="#F59E0B" />
                <span className="font-mono text-[10px] text-muted-foreground">Amber</span>
              </div>
            </div>
          </div>

          {/* With text */}
          <div className="flex flex-1 flex-col gap-4 border border-border bg-background p-6">
            <h3 className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
              With Brand Name
            </h3>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <AnimatedLogo size={32} colorFg="#0066FF" />
                <span className="font-mono text-lg font-semibold tracking-tight">
                  shadcnagents
                </span>
              </div>
              <div className="flex items-center gap-2">
                <AnimatedLogo size={24} colorFg="#0066FF" />
                <span className="font-mono text-sm font-semibold tracking-tight">
                  shadcnagents
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wide banner demo */}
      <div className="mt-6 relative h-32 overflow-hidden border border-border bg-background md:h-40">
        <DitherMosaic
          colorFg="#0066FF"
          pxSize={4}
          blockCount={50}
          minBlockSize={40}
          animationSpeed={0.08}
          matrix="bayer8"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-background via-transparent to-background">
          <div className="flex items-center gap-3">
            <AnimatedLogo size={48} colorFg="#0066FF" />
            <span className="font-mono text-2xl font-bold tracking-tight md:text-3xl">
              shadcnagents
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
