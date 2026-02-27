"use client"

import { useState } from "react"

/* ─── Code Block 1 ─── */
export function CodeBlock1Preview() {
  const [activeTab, setActiveTab] = useState("typescript")

  const codeExamples: Record<string, string> = {
    typescript: `import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

const { text } = await generateText({
  model: openai("gpt-4o"),
  system: "You are a helpful assistant.",
  prompt: "Explain quantum computing",
})

console.log(text)`,
    python: `from openai import OpenAI

client = OpenAI()
response = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Explain quantum computing"},
    ],
)

print(response.choices[0].message.content)`,
  }

  return (
    <div className="mx-auto w-full max-w-2xl p-8">
      <div className="mb-8 text-center">
        <h3 className="text-lg font-semibold tracking-tight text-foreground">
          Start Building in Minutes
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Simple, intuitive API that works with any language model
        </p>
      </div>

      <div className="overflow-hidden rounded-lg border border-border/60">
        <div className="flex items-center gap-0 border-b border-border/60 bg-muted/50 px-4">
          {Object.keys(codeExamples).map((lang) => (
            <button
              key={lang}
              onClick={() => setActiveTab(lang)}
              className={`border-b-2 px-3 py-2 text-xs font-medium transition-colors ${
                activeTab === lang
                  ? "border-foreground text-foreground"
                  : "border-transparent text-muted-foreground hover:text-muted-foreground"
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
        <pre className="overflow-x-auto p-4 text-sm leading-relaxed [&::-webkit-scrollbar]:hidden">
          <code className="text-foreground">{codeExamples[activeTab]}</code>
        </pre>
      </div>
    </div>
  )
}

/* ─── Code Block 2 ─── */
export function CodeBlock2Preview() {
  return (
    <div className="mx-auto w-full max-w-2xl p-8">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground">
            Server Action
          </h3>
          <div className="overflow-hidden rounded-lg border border-border/60 bg-muted/40">
            <div className="flex items-center gap-2 border-b border-border/50 px-3 py-1.5">
              <div className="size-2 rounded-full bg-muted-foreground/40" />
              <span className="text-[12px] text-muted-foreground/60">
                actions.ts
              </span>
            </div>
            <pre className="p-3 text-[13px] leading-relaxed">
              <code className="text-foreground">{`"use server"

import { streamText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function chat(
  messages: Message[]
) {
  const result = streamText({
    model: openai("gpt-4o"),
    messages,
  })
  return result.toDataStreamResponse()
}`}</code>
            </pre>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Client UI</h3>
          <div className="overflow-hidden rounded-lg border border-border/60 bg-muted/40">
            <div className="flex items-center gap-2 border-b border-border/50 px-3 py-1.5">
              <div className="size-2 rounded-full bg-muted-foreground/40" />
              <span className="text-[12px] text-muted-foreground/60">
                page.tsx
              </span>
            </div>
            <pre className="p-3 text-[13px] leading-relaxed">
              <code className="text-foreground">{`"use client"

import { useChat } from "@ai-sdk/react"

export default function Chat() {
  const { messages, input,
    handleSubmit } = useChat()

  return (
    <div>
      {messages.map(m => (
        <div key={m.id}>{m.content}</div>
      ))}
      <form onSubmit={handleSubmit}>
        <input value={input} />
      </form>
    </div>
  )
}`}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Code Block 3 ─── */
export function CodeBlock3Preview() {
  return (
    <div className="mx-auto w-full max-w-2xl p-8">
      <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 text-white">
        <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-2.5">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="size-2.5 rounded-full bg-zinc-700" />
              <div className="size-2.5 rounded-full bg-zinc-700" />
              <div className="size-2.5 rounded-full bg-zinc-700" />
            </div>
            <span className="ml-2 text-[12px] text-zinc-500">agent.ts</span>
          </div>
          <button className="text-[12px] text-zinc-600 hover:text-zinc-400">
            Copy
          </button>
        </div>
        <pre className="overflow-x-auto p-4 text-[13px] leading-relaxed [&::-webkit-scrollbar]:hidden">
          <code>
            <span className="text-zinc-500">{"// "}</span>
            <span className="text-zinc-400">Multi-step agent with tools</span>
            {"\n"}
            <span className="text-zinc-500">import</span>
            <span className="text-zinc-200">{" { generateText, tool }"}</span>
            <span className="text-zinc-500"> from </span>
            <span className="text-zinc-300">{'"ai"'}</span>
            {"\n"}
            <span className="text-zinc-500">import</span>
            <span className="text-zinc-200">{" { anthropic }"}</span>
            <span className="text-zinc-500"> from </span>
            <span className="text-zinc-300">{'"@ai-sdk/anthropic"'}</span>
            {"\n\n"}
            <span className="text-zinc-500">const</span>
            <span className="text-zinc-200"> result </span>
            <span className="text-zinc-500">= await</span>
            <span className="text-zinc-200">{" generateText({"}</span>
            {"\n"}
            <span className="text-zinc-200">{"  model: "}</span>
            <span className="text-zinc-300">{`anthropic("claude-sonnet-4-20250514")`}</span>
            <span className="text-zinc-200">,</span>
            {"\n"}
            <span className="text-zinc-200">{"  maxSteps: "}</span>
            <span className="text-zinc-300">5</span>
            <span className="text-zinc-200">,</span>
            {"\n"}
            <span className="text-zinc-200">{"  tools: { "}</span>
            <span className="text-zinc-300">search, analyze, report</span>
            <span className="text-zinc-200">{" },"}</span>
            {"\n"}
            <span className="text-zinc-200">{"  prompt: "}</span>
            <span className="text-zinc-300">{'"Research AI trends"'}</span>
            {"\n"}
            <span className="text-zinc-200">{"})"}</span>
          </code>
        </pre>
      </div>
    </div>
  )
}

/* ─── Feature Grid ─── */
export function FeatureGridPreview() {
  const features = [
    {
      title: "Streaming",
      description: "Real-time token streaming with backpressure handling",
    },
    {
      title: "Tool Calling",
      description: "Type-safe function invocation with automatic validation",
    },
    {
      title: "Multi-modal",
      description: "Text, image, audio, and video generation in one API",
    },
    {
      title: "Provider Agnostic",
      description: "Switch between OpenAI, Anthropic, Google with one line",
    },
    {
      title: "Edge Ready",
      description: "Deploy to Vercel Edge, Cloudflare Workers, or Deno",
    },
    {
      title: "Type Safe",
      description: "Full TypeScript support with inferred types",
    },
  ]

  return (
    <div className="mx-auto w-full max-w-3xl p-8">
      <div className="mb-8 text-center">
        <h3 className="text-lg font-semibold tracking-tight text-foreground">
          Everything You Need
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Built for modern AI applications
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="rounded-lg border border-border/60 p-5 transition-colors hover:border-border/60"
          >
            <h4 className="text-sm font-medium text-foreground">
              {feature.title}
            </h4>
            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── Bento Layout ─── */
export function BentoLayoutPreview() {
  return (
    <div className="mx-auto w-full max-w-3xl p-8">
      <div className="mb-8 text-center">
        <h3 className="text-lg font-semibold tracking-tight text-foreground">
          Platform Features
        </h3>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {/* Large card */}
        <div className="col-span-2 row-span-2 flex flex-col justify-between rounded-lg border border-border/60 p-6">
          <div>
            <span className="text-[12px] font-medium uppercase tracking-wider text-muted-foreground/60">
              AI Models
            </span>
            <h4 className="mt-2 text-lg font-semibold text-foreground">
              Unified Model API
            </h4>
            <p className="mt-1 text-xs text-muted-foreground">
              One interface for every provider. Switch models without changing
              your code.
            </p>
          </div>
          <div className="mt-4 space-y-1.5">
            {["OpenAI", "Anthropic", "Google", "Meta"].map((p) => (
              <div
                key={p}
                className="flex items-center gap-2 text-xs text-muted-foreground"
              >
                <div className="size-1.5 rounded-full bg-foreground/50" />
                {p}
              </div>
            ))}
          </div>
        </div>

        {/* Small cards */}
        <div className="flex flex-col justify-between rounded-lg border border-border/60 p-4">
          <span className="text-[12px] font-medium uppercase tracking-wider text-muted-foreground/60">
            Latency
          </span>
          <div className="mt-2">
            <p className="text-2xl font-semibold tabular-nums text-foreground">
              &lt;100ms
            </p>
            <p className="text-[12px] text-muted-foreground">
              First token time
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-lg border border-border/60 p-4">
          <span className="text-[12px] font-medium uppercase tracking-wider text-muted-foreground/60">
            Uptime
          </span>
          <div className="mt-2">
            <p className="text-2xl font-semibold tabular-nums text-foreground">
              99.9%
            </p>
            <p className="text-[12px] text-muted-foreground">
              Availability SLA
            </p>
          </div>
        </div>

        {/* Wide card */}
        <div className="col-span-3 rounded-lg border border-border/60 p-5">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-foreground">
                Ready to get started?
              </h4>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Install the SDK and build your first AI app in under 5 minutes.
              </p>
            </div>
            <button className="h-8 rounded-md bg-foreground px-4 text-xs font-medium text-background">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
