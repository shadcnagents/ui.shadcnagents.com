"use client"

import { useCallback, useState } from "react"

interface ModelResult {
  model: string
  text: string | null
  error?: string
  tokens: number
  latencyMs: number
}

const MODEL_COLORS: Record<string, string> = {
  "GPT-4o": "#10a37f",
  "Claude Sonnet 4": "#d97757",
  "Gemini 2.0 Flash": "#4285f4",
}

export function MultiModelDemo() {
  const [prompt, setPrompt] = useState("")
  const [results, setResults] = useState<ModelResult[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState<number | null>(null)

  const compare = useCallback(async () => {
    if (!prompt.trim() || loading) return
    setLoading(true)
    setResults([])
    setError(null)

    try {
      const res = await fetch("/api/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim() }),
      })
      if (!res.ok) throw new Error(await res.text())
      const data = await res.json()
      setResults(data.results)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }, [prompt, loading])

  function copyText(text: string, idx: number) {
    navigator.clipboard.writeText(text)
    setCopied(idx)
    setTimeout(() => setCopied(null), 2000)
  }

  const wordCount = prompt.trim() ? prompt.trim().split(/\s+/).length : 0

  return (
    <div className="mx-auto w-full max-w-2xl space-y-4">
      {/* Input */}
      <div className="rounded-xl border border-input bg-background shadow-xs">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
              e.preventDefault()
              compare()
            }
          }}
          placeholder="What is recursion? Explain in your own style..."
          rows={3}
          className="w-full resize-none rounded-xl bg-transparent px-4 py-3 text-sm outline-none placeholder:text-muted-foreground/50"
        />
        <div className="flex items-center justify-between border-t border-border/50 px-4 py-2">
          <div className="flex items-center gap-3">
            {Object.entries(MODEL_COLORS).map(([name, color]) => (
              <span key={name} className="flex items-center gap-1.5">
                <span
                  className="size-1.5 rounded-full"
                  style={{ backgroundColor: color }}
                />
                <span className="text-[11px] text-muted-foreground">{name}</span>
              </span>
            ))}
          </div>
          <button
            onClick={compare}
            disabled={loading || !prompt.trim()}
            className="inline-flex h-7 items-center gap-1.5 rounded-lg bg-primary px-3 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {loading ? "Comparing\u2026" : "Compare"}
          </button>
        </div>
      </div>

      {/* Loading skeletons */}
      {loading && (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="rounded-xl border border-input p-4">
              <div className="mb-3 h-3 w-24 animate-pulse rounded-full bg-muted" />
              <div className="space-y-2">
                <div className="h-3 w-full animate-pulse rounded-full bg-muted" />
                <div className="h-3 w-4/5 animate-pulse rounded-full bg-muted" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-3">
          {results.map((result, i) => (
            <div
              key={result.model}
              className="group relative rounded-xl border border-input"
            >
              {result.text && (
                <button
                  onClick={() => copyText(result.text!, i)}
                  className="absolute right-3 top-3 rounded-md border border-input bg-background p-1.5 opacity-0 transition-opacity group-hover:opacity-100"
                  title="Copy"
                >
                  {copied === i ? (
                    <svg
                      className="size-3.5 text-green-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="size-3.5 text-muted-foreground"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                    </svg>
                  )}
                </button>
              )}

              <div className="px-4 py-3">
                <div className="mb-2 flex items-center gap-2">
                  <span
                    className="size-2 rounded-full"
                    style={{
                      backgroundColor: MODEL_COLORS[result.model] || "#888",
                    }}
                  />
                  <span className="font-mono text-xs font-medium text-foreground/70">
                    {result.model}
                  </span>
                </div>
                {result.text ? (
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
                    {result.text}
                  </p>
                ) : (
                  <p className="text-sm italic text-destructive/70">
                    {result.error || "No response"}
                  </p>
                )}
              </div>

              {result.text && (
                <div className="flex items-center gap-3 border-t border-border/50 px-4 py-2">
                  <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
                    {result.tokens} tokens
                  </span>
                  <span className="text-muted-foreground/30">&middot;</span>
                  <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
                    {result.latencyMs}ms
                  </span>
                </div>
              )}
            </div>
          ))}

          {/* Summary */}
          <div className="flex items-center justify-center gap-3 pt-1">
            <span className="font-mono text-[11px] text-muted-foreground">
              {results.filter((r) => r.text).length} models &middot;{" "}
              {results.reduce((s, r) => s + r.tokens, 0)} total tokens &middot;{" "}
              {Math.max(...results.map((r) => r.latencyMs))}ms slowest
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
