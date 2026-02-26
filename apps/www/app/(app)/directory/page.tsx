import type { Metadata } from "next"
import Link from "next/link"

import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Community Directory",
  description:
    "User-submitted agent patterns, tools, and integrations for the shadcnagents ecosystem.",
}

const directoryItems = [
  {
    title: "Custom Tool Connector",
    description:
      "A community-built connector for integrating custom tools with AI SDK agents.",
    author: "community",
    tags: ["tools", "integration"],
  },
  {
    title: "Multi-Model Chat",
    description:
      "Compare responses from multiple LLMs side by side in a single chat interface.",
    author: "community",
    tags: ["chat", "model-comparison"],
  },
  {
    title: "Agent Memory Store",
    description:
      "Persistent memory pattern for long-running AI agents with Redis and vector storage.",
    author: "community",
    tags: ["agents", "data"],
  },
  {
    title: "Webhook Handler",
    description:
      "Pattern for connecting AI agents to external services via webhooks and event triggers.",
    author: "community",
    tags: ["integrations", "tools"],
  },
  {
    title: "Voice Agent Pattern",
    description:
      "Real-time voice interaction pattern with speech-to-text and text-to-speech pipelines.",
    author: "community",
    tags: ["agents", "demos"],
  },
  {
    title: "Document Analyzer",
    description:
      "Upload and analyze documents with AI-powered extraction, summarization, and Q&A.",
    author: "community",
    tags: ["analysis", "generation"],
  },
]

export default function DirectoryPage() {
  return (
    <div className="container py-16 md:py-24">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight">
            Community Directory
          </h1>
          <p className="text-muted-foreground mt-3 text-lg">
            User-submitted agent patterns, tools, and integrations.
          </p>
        </div>

        {/* Directory Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {directoryItems.map((item) => (
            <div
              key={item.title}
              className="border-border flex flex-col rounded-lg border p-6"
            >
              <h2 className="text-base font-semibold">{item.title}</h2>
              <p className="text-muted-foreground mt-2 flex-1 text-sm leading-relaxed">
                {item.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-muted text-muted-foreground rounded-md px-2 py-0.5 text-xs font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <p className="text-muted-foreground mt-3 text-xs">
                by {item.author}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
