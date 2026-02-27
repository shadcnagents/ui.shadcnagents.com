"use client"

import { useState } from "react"

const VOICES = ["alloy", "echo", "fable", "onyx", "nova", "shimmer"] as const
type Voice = (typeof VOICES)[number]

export function GenerateSpeechDemo() {
  const [text, setText] = useState(
    "The Vercel AI SDK makes it easy to build AI-powered applications."
  )
  const [voice, setVoice] = useState<Voice>("alloy")
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!text.trim() || loading) return

    setLoading(true)
    setError(null)
    if (audioUrl) URL.revokeObjectURL(audioUrl)
    setAudioUrl(null)

    try {
      const res = await fetch("/api/speech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text.trim(), voice }),
      })
      if (!res.ok) throw new Error(await res.text())
      const blob = await res.blob()
      setAudioUrl(URL.createObjectURL(blob))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate speech")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-lg space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Generate Speech</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Convert text to natural-sounding audio with OpenAI TTS.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text to convert to speech…"
          rows={3}
          className="w-full resize-none rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground/60 focus-visible:ring-2 focus-visible:ring-ring"
        />

        <div className="flex gap-2">
          <select
            value={voice}
            onChange={(e) => setVoice(e.target.value as Voice)}
            className="flex-1 rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {VOICES.map((v) => (
              <option key={v} value={v}>
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </option>
            ))}
          </select>

          <button
            type="submit"
            disabled={loading || !text.trim()}
            className="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="size-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Generating
              </span>
            ) : (
              "Generate"
            )}
          </button>
        </div>
      </form>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2.5">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {audioUrl && (
        <div className="rounded-lg border bg-muted/40 p-4">
          <p className="mb-3 text-[13px] font-medium text-muted-foreground/60">Audio Output</p>
          <audio src={audioUrl} controls className="w-full" />
          <p className="mt-2 text-[11px] text-muted-foreground/40">
            Voice: {voice} · Model: tts-1
          </p>
        </div>
      )}
    </div>
  )
}
