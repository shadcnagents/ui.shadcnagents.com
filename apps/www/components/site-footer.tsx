import Link from "next/link"

import { siteConfig } from "@/config/site"

/* ──────────────────────────────────────────────────────────
 *  FOOTER DATA — Only valid stacks from registry
 * ────────────────────────────────────────────────────────── */

const docs = [
  { title: "Get Started", href: "/docs" },
  { title: "About", href: "/docs/about" },
  { title: "Theming", href: "/docs/theming" },
  { title: "Changelog", href: "/docs/changelog" },
  { title: "AI SDK Blocks", href: "/docs/blocks" },
  { title: "AI Elements", href: "/docs/elements" },
  { title: "Agent Patterns", href: "/docs/agent-patterns" },
  { title: "Building Agents", href: "/docs/building-agents" },
  { title: "Router Agents", href: "/docs/router-agents" },
  { title: "Context Engineering", href: "/docs/context-engineering" },
  { title: "Few-shot Prompting", href: "/docs/few-shot-prompting" },
]

// Valid stacks from registry - Column 1: Basics & AI Elements
const blocksColumn1 = [
  { title: "Generate Text", href: "/stacks/basics-generate-text" },
  { title: "Stream Text", href: "/stacks/basics-stream-text" },
  { title: "Generate Image", href: "/stacks/basics-generate-image" },
  { title: "Generate Speech", href: "/stacks/basics-generate-speech" },
  { title: "Transcribe Audio", href: "/stacks/basics-transcribe" },
  { title: "Tool Calling", href: "/stacks/basics-tool" },
  { title: "Basic Agent", href: "/stacks/basics-agent" },
  { title: "Multi-Model Text", href: "/stacks/basics-generate-text-multi-model" },
  { title: "Text Prompt", href: "/stacks/basics-generate-text-prompt" },
  { title: "Basic Chat", href: "/stacks/ai-elements-chat" },
  { title: "Tool Confirmation", href: "/stacks/ai-elements-confirmation" },
  { title: "Plan Display", href: "/stacks/ai-elements-plan" },
  { title: "Task Queue", href: "/stacks/ai-elements-queue" },
  { title: "Reasoning Chat", href: "/stacks/ai-elements-reasoning-chat" },
  { title: "Sources Chat", href: "/stacks/ai-elements-sources-chat" },
  { title: "Error Boundary", href: "/stacks/ai-error-boundary" },
  { title: "Loading States", href: "/stacks/ai-loading-states" },
  { title: "Image Output", href: "/stacks/ai-image-output" },
]

// Valid stacks from registry - Column 2: Agents, Artifacts, Tools
const blocksColumn2 = [
  { title: "Agent Routing", href: "/stacks/ai-agents-routing" },
  { title: "Parallel Processing", href: "/stacks/ai-agents-parallel-processing" },
  { title: "Human in the Loop", href: "/stacks/ai-human-in-the-loop" },
  { title: "Basic Workflow", href: "/stacks/ai-workflow-basic" },
  { title: "Chart Artifact", href: "/stacks/ai-artifact-chart" },
  { title: "Table Artifact", href: "/stacks/ai-artifact-table" },
  { title: "Artifact Canvas", href: "/stacks/artifact-canvas" },
  { title: "PDF Ingest", href: "/stacks/ai-pdf-ingest" },
  { title: "Web Search (Claude)", href: "/stacks/tool-websearch-claude" },
  { title: "Web Search (Exa)", href: "/stacks/tool-websearch-exa" },
  { title: "Cheerio Scraper", href: "/stacks/cheerio-scraper" },
  { title: "Jina Scraper", href: "/stacks/jina-scraper" },
  { title: "Markdown.new Scraper", href: "/stacks/markdown-new-scraper" },
  { title: "Streaming Markdown", href: "/stacks/streaming-markdown-renderer" },
  { title: "Structured Output Viewer", href: "/stacks/structured-output-viewer" },
  { title: "Prompt Suggestions", href: "/stacks/prompt-suggestion-pills" },
  { title: "Voice Input", href: "/stacks/voice-input-button" },
]

// Valid stacks from registry - Column 3: Production & Marketing
const blocksColumn3 = [
  { title: "Agent Memory Kit", href: "/stacks/agent-memory-kit" },
  { title: "Chat Persistence", href: "/stacks/chat-persistence-kit" },
  { title: "Context Window Manager", href: "/stacks/context-window-manager" },
  { title: "Cost Tracker", href: "/stacks/cost-tracker" },
  { title: "Model Fallback", href: "/stacks/model-fallback-handler" },
  { title: "Model Selector", href: "/stacks/model-selector" },
  { title: "Output Sanitizer", href: "/stacks/output-sanitizer" },
  { title: "Prompt Injection Guard", href: "/stacks/prompt-injection-guard" },
  { title: "Rate Limiter", href: "/stacks/rate-limit-handler" },
  { title: "Request Deduplicator", href: "/stacks/request-deduplicator" },
  { title: "Semantic Cache", href: "/stacks/semantic-cache" },
  { title: "Streaming Reconnect", href: "/stacks/streaming-reconnect" },
  { title: "Structured Validator", href: "/stacks/structured-output-validator" },
  { title: "Token Counter", href: "/stacks/token-counter" },
  { title: "Bento Layout", href: "/stacks/marketing-bento-1" },
  { title: "Code Block 1", href: "/stacks/marketing-feature-code-block-1" },
  { title: "Code Block 2", href: "/stacks/marketing-feature-code-block-2" },
  { title: "Code Block 3", href: "/stacks/marketing-feature-code-block-3" },
  { title: "Feature Grid", href: "/stacks/marketing-feature-grid-1" },
]

const categories = [
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
  { title: "Examples", href: "/group/examples" },
  { title: "Pricing", href: "/pricing" },
  { title: "Integrations", href: "/group/integrations" },
  { title: "Use Cases", href: "/group/use-cases" },
  { title: "Free", href: "/group/free" },
]

const explore = [
  { title: "AI Agent Builder", href: "https://www.google.com/search?q=AI+Agent+Builder", external: true },
  { title: "AI Agent Frameworks", href: "https://www.google.com/search?q=AI+Agent+Frameworks", external: true },
  { title: "AI Agent Development", href: "https://www.google.com/search?q=AI+Agent+Development", external: true },
  { title: "AI Agent Skills", href: "https://www.google.com/search?q=AI+Agent+Skills", external: true },
  { title: "AI Agent Orchestration", href: "https://www.google.com/search?q=AI+Agent+Orchestration", external: true },
  { title: "AI Agent Platform", href: "https://www.google.com/search?q=AI+Agent+Platform", external: true },
  { title: "AI Agent GitHub", href: "https://github.com/topics/ai-agents", external: true },
  { title: "AI SDK Vercel", href: "https://sdk.vercel.ai", external: true },
  { title: "AI SDK v6", href: "https://sdk.vercel.ai/docs", external: true },
  { title: "AI SDK UI", href: "https://sdk.vercel.ai/docs/ai-sdk-ui", external: true },
  { title: "AI SDK Google", href: "https://sdk.vercel.ai/providers/ai-sdk-providers/google-generative-ai", external: true },
  { title: "AI SDK MCP", href: "https://sdk.vercel.ai/docs/ai-sdk-core/tools-and-tool-calling", external: true },
  { title: "AI SDK Examples", href: "https://github.com/vercel/ai/tree/main/examples", external: true },
]

const quickLinks = [
  { title: "Patterns", href: "/stacks" },
  { title: "Directory", href: "/directory" },
  { title: "Pricing", href: "/pricing" },
  { title: "Login", href: "/auth/login" },
  { title: "Signup", href: "/auth/signup" },
]

/* ──────────────────────────────────────────────────────────
 *  FOOTER COMPONENT
 * ────────────────────────────────────────────────────────── */

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      {/* Main footer grid */}
      <div className="mx-auto max-w-7xl px-6 py-12 md:px-10 md:py-16">
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 lg:grid-cols-7">
          {/* Docs */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground">Docs</h3>
            <nav className="flex flex-col gap-2">
              {docs.map((link) => (
                <Link
                  key={link.href + link.title}
                  href={link.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.title}
                </Link>
              ))}
            </nav>
          </div>

          {/* Blocks - Column 1 */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground">Blocks</h3>
            <nav className="flex flex-col gap-2">
              {blocksColumn1.map((link) => (
                <Link
                  key={link.href + link.title}
                  href={link.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.title}
                </Link>
              ))}
            </nav>
          </div>

          {/* Blocks - Column 2 */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-transparent select-none">&nbsp;</h3>
            <nav className="flex flex-col gap-2">
              {blocksColumn2.map((link) => (
                <Link
                  key={link.href + link.title}
                  href={link.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.title}
                </Link>
              ))}
            </nav>
          </div>

          {/* Blocks - Column 3 */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-transparent select-none">&nbsp;</h3>
            <nav className="flex flex-col gap-2">
              {blocksColumn3.map((link) => (
                <Link
                  key={link.href + link.title}
                  href={link.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.title}
                </Link>
              ))}
            </nav>
          </div>

          {/* Categories */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground">Categories</h3>
            <nav className="flex flex-col gap-2">
              {categories.map((link) => (
                <Link
                  key={link.href + link.title}
                  href={link.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.title}
                </Link>
              ))}
            </nav>
          </div>

          {/* Explore */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground">Explore</h3>
            <nav className="flex flex-col gap-2">
              {explore.map((link) => (
                <Link
                  key={link.href + link.title}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.title}
                </Link>
              ))}
            </nav>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground">Quick Links</h3>
            <nav className="flex flex-col gap-2">
              {quickLinks.map((link) => (
                <Link
                  key={link.href + link.title}
                  href={link.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.title}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Bottom bar with branding */}
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10">
          <Link href="/" className="text-sm font-medium text-foreground">
            ai sdk agents
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href={siteConfig.links.twitter}
              target="_blank"
              rel="noreferrer"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              <svg className="size-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
