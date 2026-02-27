"use client"

import { useState } from "react"

export function GenerateTextDemo() {
  const [prompt, setPrompt] = useState("")
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!prompt.trim() || loading) return

    setLoading(true)
    setResult(null)
    setError(null)

    try {
      const res = await fetch("/api/generate-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim() }),
      })
      if (!res.ok) throw new Error(await res.text())
      const data = await res.json()
      setResult(data.text)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-lg space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Generate Text</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Enter a prompt to generate text with GPT-4o.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Write a short story about a robot learning to paint..."
          rows={4}
          className="w-full resize-none rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none placeholder:text-muted-foreground/60 focus-visible:ring-2 focus-visible:ring-ring"
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
              Generating…
            </span>
          ) : (
            "Generate"
          )}
        </button>
      </form>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2.5">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {result && (
        <div className="rounded-lg border bg-muted/40 px-4 py-3">
          <p className="mb-2 text-[13px] font-medium text-muted-foreground/60">Result</p>
          <p className="text-sm leading-relaxed text-foreground/85">{result}</p>
        </div>
      )}
    </div>
  )
}
