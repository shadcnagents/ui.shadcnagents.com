"use client"

import { useState } from "react"

interface ToolCall {
  toolName: string
  args: Record<string, unknown>
  result?: Record<string, unknown>
}

interface ToolResult {
  text: string
  toolCalls: ToolCall[]
}

export function ToolCallDemo() {
  const [prompt, setPrompt] = useState("What's the weather like in Tokyo and Paris?")
  const [result, setResult] = useState<ToolResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!prompt.trim() || loading) return

    setLoading(true)
    setResult(null)
    setError(null)

    try {
      const res = await fetch("/api/tool-call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim() }),
      })
      if (!res.ok) throw new Error(await res.text())
      setResult(await res.json())
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-lg space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Tool Calling</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          The model invokes type-safe tools and returns structured results.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="What's the weather in Tokyo?"
          className="flex-1 rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground/60 focus-visible:ring-2 focus-visible:ring-ring"
        />
        <button
          type="submit"
          disabled={loading || !prompt.trim()}
          className="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <svg className="size-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            "Run"
          )}
        </button>
      </form>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2.5">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {result && (
        <div className="space-y-3">
          {result.toolCalls.length > 0 && (
            <div className="space-y-2">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/50">
                Tool Calls ({result.toolCalls.length})
              </p>
              {result.toolCalls.map((call, i) => (
                <div key={i} className="rounded-lg border bg-muted/30 p-3">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="rounded bg-foreground/10 px-1.5 py-0.5 font-mono text-[11px] font-medium">
                      {call.toolName}
                    </span>
                  </div>
                  <pre className="overflow-x-auto font-mono text-[11px] leading-relaxed text-muted-foreground/70">
                    {JSON.stringify(call.args, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          )}

          {result.text && (
            <div className="rounded-lg border bg-muted/40 px-4 py-3">
              <p className="mb-2 text-[13px] font-medium text-muted-foreground/60">Response</p>
              <p className="text-sm leading-relaxed text-foreground/85">{result.text}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
