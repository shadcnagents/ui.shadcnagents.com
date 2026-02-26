"use client"

import { useEffect } from "react"

import { StacksSidebar } from "@/components/stacks-sidebar"

interface StacksLayoutProps {
  children: React.ReactNode
}

export default function StacksLayout({ children }: StacksLayoutProps) {
  useEffect(() => {
    // Add data-stacks to <html> — CSS in globals.css hides the footer and
    // locks page scroll via overflow:hidden on the root element only,
    // without touching body overflow (which would break position:sticky on header)
    document.documentElement.setAttribute("data-stacks", "")
    return () => {
      document.documentElement.removeAttribute("data-stacks")
    }
  }, [])

  return (
    <div className="fixed inset-x-0 bottom-0 top-14 z-40 flex bg-chrome">
      <aside className="flex w-[240px] shrink-0 flex-col border-r border-border">
        <div className="flex min-h-0 flex-1 flex-col pt-4">
          <StacksSidebar />
        </div>
      </aside>
      {/* No bg-background here — main inherits gray from outer, only the rounded frame is white */}
      <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        {children}
      </main>
    </div>
  )
}
