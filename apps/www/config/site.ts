export const siteConfig = {
  /* ───────────────── Brand & positioning ───────────────── */
  name: "shadcncloud – AI SDK Agent Patterns",
  description:
    "Full-stack Vercel AI SDK patterns for workflows, tool calling, and agent orchestration. Built with AI SDK v6 and shadcn/ui. Headless, themable, practical.",
  url: "https://shadcncloud.com",
  ogImage: "https://shadcncloud.com/og.png",

  /* ───────────────── Social links ───────────────── */
  links: {
    twitter: "https://x.com/shadcncloud",
    github: "https://github.com/shadcncloud/ui",
  },
} as const

export type SiteConfig = typeof siteConfig
