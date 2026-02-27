"use client"

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
}