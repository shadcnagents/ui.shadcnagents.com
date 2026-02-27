"use client"

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
}