import Link from "next/link"

import { siteConfig } from "@/config/site"
import { Icons } from "@/components/icons"

/* ──────────────────────────────────────────────────────────
 *  FOOTER DATA — 5 columns, organized by user intent
 *  Column names intentionally different from any competitor
 * ────────────────────────────────────────────────────────── */

const stacks = [
  { title: "SDK Basics", href: "/stacks/basics-generate-text" },
  { title: "Chat Interfaces", href: "/stacks/ai-elements-chat" },
  { title: "Agent Patterns", href: "/stacks/ai-agents-routing" },
  { title: "Human-in-the-Loop", href: "/stacks/ai-human-in-the-loop" },
  { title: "Artifacts & Output", href: "/stacks/ai-artifact-chart" },
  { title: "Tools & Integrations", href: "/stacks/tool-websearch-claude" },
  { title: "Workflows", href: "/stacks/ai-workflow-basic" },
  { title: "Marketing UI", href: "/stacks/marketing-bento-1" },
]

const developer = [
  { title: "Documentation", href: "/docs" },
  { title: "Installation", href: "/docs/installation" },
  { title: "Theming Guide", href: "/docs/theming" },
  { title: "MCP Server", href: "/docs/mcp-server" },
  { title: "Components", href: "/directory" },
  { title: "CLI Reference", href: "/docs/installation/next" },
  { title: "Changelog", href: "/docs/changelog" },
]

const useCases = [
  { title: "AI Chatbots", href: "/explore/ai-sdk-ui" },
  { title: "Agent Orchestration", href: "/explore/ai-agent-orchestration" },
  { title: "Content Generation", href: "/explore/ai-agent-skills" },
  { title: "Code Assistants", href: "/explore/ai-agent-development" },
  { title: "Data Analysis", href: "/group/analysis" },
  { title: "Research & Audit", href: "/group/use-cases" },
  { title: "Model Comparison", href: "/group/model-comparison" },
  { title: "Voice & Media", href: "/stacks/voice-input-button" },
]

const resources = [
  { title: "All Stacks", href: "/stacks" },
  { title: "Templates", href: "/templates" },
  { title: "Themes", href: "/themes" },
  { title: "Showcase", href: "/directory" },
  { title: "Pricing", href: "/pricing" },
  {
    title: "GitHub",
    href: siteConfig.links.github,
    external: true,
  },
]

const company = [
  { title: "Sign In", href: "/auth/login" },
  {
    title: "Twitter / X",
    href: siteConfig.links.twitter,
    external: true,
  },
  {
    title: "GitHub",
    href: siteConfig.links.github,
    external: true,
  },
]

const legal = [
  { title: "Terms of Service", href: "/terms" },
  { title: "Privacy Policy", href: "/privacy" },
]

const techBadges = [
  { label: "Next.js 16", href: "https://nextjs.org" },
  { label: "AI SDK v6", href: "https://sdk.vercel.ai" },
  { label: "React 19", href: "https://react.dev" },
  { label: "Tailwind v4", href: "https://tailwindcss.com" },
  { label: "TypeScript", href: "https://typescriptlang.org" },
  { label: "Turbopack", href: "https://turbo.build/pack" },
]

/* ──────────────────────────────────────────────────────────
 *  FOOTER — Intercom-inspired, theme-adaptive
 *  3 zones: Brand → 5-col links → Bottom bar
 * ────────────────────────────────────────────────────────── */

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-muted/40">
      {/* ── Zone 1: Brand ── */}
      <div className="border-b border-border px-6 py-12 md:px-10 md:py-16">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/"
            className="group inline-flex items-center gap-2.5"
          >
            <Icons.brandLogo className="size-6 text-foreground transition-transform group-hover:scale-110" />
            <span className="font-mono text-xl font-semibold tracking-tight text-foreground">
              shadcnagents
            </span>
          </Link>
          <p className="mt-3 max-w-md text-[14px] leading-relaxed text-muted-foreground">
            Production-ready AI stacks for Next.js. Browse, install with one
            CLI command, and ship to production. 100+ stacks, 117 UI
            components.
          </p>
        </div>
      </div>

      {/* ── Zone 2: 5-column link grid ── */}
      <div className="px-6 py-10 md:px-10 md:py-14">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
          <FooterColumn heading="Stacks" links={stacks} />
          <FooterColumn heading="Developer" links={developer} />
          <FooterColumn heading="Use Cases" links={useCases} />
          <FooterColumn heading="Resources" links={resources} />
          <div>
            <FooterColumn heading="Company" links={company} />
            <div className="mt-8">
              <FooterColumn heading="Legal" links={legal} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Zone 3: Bottom bar ── */}
      <div className="border-t border-border px-6 py-5 md:px-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 sm:flex-row sm:justify-between">
          {/* Tech badges */}
          <div className="flex flex-wrap items-center gap-1.5">
            {techBadges.map((t) => (
              <Link
                key={t.label}
                href={t.href}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-border px-2.5 py-0.5 font-mono text-[10px] tracking-wider text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground"
              >
                {t.label}
              </Link>
            ))}
          </div>

          {/* Copyright + socials */}
          <div className="flex items-center gap-4">
            <span className="font-mono text-[11px] tracking-wider text-muted-foreground/60">
              &copy; {new Date().getFullYear()} shadcnagents
            </span>
            <div className="flex items-center gap-1">
              <Link
                href={siteConfig.links.github}
                target="_blank"
                rel="noreferrer"
                className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground"
              >
                <Icons.gitHub className="size-3.5" />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link
                href={siteConfig.links.twitter}
                target="_blank"
                rel="noreferrer"
                className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground"
              >
                <Icons.twitter className="size-3 fill-current" />
                <span className="sr-only">Twitter</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

/* ── Reusable column ── */
function FooterColumn({
  heading,
  links,
}: {
  heading: string
  links: { title: string; href: string; external?: boolean }[]
}) {
  return (
    <div>
      <h3 className="mb-4 font-mono text-[11px] font-semibold uppercase tracking-[0.15em] text-foreground/40">
        {heading}
      </h3>
      <nav className="flex flex-col gap-2.5">
        {links.map((link) => (
          <Link
            key={link.href + link.title}
            href={link.href}
            {...(link.external
              ? { target: "_blank", rel: "noreferrer" }
              : {})}
            className="text-[13px] text-muted-foreground transition-colors hover:text-foreground"
          >
            {link.title}
          </Link>
        ))}
      </nav>
    </div>
  )
}
