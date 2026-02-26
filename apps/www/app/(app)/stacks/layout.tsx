"use client"

import { useEffect } from "react"

import { StacksSidebar } from "@/components/stacks-sidebar"

interface StacksLayoutProps {
  children: React.ReactNode
}

export default function StacksLayout({ children }: StacksLayoutProps) {
  useEffect(() => {
    const html = document.documentElement
    const body = document.body
    html.style.overflow = "hidden"
    body.style.overflow = "hidden"
    // Hide the global site footer — not needed inside the stacks workspace
    const footer = document.querySelector("footer")
    if (footer) (footer as HTMLElement).style.display = "none"
    return () => {
      html.style.overflow = ""
      body.style.overflow = ""
      if (footer) (footer as HTMLElement).style.display = ""
    }
  }, [])

  return (
    <div className="fixed inset-x-0 bottom-0 top-14 z-20 flex bg-chrome">
      <aside className="flex w-[240px] shrink-0 flex-col border-r border-border">
        <div className="flex min-h-0 flex-1 flex-col pt-4">
          <StacksSidebar />
        </div>
      </aside>
      {/* No bg-background here — main inherits gray from outer, only the rounded frame is white */}
      <main className="flex min-h-0 min-w-0 flex-1 flex-col">
        {children}
      </main>
    </div>
  )
}
