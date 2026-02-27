import Link from "next/link"

import { siteConfig } from "@/config/site"
import { Icons } from "@/components/icons"
import { ModeToggle } from "@/components/mode-toggle"

/* ──────────────────────────────────────────────────────────
 *  FOOTER DATA — organized by user intent, not SDK function
 * ────────────────────────────────────────────────────────── */

const product = [
  { title: "Stacks", href: "/stacks" },
  { title: "Templates", href: "/templates" },
  { title: "Themes", href: "/themes" },
  { title: "Directory", href: "/directory" },
  { title: "Pricing", href: "/pricing" },
]

const learn = [
  { title: "Getting Started", href: "/docs" },
  { title: "Installation", href: "/docs/installation" },
  { title: "Theming Guide", href: "/docs/theming" },
  { title: "MCP Server", href: "/docs/mcp-server" },
  { title: "Changelog", href: "/docs/changelog" },
]

const buildWith = [
  { title: "Chat Interfaces", href: "/stacks/ai-elements-chat" },
  { title: "Agent Patterns", href: "/stacks/ai-agents-routing" },
  { title: "Tool Calling", href: "/stacks/basics-tool" },
  { title: "Human-in-the-Loop", href: "/stacks/ai-human-in-the-loop" },
  { title: "Artifacts & Output", href: "/stacks/ai-artifact-chart" },
  { title: "Workflows", href: "/stacks/ai-workflow-basic" },
  { title: "Web Scraping", href: "/stacks/cheerio-scraper" },
  { title: "Marketing UI", href: "/stacks/marketing-bento-1" },
]

const techStack = [
  { label: "Next.js 16", href: "https://nextjs.org" },
  { label: "AI SDK v6", href: "https://sdk.vercel.ai" },
  { label: "React 19", href: "https://react.dev" },
  { label: "Tailwind v4", href: "https://tailwindcss.com" },
  { label: "TypeScript", href: "https://typescriptlang.org" },
  { label: "Turbopack", href: "https://turbo.build/pack" },
]

/* ──────────────────────────────────────────────────────────
 *  FOOTER COMPONENT
 *  Layout: 3 zones stacked vertically
 *    1. Brand bar — logo + tagline + socials (wide, distinctive)
 *    2. Link grid — 3 cols (Product / Learn / Build With)
 *    3. Bottom — copyright + tech badges + theme toggle
 * ────────────────────────────────────────────────────────── */

export function SiteFooter() {
  return (
    <footer className="relative border-t border-border">
      {/* ── Zone 1: Brand bar ── */}
      <div className="border-b border-border px-6 py-10 md:py-14">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <Link href="/" className="group inline-flex items-center gap-2">
              <Icons.brandLogo className="size-5 fill-foreground transition-transform group-hover:scale-110" />
              <span className="font-mono text-lg font-semibold tracking-tight">
                shadcnagents
              </span>
            </Link>
            <p className="mt-2 max-w-sm text-[13px] leading-relaxed text-muted-foreground">
              Production-ready AI SDK components and agent patterns.
              Copy, paste, ship.
            </p>
          </div>

          {/* Social links */}
          <nav className="flex items-center gap-1">
            <Link
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Icons.gitHub className="size-4" />
              <span className="sr-only">GitHub</span>
            </Link>
            <Link
              href={siteConfig.links.twitter}
              target="_blank"
              rel="noreferrer"
              className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Icons.twitter className="size-3.5 fill-current" />
              <span className="sr-only">Twitter</span>
            </Link>
          </nav>
        </div>
      </div>

      {/* ── Zone 2: Link grid — 3 columns, NOT 4 ── */}
      <div className="px-6 py-10 md:py-12">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3">
          <FooterSection heading="Product" links={product} />
          <FooterSection heading="Learn" links={learn} />
          <FooterSection heading="Build With" links={buildWith} />
        </div>
      </div>

      {/* ── Zone 3: Bottom bar — tech badges + copyright + toggle ── */}
      <div className="border-t border-border px-6 py-5">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 sm:flex-row sm:justify-between">
          {/* Tech stack badges */}
          <div className="flex flex-wrap items-center gap-1.5">
            {techStack.map((t) => (
              <Link
                key={t.label}
                href={t.href}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-border px-2 py-0.5 font-mono text-[10px] tracking-wider text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground"
              >
                {t.label}
              </Link>
            ))}
          </div>

          {/* Copyright + toggle */}
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] tracking-wider text-muted-foreground">
              &copy; {new Date().getFullYear()} shadcnagents
            </span>
            <ModeToggle />
          </div>
        </div>
      </div>
    </footer>
  )
}

/* ── Reusable column ── */
function FooterSection({
  heading,
  links,
}: {
  heading: string
  links: { title: string; href: string }[]
}) {
  return (
    <div>
      <h3 className="mb-3 font-mono text-[10px] font-semibold uppercase tracking-[0.15em] text-foreground/40">
        {heading}
      </h3>
      <nav className="flex flex-col gap-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-[13px] text-muted-foreground transition-colors hover:text-foreground"
          >
            {link.title}
          </Link>
        ))}
      </nav>
    </div>
  )
}
