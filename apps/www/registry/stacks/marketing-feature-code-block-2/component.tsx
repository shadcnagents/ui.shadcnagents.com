export function FeatureCodeBlockSplit() {
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
{`"use server"
import { streamText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function chat(messages) {
  const result = streamText({
    model: openai("gpt-4o"),
    messages,
  })
  return result.toDataStreamResponse()
}`}
            </pre>
          </div>
          <div className="overflow-hidden rounded-lg border">
            <div className="border-b bg-muted/30 px-4 py-2">
              <span className="text-xs text-muted-foreground">page.tsx</span>
            </div>
            <pre className="p-4 text-xs">
{`"use client"
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
}`}
            </pre>
          </div>
        </div>
      </div>
    </section>
  )
}