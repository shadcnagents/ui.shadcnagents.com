import type { Metadata } from "next"
import Link from "next/link"
import {
  ArrowRight,
  Check,
  Crown,
  Minus,
  Sparkles,
  Users,
  Zap,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { siteConfig } from "@/config/site"

export const metadata: Metadata = {
  title: "Pricing — One-Time Payment, Lifetime Access",
  description:
    "One-time payment, lifetime access. Get 100+ production-ready AI stacks, templates, and full-stack examples. Built with Vercel AI SDK v6 and shadcn/ui.",
}

/* ─────────────── Plan data ─────────────── */

interface Plan {
  name: string
  price: string
  originalPrice?: string
  period: string
  badge?: string
  badgeColor?: string
  description: string
  cta: string
  href: string
  popular?: boolean
  icon: React.ComponentType<{ className?: string }>
  highlights: string[]
}

const plans: Plan[] = [
  {
    name: "Open Source",
    price: "$0",
    period: "forever",
    description: "15 best stacks, MIT licensed. Every share = free marketing for us.",
    cta: "Get Started Free",
    href: "/stacks",
    icon: Sparkles,
    highlights: [
      "15 production-ready stacks",
      "generateText, streamText, tool basics",
      "Core chat UI components",
      "Basic agent patterns",
      "MIT licensed",
      "Community support",
    ],
  },
  {
    name: "Pro",
    price: "$79",
    originalPrice: "$129",
    period: "one-time",
    badge: "Most Popular",
    badgeColor: "bg-emerald-500",
    description: "Every stack we've built. Pay once, own forever. No questions asked.",
    cta: "Get Pro Access",
    href: process.env.NEXT_PUBLIC_POLAR_PRO_URL ?? "#",
    popular: true,
    icon: Zap,
    highlights: [
      "Everything in Open Source",
      `All ${siteConfig.counts.stacks}+ stacks (growing weekly)`,
      "ChatGPT, Claude, Grok clones",
      "Advanced agent orchestration",
      "Human-in-the-loop patterns",
      "Marketing & landing UI",
      "Commercial license",
      "Lifetime updates included",
    ],
  },
  {
    name: "Team",
    price: "$149",
    originalPrice: "$249",
    period: "one-time",
    badge: "5 Seats",
    badgeColor: "bg-blue-500",
    description: "Pro access for your team. Expense-report friendly — one invoice, done.",
    cta: "Get Team Access",
    href: process.env.NEXT_PUBLIC_POLAR_TEAM_URL ?? "#",
    icon: Users,
    highlights: [
      "Everything in Pro",
      "5 developer seats",
      "Team license agreement",
      "Invoice for expense reports",
      "Priority email support",
      "Shared component library",
      "Onboarding call (30 min)",
      "Private Discord channel",
    ],
  },
]

/* ─────────────── Comparison table ─────────────── */

type FeatureValue = boolean | string

interface ComparisonCategory {
  category: string
  features: {
    name: string
    free: FeatureValue
    pro: FeatureValue
    team: FeatureValue
  }[]
}

const comparison: ComparisonCategory[] = [
  {
    category: "Stack Access",
    features: [
      { name: "Open source stacks (15)", free: true, pro: true, team: true },
      { name: `Pro stacks (${siteConfig.counts.stacks}+)`, free: false, pro: true, team: true },
      { name: "Future stacks included", free: false, pro: true, team: true },
      { name: "Early access to new stacks", free: false, pro: false, team: true },
    ],
  },
  {
    category: "Foundations",
    features: [
      { name: "generateText / streamText", free: true, pro: true, team: true },
      { name: "Tool calling patterns", free: true, pro: true, team: true },
      { name: "generateObject / structured output", free: true, pro: true, team: true },
      { name: "Image & speech generation", free: true, pro: true, team: true },
      { name: "Transcription", free: true, pro: true, team: true },
    ],
  },
  {
    category: "Chat Kit",
    features: [
      { name: "Basic streaming chat", free: true, pro: true, team: true },
      { name: "Reasoning display", free: true, pro: true, team: true },
      { name: "ChatGPT clone", free: false, pro: true, team: true },
      { name: "Claude clone", free: false, pro: true, team: true },
      { name: "Grok clone", free: false, pro: true, team: true },
      { name: "History sidebar", free: false, pro: true, team: true },
      { name: "Message branching", free: false, pro: true, team: true },
    ],
  },
  {
    category: "Agent Architecture",
    features: [
      { name: "Agent routing", free: true, pro: true, team: true },
      { name: "Human-in-the-loop (basic)", free: true, pro: true, team: true },
      { name: "Orchestrator-worker", free: false, pro: true, team: true },
      { name: "Sub-agent orchestrator", free: false, pro: true, team: true },
      { name: "Evaluator-optimizer", free: false, pro: true, team: true },
      { name: "Multi-step tool chains", free: false, pro: true, team: true },
    ],
  },
  {
    category: "Production Infrastructure",
    features: [
      { name: "Rate limit handler", free: true, pro: true, team: true },
      { name: "Cost tracker", free: true, pro: true, team: true },
      { name: "Model fallback handler", free: true, pro: true, team: true },
      { name: "Structured output validator", free: true, pro: true, team: true },
      { name: "Chat persistence kit", free: false, pro: true, team: true },
      { name: "Agent memory kit", free: true, pro: true, team: true },
    ],
  },
  {
    category: "License & Support",
    features: [
      { name: "Developer seats", free: "1", pro: "1", team: "5" },
      { name: "Commercial license", free: false, pro: true, team: true },
      { name: "Invoice for expenses", free: false, pro: false, team: true },
      { name: "Priority support", free: false, pro: false, team: true },
      { name: "Onboarding call", free: false, pro: false, team: "30 min" },
      { name: "Private Discord channel", free: false, pro: false, team: true },
    ],
  },
]

/* ─────────────── Why these prices ─────────────── */

const pricingLogic = [
  {
    tier: "Free",
    price: "$0",
    why: "Every share = free marketing. 15 stacks hook developers into the ecosystem.",
  },
  {
    tier: "Pro",
    price: "$79",
    why: "Below $100 = impulse buy. No approval needed. Credit card checkout. 70% of revenue.",
  },
  {
    tier: "Team",
    price: "$149",
    why: "Exists for expense reports. Team leads can't expense $79 personal licenses.",
  },
]

/* ─────────────── Logos ─────────────── */

const trustedBy = [
  "Vercel",
  "Supabase",
  "Stripe",
  "Linear",
  "Resend",
  "Clerk",
]

/* ─────────────── FAQ ─────────────── */

const faqs = [
  {
    q: "Is this a subscription?",
    a: "No. Every plan is a one-time payment. Pay once, own forever. No recurring charges, no renewals, no surprises.",
  },
  {
    q: "What do I actually get?",
    a: `Full source code for ${siteConfig.counts.stacks}+ production-ready AI stacks. Each stack includes the UI components, API routes, TypeScript types, and all the wiring. Install any stack with a single CLI command.`,
  },
  {
    q: "What's the difference between Pro and Team?",
    a: "Pro is for individual developers (1 seat). Team gives you 5 seats, an invoice for expense reports, priority support, and an onboarding call. Same stacks, more seats + support.",
  },
  {
    q: "Can I upgrade later?",
    a: "Yes. Buy Pro now, upgrade to Team later. We'll credit your Pro purchase toward the upgrade price.",
  },
  {
    q: "Do future stacks cost extra?",
    a: "No. Every stack we add in the future is included in your plan. We ship new stacks every week.",
  },
  {
    q: "Can I use these in client projects?",
    a: "Yes. Pro and Team both include commercial licenses. Use the stacks in unlimited projects — client work, SaaS products, internal tools.",
  },
]

/* ─────────────── Page ─────────────── */

export default function PricingPage() {
  return (
    <div className="isolate min-h-screen">
      {/* ═══════ Hero ═══════ */}
      <section className="mx-auto flex max-w-[980px] flex-col items-center gap-6 px-4 py-16 text-center md:py-24">
        <span className="rounded-full border border-border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          One-time payment &middot; lifetime access
        </span>
        <h1
          className="max-w-4xl leading-[1.15] tracking-[-0.03em]"
          style={{ fontSize: "clamp(26px, 12px + 3vw, 48px)" }}
        >
          <span className="block font-heading text-[1.1em]">
            Pay Once. Ship Forever.
          </span>
          <span className="block font-mono font-medium tracking-[-0.07em]">
            No subscriptions. No per-seat games.
          </span>
        </h1>
        <p className="mx-auto max-w-xl text-lg leading-relaxed text-muted-foreground">
          One-time payment for lifetime access. Get every AI stack today and
          every stack we build tomorrow. Your code, your project, forever.
        </p>
      </section>

      {/* ═══════ Plan Cards ═══════ */}
      <section className="mx-auto max-w-5xl px-4 pb-16">
        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan) => {
            const Icon = plan.icon
            return (
              <div
                key={plan.name}
                className={cn(
                  "relative flex flex-col border bg-background p-6",
                  plan.popular
                    ? "border-2 border-primary shadow-lg shadow-primary/10"
                    : "border-border"
                )}
              >
                {/* Popular indicator */}
                {plan.popular && (
                  <div className="absolute -top-px left-0 right-0 h-1 bg-primary" />
                )}

                {/* Header */}
                <div className="mb-5">
                  <div className="flex items-center gap-2">
                    <Icon className="size-4 text-muted-foreground" />
                    <h2 className="font-mono text-sm font-semibold uppercase tracking-wider">
                      {plan.name}
                    </h2>
                    {plan.badge && (
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-white",
                          plan.badgeColor
                        )}
                      >
                        {plan.badge}
                      </span>
                    )}
                  </div>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-4xl font-bold tracking-tight">
                      {plan.price}
                    </span>
                    {plan.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        {plan.originalPrice}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    {plan.period}
                  </p>
                  <p className="mt-3 text-[12px] leading-relaxed text-muted-foreground">
                    {plan.description}
                  </p>
                </div>

                {/* Features */}
                <ul className="mb-6 flex-1 space-y-2.5">
                  {plan.highlights.map((feature, i) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-[12px]"
                    >
                      <Check
                        className={cn(
                          "mt-0.5 size-3 shrink-0",
                          plan.popular && i === 0
                            ? "text-primary"
                            : "text-emerald-500"
                        )}
                      />
                      <span
                        className={cn(
                          plan.popular && i === 0
                            ? "font-medium text-foreground"
                            : "text-muted-foreground"
                        )}
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link
                  href={plan.href}
                  className={cn(
                    "group inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors",
                    plan.popular
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "border border-border hover:bg-muted"
                  )}
                >
                  {plan.cta}
                  {plan.popular && (
                    <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                  )}
                </Link>
              </div>
            )
          })}
        </div>

        {/* Trust signals */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-center">
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <Zap className="size-3.5" />
            Instant access after payment
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <Check className="size-3.5" />
            No recurring charges
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <Crown className="size-3.5" />
            Future stacks included
          </div>
        </div>
      </section>

      {/* ═══════ Social Proof ═══════ */}
      <section className="border-y border-border bg-muted/10 px-4 py-10">
        <div className="mx-auto max-w-4xl">
          <p className="mb-6 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Trusted by developers at
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {trustedBy.map((company) => (
              <span
                key={company}
                className="font-mono text-sm font-medium tracking-tight text-muted-foreground/50"
              >
                {company}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ Pricing Psychology (for you, hidden in prod) ═══════ */}
      {process.env.NODE_ENV === "development" && (
        <section className="mx-auto max-w-4xl px-4 py-12">
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-6">
            <h3 className="mb-4 font-mono text-sm font-semibold uppercase tracking-wider text-amber-600">
              Pricing Psychology (Dev Only)
            </h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {pricingLogic.map((item) => (
                <div key={item.tier} className="space-y-1">
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-sm font-bold">
                      {item.tier}
                    </span>
                    <span className="font-mono text-xs text-muted-foreground">
                      {item.price}
                    </span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-muted-foreground">
                    {item.why}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════ Feature Comparison Table ═══════ */}
      <section className="px-4 py-16 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              Compare plans
            </p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight md:text-3xl">
              Feature-by-feature breakdown
            </h2>
          </div>

          {/* Table header */}
          <div className="sticky top-0 z-10 grid grid-cols-[1fr_70px_70px_70px] items-center border border-border bg-muted/80 px-4 py-3 backdrop-blur-sm md:grid-cols-[1fr_120px_120px_120px]">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              Feature
            </span>
            <span className="text-center font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              Free
            </span>
            <span className="text-center font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-primary">
              Pro
            </span>
            <span className="text-center font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-blue-500">
              Team
            </span>
          </div>

          {/* Table body */}
          <div className="border-x border-b border-border">
            {comparison.map((group) => (
              <div key={group.category}>
                {/* Category header */}
                <div className="border-b border-border bg-muted/30 px-4 py-2">
                  <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.15em] text-foreground/50">
                    {group.category}
                  </span>
                </div>
                {/* Feature rows */}
                {group.features.map((feature, i) => (
                  <div
                    key={feature.name}
                    className={cn(
                      "grid grid-cols-[1fr_70px_70px_70px] items-center px-4 py-2 md:grid-cols-[1fr_120px_120px_120px]",
                      i < group.features.length - 1 && "border-b border-border/40"
                    )}
                  >
                    <span className="text-[12px] text-foreground/80">
                      {feature.name}
                    </span>
                    {(["free", "pro", "team"] as const).map(
                      (tier) => (
                        <span key={tier} className="flex justify-center">
                          {feature[tier] === true ? (
                            <Check className="size-3.5 text-emerald-500" />
                          ) : feature[tier] === false ? (
                            <Minus className="size-3.5 text-muted-foreground/20" />
                          ) : (
                            <span className="text-[11px] font-medium text-muted-foreground">
                              {feature[tier]}
                            </span>
                          )}
                        </span>
                      )
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ Stack Breakdown ═══════ */}
      <section className="border-y border-border bg-muted/20 px-4 py-16 md:py-20">
        <div className="mx-auto max-w-4xl">
          <div className="mb-10 text-center">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              What&apos;s inside
            </p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight md:text-3xl">
              {siteConfig.counts.stacks}+ stacks across 8 categories
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-[14px] leading-relaxed text-muted-foreground">
              Every stack includes UI components, API routes, TypeScript types,
              and all the wiring. Install with one CLI command.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-px border border-border bg-border md:grid-cols-4">
            {[
              { name: "Foundations", count: 9, color: "bg-blue-500" },
              { name: "Chat Kit", count: 22, color: "bg-violet-500" },
              { name: "Agent Patterns", count: 12, color: "bg-orange-500" },
              { name: "Production Infra", count: 11, color: "bg-emerald-500" },
              { name: "Connectors", count: 8, color: "bg-cyan-500" },
              { name: "Rich Output", count: 10, color: "bg-amber-500" },
              { name: "Pipelines", count: 8, color: "bg-rose-500" },
              { name: "Landing Blocks", count: 14, color: "bg-pink-500" },
            ].map((cat) => (
              <div
                key={cat.name}
                className="flex flex-col gap-2 bg-background p-5"
              >
                <div className="flex items-center gap-2">
                  <span className={cn("size-2 rounded-full", cat.color)} />
                  <span className="font-mono text-[22px] font-bold tracking-tight">
                    {cat.count}
                  </span>
                </div>
                <span className="text-[11px] leading-snug text-muted-foreground">
                  {cat.name}
                </span>
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
              <details key={faq.q} className="group">
                <summary className="flex cursor-pointer items-start justify-between gap-4 px-6 py-5 text-left text-sm font-medium transition-colors hover:bg-muted/40 [&::-webkit-details-marker]:hidden">
                  <span>{faq.q}</span>
                  <span
                    className="mt-0.5 shrink-0 text-muted-foreground transition-transform group-open:rotate-45"
                    aria-hidden="true"
                  >
                    +
                  </span>
                </summary>
                <div className="px-6 pb-5 text-[13px] leading-relaxed text-muted-foreground">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ Final CTA ═══════ */}
      <section className="mx-auto max-w-4xl px-4 pb-20">
        <div className="flex flex-col items-center gap-6 border border-border bg-muted/20 px-6 py-12 text-center md:px-12">
          <h2 className="text-xl font-bold tracking-tight md:text-2xl">
            Stop piecing together AI features from scratch
          </h2>
          <p className="max-w-md text-[14px] leading-relaxed text-muted-foreground">
            Get lifetime access to every stack — the UI, the API routes, the
            types, and all the wiring. One payment, ship forever.
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
            <Link
              href={process.env.NEXT_PUBLIC_POLAR_PRO_URL ?? "#"}
              className="group inline-flex items-center gap-2 bg-primary px-8 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Get Pro Access — $79
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/stacks"
              className="inline-flex items-center border border-border bg-background px-6 py-3 text-sm font-medium transition-colors hover:bg-muted"
            >
              Browse free stacks
            </Link>
          </div>
          <p className="font-mono text-[10px] tracking-wider text-muted-foreground/50">
            No recurring charges &middot; Instant access &middot; Lifetime updates
          </p>
        </div>
      </section>
    </div>
  )
}
