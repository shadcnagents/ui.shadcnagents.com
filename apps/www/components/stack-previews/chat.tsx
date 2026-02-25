"use client"

import { useEffect, useRef, useState } from "react"

/* ─── Basic Chat ─── */
export function BasicChatPreview() {
  const [messages, setMessages] = useState([
    { role: "assistant" as const, content: "Hello! How can I help you today?" },
  ])
  const [input, setInput] = useState("")
  const bottomRef = useRef<HTMLDivElement>(null)

  function handleSend() {
    if (!input.trim()) return
    const userMsg = input
    setMessages((prev) => [...prev, { role: "user" as const, content: userMsg }])
    setInput("")
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant" as const,
          content:
            "That's a great question. Let me help you with that. The key concept here is to break down the problem into smaller, manageable pieces and address each one systematically.",
        },
      ])
    }, 1000)
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <div className="mx-auto flex h-[420px] w-full max-w-lg flex-col">
      <div className="flex-1 space-y-4 overflow-y-auto p-6 [&::-webkit-scrollbar]:hidden">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                msg.role === "user"
                  ? "bg-foreground text-background"
                  : "bg-muted/50 text-foreground"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div className="border-t border-border/40 p-4">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type a message..."
            className="h-9 flex-1 rounded-md border border-border/60 bg-transparent px-3 text-sm outline-none placeholder:text-muted-foreground/40 focus:border-foreground/20"
          />
          <button
            onClick={handleSend}
            className="h-9 rounded-md bg-foreground px-4 text-xs font-medium text-background"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─── Reasoning Display ─── */
export function ReasoningChatPreview() {
  const [showThinking, setShowThinking] = useState(true)

  return (
    <div className="mx-auto w-full max-w-lg space-y-4 p-6">
      {/* User message */}
      <div className="flex justify-end">
        <div className="rounded-lg bg-foreground px-3 py-2 text-sm text-background">
          What is the square root of 144?
        </div>
      </div>

      {/* Assistant with reasoning */}
      <div className="space-y-2">
        <button
          onClick={() => setShowThinking(!showThinking)}
          className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground/40 transition-colors hover:text-muted-foreground"
        >
          <svg
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className={`transition-transform ${showThinking ? "" : "-rotate-90"}`}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
          Thinking
          <span className="font-normal text-muted-foreground/30">324ms</span>
        </button>

        {showThinking && (
          <div className="border-l-2 border-border/30 pl-3">
            <p className="text-xs leading-relaxed text-muted-foreground/60">
              The user is asking for the square root of 144. I need to find a
              number that, when multiplied by itself, equals 144. I know that
              12 × 12 = 144, so the square root of 144 is 12. Let me verify:
              12² = 144. Confirmed.
            </p>
          </div>
        )}

        <div className="rounded-lg bg-muted/50 px-3 py-2 text-sm text-foreground">
          The square root of 144 is <strong>12</strong>.
        </div>
      </div>
    </div>
  )
}

/* ─── Sources & Citations ─── */
export function SourcesChatPreview() {
  const sources = [
    { title: "Transformer Architecture", url: "arxiv.org", year: "2017" },
    { title: "Attention Is All You Need", url: "papers.nips.cc", year: "2017" },
    { title: "BERT: Pre-training", url: "arxiv.org", year: "2018" },
  ]

  return (
    <div className="mx-auto w-full max-w-lg space-y-4 p-6">
      <div className="flex justify-end">
        <div className="rounded-lg bg-foreground px-3 py-2 text-sm text-background">
          Explain the transformer architecture
        </div>
      </div>

      <div className="space-y-3">
        <div className="rounded-lg bg-muted/50 px-3 py-2 text-sm leading-relaxed text-foreground">
          The Transformer architecture, introduced in 2017, revolutionized NLP by
          replacing recurrence with self-attention mechanisms
          <sup className="ml-0.5 text-[10px] text-muted-foreground">[1]</sup>.
          The key innovation is the multi-head attention mechanism that allows the
          model to attend to different positions simultaneously
          <sup className="ml-0.5 text-[10px] text-muted-foreground">[2]</sup>.
          This approach was later extended by models like BERT
          <sup className="ml-0.5 text-[10px] text-muted-foreground">[3]</sup>.
        </div>

        <div className="space-y-1.5">
          <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/40">
            Sources
          </span>
          {sources.map((source, i) => (
            <div
              key={i}
              className="flex items-center gap-2 rounded-md border border-border/40 px-3 py-2"
            >
              <span className="flex size-5 shrink-0 items-center justify-center rounded bg-muted text-[10px] font-medium text-muted-foreground">
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium text-foreground">
                  {source.title}
                </p>
                <p className="text-[10px] text-muted-foreground/50">
                  {source.url} · {source.year}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─── Plan Display ─── */
export function PlanDisplayPreview() {
  const [completedSteps, setCompletedSteps] = useState(2)

  const steps = [
    { title: "Analyze requirements", detail: "Parse user specifications" },
    { title: "Design schema", detail: "Create database models" },
    { title: "Generate migrations", detail: "SQL migration files" },
    { title: "Create API routes", detail: "REST endpoints" },
    { title: "Write tests", detail: "Unit and integration tests" },
  ]

  function toggleStep(i: number) {
    setCompletedSteps(i < completedSteps ? i : i + 1)
  }

  return (
    <div className="mx-auto w-full max-w-lg p-6">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-xs font-medium text-foreground">
          Execution Plan
        </span>
        <span className="text-[10px] text-muted-foreground/40">
          {completedSteps}/{steps.length} completed
        </span>
      </div>

      <div className="space-y-1">
        {steps.map((step, i) => {
          const done = i < completedSteps
          const current = i === completedSteps
          return (
            <button
              key={i}
              onClick={() => toggleStep(i)}
              className="flex w-full items-start gap-3 rounded-md px-3 py-2.5 text-left transition-colors hover:bg-muted/30"
            >
              <div className="mt-0.5 flex size-4 shrink-0 items-center justify-center">
                {done ? (
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    className="text-foreground"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <div
                    className={`size-3 rounded-full border ${
                      current
                        ? "border-foreground bg-foreground/10"
                        : "border-border"
                    }`}
                  />
                )}
              </div>
              <div>
                <p
                  className={`text-sm ${
                    done
                      ? "text-muted-foreground line-through"
                      : "font-medium text-foreground"
                  }`}
                >
                  {step.title}
                </p>
                <p className="text-[11px] text-muted-foreground/50">
                  {step.detail}
                </p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

/* ─── Tool Approval / Confirmation ─── */
export function ToolApprovalPreview() {
  const [status, setStatus] = useState<"pending" | "approved" | "denied">(
    "pending"
  )

  return (
    <div className="mx-auto w-full max-w-lg space-y-4 p-6">
      <div className="flex justify-end">
        <div className="rounded-lg bg-foreground px-3 py-2 text-sm text-background">
          Delete all inactive users from the database
        </div>
      </div>

      <div className="space-y-3">
        <div className="rounded-lg bg-muted/50 px-3 py-2 text-sm text-foreground">
          I need to run a destructive operation. Please confirm:
        </div>

        <div className="rounded-md border border-border/60 p-4">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex size-6 items-center justify-center rounded-md bg-muted">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <span className="text-xs font-medium">Confirmation Required</span>
          </div>

          <div className="mb-4 rounded-md bg-muted/30 p-3">
            <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/40">
              Action
            </p>
            <p className="mt-1 text-xs text-foreground">
              deleteUsers({`{ where: { lastActive: { lt: "2024-01-01" } } }`})
            </p>
            <p className="mt-2 text-[10px] text-muted-foreground/50">
              This will permanently remove 847 inactive user records
            </p>
          </div>

          {status === "pending" ? (
            <div className="flex gap-2">
              <button
                onClick={() => setStatus("approved")}
                className="h-7 flex-1 rounded-md bg-foreground text-xs font-medium text-background"
              >
                Approve
              </button>
              <button
                onClick={() => setStatus("denied")}
                className="h-7 flex-1 rounded-md border border-border/60 text-xs font-medium text-muted-foreground hover:text-foreground"
              >
                Deny
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-xs">
              {status === "approved" ? (
                <>
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span className="text-foreground">Approved</span>
                </>
              ) : (
                <>
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                  <span className="text-muted-foreground">Denied</span>
                </>
              )}
              <button
                onClick={() => setStatus("pending")}
                className="ml-auto text-[10px] text-muted-foreground/40 hover:text-muted-foreground"
              >
                Reset
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ─── Queue Display ─── */
export function QueueDisplayPreview() {
  const [tasks, setTasks] = useState([
    { id: 1, name: "Fetch user data", status: "done" as const },
    { id: 2, name: "Process analytics", status: "done" as const },
    { id: 3, name: "Generate report", status: "running" as const },
    { id: 4, name: "Send notifications", status: "queued" as const },
    { id: 5, name: "Update dashboard", status: "queued" as const },
  ])

  useEffect(() => {
    const timer = setInterval(() => {
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
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="mx-auto w-full max-w-lg p-6">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-xs font-medium text-foreground">Task Queue</span>
        <span className="text-[10px] text-muted-foreground/40">
          {tasks.filter((t) => t.status === "done").length}/{tasks.length}
        </span>
      </div>

      <div className="space-y-1">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center gap-3 rounded-md px-3 py-2"
          >
            <div className="flex size-4 shrink-0 items-center justify-center">
              {task.status === "done" && (
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  className="text-foreground/50"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
              {task.status === "running" && (
                <div className="size-3 animate-spin rounded-full border border-foreground/20 border-t-foreground" />
              )}
              {task.status === "queued" && (
                <div className="size-2 rounded-full bg-border" />
              )}
            </div>
            <span
              className={`text-sm ${
                task.status === "done"
                  ? "text-muted-foreground/50 line-through"
                  : task.status === "running"
                    ? "font-medium text-foreground"
                    : "text-muted-foreground"
              }`}
            >
              {task.name}
            </span>
            {task.status === "running" && (
              <span className="ml-auto text-[10px] text-muted-foreground/40">
                Processing...
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
