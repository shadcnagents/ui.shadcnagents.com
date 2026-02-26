"use client"

import { useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { useSession } from "next-auth/react"
import posthog from "posthog-js"
import { PostHogProvider as PHProvider } from "posthog-js/react"

if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://app.posthog.com",
    capture_pageview: false, // we handle this manually
    capture_pageleave: true,
  })
}

function PostHogPageView() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { data: session } = useSession()

  // Identify user when session loads
  useEffect(() => {
    if (session?.user?.id) {
      posthog.identify(session.user.id, {
        email: session.user.email,
        name: session.user.name,
        isPro: session.user.isPro,
      })
    }
  }, [session?.user?.id])

  // Capture pageview on route change
  useEffect(() => {
    if (pathname) {
      posthog.capture("$pageview", {
        $current_url: window.location.href,
      })
    }
  }, [pathname, searchParams])

  return null
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return <>{children}</>

  return (
    <PHProvider client={posthog}>
      <PostHogPageView />
      {children}
    </PHProvider>
  )
}

// Helper — fire key product events from any client component
export { posthog }
