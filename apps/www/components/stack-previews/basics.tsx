"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "motion/react"

/* ─── Generate Text ─── */

const GT_RESPONSE =
  "Language models predict the next word in a sequence. That\u2019s it. But trained on enough text, this simple objective forces the model to learn grammar, facts, logic, and reasoning \u2014 all as byproducts of prediction.\n\nWhat emerges is something that looks like understanding. The model can explain, create, translate, and reason. Whether this is genuine intelligence or sophisticated pattern matching remains an open question."

const GT_KEYFRAMES = `
@keyframes gt-blink{0%,100%{opacity:1}50%{opacity:0}}
@keyframes gt-wave{0%,100%{transform:translateY(0);opacity:.2}50%{transform:translateY(-2.5px);opacity:.9}}
`

const GT_TOKENS = GT_RESPONSE.split(/\s+/).length

const GT_PLACEHOLDERS = [
  "Explain how language models work...",
  "Write a poem about recursion...",
  "What is quantum entanglement?",
  "Describe the future of AI...",
]


function MorphingPlaceholder({ text }: { text: string }) {
  return (
    <div
      className="pointer-events-none absolute inset-0 flex items-center px-2"
      style={{ perspective: "400px" }}
    >
      <AnimatePresence mode="wait">
        <motion.span key={text} className="flex text-[13px] text-muted-foreground">
          {text.split("").map((char, i) => (
            <motion.span
              key={`${text}-${i}`}
              initial={{ opacity: 0, rotateX: 70, filter: "blur(4px)" }}
              animate={{ opacity: 1, rotateX: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, rotateX: -70, filter: "blur(3px)" }}
              transition={{
                duration: 0.25,
                delay: i * 0.012,
                type: "spring",
                bounce: 0.15,
              }}
              className="inline-block origin-bottom"
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </motion.span>
      </AnimatePresence>
    </div>
  )
}

/* Dots per row — forms an ellipse: tapered edges, wide center */
const ELLIPSE_ROWS = [3, 5, 7, 5, 3]
const ELLIPSE_MAX = 7

function WaveDotsLoader() {
  return (
    <div className="flex flex-col items-center gap-[2px]">
      {ELLIPSE_ROWS.map((count, row) => {
        const offset = (ELLIPSE_MAX - count) / 2
        return (
          <div key={row} className="flex gap-[2px]">
            {Array.from({ length: count }).map((_, col) => (
              <div
                key={col}
                className="size-[2px] rounded-full bg-foreground"
                style={{
                  animation: "gt-wave 1.6s ease-in-out infinite",
                  animationDelay: `${(offset + col) * 0.08 + row * 0.05}s`,
                }}
              />
            ))}
          </div>
        )
      })}
    </div>
  )
}

export function GenerateTextPreview() {
  const [state, setState] = useState<
    "idle" | "thinking" | "streaming" | "complete"
  >("idle")
  const [prompt, setPrompt] = useState("")
  const [displayed, setDisplayed] = useState("")
  const [elapsed, setElapsed] = useState(0)
  const [phIdx, setPhIdx] = useState(0)
  const idxRef = useRef(0)
  const tmRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const t0Ref = useRef(0)

  useEffect(() => {
    if (state !== "idle" || prompt) return
    const iv = setInterval(
      () => setPhIdx((i) => (i + 1) % GT_PLACEHOLDERS.length),
      3500
    )
    return () => clearInterval(iv)
  }, [state, prompt])

  function submit() {
    if (!prompt.trim() || state === "thinking" || state === "streaming") return
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
    <div className="mx-auto w-full max-w-md p-6">
      <style>{GT_KEYFRAMES}</style>

      {/* ── Input ── */}
      <div className="flex items-center gap-1.5 rounded-full border border-border/40 bg-muted/30 py-1.5 pl-3 pr-1.5">
        <div className="relative flex flex-1 items-center">
          <input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            disabled={isActive}
            className="relative z-10 h-7 w-full bg-transparent text-[13px] text-foreground outline-none disabled:opacity-40"
          />
          {!prompt && state === "idle" && (
            <MorphingPlaceholder text={GT_PLACEHOLDERS[phIdx]} />
          )}
        </div>
        <motion.button
          onClick={submit}
          disabled={!prompt.trim() || isActive}
          whileTap={{ scale: 0.9 }}
          className="flex size-6 shrink-0 items-center justify-center rounded-full bg-foreground shadow-sm transition-opacity disabled:opacity-20"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-background"
          >
            <path d="M12 19V5" />
            <path d="m5 12 7-7 7 7" />
          </svg>
        </motion.button>
      </div>

      {/* ── Wave Dots Loader ── */}
      <AnimatePresence>
        {state === "thinking" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-4"
          >
            <WaveDotsLoader />
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
            className="mt-4"
          >
            <p className="whitespace-pre-wrap text-[13.5px] leading-[1.8] text-foreground/80">
              {displayed}
              {state === "streaming" && (
                <span
                  className="ml-px inline-block h-[15px] w-[1.5px] translate-y-[3px] rounded-full bg-foreground/60"
                  style={{
                    animation: "gt-blink 0.8s step-end infinite",
                  }}
                />
              )}
            </p>
            {state === "complete" && (
              <div className="mt-3 flex items-center justify-between">
                <span className="font-mono text-[10px] text-foreground/15">
                  {GT_TOKENS} tokens · {(elapsed / 1000).toFixed(1)}s
                </span>
                <button
                  onClick={reset}
                  className="font-mono text-[10px] text-foreground/20 transition-colors hover:text-foreground/50"
                >
                  clear
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
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
  const [displayed, setDisplayed] = useState("")
  const [tokenCount, setTokenCount] = useState(0)
  const [phIdx, setPhIdx] = useState(0)
  const idxRef = useRef(0)
  const tmRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const t0Ref = useRef(0)
  const [elapsed, setElapsed] = useState(0)

  /* rotate placeholder */
  useEffect(() => {
    if (state !== "idle" || prompt) return
    const iv = setInterval(
      () => setPhIdx((i) => (i + 1) % ST_PLACEHOLDERS.length),
      3500
    )
    return () => clearInterval(iv)
  }, [state, prompt])

  function submit() {
    if (!prompt.trim() || state === "streaming") return
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
    <div className="mx-auto w-full max-w-md p-6">
      <style>{ST_KEYFRAMES}</style>

      {/* ── Input ── */}
      <div className="flex items-center gap-1.5 rounded-full border border-border/40 bg-muted/30 py-1.5 pl-3 pr-1.5">
        <div className="relative flex flex-1 items-center">
          <input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            disabled={isStreaming}
            className="relative z-10 h-7 w-full bg-transparent text-[13px] text-foreground outline-none disabled:opacity-40"
          />
          {!prompt && state === "idle" && (
            <MorphingPlaceholder text={ST_PLACEHOLDERS[phIdx]} />
          )}
        </div>
        <motion.button
          onClick={submit}
          disabled={!prompt.trim() || isStreaming}
          whileTap={{ scale: 0.9 }}
          className="flex size-6 shrink-0 items-center justify-center rounded-full bg-foreground shadow-sm transition-opacity disabled:opacity-20"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-background"
          >
            <path d="M12 19V5" />
            <path d="m5 12 7-7 7 7" />
          </svg>
        </motion.button>
      </div>

      {/* ── Stream progress line ── */}
      <AnimatePresence>
        {isStreaming && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-3 h-px overflow-hidden rounded-full bg-border/20"
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
            className="mt-4"
          >
            <p className="whitespace-pre-wrap text-[13.5px] leading-[1.8] text-foreground/80">
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
                <span className="font-mono text-[10px] tabular-nums text-foreground/20">
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
                <span className="font-mono text-[10px] tabular-nums text-foreground/15">
                  {tokenCount} tokens · {(elapsed / 1000).toFixed(1)}s
                  {tps && <> · {tps} tok/s</>}
                </span>
                <button
                  onClick={reset}
                  className="font-mono text-[10px] text-foreground/20 transition-colors hover:text-foreground/50"
                >
                  clear
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
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
    <div className="mx-auto w-full max-w-md p-6">
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
        className="w-full resize-none rounded-lg border border-border/40 bg-muted/20 px-3 py-2.5 text-[13px] leading-relaxed text-foreground outline-none placeholder:text-muted-foreground/30 focus:border-foreground/10 disabled:opacity-40"
      />
      <div className="mt-2 flex items-center justify-between">
        <span className="font-mono text-[10px] text-foreground/15">
          512 × 512 · 4 variations
        </span>
        <button
          onClick={generate}
          disabled={!prompt.trim() || state === "generating"}
          className="font-mono text-[11px] text-foreground/40 transition-colors hover:text-foreground disabled:opacity-20"
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
            <span className="font-mono text-[10px] text-foreground/20">
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
                    <p className="font-mono text-[9px] text-white/70">
                      {v.label}
                    </p>
                  </div>
                </motion.button>
              ))}
            </div>

            <div className="mt-3 flex items-center justify-between">
              <span className="font-mono text-[10px] text-foreground/15">
                {selectedIdx !== null
                  ? imageVariants[selectedIdx].label
                  : "select a variation"}
              </span>
              <button
                onClick={reset}
                className="font-mono text-[10px] text-foreground/20 transition-colors hover:text-foreground/50"
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
    <div className="mx-auto w-full max-w-md p-6">
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
        className="w-full resize-none rounded-lg border border-border/40 bg-muted/20 px-3 py-2.5 text-[13px] leading-relaxed text-foreground outline-none placeholder:text-muted-foreground/30 focus:border-foreground/10 disabled:opacity-40"
      />

      {/* ── Voice picker + generate ── */}
      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center gap-0.5">
          {VOICE_OPTIONS.map((v) => (
            <button
              key={v}
              onClick={() => setVoice(v)}
              className={`rounded-full px-1.5 py-0.5 font-mono text-[10px] transition-colors ${
                voice === v
                  ? "bg-foreground text-background"
                  : "text-foreground/25 hover:text-foreground/50"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
        <button
          onClick={generate}
          disabled={!text.trim() || state === "generating"}
          className="font-mono text-[11px] text-foreground/40 transition-colors hover:text-foreground disabled:opacity-20"
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
            <span className="font-mono text-[10px] text-foreground/20">
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
                      filled ? "bg-foreground/50" : "bg-foreground/10"
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
                <span className="font-mono text-[10px] tabular-nums text-foreground/20">
                  0:{String(Math.floor((progress / 100) * 12)).padStart(2, "0")} / 0:12
                </span>
              </div>
              <button
                onClick={reset}
                className="font-mono text-[10px] text-foreground/20 transition-colors hover:text-foreground/50"
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
    <div className="mx-auto w-full max-w-md p-6">
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
            ? "border-foreground/20 bg-muted/40"
            : "border-border/40 bg-muted/10 hover:bg-muted/20"
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
          className="text-foreground/20"
        >
          <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          <line x1="12" x2="12" y1="19" y2="22" />
        </svg>
        <p className="mt-2 text-[11px] text-foreground/20">
          Drop audio or click to upload
        </p>
        <p className="mt-0.5 font-mono text-[9px] text-foreground/10">
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
            <span className="font-mono text-[10px] text-foreground/20">
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
            <p className="whitespace-pre-wrap text-[13.5px] leading-[1.8] text-foreground/80">
              {result}
            </p>
            <div className="mt-3 flex items-center justify-between">
              <span className="font-mono text-[10px] text-foreground/15">
                {result.split(/\s+/).length} words · whisper-large-v3
              </span>
              <button
                onClick={reset}
                className="font-mono text-[10px] text-foreground/20 transition-colors hover:text-foreground/50"
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
    <div className="mx-auto w-full max-w-md space-y-3 p-6">
      <style>{GT_KEYFRAMES}</style>

      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] text-foreground/20">
          tool execution
        </span>
        <button
          onClick={() => setStep(0)}
          className="font-mono text-[10px] text-foreground/20 transition-colors hover:text-foreground/50"
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
                <div className="rounded-full bg-foreground/5 px-3 py-1.5 text-[13px] text-foreground">
                  {s.content}
                </div>
              </div>
            )}
            {s.type === "tool_call" && (
              <div className="rounded-lg bg-muted/30 px-3 py-2.5">
                <div className="flex items-center gap-1.5">
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-foreground/25"
                  >
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                  </svg>
                  <span className="font-mono text-[10px] text-foreground/25">
                    {s.name}
                  </span>
                </div>
                <pre className="mt-1 font-mono text-[11px] text-foreground/40">
                  {s.args}
                </pre>
              </div>
            )}
            {s.type === "tool_result" && (
              <div className="rounded-lg border border-dashed border-border/30 px-3 py-2.5">
                <span className="font-mono text-[10px] text-foreground/20">
                  result
                </span>
                <pre className="mt-1 font-mono text-[11px] text-foreground/40">
                  {s.content}
                </pre>
              </div>
            )}
            {s.type === "assistant" && (
              <p className="text-[13.5px] leading-[1.8] text-foreground/80">
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
    <div className="mx-auto w-full max-w-md p-6">
      <style>{GT_KEYFRAMES}</style>

      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] text-foreground/20">
          agent execution
        </span>
        <button
          onClick={() => setStep(0)}
          className="font-mono text-[10px] text-foreground/20 transition-colors hover:text-foreground/50"
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
                        : "bg-foreground/5"
                  }`}
                />
                {i < AGENT_STEPS.length - 1 && (
                  <div
                    className={`mt-1 h-5 w-px transition-colors duration-300 ${
                      visible ? "bg-foreground/10" : "bg-foreground/5"
                    }`}
                  />
                )}
              </div>
              <div className="-mt-0.5">
                <p
                  className={`text-[12px] transition-colors duration-300 ${
                    isCurrent
                      ? "font-medium text-foreground"
                      : "text-foreground/50"
                  }`}
                >
                  {s.label}
                </p>
                <p className="font-mono text-[10px] text-foreground/20">
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
          <span className="font-mono text-[10px] text-foreground/20">
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
          <span className="font-mono text-[10px] text-foreground/15">
            6 steps · completed
          </span>
        </motion.div>
      )}
    </div>
  )
}
