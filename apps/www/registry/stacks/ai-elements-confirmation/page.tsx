"use client"

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
}