import Link from "next/link"

import { siteConfig } from "@/config/site"

const docsLinks = [
  { title: "Get Started", href: "/docs" },
  { title: "Installation", href: "/docs/installation" },
  { title: "Theming", href: "/docs/theming" },
  { title: "MCP Server", href: "/docs/mcp-server" },
  { title: "Changelog", href: "/docs/changelog" },
  { title: "AI SDK Blocks", href: "/docs/ai/ai-sdk-blocks" },
  { title: "AI Elements", href: "/docs/ai/ai-elements" },
  { title: "Agent Patterns", href: "/docs/agents/agent-patterns" },
  { title: "Building Agents", href: "/docs/agents/building-agents" },
  { title: "Router Agents", href: "/docs/agents/router-agents" },
  { title: "Context Engineering", href: "/docs/prompts/context-engineering" },
  { title: "Few-shot Prompting", href: "/docs/prompts/few-shot-prompting" },
]

const blocksLinks = [
  { title: "generateText", href: "/stacks/basics-generate-text" },
  { title: "streamText", href: "/stacks/basics-stream-text" },
  { title: "generateImage", href: "/stacks/basics-generate-image" },
  { title: "generateSpeech", href: "/stacks/basics-generate-speech" },
  { title: "transcribe", href: "/stacks/basics-transcribe" },
  { title: "tool( )", href: "/stacks/basics-tool" },
  { title: "Agent( )", href: "/stacks/basics-agent" },
  { title: "Routing Pattern", href: "/stacks/ai-agents-routing" },
  { title: "Orchestrator-Worker", href: "/stacks/ai-chat-agent-orchestrator-pattern" },
  { title: "Sub-Agent Orchestrator", href: "/stacks/sub-agent-orchestrator" },
  { title: "HIL Tool Approval", href: "/stacks/ai-human-in-the-loop" },
  { title: "HIL Needs Approval", href: "/stacks/ai-chat-agent-tool-approval" },
  { title: "Evaluator-Optimizer", href: "/stacks/ai-chat-agent-evaluator-optimizer-pattern" },
  { title: "Multi-Step Tools", href: "/stacks/ai-chat-agent-multi-step-tool-pattern" },
  { title: "Parallel Processing", href: "/stacks/ai-agents-parallel-processing" },
  { title: "Basic Chat", href: "/stacks/ai-elements-chat" },
  { title: "Reasoning Display", href: "/stacks/ai-elements-reasoning-chat" },
  { title: "Sources & Citations", href: "/stacks/ai-elements-sources-chat" },
  { title: "Plan Display", href: "/stacks/ai-elements-plan" },
  { title: "Tool Approval UI", href: "/stacks/ai-elements-confirmation" },
  { title: "Queue Display", href: "/stacks/ai-elements-queue" },
  { title: "Table Editor", href: "/stacks/ai-artifact-table" },
  { title: "Chart Generation", href: "/stacks/ai-artifact-chart" },
  { title: "Claude Web Search", href: "/stacks/tool-websearch-claude" },
  { title: "PDF Analysis", href: "/stacks/ai-pdf-ingest" },
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
          <FooterColumn heading="Stacks" links={blocksLinks} />
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
