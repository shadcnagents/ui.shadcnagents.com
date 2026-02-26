import type { Metadata } from "next"
import Link from "next/link"
import { Lock } from "lucide-react"

import { stacksConfig, isSubCategory, getAllStacks } from "@/config/stacks"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Vercel AI SDK Components & Blocks | shadcncloud",
  description:
    "60+ production-ready Vercel AI SDK components and agent patterns for Next.js. generateText, streamText, tool calling, AI agents, orchestration, RAG, and more. Copy-paste with shadcn/ui and TypeScript.",
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
    title: "Vercel AI SDK Components & Blocks | shadcncloud",
    description:
      "60+ production-ready Vercel AI SDK components and agent patterns. Copy-paste with shadcn/ui, Next.js, and TypeScript.",
    type: "website",
    url: `${siteConfig.url}/stacks`,
    siteName: "shadcncloud",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vercel AI SDK Components & Blocks | shadcncloud",
    description:
      "60+ production-ready Vercel AI SDK components and agent patterns for Next.js.",
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
      "60+ production-ready Vercel AI SDK components and agent patterns for Next.js.",
    url: `${siteConfig.url}/stacks`,
    publisher: {
      "@type": "Organization",
      name: "shadcncloud",
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
      <div className="mx-auto max-w-3xl px-8 py-16">
        <div className="mb-16 space-y-3">
          <h1 className="text-2xl font-medium tracking-tight">
            Vercel AI SDK Components & Blocks
          </h1>
          <p className="text-[15px] leading-relaxed text-muted-foreground">
            Production-ready Vercel AI SDK components and agent patterns for
            Next.js. Each stack is a copy-paste implementation of generateText,
            streamText, tool calling, AI agents, orchestration, and more — built
            with AI SDK v6, shadcn/ui, and TypeScript.
          </p>
        </div>

        <div className="space-y-12">
          {stacksConfig.map((category) => (
            <section key={category.id}>
              <h2 className="mb-4 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/50">
                {category.name}
              </h2>
              <div className="divide-y divide-border/50">
                {category.items.map((item) => {
                  if (isSubCategory(item)) {
                    return item.children.map((child) => (
                      <StackRow
                        key={child.link}
                        text={child.text}
                        description={child.description}
                        link={child.link}
                        tier={child.tier}
                      />
                    ))
                  }
                  return (
                    <StackRow
                      key={item.link}
                      text={item.text}
                      description={item.description}
                      link={item.link}
                      tier={item.tier}
                    />
                  )
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
    </>
  )
}

function StackRow({
  text,
  description,
  link,
  tier,
}: {
  text: string
  description: string
  link: string
  tier: "free" | "pro"
}) {
  return (
    <Link
      href={link}
      className="group flex items-center justify-between py-3 transition-colors"
    >
      <div className="min-w-0">
        <span className="text-[15px] font-medium text-foreground group-hover:underline group-hover:underline-offset-4">
          {text}
        </span>
        <p className="mt-0.5 text-[13px] text-muted-foreground/60">
          {description}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-3 pl-4">
        {tier === "pro" && (
          <Lock className="size-3 text-muted-foreground/30" />
        )}
        <span
          className={cn(
            "text-[11px] font-medium uppercase tracking-wider",
            tier === "free"
              ? "text-muted-foreground/40"
              : "text-muted-foreground/30"
          )}
        >
          {tier}
        </span>
      </div>
    </Link>
  )
}
