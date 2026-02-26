import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"

import { cn } from "@/lib/utils"

const topics = [
  {
    slug: "ai-agent-builder",
    title: "AI Agent Builder",
    description:
      "Build production-ready AI agents with shadcnagents patterns. Our agent builder patterns give you composable, type-safe building blocks for creating intelligent agents that can reason, use tools, and interact with users through rich conversational interfaces.",
    relatedPatterns: ["/group/agents", "/group/tools", "/group/chat"],
  },
  {
    slug: "ai-agent-frameworks",
    title: "AI Agent Frameworks",
    description:
      "Explore AI agent framework patterns built on top of Vercel AI SDK. From simple tool-calling agents to complex multi-step orchestration, these patterns help you leverage the best of modern agent frameworks without vendor lock-in.",
    relatedPatterns: ["/group/agents", "/group/integrations", "/group/demos"],
  },
  {
    slug: "ai-agent-development",
    title: "AI Agent Development",
    description:
      "Accelerate your AI agent development workflow with tested, production-grade patterns. Includes streaming responses, error boundaries, retry logic, memory management, and structured output handling.",
    relatedPatterns: ["/group/agents", "/group/tools", "/group/data"],
  },
  {
    slug: "ai-agent-skills",
    title: "AI Agent Skills",
    description:
      "Equip your AI agents with powerful skills. These patterns cover tool calling, web browsing, code execution, document analysis, image generation, and more -- all composable and ready to integrate.",
    relatedPatterns: ["/group/tools", "/group/generation", "/group/analysis"],
  },
  {
    slug: "ai-agent-orchestration",
    title: "AI Agent Orchestration",
    description:
      "Orchestrate multiple AI agents working together. Patterns for agent handoffs, shared context, parallel execution, supervisor agents, and workflow coordination for complex multi-agent systems.",
    relatedPatterns: ["/group/agents", "/group/use-cases", "/group/demos"],
  },
  {
    slug: "ai-agent-platform",
    title: "AI Agent Platform",
    description:
      "Build your own AI agent platform with shadcnagents. Full-stack patterns for agent management, deployment, monitoring, and user-facing interfaces that scale from prototype to production.",
    relatedPatterns: ["/group/agents", "/group/integrations", "/group/data"],
  },
  {
    slug: "ai-agent-github",
    title: "AI Agent GitHub",
    description:
      "Integrate AI agents with GitHub workflows. Patterns for code review agents, PR summarization, issue triage, automated documentation, and CI/CD pipeline agents.",
    relatedPatterns: ["/group/integrations", "/group/tools", "/group/agents"],
  },
  {
    slug: "ai-sdk-vercel",
    title: "AI SDK Vercel",
    description:
      "Master the Vercel AI SDK with hands-on patterns. From basic text generation to advanced agent workflows, these patterns demonstrate every capability of the AI SDK with real, deployable code.",
    relatedPatterns: ["/group/chat", "/group/agents", "/group/generation"],
  },
  {
    slug: "ai-sdk-v6",
    title: "AI SDK v6",
    description:
      "Patterns updated for AI SDK v6 with the latest APIs. Covers new features like improved streaming, enhanced tool calling, better type safety, and the updated provider architecture.",
    relatedPatterns: ["/group/agents", "/group/chat", "/group/tools"],
  },
  {
    slug: "ai-sdk-ui",
    title: "AI SDK UI",
    description:
      "Beautiful UI components for AI SDK applications. Chat interfaces, message bubbles, streaming indicators, tool result renderers, and more -- all built with shadcn/ui and Tailwind CSS.",
    relatedPatterns: ["/group/chat", "/group/artifacts", "/group/demos"],
  },
  {
    slug: "ai-sdk-google",
    title: "AI SDK Google",
    description:
      "Use Google AI models with the Vercel AI SDK. Patterns for Gemini integration, multimodal inputs, grounding with Google Search, and leveraging Google-specific model capabilities.",
    relatedPatterns: [
      "/group/agents",
      "/group/model-comparison",
      "/group/generation",
    ],
  },
  {
    slug: "ai-sdk-mcp",
    title: "AI SDK MCP",
    description:
      "Model Context Protocol (MCP) patterns for AI SDK. Connect your agents to external tools and data sources using the MCP standard for interoperable, composable AI tool ecosystems.",
    relatedPatterns: ["/group/tools", "/group/integrations", "/group/agents"],
  },
  {
    slug: "ai-sdk-examples",
    title: "AI SDK Examples",
    description:
      "Practical AI SDK examples you can copy and paste. Each example is self-contained, well-documented, and demonstrates a specific pattern or technique for building AI-powered applications.",
    relatedPatterns: ["/group/demos", "/group/free", "/group/use-cases"],
  },
]

function slugToTitle(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

export function generateStaticParams() {
  return topics.map((topic) => ({
    topic: topic.slug,
  }))
}

export async function generateMetadata(props: {
  params: Promise<{ topic: string }>
}): Promise<Metadata> {
  const { topic } = await props.params
  const t = topics.find((item) => item.slug === topic)

  if (!t) {
    return { title: "Topic Not Found" }
  }

  return {
    title: t.title,
    description: t.description,
  }
}

export default async function ExplorePage(props: {
  params: Promise<{ topic: string }>
}) {
  const { topic } = await props.params
  const t = topics.find((item) => item.slug === topic)

  if (!t) {
    notFound()
  }

  return (
    <div className="container py-16 md:py-24">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-12">
          <Link
            href="/"
            className="text-muted-foreground hover:text-foreground mb-4 inline-flex items-center gap-1 text-sm transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={14}
              height={14}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            Home
          </Link>
          <h1 className="text-4xl font-bold tracking-tight">{t.title}</h1>
          <p className="text-muted-foreground mt-4 text-lg leading-relaxed">
            {t.description}
          </p>
        </div>

        {/* Related Patterns */}
        <div className="mb-12">
          <h2 className="mb-4 text-lg font-semibold">Related Pattern Groups</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {t.relatedPatterns.map((href) => {
              const label = slugToTitle(href.split("/").pop() || "")
              return (
                <Link
                  key={href}
                  href={href}
                  className="border-border hover:border-foreground/20 hover:bg-muted flex flex-col rounded-lg border p-4 transition-colors"
                >
                  <span className="text-sm font-medium">{label}</span>
                  <span className="text-muted-foreground mt-1 text-xs">
                    View patterns
                  </span>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Explore More Topics */}
        <div>
          <h2 className="mb-4 text-lg font-semibold">Explore More Topics</h2>
          <div className="flex flex-wrap gap-2">
            {topics.map((item) => (
              <Link
                key={item.slug}
                href={`/explore/${item.slug}`}
                className={cn(
                  "rounded-md border px-3 py-1.5 text-sm font-medium transition-colors",
                  item.slug === topic
                    ? "bg-foreground text-background border-foreground"
                    : "border-border hover:bg-muted"
                )}
              >
                {item.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
