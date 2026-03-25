"use client"

import Link from "next/link"
import {
  ArrowRight,
  Settings,
  Server,
  Cloud,
  Sparkles,
  User,
  Crown,
  Briefcase,
  HelpCircle,
  Layers,
  MessageCircle,
} from "lucide-react"

import { siteConfig } from "@/config/site"
import { HeroSection } from "@/components/hero-section"
import { stackPreviewRegistry } from "@/components/stack-previews"

/* ─────────────────────── Category Showcase Data ─────────────────────── */

const categoryShowcase = [
  {
    id: "foundations",
    name: "AI SDK Foundations",
    description:
      "Start with the building blocks. generateText, streamText, generateImage, and tool calling — all wired up with TypeScript types, API routes, and production-ready UI.",
    totalPatterns: 9,
    featured: [
      { slug: "basics-generate-text", title: "Generate Text" },
      { slug: "basics-stream-text", title: "Stream Text" },
      { slug: "basics-generate-image", title: "Generate Image" },
      { slug: "basics-tool", title: "Tool Calling" },
    ],
  },
  {
    id: "agents",
    name: "Agent Architecture",
    description:
      "Build complex multi-agent systems with orchestration patterns. Coordinate specialized sub-agents, run parallel tasks, and implement human-in-the-loop approval flows.",
    totalPatterns: 12,
    featured: [
      { slug: "ai-agents-routing", title: "Routing Pattern" },
      { slug: "ai-agents-parallel-processing", title: "Parallel Processing" },
      { slug: "ai-human-in-the-loop", title: "Human-in-the-Loop" },
      { slug: "ai-workflow-basic", title: "Workflow Pipeline" },
    ],
  },
  {
    id: "chat",
    name: "Chat Kit",
    description:
      "Everything you need to build chat interfaces. From basic messaging to reasoning displays, source citations, tool approvals, and multi-modal input — all with streaming support.",
    totalPatterns: 18,
    featured: [
      { slug: "ai-elements-chat", title: "Basic Chat" },
      { slug: "ai-elements-reasoning-chat", title: "Reasoning Display" },
      { slug: "ai-elements-sources-chat", title: "Sources & Citations" },
      { slug: "ai-elements-confirmation", title: "Tool Approval" },
    ],
  },
  {
    id: "artifacts",
    name: "Rich Output",
    description:
      "Go beyond text. Generate editable tables, data visualizations, PDFs, and live code previews. Render AI-generated artifacts with proper styling and interactivity.",
    totalPatterns: 10,
    featured: [
      { slug: "ai-artifact-table", title: "Table Editor" },
      { slug: "ai-artifact-chart", title: "Chart Generation" },
      { slug: "streaming-markdown-renderer", title: "Streaming Markdown" },
      { slug: "ai-image-output", title: "AI Image Output" },
    ],
  },
  {
    id: "production",
    name: "Production Infrastructure",
    description:
      "Ship with confidence. Rate limiting, model fallbacks, semantic caching, prompt injection guards, and cost tracking — battle-tested patterns for production AI apps.",
    totalPatterns: 12,
    featured: [
      { slug: "tool-websearch-claude", title: "Web Search" },
      { slug: "cheerio-scraper", title: "Web Scraping" },
      { slug: "ai-pdf-ingest", title: "PDF Analysis" },
      { slug: "model-selector", title: "Model Selector" },
    ],
  },
]

/* ─────────────────────── FAQ Data ─────────────────────── */

const faqItems = [
  {
    question: "Can I customize the components for my brand?",
    tag: "Styling and Customization",
    icon: "settings",
    answer:
      "Everything is built with Tailwind CSS v4, and shadcn. Check out the theme selector to see how easy it is to customize each block. No proprietary styling system—just headless components you fully control.",
  },
  {
    question: "Do I need a backend to use these components?",
    tag: "Backend Requirements",
    icon: "server",
    answer:
      "Stacks include Next.js API routes by default. Deploy to Vercel, Netlify, Railway, or any Node-compatible platform. The UI components work with any backend that speaks the AI SDK protocol.",
  },
  {
    question: "Can I run blocks outside of vercel?",
    tag: "Deployment Options",
    icon: "cloud",
    answer:
      "Yes! While optimized for Vercel, all stacks work on any Node.js hosting platform including Netlify, Railway, Render, AWS, or self-hosted infrastructure.",
  },
  {
    question: "Which AI providers can I use?",
    tag: "AI Provider Compatibility",
    icon: "sparkles",
    answer:
      "All of them. Works with @ai-sdk/openai, @ai-sdk/anthropic, @ai-sdk/google, @ai-sdk/groq, and any AI SDK-compatible provider. Switch models with a single line change.",
  },
  {
    question: "What's included in the Pro Plan?",
    tag: "Pro Features",
    icon: "user",
    answer:
      `Access to all ${siteConfig.counts.stacks}+ stacks including agent orchestration, human-in-the-loop, real-world examples, marketing UI, and full-stack templates. Lifetime license — pay once, use forever.`,
  },
  {
    question: "What's included in the Premium Plan?",
    tag: "Premium Features",
    icon: "crown",
    answer:
      "Everything in Pro, plus priority support, early access to new stacks, and exclusive enterprise patterns for production-scale AI applications.",
  },
  {
    question: "Can I use this in commercial projects?",
    tag: "Licensing",
    icon: "briefcase",
    answer:
      "Yes. Your license allows unlimited commercial use. Build client projects, SaaS products, internal tools — no attribution required.",
  },
  {
    question: "What if this doesn't work for my project?",
    tag: "Money-Back Guarantee",
    icon: "help",
    answer:
      "We offer a 14-day money-back guarantee. If the stacks don't fit your needs, reach out and we'll refund your purchase — no questions asked.",
  },
  {
    question: "Is AI SDK Agents separate from Cult-UI Pro?",
    tag: "Product Relationship",
    icon: "layers",
    answer:
      "AI SDK Agents is a standalone product focused specifically on AI/LLM patterns. It complements Cult-UI Pro but is purchased separately.",
  },
  {
    question: "How do I get help if I'm stuck?",
    tag: "Support Options",
    icon: "message",
    answer:
      "Join our Discord community for quick help, browse the documentation, or reach out via email. Pro and Premium users get priority support.",
  },
]

const faqIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  settings: Settings,
  server: Server,
  cloud: Cloud,
  sparkles: Sparkles,
  user: User,
  crown: Crown,
  briefcase: Briefcase,
  help: HelpCircle,
  layers: Layers,
  message: MessageCircle,
}

/* ─────────────────────── Category Row Component ─────────────────────── */

function CategoryRow({
  category,
}: {
  category: (typeof categoryShowcase)[0]
}) {
  return (
    <section className="py-16 md:py-20">
      {/* Header Row - Heading + Line + Count */}
      <div className="flex items-center gap-6 px-4 md:px-0">
        <h2 className="shrink-0 text-2xl font-medium tracking-tight text-foreground md:text-3xl lg:text-4xl">
          {category.name}
        </h2>
        <div className="h-px flex-1 bg-border" />
        <span className="shrink-0 font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
          {category.totalPatterns} Patterns
        </span>
      </div>

      {/* Content */}
      <div className="px-4 pt-6 md:px-0 md:pt-8">
        {/* Description */}
        <p className="mb-6 max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg">
          {category.description}
        </p>

        {/* Featured count */}
        <p className="mb-8 font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
          {category.featured.length} Featured of {category.totalPatterns} Patterns
        </p>

        {/* Preview Cards Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {category.featured.map((stack) => {
            const PreviewComponent = stackPreviewRegistry[stack.slug]
            return (
              <Link
                key={stack.slug}
                href={`/stacks/${stack.slug}`}
                className="group relative overflow-hidden border border-border bg-card transition-all hover:border-foreground/20 hover:shadow-lg"
              >
                {/* Preview container */}
                <div className="relative h-[160px] overflow-hidden bg-card">
                  <div className="pointer-events-none absolute inset-0 origin-top-left scale-[0.4]">
                    <div className="h-[400px] w-[600px]">
                      {PreviewComponent && <PreviewComponent />}
                    </div>
                  </div>
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                </div>

                {/* Card footer */}
                <div className="flex items-center justify-between border-t border-border/50 px-4 py-3">
                  <span className="text-sm font-medium text-foreground">{stack.title}</span>
                  <ArrowRight className="size-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
                </div>
              </Link>
            )
          })}
        </div>

        {/* View all link */}
        <div className="mt-6 flex justify-end">
          <Link
            href="/stacks"
            className="group inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
          >
            View all {category.name.toLowerCase()} stacks
            <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────── Page ─────────────────────── */

export default function IndexPage() {
  return (
    <div className="isolate min-h-screen overflow-hidden">
      {/* ═══════════════════ HERO ═══════════════════ */}
      <HeroSection />

      {/* ═══════════════ CATEGORY SHOWCASE ═══════════════ */}
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
        {/* Section intro */}
        <div className="mb-16 text-center">
          <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            Browse by category
          </p>
          <h2 className="text-2xl font-medium tracking-tight md:text-3xl">
            {siteConfig.counts.stacks}+ production-ready stacks
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            From basic text generation to complex agent orchestration. Every pattern you need to ship AI features.
          </p>
        </div>

        {/* Category rows */}
        <div className="space-y-0">
          {categoryShowcase.map((category) => (
            <CategoryRow key={category.id} category={category} />
          ))}
        </div>
      </div>

      {/* ═══════════════ FAQ ═══════════════ */}
      <section className="mx-auto max-w-3xl px-4 py-12 md:py-20">
        {/* Header */}
        <div className="mb-10 flex flex-col items-center gap-4 text-center">
          <h2 className="font-heading text-3xl tracking-tight md:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground">
            Everything you need to know
          </p>
        </div>

        {/* FAQ Items */}
        <div className="divide-y divide-border border border-border">
          {faqItems.map((item) => {
            const IconComponent = faqIcons[item.icon]
            return (
              <details key={item.question} className="group">
                <summary className="flex cursor-pointer items-start justify-between gap-4 px-6 py-5 text-left text-sm font-medium transition-colors hover:bg-muted/40 md:text-base [&::-webkit-details-marker]:hidden">
                  <div className="flex items-start gap-4">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded border border-border bg-muted/50">
                      {IconComponent && <IconComponent className="size-5 text-muted-foreground" />}
                    </div>
                    <div className="flex flex-col gap-1">
                      <span>{item.question}</span>
                      <span className="font-mono text-[10px] font-normal uppercase tracking-[0.15em] text-muted-foreground">
                        {item.tag}
                      </span>
                    </div>
                  </div>
                  <span
                    className="mt-2 shrink-0 text-muted-foreground transition-transform group-open:rotate-45"
                    aria-hidden="true"
                  >
                    +
                  </span>
                </summary>
                <div className="px-6 pb-5 pl-20 text-sm leading-relaxed text-muted-foreground md:text-base">
                  {item.answer}
                </div>
              </details>
            )
          })}
        </div>

        {/* End of FAQ */}
        <div className="mt-8 flex items-center justify-center gap-4">
          <div className="h-px flex-1 bg-border" />
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            End of FAQ
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>
      </section>

      {/* ═══════════════ FINAL CTA ═══════════════ */}
      <section className="mx-auto max-w-3xl px-4 py-12 md:py-20">
        <div className="relative flex flex-col items-center gap-6 border border-border px-6 py-14 text-center md:px-12">
          {/* Colored top border accent */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent" />
          <h2 className="text-2xl font-medium tracking-tight md:text-3xl">
            Explore every AI SDK pattern
          </h2>
          <p className="mx-auto max-w-xl text-muted-foreground">
            Browse the full pattern library by use case, component type, and workflow.
          </p>
          <Link
            href="/stacks"
            className="inline-flex items-center justify-center bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            Browse all patterns
          </Link>
        </div>
      </section>
    </div>
  )
}
