import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Check, Minus, Shield, Zap } from "lucide-react"

import { cn } from "@/lib/utils"
import { siteConfig } from "@/config/site"

export const metadata: Metadata = {
  title: "Pricing — Lifetime Access to 100+ AI Stacks",
  description:
    "One-time payment, lifetime access. Get 100+ production-ready AI stacks, templates, and full-stack examples. Built with Vercel AI SDK v6 and shadcn/ui.",
}

/* ─────────────── Plan data ─────────────── */

const freePlan = {
  name: "Open Source",
  price: "$0",
  period: "forever",
  description: "Core stacks to get started building AI features with Next.js.",
  cta: "Browse Free Stacks",
  href: "/stacks",
  highlights: [
    "30+ free stacks (MIT licensed)",
    "All foundation stacks (generateText, streamText, etc.)",
    "Core chat UI components",
    "Basic agent patterns",
    "Theme customization",
    "Community GitHub access",
  ],
}

const proPlan = {
  name: "All Access",
  price: "$149",
  originalPrice: "$249",
  period: "one-time",
  badge: "Lifetime",
  description:
    "Every stack we've built and everything we'll ever build. One payment, forever.",
  cta: "Get Lifetime Access",
  href: "#",
  highlights: [
    "Everything in Open Source, plus:",
    `${siteConfig.counts.stacks}+ pro stacks and growing`,
    "All templates & full examples",
    "ChatGPT, Claude, Grok clones",
    "Advanced agent orchestration",
    "Human-in-the-loop patterns",
    "Marketing & landing UI",
    "JSON render & structured output",
    "WDK workflow stacks",
    "Priority support",
    "Commercial license",
    "30-day money-back guarantee",
  ],
}

/* ─────────────── Comparison table ─────────────── */

type FeatureValue = boolean | string

interface ComparisonCategory {
  category: string
  features: { name: string; free: FeatureValue; pro: FeatureValue }[]
}

const comparison: ComparisonCategory[] = [
  {
    category: "Foundations",
    features: [
      { name: "generateText / streamText", free: true, pro: true },
      { name: "Tool calling patterns", free: true, pro: true },
      { name: "generateObject / structured output", free: true, pro: true },
      { name: "Image & speech generation", free: true, pro: true },
      { name: "Transcription", free: true, pro: true },
      { name: "Agent loop basics", free: true, pro: true },
    ],
  },
  {
    category: "Chat Kit",
    features: [
      { name: "Basic streaming chat", free: true, pro: true },
      { name: "Reasoning display", free: true, pro: true },
      { name: "Sources & citations", free: true, pro: true },
      { name: "ChatGPT clone", free: false, pro: true },
      { name: "Claude clone", free: false, pro: true },
      { name: "Grok clone", free: false, pro: true },
      { name: "Inline citations (Perplexity-style)", free: false, pro: true },
      { name: "History sidebar", free: false, pro: true },
      { name: "Message branching", free: false, pro: true },
      { name: "Multimodal file upload", free: false, pro: true },
    ],
  },
  {
    category: "Agent Architecture",
    features: [
      { name: "Agent routing", free: true, pro: true },
      { name: "Parallel processing", free: true, pro: true },
      { name: "Human-in-the-loop (basic)", free: true, pro: true },
      { name: "Orchestrator-worker", free: false, pro: true },
      { name: "Sub-agent orchestrator", free: false, pro: true },
      { name: "Evaluator-optimizer", free: false, pro: true },
      { name: "Multi-step tool chains", free: false, pro: true },
      { name: "Context builder (HITL)", free: false, pro: true },
      { name: "Inquire patterns (HITL)", free: false, pro: true },
    ],
  },
  {
    category: "Connectors",
    features: [
      { name: "Web search (Claude)", free: true, pro: true },
      { name: "Web search (Exa)", free: true, pro: true },
      { name: "Web scrapers", free: true, pro: true },
      { name: "PDF ingestion", free: true, pro: true },
      { name: "Streaming markdown renderer", free: true, pro: true },
      { name: "Structured output viewer", free: true, pro: true },
    ],
  },
  {
    category: "Rich Output",
    features: [
      { name: "Chart artifacts", free: true, pro: true },
      { name: "Table artifacts", free: true, pro: true },
      { name: "Artifact canvas", free: true, pro: true },
      { name: "Image output display", free: true, pro: true },
      { name: "JSON render components", free: false, pro: true },
    ],
  },
  {
    category: "Pipelines",
    features: [
      { name: "Basic workflow", free: true, pro: true },
      { name: "WDK pipeline stacks", free: false, pro: true },
    ],
  },
  {
    category: "Chat Kit Components",
    features: [
      { name: "Model selector", free: true, pro: true },
      { name: "Prompt suggestions", free: true, pro: true },
      { name: "Token counter", free: true, pro: true },
      { name: "Voice input", free: true, pro: true },
      { name: "Loading states", free: true, pro: true },
      { name: "Marketing & landing sections", free: false, pro: true },
    ],
  },
  {
    category: "Platform",
    features: [
      { name: "shadcn CLI installation", free: true, pro: true },
      { name: "TypeScript + Next.js 16", free: true, pro: true },
      { name: "Tailwind v4 + OKLCH theming", free: true, pro: true },
      { name: "Full source code access", free: true, pro: true },
      { name: "Commercial license", free: false, pro: true },
      { name: "Priority support", free: false, pro: true },
      { name: "Future stacks included", free: false, pro: true },
    ],
  },
]

/* ─────────────── Stack categories breakdown ─────────────── */

const stackCategories = [
  { name: "Foundations", count: 7, color: "bg-blue-500" },
  { name: "Chat Kit", count: 18, color: "bg-violet-500" },
  { name: "Agent Architecture", count: 11, color: "bg-orange-500" },
  { name: "Human in the Loop", count: 5, color: "bg-emerald-500" },
  { name: "Connectors", count: 8, color: "bg-cyan-500" },
  { name: "Rich Output", count: 6, color: "bg-amber-500" },
  { name: "Pipelines", count: 7, color: "bg-rose-500" },
  { name: "Landing Blocks", count: 12, color: "bg-pink-500" },
]

/* ─────────────── FAQ ─────────────── */

const faqs = [
  {
    q: "Is this a subscription?",
    a: "No. It's a one-time payment of $149 for lifetime access. You get every stack we've built and everything we'll ever add — no recurring charges, no renewals.",
  },
  {
    q: "What do I actually get?",
    a: `Full source code for ${siteConfig.counts.stacks}+ production-ready AI stacks. Each stack includes the UI components, API routes, TypeScript types, and all the wiring. Install any stack with a single CLI command and ship to production.`,
  },
  {
    q: "How do I install stacks?",
    a: 'Use the standard shadcn CLI: npx shadcn@latest add https://shadcnagents.com/r/[stack-name].json — it drops the files directly into your project. No package dependencies, no lock-in.',
  },
  {
    q: "Can I use these in commercial projects?",
    a: "Yes. The Pro plan includes a commercial license. Use the stacks in unlimited projects — client work, SaaS products, internal tools, whatever you're building.",
  },
  {
    q: "What if I'm not happy?",
    a: "You have 30 days to try everything. If the stacks aren't right for your workflow, email us for a full refund — no questions asked.",
  },
  {
    q: "Do I get future stacks too?",
    a: "Yes. Every stack we add in the future is included in your lifetime access. We're actively building new stacks every week.",
  },
  {
    q: "What tech stack is required?",
    a: "Next.js 15+, React 19, Tailwind CSS v4, TypeScript, and Vercel AI SDK v6. The stacks are designed for the latest ecosystem and follow shadcn/ui conventions.",
  },
  {
    q: "How is this different from other AI component libraries?",
    a: "Most libraries give you UI components only. Our stacks are full-stack — each one includes the frontend UI, the API route, type definitions, and all the wiring between them. One CLI command gives you a working feature, not just a button.",
  },
]

/* ─────────────── Page ─────────────── */

export default function PricingPage() {
  const totalStacks = stackCategories.reduce((sum, c) => sum + c.count, 0)

  return (
    <div className="isolate min-h-screen">
      {/* ═══════ Hero ═══════ */}
      <section className="mx-auto flex max-w-[860px] flex-col items-center gap-6 px-4 py-16 text-center md:py-24">
        <span className="rounded-full border border-border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          {totalStacks}+ stacks &middot; lifetime access
        </span>
        <h1
          className="max-w-3xl leading-[1.15] tracking-[-0.03em]"
          style={{ fontSize: "clamp(26px, 12px + 3vw, 48px)" }}
        >
          <span className="block font-editorial italic text-[1.1em]">
            One Payment.
          </span>
          <span className="block font-mono font-medium tracking-[-0.07em]">
            Every Stack. Forever.
          </span>
        </h1>
        <p className="mx-auto max-w-xl text-lg leading-relaxed text-muted-foreground">
          No subscriptions. No per-seat pricing. Pay once, get lifetime access to
          every AI stack we build — today and in the future.
        </p>
      </section>

      {/* ═══════ Plan Cards ═══════ */}
      <section className="mx-auto max-w-4xl px-4 pb-16">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Free Plan */}
          <div className="flex flex-col border border-border bg-background p-8">
            <div className="mb-6">
              <h2 className="font-mono text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                {freePlan.name}
              </h2>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-5xl font-bold tracking-tight">
                  {freePlan.price}
                </span>
                <span className="text-sm text-muted-foreground">
                  / {freePlan.period}
                </span>
              </div>
              <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
                {freePlan.description}
              </p>
            </div>

            <ul className="mb-8 flex-1 space-y-3">
              {freePlan.highlights.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-2.5 text-[13px]"
                >
                  <Check className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <Link
              href={freePlan.href}
              className="inline-flex items-center justify-center border border-border px-6 py-3 text-sm font-medium transition-colors hover:bg-muted"
            >
              {freePlan.cta}
            </Link>
          </div>

          {/* Pro Plan */}
          <div className="relative flex flex-col border-2 border-primary bg-background p-8">
            {/* Popular indicator */}
            <div className="absolute -top-px left-0 right-0 h-1 bg-primary" />

            <div className="mb-6">
              <div className="flex items-center gap-3">
                <h2 className="font-mono text-sm font-semibold uppercase tracking-wider text-foreground">
                  {proPlan.name}
                </h2>
                <span className="rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary-foreground">
                  {proPlan.badge}
                </span>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-5xl font-bold tracking-tight">
                  {proPlan.price}
                </span>
                <span className="text-lg text-muted-foreground line-through">
                  {proPlan.originalPrice}
                </span>
                <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 font-mono text-[10px] font-medium text-emerald-600">
                  SAVE $100
                </span>
              </div>
              <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
                {proPlan.description}
              </p>
            </div>

            <ul className="mb-8 flex-1 space-y-3">
              {proPlan.highlights.map((feature, i) => (
                <li
                  key={feature}
                  className="flex items-start gap-2.5 text-[13px]"
                >
                  <Check
                    className={cn(
                      "mt-0.5 size-3.5 shrink-0",
                      i === 0 ? "text-primary" : "text-emerald-500"
                    )}
                  />
                  <span className={i === 0 ? "font-medium text-primary" : ""}>
                    {feature}
                  </span>
                </li>
              ))}
            </ul>

            <Link
              href={proPlan.href}
              className="group inline-flex items-center justify-center gap-2 bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              {proPlan.cta}
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>

        {/* Trust signals */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-center">
          <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
            <Shield className="size-3.5" />
            30-day money-back guarantee
          </div>
          <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
            <Zap className="size-3.5" />
            Instant access after payment
          </div>
          <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
            <Check className="size-3.5" />
            No recurring charges
          </div>
        </div>
      </section>

      {/* ═══════ What You Get — Stack Breakdown ═══════ */}
      <section className="border-y border-border bg-muted/20 px-4 py-16 md:py-20">
        <div className="mx-auto max-w-4xl">
          <div className="mb-10 text-center">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              What&apos;s inside
            </p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight md:text-3xl">
              {totalStacks}+ stacks across {stackCategories.length} categories
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-[14px] leading-relaxed text-muted-foreground">
              Every stack includes the UI components, API route, TypeScript types,
              and all the wiring. Install with one CLI command.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-px border border-border bg-border md:grid-cols-4">
            {stackCategories.map((cat) => (
              <div
                key={cat.name}
                className="flex flex-col gap-2 bg-background p-5"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={cn("size-2 rounded-full", cat.color)}
                  />
                  <span className="font-mono text-[22px] font-bold tracking-tight">
                    {cat.count}
                  </span>
                </div>
                <span className="text-[12px] leading-snug text-muted-foreground">
                  {cat.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ Feature Comparison Table ═══════ */}
      <section className="px-4 py-16 md:py-20">
        <div className="mx-auto max-w-4xl">
          <div className="mb-10 text-center">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              Compare plans
            </p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight md:text-3xl">
              Feature-by-feature breakdown
            </h2>
          </div>

          {/* Table header */}
          <div className="sticky top-0 z-10 grid grid-cols-[1fr_80px_80px] items-center border border-border bg-muted/60 px-5 py-3 backdrop-blur-sm md:grid-cols-[1fr_120px_120px]">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
              Feature
            </span>
            <span className="text-center font-mono text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
              Free
            </span>
            <span className="text-center font-mono text-[11px] font-semibold uppercase tracking-[0.15em] text-primary">
              Pro
            </span>
          </div>

          {/* Table body */}
          <div className="border-x border-b border-border">
            {comparison.map((group) => (
              <div key={group.category}>
                {/* Category header */}
                <div className="border-b border-border bg-muted/30 px-5 py-2.5">
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.15em] text-foreground/50">
                    {group.category}
                  </span>
                </div>
                {/* Feature rows */}
                {group.features.map((feature, i) => (
                  <div
                    key={feature.name}
                    className={cn(
                      "grid grid-cols-[1fr_80px_80px] items-center px-5 py-2.5 md:grid-cols-[1fr_120px_120px]",
                      i < group.features.length - 1 && "border-b border-border/50"
                    )}
                  >
                    <span className="text-[13px] text-foreground/80">
                      {feature.name}
                    </span>
                    <span className="flex justify-center">
                      {feature.free === true ? (
                        <Check className="size-4 text-emerald-500" />
                      ) : feature.free === false ? (
                        <Minus className="size-4 text-muted-foreground/30" />
                      ) : (
                        <span className="text-[12px] text-muted-foreground">
                          {feature.free}
                        </span>
                      )}
                    </span>
                    <span className="flex justify-center">
                      {feature.pro === true ? (
                        <Check className="size-4 text-emerald-500" />
                      ) : feature.pro === false ? (
                        <Minus className="size-4 text-muted-foreground/30" />
                      ) : (
                        <span className="text-[12px] text-muted-foreground">
                          {feature.pro}
                        </span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ CLI Demo ═══════ */}
      <section className="border-y border-border bg-muted/20 px-4 py-16 md:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            How it works
          </p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight md:text-3xl">
            One command. Full stack.
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-[14px] leading-relaxed text-muted-foreground">
            Every stack installs directly into your project. No npm packages, no
            runtime dependencies, no vendor lock-in.
          </p>
          <div className="mx-auto mt-8 max-w-xl space-y-3">
            {[
              {
                label: "Install a chat stack",
                cmd: "npx shadcn@latest add https://shadcnagents.com/r/ai-elements-chat.json",
              },
              {
                label: "Install an agent pattern",
                cmd: "npx shadcn@latest add https://shadcnagents.com/r/ai-agents-routing.json",
              },
              {
                label: "Install a tool integration",
                cmd: "npx shadcn@latest add https://shadcnagents.com/r/tool-websearch-claude.json",
              },
            ].map((item) => (
              <div key={item.label} className="text-left">
                <span className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-muted-foreground/50">
                  {item.label}
                </span>
                <div className="overflow-x-auto rounded-md border border-border bg-neutral-950 px-4 py-3">
                  <code className="whitespace-nowrap font-mono text-[12px] text-neutral-300">
                    {item.cmd}
                  </code>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ FAQ ═══════ */}
      <section className="px-4 py-16 md:py-20">
        <div className="mx-auto max-w-3xl">
          <div className="mb-10 text-center">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              Questions
            </p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight md:text-3xl">
              Frequently asked
            </h2>
          </div>

          <div className="divide-y divide-border border border-border">
            {faqs.map((faq) => (
              <div key={faq.q} className="px-6 py-5">
                <h3 className="text-[14px] font-medium tracking-tight">
                  {faq.q}
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ Final CTA ═══════ */}
      <section className="mx-auto max-w-3xl px-4 pb-20">
        <div className="flex flex-col items-center gap-6 border border-border bg-muted/20 px-6 py-12 text-center md:px-12">
          <h2 className="text-xl font-bold tracking-tight md:text-2xl">
            Stop piecing together AI features from scratch
          </h2>
          <p className="max-w-md text-[14px] leading-relaxed text-muted-foreground">
            Get lifetime access to every stack — the UI, the API routes, the
            types, and all the wiring. One payment, ship forever.
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row">
            <Link
              href="#"
              className="group inline-flex items-center gap-2 bg-primary px-8 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Get Lifetime Access — $149
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/stacks"
              className="inline-flex items-center border border-border px-6 py-3 text-sm font-medium transition-colors hover:bg-muted"
            >
              Browse free stacks
            </Link>
          </div>
          <p className="font-mono text-[10px] tracking-wider text-muted-foreground/50">
            30-day money-back guarantee &middot; No recurring charges &middot;
            Instant access
          </p>
        </div>
      </section>
    </div>
  )
}
