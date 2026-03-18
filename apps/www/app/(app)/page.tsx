"use client"

import Link from "next/link"
import { ArrowRight, Check, Zap } from "lucide-react"

import { siteConfig } from "@/config/site"
import { HeroSection } from "@/components/hero-section"
import { stackPreviewRegistry } from "@/components/stack-previews"

/* ─────────────────────── Carousel Data ─────────────────────── */

const carouselStacks = [
  { slug: "example-agent-competitor", title: "Competitor Research" },
  { slug: "basics-generate-image", title: "Generate Image" },
  { slug: "example-agent-branding", title: "Brand Dashboard" },
  { slug: "ai-elements-chat", title: "AI Chat" },
  { slug: "basics-generate-text", title: "Generate Text" },
  { slug: "basics-transcribe", title: "Transcribe Audio" },
]

/* ─────────────────────── Data ─────────────────────── */

const freePlanHighlights = [
  "30+ free stacks (MIT licensed)",
  "All foundation stacks (generateText, streamText, etc.)",
  "Core chat UI components",
  "Basic agent patterns",
  "Theme customization",
  "Community GitHub access",
]

const proPlanHighlights = [
  "Everything in Open Source, plus:",
  `${siteConfig.counts.stacks}+ pro stacks and growing`,
  "All templates & full examples",
  "ChatGPT, Claude, Grok clones",
  "Advanced agent orchestration",
  "Human-in-the-loop patterns",
  "Marketing & landing UI",
  "Priority support",
  "Commercial license",
]

const faqItems = [
  {
    question: "How is this different from copy-pasting code from docs?",
    tag: "Difference",
    answer:
      "Each stack is a tested, production-ready vertical slice — not a tutorial excerpt. You get the UI, the API route, the types, and all dependencies wired together. One CLI command, everything works.",
  },
  {
    question: "Can I customize everything?",
    tag: "Ownership",
    answer:
      "Every stack drops raw TypeScript source into your project. There are no wrappers, no runtime dependencies, no hidden abstractions. Change colors, swap providers, restructure layouts — it's your code.",
  },
  {
    question: "Which AI providers are supported?",
    tag: "Providers",
    answer:
      "All of them. Works with @ai-sdk/openai, @ai-sdk/anthropic, @ai-sdk/google, @ai-sdk/groq, and any AI SDK-compatible provider. Switch models with a single line change.",
  },
  {
    question: "Do I need a specific backend?",
    tag: "Backend",
    answer:
      "Stacks include Next.js API routes by default. Deploy to Vercel, Netlify, Railway, or any Node-compatible platform. The UI components work with any backend that speaks the AI SDK protocol.",
  },
  {
    question: "What's included in Pro?",
    tag: "Pro",
    answer:
      `Access to all ${siteConfig.counts.stacks}+ stacks including agent orchestration, human-in-the-loop, real-world examples, marketing UI, and full-stack templates. Lifetime license — pay once, use forever.`,
  },
]

/* ─────────────────────── Page ─────────────────────── */

export default function IndexPage() {
  return (
    <div className="isolate min-h-screen overflow-hidden">
      {/* ═══════════════════ HERO ═══════════════════ */}
      <HeroSection />

      {/* ═══════════════ INTRODUCING SECTION ═══════════════ */}
      <section className="relative">
        {/* Grid background that continues from hero - contained within same insets as hero */}
        <div className="pointer-events-none absolute inset-6 top-0 h-32 overflow-hidden sm:inset-10 md:inset-14">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px),
                linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)
              `,
              backgroundSize: "28px 28px",
              opacity: 0.5,
            }}
          />
          {/* Fade the grid */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
        </div>

        <div className="relative grid grid-cols-1 py-12 md:grid-cols-2 md:py-16">
          {/* Left - Content Block */}
          <div className="relative z-10 mx-auto flex w-full max-w-xl flex-col justify-center border border-border bg-muted/80 p-8 md:ml-auto md:mr-0 md:p-10">
            {/* Arrow icon top right */}
            <Link
              href="/stacks"
              className="absolute right-6 top-6 text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowRight className="size-5 -rotate-45" />
            </Link>

            <p className="mb-3 text-sm text-muted-foreground">Introducing</p>

            <h2 className="mb-4 text-2xl font-medium leading-[1.15] tracking-tight text-foreground md:text-3xl lg:text-4xl">
              Full-stack AI patterns, built and maintained for you.
            </h2>

            <p className="max-w-md text-sm leading-relaxed text-muted-foreground md:text-base">
              Our collection of {siteConfig.counts.stacks}+ production-ready stacks
              integrates seamlessly into your Next.js app — with zero configuration
              overhead.
            </p>
          </div>

          {/* Right - Carousel of Stack Previews */}
          <div className="relative mt-6 overflow-hidden md:mt-0">
            {/* Gradient fade on left edge */}
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent" />
            {/* Gradient fade on right edge */}
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-background to-transparent" />

            {/* Scrolling carousel - continuous scroll */}
            <div className="flex w-max animate-[scroll-left_35s_linear_infinite] gap-5 py-3 hover:[animation-play-state:paused]">
              {[...carouselStacks, ...carouselStacks].map((stack, i) => {
                const PreviewComponent = stackPreviewRegistry[stack.slug]
                return (
                  <div
                    key={`${stack.slug}-${i}`}
                    className="w-[320px] shrink-0 overflow-hidden rounded-xl border border-border bg-card shadow-lg"
                  >
                    {/* Preview component container */}
                    <div className="relative h-[200px] overflow-hidden bg-background">
                      <div className="pointer-events-none absolute inset-0 origin-top-left scale-50">
                        <div className="h-[400px] w-[640px]">
                          {PreviewComponent && <PreviewComponent />}
                        </div>
                      </div>
                    </div>
                    {/* Card title */}
                    <div className="border-t border-border/50 bg-muted/30 px-4 py-2.5">
                      <h3 className="text-sm font-medium text-foreground">{stack.title}</h3>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ HOW IT WORKS ═══════════════ */}
      <section className="relative overflow-hidden bg-muted/30 dark:bg-[#1a1a1c]">
        {/* Content at top */}
        <div className="relative z-[3] mx-auto max-w-6xl px-4 pb-8 pt-16 md:pt-24">
          {/* Top label */}
          <p className="mb-8 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            How shadcnagents works
          </p>

          {/* Two column text */}
          <div className="grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
            <p className="text-base font-light leading-relaxed text-muted-foreground">
              The core of every stack is a complete vertical slice. Each one includes
              the UI component, API route, TypeScript types, and all dependencies —
              wired together and ready to ship. Install with one CLI command.
            </p>
            <p className="text-base font-light leading-relaxed text-muted-foreground">
              Unlike copy-paste snippets that require manual assembly, our stacks
              handle the full integration. Streaming, tool calling, structured output,
              agent loops — everything works out of the box with any AI SDK provider.
            </p>
          </div>
        </div>

        {/* Large background text - like Botpress "Engine" - below content */}
        <div className="pointer-events-none relative flex items-center justify-center overflow-hidden py-12 md:py-16">
          <span className="select-none whitespace-nowrap text-[22vw] font-normal leading-none tracking-tighter text-black/[0.07] dark:text-white/20 md:text-[16vw]">
            Vercel AI SDK
          </span>
        </div>
      </section>

      {/* ═══════════════ INLINE PRICING ═══════════════ */}
      <section className="mx-auto max-w-4xl px-4 py-12 md:py-20">
        <div className="mb-10 text-center">
          <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            Pricing
          </p>
          <h2 className="text-2xl tracking-tight md:text-3xl">
            <span className="block font-heading text-[1.1em]">
              One Payment.
            </span>
            <span className="block font-mono font-medium tracking-[-0.07em]">
              Every Stack. Forever.
            </span>
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Open Source */}
          <div className="flex flex-col border border-border bg-background p-8">
            <div className="mb-6">
              <h3 className="font-mono text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Open Source
              </h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-5xl font-bold tracking-tight">$0</span>
                <span className="text-sm text-muted-foreground">/ forever</span>
              </div>
              <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
                Core stacks to get started building AI features with Next.js.
              </p>
            </div>

            <ul className="mb-8 flex-1 space-y-3">
              {freePlanHighlights.map((feature) => (
                <li key={feature} className="flex items-start gap-2.5 text-[13px]">
                  <Check className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/stacks"
              className="inline-flex items-center justify-center border border-border px-6 py-3 text-sm font-medium transition-colors hover:bg-muted"
            >
              Browse Free Stacks
            </Link>
          </div>

          {/* All Access */}
          <div className="relative flex flex-col border-2 border-primary bg-background p-8">
            <div className="absolute -top-px left-0 right-0 h-1 bg-primary" />

            <div className="mb-6">
              <div className="flex items-center gap-3">
                <h3 className="font-mono text-sm font-semibold uppercase tracking-wider text-foreground">
                  All Access
                </h3>
                <span className="rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary-foreground">
                  Lifetime
                </span>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-5xl font-bold tracking-tight">
                  ${siteConfig.pricing.pro}
                </span>
                <span className="text-lg text-muted-foreground line-through">
                  ${siteConfig.pricing.proOriginal}
                </span>
                <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 font-mono text-[10px] font-medium text-emerald-600">
                  SAVE ${siteConfig.pricing.proOriginal - siteConfig.pricing.pro}
                </span>
              </div>
              <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
                Every stack we&apos;ve built and everything we&apos;ll ever build. One payment, forever.
              </p>
            </div>

            <ul className="mb-8 flex-1 space-y-3">
              {proPlanHighlights.map((feature, i) => (
                <li key={feature} className="flex items-start gap-2.5 text-[13px]">
                  <Check className={`mt-0.5 size-3.5 shrink-0 ${i === 0 ? "text-primary" : "text-emerald-500"}`} />
                  <span className={i === 0 ? "font-medium text-primary" : ""}>{feature}</span>
                </li>
              ))}
            </ul>

            <Link
              href={process.env.NEXT_PUBLIC_DODO_CHECKOUT_URL ?? "/pricing"}
              className="group inline-flex items-center justify-center gap-2 bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Get Lifetime Access
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>

        {/* Trust signals */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-center">
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

      {/* ═══════════════ FAQ ═══════════════ */}
      <section className="mx-auto max-w-3xl px-4 py-12 md:py-20">
        <h2 className="mb-10 text-center text-2xl tracking-tight md:text-3xl">
          <span className="block font-heading text-[1.1em]">
            Questions?
          </span>
          <span className="block font-mono font-medium tracking-[-0.07em]">
            We&apos;ve got answers.
          </span>
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
          <h2 className="text-2xl tracking-tight md:text-3xl">
            <span className="block font-heading text-[1.1em]">
              Stop Building From Scratch.
            </span>
            <span className="block font-mono font-medium tracking-[-0.07em]">
              One CLI command away.
            </span>
          </h2>
          <p className="mx-auto max-w-xl text-muted-foreground">
            {siteConfig.counts.stacks}+ production-ready stacks for chat, agents, tool calling,
            workflows, artifacts, and more. One CLI command away.
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
            <Link
              href="/stacks"
              className="group inline-flex items-center justify-center gap-2 bg-primary px-8 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
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
