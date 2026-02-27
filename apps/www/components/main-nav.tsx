"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { CommandMenu } from "@/components/command-menu"

export function MainNav() {
  const pathname = usePathname()

  return (
    <div className="mr-4 hidden md:flex">
      <Link href="/" className="mr-6 flex items-center gap-2">
        <Icons.brandLogo className="size-5 text-foreground" />
        <span className="hidden font-mono text-sm font-semibold tracking-tight sm:inline-block">
          shadcnagents
        </span>
        <span className="sr-only">{siteConfig.name}</span>
      </Link>

      <nav className="flex items-center gap-4 text-sm lg:gap-6">
        <Link
          href="/stacks"
          className={cn(
            "flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-foreground/80",
            pathname?.startsWith("/stacks")
              ? "text-foreground"
              : "text-foreground/60"
          )}
        >
          Stacks
          <span className="inline-flex items-center justify-center bg-primary px-1 py-px text-[9px] font-semibold leading-none text-primary-foreground">
            2
          </span>
        </Link>
        <Link
          href="/templates"
          className={cn(
            "flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-foreground/80",
            pathname?.startsWith("/templates")
              ? "text-foreground"
              : "text-foreground/60"
          )}
        >
          Templates
          <span className="inline-flex items-center justify-center bg-primary px-1 py-px text-[9px] font-semibold leading-none text-primary-foreground">
            2
          </span>
        </Link>
        <Link
          href="/docs"
          className={cn(
            "text-sm font-medium transition-colors hover:text-foreground/80",
            pathname?.startsWith("/docs")
              ? "text-foreground"
              : "text-foreground/60"
          )}
        >
          Docs
        </Link>
      </nav>

      <CommandMenu />
    </div>
  )
}
