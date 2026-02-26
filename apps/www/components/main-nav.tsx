"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { CommandMenu } from "@/components/command-menu"

export function MainNav() {
  const pathname = usePathname()

  return (
    <div className="mr-4 hidden md:flex">
      <Link href="/" className="mr-6 flex items-center space-x-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-5"
        >
          <path d="M17.5 19H9.5C7.01 19 5 16.99 5 14.5S7.01 10 9.5 10h.5c.28-2.79 2.64-5 5.5-5 3.04 0 5.5 2.46 5.5 5.5 0 .34-.04.67-.09 1" />
          <path d="M17.5 19c1.93 0 3.5-1.57 3.5-3.5 0-.64-.18-1.24-.49-1.76" />
          <path d="M9.5 10c-.18-.63-.5-1.21-.94-1.69A4.48 4.48 0 0 0 5 7C2.79 7 1 8.79 1 11c0 1.88 1.29 3.46 3.04 3.89" />
        </svg>
        <span className="hidden text-sm font-bold sm:inline-block">
          shadcnagents
        </span>
        <span className="sr-only">{siteConfig.name}</span>
      </Link>

      <nav className="flex items-center gap-4 text-sm lg:gap-6">
        <Link
          href="/stacks"
          className={cn(
            "text-sm font-medium transition-colors hover:text-foreground/80",
            pathname?.startsWith("/stacks")
              ? "text-foreground"
              : "text-foreground/60"
          )}
        >
          Stacks
        </Link>
        <Link
          href="/templates"
          className={cn(
            "text-sm font-medium transition-colors hover:text-foreground/80",
            pathname?.startsWith("/templates")
              ? "text-foreground"
              : "text-foreground/60"
          )}
        >
          Templates
        </Link>
      </nav>

      <CommandMenu />
    </div>
  )
}
