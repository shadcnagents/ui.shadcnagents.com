"use client"

import { useCallback, useState } from "react"

interface GenerateResult {
  text: string
  meta: {
    model: string
    system: string | null
    temperature: number
    promptTokens: number
    completionTokens: number
    totalTokens: number
    latencyMs: number
  }
}

const PRESETS = [
  {
    label: "Concise",
    system:
      "You are a concise technical writer. Use bullet points. Be direct and precise.",
  },
  {
    label: "Creative",
    system:
      "You are a creative writer. Use vivid metaphors, storytelling, and expressive language.",
  },
  {
    label: "ELI5",
    system:
      "Explain concepts as if speaking to a 5-year-old. Use simple words and fun analogies.",
  },
]

export function PromptEngineeringDemo() {
  const [system, setSystem] = useState(PRESETS[0].system)
  const [prompt, setPrompt] = useState("")
  const [temperature, setTemperature] = useState(0.7)
  const [result, setResult] = useState<GenerateResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [activePreset, setActivePreset] = useState(0)

  const generate = useCallback(async () => {
    if (!prompt.trim() || loading) return
    setLoading(true)
    setResult(null)
    setError(null)

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: prompt.trim(),
          system: system.trim() || undefined,
          temperature,
        }),
      })
      if (!res.ok) throw new Error(await res.text())
      setResult(await res.json())
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }, [prompt, system, temperature, loading])

  function copyText() {
    if (!result?.text) return
    navigator.clipboard.writeText(result.text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function selectPreset(idx: number) {
    setActivePreset(idx)
    setSystem(PRESETS[idx].system)
  }

  return (
    <div className="mx-auto w-full max-w-xl space-y-4">
      {/* System prompt */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            System Prompt
          </label>
          <div className="flex gap-1">
            {PRESETS.map((preset, i) => (
              <button
                key={preset.label}
                onClick={() => selectPreset(i)}
                className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium transition-colors ${
                  activePreset === i
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
        <textarea
          value={system}
          onChange={(e) => {
            setSystem(e.target.value)
            setActivePreset(-1)
          }}
          rows={2}
          className="w-full resize-none rounded-xl border border-input bg-background px-4 py-3 font-mono text-xs leading-relaxed text-foreground/70 shadow-xs outline-none placeholder:text-muted-foreground/50 focus-visible:border-foreground/20"
        />
      </div>

      {/* Prompt + controls */}
      <div className="rounded-xl border border-input bg-background shadow-xs">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
              e.preventDefault()
              generate()
            }
          }}
          placeholder="What is recursion?"
          rows={2}
          className="w-full resize-none rounded-xl bg-transparent px-4 py-3 text-sm outline-none placeholder:text-muted-foreground/50"
        />
        <div className="flex items-center justify-between border-t border-border/50 px-4 py-2">
          <div className="flex items-center gap-3">
            <span className="rounded-md bg-muted/80 px-2 py-0.5 font-mono text-[11px] text-muted-foreground">
              gpt-4o
            </span>
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-[11px] text-muted-foreground/60">
                temp
              </span>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="h-[3px] w-16 cursor-pointer appearance-none rounded-full bg-foreground/15 accent-primary [&::-webkit-slider-thumb]:size-2.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-moz-range-thumb]:size-2.5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-primary"
              />
              <span className="w-5 font-mono text-[11px] tabular-nums text-muted-foreground">
                {temperature.toFixed(1)}
              </span>
            </div>
          </div>
          <button
            onClick={generate}
            disabled={loading || !prompt.trim()}
            className="inline-flex h-7 items-center gap-1.5 rounded-lg bg-primary px-3 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {loading ? "Generating\u2026" : "Generate"}
          </button>
        </div>
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="space-y-2.5 rounded-xl border border-input px-4 py-4">
          <div className="h-3 w-3/4 animate-pulse rounded-full bg-muted" />
          <div className="h-3 w-full animate-pulse rounded-full bg-muted" />
          <div className="h-3 w-5/6 animate-pulse rounded-full bg-muted" />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="group relative rounded-xl border border-input">
          <button
            onClick={copyText}
            className="absolute right-3 top-3 rounded-md border border-input bg-background p-1.5 opacity-0 transition-opacity group-hover:opacity-100"
            title="Copy to clipboard"
          >
            {copied ? (
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

          <div className="px-4 py-3">
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
              {result.text}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 border-t border-border/50 px-4 py-2">
            <span className="font-mono text-[11px] text-muted-foreground">
              {result.meta.model}
            </span>
            <span className="text-muted-foreground/30">&middot;</span>
            <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
              {result.meta.totalTokens} tokens
            </span>
            <span className="text-muted-foreground/30">&middot;</span>
            <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
              {result.meta.latencyMs}ms
            </span>
            <span className="text-muted-foreground/30">&middot;</span>
            <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
              temp {result.meta.temperature.toFixed(1)}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
