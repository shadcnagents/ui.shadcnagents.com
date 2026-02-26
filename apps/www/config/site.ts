export const siteConfig = {
  /* ───────────────── Brand & positioning ───────────────── */
  name: "shadcncloud – Vercel AI SDK Components, Blocks & Agent Patterns",
  description:
    "Copy-paste Vercel AI SDK components and agent patterns for Next.js. generateText, streamText, tool calling, AI agents, orchestration, and more. Built with AI SDK v6, shadcn/ui, and TypeScript.",
  url: "https://shadcncloud.com",
  ogImage: "https://shadcncloud.com/og.png",

  /* ───────────────── Social links ───────────────── */
  links: {
    twitter: "https://x.com/shadcncloud",
    github: "https://github.com/shadcncloud/ui",
  },
} as const

export type SiteConfig = typeof siteConfig
