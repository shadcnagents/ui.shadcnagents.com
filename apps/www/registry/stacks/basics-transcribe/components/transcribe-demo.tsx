"use client"

import { useState } from "react"

export function TranscribeDemo() {
  const [transcript, setTranscript] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setFileName(file.name)
    setLoading(true)
    setTranscript(null)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("audio", file)
      const res = await fetch("/api/transcribe", { method: "POST", body: formData })
      if (!res.ok) throw new Error(await res.text())
      const { text } = await res.json()
      setTranscript(text)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Transcription failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-lg space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Transcribe Audio</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Upload an audio file and convert it to text with Whisper.
        </p>
      </div>

      <label className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border/60 bg-muted/20 px-6 py-10 transition-colors hover:border-border hover:bg-muted/30">
        {loading ? (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <svg className="size-6 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span className="text-sm">Transcribing {fileName}…</span>
          </div>
        ) : (
          <>
            <svg className="size-8 text-muted-foreground/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
            </svg>
            <div className="text-center">
              <p className="text-sm font-medium">Click to upload audio</p>
              <p className="mt-0.5 text-xs text-muted-foreground/60">mp3, wav, m4a, ogg, webm</p>
            </div>
          </>
        )}
        <input
          type="file"
          accept="audio/*"
          onChange={handleUpload}
          disabled={loading}
          className="sr-only"
        />
      </label>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2.5">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {transcript && (
        <div className="rounded-lg border bg-muted/40 px-4 py-3">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-[13px] font-medium text-muted-foreground/60">Transcript</p>
            <button
              onClick={() => navigator.clipboard.writeText(transcript)}
              className="text-[11px] text-muted-foreground/50 transition-colors hover:text-foreground"
            >
              Copy
            </button>
          </div>
          <p className="text-sm leading-relaxed text-foreground/85">{transcript}</p>
        </div>
      )}
    </div>
  )
}
