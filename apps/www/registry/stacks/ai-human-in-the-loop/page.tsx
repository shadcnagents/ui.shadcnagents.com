"use client"

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
}