import type { Metadata } from "next"

import { getAllStacks } from "@/config/stacks"
import { siteConfig } from "@/config/site"
import { StacksGrid } from "@/components/stacks-grid"

export const metadata: Metadata = {
  title: "Vercel AI SDK Components & Blocks | shadcnagents",
  description:
    `${siteConfig.counts.stacks}+ production-ready Vercel AI SDK components and agent patterns for Next.js. generateText, streamText, tool calling, AI agents, orchestration, RAG, and more. Copy-paste with shadcn/ui and TypeScript.`,
  keywords: [
    "vercel ai sdk components",
    "ai sdk blocks",
    "shadcn ai components",
    "ai sdk examples",
    "next.js ai components",
    "ai sdk tool calling",
    "ai agent patterns",
    "generateText example",
    "streamText example",
    "ai sdk ui",
    "ai sdk v6",
    "vercel ai sdk nextjs",
  ],
  openGraph: {
    title: "Vercel AI SDK Components & Blocks | shadcnagents",
    description:
      `${siteConfig.counts.stacks}+ production-ready Vercel AI SDK components and agent patterns. Copy-paste with shadcn/ui, Next.js, and TypeScript.`,
    type: "website",
    url: `${siteConfig.url}/stacks`,
    siteName: "shadcnagents",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vercel AI SDK Components & Blocks | shadcnagents",
    description:
      `${siteConfig.counts.stacks}+ production-ready Vercel AI SDK components and agent patterns for Next.js.`,
  },
  alternates: {
    canonical: `${siteConfig.url}/stacks`,
  },
}

export default function StacksPage() {
  const allStacks = getAllStacks()

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Vercel AI SDK Components & Blocks",
    description:
      `${siteConfig.counts.stacks}+ production-ready Vercel AI SDK components and agent patterns for Next.js.`,
    url: `${siteConfig.url}/stacks`,
    publisher: {
      "@type": "Organization",
      name: "shadcnagents",
      url: siteConfig.url,
    },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: allStacks.slice(0, 20).map((s, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: s.text,
        description: s.description,
        url: `${siteConfig.url}${s.link}`,
      })),
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="w-full px-6 py-8">
        <div className="mb-10 space-y-3">
          <h1 className="font-heading text-3xl tracking-tight sm:text-4xl">
            All Stacks
          </h1>
          <p className="max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
            {siteConfig.counts.stacks}+ production-ready AI SDK components and agent
            patterns. Each stack is a copy-paste implementation — built with AI SDK
            v6, shadcn/ui, and TypeScript.
          </p>
        </div>

        <StacksGrid />
      </div>
    </>
  )
}
