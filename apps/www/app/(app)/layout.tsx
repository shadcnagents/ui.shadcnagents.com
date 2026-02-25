import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { UILibraryProvider } from "@/components/ui-library-toggle"

interface AppLayoutProps {
  children: React.ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <UILibraryProvider>
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </UILibraryProvider>
  )
}
