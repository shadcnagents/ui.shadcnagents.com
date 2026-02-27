"use client"

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
                            style={{ height: `${(v / max) * 100}%` }}
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
}