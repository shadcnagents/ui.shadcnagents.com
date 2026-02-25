import Link from "next/link"

import { siteConfig } from "@/config/site"

const docsLinks = [
  { title: "Get Started", href: "/docs" },
  { title: "About", href: "/docs/about" },
  { title: "Theming", href: "/docs/theming" },
  { title: "Changelog", href: "/docs/changelog" },
  { title: "AI SDK Blocks", href: "/docs/ai/ai-sdk-blocks" },
  { title: "AI Elements", href: "/docs/ai/ai-elements" },
  { title: "Agent Patterns", href: "/docs/agents/agent-patterns" },
  { title: "Building Agents", href: "/docs/agents/building-agents" },
  { title: "Router Agents", href: "/docs/agents/router-agents" },
  { title: "Context Engineering", href: "/docs/prompts/context-engineering" },
  { title: "Few-shot Prompting", href: "/docs/prompts/few-shot-prompting" },
  {
    title: "Button Group & Input Group",
    href: "/docs/components/button-group-input-group",
  },
]

const blocksLinks = [
  { title: "generateText", href: "/blocks/generateText" },
  { title: "streamText", href: "/blocks/streamText" },
  { title: "generateImage", href: "/blocks/generateImage" },
  { title: "generateSpeech", href: "/blocks/generateSpeech" },
  { title: "transcribe", href: "/blocks/transcribe" },
  { title: "tool", href: "/blocks/tool" },
  { title: "Agent", href: "/blocks/agent" },
  { title: "Routing Pattern", href: "/blocks/routing-pattern" },
  { title: "Orchestrator-Worker", href: "/blocks/orchestrator-worker" },
  {
    title: "Sub-Agent Orchestrator",
    href: "/blocks/sub-agent-orchestrator",
  },
  { title: "HIL Tool Approval", href: "/blocks/hil-tool-approval" },
  { title: "HIL Context Builder", href: "/blocks/hil-context-builder" },
  { title: "HIL Needs Approval", href: "/blocks/hil-needs-approval" },
  { title: "Evaluator-Optimizer", href: "/blocks/evaluator-optimizer" },
  { title: "Multi-Step Tool", href: "/blocks/multi-step-tool" },
  { title: "Parallel Processing", href: "/blocks/parallel-processing" },
  { title: "Chat-Base Clone", href: "/blocks/chat-base-clone" },
  { title: "Form Generator", href: "/blocks/form-generator" },
  {
    title: "Table Editor Artifact",
    href: "/blocks/table-editor-artifact",
  },
  {
    title: "Chart Generation Artifact",
    href: "/blocks/chart-generation-artifact",
  },
  {
    title: "Basic Chat Interface",
    href: "/blocks/basic-chat-interface",
  },
  { title: "Reasoning Display", href: "/blocks/reasoning-display" },
  { title: "Sources & Citations", href: "/blocks/sources-and-citations" },
  { title: "Plan Display", href: "/blocks/plan-display" },
  { title: "Tool Approval", href: "/blocks/tool-approval" },
  { title: "Queue Display", href: "/blocks/queue-display" },
]

const categoriesLinks = [
  { title: "Agents", href: "/group/agents" },
  { title: "Chat", href: "/group/chat" },
  { title: "Generation", href: "/group/generation" },
  { title: "Analysis", href: "/group/analysis" },
  { title: "Tools", href: "/group/tools" },
  { title: "Artifacts", href: "/group/artifacts" },
  { title: "Data", href: "/group/data" },
  { title: "Marketing", href: "/group/marketing" },
  { title: "Model Comparison", href: "/group/model-comparison" },
  { title: "Demos", href: "/group/demos" },
  { title: "Pricing", href: "/group/pricing" },
  { title: "Integrations", href: "/group/integrations" },
  { title: "Use Cases", href: "/group/use-cases" },
  { title: "Free", href: "/group/free" },
]

const exploreLinks = [
  { title: "AI Agent Builder", href: "/explore/ai-agent-builder" },
  { title: "AI Agent Frameworks", href: "/explore/ai-agent-frameworks" },
  {
    title: "AI Agent Development",
    href: "/explore/ai-agent-development",
  },
  { title: "AI Agent Skills", href: "/explore/ai-agent-skills" },
  {
    title: "AI Agent Orchestration",
    href: "/explore/ai-agent-orchestration",
  },
  { title: "AI Agent Platform", href: "/explore/ai-agent-platform" },
  { title: "AI Agent GitHub", href: "/explore/ai-agent-github" },
  { title: "AI SDK Vercel", href: "/explore/ai-sdk-vercel" },
  { title: "AI SDK v6", href: "/explore/ai-sdk-v6" },
  { title: "AI SDK UI", href: "/explore/ai-sdk-ui" },
  { title: "AI SDK Google", href: "/explore/ai-sdk-google" },
  { title: "AI SDK MCP", href: "/explore/ai-sdk-mcp" },
  { title: "AI SDK Examples", href: "/explore/ai-sdk-examples" },
]

const quickLinks = [
  { title: "Stacks", href: "/stacks" },
  { title: "Directory", href: "/directory" },
  { title: "Pricing", href: "/pricing" },
  { title: "Login", href: "/login" },
  { title: "Signup", href: "/signup" },
]

function FooterColumn({
  heading,
  links,
}: {
  heading: string
  links: { title: string; href: string }[]
}) {
  return (
    <div>
      <h3 className="font-semibold text-sm mb-4">{heading}</h3>
      <nav className="flex flex-col gap-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            {link.title}
          </Link>
        ))}
      </nav>
    </div>
  )
}

export function SiteFooter() {
  return (
    <footer className="py-16 border-t border-border">
      <div className="max-w-7xl mx-auto px-6">
        {/* 4-column link grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <FooterColumn heading="Docs" links={docsLinks} />
          <FooterColumn heading="Blocks" links={blocksLinks} />
          <FooterColumn heading="Categories" links={categoriesLinks} />
          <FooterColumn heading="Explore" links={exploreLinks} />
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Quick links */}
          <nav className="flex items-center gap-1 text-sm text-muted-foreground">
            {quickLinks.map((link, index) => (
              <span key={link.href} className="flex items-center gap-1">
                <Link
                  href={link.href}
                  className="hover:text-foreground"
                >
                  {link.title}
                </Link>
                {index < quickLinks.length - 1 && (
                  <span className="mx-1">|</span>
                )}
              </span>
            ))}
          </nav>

          {/* Brand + theme toggle */}
          <div className="flex items-center gap-4 text-sm">
            <span className="font-medium">shadcncloud</span>
            <span className="text-muted-foreground">Theme</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
