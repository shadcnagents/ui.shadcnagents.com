import type { Metadata } from "next"
import Link from "next/link"

import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Templates",
  description:
    "Full-stack templates for common AI agent use cases. Build faster with production-ready starter kits.",
}

const templates = [
  {
    title: "AI Chat Agent",
    description:
      "A full-stack chat agent with streaming, tool calling, and memory. Built with AI SDK and Next.js.",
    stack: ["Next.js", "AI SDK", "Tailwind", "Postgres"],
  },
  {
    title: "RAG Knowledge Base",
    description:
      "Retrieval-augmented generation agent with document upload, embedding, and semantic search.",
    stack: ["Next.js", "AI SDK", "Pinecone", "OpenAI"],
  },
  {
    title: "Multi-Agent Workflow",
    description:
      "Orchestrate multiple AI agents with handoff patterns, shared context, and parallel execution.",
    stack: ["Next.js", "AI SDK", "Redis", "Vercel"],
  },
  {
    title: "Code Generation Agent",
    description:
      "An agent that generates, reviews, and iterates on code with sandboxed execution and tool use.",
    stack: ["Next.js", "AI SDK", "Sandpack", "Monaco"],
  },
]

export default function TemplatesPage() {
  return (
    <div className="container py-16 md:py-24">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight">Templates</h1>
          <p className="text-muted-foreground mt-3 text-lg">
            Full-stack templates for common AI agent use cases.
          </p>
        </div>

        {/* Template Grid */}
        <div className="grid gap-6 sm:grid-cols-2">
          {templates.map((template) => (
            <div
              key={template.title}
              className="border-border flex flex-col rounded-lg border"
            >
              {/* Image Placeholder */}
              <div className="bg-muted h-48 rounded-t-lg" />

              {/* Content */}
              <div className="flex flex-1 flex-col p-6">
                <h2 className="text-lg font-semibold">{template.title}</h2>
                <p className="text-muted-foreground mt-2 flex-1 text-sm leading-relaxed">
                  {template.description}
                </p>

                {/* Tech Stack Badges */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {template.stack.map((tech) => (
                    <span
                      key={tech}
                      className="bg-muted text-muted-foreground rounded-md px-2 py-0.5 text-xs font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <Link
                  href="#"
                  className="border-border hover:bg-muted mt-5 inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm font-medium transition-colors"
                >
                  View Template
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
