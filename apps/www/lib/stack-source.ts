/**
 * Source code for all free stacks.
 * Each entry maps a stack slug to its implementation files.
 */

export interface PatternFile {
  name: string
  code: string
}

export interface PatternSource {
  files: PatternFile[]
}

export const stackSourceRegistry: Record<string, PatternSource> = {
  /* ────────────────────────────────────────────────────────────
   * GETTING STARTED
   * ──────────────────────────────────────────────────────────── */

  "basics-generate-text": {
    files: [
      {
        name: "page.tsx",
        code: `import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export default async function Page() {
  const { text } = await generateText({
    model: openai("gpt-4o"),
    prompt: "Explain quantum computing in simple terms.",
  })

  return (
    <div className="mx-auto max-w-xl p-8">
      <h1 className="text-lg font-semibold">Generate Text</h1>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
        {text}
      </p>
    </div>
  )
}`,
      },
    ],
  },

  "basics-stream-text": {
    files: [
      {
        name: "page.tsx",
        code: `"use client"

import { useCompletion } from "@ai-sdk/react"

export default function Page() {
  const { completion, input, handleInputChange, handleSubmit, isLoading } =
    useCompletion({ api: "/api/completion" })

  return (
    <div className="mx-auto max-w-xl p-8">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Ask something..."
          className="flex-1 rounded-md border px-3 py-2 text-sm"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-md bg-foreground px-4 py-2 text-sm text-background"
        >
          {isLoading ? "Streaming..." : "Send"}
        </button>
      </form>
      {completion && (
        <p className="mt-4 text-sm leading-relaxed">{completion}</p>
      )}
    </div>
  )
}`,
      },
      {
        name: "api/completion/route.ts",
        code: `import { streamText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(req: Request) {
  const { prompt } = await req.json()

  const result = streamText({
    model: openai("gpt-4o"),
    prompt,
  })

  return result.toDataStreamResponse()
}`,
      },
    ],
  },

  "basics-generate-image": {
    files: [
      {
        name: "page.tsx",
        code: `"use client"

import { useState } from "react"
import { experimental_generateImage as generateImage } from "ai"
import { openai } from "@ai-sdk/openai"

export default function Page() {
  const [images, setImages] = useState<string[]>([])

  async function handleGenerate(formData: FormData) {
    const prompt = formData.get("prompt") as string
    const { image } = await generateImage({
      model: openai.image("dall-e-3"),
      prompt,
      size: "1024x1024",
    })
    setImages((prev) => [...prev, image.base64])
  }

  return (
    <div className="mx-auto max-w-xl p-8">
      <form action={handleGenerate} className="flex gap-2">
        <input
          name="prompt"
          placeholder="Describe an image..."
          className="flex-1 rounded-md border px-3 py-2 text-sm"
        />
        <button className="rounded-md bg-foreground px-4 py-2 text-sm text-background">
          Generate
        </button>
      </form>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {images.map((src, i) => (
          <img
            key={i}
            src={\`data:image/png;base64,\${src}\`}
            alt="Generated"
            className="rounded-md border"
          />
        ))}
      </div>
    </div>
  )
}`,
      },
    ],
  },

  "basics-generate-speech": {
    files: [
      {
        name: "page.tsx",
        code: `"use client"

import { useState } from "react"

export default function Page() {
  const [audioUrl, setAudioUrl] = useState<string | null>(null)

  async function handleGenerate(formData: FormData) {
    const text = formData.get("text") as string
    const voice = formData.get("voice") as string
    const res = await fetch("/api/speech", {
      method: "POST",
      body: JSON.stringify({ text, voice }),
    })
    const blob = await res.blob()
    setAudioUrl(URL.createObjectURL(blob))
  }

  return (
    <div className="mx-auto max-w-xl p-8">
      <form action={handleGenerate} className="space-y-3">
        <textarea
          name="text"
          placeholder="Enter text to convert to speech..."
          className="w-full rounded-md border px-3 py-2 text-sm"
          rows={3}
        />
        <select name="voice" className="rounded-md border px-3 py-2 text-sm">
          <option value="alloy">Alloy</option>
          <option value="echo">Echo</option>
          <option value="fable">Fable</option>
          <option value="onyx">Onyx</option>
          <option value="nova">Nova</option>
          <option value="shimmer">Shimmer</option>
        </select>
        <button className="rounded-md bg-foreground px-4 py-2 text-sm text-background">
          Generate Speech
        </button>
      </form>
      {audioUrl && <audio src={audioUrl} controls className="mt-4 w-full" />}
    </div>
  )
}`,
      },
      {
        name: "api/speech/route.ts",
        code: `import { experimental_generateSpeech as generateSpeech } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(req: Request) {
  const { text, voice } = await req.json()

  const { audio } = await generateSpeech({
    model: openai.speech("tts-1"),
    text,
    voice,
  })

  return new Response(audio, {
    headers: { "Content-Type": "audio/mpeg" },
  })
}`,
      },
    ],
  },

  "basics-transcribe": {
    files: [
      {
        name: "page.tsx",
        code: `"use client"

import { useState } from "react"

export default function Page() {
  const [transcript, setTranscript] = useState("")

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append("audio", file)

    const res = await fetch("/api/transcribe", {
      method: "POST",
      body: formData,
    })
    const { text } = await res.json()
    setTranscript(text)
  }

  return (
    <div className="mx-auto max-w-xl p-8">
      <input type="file" accept="audio/*" onChange={handleUpload} />
      {transcript && (
        <div className="mt-4 rounded-md border p-4">
          <p className="text-sm">{transcript}</p>
        </div>
      )}
    </div>
  )
}`,
      },
      {
        name: "api/transcribe/route.ts",
        code: `import { experimental_transcribe as transcribe } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(req: Request) {
  const formData = await req.formData()
  const audio = formData.get("audio") as File

  const { text } = await transcribe({
    model: openai.transcription("whisper-1"),
    audio,
  })

  return Response.json({ text })
}`,
      },
    ],
  },

  "basics-tool": {
    files: [
      {
        name: "page.tsx",
        code: `import { generateText, tool } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"

export default async function Page() {
  const { text, toolCalls } = await generateText({
    model: openai("gpt-4o"),
    prompt: "What's the weather in San Francisco?",
    tools: {
      getWeather: tool({
        description: "Get weather for a city",
        parameters: z.object({
          city: z.string().describe("The city name"),
        }),
        execute: async ({ city }) => ({
          temp: 18,
          condition: "Partly Cloudy",
          humidity: 65,
        }),
      }),
    },
  })

  return (
    <div className="mx-auto max-w-xl p-8">
      <h1 className="text-lg font-semibold">Tool Calling</h1>
      {toolCalls.map((call, i) => (
        <pre key={i} className="mt-2 rounded-md bg-muted p-3 text-xs">
          {JSON.stringify(call, null, 2)}
        </pre>
      ))}
      <p className="mt-4 text-sm">{text}</p>
    </div>
  )
}`,
      },
    ],
  },

  "basics-agent": {
    files: [
      {
        name: "page.tsx",
        code: `import { generateText, tool } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"

export default async function Page() {
  const { text, steps } = await generateText({
    model: openai("gpt-4o"),
    maxSteps: 5,
    prompt: "Research the latest AI developments and summarize them.",
    tools: {
      search: tool({
        description: "Search the web",
        parameters: z.object({ query: z.string() }),
        execute: async ({ query }) => \`Results for: \${query}\`,
      }),
      analyze: tool({
        description: "Analyze content",
        parameters: z.object({ content: z.string() }),
        execute: async ({ content }) => \`Analysis of: \${content}\`,
      }),
    },
  })

  return (
    <div className="mx-auto max-w-xl p-8">
      <h1 className="text-lg font-semibold">Agent</h1>
      <p className="mt-1 text-xs text-muted-foreground">
        {steps.length} steps executed
      </p>
      {steps.map((step, i) => (
        <div key={i} className="mt-3 border-l-2 pl-3">
          <p className="text-xs font-medium">Step {i + 1}</p>
          {step.toolCalls?.map((tc, j) => (
            <p key={j} className="text-xs text-muted-foreground">
              Tool: {tc.toolName}({JSON.stringify(tc.args)})
            </p>
          ))}
        </div>
      ))}
      <p className="mt-4 text-sm">{text}</p>
    </div>
  )
}`,
      },
    ],
  },

  /* ────────────────────────────────────────────────────────────
   * CHAT & CONVERSATIONS
   * ──────────────────────────────────────────────────────────── */

  "ai-elements-chat": {
    files: [
      {
        name: "page.tsx",
        code: `"use client"

import { useChat } from "@ai-sdk/react"

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat()

  return (
    <div className="mx-auto flex h-screen max-w-xl flex-col">
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={\`flex \${m.role === "user" ? "justify-end" : "justify-start"}\`}
          >
            <div
              className={\`max-w-[80%] rounded-lg px-3 py-2 text-sm \${
                m.role === "user"
                  ? "bg-foreground text-background"
                  : "bg-muted"
              }\`}
            >
              {m.content}
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="border-t p-4">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="Type a message..."
            className="flex-1 rounded-md border px-3 py-2 text-sm"
          />
          <button className="rounded-md bg-foreground px-4 py-2 text-sm text-background">
            Send
          </button>
        </div>
      </form>
    </div>
  )
}`,
      },
      {
        name: "api/chat/route.ts",
        code: `import { streamText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = streamText({
    model: openai("gpt-4o"),
    messages,
  })

  return result.toDataStreamResponse()
}`,
      },
    ],
  },

  "ai-elements-reasoning-chat": {
    files: [
      {
        name: "page.tsx",
        code: `"use client"

import { useChat } from "@ai-sdk/react"
import { useState } from "react"

export default function ReasoningChat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat()

  return (
    <div className="mx-auto flex h-screen max-w-xl flex-col">
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.map((m) => (
          <div key={m.id}>
            {m.parts?.map((part, i) => {
              if (part.type === "reasoning") {
                return <ReasoningBlock key={i} content={part.reasoning} />
              }
              if (part.type === "text") {
                return (
                  <div key={i} className="rounded-lg bg-muted px-3 py-2 text-sm">
                    {part.text}
                  </div>
                )
              }
              return null
            })}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="border-t p-4">
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Ask something..."
          className="w-full rounded-md border px-3 py-2 text-sm"
        />
      </form>
    </div>
  )
}

function ReasoningBlock({ content }: { content: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="mb-2">
      <button onClick={() => setOpen(!open)} className="text-xs text-muted-foreground">
        {open ? "Hide" : "Show"} reasoning
      </button>
      {open && (
        <div className="mt-1 border-l-2 pl-3 text-xs text-muted-foreground">
          {content}
        </div>
      )}
    </div>
  )
}`,
      },
      {
        name: "api/chat/route.ts",
        code: `import { streamText } from "ai"
import { anthropic } from "@ai-sdk/anthropic"

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = streamText({
    model: anthropic("claude-sonnet-4-20250514"),
    messages,
    providerOptions: {
      anthropic: { thinking: { type: "enabled", budgetTokens: 5000 } },
    },
  })

  return result.toDataStreamResponse()
}`,
      },
    ],
  },

  "ai-elements-sources-chat": {
    files: [
      {
        name: "page.tsx",
        code: `"use client"

import { useChat } from "@ai-sdk/react"

interface Source {
  title: string
  url: string
  snippet: string
}

export default function SourcesChat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat()

  return (
    <div className="mx-auto flex h-screen max-w-xl flex-col">
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.map((m) => (
          <div key={m.id}>
            <div className="rounded-lg bg-muted px-3 py-2 text-sm">
              {m.content}
            </div>
            {m.annotations?.map((a: any, i) =>
              a.sources ? (
                <div key={i} className="mt-2 space-y-1">
                  {a.sources.map((s: Source, j: number) => (
                    <a
                      key={j}
                      href={s.url}
                      className="block rounded border p-2 text-xs hover:bg-muted"
                    >
                      <p className="font-medium">{s.title}</p>
                      <p className="text-muted-foreground">{s.snippet}</p>
                    </a>
                  ))}
                </div>
              ) : null
            )}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="border-t p-4">
        <input
          value={input}
          onChange={handleInputChange}
          className="w-full rounded-md border px-3 py-2 text-sm"
        />
      </form>
    </div>
  )
}`,
      },
    ],
  },

  "ai-elements-plan": {
    files: [
      {
        name: "page.tsx",
        code: `"use client"

import { useChat } from "@ai-sdk/react"

interface Step {
  title: string
  description: string
  status: "pending" | "running" | "done"
}

export default function PlanDisplay() {
  const { messages, input, handleInputChange, handleSubmit } = useChat()

  return (
    <div className="mx-auto flex h-screen max-w-xl flex-col">
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.map((m) => (
          <div key={m.id}>
            {m.parts?.map((part, i) => {
              if (part.type === "tool-invocation" && part.toolName === "createPlan") {
                const steps: Step[] = part.result?.steps ?? []
                return (
                  <div key={i} className="space-y-1 rounded-md border p-3">
                    <p className="text-xs font-medium">Execution Plan</p>
                    {steps.map((step, j) => (
                      <div key={j} className="flex items-center gap-2 py-1">
                        <StatusIcon status={step.status} />
                        <span className="text-sm">{step.title}</span>
                      </div>
                    ))}
                  </div>
                )
              }
              return null
            })}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="border-t p-4">
        <input
          value={input}
          onChange={handleInputChange}
          className="w-full rounded-md border px-3 py-2 text-sm"
        />
      </form>
    </div>
  )
}

function StatusIcon({ status }: { status: string }) {
  if (status === "done") return <span className="text-green-500">✓</span>
  if (status === "running") return <span className="animate-spin">⟳</span>
  return <span className="text-muted-foreground">○</span>
}`,
      },
    ],
  },

  "ai-elements-confirmation": {
    files: [
      {
        name: "page.tsx",
        code: `"use client"

import { useChat } from "@ai-sdk/react"

export default function ToolConfirmation() {
  const { messages, input, handleInputChange, handleSubmit, addToolResult } =
    useChat({ maxSteps: 3 })

  return (
    <div className="mx-auto flex h-screen max-w-xl flex-col">
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.map((m) => (
          <div key={m.id}>
            {m.parts?.map((part, i) => {
              if (
                part.type === "tool-invocation" &&
                part.toolInvocation.state === "call"
              ) {
                return (
                  <div key={i} className="rounded-md border p-4">
                    <p className="text-sm font-medium">
                      Approve: {part.toolInvocation.toolName}
                    </p>
                    <pre className="mt-2 text-xs text-muted-foreground">
                      {JSON.stringify(part.toolInvocation.args, null, 2)}
                    </pre>
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() =>
                          addToolResult({
                            toolCallId: part.toolInvocation.toolCallId,
                            result: "Approved",
                          })
                        }
                        className="rounded bg-foreground px-3 py-1 text-xs text-background"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() =>
                          addToolResult({
                            toolCallId: part.toolInvocation.toolCallId,
                            result: "Denied by user",
                          })
                        }
                        className="rounded border px-3 py-1 text-xs"
                      >
                        Deny
                      </button>
                    </div>
                  </div>
                )
              }
              return null
            })}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="border-t p-4">
        <input
          value={input}
          onChange={handleInputChange}
          className="w-full rounded-md border px-3 py-2 text-sm"
        />
      </form>
    </div>
  )
}`,
      },
    ],
  },

  "ai-elements-queue": {
    files: [
      {
        name: "page.tsx",
        code: `"use client"

import { useState, useEffect } from "react"

interface Task {
  id: string
  name: string
  status: "queued" | "running" | "done" | "failed"
}

export default function QueueDisplay() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: "1", name: "Fetch data", status: "done" },
    { id: "2", name: "Process records", status: "running" },
    { id: "3", name: "Generate report", status: "queued" },
    { id: "4", name: "Send notifications", status: "queued" },
  ])

  useEffect(() => {
    const interval = setInterval(() => {
      setTasks((prev) => {
        const running = prev.findIndex((t) => t.status === "running")
        if (running === -1) return prev
        const next = [...prev]
        next[running] = { ...next[running], status: "done" }
        if (running + 1 < next.length) {
          next[running + 1] = { ...next[running + 1], status: "running" }
        }
        return next
      })
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="mx-auto max-w-md p-8">
      <h2 className="text-sm font-medium">Task Queue</h2>
      <div className="mt-4 space-y-2">
        {tasks.map((task) => (
          <div key={task.id} className="flex items-center gap-3 rounded border p-3">
            <StatusDot status={task.status} />
            <span className="text-sm">{task.name}</span>
            <span className="ml-auto text-xs text-muted-foreground">
              {task.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function StatusDot({ status }: { status: string }) {
  const colors: Record<string, string> = {
    done: "bg-green-500",
    running: "bg-blue-500 animate-pulse",
    queued: "bg-muted-foreground/30",
    failed: "bg-red-500",
  }
  return <div className={\`size-2 rounded-full \${colors[status]}\`} />
}`,
      },
    ],
  },

  /* ────────────────────────────────────────────────────────────
   * AGENTS & ORCHESTRATION
   * ──────────────────────────────────────────────────────────── */

  "ai-agents-routing": {
    files: [
      {
        name: "page.tsx",
        code: `import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

const agents = {
  writer: openai("gpt-4o"),
  coder: openai("gpt-4o"),
  analyst: openai("gpt-4o"),
}

async function routeRequest(prompt: string) {
  const { text: route } = await generateText({
    model: openai("gpt-4o-mini"),
    system: \`Classify the user request into one of: writer, coder, analyst.
Respond with only the category name.\`,
    prompt,
  })

  const agent = route.trim().toLowerCase() as keyof typeof agents
  const model = agents[agent] ?? agents.writer

  const { text } = await generateText({
    model,
    prompt,
  })

  return { agent, text }
}

export default async function Page() {
  const { agent, text } = await routeRequest("Write a haiku about AI")

  return (
    <div className="mx-auto max-w-xl p-8">
      <p className="text-xs text-muted-foreground">Routed to: {agent}</p>
      <p className="mt-4 text-sm">{text}</p>
    </div>
  )
}`,
      },
    ],
  },

  "ai-agents-parallel-processing": {
    files: [
      {
        name: "page.tsx",
        code: `import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

async function analyzeInParallel(content: string) {
  const [sentiment, entities, topics] = await Promise.all([
    generateText({
      model: openai("gpt-4o-mini"),
      system: "Analyze sentiment. Return: positive, negative, or neutral.",
      prompt: content,
    }),
    generateText({
      model: openai("gpt-4o-mini"),
      system: "Extract named entities as a JSON array.",
      prompt: content,
    }),
    generateText({
      model: openai("gpt-4o-mini"),
      system: "Classify the main topics. Return as a JSON array.",
      prompt: content,
    }),
  ])

  return {
    sentiment: sentiment.text,
    entities: entities.text,
    topics: topics.text,
  }
}

export default async function Page() {
  const result = await analyzeInParallel(
    "OpenAI released GPT-5 today, marking a significant advance in AI."
  )

  return (
    <div className="mx-auto max-w-xl space-y-3 p-8">
      <h1 className="text-lg font-semibold">Parallel Processing</h1>
      {Object.entries(result).map(([key, value]) => (
        <div key={key} className="rounded-md border p-3">
          <p className="text-xs font-medium uppercase">{key}</p>
          <p className="mt-1 text-sm text-muted-foreground">{value}</p>
        </div>
      ))}
    </div>
  )
}`,
      },
    ],
  },

  /* ────────────────────────────────────────────────────────────
   * HUMAN IN THE LOOP
   * ──────────────────────────────────────────────────────────── */

  "ai-human-in-the-loop": {
    files: [
      {
        name: "page.tsx",
        code: `"use client"

import { useChat } from "@ai-sdk/react"

export default function HumanInTheLoop() {
  const { messages, input, handleInputChange, handleSubmit, addToolResult } =
    useChat({ maxSteps: 5 })

  return (
    <div className="mx-auto flex h-screen max-w-xl flex-col">
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.map((m) => (
          <div key={m.id}>
            {m.parts?.map((part, i) => {
              if (part.type === "text") {
                return <p key={i} className="text-sm">{part.text}</p>
              }
              if (
                part.type === "tool-invocation" &&
                part.toolInvocation.state === "call"
              ) {
                return (
                  <div key={i} className="rounded-md border p-4">
                    <p className="font-medium text-sm">
                      {part.toolInvocation.toolName}
                    </p>
                    <pre className="mt-2 text-xs">
                      {JSON.stringify(part.toolInvocation.args, null, 2)}
                    </pre>
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() =>
                          addToolResult({
                            toolCallId: part.toolInvocation.toolCallId,
                            result: "Approved and executed",
                          })
                        }
                        className="rounded bg-foreground px-3 py-1 text-xs text-background"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() =>
                          addToolResult({
                            toolCallId: part.toolInvocation.toolCallId,
                            result: "Rejected by user",
                          })
                        }
                        className="rounded border px-3 py-1 text-xs"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                )
              }
              return null
            })}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="border-t p-4">
        <input
          value={input}
          onChange={handleInputChange}
          className="w-full rounded-md border px-3 py-2 text-sm"
        />
      </form>
    </div>
  )
}`,
      },
    ],
  },

  /* ────────────────────────────────────────────────────────────
   * TOOLS & INTEGRATIONS
   * ──────────────────────────────────────────────────────────── */

  "tool-websearch-claude": {
    files: [
      {
        name: "page.tsx",
        code: `import { generateText } from "ai"
import { anthropic } from "@ai-sdk/anthropic"

export default async function Page() {
  const { text, sources } = await generateText({
    model: anthropic("claude-sonnet-4-20250514"),
    prompt: "What are the latest developments in AI?",
    tools: {
      web_search: anthropic.tools.webSearch_20250305({
        maxUses: 3,
      }),
    },
    maxSteps: 3,
  })

  return (
    <div className="mx-auto max-w-xl p-8">
      <p className="text-sm leading-relaxed">{text}</p>
      {sources && (
        <div className="mt-4 space-y-2">
          <p className="text-xs font-medium">Sources</p>
          {sources.map((s, i) => (
            <a
              key={i}
              href={s.url}
              className="block rounded border p-2 text-xs hover:bg-muted"
            >
              {s.title}
            </a>
          ))}
        </div>
      )}
    </div>
  )
}`,
      },
    ],
  },

  "tool-websearch-exa": {
    files: [
      {
        name: "page.tsx",
        code: `import { generateText, tool } from "ai"
import { openai } from "@ai-sdk/openai"
import Exa from "exa-js"
import { z } from "zod"

const exa = new Exa(process.env.EXA_API_KEY!)

export default async function Page() {
  const { text } = await generateText({
    model: openai("gpt-4o"),
    prompt: "Find the best resources about building AI agents",
    tools: {
      search: tool({
        description: "Search the web using Exa neural search",
        parameters: z.object({
          query: z.string(),
          numResults: z.number().default(5),
        }),
        execute: async ({ query, numResults }) => {
          const results = await exa.searchAndContents(query, {
            numResults,
            text: true,
          })
          return results.results.map((r) => ({
            title: r.title,
            url: r.url,
            text: r.text?.slice(0, 200),
          }))
        },
      }),
    },
    maxSteps: 3,
  })

  return (
    <div className="mx-auto max-w-xl p-8">
      <p className="text-sm">{text}</p>
    </div>
  )
}`,
      },
    ],
  },

  "cheerio-scraper": {
    files: [
      {
        name: "page.tsx",
        code: `import { generateText, tool } from "ai"
import { openai } from "@ai-sdk/openai"
import * as cheerio from "cheerio"
import { z } from "zod"

export default async function Page() {
  const { text } = await generateText({
    model: openai("gpt-4o"),
    prompt: "Scrape example.com and tell me what it contains",
    tools: {
      scrapeUrl: tool({
        description: "Scrape a URL and extract its text content",
        parameters: z.object({ url: z.string().url() }),
        execute: async ({ url }) => {
          const html = await fetch(url).then((r) => r.text())
          const $ = cheerio.load(html)

          // Remove scripts and styles
          $("script, style, nav, footer").remove()

          const title = $("title").text()
          const body = $("body").text().replace(/\\s+/g, " ").trim()

          return { title, body: body.slice(0, 2000) }
        },
      }),
    },
    maxSteps: 2,
  })

  return (
    <div className="mx-auto max-w-xl p-8">
      <p className="text-sm">{text}</p>
    </div>
  )
}`,
      },
    ],
  },

  "jina-scraper": {
    files: [
      {
        name: "page.tsx",
        code: `import { generateText, tool } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"

export default async function Page() {
  const { text } = await generateText({
    model: openai("gpt-4o"),
    prompt: "Extract the main content from https://example.com",
    tools: {
      jinaReader: tool({
        description: "Use Jina AI Reader to extract content from a URL",
        parameters: z.object({ url: z.string().url() }),
        execute: async ({ url }) => {
          const response = await fetch(\`https://r.jina.ai/\${url}\`, {
            headers: {
              Authorization: \`Bearer \${process.env.JINA_API_KEY}\`,
              Accept: "application/json",
            },
          })
          const data = await response.json()
          return {
            title: data.data?.title,
            content: data.data?.content?.slice(0, 3000),
          }
        },
      }),
    },
    maxSteps: 2,
  })

  return (
    <div className="mx-auto max-w-xl p-8">
      <p className="text-sm">{text}</p>
    </div>
  )
}`,
      },
    ],
  },

  "markdown-new-scraper": {
    files: [
      {
        name: "page.tsx",
        code: `import { generateText, tool } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"
import TurndownService from "turndown"

const turndown = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
})

export default async function Page() {
  const { text } = await generateText({
    model: openai("gpt-4o"),
    prompt: "Convert https://example.com to markdown and summarize it",
    tools: {
      urlToMarkdown: tool({
        description: "Convert a URL to markdown",
        parameters: z.object({ url: z.string().url() }),
        execute: async ({ url }) => {
          const html = await fetch(url).then((r) => r.text())
          const markdown = turndown.turndown(html)
          return { markdown: markdown.slice(0, 5000) }
        },
      }),
    },
    maxSteps: 2,
  })

  return (
    <div className="mx-auto max-w-xl p-8">
      <p className="text-sm">{text}</p>
    </div>
  )
}`,
      },
    ],
  },

  "ai-pdf-ingest": {
    files: [
      {
        name: "page.tsx",
        code: `"use client"

import { useChat } from "@ai-sdk/react"
import { useState } from "react"

export default function PDFAnalysis() {
  const { messages, input, handleInputChange, handleSubmit } = useChat()
  const [file, setFile] = useState<File | null>(null)

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!file) return

    const formData = new FormData()
    formData.append("file", file)
    formData.append("prompt", input || "Summarize this PDF")

    handleSubmit(e, {
      experimental_attachments: [
        {
          name: file.name,
          contentType: file.type,
          url: URL.createObjectURL(file),
        },
      ],
    })
  }

  return (
    <div className="mx-auto flex h-screen max-w-xl flex-col">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((m) => (
          <div key={m.id} className="mb-4 text-sm">
            <p className="text-xs font-medium text-muted-foreground">
              {m.role}
            </p>
            <p className="mt-1">{m.content}</p>
          </div>
        ))}
      </div>
      <form onSubmit={onSubmit} className="border-t p-4">
        <input type="file" accept=".pdf" onChange={handleFileUpload} />
        <div className="mt-2 flex gap-2">
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask about the PDF..."
            className="flex-1 rounded-md border px-3 py-2 text-sm"
          />
          <button className="rounded-md bg-foreground px-4 py-2 text-sm text-background">
            Analyze
          </button>
        </div>
      </form>
    </div>
  )
}`,
      },
    ],
  },

  /* ────────────────────────────────────────────────────────────
   * WORKFLOWS & PIPELINES
   * ──────────────────────────────────────────────────────────── */

  "ai-workflow-basic": {
    files: [
      {
        name: "page.tsx",
        code: `import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

async function analyzeUrl(url: string) {
  // Step 1: Fetch content
  const html = await fetch(url).then((r) => r.text())

  // Step 2: Extract text
  const text = html.replace(/<[^>]*>/g, " ").replace(/\\s+/g, " ").trim()

  // Step 3: Analyze with AI
  const { text: analysis } = await generateText({
    model: openai("gpt-4o"),
    system: "Analyze the following webpage content. Provide a structured summary.",
    prompt: text.slice(0, 4000),
  })

  // Step 4: Generate structured output
  const { text: structured } = await generateText({
    model: openai("gpt-4o"),
    system: "Convert this analysis to JSON with keys: title, summary, topics, sentiment.",
    prompt: analysis,
  })

  return JSON.parse(structured)
}

export default async function Page() {
  const result = await analyzeUrl("https://example.com")

  return (
    <div className="mx-auto max-w-xl p-8">
      <h1 className="text-lg font-semibold">URL Analysis</h1>
      <pre className="mt-4 rounded-md bg-muted p-4 text-xs">
        {JSON.stringify(result, null, 2)}
      </pre>
    </div>
  )
}`,
      },
    ],
  },

  /* ────────────────────────────────────────────────────────────
   * ARTIFACTS & GENERATION
   * ──────────────────────────────────────────────────────────── */

  "ai-artifact-table": {
    files: [
      {
        name: "page.tsx",
        code: `"use client"

import { useChat } from "@ai-sdk/react"
import { useState } from "react"

export default function TableEditor() {
  const { messages, input, handleInputChange, handleSubmit } = useChat()

  return (
    <div className="mx-auto flex h-screen max-w-3xl flex-col">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((m) => (
          <div key={m.id} className="mb-4">
            {m.parts?.map((part, i) => {
              if (
                part.type === "tool-invocation" &&
                part.toolName === "generateTable"
              ) {
                const data = part.result?.rows ?? []
                const cols = part.result?.columns ?? []
                return (
                  <table key={i} className="w-full border-collapse">
                    <thead>
                      <tr>
                        {cols.map((col: string) => (
                          <th key={col} className="border p-2 text-left text-xs">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((row: Record<string, string>, j: number) => (
                        <tr key={j}>
                          {cols.map((col: string) => (
                            <td key={col} className="border p-2 text-sm">
                              {row[col]}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )
              }
              if (part.type === "text") {
                return <p key={i} className="text-sm">{part.text}</p>
              }
              return null
            })}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="border-t p-4">
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Generate a table..."
          className="w-full rounded-md border px-3 py-2 text-sm"
        />
      </form>
    </div>
  )
}`,
      },
    ],
  },

  "ai-artifact-chart": {
    files: [
      {
        name: "page.tsx",
        code: `"use client"

import { useChat } from "@ai-sdk/react"

interface ChartData {
  labels: string[]
  values: number[]
  title: string
}

export default function ChartGeneration() {
  const { messages, input, handleInputChange, handleSubmit } = useChat()

  return (
    <div className="mx-auto flex h-screen max-w-xl flex-col">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((m) => (
          <div key={m.id} className="mb-4">
            {m.parts?.map((part, i) => {
              if (
                part.type === "tool-invocation" &&
                part.toolName === "generateChart"
              ) {
                const data: ChartData = part.result
                const max = Math.max(...data.values)
                return (
                  <div key={i} className="rounded-md border p-4">
                    <p className="mb-4 text-sm font-medium">{data.title}</p>
                    <div className="flex h-40 items-end gap-2">
                      {data.values.map((v, j) => (
                        <div key={j} className="flex flex-1 flex-col items-center gap-1">
                          <span className="text-xs">{v}</span>
                          <div
                            className="w-full rounded-t bg-foreground/70"
                            style={{ height: \`\${(v / max) * 100}%\` }}
                          />
                          <span className="text-[10px] text-muted-foreground">
                            {data.labels[j]}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              }
              if (part.type === "text") {
                return <p key={i} className="text-sm">{part.text}</p>
              }
              return null
            })}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="border-t p-4">
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Generate a chart..."
          className="w-full rounded-md border px-3 py-2 text-sm"
        />
      </form>
    </div>
  )
}`,
      },
    ],
  },

  /* ────────────────────────────────────────────────────────────
   * MARKETING & LANDING
   * ──────────────────────────────────────────────────────────── */

  "marketing-feature-code-block-1": {
    files: [
      {
        name: "component.tsx",
        code: `export function FeatureCodeBlock() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <h2 className="text-2xl font-semibold tracking-tight">
          Start Building in Minutes
        </h2>
        <p className="mt-3 text-muted-foreground">
          Simple, intuitive API that works with any language model
        </p>
        <div className="mt-8 overflow-hidden rounded-lg border text-left">
          <div className="border-b bg-muted/30 px-4 py-2">
            <span className="text-xs text-muted-foreground">page.tsx</span>
          </div>
          <pre className="overflow-x-auto p-4 text-sm">
{\`import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

const { text } = await generateText({
  model: openai("gpt-4o"),
  prompt: "Explain quantum computing",
})\`}
          </pre>
        </div>
      </div>
    </section>
  )
}`,
      },
    ],
  },

  "marketing-feature-code-block-2": {
    files: [
      {
        name: "component.tsx",
        code: `export function FeatureCodeBlockSplit() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-4xl px-6">
        <h2 className="text-center text-2xl font-semibold tracking-tight">
          Server & Client, Unified
        </h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="overflow-hidden rounded-lg border">
            <div className="border-b bg-muted/30 px-4 py-2">
              <span className="text-xs text-muted-foreground">actions.ts</span>
            </div>
            <pre className="p-4 text-xs">
{\`"use server"
import { streamText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function chat(messages) {
  const result = streamText({
    model: openai("gpt-4o"),
    messages,
  })
  return result.toDataStreamResponse()
}\`}
            </pre>
          </div>
          <div className="overflow-hidden rounded-lg border">
            <div className="border-b bg-muted/30 px-4 py-2">
              <span className="text-xs text-muted-foreground">page.tsx</span>
            </div>
            <pre className="p-4 text-xs">
{\`"use client"
import { useChat } from "@ai-sdk/react"

export default function Chat() {
  const { messages, input,
    handleSubmit } = useChat()
  return (
    <div>
      {messages.map(m => (
        <div key={m.id}>{m.content}</div>
      ))}
    </div>
  )
}\`}
            </pre>
          </div>
        </div>
      </div>
    </section>
  )
}`,
      },
    ],
  },

  "marketing-feature-code-block-3": {
    files: [
      {
        name: "component.tsx",
        code: `export function FeatureCodeBlockDark() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <h2 className="text-2xl font-semibold tracking-tight">
          Agent Architecture
        </h2>
        <div className="mt-8 overflow-hidden rounded-xl bg-[#0a0a0a] text-left text-white">
          <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-2">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="size-2.5 rounded-full bg-white/10" />
                <div className="size-2.5 rounded-full bg-white/10" />
                <div className="size-2.5 rounded-full bg-white/10" />
              </div>
              <span className="ml-2 text-xs text-white/30">agent.ts</span>
            </div>
          </div>
          <pre className="p-4 text-xs leading-relaxed">
{\`import { generateText, tool } from "ai"
import { anthropic } from "@ai-sdk/anthropic"
import { z } from "zod"

const result = await generateText({
  model: anthropic("claude-sonnet-4-20250514"),
  maxSteps: 5,
  tools: {
    search: tool({
      description: "Search the web",
      parameters: z.object({ query: z.string() }),
      execute: async ({ query }) => searchWeb(query),
    }),
  },
  prompt: "Research the latest AI trends",
})\`}
          </pre>
        </div>
      </div>
    </section>
  )
}`,
      },
    ],
  },

  "marketing-feature-grid-1": {
    files: [
      {
        name: "component.tsx",
        code: `const features = [
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

export function FeatureGrid() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-4xl px-6">
        <h2 className="text-center text-2xl font-semibold tracking-tight">
          Everything You Need
        </h2>
        <p className="mt-3 text-center text-muted-foreground">
          Built for modern AI applications
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="rounded-lg border p-5">
              <h3 className="text-sm font-medium">{f.title}</h3>
              <p className="mt-1.5 text-xs text-muted-foreground">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}`,
      },
    ],
  },

  "marketing-bento-1": {
    files: [
      {
        name: "component.tsx",
        code: `export function BentoGrid() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-4xl px-6">
        <h2 className="text-center text-2xl font-semibold tracking-tight">
          Platform Features
        </h2>
        <div className="mt-10 grid grid-cols-3 gap-3">
          {/* Large card */}
          <div className="col-span-2 row-span-2 flex flex-col justify-between rounded-lg border p-6">
            <div>
              <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                AI Models
              </span>
              <h3 className="mt-2 text-lg font-semibold">Unified Model API</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                One interface for every provider.
              </p>
            </div>
            <div className="mt-4 space-y-1">
              {["OpenAI", "Anthropic", "Google", "Meta"].map((p) => (
                <div key={p} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="size-1.5 rounded-full bg-foreground/30" />
                  {p}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border p-4">
            <span className="text-[10px] uppercase text-muted-foreground">Latency</span>
            <p className="mt-2 text-2xl font-semibold">&lt;100ms</p>
            <p className="text-xs text-muted-foreground">First token</p>
          </div>

          <div className="rounded-lg border p-4">
            <span className="text-[10px] uppercase text-muted-foreground">Uptime</span>
            <p className="mt-2 text-2xl font-semibold">99.9%</p>
            <p className="text-xs text-muted-foreground">SLA</p>
          </div>

          <div className="col-span-3 rounded-lg border p-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium">Ready to get started?</h3>
                <p className="text-xs text-muted-foreground">
                  Build your first AI app in under 5 minutes.
                </p>
              </div>
              <button className="rounded-md bg-foreground px-4 py-2 text-sm text-background">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}`,
      },
    ],
  },

  /* ────────────────────────────────────────────────────────────
   * AI UI PRIMITIVES
   * ──────────────────────────────────────────────────────────── */

  "streaming-markdown-renderer": {
    files: [
      {
        name: "streaming-markdown.tsx",
        code: `"use client"

import { useChat } from "@ai-sdk/react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"

export function StreamingMarkdown() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat()

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      {messages.map((m) => (
        <div key={m.id} className={m.role === "user" ? "text-right" : ""}>
          <div
            className={
              m.role === "user"
                ? "inline-block rounded-xl bg-foreground px-4 py-2 text-sm text-background"
                : "prose prose-sm dark:prose-invert max-w-none"
            }
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\\w+)/.exec(className || "")
                  return !inline && match ? (
                    <SyntaxHighlighter language={match[1]} PreTag="div" {...props}>
                      {String(children).replace(/\\n$/, "")}
                    </SyntaxHighlighter>
                  ) : (
                    <code className="rounded bg-muted px-1 py-0.5 font-mono text-sm" {...props}>
                      {children}
                    </code>
                  )
                },
              }}
            >
              {m.content}
            </ReactMarkdown>
          </div>
        </div>
      ))}

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Ask something…"
          className="flex-1 rounded-lg border border-border/60 bg-muted/20 px-3 py-2 text-sm outline-none"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background disabled:opacity-40"
        >
          Send
        </button>
      </form>
    </div>
  )
}`,
      },
      {
        name: "app/api/chat/route.ts",
        code: `import { streamText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = streamText({
    model: openai("gpt-4o"),
    system: "You are a helpful assistant. Format responses with markdown — use headings, code blocks with language tags, bold/italic, and lists where appropriate.",
    messages,
  })

  return result.toDataStreamResponse()
}`,
      },
    ],
  },

  "voice-input-button": {
    files: [
      {
        name: "voice-input.tsx",
        code: `"use client"

import { useState, useRef } from "react"
import { Mic, Square, Loader2, Check } from "lucide-react"
import { cn } from "@/lib/utils"

type State = "idle" | "listening" | "processing" | "done"

export function VoiceInput({
  onTranscript,
}: {
  onTranscript: (text: string) => void
}) {
  const [state, setState] = useState<State>("idle")
  const mediaRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  async function startRecording() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    const recorder = new MediaRecorder(stream)
    mediaRef.current = recorder
    chunksRef.current = []

    recorder.ondataavailable = (e) => chunksRef.current.push(e.data)
    recorder.onstop = async () => {
      setState("processing")
      const blob = new Blob(chunksRef.current, { type: "audio/webm" })
      const form = new FormData()
      form.append("audio", blob, "recording.webm")

      const res = await fetch("/api/transcribe", { method: "POST", body: form })
      const { text } = await res.json()
      onTranscript(text)
      setState("done")
      setTimeout(() => setState("idle"), 2000)
    }

    recorder.start()
    setState("listening")
  }

  function stopRecording() {
    mediaRef.current?.stop()
    mediaRef.current?.stream.getTracks().forEach((t) => t.stop())
  }

  return (
    <button
      onClick={state === "listening" ? stopRecording : startRecording}
      className={cn(
        "flex size-14 items-center justify-center rounded-full border-2 transition-all",
        state === "idle" && "border-border hover:border-foreground/40",
        state === "listening" && "border-foreground bg-foreground",
        state === "processing" && "border-border/40 bg-muted/30",
        state === "done" && "border-green-500/60 bg-green-500/10",
      )}
    >
      {state === "idle" && <Mic className="size-6" />}
      {state === "listening" && <Square className="size-5 text-background" />}
      {state === "processing" && <Loader2 className="size-5 animate-spin text-muted-foreground" />}
      {state === "done" && <Check className="size-6 text-green-500" />}
    </button>
  )
}`,
      },
      {
        name: "app/api/transcribe/route.ts",
        code: `import { transcribe } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(req: Request) {
  const form = await req.formData()
  const audio = form.get("audio") as File

  const { text } = await transcribe({
    model: openai.transcription("whisper-1"),
    audio,
  })

  return Response.json({ text })
}`,
      },
    ],
  },

  "model-selector": {
    files: [
      {
        name: "model-selector.tsx",
        code: `"use client"

import { useState } from "react"
import { Check, ChevronDown, Search } from "lucide-react"
import { cn } from "@/lib/utils"

const PROVIDERS = [
  {
    group: "Anthropic",
    color: "bg-orange-400",
    models: [
      { id: "claude-sonnet-4-5", name: "Claude Sonnet 4.5" },
      { id: "claude-haiku-4-5", name: "Claude Haiku 4.5" },
      { id: "claude-opus-4-5", name: "Claude Opus 4.5" },
    ],
  },
  {
    group: "OpenAI",
    color: "bg-emerald-400",
    models: [
      { id: "gpt-4o", name: "GPT-4o" },
      { id: "gpt-4o-mini", name: "GPT-4o mini" },
      { id: "o3-mini", name: "o3-mini" },
    ],
  },
  {
    group: "Google",
    color: "bg-blue-400",
    models: [
      { id: "gemini-2.0-flash", name: "Gemini 2.0 Flash" },
      { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro" },
    ],
  },
]

export function ModelSelector({
  value,
  onChange,
}: {
  value: string
  onChange: (id: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")

  const selected = PROVIDERS.flatMap((g) => g.models).find((m) => m.id === value)
  const selectedGroup = PROVIDERS.find((g) => g.models.some((m) => m.id === value))

  const filtered = PROVIDERS.map((g) => ({
    ...g,
    models: g.models.filter((m) =>
      m.name.toLowerCase().includes(search.toLowerCase()),
    ),
  })).filter((g) => g.models.length > 0)

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-lg border border-border/60 bg-muted/20 px-3 py-2 text-sm transition-colors hover:border-foreground/20"
      >
        <span className={cn("size-2 rounded-full", selectedGroup?.color ?? "bg-muted")} />
        <span>{selected?.name ?? "Select model"}</span>
        <ChevronDown className={cn("size-3.5 text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 w-64 overflow-hidden rounded-lg border border-border/60 bg-background shadow-lg">
          <div className="border-b border-border/30 px-3 py-2">
            <div className="flex items-center gap-2">
              <Search className="size-3.5 text-muted-foreground/50" />
              <input
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search models…"
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/40"
              />
            </div>
          </div>

          <div className="max-h-60 overflow-y-auto py-1">
            {filtered.map((g) => (
              <div key={g.group}>
                <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/40">
                  {g.group}
                </p>
                {g.models.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => { onChange(m.id); setOpen(false); setSearch("") }}
                    className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm transition-colors hover:bg-muted/40"
                  >
                    <span className={cn("size-1.5 rounded-full", g.color)} />
                    {m.name}
                    {value === m.id && <Check className="ml-auto size-3.5" />}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}`,
      },
    ],
  },

  "prompt-suggestion-pills": {
    files: [
      {
        name: "prompt-suggestions.tsx",
        code: `"use client"

import { motion } from "motion/react"
import { cn } from "@/lib/utils"

const SUGGESTIONS = [
  { icon: "⬡", label: "Understand code", text: "Explain this codebase to me" },
  { icon: "⚡", label: "Write tests", text: "Write unit tests for my API routes" },
  { icon: "⬢", label: "Find bugs", text: "Find security vulnerabilities" },
  { icon: "✦", label: "Refactor", text: "Refactor this component to use hooks" },
]

export function PromptSuggestions({
  onSelect,
}: {
  onSelect: (text: string) => void
}) {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-6 py-12">
      <div className="text-center">
        <h2 className="text-xl font-semibold tracking-tight">What can I help you build?</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Select a suggestion or type your own below
        </p>
      </div>

      <div className="grid w-full grid-cols-2 gap-2">
        {SUGGESTIONS.map((s, i) => (
          <motion.button
            key={s.text}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            onClick={() => onSelect(s.text)}
            className="flex flex-col items-start rounded-xl border border-border/40 p-4 text-left transition-all hover:border-foreground/20 hover:bg-muted/30"
          >
            <span className="text-xl">{s.icon}</span>
            <span className="mt-2 text-sm font-medium leading-snug">{s.text}</span>
            <span className="mt-0.5 text-xs text-muted-foreground/50">{s.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  )
}`,
      },
    ],
  },

  "token-counter": {
    files: [
      {
        name: "token-counter.tsx",
        code: `"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

const MODEL_LIMITS: Record<string, number> = {
  "claude-sonnet-4-5": 200000,
  "gpt-4o": 128000,
  "gemini-1.5-pro": 1000000,
}

// Rough estimate: 1 token ≈ 4 chars for English
function estimateTokens(text: string) {
  return Math.round(text.length / 4)
}

export function TokenCounter({
  model = "gpt-4o",
  value,
  onChange,
}: {
  model?: string
  value: string
  onChange: (v: string) => void
}) {
  const limit = MODEL_LIMITS[model] ?? 128000
  const tokens = estimateTokens(value)
  const pct = Math.min((tokens / limit) * 100, 100)

  const R = 18
  const circ = 2 * Math.PI * R
  const dash = (pct / 100) * circ

  const color =
    pct < 50 ? "text-emerald-500 stroke-emerald-500"
    : pct < 80 ? "text-amber-500 stroke-amber-500"
    : "text-red-500 stroke-red-500"

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">Context window</span>
        <div className="flex items-center gap-2">
          <svg width="32" height="32" className="-rotate-90">
            <circle cx="16" cy="16" r={R} className="stroke-border/40" strokeWidth="3" fill="none" />
            <circle
              cx="16" cy="16" r={R}
              className={color.split(" ")[1]}
              strokeWidth="3" fill="none"
              strokeDasharray={\`\${dash} \${circ}\`}
              strokeLinecap="round"
              style={{ transition: "stroke-dasharray 0.2s ease" }}
            />
          </svg>
          <span className={cn("font-mono text-xs", color.split(" ")[0])}>
            {tokens.toLocaleString()} / {(limit / 1000).toFixed(0)}k
          </span>
        </div>
      </div>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type your prompt…"
        className="h-32 w-full resize-none rounded-lg border border-border/40 bg-muted/20 p-3 text-sm outline-none placeholder:text-muted-foreground/30"
      />
    </div>
  )
}`,
      },
    ],
  },

  "ai-loading-states": {
    files: [
      {
        name: "loading-states.tsx",
        code: `"use client"

/* Wave dots — ellipse pattern */
const ELLIPSE = [3, 5, 7, 5, 3]

export function WaveDots() {
  return (
    <div className="flex flex-col items-center gap-[3px]">
      {ELLIPSE.map((count, row) => (
        <div key={row} className="flex gap-[3px]">
          {Array.from({ length: count }).map((_, col) => (
            <div
              key={col}
              className="size-[3px] rounded-full bg-foreground"
              style={{
                animation: "wave 1.4s ease-in-out infinite",
                animationDelay: \`\${col * 0.08 + row * 0.05}s\`,
              }}
            />
          ))}
        </div>
      ))}
      <style>{\`@keyframes wave{0%,100%{transform:scaleY(.3);opacity:.3}50%{transform:scaleY(1);opacity:1}}\`}</style>
    </div>
  )
}

/* Pulsing orb */
export function PulsingOrb() {
  return (
    <div className="relative flex size-10 items-center justify-center">
      <div className="absolute inset-0 animate-ping rounded-full bg-foreground/10" />
      <div className="size-5 animate-pulse rounded-full bg-foreground/80" />
    </div>
  )
}

/* Shimmer skeleton */
export function ShimmerSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="relative h-3 overflow-hidden rounded-full bg-muted/60"
          style={{ width: \`\${[100, 75, 88][i % 3]}%\` }}
        >
          <div
            className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-foreground/10 to-transparent"
            style={{ animation: "shimmer 1.6s ease-in-out infinite" }}
          />
        </div>
      ))}
      <style>{\`@keyframes shimmer{0%{transform:translateX(-100%) skewX(-12deg)}100%{transform:translateX(200%) skewX(-12deg)}}\`}</style>
    </div>
  )
}

/* Typing indicator */
export function TypingIndicator() {
  return (
    <div className="flex items-end gap-1.5 rounded-xl bg-muted/40 px-4 py-3 w-fit">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="size-2 rounded-full bg-foreground/60"
          style={{ animation: \`wave 1s ease-in-out \${i * 0.15}s infinite alternate\` }}
        />
      ))}
    </div>
  )
}`,
      },
    ],
  },

  "structured-output-viewer": {
    files: [
      {
        name: "structured-output-viewer.tsx",
        code: `"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

type JSONValue = string | number | boolean | null | JSONValue[] | { [k: string]: JSONValue }

function JSONNode({
  label,
  value,
  depth = 0,
}: {
  label?: string
  value: JSONValue
  depth?: number
}) {
  const [open, setOpen] = useState(depth < 2)

  const isObj = typeof value === "object" && value !== null && !Array.isArray(value)
  const isArr = Array.isArray(value)

  if (isObj) {
    const entries = Object.entries(value as Record<string, JSONValue>)
    return (
      <div>
        <button onClick={() => setOpen((o) => !o)} className="flex items-center gap-1 font-mono text-xs hover:text-foreground">
          <span className="text-muted-foreground/40">{open ? "▾" : "▸"}</span>
          {label && <><span className="text-sky-500">{label}</span><span className="text-foreground/40">:</span></>}
          {!open && <span className="text-muted-foreground/40">{"{"}{entries.length}{"}"}</span>}
        </button>
        {open && (
          <div className="ml-4 border-l border-border/30 pl-3">
            {entries.map(([k, v]) => <JSONNode key={k} label={k} value={v} depth={depth + 1} />)}
          </div>
        )}
      </div>
    )
  }

  if (isArr) {
    return (
      <div>
        <button onClick={() => setOpen((o) => !o)} className="flex items-center gap-1 font-mono text-xs hover:text-foreground">
          <span className="text-muted-foreground/40">{open ? "▾" : "▸"}</span>
          {label && <><span className="text-sky-500">{label}</span><span className="text-foreground/40">:</span></>}
          {!open && <span className="text-muted-foreground/40">[{(value as JSONValue[]).length}]</span>}
        </button>
        {open && (
          <div className="ml-4 border-l border-border/30 pl-3">
            {(value as JSONValue[]).map((v, i) => <JSONNode key={i} label={String(i)} value={v} depth={depth + 1} />)}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex gap-1 font-mono text-xs">
      {label && <><span className="text-sky-500">{label}</span><span className="text-foreground/40">:</span></>}
      {typeof value === "string" && <span className="text-amber-500">"{value}"</span>}
      {typeof value === "number" && <span className="text-emerald-500">{value}</span>}
      {typeof value === "boolean" && <span className="text-violet-400">{String(value)}</span>}
      {value === null && <span className="text-muted-foreground">null</span>}
    </div>
  )
}

export function StructuredOutputViewer({ data }: { data: JSONValue }) {
  return (
    <div className="rounded-lg border border-border/40 bg-muted/20 p-4">
      <JSONNode value={data} />
    </div>
  )
}`,
      },
      {
        name: "app/api/extract/route.ts",
        code: `import { generateObject } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"

const schema = z.object({
  title: z.string(),
  salary: z.object({ min: z.number(), max: z.number(), currency: z.string() }),
  skills: z.array(z.string()),
  metadata: z.object({ source: z.string(), confidence: z.number() }),
})

export async function POST(req: Request) {
  const { text } = await req.json()

  const { object } = await generateObject({
    model: openai("gpt-4o"),
    schema,
    prompt: \`Extract structured job posting data from: \${text}\`,
  })

  return Response.json(object)
}`,
      },
    ],
  },

  "ai-image-output": {
    files: [
      {
        name: "ai-image-output.tsx",
        code: `"use client"

import { useState } from "react"
import { Download, RefreshCw } from "lucide-react"

export function AIImageOutput() {
  const [prompt, setPrompt] = useState("")
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [elapsed, setElapsed] = useState(0)

  async function generate() {
    if (!prompt.trim() || loading) return
    setLoading(true)
    setImageUrl(null)
    setElapsed(0)

    const start = Date.now()
    const timer = setInterval(() => setElapsed((Date.now() - start) / 1000), 100)

    const res = await fetch("/api/generate-image", {
      method: "POST",
      body: JSON.stringify({ prompt }),
      headers: { "Content-Type": "application/json" },
    })
    const { url } = await res.json()
    clearInterval(timer)
    setElapsed((Date.now() - start) / 1000)
    setImageUrl(url)
    setLoading(false)
  }

  return (
    <div className="mx-auto max-w-sm space-y-4 p-6">
      <div className="flex gap-2">
        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && generate()}
          placeholder="Describe an image…"
          className="flex-1 rounded-lg border border-border/40 bg-muted/20 px-3 py-2 text-sm outline-none"
        />
        <button
          onClick={generate}
          disabled={loading || !prompt.trim()}
          className="rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background disabled:opacity-40"
        >
          {loading ? <RefreshCw className="size-4 animate-spin" /> : "Generate"}
        </button>
      </div>

      <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-border/40 bg-muted/20">
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <div className="size-8 animate-spin rounded-full border-2 border-foreground/20 border-t-foreground" />
            <span className="text-xs text-muted-foreground">{elapsed.toFixed(1)}s</span>
          </div>
        )}
        {imageUrl && (
          <>
            <img src={imageUrl} alt={prompt} className="h-full w-full object-cover" />
            <div className="absolute bottom-3 right-3">
              <a
                href={imageUrl}
                download="generated.png"
                className="flex items-center gap-1.5 rounded-full bg-background/70 px-3 py-1.5 text-xs font-medium backdrop-blur-sm"
              >
                <Download className="size-3" /> Save
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  )
}`,
      },
      {
        name: "app/api/generate-image/route.ts",
        code: `import { generateImage } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(req: Request) {
  const { prompt } = await req.json()

  const { image } = await generateImage({
    model: openai.image("dall-e-3"),
    prompt,
    size: "1024x1024",
    quality: "standard",
  })

  return Response.json({ url: image.url })
}`,
      },
    ],
  },

  "artifact-canvas": {
    files: [
      {
        name: "artifact-canvas.tsx",
        code: `"use client"

import { useChat } from "@ai-sdk/react"
import { useState } from "react"
import { cn } from "@/lib/utils"

export function ArtifactCanvas() {
  const [tab, setTab] = useState<"code" | "preview">("code")
  const [artifact, setArtifact] = useState<{ code: string; lang: string } | null>(null)

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/artifact",
    onFinish(message) {
      // Parse code block from assistant response
      const match = message.content.match(/\`\`\`(\\w+)?\\n([\\s\\S]*?)\`\`\`/)
      if (match) setArtifact({ lang: match[1] ?? "tsx", code: match[2] })
    },
  })

  return (
    <div className="flex h-screen">
      {/* Chat panel */}
      <div className="flex w-80 shrink-0 flex-col border-r border-border/40">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m) => (
            <div key={m.id} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
              <div
                className={cn(
                  "max-w-[85%] rounded-xl px-3 py-2 text-sm",
                  m.role === "user"
                    ? "bg-foreground text-background rounded-br-sm"
                    : "bg-muted/50 rounded-bl-sm",
                )}
              >
                {m.role === "user" ? m.content : m.content.replace(/\`\`\`[\\s\\S]*?\`\`\`/g, "✦ Generated artifact")}
              </div>
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="border-t border-border/40 p-3">
          <div className="flex gap-2 rounded-lg border border-border/40 bg-muted/20 px-3 py-2">
            <input
              value={input}
              onChange={handleInputChange}
              placeholder="Ask Claude to build…"
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/40"
            />
            <button type="submit" disabled={isLoading} className="text-xs font-medium text-foreground/60 hover:text-foreground disabled:opacity-40">
              Send
            </button>
          </div>
        </form>
      </div>

      {/* Artifact panel */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex items-center gap-0 border-b border-border/40 px-2">
          {(["code", "preview"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "px-4 py-2.5 text-sm font-medium capitalize transition-colors",
                tab === t ? "border-b-2 border-foreground text-foreground" : "text-muted-foreground",
              )}
            >
              {t}
            </button>
          ))}
          {isLoading && (
            <span className="ml-auto flex items-center gap-1.5 pr-3 text-xs text-muted-foreground">
              <span className="size-1.5 animate-pulse rounded-full bg-orange-400" />
              Generating…
            </span>
          )}
        </div>

        <div className="flex-1 overflow-auto p-4">
          {tab === "code" && artifact && (
            <pre className="font-mono text-xs leading-relaxed text-foreground/80">
              {artifact.code}
            </pre>
          )}
          {tab === "preview" && (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground/40">
              Sandboxed preview here
            </div>
          )}
          {!artifact && !isLoading && (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground/30">
              Ask Claude to build a component
            </div>
          )}
        </div>
      </div>
    </div>
  )
}`,
      },
      {
        name: "app/api/artifact/route.ts",
        code: `import { streamText } from "ai"
import { anthropic } from "@ai-sdk/anthropic"

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = streamText({
    model: anthropic("claude-sonnet-4-6"),
    system: \`You are an expert React developer. When asked to build a component:
1. Write clean, production-ready TypeScript/React code
2. Use Tailwind CSS for styling
3. Return ONLY a single fenced code block with the complete component
4. Include a brief one-sentence description before the code block\`,
    messages,
  })

  return result.toDataStreamResponse()
}`,
      },
    ],
  },

}
