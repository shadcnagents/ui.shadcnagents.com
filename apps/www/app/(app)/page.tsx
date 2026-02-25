import Link from "next/link"

import { cn } from "@/lib/utils"
import { siteConfig } from "@/config/site"

const techBadges = [
  "Next.js v16",
  "AI SDK v6",
  "React 19",
  "Tailwind v4",
  "Turbopack",
] as const

const companyLogos = [
  "Vercel",
  "Stripe",
  "Linear",
  "Supabase",
  "Resend",
  "Clerk",
] as const

const faqItems = [
  {
    question: "Can I customize the components for my brand?",
    tag: "Styling and customization",
    answer:
      "Absolutely. Every pattern ships as raw source code that you own outright. Swap colors, fonts, spacing, or swap in your own design tokens -- no lock-in, no override gymnastics.",
  },
  {
    question: "Do I need a backend to use these components?",
    tag: "Backend requirements",
    answer:
      "Most patterns are full-stack and include both the UI and the API route. You can run them with any Node-compatible backend or deploy directly to Vercel, Netlify, or any serverless platform.",
  },
  {
    question: "Can I run blocks outside of Vercel?",
    tag: "Deployment options",
    answer:
      "Yes. While the patterns are optimized for Vercel and Next.js, the underlying AI SDK calls are platform-agnostic. Deploy to AWS, Fly.io, Railway, or any environment that supports Node.js.",
  },
  {
    question: "Which AI providers can I use?",
    tag: "AI providers",
    answer:
      "Works with @ai-sdk/openai, @ai-sdk/anthropic, or @ai-sdk/google. The AI SDK provider abstraction means you can switch models with a single line change.",
  },
  {
    question: "What's included in the Pro Plan?",
    tag: "Pro features",
    answer:
      "The Pro Plan gives you access to all 90+ patterns, full source code, priority updates, and early access to new agent architectures as they ship.",
  },
  {
    question: "Do you offer Radix AND Base UI variants?",
    tag: "UI primitives",
    answer:
      "Yes! Every pattern comes in both variants. Choose Radix for maximum accessibility out of the box, or Base UI for a lighter footprint. Same AI logic either way.",
  },
  {
    question: "Can I use this in commercial projects?",
    tag: "Licensing",
    answer:
      "Yes. You get a perpetual license to use the code in unlimited personal and commercial projects. No attribution required.",
  },
  {
    question: "What if this doesn't work for my project?",
    tag: "Money-back guarantee",
    answer:
      "We offer a 14-day money-back guarantee, no questions asked. If the patterns don't fit your workflow, just reach out and we'll refund you.",
  },
] as const

export default function IndexPage() {
  return (
    <div className="isolate min-h-screen overflow-hidden">
      {/* ──────────────────────── Hero ──────────────────────── */}
      <section className="mx-auto flex max-w-[980px] flex-col items-center gap-6 px-4 py-16 md:py-24 lg:py-32">
        {/* Badge */}
        <div className="flex items-center gap-2 rounded-full border border-border bg-muted/50 px-4 py-1.5">
          <span className="font-mono text-xs tracking-wider text-muted-foreground">
            New
          </span>
          <span className="text-muted-foreground/40" aria-hidden="true">
            ·
          </span>
          <span className="font-mono text-xs tracking-wider text-muted-foreground">
            Free
          </span>
          <span className="text-muted-foreground/40" aria-hidden="true">
            ·
          </span>
          <span className="font-mono text-xs tracking-wider text-muted-foreground">
            Expand All
          </span>
        </div>

        {/* Heading */}
        <h1 className="mx-auto max-w-4xl text-center text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
          AI SDK Agents You Can Copy&nbsp;&amp;&nbsp;Paste
        </h1>

        {/* Subheading */}
        <p className="mx-auto max-w-2xl text-center text-lg leading-relaxed text-muted-foreground md:text-xl">
          {siteConfig.description}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
          <Link
            href="/stacks"
            className="inline-flex items-center justify-center rounded-md bg-foreground px-8 py-3 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
          >
            Try out all 100 agent stacks
          </Link>
          <Link
            href="/directory"
            className="inline-flex items-center justify-center rounded-md border border-border bg-background px-8 py-3 text-sm font-medium transition-colors hover:bg-muted"
          >
            Browse directory
          </Link>
        </div>

        {/* Tech Badges */}
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

      {/* ────────────────── Social Proof Tweet ────────────────── */}
      <section className="mx-auto max-w-3xl px-4 py-12 md:py-16">
        <figure className="relative rounded-lg border border-border bg-muted/30 p-8 md:p-10">
          {/* Decorative quote mark */}
          <span
            className="absolute -top-4 left-6 text-5xl leading-none text-muted-foreground/20"
            aria-hidden="true"
          >
            &ldquo;
          </span>
          <blockquote className="text-lg leading-relaxed md:text-xl">
            shadcncloud looks amazing. A registry of agents makes so much sense.
            I like this distribution method.
          </blockquote>
          <figcaption className="mt-6 flex items-center gap-3">
            <div className="size-10 rounded-full bg-muted" aria-hidden="true" />
            <div>
              <p className="text-sm font-medium">Developer</p>
              <p className="text-sm text-muted-foreground">@devuser</p>
            </div>
          </figcaption>
        </figure>
      </section>

      {/* ─────────────────── Company Logos ─────────────────── */}
      <section className="mx-auto max-w-4xl px-4 py-12 md:py-16">
        <p className="mb-8 text-center text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Devs from these companies are using shadcncloud
        </p>
        <div className="grid grid-cols-3 gap-4 sm:grid-cols-6">
          {companyLogos.map((name) => (
            <div
              key={name}
              className="flex h-16 items-center justify-center rounded-md border border-border bg-muted/30"
            >
              <span className="text-xs font-medium text-muted-foreground">
                {name}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ────────────────────── FAQ ────────────────────── */}
      <section className="mx-auto max-w-3xl px-4 py-12 md:py-20">
        <h2 className="mb-10 text-center text-3xl font-bold tracking-tight md:text-4xl">
          Frequently Asked Questions
        </h2>

        <div className="divide-y divide-border rounded-lg border border-border">
          {faqItems.map((item) => (
            <details key={item.question} className="group">
              <summary className="flex cursor-pointer items-start justify-between gap-4 px-6 py-5 text-left text-sm font-medium transition-colors hover:bg-muted/40 md:text-base [&::-webkit-details-marker]:hidden">
                <div className="flex flex-col gap-1">
                  <span>{item.question}</span>
                  <span className="font-mono text-[11px] font-normal uppercase tracking-wider text-muted-foreground">
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

      {/* ──────────────────── CTA Banner ──────────────────── */}
      <section className="mx-auto max-w-4xl px-4 py-12 md:py-20">
        <div className="flex flex-col items-center gap-6 rounded-lg border border-border bg-muted/30 px-6 py-14 text-center md:px-12">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Unlock 90+ AI SDK Patterns
          </h2>
          <p className="mx-auto max-w-xl text-muted-foreground md:text-lg">
            Production-ready patterns for chat interfaces, agentic tool calling,
            workflows, artifact generation, and more.
          </p>
          <Link
            href="/pricing"
            className="inline-flex items-center justify-center rounded-md bg-foreground px-8 py-3 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
          >
            Get All Access Today
          </Link>
        </div>
      </section>
    </div>
  )
}
