import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { siteConfig } from "@/config/site"

/* ─────────────────────── Data ─────────────────────── */

const techBadges = [
  "Next.js v16",
  "AI SDK v6",
  "React 19",
  "Tailwind v4",
  "Turbopack",
  "TypeScript",
] as const

const stackCategories = [
  {
    name: "SDK Basics",
    count: 7,
    href: "/stacks/basics-generate-text",
    description: "generateText, streamText, tool, Agent",
  },
  {
    name: "Agent Patterns",
    count: 12,
    href: "/stacks/ai-agents-routing",
    description: "Routing, orchestration, evaluator-optimizer",
  },
  {
    name: "Chat UI",
    count: 18,
    href: "/stacks/ai-elements-chat",
    description: "Chat interfaces, reasoning, sources, plans",
  },
  {
    name: "Human-in-the-Loop",
    count: 5,
    href: "/stacks/ai-human-in-the-loop",
    description: "Tool approval, confirmation flows",
  },
  {
    name: "Artifacts",
    count: 8,
    href: "/stacks/ai-artifact-chart",
    description: "Tables, charts, canvas, structured output",
  },
  {
    name: "Tools & Integrations",
    count: 8,
    href: "/stacks/tool-websearch-claude",
    description: "Web search, scraping, PDF processing",
  },
  {
    name: "Workflows",
    count: 7,
    href: "/stacks/ai-workflow-basic",
    description: "Sequential, durable, few-shot pipelines",
  },
  {
    name: "Marketing UI",
    count: 12,
    href: "/stacks/marketing-bento-1",
    description: "Bento grids, feature sections, comparisons",
  },
] as const

const howItWorks = [
  {
    step: "01",
    title: "Browse stacks",
    description:
      "Find the AI pattern you need — chat, agents, workflows, artifacts. Live preview every stack before using it.",
    code: null,
  },
  {
    step: "02",
    title: "Install with one command",
    description:
      "Every stack installs via the shadcn CLI. Get the component, the API route, and all dependencies in one shot.",
    code: "npx shadcn@latest add https://shadcnagents.com/r/ai-elements-chat.json",
  },
  {
    step: "03",
    title: "Ship to production",
    description:
      "Raw source code you own. Customize everything — styles, providers, logic. No lock-in, no wrappers.",
    code: null,
  },
] as const

const testimonials = [
  {
    quote:
      "A registry of agents makes so much sense. I like this distribution method.",
    author: "Senior Developer",
    handle: "@devuser",
  },
  {
    quote:
      "Saved us weeks of building chat UI from scratch. The streaming patterns just work.",
    author: "Founding Engineer",
    handle: "@engineer",
  },
  {
    quote:
      "Finally, AI components that aren't just wrappers. Real source code I can actually read and modify.",
    author: "Tech Lead",
    handle: "@techlead",
  },
] as const

const faqItems = [
  {
    question: "Can I customize the components for my brand?",
    tag: "Customization",
    answer:
      "Every stack ships as raw source code that you own outright. Swap colors, fonts, spacing, or use your own design tokens — no lock-in, no override gymnastics.",
  },
  {
    question: "Do I need a backend to use these?",
    tag: "Backend",
    answer:
      "Most stacks are full-stack and include both the UI and the API route. Run them with any Node-compatible backend or deploy directly to Vercel, Netlify, or any serverless platform.",
  },
  {
    question: "Which AI providers work?",
    tag: "Providers",
    answer:
      "All of them. Works with @ai-sdk/openai, @ai-sdk/anthropic, @ai-sdk/google, and any AI SDK-compatible provider. Switch models with a single line change.",
  },
  {
    question: "Can I use this in commercial projects?",
    tag: "Licensing",
    answer:
      "Yes. Perpetual license for unlimited personal and commercial projects. No attribution required.",
  },
  {
    question: "What's in the Pro plan?",
    tag: "Pro",
    answer:
      "Access to all 100+ stacks, full source code, priority updates, and early access to new agent architectures as they ship.",
  },
  {
    question: "What if it doesn't work for my project?",
    tag: "Guarantee",
    answer:
      "14-day money-back guarantee, no questions asked. If the stacks don't fit your workflow, we'll refund you.",
  },
] as const

/* ─────────────────────── Page ─────────────────────── */

export default function IndexPage() {
  return (
    <div className="isolate min-h-screen overflow-hidden">
      {/* ═══════════════════ HERO ═══════════════════ */}
      <section className="mx-auto flex max-w-[980px] flex-col items-center gap-6 px-4 py-16 md:py-24 lg:py-32">
        <h1
          className="mx-auto max-w-4xl text-center leading-[1.15] tracking-[-0.031em]"
          style={{ fontSize: "clamp(28px, 14px + 3.2vw, 54px)" }}
        >
          <span className="block font-editorial italic text-[1.15em]">
            AI SDK Components You Can
          </span>
          <span
            className="block font-mono font-medium tracking-[-0.09em]"
            style={{ wordSpacing: "-0.16em" }}
          >
            Copy, Paste, and Ship Today
          </span>
        </h1>

        <p className="mx-auto max-w-2xl text-center text-lg leading-relaxed text-muted-foreground md:text-xl">
          {siteConfig.description}
        </p>

        <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
          <Link
            href="/stacks"
            className="group inline-flex items-center justify-center gap-2 bg-foreground px-8 py-3 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
          >
            Browse 100+ stacks
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/docs"
            className="inline-flex items-center justify-center border border-border bg-background px-8 py-3 text-sm font-medium transition-colors hover:bg-muted"
          >
            Read the docs
          </Link>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          {techBadges.map((badge) => (
            <span
              key={badge}
              className="rounded-full border border-border px-3 py-1 font-mono text-[11px] tracking-wider text-muted-foreground"
            >
              {badge}
            </span>
          ))}
        </div>
      </section>

      {/* ═══════════════ STACK CATEGORIES GRID ═══════════════ */}
      <section className="mx-auto max-w-5xl px-4 py-12 md:py-20">
        <div className="mb-10 text-center">
          <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            What you can build
          </p>
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
            8 categories. 100+ stacks. Every AI pattern you need.
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {stackCategories.map((cat) => (
            <Link
              key={cat.name}
              href={cat.href}
              className="group flex flex-col gap-2 bg-background p-5 transition-colors hover:bg-muted/40"
            >
              <div className="flex items-baseline justify-between">
                <h3 className="text-sm font-medium tracking-tight">
                  {cat.name}
                </h3>
                <span className="font-mono text-[10px] text-muted-foreground">
                  {cat.count}
                </span>
              </div>
              <p className="text-[12px] leading-relaxed text-muted-foreground">
                {cat.description}
              </p>
              <span className="mt-auto flex items-center gap-1 pt-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground/60 transition-colors group-hover:text-foreground">
                Explore
                <ArrowRight className="size-2.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══════════════ HOW IT WORKS ═══════════════ */}
      <section className="mx-auto max-w-4xl px-4 py-12 md:py-20">
        <div className="mb-10 text-center">
          <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            How it works
          </p>
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
            Three steps to ship AI features
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {howItWorks.map((item) => (
            <div
              key={item.step}
              className="flex flex-col gap-3 border border-border p-5"
            >
              <span className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground">
                STEP {item.step}
              </span>
              <h3 className="text-base font-semibold tracking-tight">
                {item.title}
              </h3>
              <p className="flex-1 text-[13px] leading-relaxed text-muted-foreground">
                {item.description}
              </p>
              {item.code && (
                <div className="mt-1 overflow-x-auto rounded-md border border-border bg-muted/40 px-3 py-2">
                  <code className="whitespace-nowrap font-mono text-[11px] text-foreground/80">
                    {item.code}
                  </code>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════ TESTIMONIALS ═══════════════ */}
      <section className="mx-auto max-w-5xl px-4 py-12 md:py-20">
        <div className="mb-10 text-center">
          <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            What developers say
          </p>
        </div>

        <div className="grid gap-px border border-border bg-border sm:grid-cols-3">
          {testimonials.map((t) => (
            <figure
              key={t.handle}
              className="flex flex-col gap-4 bg-background p-6"
            >
              <blockquote className="flex-1 text-[13.5px] leading-relaxed">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="flex items-center gap-2">
                <div className="size-7 rounded-full bg-muted" aria-hidden />
                <div>
                  <p className="text-xs font-medium">{t.author}</p>
                  <p className="font-mono text-[10px] text-muted-foreground">
                    {t.handle}
                  </p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ═══════════════ INLINE PRICING ═══════════════ */}
      <section className="mx-auto max-w-4xl px-4 py-12 md:py-20">
        <div className="mb-10 text-center">
          <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            Pricing
          </p>
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
            Start free. Go pro when you&apos;re ready.
          </h2>
        </div>

        <div className="grid gap-px border border-border bg-border sm:grid-cols-2">
          {/* Free */}
          <div className="flex flex-col gap-4 bg-background p-8">
            <div>
              <h3 className="text-lg font-semibold">Free</h3>
              <p className="mt-1 font-mono text-3xl font-bold tracking-tight">
                $0
              </p>
            </div>
            <ul className="flex flex-col gap-2 text-[13px] text-muted-foreground">
              <li>30+ open source stacks</li>
              <li>SDK basics &amp; chat UI elements</li>
              <li>Community support</li>
              <li>MIT licensed</li>
            </ul>
            <Link
              href="/stacks"
              className="mt-auto inline-flex items-center justify-center border border-border px-6 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
            >
              Get started
            </Link>
          </div>

          {/* Pro */}
          <div className="flex flex-col gap-4 bg-background p-8">
            <div>
              <div className="mb-1 flex items-center gap-2">
                <h3 className="text-lg font-semibold">Pro</h3>
                <span className="rounded-full bg-foreground px-2 py-0.5 font-mono text-[10px] font-medium text-background">
                  LIFETIME
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <p className="font-mono text-3xl font-bold tracking-tight">
                  $149
                </p>
                <span className="font-mono text-sm text-muted-foreground line-through">
                  $249
                </span>
              </div>
            </div>
            <ul className="flex flex-col gap-2 text-[13px] text-muted-foreground">
              <li>All 100+ stacks with source code</li>
              <li>Agent patterns &amp; orchestration</li>
              <li>Full-stack templates</li>
              <li>Priority updates &amp; new stacks</li>
              <li>14-day money-back guarantee</li>
            </ul>
            <Link
              href="/pricing"
              className="group mt-auto inline-flex items-center justify-center gap-2 bg-foreground px-6 py-2.5 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
            >
              Get all access
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════ FAQ ═══════════════ */}
      <section className="mx-auto max-w-3xl px-4 py-12 md:py-20">
        <h2 className="mb-10 text-center text-2xl font-bold tracking-tight md:text-3xl">
          Frequently Asked Questions
        </h2>

        <div className="divide-y divide-border border border-border">
          {faqItems.map((item) => (
            <details key={item.question} className="group">
              <summary className="flex cursor-pointer items-start justify-between gap-4 px-6 py-5 text-left text-sm font-medium transition-colors hover:bg-muted/40 md:text-base [&::-webkit-details-marker]:hidden">
                <div className="flex flex-col gap-1">
                  <span>{item.question}</span>
                  <span className="font-mono text-[10px] font-normal uppercase tracking-[0.15em] text-muted-foreground">
                    {item.tag}
                  </span>
                </div>
                <span
                  className="mt-0.5 shrink-0 text-muted-foreground transition-transform group-open:rotate-45"
                  aria-hidden="true"
                >
                  +
                </span>
              </summary>
              <div className="px-6 pb-5 text-sm leading-relaxed text-muted-foreground md:text-base">
                {item.answer}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* ═══════════════ FINAL CTA ═══════════════ */}
      <section className="mx-auto max-w-4xl px-4 py-12 md:py-20">
        <div className="flex flex-col items-center gap-6 border border-border bg-muted/20 px-6 py-14 text-center md:px-12">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Ready to build?
          </p>
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
            Stop building AI interfaces from scratch.
          </h2>
          <p className="mx-auto max-w-xl text-muted-foreground">
            100+ production-ready stacks for chat, agents, tool calling,
            workflows, artifacts, and more. One CLI command away.
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
            <Link
              href="/stacks"
              className="group inline-flex items-center justify-center gap-2 bg-foreground px-8 py-3 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
            >
              Explore all stacks
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center border border-border bg-background px-8 py-3 text-sm font-medium transition-colors hover:bg-muted"
            >
              View pricing
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
