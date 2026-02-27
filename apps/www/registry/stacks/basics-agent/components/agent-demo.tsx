"use client"

import { useState } from "react"

interface StepToolCall {
  toolName: string
  args: Record<string, unknown>
}

interface AgentStep {
  toolCalls?: StepToolCall[]
}

interface AgentResult {
  text: string
  stepCount: number
  steps: AgentStep[]
}

export function AgentDemo() {
  const [prompt, setPrompt] = useState(
    "Research the current state of AI agents and give me a concise summary."
  )
  const [result, setResult] = useState<AgentResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!prompt.trim() || loading) return

    setLoading(true)
    setResult(null)
    setError(null)

    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim() }),
      })
      if (!res.ok) throw new Error(await res.text())
      setResult(await res.json())
    } catch (err) {
      setError(err instanceof Error ? err.message : "Agent failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-lg space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Agent Loop</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Multi-step agent with up to 5 tool-calling iterations.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={3}
          className="w-full resize-none rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground/60 focus-visible:ring-2 focus-visible:ring-ring"
        />
        <button
          type="submit"
          disabled={loading || !prompt.trim()}
          className="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="size-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Running agent…
            </span>
          ) : (
            "Run Agent"
          )}
        </button>
      </form>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2.5">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {result && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/50">
              Execution Trace
            </p>
            <span className="rounded-full bg-muted px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
              {result.stepCount} steps
            </span>
          </div>

          <div className="space-y-2">
            {result.steps.map((step, i) => (
              <div key={i} className="rounded-lg border bg-muted/20 p-3">
                <p className="mb-1.5 text-[11px] font-semibold text-muted-foreground/50">
                  Step {i + 1}
                </p>
                {step.toolCalls?.map((tc, j) => (
                  <div key={j} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="rounded bg-foreground/10 px-1.5 py-0.5 font-mono font-medium text-foreground/70">
                      {tc.toolName}
                    </span>
                    <span className="truncate text-muted-foreground/60">
                      {JSON.stringify(tc.args)}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="rounded-lg border bg-muted/40 px-4 py-3">
            <p className="mb-2 text-[13px] font-medium text-muted-foreground/60">Final Response</p>
            <p className="text-sm leading-relaxed text-foreground/85">{result.text}</p>
          </div>
        </div>
      )}
    </div>
  )
}
