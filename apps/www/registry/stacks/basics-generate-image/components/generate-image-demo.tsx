"use client"

import { useState } from "react"

interface GeneratedImage {
  base64: string
  prompt: string
}

export function GenerateImageDemo() {
  const [prompt, setPrompt] = useState("")
  const [images, setImages] = useState<GeneratedImage[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!prompt.trim() || loading) return

    setLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim() }),
      })
      if (!res.ok) throw new Error(await res.text())
      const { base64 } = await res.json()
      setImages((prev) => [{ base64, prompt: prompt.trim() }, ...prev])
      setPrompt("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate image")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-lg space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Generate Image</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Describe an image and generate it with DALL-E 3.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="A photorealistic cat astronaut on the moon…"
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
            "Generate"
          )}
        </button>
      </form>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2.5">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {loading && (
        <div className="flex aspect-square items-center justify-center rounded-xl border border-dashed border-border/60 bg-muted/20">
          <div className="flex flex-col items-center gap-3 text-muted-foreground/50">
            <svg className="size-8 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <p className="text-xs">Generating image…</p>
          </div>
        </div>
      )}

      {images.length > 0 && !loading && (
        <div className="space-y-3">
          {images.map((img, i) => (
            <div key={i} className="overflow-hidden rounded-xl border">
              <img
                src={`data:image/png;base64,${img.base64}`}
                alt={img.prompt}
                className="w-full object-cover"
              />
              <div className="border-t bg-muted/30 px-3 py-2">
                <p className="truncate text-[11px] text-muted-foreground/60">{img.prompt}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
