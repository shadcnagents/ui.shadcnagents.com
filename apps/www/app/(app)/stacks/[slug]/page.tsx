import type { Metadata } from "next"

import { getAllStacks } from "@/config/stacks"
import { siteConfig } from "@/config/site"
import { StackPageClient } from "@/components/stack-page-client"

export function generateStaticParams() {
  return getAllStacks().map((s) => ({
    slug: s.link.replace("/stacks/", ""),
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const allStacks = getAllStacks()
  const stack = allStacks.find((s) => s.link === `/stacks/${slug}`)

  if (!stack) {
    return { title: "Stack | shadcnagents" }
  }

  const title = `${stack.text} – Vercel AI SDK Example | shadcnagents`
  const description = `${stack.description}. Production-ready Vercel AI SDK implementation with shadcn/ui, Next.js, and TypeScript. Copy-paste ready.`
  const url = `${siteConfig.url}/stacks/${slug}`

  return {
    title,
    description,
    keywords: [
      stack.text.replace(/[( )]/g, "").toLowerCase(),
      "vercel ai sdk",
      "ai sdk example",
      "ai sdk components",
      "shadcn ai",
      "next.js ai",
      "typescript ai sdk",
    ],
    openGraph: {
      title,
      description: stack.description,
      url,
      type: "website",
      siteName: "shadcnagents",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: stack.description,
    },
    alternates: {
      canonical: url,
    },
  }
}

export default function StackPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  return <StackPageClient params={params} />
}
