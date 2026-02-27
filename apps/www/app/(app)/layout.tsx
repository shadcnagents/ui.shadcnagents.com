import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { UILibraryProvider } from "@/components/ui-library-toggle"
import { MarketingChrome } from "@/components/marketing-chrome"

interface AppLayoutProps {
  children: React.ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <UILibraryProvider>
      {/* ── Marketing chrome (alert banner + ticker + rails) — landing & pricing only ── */}
      <MarketingChrome />

      {/* ── Navbar ── */}
      <div className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
        <div className="flex h-14 items-center px-4">
          <SiteHeader />
        </div>
      </div>

      {/* ── Content ── */}
      <div className="flex min-h-screen flex-col">
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </div>
    </UILibraryProvider>
  )
}
