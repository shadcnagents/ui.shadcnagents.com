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
    description: "Generate text with GPT-4o using the Vercel AI SDK.",
    dependencies: ["ai", "@ai-sdk/openai"],
    files: [
      {
        path: "registry/stacks/basics-generate-text/app/page.tsx",
        type: "registry:page",
        target: "app/page.tsx",
      },
      {
        path: "registry/stacks/basics-generate-text/app/layout.tsx",
        type: "registry:page",
        target: "app/layout.tsx",
      },
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
    ],
  },

  {
    name: "basics-stream-text",
    type: "registry:block",
    description: "Stream text token-by-token using the Vercel AI SDK useCompletion hook.",
    dependencies: ["ai", "@ai-sdk/openai", "@ai-sdk/react"],
    files: [
      {
        path: "registry/stacks/basics-stream-text/app/page.tsx",
        type: "registry:page",
        target: "app/page.tsx",
      },
      {
        path: "registry/stacks/basics-stream-text/app/layout.tsx",
        type: "registry:page",
        target: "app/layout.tsx",
      },
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
    ],
  },

  {
    name: "basics-generate-image",
    type: "registry:block",
    description: "Generate images from text prompts using DALL·E 3 and the Vercel AI SDK.",
    dependencies: ["ai", "@ai-sdk/openai"],
    files: [
      {
        path: "registry/stacks/basics-generate-image/app/page.tsx",
        type: "registry:page",
        target: "app/page.tsx",
      },
      {
        path: "registry/stacks/basics-generate-image/app/layout.tsx",
        type: "registry:page",
        target: "app/layout.tsx",
      },
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
    ],
  },

  {
    name: "basics-generate-speech",
    type: "registry:block",
    description: "Convert text to natural-sounding audio using OpenAI TTS and the Vercel AI SDK.",
    dependencies: ["ai", "@ai-sdk/openai"],
    files: [
      {
        path: "registry/stacks/basics-generate-speech/app/page.tsx",
        type: "registry:page",
        target: "app/page.tsx",
      },
      {
        path: "registry/stacks/basics-generate-speech/app/layout.tsx",
        type: "registry:page",
        target: "app/layout.tsx",
      },
      {
        path: "registry/stacks/basics-generate-speech/app/api/speech/route.ts",
        type: "registry:file",
        target: "app/api/speech/route.ts",
      },
      {
        path: "registry/stacks/basics-generate-speech/components/generate-speech-demo.tsx",
        type: "registry:component",
        target: "components/generate-speech-demo.tsx",
      },
    ],
  },

  {
    name: "basics-transcribe",
    type: "registry:block",
    description: "Transcribe audio files to text using OpenAI Whisper and the Vercel AI SDK.",
    dependencies: ["ai", "@ai-sdk/openai"],
    files: [
      {
        path: "registry/stacks/basics-transcribe/app/page.tsx",
        type: "registry:page",
        target: "app/page.tsx",
      },
      {
        path: "registry/stacks/basics-transcribe/app/layout.tsx",
        type: "registry:page",
        target: "app/layout.tsx",
      },
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
    ],
  },

  {
    name: "basics-tool",
    type: "registry:block",
    description: "Type-safe tool calling with the Vercel AI SDK. Define functions the model can invoke.",
    dependencies: ["ai", "@ai-sdk/openai", "zod"],
    files: [
      {
        path: "registry/stacks/basics-tool/app/page.tsx",
        type: "registry:page",
        target: "app/page.tsx",
      },
      {
        path: "registry/stacks/basics-tool/app/layout.tsx",
        type: "registry:page",
        target: "app/layout.tsx",
      },
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
    ],
  },

  {
    name: "basics-agent",
    type: "registry:block",
    description: "Multi-step AI agent with up to 5 tool-calling iterations using the Vercel AI SDK.",
    dependencies: ["ai", "@ai-sdk/openai", "zod"],
    files: [
      {
        path: "registry/stacks/basics-agent/app/page.tsx",
        type: "registry:page",
        target: "app/page.tsx",
      },
      {
        path: "registry/stacks/basics-agent/app/layout.tsx",
        type: "registry:page",
        target: "app/layout.tsx",
      },
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
    ],
  },

  /* ────────────────────────────────────────────────────────────
   * CHAT & CONVERSATIONS
   * ──────────────────────────────────────────────────────────── */

  {
    name: "ai-elements-chat",
    type: "registry:block",
    description: "Full-screen streaming chat UI with GPT-4o using the Vercel AI SDK useChat hook.",
    dependencies: ["ai", "@ai-sdk/openai", "@ai-sdk/react"],
    files: [
      {
        path: "registry/stacks/ai-elements-chat/app/page.tsx",
        type: "registry:page",
        target: "app/page.tsx",
      },
      {
        path: "registry/stacks/ai-elements-chat/app/layout.tsx",
        type: "registry:page",
        target: "app/layout.tsx",
      },
      {
        path: "registry/stacks/ai-elements-chat/app/api/chat/route.ts",
        type: "registry:file",
        target: "app/api/chat/route.ts",
      },
    ],
  },

  {
    name: "ai-elements-reasoning-chat",
    type: "registry:block",
    description: "",
    dependencies: ["ai","@ai-sdk/react","@ai-sdk/anthropic"],
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
    dependencies: ["ai","@ai-sdk/openai"],
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
    dependencies: ["ai","@ai-sdk/openai"],
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
    dependencies: ["ai","@ai-sdk/anthropic"],
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
    dependencies: ["ai","@ai-sdk/openai","zod"],
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
    dependencies: ["ai","@ai-sdk/openai","zod"],
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
    dependencies: ["ai","@ai-sdk/openai","zod"],
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
    dependencies: ["ai","@ai-sdk/openai","zod"],
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
    dependencies: ["ai","@ai-sdk/openai"],
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
    dependencies: ["ai","@ai-sdk/openai"],
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
    dependencies: ["ai","@ai-sdk/openai","@ai-sdk/react"],
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
    dependencies: ["ai","@ai-sdk/anthropic","zod"],
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
    dependencies: ["ai","@ai-sdk/openai","@ai-sdk/react"],
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
    dependencies: ["ai","@ai-sdk/openai"],
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
    dependencies: ["ai","@ai-sdk/openai","zod"],
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
    dependencies: ["ai","@ai-sdk/openai"],
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
    dependencies: ["ai","@ai-sdk/react","@ai-sdk/anthropic"],
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

]
