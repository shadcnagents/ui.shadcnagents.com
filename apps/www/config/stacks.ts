export type StackTier = "free" | "pro"

export interface StackItem {
  text: string
  description: string
  link: string
  tier: StackTier
}

export interface StackSubCategory {
  text: string
  children: StackItem[]
}

export interface StackCategory {
  name: string
  id: string
  items: (StackItem | StackSubCategory)[]
}

export function isSubCategory(
  item: StackItem | StackSubCategory
): item is StackSubCategory {
  return "children" in item
}

export const stacksConfig: StackCategory[] = [
  {
    name: "Foundations",
    id: "sdk-api",
    items: [
      {
        text: "generateText( )",
        children: [
          {
            text: "Generate Text",
            description: "Basic text generation with AI models",
            link: "/stacks/basics-generate-text",
            tier: "free",
          },
        ],
      },
      {
        text: "streamText( )",
        children: [
          {
            text: "Stream Text",
            description: "Real-time token streaming",
            link: "/stacks/basics-stream-text",
            tier: "free",
          },
        ],
      },
      {
        text: "generateImage( )",
        children: [
          {
            text: "Generate Image",
            description: "AI image creation",
            link: "/stacks/basics-generate-image",
            tier: "free",
          },
        ],
      },
      {
        text: "generateSpeech( )",
        children: [
          {
            text: "Generate Speech",
            description: "Text to speech synthesis",
            link: "/stacks/basics-generate-speech",
            tier: "free",
          },
        ],
      },
      {
        text: "transcribe( )",
        children: [
          {
            text: "Transcribe Audio",
            description: "Speech to text transcription",
            link: "/stacks/basics-transcribe",
            tier: "free",
          },
        ],
      },
      {
        text: "tool( )",
        children: [
          {
            text: "Tool Calling",
            description: "Function and tool invocation",
            link: "/stacks/basics-tool",
            tier: "free",
          },
        ],
      },
      {
        text: "Agent( )",
        children: [
          {
            text: "Agent Setup",
            description: "Create an AI agent",
            link: "/stacks/basics-agent",
            tier: "free",
          },
        ],
      },
    ],
  },
  {
    name: "Agent Architecture",
    id: "agent-patterns",
    items: [
      {
        text: "Routing Pattern",
        description: "Route requests to specialized agents",
        link: "/stacks/ai-agents-routing",
        tier: "free",
      },
      {
        text: "Orchestration & Sub-Agents",
        children: [
          {
            text: "Orchestrator-Worker",
            description: "Delegate subtasks to workers",
            link: "/stacks/ai-chat-agent-orchestrator-pattern",
            tier: "pro",
          },
          {
            text: "Sub-Agent Orchestrator",
            description: "Nested agent coordination",
            link: "/stacks/sub-agent-orchestrator",
            tier: "pro",
          },
        ],
      },
      {
        text: "Human-in-the-Loop",
        children: [
          {
            text: "Tool Approval Basic",
            description: "Simple approval flow",
            link: "/stacks/ai-human-in-the-loop",
            tier: "free",
          },
          {
            text: "Context Builder",
            description: "Agent-guided context gathering",
            link: "/stacks/ai-human-in-the-loop-agentic-context-builder",
            tier: "pro",
          },
          {
            text: "Needs Approval",
            description: "Gated tool execution",
            link: "/stacks/ai-chat-agent-tool-approval",
            tier: "pro",
          },
          {
            text: "Inquire Multi-Choice",
            description: "Multiple choice user input",
            link: "/stacks/ai-human-in-the-loop-inquire-multiple-choice",
            tier: "pro",
          },
          {
            text: "Inquire Text Input",
            description: "Free-form user input",
            link: "/stacks/ai-human-in-the-loop-inquire-text",
            tier: "pro",
          },
        ],
      },
      {
        text: "Evaluator-Optimizer",
        description: "Self-improving feedback loops",
        link: "/stacks/ai-chat-agent-evaluator-optimizer-pattern",
        tier: "pro",
      },
      {
        text: "Multi-Step & Parallel",
        children: [
          {
            text: "Multi-Step Tools",
            description: "Chained sequential tool calls",
            link: "/stacks/ai-chat-agent-multi-step-tool-pattern",
            tier: "pro",
          },
          {
            text: "Parallel Processing",
            description: "Concurrent agent execution",
            link: "/stacks/ai-agents-parallel-processing",
            tier: "free",
          },
        ],
      },
    ],
  },
  {
    name: "Starter Apps",
    id: "examples",
    items: [
      {
        text: "Chat-Base Clone",
        description: "Full-stack chat application",
        link: "/stacks/examples-chat-base-clone",
        tier: "pro",
      },
      {
        text: "Agentic Context Builder",
        description: "Context gathering application",
        link: "/stacks/ai-human-in-the-loop-agentic-context-builder",
        tier: "pro",
      },
      {
        text: "Form Generator",
        description: "Dynamic form builder",
        link: "/stacks/examples-form-generator",
        tier: "pro",
      },
      {
        text: "Research Agents",
        children: [
          {
            text: "Data Analysis Agent",
            description: "Data insight extraction",
            link: "/stacks/example-agent-data-analysis",
            tier: "pro",
          },
          {
            text: "Branding Agent",
            description: "Brand strategy automation",
            link: "/stacks/example-agent-branding",
            tier: "pro",
          },
          {
            text: "Competitor Research",
            description: "Market analysis agent",
            link: "/stacks/example-agent-competitor",
            tier: "pro",
          },
          {
            text: "SEO Audit Agent",
            description: "SEO assessment automation",
            link: "/stacks/example-agent-seo-audit",
            tier: "pro",
          },
          {
            text: "Reddit Validation",
            description: "Social validation agent",
            link: "/stacks/example-agent-reddit-validation",
            tier: "pro",
          },
        ],
      },
      {
        text: "Audit Agents",
        children: [
          {
            text: "A11y Audit Agent",
            description: "Accessibility audit automation",
            link: "/stacks/example-agent-a11y-audit",
            tier: "pro",
          },
        ],
      },
    ],
  },
  {
    name: "Rich Output",
    id: "artifacts",
    items: [
      {
        text: "Table Editor",
        description: "Editable data tables",
        link: "/stacks/ai-artifact-table",
        tier: "free",
      },
      {
        text: "Chart Generation",
        description: "Data visualization",
        link: "/stacks/ai-artifact-chart",
        tier: "free",
      },
      {
        text: "JSON Render",
        children: [
          {
            text: "JSON Render Shadcn",
            description: "UI generation from JSON",
            link: "/stacks/json-render-shadcn",
            tier: "pro",
          },
          {
            text: "JSON Render Generate",
            description: "Dynamic JSON rendering",
            link: "/stacks/json-render-generate",
            tier: "pro",
          },
          {
            text: "JSON Render PDF",
            description: "PDF generation from JSON",
            link: "/stacks/json-render-pdf",
            tier: "pro",
          },
          {
            text: "JSON Render Remotion",
            description: "Video generation from JSON",
            link: "/stacks/json-render-remotion",
            tier: "pro",
          },
        ],
      },
      {
        text: "Streaming Markdown",
        description: "Streaming markdown renderer with syntax-highlighted code blocks",
        link: "/stacks/streaming-markdown-renderer",
        tier: "free",
      },
      {
        text: "Artifact Canvas",
        description: "ChatGPT Canvas / Claude Artifacts split-pane chat and live preview",
        link: "/stacks/artifact-canvas",
        tier: "pro",
      },
      {
        text: "AI Image Output",
        description: "Image generation card with shimmer loading and download button",
        link: "/stacks/ai-image-output",
        tier: "free",
      },
      {
        text: "Structured Output",
        description: "Collapsible JSON tree viewer for generateObject responses",
        link: "/stacks/structured-output-viewer",
        tier: "free",
      },
      {
        text: "Web Preview",
        description: "Sandboxed iframe for AI-generated HTML and React artifacts",
        link: "/stacks/web-preview-sandbox",
        tier: "pro",
      },
    ],
  },
  {
    name: "Connectors",
    id: "tools-integrations",
    items: [
      {
        text: "Web Search",
        children: [
          {
            text: "Claude Web Search",
            description: "Anthropic search integration",
            link: "/stacks/tool-websearch-claude",
            tier: "free",
          },
          {
            text: "Exa Web Search",
            description: "Exa neural search",
            link: "/stacks/tool-websearch-exa",
            tier: "free",
          },
          {
            text: "Exa Labs Search",
            description: "Advanced Exa search",
            link: "/stacks/tool-websearch-exa-2",
            tier: "pro",
          },
          {
            text: "Firecrawl Scraper",
            description: "Web page scraping",
            link: "/stacks/tool-websearch-firecrawl",
            tier: "pro",
          },
        ],
      },
      {
        text: "Web Scraping",
        children: [
          {
            text: "Cheerio Scraper",
            description: "HTML DOM parsing",
            link: "/stacks/cheerio-scraper",
            tier: "free",
          },
          {
            text: "Jina AI Scraper",
            description: "AI-powered web scraping",
            link: "/stacks/jina-scraper",
            tier: "free",
          },
          {
            text: "Markdown Scraper",
            description: "URL to markdown conversion",
            link: "/stacks/markdown-new-scraper",
            tier: "free",
          },
        ],
      },
      {
        text: "File Processing",
        children: [
          {
            text: "PDF Analysis",
            description: "PDF file processing",
            link: "/stacks/ai-pdf-ingest",
            tier: "free",
          },
        ],
      },
    ],
  },
  {
    name: "Pipelines",
    id: "workflows",
    items: [
      {
        text: "Sequential Workflows",
        children: [
          {
            text: "URL Analysis",
            description: "Basic URL analysis workflow",
            link: "/stacks/ai-workflow-basic",
            tier: "free",
          },
          {
            text: "Sequential Workflow",
            description: "Step-by-step execution flow",
            link: "/stacks/wdk-workflows-sequential",
            tier: "pro",
          },
        ],
      },
      {
        text: "Durable Workflows (WDK)",
        children: [
          {
            text: "Evaluator Workflow",
            description: "Quality assessment pipeline",
            link: "/stacks/wdk-workflows-evaluator",
            tier: "pro",
          },
          {
            text: "Orchestrator Workflow",
            description: "Managed task delegation",
            link: "/stacks/wdk-workflows-orchestrator",
            tier: "pro",
          },
          {
            text: "Parallel Review",
            description: "Concurrent review pipeline",
            link: "/stacks/wdk-workflows-parallel",
            tier: "pro",
          },
          {
            text: "Routing Workflow",
            description: "Dynamic path routing",
            link: "/stacks/wdk-workflows-routing",
            tier: "pro",
          },
        ],
      },
      {
        text: "Few-Shot Editor",
        description: "Prompt engineering tool",
        link: "/stacks/ai-sdk-prompt-few-shot",
        tier: "pro",
      },
    ],
  },
  {
    name: "Chat Kit",
    id: "chat-ui-elements",
    items: [
      {
        text: "Chat Interfaces",
        children: [
          {
            text: "Basic Chat",
            description: "Simple chat interface",
            link: "/stacks/ai-elements-chat",
            tier: "free",
          },
          {
            text: "ChatGPT Clone",
            description: "OpenAI-style chat UI",
            link: "/stacks/chat-gpt",
            tier: "pro",
          },
          {
            text: "Claude Clone",
            description: "Anthropic-style chat UI",
            link: "/stacks/chat-claude",
            tier: "pro",
          },
          {
            text: "Grok Clone",
            description: "xAI-style chat UI",
            link: "/stacks/chat-grok",
            tier: "pro",
          },
        ],
      },
      {
        text: "Reasoning & Sources",
        children: [
          {
            text: "Reasoning Display",
            description: "Show model thinking process",
            link: "/stacks/ai-elements-reasoning-chat",
            tier: "free",
          },
          {
            text: "Sources & Citations",
            description: "Reference and source display",
            link: "/stacks/ai-elements-sources-chat",
            tier: "free",
          },
          {
            text: "Inline Citations",
            description: "In-text reference markers",
            link: "/stacks/ai-elements-inline-citation",
            tier: "pro",
          },
        ],
      },
      {
        text: "Confirmations & Plans",
        children: [
          {
            text: "Plan Display",
            description: "Step-by-step plan rendering",
            link: "/stacks/ai-elements-plan",
            tier: "free",
          },
          {
            text: "Tool Approval",
            description: "Confirm tool actions inline",
            link: "/stacks/ai-elements-confirmation",
            tier: "free",
          },
          {
            text: "Queue Display",
            description: "Task queue visualization",
            link: "/stacks/ai-elements-queue",
            tier: "free",
          },
        ],
      },
      {
        text: "Input & Controls",
        children: [
          {
            text: "AI Prompt Input",
            description: "Auto-growing textarea with attachment and keyboard shortcuts",
            link: "/stacks/ai-prompt-input",
            tier: "free",
          },
          {
            text: "Voice Input Button",
            description: "Mic button with recording states and waveform",
            link: "/stacks/voice-input-button",
            tier: "free",
          },
          {
            text: "Model Selector",
            description: "Command-palette model picker grouped by provider",
            link: "/stacks/model-selector",
            tier: "free",
          },
          {
            text: "Token Counter",
            description: "Context window meter with circular progress ring",
            link: "/stacks/token-counter",
            tier: "free",
          },
        ],
      },
      {
        text: "Conversation",
        children: [
          {
            text: "Prompt Suggestions",
            description: "Chat empty state with clickable suggestion chips",
            link: "/stacks/prompt-suggestion-pills",
            tier: "free",
          },
          {
            text: "Multimodal Upload",
            description: "File and image attachment tray for AI chat",
            link: "/stacks/multimodal-file-upload",
            tier: "pro",
          },
          {
            text: "History Sidebar",
            description: "Conversation list with date grouping and search",
            link: "/stacks/conversation-history-sidebar",
            tier: "pro",
          },
          {
            text: "Message Branch",
            description: "Navigate between regenerated AI responses",
            link: "/stacks/message-branch-navigator",
            tier: "pro",
          },
        ],
      },
      {
        text: "Loading & Streaming",
        children: [
          {
            text: "AI Loading States",
            description: "Wave dots, shimmer, pulsing orb loading animations",
            link: "/stacks/ai-loading-states",
            tier: "free",
          },
          {
            text: "Token Stream Effect",
            description: "Smooth token-by-token text animation for LLM output",
            link: "/stacks/ai-token-stream",
            tier: "free",
          },
        ],
      },
    ],
  },
  {
    name: "Landing Blocks",
    id: "marketing-ui",
    items: [
      {
        text: "Feature Sections",
        children: [
          {
            text: "Code Block 1",
            description: "Code feature showcase",
            link: "/stacks/marketing-feature-code-block-1",
            tier: "free",
          },
          {
            text: "Code Block 2",
            description: "Alternative code showcase",
            link: "/stacks/marketing-feature-code-block-2",
            tier: "free",
          },
          {
            text: "Code Block 3",
            description: "Dark code showcase",
            link: "/stacks/marketing-feature-code-block-3",
            tier: "free",
          },
          {
            text: "Feature Grid",
            description: "Grid feature layout",
            link: "/stacks/marketing-feature-grid-1",
            tier: "free",
          },
        ],
      },
      {
        text: "Bento Layout",
        description: "Bento grid composition",
        link: "/stacks/marketing-bento-1",
        tier: "free",
      },
      {
        text: "Comparison Tables",
        children: [
          {
            text: "Model Comparison",
            description: "Side-by-side model compare",
            link: "/stacks/marketing-model-comparison",
            tier: "pro",
          },
          {
            text: "Comparison Compact",
            description: "Dense model comparison",
            link: "/stacks/marketing-model-comparison-compact",
            tier: "pro",
          },
          {
            text: "Comparison Table",
            description: "Tabular model comparison",
            link: "/stacks/marketing-model-comparison-table-1",
            tier: "pro",
          },
        ],
      },
      {
        text: "Integrations",
        children: [
          {
            text: "Integration Showcase",
            description: "Partner integrations grid",
            link: "/stacks/marketing-integrations-1",
            tier: "pro",
          },
          {
            text: "Integrations Circle",
            description: "Circular integration layout",
            link: "/stacks/marketing-integrations-2",
            tier: "pro",
          },
        ],
      },
      {
        text: "Business Tools",
        children: [
          {
            text: "ROI Calculator",
            description: "Cost-benefit calculator",
            link: "/stacks/marketing-calculator-agent-roi",
            tier: "pro",
          },
          {
            text: "Changelog",
            description: "Release notes display",
            link: "/stacks/marketing-changelog-1",
            tier: "pro",
          },
        ],
      },
    ],
  },
]

/** Flatten all stacks */
export function getAllStacks(): StackItem[] {
  const items: StackItem[] = []
  for (const category of stacksConfig) {
    for (const item of category.items) {
      if (isSubCategory(item)) {
        items.push(...item.children)
      } else {
        items.push(item)
      }
    }
  }
  return items
}
