import Link from "next/link"
import { ArrowRight, Check, Terminal } from "lucide-react"

import { siteConfig } from "@/config/site"
import { FractionalSliderTabs } from "@/components/fractional-slider-tabs"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

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
  "30-day money-back guarantee",
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
      "30-day money-back guarantee, no questions asked. If the stacks don't fit your workflow, you get a full refund.",
  },
]

/* ─────────────────────── Page ─────────────────────── */

export default function IndexPage() {
  return (
    <div className="isolate min-h-screen overflow-hidden bg-muted/40">
      {/* ═══════════════════ HERO ═══════════════════ */}
      <section className="relative mx-auto max-w-7xl px-4 py-12 md:py-16 lg:py-20">
        <FractionalSliderTabs
          leftContent={
            <>
              {/* Badge row */}
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span>Now just open with</span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-2.5 py-1">
                  <svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                  <span className="font-mono text-xs">v0</span>
                </span>
                <span>install with</span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-2.5 py-1">
                  <Terminal className="size-3.5" />
                </span>
              </div>

              {/* Title */}
              <h1
                className="font-medium leading-[1.1] tracking-[-0.02em]"
                style={{ fontSize: "clamp(32px, 5vw, 48px)" }}
              >
                Open Source AI SDK Components & Agent Patterns for Next.js
              </h1>

              {/* Description */}
              <p className="max-w-md text-base leading-relaxed text-muted-foreground">
                Full-stack vercel ai sdk patterns for workflows, tool calling, and
                agent orchestration. Built with{" "}
                <span className="font-medium text-foreground">ai sdk v6</span> and{" "}
                <span className="font-medium text-foreground">shadcn/ui</span>.
                Headless, themable, practical.
              </p>

              {/* CTA */}
              <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                <Link
                  href="/stacks"
                  className="group inline-flex items-center justify-center gap-2 bg-primary px-7 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Preview {siteConfig.counts.stacks}+ agent patterns
                  <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>

              {/* Tech stack icons */}
              <TooltipProvider delayDuration={0}>
                <div className="flex items-center gap-4">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="text-foreground/70 transition-colors hover:text-foreground">
                        <svg className="size-6" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.235-2.236 2.236 2.236 0 0 1 2.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.41 0-.783.093-1.106.278-1.375.793-1.683 3.264-.973 6.365C1.98 8.917 0 10.42 0 12.004c0 1.59 1.99 3.097 5.043 4.03-.704 3.113-.39 5.588.988 6.38.32.187.69.275 1.102.275 1.345 0 3.107-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.41 0 .783-.09 1.106-.275 1.374-.792 1.683-3.263.973-6.365C22.02 15.096 24 13.59 24 12.004c0-1.59-1.99-3.097-5.043-4.032.704-3.11.39-5.587-.988-6.38-.318-.184-.688-.277-1.092-.278zm-.005 1.09v.006c.225 0 .406.044.558.127.666.382.955 1.835.73 3.704-.054.46-.142.945-.25 1.44-.96-.236-2.006-.417-3.107-.534-.66-.905-1.345-1.727-2.035-2.447 1.592-1.48 3.087-2.292 4.105-2.295zm-9.77.02c1.012 0 2.514.808 4.11 2.28-.686.72-1.37 1.537-2.02 2.442-1.107.117-2.154.298-3.113.538-.112-.49-.195-.964-.254-1.42-.23-1.868.054-3.32.714-3.707.19-.09.4-.127.563-.132zm4.882 3.05c.455.468.91.992 1.36 1.564-.44-.02-.89-.034-1.345-.034-.46 0-.915.01-1.36.034.44-.572.895-1.096 1.345-1.565zM12 8.1c.74 0 1.477.034 2.202.093.406.582.802 1.203 1.183 1.86.372.64.71 1.29 1.018 1.946-.308.655-.646 1.31-1.013 1.95-.38.66-.773 1.288-1.18 1.87-.728.063-1.466.098-2.21.098-.74 0-1.477-.035-2.202-.093-.406-.582-.802-1.204-1.183-1.86-.372-.64-.71-1.29-1.018-1.946.303-.657.646-1.313 1.013-1.954.38-.66.773-1.286 1.18-1.868.728-.064 1.466-.098 2.21-.098zm-3.635.254c-.24.377-.48.763-.704 1.16-.225.39-.435.782-.635 1.174-.265-.656-.49-1.31-.676-1.947.64-.15 1.315-.283 2.015-.386zm7.26 0c.695.103 1.365.23 2.006.387-.18.632-.405 1.282-.66 1.933-.2-.39-.41-.783-.64-1.174-.225-.392-.465-.774-.705-1.146zm3.063.675c.484.15.944.317 1.375.498 1.732.74 2.852 1.708 2.852 2.476-.005.768-1.125 1.74-2.857 2.475-.42.18-.88.342-1.355.493-.28-.958-.646-1.956-1.1-2.98.45-1.017.81-2.01 1.085-2.964zm-13.395.004c.278.96.645 1.957 1.1 2.98-.45 1.017-.812 2.01-1.086 2.964-.484-.15-.944-.318-1.37-.5-1.732-.737-2.852-1.706-2.852-2.474 0-.768 1.12-1.742 2.852-2.476.42-.18.88-.342 1.356-.494zm11.678 4.28c.265.657.49 1.312.676 1.948-.64.157-1.316.29-2.016.39.24-.375.48-.762.705-1.158.225-.39.435-.788.636-1.18zm-9.945.02c.2.392.41.783.64 1.175.23.39.465.772.705 1.143-.695-.102-1.365-.23-2.006-.386.18-.63.406-1.282.66-1.933zM17.92 16.32c.112.493.2.968.254 1.423.23 1.868-.054 3.32-.714 3.708-.147.09-.338.128-.563.128-1.012 0-2.514-.807-4.11-2.28.686-.72 1.37-1.536 2.02-2.44 1.107-.118 2.154-.3 3.113-.54zm-11.83.01c.96.234 2.006.415 3.107.532.66.905 1.345 1.727 2.035 2.446-1.595 1.483-3.092 2.295-4.11 2.295-.22-.005-.406-.05-.553-.132-.666-.38-.955-1.834-.73-3.703.054-.46.142-.944.25-1.438zm4.56.64c.44.02.89.034 1.345.034.46 0 .915-.01 1.36-.034-.44.572-.895 1.095-1.345 1.565-.455-.47-.91-.993-1.36-1.565z" />
                        </svg>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>React 19</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="text-foreground/70 transition-colors hover:text-foreground">
                        <svg className="size-6" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z" />
                        </svg>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>TypeScript</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="text-foreground/70 transition-colors hover:text-foreground">
                        <svg className="size-6" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z" />
                        </svg>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>Tailwind CSS v4</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="text-foreground/70 transition-colors hover:text-foreground">
                        <svg className="size-6" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M24 22.525H0l12-21.05 12 21.05z" />
                        </svg>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>Vercel AI SDK v6</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="text-foreground/70 transition-colors hover:text-foreground">
                        <svg className="size-6" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M4 0h16v8h-8zM4 8h8l8 8H4zM4 16h8v8z" />
                        </svg>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>Framer Motion</TooltipContent>
                  </Tooltip>
                </div>
              </TooltipProvider>
            </>
          }
        />
      </section>

      {/* ═══════════════ STACK CATEGORIES GRID ═══════════════ */}
      <section className="mx-auto max-w-5xl px-4 py-12 md:py-20">
        <div className="mb-10 text-center">
          <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            What you can build
          </p>
          <h2 className="text-2xl tracking-tight md:text-3xl">
            <span className="block font-heading text-[1.1em]">
              Every AI Pattern You Need.
            </span>
            <span className="block font-mono font-medium tracking-[-0.07em]">
              8 categories. {siteConfig.counts.stacks}+ stacks.
            </span>
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
          <h2 className="text-2xl tracking-tight md:text-3xl">
            <span className="block font-heading text-[1.1em]">
              Not Another Pattern Library.
            </span>
            <span className="block font-mono font-medium tracking-[-0.07em]">
              Full-stack stacks you actually ship.
            </span>
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
          <h2 className="text-2xl tracking-tight md:text-3xl">
            <span className="block font-heading text-[1.1em]">
              Start Free.
            </span>
            <span className="block font-mono font-medium tracking-[-0.07em]">
              Go pro when you&apos;re ready.
            </span>
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
