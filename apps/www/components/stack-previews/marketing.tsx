"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { SPRING, FADE_UP, STAGGER } from "./shared"

/* ─── Code Block 1 ─── */
export function CodeBlock1Preview() {
  const [activeTab, setActiveTab] = useState("typescript")
  const [copied, setCopied] = useState(false)

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

  function handleCopy() {
    navigator.clipboard.writeText(codeExamples[activeTab]).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="mx-auto w-full max-w-2xl p-6">
      <div className="mb-6 text-center">
        <h3 className="text-base font-semibold tracking-tight text-foreground">
          Start Building in Minutes
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Simple, intuitive API that works with any language model
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-border">
        <div className="flex items-center justify-between border-b border-border bg-card px-4">
          <div className="flex items-center gap-0">
            {Object.keys(codeExamples).map((lang) => (
              <button
                key={lang}
                onClick={() => { setActiveTab(lang); setCopied(false) }}
                className={`border-b-2 px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
                  activeTab === lang
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-xs text-muted-foreground transition-all duration-150 hover:text-foreground"
          >
            {copied ? (
              <>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-primary">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Copied
              </>
            ) : (
              <>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect width="14" height="14" x="8" y="8" rx="2" />
                  <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                </svg>
                Copy
              </>
            )}
          </button>
        </div>
        <pre className="overflow-x-auto p-4 text-sm leading-relaxed [&::-webkit-scrollbar]:hidden">
          <code className="font-mono text-foreground/90">{codeExamples[activeTab]}</code>
        </pre>
      </div>
    </div>
  )
}

/* ─── Code Block 2 ─── */
export function CodeBlock2Preview() {
  const [copiedPane, setCopiedPane] = useState<string | null>(null)

  function handleCopy(pane: string, code: string) {
    navigator.clipboard.writeText(code).catch(() => {})
    setCopiedPane(pane)
    setTimeout(() => setCopiedPane(null), 2000)
  }

  const serverCode = `"use server"

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
}`

  const clientCode = `"use client"

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
}`

  return (
    <div className="mx-auto w-full max-w-2xl p-6">
      <motion.div
        initial="initial"
        animate="animate"
        variants={{ animate: { ...STAGGER } }}
        className="grid gap-4 md:grid-cols-2"
      >
        {[
          { title: "Server Action", file: "actions.ts", code: serverCode, pane: "server" },
          { title: "Client UI", file: "page.tsx", code: clientCode, pane: "client" },
        ].map(({ title, file, code, pane }) => (
          <motion.div
            key={pane}
            variants={FADE_UP}
            transition={{ ...SPRING }}
            className="space-y-2"
          >
            <h3 className="text-sm font-semibold text-foreground">{title}</h3>
            <div className="overflow-hidden rounded-xl border border-border bg-card">
              <div className="flex items-center justify-between border-b border-border px-3 py-1.5">
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-muted-foreground/30" />
                  <span className="font-mono text-xs text-muted-foreground">
                    {file}
                  </span>
                </div>
                <button
                  onClick={() => handleCopy(pane, code)}
                  className="text-xs text-muted-foreground transition-all duration-150 hover:text-foreground"
                >
                  {copiedPane === pane ? "Copied" : "Copy"}
                </button>
              </div>
              <pre className="p-3 text-sm leading-relaxed">
                <code className="font-mono text-foreground/90">{code}</code>
              </pre>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

/* ─── Code Block 3 ─── */
export function CodeBlock3Preview() {
  const [copied, setCopied] = useState(false)

  const code = `// Multi-step agent with tools
import { generateText, tool } from "ai"
import { anthropic } from "@ai-sdk/anthropic"

const result = await generateText({
  model: anthropic("claude-sonnet-4-20250514"),
  maxSteps: 5,
  tools: { search, analyze, report },
  prompt: "Research AI trends"
})`

  function handleCopy() {
    navigator.clipboard.writeText(code).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="mx-auto w-full max-w-2xl p-6">
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="size-2.5 rounded-full bg-muted-foreground/20" />
              <div className="size-2.5 rounded-full bg-muted-foreground/20" />
              <div className="size-2.5 rounded-full bg-muted-foreground/20" />
            </div>
            <span className="ml-2 font-mono text-xs text-muted-foreground">agent.ts</span>
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-xs text-muted-foreground transition-all duration-150 hover:text-foreground"
          >
            {copied ? (
              <>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-primary">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Copied
              </>
            ) : (
              <>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect width="14" height="14" x="8" y="8" rx="2" />
                  <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                </svg>
                Copy
              </>
            )}
          </button>
        </div>
        <pre className="overflow-x-auto p-4 text-sm leading-relaxed [&::-webkit-scrollbar]:hidden">
          <code className="font-mono">
            <span className="text-muted-foreground">{"// "}</span>
            <span className="text-muted-foreground">Multi-step agent with tools</span>
            {"\n"}
            <span className="text-primary/70">import</span>
            <span className="text-foreground">{" { generateText, tool }"}</span>
            <span className="text-primary/70"> from </span>
            <span className="text-foreground/80">{'"ai"'}</span>
            {"\n"}
            <span className="text-primary/70">import</span>
            <span className="text-foreground">{" { anthropic }"}</span>
            <span className="text-primary/70"> from </span>
            <span className="text-foreground/80">{'"@ai-sdk/anthropic"'}</span>
            {"\n\n"}
            <span className="text-primary/70">const</span>
            <span className="text-foreground"> result </span>
            <span className="text-primary/70">= await</span>
            <span className="text-foreground">{" generateText({"}</span>
            {"\n"}
            <span className="text-foreground">{"  model: "}</span>
            <span className="text-foreground/80">{`anthropic("claude-sonnet-4-20250514")`}</span>
            <span className="text-foreground">,</span>
            {"\n"}
            <span className="text-foreground">{"  maxSteps: "}</span>
            <span className="text-primary">5</span>
            <span className="text-foreground">,</span>
            {"\n"}
            <span className="text-foreground">{"  tools: { "}</span>
            <span className="text-foreground/80">search, analyze, report</span>
            <span className="text-foreground">{" },"}</span>
            {"\n"}
            <span className="text-foreground">{"  prompt: "}</span>
            <span className="text-foreground/80">{'"Research AI trends"'}</span>
            {"\n"}
            <span className="text-foreground">{"})"}</span>
          </code>
        </pre>
      </div>
    </div>
  )
}

/* ─── Feature Grid ─── */

const FEATURE_ICONS: Record<string, JSX.Element> = {
  Streaming: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  ),
  "Tool Calling": (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  ),
  "Multi-modal": (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </svg>
  ),
  "Provider Agnostic": (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M2 18v3c0 .6.4 1 1 1h4v-3h3v-3h2l1.4-1.4a6.5 6.5 0 1 0-4-4Z" />
      <circle cx="16.5" cy="7.5" r=".5" fill="currentColor" />
    </svg>
  ),
  "Edge Ready": (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  ),
  "Type Safe": (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  ),
}

export function FeatureGridPreview() {
  const features = [
    { title: "Streaming", description: "Real-time token streaming with backpressure handling" },
    { title: "Tool Calling", description: "Type-safe function invocation with automatic validation" },
    { title: "Multi-modal", description: "Text, image, audio, and video generation in one API" },
    { title: "Provider Agnostic", description: "Switch between OpenAI, Anthropic, Google with one line" },
    { title: "Edge Ready", description: "Deploy to Vercel Edge, Cloudflare Workers, or Deno" },
    { title: "Type Safe", description: "Full TypeScript support with inferred types" },
  ]

  return (
    <div className="mx-auto w-full max-w-3xl p-6">
      <div className="mb-6 text-center">
        <h3 className="text-base font-semibold tracking-tight text-foreground">
          Everything You Need
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Built for modern AI applications
        </p>
      </div>

      <motion.div
        initial="initial"
        animate="animate"
        variants={{ animate: { ...STAGGER } }}
        className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
      >
        {features.map((feature) => (
          <motion.div
            key={feature.title}
            variants={FADE_UP}
            transition={{ ...SPRING }}
            className="rounded-xl border border-border p-4 transition-all duration-150 hover:border-primary/30 hover:bg-card"
          >
            <div className="mb-2 flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              {FEATURE_ICONS[feature.title]}
            </div>
            <h4 className="text-sm font-semibold text-foreground">
              {feature.title}
            </h4>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

/* ─── Bento Layout ─── */
export function BentoLayoutPreview() {
  return (
    <div className="mx-auto w-full max-w-3xl p-6">
      <div className="mb-6 text-center">
        <h3 className="text-base font-semibold tracking-tight text-foreground">
          Platform Features
        </h3>
      </div>

      <motion.div
        initial="initial"
        animate="animate"
        variants={{ animate: { ...STAGGER } }}
        className="grid grid-cols-3 gap-3"
      >
        {/* Large card */}
        <motion.div
          variants={FADE_UP}
          transition={{ ...SPRING }}
          className="col-span-2 row-span-2 flex flex-col justify-between rounded-xl border border-border p-5 transition-all duration-150 hover:border-primary/30 hover:bg-card"
        >
          <div>
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              AI Models
            </span>
            <h4 className="mt-2 text-base font-semibold text-foreground">
              Unified Model API
            </h4>
            <p className="mt-1 text-sm text-muted-foreground">
              One interface for every provider. Switch models without changing
              your code.
            </p>
          </div>
          <div className="mt-4 space-y-1.5">
            {["OpenAI", "Anthropic", "Google", "Meta"].map((p) => (
              <div
                key={p}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <div className="size-1.5 rounded-full bg-primary" />
                {p}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Small cards */}
        <motion.div
          variants={FADE_UP}
          transition={{ ...SPRING }}
          className="flex flex-col justify-between rounded-xl border border-border p-4 transition-all duration-150 hover:border-primary/30 hover:bg-card"
        >
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Latency
          </span>
          <div className="mt-2">
            <p className="font-mono text-2xl font-semibold tabular-nums text-foreground">
              &lt;100ms
            </p>
            <p className="text-xs text-muted-foreground">First token time</p>
          </div>
        </motion.div>

        <motion.div
          variants={FADE_UP}
          transition={{ ...SPRING }}
          className="flex flex-col justify-between rounded-xl border border-border p-4 transition-all duration-150 hover:border-primary/30 hover:bg-card"
        >
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Uptime
          </span>
          <div className="mt-2">
            <p className="font-mono text-2xl font-semibold tabular-nums text-foreground">
              99.9%
            </p>
            <p className="text-xs text-muted-foreground">Availability SLA</p>
          </div>
        </motion.div>

        {/* Wide card */}
        <motion.div
          variants={FADE_UP}
          transition={{ ...SPRING }}
          className="col-span-3 rounded-xl border border-border p-4 transition-all duration-150 hover:border-primary/30"
        >
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-foreground">
                Ready to get started?
              </h4>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Install the SDK and build your first AI app in under 5 minutes.
              </p>
            </div>
            <motion.button
              whileTap={{ scale: 0.97 }}
              className="h-9 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-all duration-150 hover:bg-primary/90"
            >
              Get Started
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
