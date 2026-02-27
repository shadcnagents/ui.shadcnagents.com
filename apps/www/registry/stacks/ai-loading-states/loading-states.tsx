"use client"

/* Wave dots — ellipse pattern */
const ELLIPSE = [3, 5, 7, 5, 3]

export function WaveDots() {
  return (
    <div className="flex flex-col items-center gap-[3px]">
      {ELLIPSE.map((count, row) => (
        <div key={row} className="flex gap-[3px]">
          {Array.from({ length: count }).map((_, col) => (
            <div
              key={col}
              className="size-[3px] rounded-full bg-foreground"
              style={{
                animation: "wave 1.4s ease-in-out infinite",
                animationDelay: `${col * 0.08 + row * 0.05}s`,
              }}
            />
          ))}
        </div>
      ))}
      <style>{`@keyframes wave{0%,100%{transform:scaleY(.3);opacity:.3}50%{transform:scaleY(1);opacity:1}}`}</style>
    </div>
  )
}

/* Pulsing orb */
export function PulsingOrb() {
  return (
    <div className="relative flex size-10 items-center justify-center">
      <div className="absolute inset-0 animate-ping rounded-full bg-foreground/10" />
      <div className="size-5 animate-pulse rounded-full bg-foreground/80" />
    </div>
  )
}

/* Shimmer skeleton */
export function ShimmerSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="relative h-3 overflow-hidden rounded-full bg-muted/60"
          style={{ width: `${[100, 75, 88][i % 3]}%` }}
        >
          <div
            className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-foreground/10 to-transparent"
            style={{ animation: "shimmer 1.6s ease-in-out infinite" }}
          />
        </div>
      ))}
      <style>{`@keyframes shimmer{0%{transform:translateX(-100%) skewX(-12deg)}100%{transform:translateX(200%) skewX(-12deg)}}`}</style>
    </div>
  )
}

/* Typing indicator */
export function TypingIndicator() {
  return (
    <div className="flex items-end gap-1.5 rounded-xl bg-muted/40 px-4 py-3 w-fit">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="size-2 rounded-full bg-foreground/60"
          style={{ animation: `wave 1s ease-in-out ${i * 0.15}s infinite alternate` }}
        />
      ))}
    </div>
  )
}