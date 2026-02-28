"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { cn } from "@/lib/utils"
import { SuggestionPills, WaveDotsLoader, WAVE_KEYFRAMES } from "./shared"

/* ─── Generate Text ─── */

const GT_RESPONSE =
  "Language models predict the next word in a sequence. That\u2019s it. But trained on enough text, this simple objective forces the model to learn grammar, facts, logic, and reasoning \u2014 all as byproducts of prediction.\n\nWhat emerges is something that looks like understanding. The model can explain, create, translate, and reason. Whether this is genuine intelligence or sophisticated pattern matching remains an open question."

const GT_KEYFRAMES = WAVE_KEYFRAMES

const GT_TOKENS = GT_RESPONSE.split(/\s+/).length

const GT_PLACEHOLDERS = [
  "Explain how language models work...",
  "Write a poem about recursion...",
  "What is quantum entanglement?",
  "Describe the future of AI...",
]

export function GenerateTextPreview() {
  const [state, setState] = useState<
    "idle" | "thinking" | "streaming" | "complete"
  >("idle")
  const [prompt, setPrompt] = useState("")
  const [submittedPrompt, setSubmittedPrompt] = useState("")
  const [displayed, setDisplayed] = useState("")
  const [elapsed, setElapsed] = useState(0)
  const idxRef = useRef(0)
  const tmRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const t0Ref = useRef(0)

  function submit() {
    if (!prompt.trim() || state === "thinking" || state === "streaming") return
    setSubmittedPrompt(prompt.trim())
    setPrompt("")
    setState("thinking")
    setDisplayed("")
    idxRef.current = 0
    t0Ref.current = Date.now()
    setTimeout(() => setState("streaming"), 1800)
  }

  function reset() {
    if (tmRef.current) clearTimeout(tmRef.current)
    setState("idle")
    setPrompt("")
    setSubmittedPrompt("")
    setDisplayed("")
    setElapsed(0)
    idxRef.current = 0
  }

  useEffect(() => {
    if (state !== "streaming") return
    function tick() {
      const n = 2 + Math.floor(Math.random() * 2)
      idxRef.current = Math.min(idxRef.current + n, GT_RESPONSE.length)
      setDisplayed(GT_RESPONSE.slice(0, idxRef.current))
      if (idxRef.current >= GT_RESPONSE.length) {
        setElapsed(Date.now() - t0Ref.current)
        setState("complete")
      } else {
        tmRef.current = setTimeout(tick, 18 + Math.random() * 12)
      }
    }
    tmRef.current = setTimeout(tick, 40)
    return () => {
      if (tmRef.current) clearTimeout(tmRef.current)
    }
  }, [state])

  useEffect(
    () => () => {
      if (tmRef.current) clearTimeout(tmRef.current)
    },
    []
  )

  const isActive = state === "thinking" || state === "streaming"
  const hasOutput = state === "streaming" || state === "complete"

  return (
    <div className="mx-auto flex h-[420px] w-full max-w-xl flex-col p-6">
      <style>{GT_KEYFRAMES}</style>

      {/* ── Scrollable content area ── */}
      <div className="min-h-0 flex-1 overflow-y-auto scrollbar-hide">
        {/* ── User prompt bubble ── */}
        <AnimatePresence>
          {submittedPrompt && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ type: "spring", duration: 0.4, bounce: 0 }}
              className="mb-3 flex justify-end"
            >
              <div className="max-w-[85%] rounded-2xl bg-primary px-3.5 py-2.5 text-sm text-primary-foreground">
                {submittedPrompt}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Output ── */}
        <AnimatePresence>
          {state === "thinking" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="mb-5"
            >
              <WaveDotsLoader />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {hasOutput && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0 }}
              className="mb-5"
            >
              <p className="whitespace-pre-wrap text-base leading-[1.8] text-foreground">
                {displayed}
                {state === "streaming" && (
                  <span
                    className="ml-px inline-block h-[15px] w-[1.5px] translate-y-[3px] rounded-full bg-foreground/60"
                    style={{ animation: "gt-blink 0.8s step-end infinite" }}
                  />
                )}
              </p>
              {state === "complete" && (
                <div className="mt-3 flex items-center justify-between">
                  <span className="font-mono text-sm text-muted-foreground">
                    {GT_TOKENS} tokens · {(elapsed / 1000).toFixed(1)}s
                  </span>
                  <button
                    onClick={reset}
                    className="font-mono text-sm text-muted-foreground transition-colors hover:text-foreground/80"
                  >
                    clear
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Bottom-pinned: Suggestions + Input ── */}
      <div className="shrink-0 pt-2">
        <AnimatePresence>
          {!prompt && state === "idle" && (
            <div className="mb-3">
              <SuggestionPills suggestions={GT_PLACEHOLDERS} onSelect={setPrompt} />
            </div>
          )}
        </AnimatePresence>

        <div className="rounded-2xl border border-border bg-background shadow-sm transition-all duration-200 focus-within:border-foreground/30 focus-within:shadow-md">
          <div className="px-4 pt-3.5 pb-1.5">
            <input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              disabled={isActive}
              placeholder="Ask anything..."
              className="h-8 w-full bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground disabled:opacity-40"
            />
          </div>
          <div className="flex items-center justify-between px-3 pb-3">
            <div className="flex items-center gap-1">
              <button className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-card hover:text-foreground">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </button>
              <div className="mx-0.5 h-4 w-px bg-foreground/10" />
              <button className="flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-muted-foreground transition-colors hover:bg-card hover:text-foreground">
                <span className="size-2 rounded-full bg-orange-400" />
                <span className="text-sm font-medium">Sonnet</span>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M6 9l6 6 6-6" /></svg>
              </button>
            </div>
            <motion.button
              onClick={submit}
              disabled={!prompt.trim() || isActive}
              whileTap={{ scale: 0.9 }}
              className={cn(
                "flex size-8 items-center justify-center rounded-lg transition-colors",
                prompt.trim() && !isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-foreground/10 text-muted-foreground/50"
              )}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M12 19V5M5 12l7-7 7 7" />
              </svg>
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Stream Text ─── */

const ST_RESPONSE =
  "Streaming changes the relationship between model and interface. Instead of waiting for a complete response, tokens arrive as they\u2019re generated \u2014 each one a small signal that the system is thinking, working, building toward an answer.\n\nThis isn\u2019t just faster. It\u2019s a fundamentally different interaction model. The user watches meaning assemble in real time. Latency becomes invisible. The gap between asking and understanding collapses."

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
  const [state, setState] = useState<
    "idle" | "streaming" | "complete"
  >("idle")
  const [prompt, setPrompt] = useState("")
  const [submittedPrompt, setSubmittedPrompt] = useState("")
  const [displayed, setDisplayed] = useState("")
  const [tokenCount, setTokenCount] = useState(0)
  const idxRef = useRef(0)
  const tmRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const t0Ref = useRef(0)
  const [elapsed, setElapsed] = useState(0)

  function submit() {
    if (!prompt.trim() || state === "streaming") return
    setSubmittedPrompt(prompt.trim())
    setPrompt("")
    setState("streaming")
    setDisplayed("")
    setTokenCount(0)
    idxRef.current = 0
    t0Ref.current = Date.now()
  }

  function reset() {
    if (tmRef.current) clearTimeout(tmRef.current)
    setState("idle")
    setPrompt("")
    setSubmittedPrompt("")
    setDisplayed("")
    setTokenCount(0)
    setElapsed(0)
    idxRef.current = 0
  }

  /* char-by-char streaming */
  useEffect(() => {
    if (state !== "streaming") return
    let wordBoundary = 0
    function tick() {
      const n = 2 + Math.floor(Math.random() * 3)
      idxRef.current = Math.min(idxRef.current + n, ST_RESPONSE.length)
      const slice = ST_RESPONSE.slice(0, idxRef.current)
      setDisplayed(slice)

      /* count tokens at word boundaries */
      const spaces = slice.split(/\s+/).length
      if (spaces > wordBoundary) {
        wordBoundary = spaces
        setTokenCount(spaces)
      }

      if (idxRef.current >= ST_RESPONSE.length) {
        setElapsed(Date.now() - t0Ref.current)
        setState("complete")
      } else {
        tmRef.current = setTimeout(tick, 14 + Math.random() * 10)
      }
    }
    tmRef.current = setTimeout(tick, 30)
    return () => {
      if (tmRef.current) clearTimeout(tmRef.current)
    }
  }, [state])

  useEffect(
    () => () => {
      if (tmRef.current) clearTimeout(tmRef.current)
    },
    []
  )

  const isStreaming = state === "streaming"
  const hasOutput = state === "streaming" || state === "complete"
  const tps =
    state === "complete" && elapsed > 0
      ? (tokenCount / (elapsed / 1000)).toFixed(0)
      : null

  return (
    <div className="mx-auto flex h-[420px] w-full max-w-xl flex-col p-6">
      <style>{ST_KEYFRAMES}</style>

      {/* ── Scrollable content area ── */}
      <div className="min-h-0 flex-1 overflow-y-auto scrollbar-hide">
        {/* ── User prompt bubble ── */}
        <AnimatePresence>
          {submittedPrompt && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ type: "spring", duration: 0.4, bounce: 0 }}
              className="mb-3 flex justify-end"
            >
              <div className="max-w-[85%] rounded-2xl bg-primary px-3.5 py-2.5 text-sm text-primary-foreground">
                {submittedPrompt}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Stream progress line ── */}
        <AnimatePresence>
          {isStreaming && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mb-3 h-px overflow-hidden rounded-full bg-foreground/10"
            >
              <div
                className="h-full w-1/3 rounded-full bg-foreground/25"
                style={{ animation: "st-flow 1.5s ease-in-out infinite" }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Output ── */}
        <AnimatePresence>
          {hasOutput && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0 }}
              className="mb-5"
            >
              <p className="whitespace-pre-wrap text-base leading-[1.8] text-foreground">
                {displayed}
                {isStreaming && (
                  <span
                    className="ml-px inline-block h-[15px] w-[1.5px] translate-y-[3px] rounded-full bg-foreground/60"
                    style={{ animation: "st-pulse 0.6s ease-in-out infinite" }}
                  />
                )}
              </p>

              {/* ── Live token counter while streaming ── */}
              {isStreaming && (
                <div className="mt-3 flex items-center gap-2">
                  <WaveDotsLoader />
                  <span className="font-mono text-sm tabular-nums text-muted-foreground">
                    {tokenCount} tokens
                  </span>
                </div>
              )}

              {/* ── Completion metadata ── */}
              {state === "complete" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="mt-3 flex items-center justify-between"
                >
                  <span className="font-mono text-sm tabular-nums text-muted-foreground">
                    {tokenCount} tokens · {(elapsed / 1000).toFixed(1)}s
                    {tps && <> · {tps} tok/s</>}
                  </span>
                  <button
                    onClick={reset}
                    className="font-mono text-sm text-muted-foreground transition-colors hover:text-foreground/80"
                  >
                    clear
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Bottom-pinned: Suggestions + Input ── */}
      <div className="shrink-0 pt-2">
        <AnimatePresence>
          {!prompt && state === "idle" && (
            <div className="mb-3">
              <SuggestionPills suggestions={ST_PLACEHOLDERS} onSelect={setPrompt} />
            </div>
          )}
        </AnimatePresence>

        <div className="rounded-2xl border border-border bg-background shadow-sm transition-all duration-200 focus-within:border-foreground/30 focus-within:shadow-md">
          <div className="px-4 pt-3.5 pb-1.5">
            <input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              disabled={isStreaming}
              placeholder="Ask anything..."
              className="h-8 w-full bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground disabled:opacity-40"
            />
          </div>
          <div className="flex items-center justify-between px-3 pb-3">
            <span className="text-sm font-medium text-muted-foreground">Stream mode</span>
            <motion.button
              onClick={submit}
              disabled={!prompt.trim() || isStreaming}
              whileTap={{ scale: 0.9 }}
              className={cn(
                "flex size-8 items-center justify-center rounded-lg transition-colors",
                prompt.trim() && !isStreaming
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-foreground/10 text-muted-foreground/50"
              )}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M12 19V5M5 12l7-7 7 7" />
              </svg>
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Generate Image ─── */
const imageVariants = [
  {
    gradient: "from-amber-200 via-orange-300 to-rose-400",
    darkGradient: "dark:from-amber-900/60 dark:via-orange-800/50 dark:to-rose-900/60",
    label: "Sunset Mountains",
    shapes: (
      <>
        {/* Mountains */}
        <div className="absolute bottom-0 left-0 right-0">
          <div className="absolute bottom-0 left-[10%] h-[60%] w-[45%] rounded-t-full bg-gradient-to-t from-stone-600/40 to-stone-500/20" />
          <div className="absolute bottom-0 left-[35%] h-[75%] w-[40%] rounded-t-full bg-gradient-to-t from-stone-700/50 to-stone-500/25" />
          <div className="absolute bottom-0 right-[5%] h-[50%] w-[50%] rounded-t-full bg-gradient-to-t from-stone-600/35 to-stone-400/15" />
        </div>
        {/* Sun */}
        <div className="absolute right-[20%] top-[15%] size-[18%] rounded-full bg-yellow-200/60 blur-sm" />
        <div className="absolute right-[21%] top-[16%] size-[16%] rounded-full bg-yellow-100/80" />
      </>
    ),
  },
  {
    gradient: "from-sky-200 via-cyan-200 to-blue-300",
    darkGradient: "dark:from-sky-900/60 dark:via-cyan-800/50 dark:to-blue-900/60",
    label: "Ocean Waves",
    shapes: (
      <>
        {/* Water waves */}
        <div className="absolute bottom-0 left-0 right-0 h-[45%] bg-gradient-to-t from-blue-400/40 to-transparent" />
        <div className="absolute bottom-[40%] left-0 right-0 h-[3px] rounded-full bg-white/20" />
        <div className="absolute bottom-[32%] left-[10%] right-[20%] h-[2px] rounded-full bg-white/15" />
        <div className="absolute bottom-[25%] left-[5%] right-[15%] h-[2px] rounded-full bg-white/10" />
        {/* Cloud */}
        <div className="absolute left-[15%] top-[12%] h-[12%] w-[25%] rounded-full bg-white/30 blur-sm" />
      </>
    ),
  },
  {
    gradient: "from-violet-200 via-purple-300 to-indigo-400",
    darkGradient: "dark:from-violet-900/60 dark:via-purple-800/50 dark:to-indigo-900/60",
    label: "Northern Lights",
    shapes: (
      <>
        {/* Aurora bands */}
        <div className="absolute left-[10%] top-[10%] h-[30%] w-[80%] rotate-[-8deg] rounded-full bg-emerald-300/20 blur-md" />
        <div className="absolute left-[20%] top-[20%] h-[25%] w-[60%] rotate-[-5deg] rounded-full bg-teal-300/15 blur-md" />
        {/* Stars */}
        <div className="absolute left-[20%] top-[15%] size-1 rounded-full bg-white/60" />
        <div className="absolute left-[65%] top-[10%] size-0.5 rounded-full bg-white/40" />
        <div className="absolute left-[45%] top-[25%] size-0.5 rounded-full bg-white/50" />
        <div className="absolute left-[80%] top-[20%] size-1 rounded-full bg-white/30" />
        {/* Ground */}
        <div className="absolute bottom-0 left-0 right-0 h-[20%] bg-gradient-to-t from-slate-800/40 to-transparent" />
      </>
    ),
  },
  {
    gradient: "from-emerald-200 via-green-200 to-teal-300",
    darkGradient: "dark:from-emerald-900/60 dark:via-green-800/50 dark:to-teal-900/60",
    label: "Forest Path",
    shapes: (
      <>
        {/* Trees */}
        <div className="absolute bottom-0 left-[5%] h-[70%] w-[20%]">
          <div className="absolute bottom-0 left-1/2 h-[30%] w-[15%] -translate-x-1/2 bg-amber-800/30" />
          <div className="absolute bottom-[25%] left-1/2 h-[50%] w-full -translate-x-1/2 rounded-t-full bg-green-600/30" />
        </div>
        <div className="absolute bottom-0 right-[8%] h-[80%] w-[18%]">
          <div className="absolute bottom-0 left-1/2 h-[30%] w-[15%] -translate-x-1/2 bg-amber-800/25" />
          <div className="absolute bottom-[25%] left-1/2 h-[55%] w-full -translate-x-1/2 rounded-t-full bg-green-700/35" />
        </div>
        {/* Path */}
        <div className="absolute bottom-0 left-[30%] h-[40%] w-[40%] bg-gradient-to-t from-amber-200/20 to-transparent" style={{ clipPath: "polygon(35% 0%, 65% 0%, 100% 100%, 0% 100%)" }} />
        {/* Light rays */}
        <div className="absolute left-[40%] top-0 h-[60%] w-[20%] bg-gradient-to-b from-yellow-100/20 to-transparent blur-sm" />
      </>
    ),
  },
]

export function GenerateImagePreview() {
  const [state, setState] = useState<"idle" | "generating" | "complete">(
    "idle"
  )
  const [prompt, setPrompt] = useState("")
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null)

  function generate() {
    if (!prompt.trim() || state === "generating") return
    setState("generating")
    setSelectedIdx(null)
    setTimeout(() => setState("complete"), 2000)
  }

  function reset() {
    setState("idle")
    setPrompt("")
    setSelectedIdx(null)
  }

  return (
    <div className="mx-auto w-full max-w-xl p-6">
      <style>{GT_KEYFRAMES}</style>

      {/* ── Prompt textarea ── */}
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            generate()
          }
        }}
        disabled={state === "generating"}
        placeholder="A serene mountain landscape at golden hour, soft light filtering through clouds..."
        rows={3}
        className="w-full resize-none rounded-lg border border-border shadow-sm bg-card px-3 py-2.5 text-sm leading-relaxed text-foreground outline-none placeholder:text-muted-foreground focus:border-foreground/10 disabled:opacity-40"
      />
      <div className="mt-2 flex items-center justify-between">
        <span className="font-mono text-sm text-muted-foreground">
          512 × 512 · 4 variations
        </span>
        <button
          onClick={generate}
          disabled={!prompt.trim() || state === "generating"}
          className="font-mono text-sm text-foreground/60 transition-colors hover:text-foreground disabled:opacity-20"
        >
          {state === "generating" ? "imagining..." : "generate →"}
        </button>
      </div>

      {/* ── Generating ── */}
      <AnimatePresence>
        {state === "generating" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-6 flex items-center gap-2"
          >
            <WaveDotsLoader />
            <span className="font-mono text-sm text-muted-foreground">
              rendering 4 variations
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Image grid ── */}
      <AnimatePresence>
        {state === "complete" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ type: "spring", duration: 0.6, bounce: 0 }}
            className="mt-5"
          >
            <div className="grid grid-cols-2 gap-2">
              {imageVariants.map((v, i) => (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, filter: "blur(10px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  transition={{ duration: 0.5, delay: i * 0.12 }}
                  onClick={() =>
                    setSelectedIdx(selectedIdx === i ? null : i)
                  }
                  className={`group relative aspect-square overflow-hidden rounded-lg transition-all duration-200 ${
                    selectedIdx === i
                      ? "ring-1 ring-foreground/30 ring-offset-1 ring-offset-background"
                      : selectedIdx !== null
                        ? "opacity-40"
                        : "hover:ring-1 hover:ring-foreground/10"
                  }`}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${v.gradient} ${v.darkGradient}`}
                  />
                  {v.shapes}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/25 to-transparent px-2 pb-1.5 pt-4">
                    <p className="font-mono text-sm text-white/80">
                      {v.label}
                    </p>
                  </div>
                </motion.button>
              ))}
            </div>

            <div className="mt-3 flex items-center justify-between">
              <span className="font-mono text-sm text-muted-foreground">
                {selectedIdx !== null
                  ? imageVariants[selectedIdx].label
                  : "select a variation"}
              </span>
              <button
                onClick={reset}
                className="font-mono text-sm text-muted-foreground transition-colors hover:text-foreground/80"
              >
                clear
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ─── Generate Speech ─── */

const VOICE_OPTIONS = ["alloy", "echo", "fable", "onyx", "nova", "shimmer"]
const WAVE_BARS = Array.from({ length: 48 }, (_, i) => {
  const t = i / 48
  return 20 + Math.sin(t * Math.PI * 3) * 15 + Math.sin(t * Math.PI * 7) * 8 + Math.sin(t * Math.PI * 11) * 4
})

export function GenerateSpeechPreview() {
  const [text, setText] = useState("")
  const [voice, setVoice] = useState("alloy")
  const [state, setState] = useState<"idle" | "generating" | "ready">("idle")
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  function generate() {
    if (!text.trim() || state === "generating") return
    setState("generating")
    setProgress(0)
    setPlaying(false)
    setTimeout(() => setState("ready"), 1500)
  }

  function togglePlay() {
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
        return p + 2
      })
    }, 80)
  }

  function reset() {
    setState("idle")
    setText("")
    setPlaying(false)
    setProgress(0)
    if (intervalRef.current) clearInterval(intervalRef.current)
  }

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  return (
    <div className="mx-auto w-full max-w-xl p-6">
      <style>{GT_KEYFRAMES}</style>

      {/* ── Text input ── */}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            generate()
          }
        }}
        disabled={state === "generating"}
        placeholder="Hello, welcome to our platform. We're glad to have you here."
        rows={3}
        className="w-full resize-none rounded-lg border border-border shadow-sm bg-card px-3 py-2.5 text-sm leading-relaxed text-foreground outline-none placeholder:text-muted-foreground focus:border-foreground/10 disabled:opacity-40"
      />

      {/* ── Voice picker + generate ── */}
      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center gap-0.5">
          {VOICE_OPTIONS.map((v) => (
            <button
              key={v}
              onClick={() => setVoice(v)}
              className={`rounded-full px-1.5 py-0.5 font-mono text-sm transition-colors ${
                voice === v
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground/50 hover:text-foreground/80"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
        <button
          onClick={generate}
          disabled={!text.trim() || state === "generating"}
          className="font-mono text-sm text-foreground/60 transition-colors hover:text-foreground disabled:opacity-20"
        >
          {state === "generating" ? "synthesizing..." : "speak →"}
        </button>
      </div>

      {/* ── Generating ── */}
      <AnimatePresence>
        {state === "generating" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-6 flex items-center gap-2"
          >
            <WaveDotsLoader />
            <span className="font-mono text-sm text-muted-foreground">
              generating with {voice}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Player ── */}
      <AnimatePresence>
        {state === "ready" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0 }}
            className="mt-5"
          >
            {/* Waveform */}
            <div className="flex h-10 items-end gap-[2px]">
              {WAVE_BARS.map((h, i) => {
                const filled = (i / WAVE_BARS.length) * 100 <= progress
                return (
                  <div
                    key={i}
                    className={`flex-1 rounded-full transition-colors duration-75 ${
                      filled ? "bg-foreground/100" : "bg-foreground/20"
                    }`}
                    style={{ height: `${h}%` }}
                  />
                )
              })}
            </div>

            {/* Controls */}
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={togglePlay}
                  className="flex size-6 items-center justify-center rounded-full bg-foreground"
                >
                  {playing ? (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" className="text-background">
                      <rect x="6" y="4" width="4" height="16" rx="1" />
                      <rect x="14" y="4" width="4" height="16" rx="1" />
                    </svg>
                  ) : (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" className="ml-0.5 text-background">
                      <polygon points="5 3 19 12 5 21" />
                    </svg>
                  )}
                </button>
                <span className="font-mono text-sm tabular-nums text-muted-foreground">
                  0:{String(Math.floor((progress / 100) * 12)).padStart(2, "0")} / 0:12
                </span>
              </div>
              <button
                onClick={reset}
                className="font-mono text-sm text-muted-foreground transition-colors hover:text-foreground/80"
              >
                clear
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ─── Transcribe Audio ─── */

const TRANSCRIBE_RESULT =
  "Welcome to today's discussion on artificial intelligence. We'll be covering the latest developments in large language models and how they're being integrated into production applications. Let's start with an overview of the current landscape."

export function TranscribePreview() {
  const [state, setState] = useState<"idle" | "transcribing" | "complete">(
    "idle"
  )
  const [result, setResult] = useState("")
  const [dragging, setDragging] = useState(false)

  function transcribe() {
    if (state === "transcribing") return
    setState("transcribing")
    setResult("")
    setTimeout(() => {
      setResult(TRANSCRIBE_RESULT)
      setState("complete")
    }, 2000)
  }

  function reset() {
    setState("idle")
    setResult("")
  }

  return (
    <div className="mx-auto w-full max-w-xl p-6">
      <style>{GT_KEYFRAMES}</style>

      {/* ── Drop zone ── */}
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragging(false)
          transcribe()
        }}
        onClick={transcribe}
        className={`flex h-28 cursor-pointer flex-col items-center justify-center rounded-lg border transition-all ${
          dragging
            ? "border-border bg-card"
            : "border-border bg-muted/10 hover:bg-card"
        }`}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-muted-foreground"
        >
          <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          <line x1="12" x2="12" y1="19" y2="22" />
        </svg>
        <p className="mt-2 text-sm text-muted-foreground">
          Drop audio or click to upload
        </p>
        <p className="mt-0.5 font-mono text-sm text-muted-foreground">
          MP3 · WAV · M4A · up to 25 MB
        </p>
      </div>

      {/* ── Transcribing ── */}
      <AnimatePresence>
        {state === "transcribing" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-5 flex items-center gap-2"
          >
            <WaveDotsLoader />
            <span className="font-mono text-sm text-muted-foreground">
              transcribing with whisper-large-v3
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Result ── */}
      <AnimatePresence>
        {state === "complete" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0 }}
            className="mt-5"
          >
            <p className="whitespace-pre-wrap text-base leading-[1.8] text-foreground">
              {result}
            </p>
            <div className="mt-3 flex items-center justify-between">
              <span className="font-mono text-sm text-muted-foreground">
                {result.split(/\s+/).length} words · whisper-large-v3
              </span>
              <button
                onClick={reset}
                className="font-mono text-sm text-muted-foreground transition-colors hover:text-foreground/80"
              >
                clear
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ─── Tool Calling ─── */

const TOOL_STEPS = [
  { type: "user" as const, content: "What's the weather in San Francisco?" },
  {
    type: "tool_call" as const,
    name: "getWeather",
    args: '{ "city": "San Francisco" }',
  },
  {
    type: "tool_result" as const,
    content:
      '{ "temp": 18, "condition": "Partly Cloudy", "humidity": 65 }',
  },
  {
    type: "assistant" as const,
    content:
      "It's currently 18°C and partly cloudy in San Francisco with 65% humidity.",
  },
]

export function ToolCallingPreview() {
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (step < TOOL_STEPS.length) {
      const timer = setTimeout(() => setStep((s) => s + 1), 1200)
      return () => clearTimeout(timer)
    }
  }, [step])

  return (
    <div className="mx-auto w-full max-w-xl space-y-3 p-6">
      <style>{GT_KEYFRAMES}</style>

      <div className="flex items-center justify-between">
        <span className="font-mono text-sm text-muted-foreground">
          tool execution
        </span>
        <button
          onClick={() => setStep(0)}
          className="font-mono text-sm text-muted-foreground transition-colors hover:text-foreground/80"
        >
          replay
        </button>
      </div>

      <AnimatePresence>
        {TOOL_STEPS.slice(0, step).map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", duration: 0.4, bounce: 0 }}
          >
            {s.type === "user" && (
              <div className="flex justify-end">
                <div className="rounded-full bg-foreground/10 px-3 py-1.5 text-sm text-foreground">
                  {s.content}
                </div>
              </div>
            )}
            {s.type === "tool_call" && (
              <div className="rounded-lg bg-muted/70 px-3 py-2.5">
                <div className="flex items-center gap-1.5">
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-foreground/50"
                  >
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                  </svg>
                  <span className="font-mono text-sm text-foreground/50">
                    {s.name}
                  </span>
                </div>
                <pre className="mt-1 font-mono text-sm text-foreground/60">
                  {s.args}
                </pre>
              </div>
            )}
            {s.type === "tool_result" && (
              <div className="rounded-lg border border-dashed border-border shadow-sm px-3 py-2.5">
                <span className="font-mono text-sm text-muted-foreground">
                  result
                </span>
                <pre className="mt-1 font-mono text-sm text-foreground/60">
                  {s.content}
                </pre>
              </div>
            )}
            {s.type === "assistant" && (
              <p className="text-base leading-[1.8] text-foreground">
                {s.content}
              </p>
            )}
          </motion.div>
        ))}
      </AnimatePresence>

      {step > 0 && step < TOOL_STEPS.length && (
        <div className="flex items-center gap-2">
          <WaveDotsLoader />
        </div>
      )}
    </div>
  )
}

/* ─── Agent Setup ─── */

const AGENT_STEPS = [
  { label: "Received task", detail: "Research latest AI developments" },
  { label: "Planning", detail: "Breaking down into subtasks" },
  {
    label: "Tool: web_search",
    detail: '"AI research 2025 breakthroughs"',
  },
  { label: "Tool: extract_content", detail: "Processing 3 sources" },
  { label: "Synthesizing", detail: "Combining research findings" },
  { label: "Response", detail: "Generating final report" },
]

export function AgentSetupPreview() {
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (step < AGENT_STEPS.length) {
      const timer = setTimeout(() => setStep((s) => s + 1), 900)
      return () => clearTimeout(timer)
    }
  }, [step])

  return (
    <div className="mx-auto w-full max-w-xl p-6">
      <style>{GT_KEYFRAMES}</style>

      <div className="flex items-center justify-between">
        <span className="font-mono text-sm text-muted-foreground">
          agent execution
        </span>
        <button
          onClick={() => setStep(0)}
          className="font-mono text-sm text-muted-foreground transition-colors hover:text-foreground/80"
        >
          replay
        </button>
      </div>

      <div className="mt-4">
        {AGENT_STEPS.map((s, i) => {
          const visible = i < step
          const isCurrent = i === step - 1 && step < AGENT_STEPS.length
          return (
            <motion.div
              key={i}
              initial={false}
              animate={{ opacity: visible ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-start gap-3 py-1.5"
            >
              <div className="flex flex-col items-center pt-1">
                <div
                  className={`size-[5px] rounded-full transition-all duration-300 ${
                    isCurrent
                      ? "scale-125 bg-foreground"
                      : visible
                        ? "bg-foreground/30"
                        : "bg-foreground/10"
                  }`}
                />
                {i < AGENT_STEPS.length - 1 && (
                  <div
                    className={`mt-1 h-5 w-px transition-colors duration-300 ${
                      visible ? "bg-foreground/20" : "bg-foreground/10"
                    }`}
                  />
                )}
              </div>
              <div className="-mt-0.5">
                <p
                  className={`text-sm transition-colors duration-300 ${
                    isCurrent
                      ? "font-medium text-foreground"
                      : "text-foreground/80"
                  }`}
                >
                  {s.label}
                </p>
                <p className="font-mono text-sm text-muted-foreground">
                  {s.detail}
                </p>
              </div>
            </motion.div>
          )
        })}
      </div>

      {step > 0 && step < AGENT_STEPS.length && (
        <div className="mt-3 flex items-center gap-2">
          <WaveDotsLoader />
          <span className="font-mono text-sm text-muted-foreground">
            processing...
          </span>
        </div>
      )}

      {step >= AGENT_STEPS.length && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-3"
        >
          <span className="font-mono text-sm text-muted-foreground">
            6 steps · completed
          </span>
        </motion.div>
      )}
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
      "Recursion is when a function calls itself to solve a problem by breaking it into smaller subproblems. Each call works on a simpler version until reaching a base case \u2014 a condition simple enough to solve directly. The results then build back up through the call stack to form the complete answer.",
    tokens: 49,
  },
  {
    name: "Claude 3.5 Sonnet",
    color: "#d97757",
    delay: 2500,
    response:
      "Think of recursion like standing between two mirrors \u2014 you see reflections of reflections, each one slightly smaller. In code, a recursive function calls itself with a simpler input. The trick is knowing when to stop: without a base case, you\u2019d recurse forever. It\u2019s elegant because it lets you describe complex structures through self-similarity.",
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
  const [state, setState] = useState<"idle" | "generating" | "complete">(
    "idle"
  )
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
    <div className="mx-auto flex h-[420px] w-full max-w-xl flex-col p-6">
      <style>{GT_KEYFRAMES}</style>

      {/* ── Scrollable content area ── */}
      <div className="min-h-0 flex-1 overflow-y-auto scrollbar-hide">
        {/* ── User prompt bubble ── */}
        <AnimatePresence>
          {submittedPrompt && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ type: "spring", duration: 0.4, bounce: 0 }}
              className="mb-3 flex justify-end"
            >
              <div className="max-w-[85%] rounded-2xl bg-primary px-3.5 py-2.5 text-sm text-primary-foreground">
                {submittedPrompt}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Model Responses ── */}
        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0 }}
              className="mb-5 space-y-0"
            >
              {MM_MODELS.map((model, i) => {
                const done = completed.has(i)
                return (
                  <motion.div
                    key={model.name}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: i * 0.08,
                      type: "spring",
                      duration: 0.4,
                      bounce: 0,
                    }}
                    className="py-3"
                  >
                    {/* Model header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <motion.span
                          className="size-[5px] rounded-full"
                          style={{ backgroundColor: model.color }}
                          animate={
                            done
                              ? { scale: 1, opacity: 1 }
                              : {
                                  scale: [1, 1.6, 1],
                                  opacity: [0.5, 1, 0.5],
                                }
                          }
                          transition={
                            done
                              ? { duration: 0.2 }
                              : { repeat: Infinity, duration: 1.4 }
                          }
                        />
                        <span className="font-mono text-sm text-foreground/70">
                          {model.name}
                        </span>
                      </div>
                      {done && (
                        <motion.span
                          initial={{ opacity: 0, x: 4 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="font-mono text-sm text-foreground/40"
                        >
                          {(model.delay / 1000).toFixed(1)}s
                        </motion.span>
                      )}
                    </div>

                    {/* Response or loader */}
                    {done ? (
                      <motion.div
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35 }}
                      >
                        <p className="mt-1.5 text-base leading-[1.75] text-foreground">
                          {model.response}
                        </p>
                        <span className="mt-1 inline-block font-mono text-sm text-foreground/30">
                          {model.tokens} tokens
                        </span>
                      </motion.div>
                    ) : (
                      <div className="mt-2.5 flex gap-1">
                        {[0, 1, 2].map((d) => (
                          <div
                            key={d}
                            className="size-[5px] rounded-full"
                            style={{
                              backgroundColor: model.color,
                              animation: "dot-pulse 1.4s ease-in-out infinite",
                              animationDelay: `${d * 0.16}s`,
                            }}
                          />
                        ))}
                      </div>
                    )}

                    {/* Divider */}
                    {i < MM_MODELS.length - 1 && (
                      <div className="mt-3 h-px bg-foreground/10" />
                    )}
                  </motion.div>
                )
              })}

              {/* Summary */}
              {state === "complete" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.15 }}
                  className="flex items-center justify-between border-t border-border pt-3"
                >
                  <span className="font-mono text-sm text-muted-foreground">
                    3 models ·{" "}
                    {(Math.max(...MM_MODELS.map((m) => m.delay)) / 1000).toFixed(
                      1
                    )}
                    s · {MM_TOTAL_TOKENS} tokens
                  </span>
                  <button
                    onClick={reset}
                    className="font-mono text-sm text-muted-foreground transition-colors hover:text-foreground/80"
                  >
                    clear
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Bottom-pinned: Suggestions + Input ── */}
      <div className="shrink-0 pt-2">
        <AnimatePresence>
          {!prompt && state === "idle" && (
            <div className="mb-3">
              <SuggestionPills suggestions={MM_PLACEHOLDERS} onSelect={setPrompt} />
            </div>
          )}
        </AnimatePresence>

        <div className="rounded-2xl border border-border bg-background shadow-sm transition-all duration-200 focus-within:border-foreground/30 focus-within:shadow-md">
          <div className="px-4 pt-3.5 pb-1.5">
            <input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              disabled={state === "generating"}
              placeholder="Ask anything..."
              className="h-8 w-full bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground disabled:opacity-40"
            />
          </div>
          <div className="flex items-center justify-between px-3 pb-3">
            <div className="flex items-center gap-1.5">
              {MM_MODELS.map((m) => (
                <span
                  key={m.name}
                  className="size-2 rounded-full"
                  style={{ backgroundColor: m.color, opacity: 0.8 }}
                />
              ))}
              <span className="ml-0.5 text-sm font-medium text-muted-foreground">3 models</span>
            </div>
            <motion.button
              onClick={submit}
              disabled={!prompt.trim() || state === "generating"}
              whileTap={{ scale: 0.9 }}
              className={cn(
                "flex size-8 items-center justify-center rounded-lg transition-colors",
                prompt.trim() && state !== "generating"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-foreground/10 text-muted-foreground/50"
              )}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M12 19V5M5 12l7-7 7 7" />
              </svg>
            </motion.button>
          </div>
        </div>
      </div>
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
  const [state, setState] = useState<"idle" | "thinking" | "complete">(
    "idle"
  )
  const [prompt, setPrompt] = useState("")
  const [submittedPrompt, setSubmittedPrompt] = useState("")
  const [activePersona, setActivePersona] = useState(0)
  const [temperature, setTemperature] = useState(0.7)
  const [elapsed, setElapsed] = useState(0)
  const [showSystem, setShowSystem] = useState(false)
  const t0Ref = useRef(0)
  const tmRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function submit() {
    if (!prompt.trim() || state === "thinking") return
    setSubmittedPrompt(prompt.trim())
    setPrompt("")
    generate()
  }

  function generate() {
    setState("thinking")
    t0Ref.current = Date.now()
    const delay = 1200 + temperature * 600
    if (tmRef.current) clearTimeout(tmRef.current)
    tmRef.current = setTimeout(() => {
      setElapsed(Date.now() - t0Ref.current)
      setState("complete")
    }, delay)
  }

  function switchPersona(idx: number) {
    setActivePersona(idx)
    if (state === "complete") generate()
  }

  function reset() {
    if (tmRef.current) clearTimeout(tmRef.current)
    setState("idle")
    setPrompt("")
    setSubmittedPrompt("")
    setElapsed(0)
    setShowSystem(false)
  }

  useEffect(
    () => () => {
      if (tmRef.current) clearTimeout(tmRef.current)
    },
    []
  )

  const persona = PE_PERSONAS[activePersona]

  return (
    <div className="mx-auto flex h-[420px] w-full max-w-xl flex-col p-6">
      <style>{GT_KEYFRAMES}</style>

      {/* ── Scrollable content area ── */}
      <div className="min-h-0 flex-1 overflow-y-auto scrollbar-hide">
        {/* ── User prompt bubble ── */}
        <AnimatePresence>
          {submittedPrompt && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ type: "spring", duration: 0.4, bounce: 0 }}
              className="mb-3 flex justify-end"
            >
              <div className="max-w-[85%] rounded-2xl bg-primary px-3.5 py-2.5 text-sm text-primary-foreground">
                {submittedPrompt}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Output ── */}
        <AnimatePresence>
          {state === "thinking" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="mb-5"
            >
              <WaveDotsLoader />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {state === "complete" && (
            <motion.div
              key={persona.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0 }}
              className="mb-5"
            >
              <p className="whitespace-pre-wrap text-base leading-[1.8] text-foreground">
                {persona.response}
              </p>
              <div className="mt-3 flex items-center justify-between">
                <span className="font-mono text-sm text-muted-foreground">
                  {persona.tokens} tokens · {(elapsed / 1000).toFixed(1)}s · temp{" "}
                  {temperature.toFixed(1)}
                </span>
                <button
                  onClick={reset}
                  className="font-mono text-sm text-muted-foreground transition-colors hover:text-foreground/80"
                >
                  clear
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Bottom-pinned: Suggestions + Input + System prompt ── */}
      <div className="shrink-0 pt-2">
        <AnimatePresence>
          {!prompt && state === "idle" && (
            <div className="mb-3">
              <SuggestionPills suggestions={PE_PLACEHOLDERS} onSelect={setPrompt} />
            </div>
          )}
        </AnimatePresence>

        <div className="rounded-2xl border border-border bg-background shadow-sm transition-all duration-200 focus-within:border-foreground/30 focus-within:shadow-md">
          <div className="px-4 pt-3.5 pb-1.5">
            <input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              disabled={state === "thinking"}
              placeholder="Ask anything..."
              className="h-8 w-full bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground disabled:opacity-40"
            />
          </div>
          <div className="flex items-center justify-between px-3 pb-3">
            <div className="flex items-center gap-0.5">
              {/* Persona pills */}
              {PE_PERSONAS.map((p, i) => (
                <button
                  key={p.id}
                  onClick={() => switchPersona(i)}
                  className={cn(
                    "rounded-full px-2.5 py-0.5 text-sm font-medium transition-colors",
                    activePersona === i
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground/60 hover:text-foreground/80"
                  )}
                >
                  {p.label}
                </button>
              ))}
              <div className="mx-1 h-4 w-px bg-foreground/10" />
              {/* Temperature */}
              <span className="font-mono text-sm text-foreground/50">t</span>
              <input
                type="range"
                min="0"
                max="1.5"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="mx-1 h-[3px] w-12 cursor-pointer appearance-none rounded-full bg-foreground/20 [&::-moz-range-thumb]:size-2.5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-foreground [&::-webkit-slider-thumb]:size-2.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-foreground"
              />
              <span className="w-[22px] font-mono text-sm tabular-nums text-foreground/60">
                {temperature.toFixed(1)}
              </span>
            </div>
            <motion.button
              onClick={submit}
              disabled={!prompt.trim() || state === "thinking"}
              whileTap={{ scale: 0.9 }}
              className={cn(
                "flex size-8 items-center justify-center rounded-lg transition-colors",
                prompt.trim() && state !== "thinking"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-foreground/10 text-muted-foreground/50"
              )}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M12 19V5M5 12l7-7 7 7" />
              </svg>
            </motion.button>
          </div>
        </div>

        {/* ── System prompt (collapsible, below input) ── */}
        <button
          onClick={() => setShowSystem(!showSystem)}
          className="mt-2.5 flex items-center gap-1.5 font-mono text-sm text-foreground/50 transition-colors hover:text-foreground/70"
        >
          <svg
            width="8"
            height="8"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            className={`transition-transform duration-150 ${showSystem ? "rotate-90" : ""}`}
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
          system prompt
        </button>
        <AnimatePresence>
          {showSystem && (
            <motion.p
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="overflow-hidden pt-1.5 font-mono text-sm italic leading-relaxed text-foreground/60"
            >
              &ldquo;{persona.system}&rdquo;
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
