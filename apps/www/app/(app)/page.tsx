import Link from "next/link"
import { ArrowRight, Check, Terminal } from "lucide-react"

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
    name: "Foundations",
    count: 7,
    href: "/stacks/basics-generate-text",
    description: "generateText, streamText, tool, Agent",
  },
  {
    name: "Agent Architecture",
    count: 12,
    href: "/stacks/ai-agents-routing",
    description: "Routing, orchestration, evaluator-optimizer",
  },
  {
    name: "Chat Kit",
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
    name: "Rich Output",
    count: 8,
    href: "/stacks/ai-artifact-chart",
    description: "Tables, charts, canvas, structured output",
  },
  {
    name: "Connectors",
    count: 8,
    href: "/stacks/tool-websearch-claude",
    description: "Web search, scraping, PDF processing",
  },
  {
    name: "Pipelines",
    count: 7,
    href: "/stacks/ai-workflow-basic",
    description: "Sequential, durable, few-shot pipelines",
  },
  {
    name: "Landing Blocks",
    count: 12,
    href: "/stacks/marketing-bento-1",
    description: "Bento grids, feature sections, comparisons",
  },
] as const

const cliSteps = [
  {
    command: "npx shadcn@latest add https://shadcnagents.com/r/ai-elements-chat.json",
    label: "Install a chat interface",
  },
  {
    command: "npx shadcn@latest add https://shadcnagents.com/r/ai-agents-routing.json",
    label: "Add agent routing",
  },
  {
    command: "npx shadcn@latest add https://shadcnagents.com/r/ai-artifact-chart.json",
    label: "Add chart artifacts",
  },
] as const

const whyDifferent = [
  {
    title: "Stacks, not snippets",
    description:
      "Each stack is a full vertical slice — UI component, API route, types, and dependencies. Not a code block you have to figure out how to wire up.",
  },
  {
    title: "CLI-first distribution",
    description:
      "Install with one command via the shadcn CLI. Get the component, the route, the types, and every dependency resolved automatically.",
  },
  {
    title: `${siteConfig.counts.uiComponents} UI components included`,
    description:
      "Not just AI patterns. A full component library — buttons, cards, animations, loaders, forms — all built with Tailwind v4 and Radix.",
  },
  {
    title: "Live previews, not guesswork",
    description:
      "Every stack has an interactive preview you can try before installing. See exactly what you're getting before a single line touches your codebase.",
  },
  {
    title: "Own your code forever",
    description:
      "Raw TypeScript source dropped into your project. No wrappers, no runtime dependencies, no vendor lock-in. Modify anything.",
  },
  {
    title: "Any provider, any model",
    description:
      "Works with OpenAI, Anthropic, Google, Groq, Mistral — any AI SDK-compatible provider. Switch models with a single line change.",
  },
]

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

const proFeatures = [
  `All ${siteConfig.counts.stacks}+ stacks with full source code`,
  "Agent patterns & orchestration",
  "Human-in-the-loop workflows",
  "Full-stack templates",
  "Priority updates & new stacks",
  "14-day money-back guarantee",
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
  {
    question: "What if it doesn't fit my project?",
    tag: "Guarantee",
    answer:
      "14-day money-back guarantee, no questions asked. If the stacks don't fit your workflow, you get a full refund.",
  },
]

/* ─────────────────────── Page ─────────────────────── */

export default function IndexPage() {
  return (
    <div className="isolate min-h-screen overflow-hidden bg-muted/40">
      {/* ═══════════════════ HERO ═══════════════════ */}
      <section className="mx-auto flex max-w-[980px] flex-col items-center gap-6 px-4 py-16 md:py-24 lg:py-32">
        <h1
          className="mx-auto max-w-4xl text-center leading-[1.15] tracking-[-0.031em]"
          style={{ fontSize: "clamp(28px, 14px + 3.2vw, 54px)" }}
        >
          <span className="block font-heading text-[1.15em]">
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
            className="group inline-flex items-center justify-center gap-2 bg-primary px-8 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Browse {siteConfig.counts.stacks}+ stacks
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

      {/* ═══════════════ CLI INSTALL DEMO ═══════════════ */}
      <section className="mx-auto max-w-3xl px-4 pb-6 md:pb-12">
        <div className="overflow-hidden border border-border bg-neutral-950">
          {/* Terminal header */}
          <div className="flex items-center gap-2 border-b border-neutral-800 px-4 py-2.5">
            <div className="flex gap-1.5">
              <div className="size-2.5 rounded-full bg-neutral-700" />
              <div className="size-2.5 rounded-full bg-neutral-700" />
              <div className="size-2.5 rounded-full bg-neutral-700" />
            </div>
            <span className="ml-2 font-mono text-[10px] text-neutral-500">
              terminal
            </span>
          </div>
          {/* Commands */}
          <div className="flex flex-col gap-3 p-4 md:p-5">
            {cliSteps.map((step) => (
              <div key={step.label} className="flex flex-col gap-1">
                <span className="font-mono text-[10px] text-neutral-600">
                  # {step.label}
                </span>
                <div className="flex items-start gap-2">
                  <Terminal className="mt-0.5 size-3 shrink-0 text-emerald-500" />
                  <code className="break-all font-mono text-[12px] leading-relaxed text-neutral-300 md:text-[13px]">
                    {step.command}
                  </code>
                </div>
              </div>
            ))}
          </div>
        </div>
        <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          Works with any shadcn project. Zero config.
        </p>
      </section>

      {/* ═══════════════ STACK CATEGORIES GRID ═══════════════ */}
      <section className="mx-auto max-w-5xl px-4 py-12 md:py-20">
        <div className="mb-10 text-center">
          <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            What you can build
          </p>
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
            8 categories. {siteConfig.counts.stacks}+ stacks. Every AI pattern you need.
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

      {/* ═══════════════ WHY DIFFERENT ═══════════════ */}
      <section className="mx-auto max-w-5xl px-4 py-12 md:py-20">
        <div className="mb-10 text-center">
          <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            Why shadcnagents
          </p>
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
            Not another pattern library.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Most AI component libraries give you code blocks to copy. We give
            you full-stack, CLI-installable stacks that include everything —
            UI, API, types, and wiring.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {whyDifferent.map((item) => (
            <div
              key={item.title}
              className="flex flex-col gap-2 bg-background p-6"
            >
              <h3 className="text-sm font-semibold tracking-tight">
                {item.title}
              </h3>
              <p className="text-[13px] leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════ NUMBERS ═══════════════ */}
      <section className="mx-auto max-w-4xl px-4 py-12 md:py-16">
        <div className="grid grid-cols-2 gap-px border border-border bg-border md:grid-cols-4">
          {[
            { value: `${siteConfig.counts.stacks}+`, label: "AI Stacks" },
            { value: `${siteConfig.counts.uiComponents}`, label: "UI Components" },
            { value: "8", label: "Categories" },
            { value: "$149", label: "Lifetime Access" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center gap-1 bg-background py-8"
            >
              <span className="font-mono text-3xl font-bold tracking-tight md:text-4xl">
                {stat.value}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                {stat.label}
              </span>
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
                <span className="rounded-full bg-primary px-2 py-0.5 font-mono text-[10px] font-medium text-primary-foreground">
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
              {proFeatures.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <Check className="mt-0.5 size-3.5 shrink-0 text-emerald-500" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/pricing"
              className="group mt-auto inline-flex items-center justify-center gap-2 bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
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
