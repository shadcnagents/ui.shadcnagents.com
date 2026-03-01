/* ─────────────────────────────────────────────────────
 * Brand definitions + stack-to-brand mapping
 * Each stack is associated with a real-world company
 * whose product uses the same pattern.
 * ─────────────────────────────────────────────────── */

export interface Brand {
  name: string
  accent: string        // OKLCH color for light mode
  accentDark?: string   // OKLCH color for dark mode (optional override)
}

/* ─── Brand palette ─── */

export const brands: Record<string, Brand> = {
  openai: {
    name: "OpenAI",
    accent: "oklch(0.62 0.17 163)",
  },
  anthropic: {
    name: "Anthropic",
    accent: "oklch(0.65 0.15 45)",
  },
  google: {
    name: "Google",
    accent: "oklch(0.60 0.19 260)",
  },
  vercel: {
    name: "Vercel",
    accent: "oklch(0.55 0.20 255)",
  },
  perplexity: {
    name: "Perplexity",
    accent: "oklch(0.65 0.13 200)",
  },
  elevenlabs: {
    name: "ElevenLabs",
    accent: "oklch(0.55 0.23 290)",
  },
  deepseek: {
    name: "DeepSeek",
    accent: "oklch(0.55 0.22 265)",
  },
  xai: {
    name: "xAI",
    accent: "oklch(0.50 0.05 250)",
    accentDark: "oklch(0.65 0.05 250)",
  },
  stripe: {
    name: "Stripe",
    accent: "oklch(0.52 0.25 280)",
  },
  linear: {
    name: "Linear",
    accent: "oklch(0.53 0.18 275)",
  },
  notion: {
    name: "Notion",
    accent: "oklch(0.45 0.12 45)",
  },
  langchain: {
    name: "LangChain",
    accent: "oklch(0.50 0.12 175)",
  },
  crewai: {
    name: "CrewAI",
    accent: "oklch(0.63 0.22 35)",
  },
  midjourney: {
    name: "Midjourney",
    accent: "oklch(0.50 0.22 290)",
  },
  firecrawl: {
    name: "Firecrawl",
    accent: "oklch(0.65 0.20 40)",
  },
  exa: {
    name: "Exa",
    accent: "oklch(0.50 0.24 285)",
  },
  jina: {
    name: "Jina AI",
    accent: "oklch(0.58 0.14 175)",
  },
  remotion: {
    name: "Remotion",
    accent: "oklch(0.58 0.19 255)",
  },
  adobe: {
    name: "Adobe",
    accent: "oklch(0.58 0.25 25)",
  },
  reddit: {
    name: "Reddit",
    accent: "oklch(0.60 0.23 35)",
  },
  openrouter: {
    name: "OpenRouter",
    accent: "oklch(0.53 0.22 277)",
  },
  huggingface: {
    name: "Hugging Face",
    accent: "oklch(0.78 0.16 85)",
  },
  devin: {
    name: "Devin",
    accent: "oklch(0.52 0.24 283)",
  },
  canva: {
    name: "Canva",
    accent: "oklch(0.62 0.17 200)",
  },
  v0: {
    name: "v0",
    accent: "oklch(0.55 0.20 255)",
  },
  chatbase: {
    name: "Chatbase",
    accent: "oklch(0.55 0.20 265)",
  },
  typeform: {
    name: "Typeform",
    accent: "oklch(0.50 0.20 270)",
  },
  zapier: {
    name: "Zapier",
    accent: "oklch(0.62 0.22 35)",
  },
  apple: {
    name: "Apple",
    accent: "oklch(0.55 0.20 255)",
  },
  intercom: {
    name: "Intercom",
    accent: "oklch(0.57 0.21 260)",
  },
  ahrefs: {
    name: "Ahrefs",
    accent: "oklch(0.62 0.18 50)",
  },
  shadcn: {
    name: "shadcn/ui",
    accent: "oklch(0.621 0.201 257.3)",
  },
} as const

/* ─── Stack slug → brand key mapping ─── */

export const stackBrandMap: Record<string, string> = {
  // ── Foundations ──
  "basics-generate-text": "openai",
  "basics-generate-text-multi-model": "vercel",
  "basics-generate-text-prompt": "openai",
  "basics-stream-text": "vercel",
  "basics-generate-image": "openai",
  "basics-generate-speech": "elevenlabs",
  "basics-transcribe": "openai",
  "basics-tool": "anthropic",
  "basics-agent": "anthropic",

  // ── Agent Architecture ──
  "ai-agents-routing": "anthropic",
  "ai-chat-agent-orchestrator-pattern": "langchain",
  "sub-agent-orchestrator": "crewai",
  "ai-human-in-the-loop": "anthropic",
  "ai-human-in-the-loop-agentic-context-builder": "anthropic",
  "ai-chat-agent-tool-approval": "anthropic",
  "ai-human-in-the-loop-inquire-multiple-choice": "anthropic",
  "ai-human-in-the-loop-inquire-text": "anthropic",
  "ai-chat-agent-evaluator-optimizer-pattern": "anthropic",
  "ai-chat-agent-multi-step-tool-pattern": "openai",
  "ai-agents-parallel-processing": "langchain",

  // ── Starter Apps ──
  "examples-chat-base-clone": "chatbase",
  "examples-form-generator": "typeform",
  "example-agent-data-analysis": "openai",
  "example-agent-branding": "canva",
  "example-agent-competitor": "openai",
  "example-agent-seo-audit": "ahrefs",
  "example-agent-reddit-validation": "reddit",
  "example-agent-a11y-audit": "google",

  // ── Rich Output ──
  "ai-artifact-table": "notion",
  "ai-artifact-chart": "openai",
  "json-render-shadcn": "shadcn",
  "json-render-generate": "v0",
  "json-render-pdf": "adobe",
  "json-render-remotion": "remotion",
  "streaming-markdown-renderer": "openai",
  "artifact-canvas": "anthropic",
  "ai-image-output": "midjourney",
  "structured-output-viewer": "openai",
  "web-preview-sandbox": "v0",

  // ── Connectors ──
  "tool-websearch-claude": "perplexity",
  "tool-websearch-exa": "exa",
  "tool-websearch-exa-2": "exa",
  "tool-websearch-firecrawl": "firecrawl",
  "cheerio-scraper": "perplexity",
  "jina-scraper": "jina",
  "markdown-new-scraper": "firecrawl",
  "ai-pdf-ingest": "openai",

  // ── Pipelines ──
  "ai-workflow-basic": "zapier",
  "wdk-workflows-sequential": "langchain",
  "wdk-workflows-evaluator": "langchain",
  "wdk-workflows-orchestrator": "langchain",
  "wdk-workflows-parallel": "langchain",
  "wdk-workflows-routing": "langchain",
  "ai-sdk-prompt-few-shot": "openai",

  // ── Chat Kit ──
  "ai-elements-chat": "openai",
  "chat-gpt": "openai",
  "chat-claude": "anthropic",
  "chat-grok": "xai",
  "ai-elements-reasoning-chat": "deepseek",
  "ai-elements-sources-chat": "perplexity",
  "ai-elements-inline-citation": "perplexity",
  "ai-elements-plan": "devin",
  "ai-elements-confirmation": "anthropic",
  "ai-elements-queue": "linear",
  "ai-prompt-input": "openai",
  "voice-input-button": "openai",
  "model-selector": "openrouter",
  "token-counter": "openai",
  "prompt-suggestion-pills": "openai",
  "multimodal-file-upload": "openai",
  "conversation-history-sidebar": "openai",
  "message-branch-navigator": "openai",
  "ai-loading-states": "anthropic",
  "ai-token-stream": "openai",

  // ── Landing Blocks ──
  "marketing-feature-code-block-1": "vercel",
  "marketing-feature-code-block-2": "stripe",
  "marketing-feature-code-block-3": "linear",
  "marketing-feature-grid-1": "vercel",
  "marketing-bento-1": "apple",
  "marketing-model-comparison": "anthropic",
  "marketing-model-comparison-compact": "openrouter",
  "marketing-model-comparison-table-1": "huggingface",
  "marketing-integrations-1": "vercel",
  "marketing-integrations-2": "notion",
  "marketing-calculator-agent-roi": "intercom",
  "marketing-changelog-1": "linear",
}

/* ─── Helper ─── */

export function getBrandForStack(slug: string): Brand | undefined {
  const key = stackBrandMap[slug]
  return key ? brands[key] : undefined
}

export function getBrandKeyForStack(slug: string): string | undefined {
  return stackBrandMap[slug]
}
