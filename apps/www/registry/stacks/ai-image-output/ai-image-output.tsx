"use client"

import { useState } from "react"
import { Download, RefreshCw } from "lucide-react"

export function AIImageOutput() {
  const [prompt, setPrompt] = useState("")
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [elapsed, setElapsed] = useState(0)

  async function generate() {
    if (!prompt.trim() || loading) return
    setLoading(true)
    setImageUrl(null)
    setElapsed(0)

    const start = Date.now()
    const timer = setInterval(() => setElapsed((Date.now() - start) / 1000), 100)

    const res = await fetch("/api/generate-image", {
      method: "POST",
      body: JSON.stringify({ prompt }),
      headers: { "Content-Type": "application/json" },
    })
    const { url } = await res.json()
    clearInterval(timer)
    setElapsed((Date.now() - start) / 1000)
    setImageUrl(url)
    setLoading(false)
  }

  return (
    <div className="mx-auto max-w-sm space-y-4 p-6">
      <div className="flex gap-2">
        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && generate()}
          placeholder="Describe an image…"
          className="flex-1 rounded-lg border border-border/40 bg-muted/20 px-3 py-2 text-sm outline-none"
        />
        <button
          onClick={generate}
          disabled={loading || !prompt.trim()}
          className="rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background disabled:opacity-40"
        >
          {loading ? <RefreshCw className="size-4 animate-spin" /> : "Generate"}
        </button>
      </div>

      <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-border/40 bg-muted/20">
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <div className="size-8 animate-spin rounded-full border-2 border-foreground/20 border-t-foreground" />
            <span className="text-xs text-muted-foreground">{elapsed.toFixed(1)}s</span>
          </div>
        )}
        {imageUrl && (
          <>
            <img src={imageUrl} alt={prompt} className="h-full w-full object-cover" />
            <div className="absolute bottom-3 right-3">
              <a
                href={imageUrl}
                download="generated.png"
                className="flex items-center gap-1.5 rounded-full bg-background/70 px-3 py-1.5 text-xs font-medium backdrop-blur-sm"
              >
                <Download className="size-3" /> Save
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  )
}