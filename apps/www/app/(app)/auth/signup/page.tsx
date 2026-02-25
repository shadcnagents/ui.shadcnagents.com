import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create your shadcncloud account to access pro patterns, templates, and more.",
}

export default function SignupPage() {
  return (
    <div className="container flex min-h-[calc(100vh-8rem)] items-center justify-center py-16">
      <div className="mx-auto w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold tracking-tight">
            Create your shadcncloud account
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Sign up to get started with pro patterns and templates.
          </p>
        </div>

        <form className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium leading-none"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              className="border-border bg-background placeholder:text-muted-foreground focus:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-medium leading-none"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
              className="border-border bg-background placeholder:text-muted-foreground focus:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2"
            />
          </div>

          <button
            type="submit"
            className="bg-foreground text-background hover:bg-foreground/90 inline-flex h-10 w-full items-center justify-center rounded-md px-4 text-sm font-medium transition-colors"
          >
            Create Account
          </button>
        </form>

        <p className="text-muted-foreground mt-6 text-center text-sm">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="text-foreground underline underline-offset-4 hover:no-underline"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}
