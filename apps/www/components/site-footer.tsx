import Link from "next/link"

import { siteConfig } from "@/config/site"
import { Icons } from "@/components/icons"
import {
  BrandOpenAI,
  BrandAnthropic,
  BrandXAI,
  BrandPerplexity,
  BrandDeepSeek,
  BrandMidjourney,
  BrandNotion,
  BrandLinear,
  BrandV0,
  BrandDevin,
  BrandVercel,
  BrandStripe,
  BrandApple,
  BrandCanva,
  BrandLangChain,
  BrandFirecrawl,
  BrandGoogle,
  BrandAdobe,
  BrandExa,
  BrandZapier,
} from "@/components/brand-icons"

/* ──────────────────────────────────────────────────────────
 *  FOOTER DATA — 6 dense columns, SEO-rich
 * ────────────────────────────────────────────────────────── */

const stacks = [
  { title: "Foundations", href: "/stacks/basics-generate-text" },
  { title: "Agent Architecture", href: "/stacks/ai-agents-routing" },
  { title: "Starter Apps", href: "/stacks/examples-chat-base-clone" },
  { title: "Rich Output", href: "/stacks/ai-artifact-chart" },
  { title: "Connectors", href: "/stacks/tool-websearch-claude" },
  { title: "Pipelines", href: "/stacks/ai-workflow-basic" },
  { title: "Chat Kit", href: "/stacks/ai-elements-chat" },
  { title: "Landing Blocks", href: "/stacks/marketing-bento-1" },
  { title: "Browse All Stacks", href: "/stacks" },
]

const popular: {
  title: string
  href: string
  icon?: React.ComponentType<any>
}[] = [
  { title: "ChatGPT Clone", href: "/stacks/chat-gpt", icon: BrandOpenAI },
  { title: "Claude Chat", href: "/stacks/chat-claude", icon: BrandAnthropic },
  { title: "Grok Chat", href: "/stacks/chat-grok", icon: BrandXAI },
  { title: "Perplexity Search", href: "/stacks/ai-elements-sources-chat", icon: BrandPerplexity },
  { title: "DeepSeek Reasoning", href: "/stacks/ai-elements-reasoning-chat", icon: BrandDeepSeek },
  { title: "Midjourney Output", href: "/stacks/ai-image-output", icon: BrandMidjourney },
  { title: "Notion Tables", href: "/stacks/ai-artifact-table", icon: BrandNotion },
  { title: "Linear Queue", href: "/stacks/ai-elements-queue", icon: BrandLinear },
  { title: "v0 Code Gen", href: "/stacks/json-render-generate", icon: BrandV0 },
  { title: "Devin Planner", href: "/stacks/ai-elements-plan", icon: BrandDevin },
  { title: "Vercel Features", href: "/stacks/marketing-feature-code-block-1", icon: BrandVercel },
  { title: "Stripe Checkout", href: "/stacks/marketing-feature-code-block-2", icon: BrandStripe },
  { title: "Apple Bento", href: "/stacks/marketing-bento-1", icon: BrandApple },
]

const pro = [
  { title: "Orchestrator-Worker", href: "/stacks/ai-chat-agent-orchestrator-pattern" },
  { title: "Sub-Agent Tree", href: "/stacks/sub-agent-orchestrator" },
  { title: "Context Builder", href: "/stacks/ai-human-in-the-loop-agentic-context-builder" },
  { title: "Evaluator-Optimizer", href: "/stacks/ai-chat-agent-evaluator-optimizer-pattern" },
  { title: "Multi-Step Tools", href: "/stacks/ai-chat-agent-multi-step-tool-pattern" },
  { title: "Artifact Canvas", href: "/stacks/artifact-canvas" },
  { title: "Chat-Base Clone", href: "/stacks/examples-chat-base-clone" },
  { title: "Form Generator", href: "/stacks/examples-form-generator" },
  { title: "Data Analysis Agent", href: "/stacks/example-agent-data-analysis" },
  { title: "Branding Agent", href: "/stacks/example-agent-branding" },
  { title: "SEO Audit Agent", href: "/stacks/example-agent-seo-audit" },
  { title: "Pricing", href: "/pricing" },
]

const developer = [
  { title: "Documentation", href: "/docs" },
  { title: "Installation", href: "/docs/installation" },
  { title: "CLI Reference", href: "/docs/installation/next" },
  { title: "MCP Server", href: "/docs/mcp-server" },
  { title: "Theming Guide", href: "/docs/theming" },
  { title: "Components", href: "/directory" },
  { title: "Changelog", href: "/docs/changelog" },
  { title: "llms.txt", href: "/llms.txt", external: true },
  { title: "GitHub", href: siteConfig.links.github, external: true },
]

const useCases = [
  { title: "AI Chatbots", href: "/group/chat" },
  { title: "Agent Orchestration", href: "/group/agents" },
  { title: "Content Generation", href: "/group/generation" },
  { title: "Data Analysis", href: "/group/analysis" },
  { title: "Research & Audit", href: "/group/use-cases" },
  { title: "Model Comparison", href: "/group/model-comparison" },
  { title: "Voice & Media", href: "/stacks/voice-input-button" },
  { title: "Web Search", href: "/stacks/tool-websearch-claude" },
  { title: "Web Scraping", href: "/stacks/cheerio-scraper" },
  { title: "PDF Processing", href: "/stacks/ai-pdf-ingest" },
  { title: "Durable Workflows", href: "/stacks/wdk-workflows-sequential" },
]

const company = [
  { title: "Sign In", href: "/auth/login" },
  { title: "Pricing", href: "/pricing" },
  { title: "Templates", href: "/templates" },
  { title: "Themes", href: "/themes" },
  { title: "Twitter / X", href: siteConfig.links.twitter, external: true },
  { title: "GitHub", href: siteConfig.links.github, external: true },
]

const legal = [
  { title: "Terms of Service", href: "/terms" },
  { title: "Privacy Policy", href: "/privacy" },
]

const brandRow: {
  icon: React.ComponentType<any>
  label: string
  href: string
}[] = [
  { icon: BrandOpenAI, label: "OpenAI", href: "https://openai.com" },
  { icon: BrandAnthropic, label: "Anthropic", href: "https://anthropic.com" },
  { icon: BrandGoogle, label: "Google", href: "https://ai.google" },
  { icon: BrandVercel, label: "Vercel", href: "https://vercel.com" },
  { icon: BrandPerplexity, label: "Perplexity", href: "https://perplexity.ai" },
  { icon: BrandDeepSeek, label: "DeepSeek", href: "https://deepseek.com" },
  { icon: BrandLangChain, label: "LangChain", href: "https://langchain.com" },
  { icon: BrandLinear, label: "Linear", href: "https://linear.app" },
  { icon: BrandNotion, label: "Notion", href: "https://notion.so" },
  { icon: BrandStripe, label: "Stripe", href: "https://stripe.com" },
  { icon: BrandCanva, label: "Canva", href: "https://canva.com" },
  { icon: BrandFirecrawl, label: "Firecrawl", href: "https://firecrawl.dev" },
  { icon: BrandMidjourney, label: "Midjourney", href: "https://midjourney.com" },
  { icon: BrandAdobe, label: "Adobe", href: "https://adobe.com" },
  { icon: BrandExa, label: "Exa", href: "https://exa.ai" },
  { icon: BrandZapier, label: "Zapier", href: "https://zapier.com" },
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
 *  FOOTER — 4 zones: Brand → Brands → 6-col links → Bottom
 * ────────────────────────────────────────────────────────── */

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-muted/40">
      {/* ── Zone 1: Brand + brand logos ── */}
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
          <p className="mt-3 max-w-lg text-[14px] leading-relaxed text-muted-foreground">
            Production-ready AI stacks for Next.js. Browse, install with one
            CLI command, and ship to production. {siteConfig.counts.stacks}+ stacks, {siteConfig.counts.uiComponents} UI
            components. Built for the companies building the future.
          </p>

          {/* Brand icons row */}
          <div className="mt-6 flex flex-wrap items-center gap-4">
            {brandRow.map((b) => (
              <Link
                key={b.label}
                href={b.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex text-muted-foreground/30 transition-colors hover:text-foreground"
                title={b.label}
              >
                <b.icon className="size-4" />
                <span className="sr-only">{b.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── Zone 2: 6-column link grid ── */}
      <div className="px-6 py-10 md:px-10 md:py-14">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-6">
          <FooterColumn heading="Stacks" links={stacks} />
          <FooterBrandColumn heading="Popular" links={popular} />
          <FooterColumn heading="Pro" links={pro} />
          <FooterColumn heading="Developer" links={developer} />
          <FooterColumn heading="Use Cases" links={useCases} />
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

/* ── Standard column ── */
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

/* ── Column with brand icons ── */
function FooterBrandColumn({
  heading,
  links,
}: {
  heading: string
  links: {
    title: string
    href: string
    icon?: React.ComponentType<any>
    external?: boolean
  }[]
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
            className="group/link flex items-center gap-1.5 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
          >
            {link.icon && (
              <link.icon className="size-3 shrink-0 text-muted-foreground/40 transition-colors group-hover/link:text-foreground/60" />
            )}
            <span>{link.title}</span>
          </Link>
        ))}
      </nav>
    </div>
  )
}
