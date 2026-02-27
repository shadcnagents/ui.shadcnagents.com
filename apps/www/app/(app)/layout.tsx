import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { UILibraryProvider } from "@/components/ui-library-toggle"

interface AppLayoutProps {
  children: React.ReactNode
}

const RW = "var(--rail-w)"

const tickerItems = [
  "100+ AI SDK Stacks",
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

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <UILibraryProvider>
      {/* ── Crosshatch frame: decorative fixed rails ── */}
      <div
        aria-hidden
        className="crosshatch-rail pointer-events-none fixed inset-y-0 left-0 z-40 bg-[size:4px_4px] [background-image:repeating-linear-gradient(315deg,rgba(0,0,0,0.15)_0_1px,transparent_0_50%)] dark:[background-image:repeating-linear-gradient(315deg,rgba(255,255,255,0.15)_0_1px,transparent_0_50%)]"
        style={{ width: RW }}
      />
      <div
        aria-hidden
        className="crosshatch-rail pointer-events-none fixed inset-y-0 z-40 w-px bg-foreground/10"
        style={{ left: RW }}
      />
      <div
        aria-hidden
        className="crosshatch-rail pointer-events-none fixed inset-y-0 right-0 z-40 bg-[size:4px_4px] [background-image:repeating-linear-gradient(315deg,rgba(0,0,0,0.15)_0_1px,transparent_0_50%)] dark:[background-image:repeating-linear-gradient(315deg,rgba(255,255,255,0.15)_0_1px,transparent_0_50%)]"
        style={{ width: RW }}
      />
      <div
        aria-hidden
        className="crosshatch-rail pointer-events-none fixed inset-y-0 z-40 w-px bg-foreground/10"
        style={{ right: RW }}
      />

      {/* ── Scrolling banner: full-width borders, text inset ── */}
      <div className="ticker-banner relative z-10 w-full overflow-hidden border-y border-foreground/10">
        <div
          className="flex w-max animate-[ticker_40s_linear_infinite] items-center gap-8 py-2.5 hover:[animation-play-state:paused]"
          style={{ paddingLeft: RW, paddingRight: RW }}
        >
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

      {/* ── Navbar: full-width border, content inset via CSS ── */}
      <div className="nav-frame sticky top-0 z-50 w-full border-b border-foreground/10 bg-background/90 backdrop-blur-sm">
        <div className="nav-inset relative z-[1] flex h-14 items-center px-4">
          <SiteHeader />
        </div>
      </div>

      {/* ── Content area: inset via CSS ── */}
      <div className="content-inset relative z-10 flex min-h-screen flex-col">
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </div>
    </UILibraryProvider>
  )
}
