export const siteConfig = {
  /* ───────────────── Brand & positioning ───────────────── */
  name: "shadcnagents – Vercel AI SDK Components, Blocks & Agent Patterns",
  description:
    "Copy-paste Vercel AI SDK components and agent patterns for Next.js. generateText, streamText, tool calling, AI agents, orchestration, and more. Built with AI SDK v6, shadcn/ui, and TypeScript.",
  url: "https://shadcnagents.com",
  ogImage: "https://shadcnagents.com/og.png",

  /* ───────────────── Counts (single source of truth) ───────────────── */
  counts: {
    stacks: 100,
    uiComponents: 117,
  },

  /* ───────────────── Social links ───────────────── */
  links: {
    twitter: "https://x.com/shadcnagents",
    github: "https://github.com/shadcnagents/ui",
  },
} as const

export type SiteConfig = typeof siteConfig
