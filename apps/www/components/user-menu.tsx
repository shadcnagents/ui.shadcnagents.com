"use client"

import { signIn, signOut, useSession } from "next-auth/react"
import Link from "next/link"
import { LogOut, Sparkles, User } from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export function UserMenu() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return <div className="size-7 animate-pulse rounded-full bg-muted" />
  }

  if (!session?.user) {
    return (
      <Link
        href="/auth/login"
        className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "text-sm font-medium text-foreground/60")}
      >
        Sign In
      </Link>
    )
  }

  return (
    <div className="group relative">
      {/* Avatar trigger */}
      <button className="flex size-7 items-center justify-center rounded-full bg-muted ring-2 ring-border transition-all hover:ring-foreground/30 focus:outline-none">
        {session.user.image ? (
          <img
            src={session.user.image}
            alt={session.user.name ?? "User"}
            className="size-7 rounded-full object-cover"
          />
        ) : (
          <User className="size-3.5 text-muted-foreground" />
        )}
      </button>

      {/* Dropdown */}
      <div className="invisible absolute right-0 top-9 z-50 w-52 origin-top-right scale-95 rounded-lg border border-border bg-background p-1 opacity-0 shadow-lg transition-all group-focus-within:visible group-focus-within:scale-100 group-focus-within:opacity-100 group-hover:visible group-hover:scale-100 group-hover:opacity-100">
        {/* User info */}
        <div className="px-3 py-2">
          <p className="truncate text-xs font-medium text-foreground">{session.user.name ?? session.user.email}</p>
          <p className="truncate text-[10px] text-muted-foreground">{session.user.email}</p>
          {session.user.isPro && (
            <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-foreground/10 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-foreground">
              <Sparkles className="size-2.5" />
              Pro
            </span>
          )}
        </div>

        <div className="my-1 h-px bg-border" />

        {!session.user.isPro && (
          <Link
            href="/pricing"
            className="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-xs text-foreground transition-colors hover:bg-muted"
          >
            <Sparkles className="size-3.5" />
            Upgrade to Pro
          </Link>
        )}

        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <LogOut className="size-3.5" />
          Sign Out
        </button>
      </div>
    </div>
  )
}
