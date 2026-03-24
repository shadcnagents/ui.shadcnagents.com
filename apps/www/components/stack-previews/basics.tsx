"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { cn } from "@/lib/utils"
import { LiveWaveform } from "@/registry/stacks/basics-generate-speech/components/ui/live-waveform"
import { ShimmeringText, SPRING, SuggestionPills, WaveDotsLoader, WAVE_KEYFRAMES } from "./shared"

/* ─── Generate Text ─── */

const GT_RESPONSE =
  "Language models predict the next word in a sequence. That\u2019s it. But trained on enough text, this simple objective forces the model to learn grammar, facts, logic, and reasoning \u2014 all as byproducts of prediction.\n\nWhat emerges is something that looks like understanding. The model can explain, create, translate, and reason. Whether this is genuine intelligence or sophisticated pattern matching remains an open question."

const GT_KEYFRAMES = WAVE_KEYFRAMES

const GT_TOKENS = GT_RESPONSE.split(/\s+/).length

const GT_PLACEHOLDERS = [
  "Summarize this article...",
  "Extract the key entities...",
  "Classify this support ticket...",
  "Rewrite in a formal tone...",
]

export function GenerateTextPreview() {
  const [state, setState] = useState<"idle" | "thinking" | "complete">("idle")
  const [prompt, setPrompt] = useState("")
  const [submittedPrompt, setSubmittedPrompt] = useState("")
  const [elapsed, setElapsed] = useState(0)
  const t0Ref = useRef(0)
  const tmRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function submit() {
    if (!prompt.trim() || state === "thinking") return
    setSubmittedPrompt(prompt.trim())
    setPrompt("")
    setState("thinking")
    t0Ref.current = Date.now()
    tmRef.current = setTimeout(() => {
      setElapsed(Date.now() - t0Ref.current)
      setState("complete")
    }, 2000)
  }

  function reset() {
    if (tmRef.current) clearTimeout(tmRef.current)
    setState("idle")
    setPrompt("")
    setSubmittedPrompt("")
    setElapsed(0)
  }

  useEffect(
    () => () => {
      if (tmRef.current) clearTimeout(tmRef.current)
    },
    []
  )

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

        {/* ── Thinking ── */}
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

        {/* ── Complete — full block reveal (not streaming) ── */}
        <AnimatePresence>
          {state === "complete" && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="mb-5"
            >
              <p className="whitespace-pre-wrap text-base leading-[1.8] text-foreground">
                {GT_RESPONSE}
              </p>
              <div className="mt-3 flex items-center justify-between">
                <span className="font-mono text-sm text-muted-foreground">
                  gpt-4o · {GT_TOKENS} tokens · {(elapsed / 1000).toFixed(1)}s
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
              disabled={state === "thinking"}
              placeholder="Enter a prompt..."
              className="h-8 w-full bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground disabled:opacity-40"
            />
          </div>
          <div className="flex items-center justify-between px-3 pb-3">
            <div className="flex items-center gap-1">
              <span className="flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-muted-foreground/60">
                <span className="size-2 rounded-full bg-[#10a37f]" />
                <span className="text-sm font-medium">GPT-4o</span>
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
            <span className="text-sm font-medium text-muted-foreground">AI SDK Stream</span>
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
          DALL·E 3 · 1024×1024
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
          className="rounded-full bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-30"
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
              className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
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
          Claude Tool Use
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

/* ─── Agent Playground (OpenAI Style) ─── */

const PLAYGROUND_MODELS = [
  { id: "gpt-4o", name: "gpt-4o" },
  { id: "gpt-4o-mini", name: "gpt-4o-mini" },
  { id: "gpt-4-turbo", name: "gpt-4-turbo" },
  { id: "gpt-3.5-turbo", name: "gpt-3.5-turbo" },
]

const PLAYGROUND_MODES = [
  { id: "chat", name: "Chat", icon: "chat" },
  { id: "complete", name: "Complete", icon: "complete" },
]

interface Message {
  role: "user" | "assistant"
  content: string
}

const SAMPLE_RESPONSE = `Creativity is the ability to generate new and innovative ideas, original thoughts, and imaginative solutions. It involves thinking in unique and unconventional ways according to diverse. Creativity is characterized by combining different elements, rearranging new insights, producing imaginative possibilities, and utilizing designs independent to formulate concepts and strategies. It involves mentally exploration gain effective results appreciate knowledge and emphasize a novel perspective throughout enabling transformations inspiring limitless facets extensive disenable uniqueness ultimately entertain change constructive unexpected pursue connection hugh solve differing entails skills necessary could related engaging lacking generation easily various encountering able collaborative range degree imagining push thoughts rationale process experimenting influence experiments advance presence addition significantly-driven disciplines target address create problems improvements.`

export function AgentSetupPreview() {
  const [mode, setMode] = useState("chat")
  const [model, setModel] = useState("gpt-3.5-turbo")
  const [temperature, setTemperature] = useState(2)
  const [maxLength, setMaxLength] = useState(256)
  const [stopSequences, setStopSequences] = useState("")
  const [topP, setTopP] = useState(1)
  const [frequencyPenalty, setFrequencyPenalty] = useState(0)
  const [presencePenalty, setPresencePenalty] = useState(0)
  const [systemPrompt, setSystemPrompt] = useState("You are a helpful assistant.")
  const [messages, setMessages] = useState<Message[]>([
    { role: "user", content: "What is creativity?" },
    { role: "assistant", content: SAMPLE_RESPONSE }
  ])
  const [showModelDropdown, setShowModelDropdown] = useState(false)
  const [showModeDropdown, setShowModeDropdown] = useState(false)

  return (
    <div className="flex h-[520px] w-full max-w-5xl mx-auto border border-border/40 rounded-lg overflow-hidden bg-background">
      {/* Left Sidebar - System */}
      <div className="w-48 border-r border-border/40 flex flex-col">
        <div className="p-4 flex-1">
          <label className="text-xs font-semibold text-foreground tracking-wide mb-3 block">
            SYSTEM
          </label>
          <textarea
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            className="w-full h-20 bg-transparent text-sm text-muted-foreground resize-none outline-none placeholder:text-muted-foreground/40 leading-relaxed"
            placeholder="You are a helpful assistant."
          />
        </div>
      </div>

      {/* Main Content - Messages */}
      <div className="flex-1 flex flex-col min-w-0 border-r border-border/40">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, i) => (
            <div key={i} className="flex gap-6">
              <span className={cn(
                "text-xs font-semibold tracking-wide shrink-0 w-20 pt-0.5",
                msg.role === "user" ? "text-foreground" : "text-muted-foreground"
              )}>
                {msg.role === "user" ? "USER" : "ASSISTANT"}
              </span>
              <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                {msg.content}
              </p>
            </div>
          ))}
        </div>

        {/* Add Message */}
        <div className="px-6 py-3 border-t border-border/40">
          <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v8M8 12h8" />
            </svg>
            Add message
          </button>
        </div>

        {/* Bottom Bar */}
        <div className="px-6 py-4 border-t border-border/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 rounded-md bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium transition-colors">
              Submit
            </button>
            <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
              </svg>
            </button>
          </div>
          <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            Give us feedback
          </button>
        </div>
      </div>

      {/* Right Sidebar - Settings */}
      <div className="w-52 overflow-y-auto">
        <div className="p-4 space-y-5">
          {/* Mode */}
          <div>
            <label className="text-xs text-muted-foreground mb-2 block">
              Mode
            </label>
            <div className="relative">
              <button
                onClick={() => setShowModeDropdown(!showModeDropdown)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-md border border-border/60 bg-background text-sm text-foreground hover:border-foreground/20 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  Chat
                </span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              {showModeDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 py-1 rounded-md border border-border/60 bg-background shadow-lg z-10">
                  {PLAYGROUND_MODES.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => { setMode(m.id); setShowModeDropdown(false) }}
                      className={cn(
                        "w-full px-3 py-2 text-left text-sm transition-colors",
                        mode === m.id ? "bg-foreground/5 text-foreground" : "text-muted-foreground hover:bg-foreground/5"
                      )}
                    >
                      {m.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Model */}
          <div>
            <label className="text-xs text-muted-foreground mb-2 block">
              Model
            </label>
            <div className="relative">
              <button
                onClick={() => setShowModelDropdown(!showModelDropdown)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-md border border-border/60 bg-background text-sm text-foreground hover:border-foreground/20 transition-colors"
              >
                <span>{model}</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              {showModelDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 py-1 rounded-md border border-border/60 bg-background shadow-lg z-10">
                  {PLAYGROUND_MODELS.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => { setModel(m.id); setShowModelDropdown(false) }}
                      className={cn(
                        "w-full px-3 py-2 text-left text-sm transition-colors",
                        model === m.id ? "bg-foreground/5 text-foreground" : "text-muted-foreground hover:bg-foreground/5"
                      )}
                    >
                      {m.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Temperature */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs text-muted-foreground">Temperature</label>
              <span className="text-xs text-foreground">{temperature}</span>
            </div>
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="w-full h-1 cursor-pointer appearance-none rounded-full bg-foreground/10 [&::-webkit-slider-thumb]:size-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-foreground/60 [&::-webkit-slider-thumb]:border-0"
            />
          </div>

          {/* Maximum length */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs text-muted-foreground">Maximum length</label>
              <span className="text-xs text-foreground">{maxLength}</span>
            </div>
            <input
              type="range"
              min="1"
              max="4096"
              step="1"
              value={maxLength}
              onChange={(e) => setMaxLength(parseInt(e.target.value))}
              className="w-full h-1 cursor-pointer appearance-none rounded-full bg-foreground/10 [&::-webkit-slider-thumb]:size-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-foreground/60 [&::-webkit-slider-thumb]:border-0"
            />
          </div>

          {/* Stop sequences */}
          <div>
            <label className="text-xs text-muted-foreground mb-2 block">Stop sequences</label>
            <input
              type="text"
              value={stopSequences}
              onChange={(e) => setStopSequences(e.target.value)}
              placeholder="Enter sequence and press Tab"
              className="w-full px-3 py-2 rounded-md border border-border/60 bg-background text-sm text-foreground placeholder:text-muted-foreground/40 outline-none focus:border-foreground/30 transition-colors"
            />
          </div>

          {/* Top P */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs text-muted-foreground">Top P</label>
              <span className="text-xs text-foreground">{topP}</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={topP}
              onChange={(e) => setTopP(parseFloat(e.target.value))}
              className="w-full h-1 cursor-pointer appearance-none rounded-full bg-foreground/10 [&::-webkit-slider-thumb]:size-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-foreground/60 [&::-webkit-slider-thumb]:border-0"
            />
          </div>

          {/* Frequency penalty */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs text-muted-foreground">Frequency penalty</label>
              <span className="text-xs text-foreground">{frequencyPenalty}</span>
            </div>
            <input
              type="range"
              min="0"
              max="2"
              step="0.01"
              value={frequencyPenalty}
              onChange={(e) => setFrequencyPenalty(parseFloat(e.target.value))}
              className="w-full h-1 cursor-pointer appearance-none rounded-full bg-foreground/10 [&::-webkit-slider-thumb]:size-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-foreground/60 [&::-webkit-slider-thumb]:border-0"
            />
          </div>

          {/* Presence penalty */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs text-muted-foreground">Presence penalty</label>
              <span className="text-xs text-foreground">{presencePenalty}</span>
            </div>
            <input
              type="range"
              min="0"
              max="2"
              step="0.01"
              value={presencePenalty}
              onChange={(e) => setPresencePenalty(parseFloat(e.target.value))}
              className="w-full h-1 cursor-pointer appearance-none rounded-full bg-foreground/10 [&::-webkit-slider-thumb]:size-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-foreground/60 [&::-webkit-slider-thumb]:border-0"
            />
          </div>
        </div>
      </div>
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
    name: "Claude Sonnet 4",
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
                      <div className="mt-2">
                        <WaveDotsLoader />
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
