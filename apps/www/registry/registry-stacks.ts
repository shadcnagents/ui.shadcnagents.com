import { type Registry } from "@/registry/schema"

/**
 * Registry definition for all stacks.
 * Each stack is a complete Next.js app with real source files in
 * registry/stacks/[name]/. Run `pnpm registry:build:stacks` to generate
 * the installable public/r/[name].json files.
 */
export const stacks: Registry["items"] = [
  /* ────────────────────────────────────────────────────────────
   * GETTING STARTED
   * ──────────────────────────────────────────────────────────── */

  {
    name: "basics-generate-text",
    type: "registry:block",
    description: "Server-side text generation with usage metadata and GPT-4o.",
    dependencies: ["ai", "@ai-sdk/openai", "clsx", "tailwind-merge"],
    files: [
      {
        path: "registry/stacks/basics-generate-text/app/api/generate-text/route.ts",
        type: "registry:file",
        target: "app/api/generate-text/route.ts",
      },
      {
        path: "registry/stacks/basics-generate-text/components/generate-text-demo.tsx",
        type: "registry:component",
        target: "components/generate-text-demo.tsx",
      },
      {
        path: "registry/stacks/basics-generate-text/lib/utils.ts",
        type: "registry:lib",
        target: "lib/utils.ts",
      },
    ],
  },

  {
    name: "basics-generate-text-multi-model",
    type: "registry:block",
    description:
      "Compare GPT-4o, Claude Sonnet 4, and Gemini 2.0 Flash responses side by side.",
    dependencies: [
      "ai",
      "@ai-sdk/openai",
      "@ai-sdk/anthropic",
      "@ai-sdk/google",
      "clsx",
      "tailwind-merge",
    ],
    files: [
      {
        path: "registry/stacks/basics-generate-text-multi-model/app/api/compare/route.ts",
        type: "registry:file",
        target: "app/api/compare/route.ts",
      },
      {
        path: "registry/stacks/basics-generate-text-multi-model/components/multi-model-demo.tsx",
        type: "registry:component",
        target: "components/multi-model-demo.tsx",
      },
      {
        path: "registry/stacks/basics-generate-text-multi-model/lib/utils.ts",
        type: "registry:lib",
        target: "lib/utils.ts",
      },
    ],
  },

  {
    name: "basics-generate-text-prompt",
    type: "registry:block",
    description:
      "System prompts, persona presets, and temperature control for text generation.",
    dependencies: ["ai", "@ai-sdk/openai", "clsx", "tailwind-merge"],
    files: [
      {
        path: "registry/stacks/basics-generate-text-prompt/app/api/generate/route.ts",
        type: "registry:file",
        target: "app/api/generate/route.ts",
      },
      {
        path: "registry/stacks/basics-generate-text-prompt/components/prompt-demo.tsx",
        type: "registry:component",
        target: "components/prompt-demo.tsx",
      },
      {
        path: "registry/stacks/basics-generate-text-prompt/lib/utils.ts",
        type: "registry:lib",
        target: "lib/utils.ts",
      },
    ],
  },

  {
    name: "basics-stream-text",
    type: "registry:block",
    description:
      "Stream text token-by-token using the Vercel AI SDK useCompletion hook.",
    dependencies: [
      "ai",
      "@ai-sdk/openai",
      "@ai-sdk/react",
      "clsx",
      "tailwind-merge",
    ],
    files: [
      {
        path: "registry/stacks/basics-stream-text/app/api/completion/route.ts",
        type: "registry:file",
        target: "app/api/completion/route.ts",
      },
      {
        path: "registry/stacks/basics-stream-text/components/stream-text-demo.tsx",
        type: "registry:component",
        target: "components/stream-text-demo.tsx",
      },
      {
        path: "registry/stacks/basics-stream-text/lib/utils.ts",
        type: "registry:lib",
        target: "lib/utils.ts",
      },
    ],
  },

  {
    name: "basics-generate-image",
    type: "registry:block",
    description:
      "Generate images from text prompts using DALL·E 3 and the Vercel AI SDK.",
    dependencies: ["ai", "@ai-sdk/openai", "clsx", "tailwind-merge"],
    files: [
      {
        path: "registry/stacks/basics-generate-image/app/api/generate-image/route.ts",
        type: "registry:file",
        target: "app/api/generate-image/route.ts",
      },
      {
        path: "registry/stacks/basics-generate-image/components/generate-image-demo.tsx",
        type: "registry:component",
        target: "components/generate-image-demo.tsx",
      },
      {
        path: "registry/stacks/basics-generate-image/lib/utils.ts",
        type: "registry:lib",
        target: "lib/utils.ts",
      },
    ],
  },

  {
    name: "basics-generate-speech",
    type: "registry:block",
    description:
      "Text-to-speech with audio-reactive orb and live waveform visualization. OpenAI TTS, 6 voices, Web Audio API volume tracking.",
    dependencies: [
      "ai",
      "@ai-sdk/openai",
      "@react-three/fiber",
      "three",
      "clsx",
      "tailwind-merge",
    ],
    files: [
      {
        path: "registry/stacks/basics-generate-speech/app/api/speech/route.ts",
        type: "registry:file",
        target: "app/api/speech/route.ts",
      },
      {
        path: "registry/stacks/basics-generate-speech/components/ui/orb.tsx",
        type: "registry:component",
        target: "components/ui/orb.tsx",
      },
      {
        path: "registry/stacks/basics-generate-speech/components/ui/live-waveform.tsx",
        type: "registry:component",
        target: "components/ui/live-waveform.tsx",
      },
      {
        path: "registry/stacks/basics-generate-speech/components/generate-speech-demo.tsx",
        type: "registry:component",
        target: "components/generate-speech-demo.tsx",
      },
      {
        path: "registry/stacks/basics-generate-speech/lib/utils.ts",
        type: "registry:lib",
        target: "lib/utils.ts",
      },
    ],
  },

  {
    name: "basics-transcribe",
    type: "registry:block",
    description:
      "Transcribe audio files to text using OpenAI Whisper and the Vercel AI SDK.",
    dependencies: ["ai", "@ai-sdk/openai", "clsx", "tailwind-merge"],
    files: [
      {
        path: "registry/stacks/basics-transcribe/app/api/transcribe/route.ts",
        type: "registry:file",
        target: "app/api/transcribe/route.ts",
      },
      {
        path: "registry/stacks/basics-transcribe/components/transcribe-demo.tsx",
        type: "registry:component",
        target: "components/transcribe-demo.tsx",
      },
      {
        path: "registry/stacks/basics-transcribe/lib/utils.ts",
        type: "registry:lib",
        target: "lib/utils.ts",
      },
    ],
  },

  {
    name: "basics-tool",
    type: "registry:block",
    description:
      "Type-safe tool calling with the Vercel AI SDK. Define functions the model can invoke.",
    dependencies: ["ai", "@ai-sdk/openai", "zod", "clsx", "tailwind-merge"],
    files: [
      {
        path: "registry/stacks/basics-tool/app/api/tool-call/route.ts",
        type: "registry:file",
        target: "app/api/tool-call/route.ts",
      },
      {
        path: "registry/stacks/basics-tool/components/tool-call-demo.tsx",
        type: "registry:component",
        target: "components/tool-call-demo.tsx",
      },
      {
        path: "registry/stacks/basics-tool/lib/utils.ts",
        type: "registry:lib",
        target: "lib/utils.ts",
      },
    ],
  },

  {
    name: "basics-agent",
    type: "registry:block",
    description:
      "Multi-step AI agent with up to 5 tool-calling iterations using the Vercel AI SDK.",
    dependencies: ["ai", "@ai-sdk/openai", "zod", "clsx", "tailwind-merge"],
    files: [
      {
        path: "registry/stacks/basics-agent/app/api/agent/route.ts",
        type: "registry:file",
        target: "app/api/agent/route.ts",
      },
      {
        path: "registry/stacks/basics-agent/components/agent-demo.tsx",
        type: "registry:component",
        target: "components/agent-demo.tsx",
      },
      {
        path: "registry/stacks/basics-agent/lib/utils.ts",
        type: "registry:lib",
        target: "lib/utils.ts",
      },
    ],
  },

  /* ────────────────────────────────────────────────────────────
   * CHAT & CONVERSATIONS
   * ──────────────────────────────────────────────────────────── */

  {
    name: "ai-elements-chat",
    type: "registry:block",
    description:
      "Full-screen streaming chat UI with GPT-4o using the Vercel AI SDK useChat hook.",
    dependencies: [
      "ai",
      "@ai-sdk/openai",
      "@ai-sdk/react",
      "clsx",
      "tailwind-merge",
    ],
    files: [
      {
        path: "registry/stacks/ai-elements-chat/app/api/chat/route.ts",
        type: "registry:file",
        target: "app/api/chat/route.ts",
      },
      {
        path: "registry/stacks/ai-elements-chat/components/chat-demo.tsx",
        type: "registry:component",
        target: "components/chat-demo.tsx",
      },
      {
        path: "registry/stacks/ai-elements-chat/lib/utils.ts",
        type: "registry:lib",
        target: "lib/utils.ts",
      },
    ],
  },

  {
    name: "ai-elements-reasoning-chat",
    type: "registry:block",
    description: "",
    dependencies: ["ai", "@ai-sdk/react", "@ai-sdk/anthropic"],
    files: [
      {
        path: "registry/stacks/ai-elements-reasoning-chat/page.tsx",
        type: "registry:page",
        target: "page.tsx",
      },
      {
        path: "registry/stacks/ai-elements-reasoning-chat/api/chat/route.ts",
        type: "registry:file",
        target: "api/chat/route.ts",
      },
    ],
  },

  {
    name: "ai-elements-sources-chat",
    type: "registry:block",
    description: "",
    dependencies: ["@ai-sdk/react"],
    files: [
      {
        path: "registry/stacks/ai-elements-sources-chat/page.tsx",
        type: "registry:page",
        target: "page.tsx",
      },
    ],
  },

  {
    name: "ai-elements-plan",
    type: "registry:block",
    description: "",
    dependencies: ["@ai-sdk/react"],
    files: [
      {
        path: "registry/stacks/ai-elements-plan/page.tsx",
        type: "registry:page",
        target: "page.tsx",
      },
    ],
  },

  {
    name: "ai-elements-confirmation",
    type: "registry:block",
    description: "",
    dependencies: ["@ai-sdk/react"],
    files: [
      {
        path: "registry/stacks/ai-elements-confirmation/page.tsx",
        type: "registry:page",
        target: "page.tsx",
      },
    ],
  },

  {
    name: "ai-elements-queue",
    type: "registry:block",
    description: "",
    dependencies: [],
    files: [
      {
        path: "registry/stacks/ai-elements-queue/page.tsx",
        type: "registry:page",
        target: "page.tsx",
      },
    ],
  },

  {
    name: "ai-agents-routing",
    type: "registry:block",
    description: "",
    dependencies: ["ai", "@ai-sdk/openai"],
    files: [
      {
        path: "registry/stacks/ai-agents-routing/page.tsx",
        type: "registry:page",
        target: "page.tsx",
      },
    ],
  },

  {
    name: "ai-agents-parallel-processing",
    type: "registry:block",
    description: "",
    dependencies: ["ai", "@ai-sdk/openai"],
    files: [
      {
        path: "registry/stacks/ai-agents-parallel-processing/page.tsx",
        type: "registry:page",
        target: "page.tsx",
      },
    ],
  },

  {
    name: "ai-human-in-the-loop",
    type: "registry:block",
    description: "",
    dependencies: ["@ai-sdk/react"],
    files: [
      {
        path: "registry/stacks/ai-human-in-the-loop/page.tsx",
        type: "registry:page",
        target: "page.tsx",
      },
    ],
  },

  {
    name: "tool-websearch-claude",
    type: "registry:block",
    description: "",
    dependencies: ["ai", "@ai-sdk/anthropic"],
    files: [
      {
        path: "registry/stacks/tool-websearch-claude/page.tsx",
        type: "registry:page",
        target: "page.tsx",
      },
    ],
  },

  {
    name: "tool-websearch-exa",
    type: "registry:block",
    description: "",
    dependencies: ["ai", "@ai-sdk/openai", "zod"],
    files: [
      {
        path: "registry/stacks/tool-websearch-exa/page.tsx",
        type: "registry:page",
        target: "page.tsx",
      },
    ],
  },

  {
    name: "cheerio-scraper",
    type: "registry:block",
    description: "",
    dependencies: ["ai", "@ai-sdk/openai", "zod"],
    files: [
      {
        path: "registry/stacks/cheerio-scraper/page.tsx",
        type: "registry:page",
        target: "page.tsx",
      },
    ],
  },

  {
    name: "jina-scraper",
    type: "registry:block",
    description: "",
    dependencies: ["ai", "@ai-sdk/openai", "zod"],
    files: [
      {
        path: "registry/stacks/jina-scraper/page.tsx",
        type: "registry:page",
        target: "page.tsx",
      },
    ],
  },

  {
    name: "markdown-new-scraper",
    type: "registry:block",
    description: "",
    dependencies: ["ai", "@ai-sdk/openai", "zod"],
    files: [
      {
        path: "registry/stacks/markdown-new-scraper/page.tsx",
        type: "registry:page",
        target: "page.tsx",
      },
    ],
  },

  {
    name: "ai-pdf-ingest",
    type: "registry:block",
    description: "",
    dependencies: ["@ai-sdk/react"],
    files: [
      {
        path: "registry/stacks/ai-pdf-ingest/page.tsx",
        type: "registry:page",
        target: "page.tsx",
      },
    ],
  },

  {
    name: "ai-workflow-basic",
    type: "registry:block",
    description: "",
    dependencies: ["ai", "@ai-sdk/openai"],
    files: [
      {
        path: "registry/stacks/ai-workflow-basic/page.tsx",
        type: "registry:page",
        target: "page.tsx",
      },
    ],
  },

  {
    name: "ai-artifact-table",
    type: "registry:block",
    description: "",
    dependencies: ["@ai-sdk/react"],
    files: [
      {
        path: "registry/stacks/ai-artifact-table/page.tsx",
        type: "registry:page",
        target: "page.tsx",
      },
    ],
  },

  {
    name: "ai-artifact-chart",
    type: "registry:block",
    description: "",
    dependencies: ["@ai-sdk/react"],
    files: [
      {
        path: "registry/stacks/ai-artifact-chart/page.tsx",
        type: "registry:page",
        target: "page.tsx",
      },
    ],
  },

  {
    name: "marketing-feature-code-block-1",
    type: "registry:block",
    description: "",
    dependencies: ["ai", "@ai-sdk/openai"],
    files: [
      {
        path: "registry/stacks/marketing-feature-code-block-1/component.tsx",
        type: "registry:component",
        target: "component.tsx",
      },
    ],
  },

  {
    name: "marketing-feature-code-block-2",
    type: "registry:block",
    description: "",
    dependencies: ["ai", "@ai-sdk/openai", "@ai-sdk/react"],
    files: [
      {
        path: "registry/stacks/marketing-feature-code-block-2/component.tsx",
        type: "registry:component",
        target: "component.tsx",
      },
    ],
  },

  {
    name: "marketing-feature-code-block-3",
    type: "registry:block",
    description: "",
    dependencies: ["ai", "@ai-sdk/anthropic", "zod"],
    files: [
      {
        path: "registry/stacks/marketing-feature-code-block-3/component.tsx",
        type: "registry:component",
        target: "component.tsx",
      },
    ],
  },

  {
    name: "marketing-feature-grid-1",
    type: "registry:block",
    description: "",
    dependencies: [],
    files: [
      {
        path: "registry/stacks/marketing-feature-grid-1/component.tsx",
        type: "registry:component",
        target: "component.tsx",
      },
    ],
  },

  {
    name: "marketing-bento-1",
    type: "registry:block",
    description: "",
    dependencies: [],
    files: [
      {
        path: "registry/stacks/marketing-bento-1/component.tsx",
        type: "registry:component",
        target: "component.tsx",
      },
    ],
  },

  {
    name: "streaming-markdown-renderer",
    type: "registry:block",
    description: "",
    dependencies: ["ai", "@ai-sdk/openai", "@ai-sdk/react"],
    files: [
      {
        path: "registry/stacks/streaming-markdown-renderer/streaming-markdown.tsx",
        type: "registry:component",
        target: "streaming-markdown.tsx",
      },
      {
        path: "registry/stacks/streaming-markdown-renderer/app/api/chat/route.ts",
        type: "registry:file",
        target: "app/api/chat/route.ts",
      },
    ],
  },

  {
    name: "voice-input-button",
    type: "registry:block",
    description: "",
    dependencies: ["ai", "@ai-sdk/openai"],
    files: [
      {
        path: "registry/stacks/voice-input-button/voice-input.tsx",
        type: "registry:component",
        target: "voice-input.tsx",
      },
      {
        path: "registry/stacks/voice-input-button/app/api/transcribe/route.ts",
        type: "registry:file",
        target: "app/api/transcribe/route.ts",
      },
    ],
  },

  {
    name: "model-selector",
    type: "registry:block",
    description: "",
    dependencies: [],
    files: [
      {
        path: "registry/stacks/model-selector/model-selector.tsx",
        type: "registry:component",
        target: "model-selector.tsx",
      },
    ],
  },

  {
    name: "prompt-suggestion-pills",
    type: "registry:block",
    description: "",
    dependencies: [],
    files: [
      {
        path: "registry/stacks/prompt-suggestion-pills/prompt-suggestions.tsx",
        type: "registry:component",
        target: "prompt-suggestions.tsx",
      },
    ],
  },

  {
    name: "token-counter",
    type: "registry:block",
    description: "",
    dependencies: [],
    files: [
      {
        path: "registry/stacks/token-counter/token-counter.tsx",
        type: "registry:component",
        target: "token-counter.tsx",
      },
    ],
  },

  {
    name: "ai-loading-states",
    type: "registry:block",
    description: "",
    dependencies: [],
    files: [
      {
        path: "registry/stacks/ai-loading-states/loading-states.tsx",
        type: "registry:component",
        target: "loading-states.tsx",
      },
    ],
  },

  {
    name: "structured-output-viewer",
    type: "registry:block",
    description: "",
    dependencies: ["ai", "@ai-sdk/openai", "zod"],
    files: [
      {
        path: "registry/stacks/structured-output-viewer/structured-output-viewer.tsx",
        type: "registry:component",
        target: "structured-output-viewer.tsx",
      },
      {
        path: "registry/stacks/structured-output-viewer/app/api/extract/route.ts",
        type: "registry:file",
        target: "app/api/extract/route.ts",
      },
    ],
  },

  {
    name: "ai-image-output",
    type: "registry:block",
    description: "",
    dependencies: ["ai", "@ai-sdk/openai"],
    files: [
      {
        path: "registry/stacks/ai-image-output/ai-image-output.tsx",
        type: "registry:component",
        target: "ai-image-output.tsx",
      },
      {
        path: "registry/stacks/ai-image-output/app/api/generate-image/route.ts",
        type: "registry:file",
        target: "app/api/generate-image/route.ts",
      },
    ],
  },

  {
    name: "artifact-canvas",
    type: "registry:block",
    description: "",
    dependencies: ["ai", "@ai-sdk/react", "@ai-sdk/anthropic"],
    files: [
      {
        path: "registry/stacks/artifact-canvas/artifact-canvas.tsx",
        type: "registry:component",
        target: "artifact-canvas.tsx",
      },
      {
        path: "registry/stacks/artifact-canvas/app/api/artifact/route.ts",
        type: "registry:file",
        target: "app/api/artifact/route.ts",
      },
    ],
  },

  /* ────────────────────────────────────────────────────────────
   * PRODUCTION INFRASTRUCTURE
   * ──────────────────────────────────────────────────────────── */

  {
    name: "rate-limit-handler",
    type: "registry:block",
    description:
      "Production-ready rate limit handling with exponential backoff, jitter, circuit breaker, and visual retry queue.",
    dependencies: [
      "ai",
      "@ai-sdk/openai",
      "@ai-sdk/react",
      "motion",
      "clsx",
      "tailwind-merge",
    ],
    files: [
      {
        path: "registry/stacks/rate-limit-handler/app/api/chat/route.ts",
        type: "registry:file",
        target: "app/api/chat/route.ts",
      },
      {
        path: "registry/stacks/rate-limit-handler/components/rate-limiter.tsx",
        type: "registry:component",
        target: "components/rate-limiter.tsx",
      },
      {
        path: "registry/stacks/rate-limit-handler/lib/utils.ts",
        type: "registry:lib",
        target: "lib/utils.ts",
      },
    ],
  },

  {
    name: "cost-tracker",
    type: "registry:block",
    description:
      "Real-time token usage and cost monitoring with per-model pricing, budget alerts, and usage analytics.",
    dependencies: [
      "ai",
      "@ai-sdk/openai",
      "@ai-sdk/react",
      "motion",
      "clsx",
      "tailwind-merge",
    ],
    files: [
      {
        path: "registry/stacks/cost-tracker/app/api/chat/route.ts",
        type: "registry:file",
        target: "app/api/chat/route.ts",
      },
      {
        path: "registry/stacks/cost-tracker/components/cost-tracker.tsx",
        type: "registry:component",
        target: "components/cost-tracker.tsx",
      },
      {
        path: "registry/stacks/cost-tracker/lib/utils.ts",
        type: "registry:lib",
        target: "lib/utils.ts",
      },
    ],
  },

  {
    name: "chat-persistence-kit",
    type: "registry:block",
    description:
      "Full-stack chat persistence with conversation history, database adapters (LocalStorage + Prisma), and message serialization.",
    dependencies: [
      "ai",
      "@ai-sdk/openai",
      "@ai-sdk/react",
      "motion",
      "clsx",
      "tailwind-merge",
    ],
    files: [
      {
        path: "registry/stacks/chat-persistence-kit/app/api/chat/route.ts",
        type: "registry:file",
        target: "app/api/chat/route.ts",
      },
      {
        path: "registry/stacks/chat-persistence-kit/components/conversation-sidebar.tsx",
        type: "registry:component",
        target: "components/conversation-sidebar.tsx",
      },
      {
        path: "registry/stacks/chat-persistence-kit/lib/persistence.ts",
        type: "registry:lib",
        target: "lib/persistence.ts",
      },
      {
        path: "registry/stacks/chat-persistence-kit/lib/utils.ts",
        type: "registry:lib",
        target: "lib/utils.ts",
      },
    ],
  },

  {
    name: "ai-error-boundary",
    type: "registry:block",
    description:
      "Graceful AI error recovery with retry logic, user feedback, and fallback strategies.",
    dependencies: [
      "ai",
      "@ai-sdk/openai",
      "@ai-sdk/react",
      "motion",
      "clsx",
      "tailwind-merge",
    ],
    files: [
      {
        path: "registry/stacks/ai-error-boundary/app/api/chat/route.ts",
        type: "registry:file",
        target: "app/api/chat/route.ts",
      },
      {
        path: "registry/stacks/ai-error-boundary/components/error-boundary.tsx",
        type: "registry:component",
        target: "components/error-boundary.tsx",
      },
      {
        path: "registry/stacks/ai-error-boundary/lib/utils.ts",
        type: "registry:lib",
        target: "lib/utils.ts",
      },
    ],
  },

  {
    name: "context-window-manager",
    type: "registry:block",
    description:
      "Token counting, context truncation, and window optimization for AI conversations.",
    dependencies: [
      "ai",
      "@ai-sdk/openai",
      "@ai-sdk/react",
      "motion",
      "clsx",
      "tailwind-merge",
    ],
    files: [
      {
        path: "registry/stacks/context-window-manager/app/api/chat/route.ts",
        type: "registry:file",
        target: "app/api/chat/route.ts",
      },
      {
        path: "registry/stacks/context-window-manager/components/context-manager.tsx",
        type: "registry:component",
        target: "components/context-manager.tsx",
      },
      {
        path: "registry/stacks/context-window-manager/lib/utils.ts",
        type: "registry:lib",
        target: "lib/utils.ts",
      },
    ],
  },

  {
    name: "model-fallback-handler",
    type: "registry:block",
    description:
      "Automatic provider failover with exponential backoff, circuit breaker, and real-time health monitoring across OpenAI, Anthropic, and Google.",
    dependencies: [
      "ai",
      "@ai-sdk/openai",
      "@ai-sdk/anthropic",
      "@ai-sdk/google",
      "@ai-sdk/react",
      "motion",
      "clsx",
      "tailwind-merge",
    ],
    files: [
      {
        path: "registry/stacks/model-fallback-handler/app/api/chat/route.ts",
        type: "registry:file",
        target: "app/api/chat/route.ts",
      },
      {
        path: "registry/stacks/model-fallback-handler/components/model-fallback.tsx",
        type: "registry:component",
        target: "components/model-fallback.tsx",
      },
      {
        path: "registry/stacks/model-fallback-handler/lib/utils.ts",
        type: "registry:lib",
        target: "lib/utils.ts",
      },
    ],
  },

  {
    name: "output-sanitizer",
    type: "registry:block",
    description:
      "XSS prevention for AI-generated content with threat detection, security scoring, and detailed sanitization reports.",
    dependencies: ["motion", "clsx", "tailwind-merge"],
    files: [
      {
        path: "registry/stacks/output-sanitizer/components/sanitizer.tsx",
        type: "registry:component",
        target: "components/sanitizer.tsx",
      },
      {
        path: "registry/stacks/output-sanitizer/lib/utils.ts",
        type: "registry:lib",
        target: "lib/utils.ts",
      },
    ],
  },

  {
    name: "streaming-reconnect",
    type: "registry:block",
    description:
      "Automatic SSE reconnection with exponential backoff, Last-Event-ID tracking, partial message recovery, and real-time connection monitoring.",
    dependencies: [
      "ai",
      "@ai-sdk/openai",
      "@ai-sdk/react",
      "motion",
      "clsx",
      "tailwind-merge",
    ],
    files: [
      {
        path: "registry/stacks/streaming-reconnect/app/api/chat/route.ts",
        type: "registry:file",
        target: "app/api/chat/route.ts",
      },
      {
        path: "registry/stacks/streaming-reconnect/components/streaming-reconnect.tsx",
        type: "registry:component",
        target: "components/streaming-reconnect.tsx",
      },
      {
        path: "registry/stacks/streaming-reconnect/lib/utils.ts",
        type: "registry:lib",
        target: "lib/utils.ts",
      },
    ],
  },

  {
    name: "semantic-cache",
    type: "registry:block",
    description:
      "Cut LLM costs by 80% with intelligent semantic caching using embeddings and cosine similarity.",
    dependencies: ["ai", "@ai-sdk/openai", "motion", "clsx", "tailwind-merge"],
    files: [
      {
        path: "registry/stacks/semantic-cache/app/api/chat/route.ts",
        type: "registry:file",
        target: "app/api/chat/route.ts",
      },
      {
        path: "registry/stacks/semantic-cache/app/api/cache/embed/route.ts",
        type: "registry:file",
        target: "app/api/cache/embed/route.ts",
      },
      {
        path: "registry/stacks/semantic-cache/components/semantic-cache.tsx",
        type: "registry:component",
        target: "components/semantic-cache.tsx",
      },
      {
        path: "registry/stacks/semantic-cache/lib/utils.ts",
        type: "registry:lib",
        target: "lib/utils.ts",
      },
    ],
  },

  {
    name: "prompt-injection-guard",
    type: "registry:block",
    description:
      "OWASP LLM01 protection with real-time detection of jailbreaks, data extraction, and manipulation attempts.",
    dependencies: ["motion", "clsx", "tailwind-merge"],
    files: [
      {
        path: "registry/stacks/prompt-injection-guard/components/prompt-guard.tsx",
        type: "registry:component",
        target: "components/prompt-guard.tsx",
      },
      {
        path: "registry/stacks/prompt-injection-guard/lib/utils.ts",
        type: "registry:lib",
        target: "lib/utils.ts",
      },
    ],
  },

  {
    name: "agent-memory-kit",
    type: "registry:block",
    description:
      "Human-like memory patterns for AI agents with short-term, long-term, episodic, and semantic memory types.",
    dependencies: ["motion", "clsx", "tailwind-merge"],
    files: [
      {
        path: "registry/stacks/agent-memory-kit/components/agent-memory.tsx",
        type: "registry:component",
        target: "components/agent-memory.tsx",
      },
      {
        path: "registry/stacks/agent-memory-kit/lib/utils.ts",
        type: "registry:lib",
        target: "lib/utils.ts",
      },
    ],
  },

  {
    name: "structured-output-validator",
    type: "registry:block",
    description:
      "Auto-repair malformed LLM JSON outputs with intelligent fix strategies and schema validation.",
    dependencies: ["motion", "clsx", "tailwind-merge"],
    files: [
      {
        path: "registry/stacks/structured-output-validator/components/structured-validator.tsx",
        type: "registry:component",
        target: "components/structured-validator.tsx",
      },
      {
        path: "registry/stacks/structured-output-validator/lib/utils.ts",
        type: "registry:lib",
        target: "lib/utils.ts",
      },
    ],
  },
]
