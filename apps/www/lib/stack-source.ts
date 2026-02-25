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

}
