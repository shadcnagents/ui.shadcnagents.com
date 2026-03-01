import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const { nextUrl, auth: session } = req

  // Protect the pro source API — must be authenticated + isPro is checked inside the route
  if (nextUrl.pathname.startsWith("/api/pro/")) {
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
  }

  // Onboarding requires authentication
  if (nextUrl.pathname === "/onboarding" && !session?.user) {
    return NextResponse.redirect(new URL("/auth/login", nextUrl))
  }

  // Redirect authenticated users away from login/signup pages
  if (session?.user && (
    nextUrl.pathname === "/auth/login" ||
    nextUrl.pathname === "/auth/signup"
  )) {
    return NextResponse.redirect(new URL("/stacks", nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    "/api/pro/:path*",
    "/auth/login",
    "/auth/signup",
    "/onboarding",
  ],
}
