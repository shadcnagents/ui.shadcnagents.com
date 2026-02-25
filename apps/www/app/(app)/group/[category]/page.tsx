import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"

import { cn } from "@/lib/utils"

const categories = [
  { slug: "agents", label: "Agents", description: "AI agent patterns for autonomous task execution and tool use." },
  { slug: "chat", label: "Chat", description: "Conversational UI patterns for AI-powered chat experiences." },
  { slug: "generation", label: "Generation", description: "Content and code generation patterns with AI models." },
  { slug: "analysis", label: "Analysis", description: "Data analysis and insight extraction patterns." },
  { slug: "tools", label: "Tools", description: "Tool calling and function execution patterns for AI agents." },
  { slug: "artifacts", label: "Artifacts", description: "Artifact rendering and interactive output patterns." },
  { slug: "data", label: "Data", description: "Data management, storage, and retrieval patterns." },
  { slug: "marketing", label: "Marketing", description: "AI-powered marketing and content automation patterns." },
  { slug: "model-comparison", label: "Model Comparison", description: "Compare and evaluate different AI model outputs." },
  { slug: "demos", label: "Demos", description: "Interactive demonstrations and example implementations." },
  { slug: "pricing", label: "Pricing", description: "Pricing and billing UI patterns for AI products." },
  { slug: "integrations", label: "Integrations", description: "Third-party service and API integration patterns." },
  { slug: "use-cases", label: "Use Cases", description: "End-to-end use case implementations and walkthroughs." },
  { slug: "free", label: "Free", description: "All free and open-source patterns available under MIT license." },
]

export function generateStaticParams() {
  return categories.map((category) => ({
    category: category.slug,
  }))
}

export async function generateMetadata(props: {
  params: Promise<{ category: string }>
}): Promise<Metadata> {
  const { category } = await props.params
  const cat = categories.find((c) => c.slug === category)

  if (!cat) {
    return { title: "Category Not Found" }
  }

  return {
    title: cat.label,
    description: cat.description,
  }
}

// Placeholder pattern cards for each category
function getPlaceholderPatterns(category: string) {
  return [
    {
      title: `${category} Pattern 1`,
      description: `An example ${category} pattern demonstrating core concepts and best practices.`,
      href: "#",
    },
    {
      title: `${category} Pattern 2`,
      description: `A more advanced ${category} pattern with streaming and error handling.`,
      href: "#",
    },
    {
      title: `${category} Pattern 3`,
      description: `A production-ready ${category} pattern with full test coverage.`,
      href: "#",
    },
  ]
}

export default async function CategoryPage(props: {
  params: Promise<{ category: string }>
}) {
  const { category } = await props.params
  const cat = categories.find((c) => c.slug === category)

  if (!cat) {
    notFound()
  }

  const patterns = getPlaceholderPatterns(cat.label)

  return (
    <div className="container py-16 md:py-24">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-12">
          <Link
            href="/stacks"
            className="text-muted-foreground hover:text-foreground mb-4 inline-flex items-center gap-1 text-sm transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={14}
              height={14}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            All stacks
          </Link>
          <h1 className="text-4xl font-bold tracking-tight">{cat.label}</h1>
          <p className="text-muted-foreground mt-3 text-lg">
            {cat.description}
          </p>
        </div>

        {/* Pattern Cards Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {patterns.map((pattern) => (
            <Link
              key={pattern.title}
              href={pattern.href}
              className="border-border hover:border-foreground/20 group flex flex-col rounded-lg border p-6 transition-colors"
            >
              <div className="bg-muted mb-4 h-32 rounded-md" />
              <h2 className="text-base font-semibold">{pattern.title}</h2>
              <p className="text-muted-foreground mt-2 flex-1 text-sm leading-relaxed">
                {pattern.description}
              </p>
            </Link>
          ))}
        </div>

        {/* All Categories */}
        <div className="mt-16">
          <h2 className="mb-6 text-lg font-semibold">All Categories</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <Link
                key={c.slug}
                href={`/group/${c.slug}`}
                className={cn(
                  "rounded-md border px-3 py-1.5 text-sm font-medium transition-colors",
                  c.slug === category
                    ? "bg-foreground text-background border-foreground"
                    : "border-border hover:bg-muted"
                )}
              >
                {c.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
