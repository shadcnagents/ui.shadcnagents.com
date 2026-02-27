import { docsConfig } from "@/config/docs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ThemeProvider } from "@/components/providers"
import { DocsSidebarNav } from "@/components/sidebar-nav"

interface DocsLayoutProps {
  children: React.ReactNode
}

export default function DocsLayout({ children }: DocsLayoutProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div className="border-b">
        <div className="flex-1 items-start bg-muted/40 px-0 md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-0 lg:grid-cols-[240px_minmax(0,1fr)]">
          <aside className="fixed top-14 z-30 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 border-r border-border md:sticky md:block">
            <ScrollArea className="h-full px-4 py-6 lg:px-5 lg:py-8">
              <DocsSidebarNav items={docsConfig.sidebarNav} />
            </ScrollArea>
          </aside>
          {children}
        </div>
      </div>
    </ThemeProvider>
  )
}
