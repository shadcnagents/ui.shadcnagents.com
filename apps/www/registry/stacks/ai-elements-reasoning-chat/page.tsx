"use client"

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
}