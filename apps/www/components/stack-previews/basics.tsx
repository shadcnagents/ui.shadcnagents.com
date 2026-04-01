"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { AnimatePresence, motion } from "motion/react"
import { cn } from "@/lib/utils"
import { LiveWaveform } from "@/registry/stacks/basics-generate-speech/components/ui/live-waveform"
import { AIInput, AIInputTextarea, AIInputFooter, AIInputAction } from "@/components/ui/ai-input"
import { CircleSpinner, ShimmeringText, SPRING, SuggestionPills, WaveDotsLoader, WAVE_KEYFRAMES } from "./shared"

/* ─── Generate Text ─── */

const GT_KEYFRAMES = WAVE_KEYFRAMES

const GT_PLACEHOLDERS = [
  "Summarize this article...",
  "Extract the key entities...",
  "Classify this support ticket...",
  "Rewrite in a formal tone...",
]

export function GenerateTextPreview() {
  const [state, setState] = useState<"idle" | "thinking" | "streaming" | "complete">("idle")
  const [prompt, setPrompt] = useState("")
  const [submittedPrompt, setSubmittedPrompt] = useState("")
  const [response, setResponse] = useState("")
  const [elapsed, setElapsed] = useState(0)
  const t0Ref = useRef(0)

  const submit = useCallback(async () => {
    if (!prompt.trim() || state === "thinking" || state === "streaming") return
    const userPrompt = prompt.trim()
    setSubmittedPrompt(userPrompt)
    setPrompt("")
    setResponse("")
    setState("thinking")
    t0Ref.current = Date.now()

    try {
      const res = await fetch("/api/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: userPrompt }],
          system: "You are a helpful AI assistant. Provide thoughtful, concise responses (2-3 short paragraphs max). Be informative and engaging.",
        }),
      })

      if (!res.ok) throw new Error("Failed to fetch")

      const reader = res.body?.getReader()
      if (!reader) throw new Error("No reader")

      setState("streaming")
      const decoder = new TextDecoder()
      let fullText = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        fullText += decoder.decode(value, { stream: true })
        setResponse(fullText)
      }

      setElapsed(Date.now() - t0Ref.current)
      setState("complete")
    } catch (error) {
      setResponse("Sorry, something went wrong. Please try again.")
      setElapsed(Date.now() - t0Ref.current)
      setState("complete")
    }
  }, [prompt, state])

  function reset() {
    setState("idle")
    setPrompt("")
    setSubmittedPrompt("")
    setResponse("")
    setElapsed(0)
  }

  return (
    <div className="mx-auto flex h-[420px] w-full max-w-2xl flex-col justify-end p-4">
      <style>{GT_KEYFRAMES}</style>

      {/* ── Response Area ── */}
      <div className="min-h-0 flex-1 overflow-y-auto scrollbar-hide">
        <AnimatePresence>
          {submittedPrompt && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ type: "spring", duration: 0.4, bounce: 0 }}
              className="mb-4"
            >
              {/* Question Bubble */}
              <div className="mb-4 flex justify-end">
                <div className="max-w-[85%] rounded-2xl bg-foreground px-4 py-3 text-sm leading-relaxed text-background">
                  {submittedPrompt}
                </div>
              </div>

              {/* Response */}
              <AnimatePresence mode="wait">
                {state === "thinking" ? (
                  <motion.div
                    key="thinking"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ShimmeringText
                      text="Generating response..."
                      className="text-base leading-relaxed"
                      duration={1.5}
                      spread={1.5}
                    />
                  </motion.div>
                ) : state === "streaming" ? (
                  <motion.div
                    key="streaming"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <p className="whitespace-pre-wrap text-base leading-[1.8] text-foreground/80">
                      {response}
                      <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-foreground/60" />
                    </p>
                  </motion.div>
                ) : state === "complete" ? (
                  <motion.div
                    key="complete"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="whitespace-pre-wrap text-base leading-[1.8] text-foreground/80">
                      {response}
                    </p>
                    <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                      <span>Generated in {(elapsed / 1000).toFixed(1)}s</span>
                      <button
                        onClick={reset}
                        className="transition-colors hover:text-foreground"
                      >
                        Clear
                      </button>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Suggestion Pills ── */}
      <AnimatePresence>
        {!prompt && state === "idle" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mb-3 flex flex-wrap justify-center gap-2"
          >
            {GT_PLACEHOLDERS.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => setPrompt(suggestion)}
                className="rounded-full border border-border/60 bg-card/50 px-4 py-2 text-sm text-muted-foreground transition-all duration-150 hover:border-foreground/20 hover:bg-card hover:text-foreground"
              >
                {suggestion}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main Input Container ── */}
      <div className="rounded-3xl border border-border bg-background p-3 shadow-xs">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              submit()
            }
          }}
          placeholder="Enter a prompt..."
          rows={1}
          className="min-h-[44px] w-full resize-none border-none bg-transparent px-2 py-2 text-base text-foreground outline-none placeholder:text-muted-foreground"
        />

        {/* Actions bar */}
        <div className="flex items-center justify-between px-1">
          {/* Model indicator pill */}
          <div className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5">
            <span className="size-2 rounded-full bg-foreground" />
            <span className="text-xs font-medium text-muted-foreground">GPT-4o</span>
          </div>

          {/* Send button */}
          <motion.button
            onClick={submit}
            disabled={!prompt.trim() || state === "thinking" || state === "streaming"}
            whileTap={{ scale: 0.92 }}
            className={cn(
              "flex size-9 items-center justify-center rounded-full transition-all",
              prompt.trim() && state !== "thinking" && state !== "streaming"
                ? "bg-foreground text-background"
                : "bg-foreground/10 text-muted-foreground/50"
            )}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
          </motion.button>
        </div>
      </div>

      {/* Keyboard hint */}
      <p className="mt-2.5 text-center text-xs text-muted-foreground">
        <span className="rounded border border-border px-1.5 py-0.5 font-mono text-[10px]">↵</span>
        <span className="ml-1.5">send</span>
      </p>
    </div>
  )
}

/* ─── Stream Text ─── */

const ST_KEYFRAMES = `
@keyframes st-pulse{0%,100%{opacity:.4}50%{opacity:1}}
@keyframes st-flow{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}
`

const ST_PLACEHOLDERS = [
  "How does token streaming work...",
  "Explain server-sent events...",
  "What makes streaming feel fast...",
  "Stream a haiku about latency...",
]

export function StreamTextPreview() {
  const [state, setState] = useState<"idle" | "streaming" | "complete">("idle")
  const [prompt, setPrompt] = useState("")
  const [submittedPrompt, setSubmittedPrompt] = useState("")
  const [displayed, setDisplayed] = useState("")
  const [elapsed, setElapsed] = useState(0)
  const abortRef = useRef<AbortController | null>(null)

  const submit = useCallback(async () => {
    if (!prompt.trim() || state === "streaming") return
    const userPrompt = prompt.trim()
    setSubmittedPrompt(userPrompt)
    setPrompt("")
    setState("streaming")
    setDisplayed("")
    const startTime = Date.now()

    abortRef.current = new AbortController()

    try {
      const response = await fetch("/api/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: userPrompt }],
          system: "You are a helpful AI assistant. Provide thoughtful, informative responses. Keep your response to 2-3 paragraphs.",
        }),
        signal: abortRef.current.signal,
      })

      if (!response.ok) throw new Error("Failed to fetch")

      const reader = response.body?.getReader()
      if (!reader) throw new Error("No reader")

      const decoder = new TextDecoder()
      let fullText = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        fullText += decoder.decode(value, { stream: true })
        setDisplayed(fullText)
      }

      setElapsed(Date.now() - startTime)
      setState("complete")
    } catch (error) {
      if ((error as Error).name !== "AbortError") {
        setDisplayed("Sorry, something went wrong. Please try again.")
        setElapsed(Date.now() - startTime)
        setState("complete")
      }
    }
  }, [prompt, state])

  function reset() {
    if (abortRef.current) abortRef.current.abort()
    setState("idle")
    setPrompt("")
    setSubmittedPrompt("")
    setDisplayed("")
    setElapsed(0)
  }

  useEffect(() => {
    return () => {
      if (abortRef.current) abortRef.current.abort()
    }
  }, [])

  const isStreaming = state === "streaming"
  const hasOutput = state === "streaming" || state === "complete"

  return (
    <div className="mx-auto flex h-[420px] w-full max-w-2xl flex-col justify-end p-4">
      <style>{ST_KEYFRAMES}</style>

      {/* ── Response Area ── */}
      <div className="min-h-0 flex-1 overflow-y-auto scrollbar-hide">
        <AnimatePresence>
          {submittedPrompt && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ type: "spring", duration: 0.4, bounce: 0 }}
              className="mb-4"
            >
              {/* Question Bubble */}
              <div className="mb-4 flex justify-end">
                <div className="max-w-[85%] rounded-2xl bg-foreground px-4 py-3 text-sm leading-relaxed text-background">
                  {submittedPrompt}
                </div>
              </div>

              {/* Streamed Response */}
              {hasOutput && (
                <div>
                  <p className="whitespace-pre-wrap text-base leading-[1.8] text-foreground/80">
                    {displayed}
                    {isStreaming && (
                      <span
                        className="ml-px inline-block h-[15px] w-[1.5px] translate-y-[3px] rounded-full bg-foreground/60"
                        style={{ animation: "st-pulse 0.6s ease-in-out infinite" }}
                      />
                    )}
                  </p>

                  {/* Streaming indicator */}
                  {isStreaming && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-3"
                    >
                      <span className="text-xs text-muted-foreground">
                        Streaming...
                      </span>
                    </motion.div>
                  )}

                  {/* Completion footer */}
                  {state === "complete" && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      className="mt-4 flex items-center justify-between text-xs text-muted-foreground"
                    >
                      <span>Completed in {(elapsed / 1000).toFixed(1)}s</span>
                      <button
                        onClick={reset}
                        className="transition-colors hover:text-foreground"
                      >
                        Clear
                      </button>
                    </motion.div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Suggestion Pills ── */}
      <AnimatePresence>
        {!prompt && state === "idle" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mb-3 flex flex-wrap justify-center gap-2"
          >
            {ST_PLACEHOLDERS.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => setPrompt(suggestion)}
                className="rounded-full border border-border/60 bg-card/50 px-4 py-2 text-sm text-muted-foreground transition-all duration-150 hover:border-foreground/20 hover:bg-card hover:text-foreground"
              >
                {suggestion}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main Input Container ── */}
      <div className="rounded-3xl border border-border bg-background p-3 shadow-xs">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              submit()
            }
          }}
          placeholder="Ask anything..."
          rows={1}
          className="min-h-[44px] w-full resize-none border-none bg-transparent px-2 py-2 text-base text-foreground outline-none placeholder:text-muted-foreground"
        />

        {/* Actions bar */}
        <div className="flex items-center justify-between px-1">
          {/* Stream indicator */}
          <div className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5">
            {isStreaming ? (
              <span
                className="size-2 rounded-full bg-foreground"
                style={{ animation: "st-pulse 0.6s ease-in-out infinite" }}
              />
            ) : (
              <span className="size-2 rounded-full bg-foreground" />
            )}
            <span className="text-xs font-medium text-muted-foreground">Stream</span>
          </div>

          {/* Send button */}
          <motion.button
            onClick={submit}
            disabled={!prompt.trim() || isStreaming}
            whileTap={{ scale: 0.92 }}
            className={cn(
              "flex size-9 items-center justify-center rounded-full transition-all",
              prompt.trim() && !isStreaming
                ? "bg-foreground text-background"
                : "bg-foreground/10 text-muted-foreground/50"
            )}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
          </motion.button>
        </div>
      </div>

      {/* Keyboard hint */}
      <p className="mt-2.5 text-center text-xs text-muted-foreground">
        <span className="rounded border border-border px-1.5 py-0.5 font-mono text-[10px]">↵</span>
        <span className="ml-1.5">send</span>
      </p>
    </div>
  )
}

/* ─── Generate Image ─── */
const GI_IMAGES = [
  { src: "/app-assets/sample-01.jpg", label: "Variation 1" },
  { src: "/app-assets/sample-02.jpg", label: "Variation 2" },
  { src: "/app-assets/sample-03.jpg", label: "Variation 3" },
  { src: "/app-assets/sample-04.jpg", label: "Variation 4" },
]

export function GenerateImagePreview() {
  const [state, setState] = useState<"idle" | "generating" | "complete">("idle")
  const [loadingPhase, setLoadingPhase] = useState<"starting" | "rendering" | "done">("starting")
  const [progress, setProgress] = useState(0)
  const [prompt, setPrompt] = useState("")
  const [submittedPrompt, setSubmittedPrompt] = useState("")
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null)

  function generate() {
    if (!prompt.trim() || state === "generating") return
    setSubmittedPrompt(prompt.trim())
    setPrompt("")
    setState("generating")
    setLoadingPhase("starting")
    setProgress(0)
    setSelectedIdx(null)
  }

  // Progressive reveal animation
  useEffect(() => {
    if (state !== "generating") return

    // Start with "starting" phase for 800ms
    const startingTimeout = setTimeout(() => {
      setLoadingPhase("rendering")

      const startTime = Date.now()
      const duration = 2500 // 2.5 seconds for full reveal

      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime
        const progressPct = Math.min(100, (elapsed / duration) * 100)
        setProgress(progressPct)

        if (progressPct >= 100) {
          clearInterval(interval)
          setLoadingPhase("done")
          setTimeout(() => setState("complete"), 300)
        }
      }, 16)

      return () => clearInterval(interval)
    }, 800)

    return () => clearTimeout(startingTimeout)
  }, [state])

  function reset() {
    setState("idle")
    setPrompt("")
    setSubmittedPrompt("")
    setSelectedIdx(null)
    setProgress(0)
    setLoadingPhase("starting")
  }

  const isGenerating = state === "generating"

  // Get loading message based on phase
  const loadingMessage = loadingPhase === "starting"
    ? "Getting started..."
    : loadingPhase === "rendering"
      ? "Creating image. May take a moment."
      : "Image created."

  return (
    <div className="mx-auto flex h-[500px] w-full max-w-2xl flex-col justify-end p-4">
      <style>{GT_KEYFRAMES}</style>

      {/* ── Output Area ── */}
      <div className="min-h-0 flex-1 overflow-y-auto scrollbar-hide">
        <AnimatePresence>
          {submittedPrompt && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ type: "spring", duration: 0.4, bounce: 0 }}
              className="mb-4"
            >
              {/* Prompt Bubble */}
              <div className="mb-4 flex justify-end">
                <div className="max-w-[85%] rounded-2xl bg-foreground px-4 py-3 text-sm leading-relaxed text-background">
                  {submittedPrompt}
                </div>
              </div>

              {/* Image Generation with Progressive Reveal */}
              {(isGenerating || state === "complete") && (
                <div className="flex flex-col gap-3">
                  {/* Shimmer loading text */}
                  <AnimatePresence mode="wait">
                    {isGenerating && (
                      <motion.span
                        key={loadingPhase}
                        className="bg-[linear-gradient(110deg,var(--color-muted-foreground),35%,var(--color-foreground),50%,var(--color-muted-foreground),75%,var(--color-muted-foreground))] bg-[length:200%_100%] bg-clip-text text-base font-medium text-transparent"
                        initial={{ opacity: 0, backgroundPosition: "200% 0" }}
                        animate={{
                          opacity: 1,
                          backgroundPosition: loadingPhase === "done" ? "0% 0" : "-200% 0"
                        }}
                        exit={{ opacity: 0 }}
                        transition={{
                          opacity: { duration: 0.2 },
                          backgroundPosition: {
                            repeat: loadingPhase === "done" ? 0 : Infinity,
                            duration: 2,
                            ease: "linear",
                          },
                        }}
                      >
                        {loadingMessage}
                      </motion.span>
                    )}
                  </AnimatePresence>

                  {/* Image grid with blur reveal */}
                  <div className="grid grid-cols-2 gap-2">
                    {GI_IMAGES.map((img, i) => (
                      <motion.button
                        key={i}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: i * 0.05 }}
                        onClick={() => state === "complete" && setSelectedIdx(selectedIdx === i ? null : i)}
                        disabled={isGenerating}
                        className={cn(
                          "group relative aspect-square overflow-hidden rounded-xl border border-border transition-all duration-200",
                          state === "complete" && (
                            selectedIdx === i
                              ? "ring-2 ring-foreground/40 ring-offset-2 ring-offset-background"
                              : selectedIdx !== null
                                ? "opacity-40"
                                : "hover:ring-1 hover:ring-foreground/20"
                          )
                        )}
                      >
                        {/* Actual image */}
                        <img
                          src={img.src}
                          alt={img.label}
                          className="absolute inset-0 h-full w-full object-cover"
                        />

                        {/* Label - only show when complete */}
                        {state === "complete" && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent px-2.5 pb-2 pt-8"
                          >
                            <p className="text-xs font-medium text-white/90">{img.label}</p>
                          </motion.div>
                        )}

                        {/* Blur reveal overlay */}
                        {isGenerating && (
                          <motion.div
                            className="pointer-events-none absolute -top-[25%] h-[125%] w-full backdrop-blur-2xl"
                            initial={false}
                            animate={{
                              opacity: loadingPhase === "done" ? 0 : 1,
                            }}
                            transition={{ duration: 0.3 }}
                            style={{
                              clipPath: `polygon(0 ${progress}%, 100% ${progress}%, 100% 100%, 0 100%)`,
                              maskImage: progress === 0
                                ? "linear-gradient(to bottom, black -5%, black 100%)"
                                : `linear-gradient(to bottom, transparent ${Math.max(0, progress - 10)}%, black ${progress + 5}%)`,
                              WebkitMaskImage: progress === 0
                                ? "linear-gradient(to bottom, black -5%, black 100%)"
                                : `linear-gradient(to bottom, transparent ${Math.max(0, progress - 10)}%, black ${progress + 5}%)`,
                            }}
                          />
                        )}
                      </motion.button>
                    ))}
                  </div>

                  {/* Footer */}
                  {state === "complete" && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      className="flex items-center justify-between text-xs text-muted-foreground"
                    >
                      <span>
                        {selectedIdx !== null ? GI_IMAGES[selectedIdx].label : "Select a variation"}
                      </span>
                      <button
                        onClick={reset}
                        className="transition-colors hover:text-foreground"
                      >
                        Clear
                      </button>
                    </motion.div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Main Input Container ── */}
      <div className="rounded-3xl border border-border bg-background p-3 shadow-xs">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              generate()
            }
          }}
          disabled={isGenerating}
          placeholder="A serene mountain landscape at golden hour..."
          rows={2}
          className="min-h-[60px] w-full resize-none border-none bg-transparent px-2 py-2 text-base text-foreground outline-none placeholder:text-muted-foreground disabled:opacity-50"
        />

        {/* Actions bar */}
        <div className="flex items-center justify-between px-1">
          {/* Model indicator */}
          <div className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5">
            <span className="size-2 rounded-full bg-gradient-to-br from-pink-400 to-violet-500" />
            <span className="text-xs font-medium text-muted-foreground">DALL·E 3</span>
          </div>

          {/* Generate button */}
          <motion.button
            onClick={generate}
            disabled={!prompt.trim() || isGenerating}
            whileTap={{ scale: 0.92 }}
            className={cn(
              "flex size-9 items-center justify-center rounded-full transition-all",
              prompt.trim() && !isGenerating
                ? "bg-foreground text-background"
                : "bg-foreground/10 text-muted-foreground/50"
            )}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
          </motion.button>
        </div>
      </div>

      {/* Keyboard hint */}
      <p className="mt-2.5 text-center text-xs text-muted-foreground">
        <span className="rounded border border-border px-1.5 py-0.5 font-mono text-[10px]">↵</span>
        <span className="ml-1.5">generate</span>
      </p>
    </div>
  )
}

/* ─── Generate Speech ─── */

const VOICE_OPTIONS: { id: string; label: string; desc: string }[] = [
  { id: "alloy", label: "Alloy", desc: "Neutral and balanced" },
  { id: "echo", label: "Echo", desc: "Warm and rounded" },
  { id: "fable", label: "Fable", desc: "Expressive and British" },
  { id: "onyx", label: "Onyx", desc: "Deep and authoritative" },
  { id: "nova", label: "Nova", desc: "Female, friendly and bright" },
  { id: "shimmer", label: "Shimmer", desc: "Soft and whispery" },
]

const ORB_COLORS: Record<string, [string, string]> = {
  alloy: ["#60A5FA", "#3B82F6"],
  echo: ["#93C5FD", "#60A5FA"],
  fable: ["#38BDF8", "#0EA5E9"],
  onyx: ["#3B82F6", "#1D4ED8"],
  nova: ["#818CF8", "#6366F1"],
  shimmer: ["#A5B4FC", "#818CF8"],
}

const ORB_KEYFRAMES = `
@keyframes orb-idle {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.03); }
}
@keyframes orb-gen {
  0%, 100% { transform: scale(0.94) rotate(0deg); }
  50% { transform: scale(1.06) rotate(4deg); }
}
@keyframes orb-talk {
  0%, 100% { transform: scale(1) rotate(0deg); }
  20% { transform: scale(1.08) rotate(2deg); }
  40% { transform: scale(0.97) rotate(-1.5deg); }
  60% { transform: scale(1.05) rotate(3deg); }
  80% { transform: scale(0.99) rotate(-1deg); }
}
`

const MAX_CHARS = 300

export function GenerateSpeechPreview() {
  const [text, setText] = useState(
    "The Vercel AI SDK makes it easy to build AI-powered applications with streaming, tool use, and multi-modal capabilities."
  )
  const [voice, setVoice] = useState("alloy")
  const [state, setState] = useState<"idle" | "generating" | "ready">("idle")
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const colors = ORB_COLORS[voice] || ORB_COLORS.alloy
  const voiceInfo = VOICE_OPTIONS.find((v) => v.id === voice) || VOICE_OPTIONS[0]

  function generate() {
    if (!text.trim() || state === "generating") return
    setState("generating")
    setProgress(0)
    setPlaying(false)
    setTimeout(() => setState("ready"), 1800)
  }

  function togglePlay() {
    if (state !== "ready") return
    if (playing) {
      setPlaying(false)
      if (intervalRef.current) clearInterval(intervalRef.current)
      return
    }
    setPlaying(true)
    intervalRef.current = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          setPlaying(false)
          if (intervalRef.current) clearInterval(intervalRef.current)
          return 0
        }
        return p + 1.5
      })
    }, 60)
  }

  function reset() {
    setState("idle")
    setPlaying(false)
    setProgress(0)
    if (intervalRef.current) clearInterval(intervalRef.current)
  }

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  const orbAnimation =
    state === "generating"
      ? "orb-gen 1.2s ease-in-out infinite"
      : playing
        ? "orb-talk 1.5s ease-in-out infinite"
        : "orb-idle 4s ease-in-out infinite"

  return (
    <div className="mx-auto w-full max-w-lg p-6">
      <style>{GT_KEYFRAMES}{ORB_KEYFRAMES}</style>

      {/* ── 1. Header — shimmer reveal ── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <ShimmeringText
          text="Generate Speech"
          className="text-lg font-semibold tracking-tight"
          duration={2.5}
          delay={0.2}
          repeat={false}
          spread={3}
        />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-1 text-sm text-muted-foreground"
        >
          Convert text to natural-sounding audio with OpenAI TTS.
        </motion.p>
      </motion.div>

      {/* ── 2. Hero: Orb + Waveform ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="mt-6 flex items-center gap-5"
      >
        {/* Orb */}
        <motion.div
          className="size-20 shrink-0 overflow-hidden rounded-full"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 200, damping: 20 }}
        >
          <div
            className="size-full rounded-full"
            style={{
              background: `
                radial-gradient(circle at 35% 35%, ${colors[0]}, transparent 60%),
                radial-gradient(circle at 65% 65%, ${colors[1]}, transparent 60%),
                radial-gradient(circle at 50% 50%, ${colors[0]}88, ${colors[1]}66, transparent 70%)
              `,
              animation: orbAnimation,
            }}
          />
        </motion.div>

        {/* Waveform + status */}
        <div className="flex min-w-0 flex-1 flex-col gap-2 overflow-hidden">
          <LiveWaveform
            active={false}
            processing={state === "generating" || playing}
            mode="static"
            height={100}
            barWidth={3}
            barGap={1}
            barRadius={1.5}
            sensitivity={1.2}
            fadeEdges
            fadeWidth={16}
            className="text-foreground/70"
          />
          <div className="flex items-center justify-between px-0.5">
            <AnimatePresence mode="wait">
              {playing ? (
                <motion.span
                  key="playing"
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 4 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-1.5"
                >
                  <span className="size-1.5 animate-pulse rounded-full" style={{ backgroundColor: colors[1] }} />
                  <ShimmeringText
                    text="Playing"
                    className="font-mono text-[10px]"
                    duration={1.5}
                    repeat={false}
                    spread={2}
                    startOnView={false}
                  />
                </motion.span>
              ) : state === "generating" ? (
                <motion.span
                  key="generating"
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 4 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-1.5"
                >
                  <WaveDotsLoader />
                  <span className="font-mono text-[10px] text-foreground/40">
                    Generating…
                  </span>
                </motion.span>
              ) : state === "ready" ? (
                <motion.span
                  key="ready"
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 4 }}
                  transition={{ duration: 0.2 }}
                >
                  <ShimmeringText
                    text="Ready"
                    className="font-mono text-[10px]"
                    duration={1.8}
                    repeat={false}
                    spread={3}
                    startOnView={false}
                  />
                </motion.span>
              ) : (
                <motion.span
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="font-mono text-[10px] text-foreground/20"
                >
                  Idle
                </motion.span>
              )}
            </AnimatePresence>
            <ShimmeringText
              text="tts-1"
              className="font-mono text-[10px]"
              duration={2}
              delay={0.6}
              repeat={false}
              spread={2}
              color="oklch(0.556 0 0 / 0.3)"
            />
          </div>
        </div>
      </motion.div>

      {/* ── 3. Playback controls ── */}
      <AnimatePresence>
        {state === "ready" && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="mt-4 flex items-center justify-center gap-3"
          >
            <motion.button
              onClick={togglePlay}
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
              className="flex size-8 items-center justify-center rounded-full bg-foreground text-background"
            >
              <AnimatePresence mode="wait">
                {playing ? (
                  <motion.svg
                    key="pause"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    width="10" height="10" viewBox="0 0 24 24" fill="currentColor"
                  >
                    <rect x="6" y="4" width="4" height="16" rx="1" />
                    <rect x="14" y="4" width="4" height="16" rx="1" />
                  </motion.svg>
                ) : (
                  <motion.svg
                    key="play"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    width="10" height="10" viewBox="0 0 24 24" fill="currentColor" className="ml-0.5"
                  >
                    <polygon points="5 3 19 12 5 21" />
                  </motion.svg>
                )}
              </AnimatePresence>
            </motion.button>
            <span className="font-mono text-xs tabular-nums text-muted-foreground">
              0:{String(Math.floor((progress / 100) * 8)).padStart(2, "0")} / 0:08
            </span>
            <motion.button
              onClick={reset}
              whileTap={{ scale: 0.95 }}
              className="text-xs text-muted-foreground/40 transition-colors hover:text-foreground"
            >
              clear
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── 4. Text input ── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="mt-6"
      >
        <textarea
          value={text}
          onChange={(e) => {
            if (e.target.value.length <= MAX_CHARS) setText(e.target.value)
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
              e.preventDefault()
              generate()
            }
          }}
          disabled={state === "generating"}
          placeholder="Enter text to convert to speech…"
          rows={3}
          className="w-full resize-none rounded-xl border border-border bg-card px-4 py-3 text-sm leading-relaxed text-foreground outline-none placeholder:text-muted-foreground/50 focus:border-foreground/15 disabled:opacity-40"
        />
      </motion.div>

      {/* ── 5. Voice picker + Generate ── */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.4 }}
        className="mt-4 flex items-center justify-between"
      >
        <div className="flex items-center gap-0.5">
          {VOICE_OPTIONS.map((v, i) => (
            <motion.button
              key={v.id}
              onClick={() => setVoice(v.id)}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.65 + i * 0.04, type: "spring", stiffness: 400, damping: 25 }}
              whileTap={{ scale: 0.95 }}
              className={`rounded-full px-2 py-0.5 text-xs font-medium transition-all ${
                voice === v.id
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {v.label}
            </motion.button>
          ))}
        </div>
        <motion.button
          onClick={generate}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, type: "spring", stiffness: 300, damping: 20 }}
          whileTap={{ scale: 0.97 }}
          whileHover={{ scale: 1.02 }}
          disabled={!text.trim() || state === "generating"}
          className="rounded-full bg-foreground px-4 py-1.5 text-xs font-medium text-background transition-colors hover:bg-foreground/90 disabled:opacity-30"
        >
          {state === "generating" ? "Generating…" : "Speak"}
        </motion.button>
      </motion.div>

      {/* ── 6. Footer metadata — shimmer reveal ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="mt-5 flex items-center gap-3 border-t border-border/40 pt-3"
      >
        <ShimmeringText
          text="tts-1"
          className="font-mono text-[10px]"
          duration={2}
          delay={1}
          repeat={false}
          spread={2}
          color="oklch(0.556 0 0 / 0.2)"
        />
        <span className="text-foreground/10">&middot;</span>
        <ShimmeringText
          text={voiceInfo.label}
          className="font-mono text-[10px]"
          duration={2}
          delay={1.1}
          repeat={false}
          spread={2}
          color="oklch(0.556 0 0 / 0.2)"
        />
        <span className="text-foreground/10">&middot;</span>
        <ShimmeringText
          text={`${text.trim().split(/\s+/).filter(Boolean).length} words`}
          className="font-mono text-[10px] tabular-nums"
          duration={2}
          delay={1.2}
          repeat={false}
          spread={2}
          color="oklch(0.556 0 0 / 0.2)"
        />
      </motion.div>
    </div>
  )
}

/* ─── Transcribe Audio ─── */

const TRANSCRIBE_RESULT =
  "Welcome to today's discussion on artificial intelligence. We'll be covering the latest developments in large language models and how they're being integrated into production applications. Let's start with an overview of the current landscape."

export function TranscribePreview() {
  const [state, setState] = useState<
    "idle" | "uploaded" | "transcribing" | "streaming" | "complete"
  >("idle")
  const [displayed, setDisplayed] = useState("")
  const [dragging, setDragging] = useState(false)
  const [copied, setCopied] = useState(false)
  const idxRef = useRef(0)

  function handleUpload() {
    if (state !== "idle") return
    setState("uploaded")
  }

  function transcribe() {
    if (state !== "uploaded") return
    setState("transcribing")
    setDisplayed("")
    idxRef.current = 0
    setTimeout(() => setState("streaming"), 1600)
  }

  // Character-by-character streaming
  useEffect(() => {
    if (state !== "streaming") return
    const iv = setInterval(() => {
      if (idxRef.current < TRANSCRIBE_RESULT.length) {
        idxRef.current += 1
        setDisplayed(TRANSCRIBE_RESULT.slice(0, idxRef.current))
      } else {
        clearInterval(iv)
        setState("complete")
      }
    }, 12)
    return () => clearInterval(iv)
  }, [state])

  function copyResult() {
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  function reset() {
    setState("idle")
    setDisplayed("")
    idxRef.current = 0
    setCopied(false)
  }

  const resultText = state === "complete" ? TRANSCRIBE_RESULT : displayed

  return (
    <div className="mx-auto w-full max-w-lg p-6">
      <style>{GT_KEYFRAMES}</style>

      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <ShimmeringText
          text="Transcribe Audio"
          className="text-lg font-semibold tracking-tight"
          duration={2.5}
          delay={0.2}
          repeat={false}
          spread={3}
        />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-1 text-sm text-muted-foreground"
        >
          Convert audio to text with OpenAI Whisper.
        </motion.p>
      </motion.div>

      {/* ── Drop zone / File card ── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="mt-6"
      >
        <AnimatePresence mode="wait">
          {state === "idle" ? (
            <motion.div
              key="dropzone"
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => { e.preventDefault(); setDragging(false); handleUpload() }}
              onClick={handleUpload}
              className={cn(
                "group flex h-36 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all duration-300",
                dragging
                  ? "border-primary/50 bg-primary/5"
                  : "border-border/60 bg-transparent hover:border-foreground/20 hover:bg-card/50"
              )}
            >
              <motion.div
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-muted-foreground/50 transition-colors group-hover:text-foreground/50"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" x2="12" y1="3" y2="15" />
                </svg>
              </motion.div>
              <p className="mt-3 text-sm text-muted-foreground/70 transition-colors group-hover:text-foreground/60">
                Drop audio file or click to browse
              </p>
              <div className="mt-2 flex items-center gap-1.5">
                {["MP3", "WAV", "M4A", "WEBM"].map((fmt) => (
                  <span
                    key={fmt}
                    className="rounded-md border border-border/40 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground/40"
                  >
                    {fmt}
                  </span>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="filecard"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="rounded-2xl border border-border bg-card p-4"
            >
              {/* File info row */}
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary"
                  >
                    <path d="M9 18V5l12-2v13" />
                    <circle cx="6" cy="18" r="3" />
                    <circle cx="18" cy="16" r="3" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">
                    recording_2024-01-15.mp3
                  </p>
                  <p className="font-mono text-[11px] text-muted-foreground/60">
                    1.2 MB · 2:34
                  </p>
                </div>
                {state === "uploaded" && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={reset}
                    className="text-xs text-muted-foreground/40 transition-colors hover:text-foreground"
                  >
                    remove
                  </motion.button>
                )}
              </div>

              {/* Waveform */}
              <div className="mt-3 h-[36px] min-w-0 overflow-hidden">
                <LiveWaveform
                  active={false}
                  processing={state === "transcribing"}
                  height={36}
                  barWidth={3}
                  barGap={1}
                  barRadius={1.5}
                  fadeEdges
                  fadeWidth={12}
                  className={cn(
                    "transition-opacity duration-500",
                    state === "transcribing" || state === "streaming" || state === "complete"
                      ? "opacity-70"
                      : "opacity-30"
                  )}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ── Action row ── */}
      <AnimatePresence mode="wait">
        {state === "uploaded" && (
          <motion.div
            key="transcribe-btn"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="mt-4 flex items-center justify-between"
          >
            <span className="font-mono text-[11px] text-muted-foreground/40">
              whisper-large-v3
            </span>
            <motion.button
              onClick={transcribe}
              whileTap={{ scale: 0.97 }}
              whileHover={{ scale: 1.02 }}
              className="rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
            >
              Transcribe
            </motion.button>
          </motion.div>
        )}

        {state === "transcribing" && (
          <motion.div
            key="transcribing"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-4 flex items-center gap-2"
          >
            <WaveDotsLoader />
            <span className="font-mono text-xs text-muted-foreground">
              Transcribing…
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Streaming result ── */}
      <AnimatePresence>
        {(state === "streaming" || state === "complete") && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="mt-5"
          >
            <div className="flex items-center justify-between">
              <ShimmeringText
                text="Transcript"
                className="text-xs font-medium uppercase tracking-wider"
                duration={1.8}
                repeat={false}
                spread={3}
                startOnView={false}
              />
              {state === "complete" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center gap-2"
                >
                  <motion.button
                    onClick={copyResult}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-1 text-xs text-muted-foreground/50 transition-colors hover:text-foreground"
                  >
                    <AnimatePresence mode="wait">
                      {copied ? (
                        <motion.svg
                          key="check"
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.5, opacity: 0 }}
                          width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                        >
                          <path d="M20 6 9 17l-5-5" />
                        </motion.svg>
                      ) : (
                        <motion.svg
                          key="copy"
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.5, opacity: 0 }}
                          width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                        >
                          <rect width="14" height="14" x="8" y="8" rx="2" />
                          <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                        </motion.svg>
                      )}
                    </AnimatePresence>
                    {copied ? "Copied" : "Copy"}
                  </motion.button>
                  <motion.button
                    onClick={reset}
                    whileTap={{ scale: 0.95 }}
                    className="text-xs text-muted-foreground/40 transition-colors hover:text-foreground"
                  >
                    clear
                  </motion.button>
                </motion.div>
              )}
            </div>

            {/* Streamed text */}
            <p className="mt-3 text-[13.5px] leading-[1.8] text-foreground/80">
              {resultText}
              {state === "streaming" && (
                <span
                  className="ml-0.5 inline-block h-[14px] w-[2px] translate-y-[2px] bg-foreground/60"
                  style={{ animation: "gt-blink 1s step-end infinite" }}
                />
              )}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Footer metadata ── */}
      <AnimatePresence>
        {state === "complete" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-5 flex items-center gap-3 border-t border-border/40 pt-3"
          >
            <ShimmeringText
              text="whisper-large-v3"
              className="font-mono text-[10px]"
              duration={2}
              repeat={false}
              spread={2}
              color="oklch(0.556 0 0 / 0.2)"
              startOnView={false}
            />
            <span className="text-foreground/10">&middot;</span>
            <ShimmeringText
              text={`${TRANSCRIBE_RESULT.split(/\s+/).length} words`}
              className="font-mono text-[10px] tabular-nums"
              duration={2}
              delay={0.1}
              repeat={false}
              spread={2}
              color="oklch(0.556 0 0 / 0.2)"
              startOnView={false}
            />
            <span className="text-foreground/10">&middot;</span>
            <ShimmeringText
              text="2:34"
              className="font-mono text-[10px] tabular-nums"
              duration={2}
              delay={0.2}
              repeat={false}
              spread={2}
              color="oklch(0.556 0 0 / 0.2)"
              startOnView={false}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ─── Tool Calling ─── */

// Available tools with their detection patterns and response generators
interface Tool {
  name: string
  icon: string
  description: string
  patterns: RegExp[]
  extractArgs: (query: string) => Record<string, string>
  generateResult: (args: Record<string, string>) => string
  generateResponse: (args: Record<string, string>, result: string) => string
}

const AVAILABLE_TOOLS: Tool[] = [
  {
    name: "get_weather",
    icon: "☀️",
    description: "Get current weather for a location",
    patterns: [/weather\s+(?:in|for|at)?\s*(.+)/i, /what.*weather.*(?:in|at)?\s*(.+)/i, /how.*(?:hot|cold|warm).*(?:in|at)?\s*(.+)/i],
    extractArgs: (query) => {
      const match = query.match(/(?:weather\s+(?:in|for|at)?\s*|what.*weather.*(?:in|at)?\s*|how.*(?:hot|cold|warm).*(?:in|at)?\s*)(.+?)(?:\?|$)/i)
      return { location: match?.[1]?.trim() || "San Francisco" }
    },
    generateResult: (args) => {
      const temps = [68, 72, 75, 80, 65, 70, 78]
      const conditions = ["Sunny", "Partly Cloudy", "Clear", "Mostly Sunny"]
      const temp = temps[Math.floor(Math.random() * temps.length)]
      const condition = conditions[Math.floor(Math.random() * conditions.length)]
      return JSON.stringify({ location: args.location, temperature: temp, unit: "°F", condition, humidity: "45%" }, null, 2)
    },
    generateResponse: (args, result) => {
      const data = JSON.parse(result)
      return `The current weather in ${data.location} is ${data.temperature}${data.unit} and ${data.condition.toLowerCase()}. Humidity is at ${data.humidity}.`
    },
  },
  {
    name: "calculate",
    icon: "🔢",
    description: "Perform mathematical calculations",
    patterns: [/(?:calculate|compute|what is|what's|solve|evaluate)\s+(.+)/i, /(\d+[\s\d+\-*/().^%]+\d+)/],
    extractArgs: (query) => {
      const match = query.match(/(?:calculate|compute|what is|what's|solve|evaluate)\s+(.+?)(?:\?|$)/i) || query.match(/(\d+[\s\d+\-*/().^%]+)/i)
      return { expression: match?.[1]?.trim() || "2 + 2" }
    },
    generateResult: (args) => {
      try {
        // Simple safe eval for basic math (demo only)
        const expr = args.expression.replace(/[^0-9+\-*/().%\s^]/g, "").replace(/\^/g, "**")
        const result = Function(`"use strict"; return (${expr})`)()
        return JSON.stringify({ expression: args.expression, result: Number(result.toFixed(6)) })
      } catch {
        return JSON.stringify({ expression: args.expression, result: 42, note: "Computed result" })
      }
    },
    generateResponse: (args, result) => {
      const data = JSON.parse(result)
      return `The result of ${data.expression} is **${data.result}**.`
    },
  },
  {
    name: "search_web",
    icon: "🔍",
    description: "Search the web for information",
    patterns: [/search\s+(?:for\s+)?(.+)/i, /find\s+(?:info|information)\s+(?:about|on)\s+(.+)/i, /look\s+up\s+(.+)/i, /what\s+(?:is|are)\s+(.+)/i, /who\s+(?:is|was)\s+(.+)/i],
    extractArgs: (query) => {
      const match = query.match(/(?:search\s+(?:for\s+)?|find\s+(?:info|information)\s+(?:about|on)\s+|look\s+up\s+|what\s+(?:is|are)\s+|who\s+(?:is|was)\s+)(.+?)(?:\?|$)/i)
      return { query: match?.[1]?.trim() || query }
    },
    generateResult: (args) => {
      return JSON.stringify({
        query: args.query,
        results: [
          { title: `${args.query} - Wikipedia`, snippet: `${args.query} is a topic with extensive documentation and research...` },
          { title: `Understanding ${args.query}`, snippet: `A comprehensive guide to ${args.query} and its applications...` },
        ],
        total_results: 2450000,
      }, null, 2)
    },
    generateResponse: (args, result) => {
      const data = JSON.parse(result)
      return `Based on my search for "${data.query}", I found ${data.total_results.toLocaleString()} results. ${data.results[0].snippet}`
    },
  },
  {
    name: "get_time",
    icon: "🕐",
    description: "Get current time in a timezone",
    patterns: [/(?:what|current)?\s*time\s+(?:in|at)?\s*(.+)/i, /what\s+time\s+is\s+it\s+(?:in|at)?\s*(.+)/i],
    extractArgs: (query) => {
      const match = query.match(/time\s+(?:in|at)?\s*(.+?)(?:\?|$)/i)
      return { timezone: match?.[1]?.trim() || "UTC" }
    },
    generateResult: (args) => {
      const now = new Date()
      const hours = now.getHours()
      const mins = now.getMinutes().toString().padStart(2, "0")
      const ampm = hours >= 12 ? "PM" : "AM"
      const h12 = hours % 12 || 12
      return JSON.stringify({ timezone: args.timezone, time: `${h12}:${mins} ${ampm}`, date: now.toLocaleDateString() })
    },
    generateResponse: (args, result) => {
      const data = JSON.parse(result)
      return `The current time in ${data.timezone} is ${data.time} on ${data.date}.`
    },
  },
]

const TC_PLACEHOLDERS = [
  "What's the weather in Tokyo?",
  "Calculate 15% of 250",
  "Search for React best practices",
  "What time is it in London?",
]

// Inline code component
function InlineCode({ children }: { children: React.ReactNode }) {
  return (
    <code className="mx-0.5 rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground/80">
      {children}
    </code>
  )
}

// Detect which tool to use based on query
function detectTool(query: string): Tool | null {
  for (const tool of AVAILABLE_TOOLS) {
    if (tool.patterns.some((p) => p.test(query))) {
      return tool
    }
  }
  return null
}

interface ToolCallState {
  tool: Tool
  args: Record<string, string>
  result: string
  response: string
}

export function ToolCallingPreview() {
  const [state, setState] = useState<"idle" | "thinking" | "calling" | "result" | "generating" | "complete">("idle")
  const [prompt, setPrompt] = useState("")
  const [submittedPrompt, setSubmittedPrompt] = useState("")
  const [toolCall, setToolCall] = useState<ToolCallState | null>(null)
  const [startTime, setStartTime] = useState<number>(0)
  const [duration, setDuration] = useState<string>("0.0")
  const [aiResponse, setAiResponse] = useState("")

  const submit = useCallback(async () => {
    if (!prompt.trim() || state !== "idle") return
    const query = prompt.trim()
    setSubmittedPrompt(query)
    setPrompt("")
    setState("thinking")
    setAiResponse("")
    const start = Date.now()
    setStartTime(start)

    // Detect which tool to use
    const detectedTool = detectTool(query)

    if (detectedTool) {
      const args = detectedTool.extractArgs(query)

      // Simulate thinking delay
      await new Promise(r => setTimeout(r, 800))
      setState("calling")

      // Simulate tool call delay
      await new Promise(r => setTimeout(r, 1000))
      const result = detectedTool.generateResult(args)
      setState("result")

      // Use AI to generate final response based on tool result
      await new Promise(r => setTimeout(r, 400))
      setState("generating")

      try {
        const response = await fetch("/api/preview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [{ role: "user", content: `Tool "${detectedTool.name}" returned: ${result}\n\nProvide a helpful, conversational response to the user's original question: "${query}"` }],
            system: "You are a helpful AI that interprets tool results and provides friendly, concise responses. Keep your response to 1-2 sentences.",
          }),
        })

        if (!response.ok) throw new Error("Failed")

        const reader = response.body?.getReader()
        if (!reader) throw new Error("No reader")

        const decoder = new TextDecoder()
        let fullText = ""

        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          fullText += decoder.decode(value, { stream: true })
          setAiResponse(fullText)
        }

        setToolCall({ tool: detectedTool, args, result, response: fullText })
      } catch {
        const fallbackResponse = detectedTool.generateResponse(args, result)
        setAiResponse(fallbackResponse)
        setToolCall({ tool: detectedTool, args, result, response: fallbackResponse })
      }

      setDuration(((Date.now() - start) / 1000).toFixed(1))
      setState("complete")
    } else {
      // No tool needed - use AI for direct response
      await new Promise(r => setTimeout(r, 500))

      try {
        const response = await fetch("/api/preview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [{ role: "user", content: query }],
            system: "You are a helpful AI assistant. Provide a concise, friendly response.",
          }),
        })

        if (response.ok) {
          const reader = response.body?.getReader()
          if (reader) {
            const decoder = new TextDecoder()
            let fullText = ""
            while (true) {
              const { done, value } = await reader.read()
              if (done) break
              fullText += decoder.decode(value, { stream: true })
              setAiResponse(fullText)
            }
          }
        }
      } catch {
        setAiResponse("I can help with weather, calculations, web searches, and time queries. Try asking one of those!")
      }

      setToolCall(null)
      setDuration(((Date.now() - start) / 1000).toFixed(1))
      setState("complete")
    }
  }, [prompt, state])

  function reset() {
    setState("idle")
    setPrompt("")
    setSubmittedPrompt("")
    setToolCall(null)
    setAiResponse("")
    setDuration("0.0")
  }

  const isProcessing = state !== "idle" && state !== "complete"

  return (
    <div className="mx-auto flex h-[520px] w-full max-w-2xl flex-col justify-end p-4">
      <style>{GT_KEYFRAMES}</style>

      {/* ── Response Area ── */}
      <div className="min-h-0 flex-1 overflow-y-auto scrollbar-hide">
        <AnimatePresence>
          {submittedPrompt && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ type: "spring", duration: 0.4, bounce: 0 }}
              className="space-y-4"
            >
              {/* User Question Bubble */}
              <div className="flex justify-end">
                <div className="max-w-[90%] rounded-2xl bg-foreground px-4 py-3 text-sm leading-relaxed text-background">
                  {submittedPrompt}
                </div>
              </div>

              {/* Thinking state */}
              <AnimatePresence>
                {state === "thinking" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <ShimmeringText
                      text="Analyzing request..."
                      className="text-sm"
                      duration={1.5}
                      spread={1.5}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Tool Call Display */}
              <AnimatePresence>
                {(state === "calling" || state === "result" || state === "complete") && toolCall && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-3"
                  >
                    {/* Tool being called */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5 rounded-md bg-muted/50 px-2 py-1">
                        <span className="text-sm">{toolCall.tool.icon}</span>
                        <span className="font-mono text-xs text-foreground">{toolCall.tool.name}</span>
                      </div>
                      {state === "calling" && (
                        <CircleSpinner size={14} className="text-muted-foreground" />
                      )}
                      {(state === "result" || state === "complete") && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-green-600">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </div>

                    {/* Tool Arguments */}
                    <div className="rounded-lg border border-border/60 bg-muted/30 p-3">
                      <p className="mb-1.5 text-xs font-medium text-muted-foreground">Arguments</p>
                      <pre className="font-mono text-xs text-foreground/90">
                        {JSON.stringify(toolCall.args, null, 2)}
                      </pre>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Calling shimmer */}
              <AnimatePresence>
                {state === "calling" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <ShimmeringText
                      text="Executing tool..."
                      className="text-sm"
                      duration={1.5}
                      spread={1.5}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Tool Result */}
              <AnimatePresence>
                {(state === "result" || state === "complete") && toolCall && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-lg border border-border/60 bg-muted/30 p-3"
                  >
                    <p className="mb-1.5 text-xs font-medium text-muted-foreground">Result</p>
                    <pre className="font-mono text-xs text-foreground/90 whitespace-pre-wrap">
                      {toolCall.result}
                    </pre>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Result processing shimmer */}
              <AnimatePresence>
                {(state === "result" || state === "generating") && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <ShimmeringText
                      text={state === "generating" ? "Generating response..." : "Processing result..."}
                      className="text-sm"
                      duration={1.5}
                      spread={1.5}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Streaming AI Response */}
              <AnimatePresence>
                {state === "generating" && aiResponse && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <p className="text-sm leading-relaxed text-foreground">
                      {aiResponse}
                      <span className="ml-0.5 inline-block h-3 w-0.5 animate-pulse bg-foreground/60" />
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Final Response */}
              <AnimatePresence>
                {state === "complete" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="space-y-4"
                  >
                    <p className="text-sm leading-relaxed text-foreground">
                      {aiResponse || "I can help you with that! Try asking about the weather, calculations, searching the web, or checking the time in different locations."}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>
                        {toolCall ? `1 tool used · ${duration}s` : `No tools needed · ${duration}s`}
                      </span>
                      <button
                        onClick={reset}
                        className="transition-colors hover:text-foreground"
                      >
                        Clear
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Suggestion Pills ── */}
      <AnimatePresence>
        {!prompt && state === "idle" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mb-3 flex flex-wrap justify-center gap-2"
          >
            {TC_PLACEHOLDERS.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => setPrompt(suggestion)}
                className="rounded-full border border-border/60 bg-card/50 px-4 py-2 text-sm text-muted-foreground transition-all duration-150 hover:border-foreground/20 hover:bg-card hover:text-foreground"
              >
                {suggestion}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main Input Container ── */}
      <div className="rounded-3xl border border-border bg-background p-3 shadow-xs">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              submit()
            }
          }}
          disabled={isProcessing}
          placeholder="Ask something that needs a tool..."
          rows={1}
          className="min-h-[44px] w-full resize-none border-none bg-transparent px-2 py-2 text-base text-foreground outline-none placeholder:text-muted-foreground disabled:opacity-50"
        />

        {/* Actions bar */}
        <div className="flex items-center justify-between px-1">
          {/* Tool indicator */}
          <div className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground">
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
            </svg>
            <span className="text-xs font-medium text-muted-foreground">4 Tools</span>
          </div>

          {/* Send button */}
          <motion.button
            onClick={submit}
            disabled={!prompt.trim() || isProcessing}
            whileTap={{ scale: 0.92 }}
            className={cn(
              "flex size-9 items-center justify-center rounded-full transition-all",
              prompt.trim() && !isProcessing
                ? "bg-foreground text-background"
                : "bg-foreground/10 text-muted-foreground/50"
            )}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
          </motion.button>
        </div>
      </div>

      {/* Keyboard hint */}
      <p className="mt-2.5 text-center text-xs text-muted-foreground">
        <span className="rounded border border-border px-1.5 py-0.5 font-mono text-[10px]">↵</span>
        <span className="ml-1.5">send</span>
      </p>
    </div>
  )
}

/* ─── Agent with Control & Trust Patterns ─── */

// Agent action types with risk levels
type AgentActionType = "search" | "read" | "write" | "terminal"
type RiskLevel = "safe" | "moderate" | "risky"
type AutonomyLevel = "manual" | "semi" | "auto"

interface AgentStep {
  id: string
  type: AgentActionType
  description: string
  target: string
  risk: RiskLevel
  status: "pending" | "approved" | "running" | "complete" | "skipped" | "undone"
  result?: string
  tokens?: number
}

// Generate dynamic plan based on task
function generateAgentSteps(task: string): AgentStep[] {
  const taskLower = task.toLowerCase()

  if (taskLower.includes("dark mode") || taskLower.includes("toggle") || taskLower.includes("theme")) {
    return [
      { id: "1", type: "search", description: "Find existing theme configuration", target: "src/**/*theme*", risk: "safe", status: "pending", tokens: 120 },
      { id: "2", type: "read", description: "Analyze current styling approach", target: "src/styles/globals.css", risk: "safe", status: "pending", tokens: 85 },
      { id: "3", type: "write", description: "Create theme context provider", target: "src/contexts/ThemeContext.tsx", risk: "moderate", status: "pending", tokens: 340 },
      { id: "4", type: "write", description: "Add toggle component", target: "src/components/ThemeToggle.tsx", risk: "moderate", status: "pending", tokens: 210 },
      { id: "5", type: "terminal", description: "Run type check", target: "npm run typecheck", risk: "safe", status: "pending", tokens: 45 },
    ]
  }

  if (taskLower.includes("fix") || taskLower.includes("bug")) {
    return [
      { id: "1", type: "search", description: "Search for error patterns", target: "src/**/*.{ts,tsx}", risk: "safe", status: "pending", tokens: 150 },
      { id: "2", type: "read", description: "Read error source file", target: "src/utils/api.ts", risk: "safe", status: "pending", tokens: 95 },
      { id: "3", type: "write", description: "Apply bug fix", target: "src/utils/api.ts", risk: "moderate", status: "pending", tokens: 180 },
      { id: "4", type: "terminal", description: "Run test suite", target: "npm run test", risk: "safe", status: "pending", tokens: 60 },
    ]
  }

  if (taskLower.includes("test")) {
    return [
      { id: "1", type: "read", description: "Analyze component to test", target: "src/components/Button.tsx", risk: "safe", status: "pending", tokens: 110 },
      { id: "2", type: "write", description: "Create test file", target: "src/components/Button.test.tsx", risk: "safe", status: "pending", tokens: 290 },
      { id: "3", type: "terminal", description: "Execute tests", target: "npm run test Button", risk: "safe", status: "pending", tokens: 55 },
    ]
  }

  return [
    { id: "1", type: "search", description: "Explore codebase structure", target: "src/**/*", risk: "safe", status: "pending", tokens: 130 },
    { id: "2", type: "read", description: "Read relevant files", target: "src/index.ts", risk: "safe", status: "pending", tokens: 90 },
    { id: "3", type: "write", description: "Implement changes", target: "src/feature.ts", risk: "moderate", status: "pending", tokens: 250 },
    { id: "4", type: "terminal", description: "Verify build", target: "npm run build", risk: "safe", status: "pending", tokens: 50 },
  ]
}

// Generate result based on step type
function generateStepResult(step: AgentStep): string {
  switch (step.type) {
    case "search":
      return `Found 3 matching files:\n• ${step.target.replace("**/*", "config/theme.ts")}\n• ${step.target.replace("**/*", "hooks/useTheme.ts")}\n• ${step.target.replace("**/*", "components/ThemeProvider.tsx")}`
    case "read":
      return `Analyzed ${step.target}\n• 124 lines of code\n• 3 exports found\n• No issues detected`
    case "write":
      return `✓ Successfully wrote to ${step.target}\n• Added 45 lines\n• Modified 12 lines`
    case "terminal":
      return step.target.includes("test")
        ? `✓ All tests passed (8/8)\n• 100% coverage on modified files`
        : `✓ ${step.target} completed successfully`
    default:
      return "✓ Completed"
  }
}

const AGENT_SUGGESTIONS = [
  "Add dark mode toggle",
  "Fix the login bug",
  "Write tests for Button",
  "Refactor API calls",
]

// Step icon based on type and status
function StepIcon({ type, status, risk }: { type: AgentActionType; status: string; risk: RiskLevel }) {
  if (status === "running") {
    return <CircleSpinner size={14} className="text-foreground" />
  }
  if (status === "complete") {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-green-600">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    )
  }
  if (status === "skipped") {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground/50">
        <path d="M5 12h14" />
      </svg>
    )
  }
  if (status === "undone") {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-yellow-600">
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
        <path d="M3 3v5h5" />
      </svg>
    )
  }

  const icons: Record<AgentActionType, React.ReactNode> = {
    search: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground">
        <circle cx="11" cy="11" r="8" />
        <path d="M21 21l-4.35-4.35" />
      </svg>
    ),
    read: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
      </svg>
    ),
    write: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={risk === "risky" ? "text-red-500" : risk === "moderate" ? "text-yellow-600" : "text-muted-foreground"}>
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    ),
    terminal: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground">
        <polyline points="4 17 10 11 4 5" />
        <line x1="12" y1="19" x2="20" y2="19" />
      </svg>
    ),
  }
  return icons[type]
}

// Risk badge
function RiskBadge({ risk }: { risk: RiskLevel }) {
  const styles = {
    safe: "bg-green-500/10 text-green-600",
    moderate: "bg-yellow-500/10 text-yellow-600",
    risky: "bg-red-500/10 text-red-500",
  }
  return (
    <span className={cn("rounded px-1.5 py-0.5 text-[10px] font-medium", styles[risk])}>
      {risk}
    </span>
  )
}

export function AgentSetupPreview() {
  const [state, setState] = useState<"idle" | "planning" | "reviewing" | "running" | "paused" | "complete">("idle")
  const [autonomy, setAutonomy] = useState<AutonomyLevel>("semi")
  const [prompt, setPrompt] = useState("")
  const [submittedPrompt, setSubmittedPrompt] = useState("")
  const [steps, setSteps] = useState<AgentStep[]>([])
  const [currentStepIndex, setCurrentStepIndex] = useState(-1)
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set())
  const [elapsedTime, setElapsedTime] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<string[]>([])
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const executionRef = useRef<{ cancelled: boolean; paused: boolean }>({ cancelled: false, paused: false })
  const scrollRef = useRef<HTMLDivElement>(null)

  const totalTokens = steps.reduce((sum, s) => sum + (s.tokens || 0), 0)
  const usedTokens = steps.filter(s => s.status === "complete").reduce((sum, s) => sum + (s.tokens || 0), 0)

  // Submit task and generate plan
  function submitTask() {
    if (!prompt.trim() || state !== "idle") return
    const task = prompt.trim()
    setSubmittedPrompt(task)
    setPrompt("")
    setState("planning")

    // Generate plan after short delay
    setTimeout(() => {
      const plan = generateAgentSteps(task)
      setSteps(plan)
      setState("reviewing")
    }, 800)
  }

  // Approve plan and start execution
  function approvePlan(runAll: boolean) {
    if (runAll || autonomy === "auto") {
      setSteps(prev => prev.map(s => ({ ...s, status: "approved" as const })))
    }
    startExecution()
  }

  // Start or resume execution
  function startExecution() {
    setState("running")
    executionRef.current = { cancelled: false, paused: false }
    setElapsedTime(0)

    timerRef.current = setInterval(() => {
      setElapsedTime(t => t + 0.1)
    }, 100)

    executeNextStep(0)
  }

  // Execute steps sequentially
  function executeNextStep(index: number) {
    if (executionRef.current.cancelled) return
    if (executionRef.current.paused) {
      setState("paused")
      return
    }

    const pendingSteps = steps.filter(s => s.status === "pending" || s.status === "approved")
    if (pendingSteps.length === 0 || index >= steps.length) {
      completeExecution()
      return
    }

    const step = steps[index]
    if (step.status === "skipped" || step.status === "complete" || step.status === "undone") {
      executeNextStep(index + 1)
      return
    }

    // In manual mode, wait for approval
    if (autonomy === "manual" && step.status === "pending") {
      setCurrentStepIndex(index)
      setState("paused")
      return
    }

    // Execute step
    setCurrentStepIndex(index)
    setSteps(prev => prev.map((s, i) => i === index ? { ...s, status: "running" as const } : s))

    setTimeout(() => {
      if (executionRef.current.cancelled) return

      const result = generateStepResult(step)
      setSteps(prev => prev.map((s, i) => i === index ? { ...s, status: "complete" as const, result } : s))
      setCompletedSteps(prev => [...prev, step.id])
      setExpandedSteps(prev => new Set(prev).add(step.id))

      setTimeout(() => executeNextStep(index + 1), 200)
    }, 500 + Math.random() * 300)
  }

  // Complete execution
  function completeExecution() {
    if (timerRef.current) clearInterval(timerRef.current)
    setState("complete")
  }

  // Pause execution
  function pauseExecution() {
    executionRef.current.paused = true
    setState("paused")
  }

  // Resume execution
  function resumeExecution() {
    executionRef.current.paused = false
    setState("running")

    if (!timerRef.current) {
      timerRef.current = setInterval(() => setElapsedTime(t => t + 0.1), 100)
    }

    executeNextStep(currentStepIndex)
  }

  // Approve single step (manual mode)
  function approveStep(stepId: string) {
    setSteps(prev => prev.map(s => s.id === stepId ? { ...s, status: "approved" as const } : s))
    resumeExecution()
  }

  // Skip a step
  function skipStep(stepId: string) {
    setSteps(prev => prev.map(s => s.id === stepId ? { ...s, status: "skipped" as const } : s))
    if (state === "paused") {
      resumeExecution()
    }
  }

  // Undo last completed step
  function undoLastStep() {
    if (completedSteps.length === 0) return
    const lastId = completedSteps[completedSteps.length - 1]
    setSteps(prev => prev.map(s => s.id === lastId ? { ...s, status: "undone" as const, result: undefined } : s))
    setCompletedSteps(prev => prev.slice(0, -1))
  }

  // Abort and reset
  function abort() {
    executionRef.current.cancelled = true
    if (timerRef.current) clearInterval(timerRef.current)
    reset()
  }

  // Full reset
  function reset() {
    if (timerRef.current) clearInterval(timerRef.current)
    setState("idle")
    setPrompt("")
    setSubmittedPrompt("")
    setSteps([])
    setCurrentStepIndex(-1)
    setExpandedSteps(new Set())
    setElapsedTime(0)
    setCompletedSteps([])
    executionRef.current = { cancelled: false, paused: false }
  }

  function toggleStep(stepId: string) {
    setExpandedSteps(prev => {
      const next = new Set(prev)
      if (next.has(stepId)) next.delete(stepId)
      else next.add(stepId)
      return next
    })
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  useEffect(() => {
    if (scrollRef.current && (state === "running" || state === "reviewing")) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [currentStepIndex, state, steps])

  const isActive = state !== "idle"

  return (
    <div className="mx-auto flex h-[520px] w-full max-w-2xl flex-col p-4">
      <style>{GT_KEYFRAMES}</style>

      {/* ── Main Content Area ── */}
      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto scrollbar-hide">
        <AnimatePresence mode="wait">
          {/* Planning State */}
          {state === "planning" && (
            <motion.div
              key="planning"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="flex justify-end">
                <div className="max-w-[85%] rounded-2xl bg-foreground px-4 py-3 text-sm text-background">
                  {submittedPrompt}
                </div>
              </div>
              <ShimmeringText text="Planning steps..." className="text-sm" duration={1.5} spread={1.5} />
            </motion.div>
          )}

          {/* Review State - INTENT PREVIEW */}
          {state === "reviewing" && (
            <motion.div
              key="reviewing"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {/* Task */}
              <div className="flex justify-end">
                <div className="max-w-[85%] rounded-2xl bg-foreground px-4 py-3 text-sm text-background">
                  {submittedPrompt}
                </div>
              </div>

              {/* Plan Header */}
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-foreground">Proposed Plan</p>
                <span className="text-xs text-muted-foreground">~{totalTokens} tokens</span>
              </div>

              {/* Steps Preview */}
              <div className="space-y-2">
                {steps.map((step, index) => (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-3 rounded-lg border border-border/60 bg-background p-3"
                  >
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-muted text-xs text-muted-foreground">
                      {index + 1}
                    </span>
                    <StepIcon type={step.type} status={step.status} risk={step.risk} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground">{step.description}</p>
                      <p className="mt-0.5 truncate font-mono text-xs text-muted-foreground">{step.target}</p>
                    </div>
                    <RiskBadge risk={step.risk} />
                  </motion.div>
                ))}
              </div>

              {/* Approval Buttons */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => approvePlan(true)}
                  className="flex-1 rounded-lg bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
                >
                  Approve & Run All
                </button>
                <button
                  onClick={() => { setAutonomy("manual"); approvePlan(false) }}
                  className="rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                >
                  Step by Step
                </button>
                <button
                  onClick={reset}
                  className="rounded-lg border border-border px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          )}

          {/* Running / Paused / Complete State */}
          {(state === "running" || state === "paused" || state === "complete") && (
            <motion.div
              key="executing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {/* Task */}
              <div className="flex justify-end">
                <div className="max-w-[85%] rounded-2xl bg-foreground px-4 py-3 text-sm text-background">
                  {submittedPrompt}
                </div>
              </div>

              {/* Execution Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {state === "running" && <CircleSpinner size={14} className="text-foreground" />}
                  {state === "paused" && (
                    <span className="rounded bg-yellow-500/10 px-2 py-0.5 text-xs font-medium text-yellow-600">
                      Paused
                    </span>
                  )}
                  {state === "complete" && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-green-600">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                  <span className="text-sm text-foreground">
                    {state === "complete" ? "Completed" : state === "paused" ? "Awaiting action" : "Executing..."}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">{usedTokens}/{totalTokens} tokens · {elapsedTime.toFixed(1)}s</span>
              </div>

              {/* Steps */}
              <div className="space-y-2">
                {steps.map((step, index) => (
                  <div
                    key={step.id}
                    className={cn(
                      "rounded-lg border transition-all",
                      step.status === "running" ? "border-foreground/30 bg-foreground/5" :
                      step.status === "complete" ? "border-border/60 bg-background" :
                      step.status === "skipped" ? "border-border/40 bg-background opacity-40" :
                      step.status === "undone" ? "border-yellow-500/30 bg-yellow-500/5" :
                      index === currentStepIndex && state === "paused" ? "border-yellow-500/50 bg-yellow-500/5" :
                      "border-border/40 bg-background opacity-60"
                    )}
                  >
                    <button
                      onClick={() => step.result && toggleStep(step.id)}
                      className="flex w-full items-center gap-3 p-3 text-left"
                    >
                      <StepIcon type={step.type} status={step.status} risk={step.risk} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground">{step.description}</p>
                        <p className="mt-0.5 truncate font-mono text-xs text-muted-foreground">{step.target}</p>
                      </div>
                      {step.result && (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                          className={cn("shrink-0 text-muted-foreground transition-transform", expandedSteps.has(step.id) && "rotate-180")}>
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      )}
                    </button>

                    {/* Expanded Result */}
                    <AnimatePresence>
                      {step.result && expandedSteps.has(step.id) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="border-t border-border/40 bg-muted/30 p-3">
                            <pre className="whitespace-pre-wrap font-mono text-xs text-foreground/80">{step.result}</pre>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Manual Mode: Approve/Skip buttons */}
                    {state === "paused" && autonomy === "manual" && step.status === "pending" && index === currentStepIndex && (
                      <div className="flex gap-2 border-t border-border/40 p-3">
                        <button
                          onClick={() => approveStep(step.id)}
                          className="flex-1 rounded-md bg-foreground px-3 py-1.5 text-xs font-medium text-background"
                        >
                          Run this step
                        </button>
                        <button
                          onClick={() => skipStep(step.id)}
                          className="rounded-md border border-border px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground"
                        >
                          Skip
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Control Bar */}
              {(state === "running" || state === "paused") && autonomy !== "manual" && (
                <div className="flex items-center gap-2 pt-2">
                  {state === "running" ? (
                    <button
                      onClick={pauseExecution}
                      className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm text-foreground hover:bg-muted"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <rect x="6" y="4" width="4" height="16" rx="1" />
                        <rect x="14" y="4" width="4" height="16" rx="1" />
                      </svg>
                      Pause
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={resumeExecution}
                        className="flex items-center gap-2 rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                        Resume
                      </button>
                      {completedSteps.length > 0 && (
                        <button
                          onClick={undoLastStep}
                          className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                            <path d="M3 3v5h5" />
                          </svg>
                          Undo
                        </button>
                      )}
                      <button
                        onClick={abort}
                        className="rounded-lg border border-red-500/30 px-3 py-2 text-sm text-red-500 hover:bg-red-500/10"
                      >
                        Abort
                      </button>
                    </>
                  )}
                </div>
              )}

              {/* Complete Footer */}
              {state === "complete" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-between border-t border-border/40 pt-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">
                      {completedSteps.length} steps · {elapsedTime.toFixed(1)}s
                    </span>
                    {completedSteps.length > 0 && (
                      <button
                        onClick={undoLastStep}
                        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                        </svg>
                        Undo last
                      </button>
                    )}
                  </div>
                  <button onClick={reset} className="text-xs text-muted-foreground hover:text-foreground">
                    New task
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Suggestion Pills (idle only) ── */}
      <AnimatePresence>
        {state === "idle" && !prompt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mb-3 flex flex-wrap justify-center gap-2"
          >
            {AGENT_SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => setPrompt(s)}
                className="rounded-full border border-border/60 bg-card/50 px-4 py-2 text-sm text-muted-foreground transition-all duration-150 hover:border-foreground/20 hover:bg-card hover:text-foreground"
              >
                {s}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Input Container ── */}
      <div className={cn(
        "rounded-3xl border border-border bg-background p-3 shadow-xs transition-opacity",
        (state === "planning" || state === "reviewing" || state === "running" || state === "paused") && "opacity-50"
      )}>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              if (state === "idle" || state === "complete") {
                submitTask()
              }
            }
          }}
          disabled={state !== "idle" && state !== "complete"}
          placeholder={state === "complete" ? "Start a new task..." : "Describe a task for the agent..."}
          rows={1}
          className="min-h-[44px] w-full resize-none bg-transparent px-2 py-2 text-base text-foreground outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
        />

        <div className="flex items-center justify-between px-1">
          {/* Autonomy Selector */}
          <div className="flex items-center gap-1 rounded-full border border-border p-0.5">
            {(["manual", "semi", "auto"] as const).map((level) => (
              <button
                key={level}
                onClick={() => setAutonomy(level)}
                disabled={state !== "idle" && state !== "complete"}
                className={cn(
                  "rounded-full px-2.5 py-1 text-xs font-medium transition-all",
                  autonomy === level
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground",
                  (state !== "idle" && state !== "complete") && "pointer-events-none"
                )}
              >
                {level === "manual" ? "Manual" : level === "semi" ? "Semi" : "Auto"}
              </button>
            ))}
          </div>

          <motion.button
            onClick={submitTask}
            disabled={!prompt.trim() || (state !== "idle" && state !== "complete")}
            whileTap={{ scale: 0.92 }}
            className={cn(
              "flex size-9 items-center justify-center rounded-full transition-all",
              prompt.trim() && (state === "idle" || state === "complete")
                ? "bg-foreground text-background"
                : "bg-foreground/10 text-muted-foreground/50"
            )}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
          </motion.button>
        </div>
      </div>

      <p className="mt-2.5 text-center text-xs text-muted-foreground">
        <span className="rounded border border-border px-1.5 py-0.5 font-mono text-[10px]">↵</span>
        <span className="ml-1.5">{state === "complete" ? "new task" : "start agent"}</span>
      </p>
    </div>
  )
}

/* ─── Generate Text: Multi-Model ─── */

const MM_MODELS = [
  {
    name: "Gemini 2.0 Flash",
    color: "#4285f4",
    delay: 1200,
    response:
      "Recursion: a technique where a function invokes itself with a modified input. Two requirements: (1) a base case that terminates the chain, (2) a recursive step that reduces toward it. Common in tree traversal, divide-and-conquer, and backtracking. Typical gotcha: stack overflow from missing base cases.",
    tokens: 46,
  },
  {
    name: "GPT-4o",
    color: "#10a37f",
    delay: 1800,
    response:
      "Recursion is when a function calls itself to solve a problem by breaking it into smaller subproblems. Each call works on a simpler version until reaching a base case — a condition simple enough to solve directly. The results then build back up through the call stack to form the complete answer.",
    tokens: 49,
  },
  {
    name: "Claude Sonnet 4",
    color: "#d97757",
    delay: 2500,
    response:
      "Think of recursion like standing between two mirrors — you see reflections of reflections, each one slightly smaller. In code, a recursive function calls itself with a simpler input. The trick is knowing when to stop: without a base case, you'd recurse forever. It's elegant because it lets you describe complex structures through self-similarity.",
    tokens: 57,
  },
]

const MM_TOTAL_TOKENS = MM_MODELS.reduce((s, m) => s + m.tokens, 0)

const MM_PLACEHOLDERS = [
  "What is recursion?",
  "Explain REST vs GraphQL...",
  "How does garbage collection work?",
  "What are closures in JavaScript?",
]

export function GenerateTextMultiModelPreview() {
  const [state, setState] = useState<"idle" | "generating" | "complete">("idle")
  const [prompt, setPrompt] = useState("")
  const [submittedPrompt, setSubmittedPrompt] = useState("")
  const [completed, setCompleted] = useState<Set<number>>(new Set())
  const completedRef = useRef(0)
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])

  function submit() {
    if (!prompt.trim() || state === "generating") return
    setSubmittedPrompt(prompt.trim())
    setPrompt("")
    setState("generating")
    setCompleted(new Set())
    completedRef.current = 0

    MM_MODELS.forEach((model, i) => {
      const timer = setTimeout(() => {
        setCompleted((prev) => new Set(prev).add(i))
        completedRef.current++
        if (completedRef.current === MM_MODELS.length) setState("complete")
      }, model.delay)
      timersRef.current.push(timer)
    })
  }

  function reset() {
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []
    setState("idle")
    setPrompt("")
    setSubmittedPrompt("")
    setCompleted(new Set())
    completedRef.current = 0
  }

  useEffect(
    () => () => {
      timersRef.current.forEach(clearTimeout)
    },
    []
  )

  const isActive = state === "generating" || state === "complete"

  return (
    <div className="mx-auto flex h-[460px] w-full max-w-2xl flex-col justify-end p-4">
      <style>{GT_KEYFRAMES}</style>

      {/* ── Response Cards Area ── */}
      <div className="min-h-0 flex-1 overflow-y-auto scrollbar-hide">
        <AnimatePresence>
          {submittedPrompt && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ type: "spring", duration: 0.4, bounce: 0 }}
              className="mb-4"
            >
              {/* User prompt as header */}
              <div className="mb-3 flex items-center gap-2">
                <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-foreground/10">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-foreground">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-foreground">{submittedPrompt}</span>
              </div>

              {/* Model Response Cards */}
              <div className="space-y-2.5">
                {MM_MODELS.map((model, i) => {
                  const done = completed.has(i)
                  return (
                    <motion.div
                      key={model.name}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: i * 0.06,
                        type: "spring",
                        duration: 0.4,
                        bounce: 0,
                      }}
                      className="rounded-xl border border-border bg-card/50 p-3.5"
                    >
                      {/* Model header */}
                      <div className="mb-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <motion.span
                            className="size-2.5 rounded-full"
                            style={{ backgroundColor: model.color }}
                            animate={
                              done
                                ? { scale: 1, opacity: 1 }
                                : {
                                    scale: [1, 1.4, 1],
                                    opacity: [0.6, 1, 0.6],
                                  }
                            }
                            transition={
                              done
                                ? { duration: 0.2 }
                                : { repeat: Infinity, duration: 1.2 }
                            }
                          />
                          <span className="text-sm font-medium text-foreground">
                            {model.name}
                          </span>
                        </div>
                        {done && (
                          <motion.div
                            initial={{ opacity: 0, x: 4 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-2 text-xs text-muted-foreground"
                          >
                            <span>{(model.delay / 1000).toFixed(1)}s</span>
                            <span className="text-border">·</span>
                            <span>{model.tokens} tokens</span>
                          </motion.div>
                        )}
                      </div>

                      {/* Response or loader */}
                      {done ? (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                          className="text-sm leading-relaxed text-foreground/80"
                        >
                          {model.response}
                        </motion.p>
                      ) : (
                        <div className="py-1">
                          <WaveDotsLoader />
                        </div>
                      )}
                    </motion.div>
                  )
                })}
              </div>

              {/* Summary footer */}
              {state === "complete" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="mt-3 flex items-center justify-between"
                >
                  <span className="text-xs text-muted-foreground">
                    {MM_MODELS.length} models · {(Math.max(...MM_MODELS.map((m) => m.delay)) / 1000).toFixed(1)}s · {MM_TOTAL_TOKENS} tokens
                  </span>
                  <button
                    onClick={reset}
                    className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Clear
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Suggestion Pills ── */}
      <AnimatePresence>
        {!prompt && state === "idle" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mb-3 flex flex-wrap justify-center gap-2"
          >
            {MM_PLACEHOLDERS.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => setPrompt(suggestion)}
                className="rounded-full border border-border/60 bg-card/50 px-4 py-2 text-sm text-muted-foreground transition-all duration-150 hover:border-foreground/20 hover:bg-card hover:text-foreground"
              >
                {suggestion}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main Input Container ── */}
      <div className="rounded-3xl border border-border bg-background p-3 shadow-xs">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              submit()
            }
          }}
          placeholder="Compare across models..."
          rows={1}
          className="min-h-[44px] w-full resize-none border-none bg-transparent px-2 py-2 text-base text-foreground outline-none placeholder:text-muted-foreground"
        />

        {/* Actions bar */}
        <div className="flex items-center justify-between px-1">
          {/* Model indicator pill */}
          <div className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5">
            <div className="flex items-center -space-x-0.5">
              {MM_MODELS.map((m) => (
                <span
                  key={m.name}
                  className="size-2 rounded-full ring-1 ring-background"
                  style={{ backgroundColor: m.color }}
                />
              ))}
            </div>
            <span className="text-xs font-medium text-muted-foreground">3 models</span>
          </div>

          {/* Send button */}
          <motion.button
            onClick={submit}
            disabled={!prompt.trim() || state === "generating"}
            whileTap={{ scale: 0.92 }}
            className={cn(
              "flex size-9 items-center justify-center rounded-full transition-all",
              prompt.trim() && state !== "generating"
                ? "bg-foreground text-background"
                : "bg-foreground/10 text-muted-foreground/50"
            )}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
          </motion.button>
        </div>
      </div>

      {/* Keyboard hint */}
      <p className="mt-2.5 text-center text-xs text-muted-foreground">
        <span className="rounded border border-border px-1.5 py-0.5 font-mono text-[10px]">↵</span>
        <span className="ml-1.5">send to all models</span>
      </p>
    </div>
  )
}

/* ─── Generate Text: Prompt Engineering ─── */

const PE_PERSONAS = [
  {
    id: "concise",
    label: "Concise",
    system: "You are a concise technical engineer. Use bullet points. Be direct.",
    response:
      "\u2022 A function that calls itself with a reduced input\n\u2022 Requires a base case to terminate \u2014 without one, stack overflow\n\u2022 Key patterns: divide & conquer, tree traversal, backtracking\n\u2022 Performance: prefer tail recursion or iteration for deep stacks",
    tokens: 38,
  },
  {
    id: "creative",
    label: "Creative",
    system:
      "You are a creative writer. Use vivid metaphors and storytelling.",
    response:
      "Imagine a storyteller who, mid-tale, pauses to tell a smaller story \u2014 and within that story, tells an even smaller one. Each story must find its ending before the previous one can resume.\n\nThat\u2019s recursion: the art of solving a puzzle by solving a smaller version of the same puzzle, all the way down until you reach something so simple it answers itself.",
    tokens: 58,
  },
  {
    id: "eli5",
    label: "ELI5",
    system: "Explain to a 5-year-old. Use simple words and fun analogies.",
    response:
      "You know those Russian dolls? Open the big one \u2014 there\u2019s a smaller one inside! Open that one \u2014 even smaller!\n\nRecursion is like that. You have a big problem, and to solve it you solve a teeny tiny version of the same problem. You keep going until it\u2019s SO small you just know the answer. Then you put all the answers back together like stacking the dolls up again!",
    tokens: 64,
  },
]

const PE_PLACEHOLDERS = [
  "What is recursion?",
  "How does a compiler work?",
  "Explain the internet...",
  "What is a neural network?",
]

export function GenerateTextPromptPreview() {
  const [state, setState] = useState<"idle" | "thinking" | "streaming" | "complete">("idle")
  const [prompt, setPrompt] = useState("")
  const [submittedPrompt, setSubmittedPrompt] = useState("")
  const [activePersona, setActivePersona] = useState(0)
  const [temperature, setTemperature] = useState(0.7)
  const [elapsed, setElapsed] = useState(0)
  const [showSystem, setShowSystem] = useState(false)
  const [response, setResponse] = useState("")
  const t0Ref = useRef(0)
  const abortRef = useRef<AbortController | null>(null)

  const generate = useCallback(async (userPrompt: string, personaIdx: number) => {
    const persona = PE_PERSONAS[personaIdx]
    setState("thinking")
    setResponse("")
    t0Ref.current = Date.now()

    // Abort any previous request
    if (abortRef.current) abortRef.current.abort()
    abortRef.current = new AbortController()

    try {
      const res = await fetch("/api/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: userPrompt }],
          system: persona.system,
        }),
        signal: abortRef.current.signal,
      })

      if (!res.ok) throw new Error("Failed to fetch")

      const reader = res.body?.getReader()
      if (!reader) throw new Error("No reader")

      setState("streaming")
      const decoder = new TextDecoder()
      let fullText = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        fullText += decoder.decode(value, { stream: true })
        setResponse(fullText)
      }

      setElapsed(Date.now() - t0Ref.current)
      setState("complete")
    } catch (error) {
      if ((error as Error).name === "AbortError") return
      // Fallback to persona's default response
      setResponse(persona.response)
      setElapsed(Date.now() - t0Ref.current)
      setState("complete")
    }
  }, [])

  function submit() {
    if (!prompt.trim() || state === "thinking" || state === "streaming") return
    const userPrompt = prompt.trim()
    setSubmittedPrompt(userPrompt)
    setPrompt("")
    generate(userPrompt, activePersona)
  }

  function switchPersona(idx: number) {
    setActivePersona(idx)
    if ((state === "complete" || state === "streaming") && submittedPrompt) {
      generate(submittedPrompt, idx)
    }
  }

  function reset() {
    if (abortRef.current) abortRef.current.abort()
    setState("idle")
    setPrompt("")
    setSubmittedPrompt("")
    setResponse("")
    setElapsed(0)
    setShowSystem(false)
  }

  useEffect(() => {
    return () => {
      if (abortRef.current) abortRef.current.abort()
    }
  }, [])

  const persona = PE_PERSONAS[activePersona]

  return (
    <div className="mx-auto flex h-[480px] w-full max-w-2xl flex-col justify-end p-4">
      <style>{GT_KEYFRAMES}</style>

      {/* ── Response Area ── */}
      <div className="min-h-0 flex-1 overflow-y-auto scrollbar-hide">
        <AnimatePresence>
          {submittedPrompt && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ type: "spring", duration: 0.4, bounce: 0 }}
              className="mb-4"
            >
              {/* Question Bubble */}
              <div className="mb-4 flex justify-end">
                <div className="max-w-[85%] rounded-2xl bg-foreground px-4 py-3 text-sm leading-relaxed text-background">
                  {submittedPrompt}
                </div>
              </div>

              {/* Response */}
              <AnimatePresence mode="wait">
                {state === "thinking" ? (
                  <motion.div
                    key="thinking"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ShimmeringText
                      text="Generating response..."
                      className="text-base leading-relaxed"
                      duration={1.5}
                      spread={1.5}
                    />
                  </motion.div>
                ) : state === "streaming" ? (
                  <motion.div
                    key="streaming"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <p className="whitespace-pre-wrap text-base leading-[1.8] text-foreground/80">
                      {response}
                      <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-foreground/60" />
                    </p>
                  </motion.div>
                ) : state === "complete" ? (
                  <motion.div
                    key="complete"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="whitespace-pre-wrap text-base leading-[1.8] text-foreground/80">
                      {response}
                    </p>
                    <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                      <span>Generated in {(elapsed / 1000).toFixed(1)}s</span>
                      <button
                        onClick={reset}
                        className="transition-colors hover:text-foreground"
                      >
                        Clear
                      </button>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Suggestion Pills ── */}
      <AnimatePresence>
        {!prompt && state === "idle" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mb-3 flex flex-wrap justify-center gap-2"
          >
            {PE_PLACEHOLDERS.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => setPrompt(suggestion)}
                className="rounded-full border border-border/60 bg-card/50 px-4 py-2 text-sm text-muted-foreground transition-all duration-150 hover:border-foreground/20 hover:bg-card hover:text-foreground"
              >
                {suggestion}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main Input Container ── */}
      <div className="rounded-3xl border border-border bg-background p-3 shadow-xs">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              submit()
            }
          }}
          placeholder="Ask anything..."
          rows={1}
          className="min-h-[44px] w-full resize-none border-none bg-transparent px-2 py-2 text-base text-foreground outline-none placeholder:text-muted-foreground"
        />

        {/* Actions bar */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            {/* Persona selector */}
            <div className="flex items-center gap-0.5 rounded-full border border-border p-0.5">
              {PE_PERSONAS.map((p, i) => (
                <button
                  key={p.id}
                  onClick={() => switchPersona(i)}
                  className={cn(
                    "rounded-full px-2.5 py-1 text-xs font-medium transition-all",
                    activePersona === i
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Temperature control */}
            <div className="flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1">
              <span className="text-xs text-muted-foreground">temp</span>
              <input
                type="range"
                min="0"
                max="1.5"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="h-[3px] w-10 cursor-pointer appearance-none rounded-full bg-foreground/20 [&::-moz-range-thumb]:size-2.5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-foreground [&::-webkit-slider-thumb]:size-2.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-foreground"
              />
              <span className="w-6 text-xs tabular-nums text-muted-foreground">
                {temperature.toFixed(1)}
              </span>
            </div>
          </div>

          {/* Send button */}
          <motion.button
            onClick={submit}
            disabled={!prompt.trim() || state === "thinking" || state === "streaming"}
            whileTap={{ scale: 0.92 }}
            className={cn(
              "flex size-9 items-center justify-center rounded-full transition-all",
              prompt.trim() && state !== "thinking" && state !== "streaming"
                ? "bg-foreground text-background"
                : "bg-foreground/10 text-muted-foreground/50"
            )}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
          </motion.button>
        </div>
      </div>

      {/* ── System prompt toggle ── */}
      <div className="mt-2.5 flex items-center justify-center">
        <button
          onClick={() => setShowSystem(!showSystem)}
          className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <svg
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className={cn("transition-transform duration-150", showSystem && "rotate-90")}
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
          <span>System prompt</span>
        </button>
      </div>

      <AnimatePresence>
        {showSystem && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden"
          >
            <div className="mt-2 rounded-xl border border-border bg-card/50 px-3 py-2.5">
              <p className="text-xs italic leading-relaxed text-muted-foreground">
                &ldquo;{persona.system}&rdquo;
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

