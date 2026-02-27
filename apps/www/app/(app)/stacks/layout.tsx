"use client"

import { useEffect } from "react"

import { StacksSidebar } from "@/components/stacks-sidebar"

interface StacksLayoutProps {
  children: React.ReactNode
}

export default function StacksLayout({ children }: StacksLayoutProps) {
  useEffect(() => {
    document.documentElement.setAttribute("data-stacks", "")
    return () => {
      document.documentElement.removeAttribute("data-stacks")
    }
  }, [])

  return (
    <div className="stacks-workspace fixed inset-x-0 bottom-0 top-14 z-40 flex bg-muted/40">
      <aside className="relative z-[1] flex w-[240px] shrink-0 flex-col border-r border-border">
        <div className="flex min-h-0 flex-1 flex-col pt-4">
          <StacksSidebar />
        </div>
      </aside>
      <main className="relative z-[1] flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
