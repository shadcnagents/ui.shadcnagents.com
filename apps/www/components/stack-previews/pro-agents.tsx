"use client"

import { useEffect, useState } from "react"

/* ─── Orchestrator Pattern ─── */
export function OrchestratorPatternPreview() {
  const [active, setActive] = useState(0)
  const workers = [
    { name: "Research Agent", task: "Gathering sources", status: "done" },
    { name: "Writer Agent", task: "Drafting content", status: "running" },
    { name: "Editor Agent", task: "Reviewing quality", status: "pending" },
  ]

  useEffect(() => {
    const timer = setInterval(() => setActive((p) => (p + 1) % 4), 1800)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="mx-auto w-full max-w-lg p-8">
      <div className="mb-6 rounded-md border border-border bg-muted/50 px-4 py-3 text-center">
        <span className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Orchestrator
        </span>
        <p className="mt-1 text-sm text-muted-foreground">
          Delegates and coordinates sub-agents
        </p>
      </div>
      <div className="space-y-2">
        {workers.map((w, i) => {
          const isActive = i === Math.min(active, 2)
          const isDone = i < active
          return (
            <div
              key={w.name}
              className={`flex items-center justify-between rounded-md border px-4 py-3 transition-all ${
                isActive
                  ? "border-border bg-foreground/[0.03]"
                  : isDone
                    ? "border-foreground/15 bg-muted/40"
                    : "border-foreground/15"
              }`}
            >
              <div>
                <p className={`text-sm font-medium ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                  {w.name}
                </p>
                <p className="text-sm text-muted-foreground">{w.task}</p>
              </div>
              <span className="text-sm text-muted-foreground">
                {isDone ? "✓ Done" : isActive ? "Running…" : "Queued"}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ─── Sub-Agent Orchestrator ─── */
export function SubAgentOrchestratorPreview() {
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => setPhase((p) => (p + 1) % 4), 2000)
    return () => clearInterval(timer)
  }, [])

  const tree = [
    { name: "Main Agent", depth: 0, activeAt: 0 },
    { name: "├─ Sub-Agent A", depth: 1, activeAt: 1 },
    { name: "│  ├─ Worker A1", depth: 2, activeAt: 2 },
    { name: "│  └─ Worker A2", depth: 2, activeAt: 2 },
    { name: "└─ Sub-Agent B", depth: 1, activeAt: 3 },
    { name: "   └─ Worker B1", depth: 2, activeAt: 3 },
  ]

  return (
    <div className="mx-auto w-full max-w-lg p-8">
      <div className="mb-4">
        <span className="text-sm font-medium text-foreground">Nested Agent Tree</span>
        <p className="mt-1 text-sm text-muted-foreground">
          Hierarchical delegation with sub-agents
        </p>
      </div>
      <div className="rounded-md border border-border p-4">
        <div className="space-y-1 font-mono text-sm">
          {tree.map((node) => (
            <div
              key={node.name}
              className={`rounded px-2 py-1 transition-all ${
                phase >= node.activeAt
                  ? "bg-foreground/15 text-foreground"
                  : "text-muted-foreground/80"
              }`}
            >
              {node.name}
              {phase === node.activeAt && (
                <span className="ml-2 inline-block size-1.5 animate-pulse rounded-full bg-foreground/40" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─── Agent Tool Approval ─── */
export function AgentToolApprovalPreview() {
  const [decision, setDecision] = useState<"approved" | "denied" | null>(null)

  return (
    <div className="mx-auto w-full max-w-lg space-y-4 p-8">
      <div className="rounded-md border border-border p-4">
        <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Tool Call Request
        </p>
        <div className="mt-3 rounded-md bg-muted/50 p-3 font-mono text-sm text-foreground">
          <span className="text-muted-foreground">function:</span> deleteUserData()
          <br />
          <span className="text-muted-foreground">params:</span> {"{ userId: \"usr_123\" }"}
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          This action requires human approval before execution.
        </p>
      </div>

      {decision === null ? (
        <div className="flex gap-2">
          <button
            onClick={() => setDecision("approved")}
            className="h-8 flex-1 rounded-md bg-foreground text-sm font-medium text-background"
          >
            Approve
          </button>
          <button
            onClick={() => setDecision("denied")}
            className="h-8 flex-1 rounded-md border border-border text-sm font-medium text-muted-foreground"
          >
            Deny
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between rounded-md border border-border p-3">
          <span className="text-sm text-foreground">
            {decision === "approved" ? "✓ Approved — executing" : "✕ Denied — skipped"}
          </span>
          <button
            onClick={() => setDecision(null)}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Reset
          </button>
        </div>
      )}
    </div>
  )
}

/* ─── Evaluator Optimizer ─── */
export function EvaluatorOptimizerPreview() {
  const [iteration, setIteration] = useState(0)
  const scores = [0.42, 0.67, 0.85, 0.93]

  useEffect(() => {
    const timer = setInterval(() => {
      setIteration((p) => (p < scores.length - 1 ? p + 1 : p))
    }, 1500)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="mx-auto w-full max-w-lg p-8">
      <div className="mb-4">
        <span className="text-sm font-medium text-foreground">Evaluate → Optimize Loop</span>
        <p className="mt-1 text-sm text-muted-foreground">
          Iteratively improving output quality
        </p>
      </div>
      <div className="space-y-2">
        {scores.slice(0, iteration + 1).map((score, i) => (
          <div
            key={i}
            className={`flex items-center justify-between rounded-md border px-4 py-2.5 transition-all ${
              i === iteration ? "border-border bg-foreground/[0.03]" : "border-foreground/15"
            }`}
          >
            <span className="text-sm text-muted-foreground">Iteration {i + 1}</span>
            <div className="flex items-center gap-3">
              <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-foreground/100 transition-all duration-500"
                  style={{ width: `${score * 100}%` }}
                />
              </div>
              <span className="w-10 text-right font-mono text-sm text-foreground">
                {score.toFixed(2)}
              </span>
            </div>
          </div>
        ))}
      </div>
      {iteration >= scores.length - 1 && (
        <p className="mt-3 text-center text-sm text-muted-foreground">
          ✓ Quality threshold reached
        </p>
      )}
    </div>
  )
}

/* ─── Multi-Step Tool ─── */
export function MultiStepToolPreview() {
  const [step, setStep] = useState(0)
  const steps = [
    { tool: "search()", result: "Found 12 results" },
    { tool: "extract()", result: "Parsed 3 documents" },
    { tool: "summarize()", result: "Generated summary" },
    { tool: "format()", result: "Formatted output" },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((p) => (p < steps.length ? p + 1 : p))
    }, 1200)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="mx-auto w-full max-w-lg p-8">
      <div className="mb-4">
        <span className="text-sm font-medium text-foreground">Sequential Tool Chain</span>
      </div>
      <div className="space-y-1">
        {steps.map((s, i) => (
          <div key={s.tool} className="flex items-center gap-3">
            <div className="flex size-5 shrink-0 items-center justify-center">
              {i < step ? (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-foreground/80">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : i === step ? (
                <div className="size-3 animate-spin rounded-full border border-border border-t-foreground" />
              ) : (
                <div className="size-2 rounded-full bg-foreground/15" />
              )}
            </div>
            <div
              className={`flex-1 rounded-md px-3 py-2 transition-opacity ${
                i <= step ? "opacity-100" : "opacity-50"
              }`}
            >
              <span className="font-mono text-sm text-foreground">{s.tool}</span>
              {i < step && (
                <span className="ml-2 text-sm text-muted-foreground">→ {s.result}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── Agentic Context Builder ─── */
export function AgenticContextBuilderPreview() {
  const [step, setStep] = useState(0)
  const questions = [
    { q: "What is your project about?", a: "An AI-powered dashboard" },
    { q: "Who is the target audience?", a: "Product managers" },
    { q: "What features are most important?", a: "Real-time analytics" },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((p) => (p < questions.length ? p + 1 : p))
    }, 2000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="mx-auto w-full max-w-lg p-8">
      <div className="mb-4">
        <span className="text-sm font-medium text-foreground">Context Builder</span>
        <p className="mt-1 text-sm text-muted-foreground">
          Multi-step context gathering from user
        </p>
      </div>
      <div className="space-y-3">
        {questions.map((item, i) => (
          <div
            key={item.q}
            className={`rounded-md border px-4 py-3 transition-all ${
              i < step ? "border-foreground/15 bg-muted/40" : i === step ? "border-border" : "border-foreground/15 opacity-40"
            }`}
          >
            <p className="text-sm font-medium text-foreground">{item.q}</p>
            {i < step && (
              <p className="mt-1 text-sm text-muted-foreground">→ {item.a}</p>
            )}
            {i === step && (
              <div className="mt-2 h-7 w-full rounded border border-foreground/15 bg-muted/40" />
            )}
          </div>
        ))}
      </div>
      {step >= questions.length && (
        <div className="mt-4 rounded-md border border-border bg-muted/50 p-3 text-center text-sm text-muted-foreground">
          ✓ Context complete — generating response
        </div>
      )}
    </div>
  )
}

/* ─── Inquire Multiple Choice ─── */
export function InquireMultipleChoicePreview() {
  const [selected, setSelected] = useState<Set<number>>(new Set())
  const options = [
    "Authentication & Authorization",
    "Real-time Data Sync",
    "File Upload & Storage",
    "Payment Processing",
  ]

  return (
    <div className="mx-auto w-full max-w-lg p-8">
      <div className="mb-4">
        <span className="text-sm font-medium text-foreground">
          Which features do you need?
        </span>
        <p className="mt-1 text-sm text-muted-foreground">Select all that apply</p>
      </div>
      <div className="space-y-2">
        {options.map((opt, i) => (
          <button
            key={opt}
            onClick={() => {
              const next = new Set(selected)
              next.has(i) ? next.delete(i) : next.add(i)
              setSelected(next)
            }}
            className={`flex w-full items-center gap-3 rounded-md border px-4 py-2.5 text-left text-sm transition-all ${
              selected.has(i)
                ? "border-border bg-foreground/[0.03] text-foreground"
                : "border-border text-muted-foreground hover:border-border"
            }`}
          >
            <div
              className={`flex size-4 shrink-0 items-center justify-center rounded border ${
                selected.has(i) ? "border-foreground bg-foreground" : "border-border"
              }`}
            >
              {selected.has(i) && (
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </div>
            {opt}
          </button>
        ))}
      </div>
      {selected.size > 0 && (
        <p className="mt-3 text-center text-sm text-muted-foreground">
          {selected.size} selected
        </p>
      )}
    </div>
  )
}

/* ─── Inquire Text ─── */
export function InquireTextPreview() {
  const [submitted, setSubmitted] = useState(false)

  return (
    <div className="mx-auto w-full max-w-lg p-8">
      <div className="mb-4">
        <span className="text-sm font-medium text-foreground">
          Describe your use case
        </span>
        <p className="mt-1 text-sm text-muted-foreground">
          The agent needs more context to proceed
        </p>
      </div>
      {!submitted ? (
        <div className="space-y-3">
          <textarea
            placeholder="I want to build a dashboard that..."
            className="h-24 w-full rounded-md border border-border bg-transparent p-3 text-sm outline-none placeholder:text-muted-foreground/80 focus:border-foreground/50"
          />
          <button
            onClick={() => setSubmitted(true)}
            className="h-8 w-full rounded-md bg-foreground text-sm font-medium text-background"
          >
            Submit
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="rounded-md border border-border bg-muted/50 p-4">
            <p className="text-sm font-medium text-muted-foreground">Agent Response</p>
            <p className="mt-2 text-sm text-foreground">
              Based on your description, I recommend starting with a Next.js template
              with real-time data integration. Let me set that up for you.
            </p>
          </div>
          <button
            onClick={() => setSubmitted(false)}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Reset
          </button>
        </div>
      )}
    </div>
  )
}
