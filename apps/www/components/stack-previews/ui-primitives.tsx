"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { AnimatePresence, motion } from "motion/react"
import { cn } from "@/lib/utils"

/* ─────────────────────────────────────────────────────────────────
 * Shared keyframes injected once per file
 * ───────────────────────────────────────────────────────────────── */
const KEYFRAMES = `
@keyframes up-wave{0%,100%{transform:scaleY(.3);opacity:.3}50%{transform:scaleY(1);opacity:1}}
@keyframes orb-pulse{0%,100%{transform:scale(1);opacity:.6}50%{transform:scale(1.18);opacity:1}}
@keyframes ping-slow{0%{transform:scale(1);opacity:.6}100%{transform:scale(2.2);opacity:0}}
@keyframes shimmer-slide{0%{transform:translateX(-100%)}100%{transform:translateX(200%)}}
`

/* ─────────────────────────────────────────────────────────────────
 * ARTIFACT CANVAS  — Claude Artifacts split-pane
 * ───────────────────────────────────────────────────────────────── */

const CANVAS_CODE = `export function PricingCard({
  plan, price, features,
}: PricingCardProps) {
  return (
    <div className="rounded-xl border p-6 shadow-sm">
      <h3 className="font-semibold text-sm">{plan}</h3>
      <p className="mt-2 text-3xl font-bold">
        \${price}
        <span className="text-sm font-normal text-muted-foreground">/mo</span>
      </p>
      <ul className="mt-4 space-y-2">
        {features.map((f) => (
          <li key={f} className="flex items-center gap-2 text-sm">
            <Check className="size-4 text-green-500" />
            {f}
          </li>
        ))}
      </ul>
      <Button className="mt-6 w-full">Get started</Button>
    </div>
  )
}`

const CANVAS_REPLY = "Here's a pricing card with a clean, minimal design:"
const CANVAS_FEATURES = ["Unlimited stacks", "Pro components", "Priority support"]

export function ArtifactCanvasPreview() {
  const [phase, setPhase] = useState<"idle" | "chat" | "code" | "done">("idle")
  const [chatText, setChatText] = useState("")
  const [codeText, setCodeText] = useState("")
  const [tab, setTab] = useState<"code" | "preview">("code")
  const timerRef = useRef<ReturnType<typeof setTimeout>[]>([])

  function clearTimers() {
    timerRef.current.forEach(clearTimeout)
    timerRef.current = []
  }

  function run() {
    clearTimers()
    setChatText("")
    setCodeText("")
    setTab("code")
    setPhase("chat")

    // Stream chat reply
    let ci = 0
    function stepChat() {
      ci++
      setChatText(CANVAS_REPLY.slice(0, ci))
      if (ci < CANVAS_REPLY.length) {
        timerRef.current.push(setTimeout(stepChat, 22))
      } else {
        timerRef.current.push(setTimeout(startCode, 200))
      }
    }
    timerRef.current.push(setTimeout(stepChat, 300))
  }

  function startCode() {
    setPhase("code")
    let ci = 0
    function stepCode() {
      ci = Math.min(ci + Math.floor(Math.random() * 6) + 3, CANVAS_CODE.length)
      setCodeText(CANVAS_CODE.slice(0, ci))
      if (ci < CANVAS_CODE.length) {
        timerRef.current.push(setTimeout(stepCode, 28))
      } else {
        setPhase("done")
      }
    }
    timerRef.current.push(setTimeout(stepCode, 100))
  }

  useEffect(() => () => clearTimers(), [])

  const lines = codeText.split("\n")

  return (
    <div className="flex h-[460px] w-full overflow-hidden">
      <style>{KEYFRAMES}</style>

      {/* ── Left: Chat panel ── */}
      <div className="flex w-[40%] min-w-0 flex-col border-r border-border">
        <div className="flex h-9 shrink-0 items-center border-b border-border px-3">
          <span className="text-sm font-medium text-muted-foreground">Claude</span>
        </div>

        <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-3">
          {/* User message always visible */}
          <div className="flex justify-end">
            <div className="max-w-[90%] rounded-xl rounded-br-sm bg-foreground px-3 py-2 text-sm text-background">
              Build a pricing card component with a features list
            </div>
          </div>

          {/* AI reply */}
          <AnimatePresence>
            {chatText && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="max-w-[90%] rounded-xl rounded-bl-sm bg-card px-3 py-2 text-sm text-foreground">
                  {chatText}
                  {phase === "chat" && (
                    <span className="ml-0.5 inline-block h-2.5 w-px animate-pulse bg-foreground/60 align-middle" />
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* CTA */}
          <div className="mt-auto flex justify-center pb-1">
            {(phase === "idle" || phase === "done") && (
              <button
                onClick={run}
                className="rounded-full bg-foreground px-4 py-1.5 text-sm font-medium text-background transition-opacity hover:opacity-80"
              >
                {phase === "idle" ? "Try demo →" : "Run again"}
              </button>
            )}
          </div>
        </div>

        {/* Input bar */}
        <div className="border-t border-border p-2.5">
          <div className="flex items-center gap-2 rounded-lg border border-border shadow-sm bg-card px-2.5 py-1.5">
            <span className="flex-1 text-sm text-muted-foreground">Ask Claude Artifacts to build…</span>
            <div className="flex size-5 items-center justify-center rounded-full bg-card">
              <svg viewBox="0 0 24 24" className="size-3 text-muted-foreground">
                <path d="M12 19V5M5 12l7-7 7 7" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right: Artifact panel ── */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Tab bar */}
        <div className="flex h-9 shrink-0 items-center gap-0 border-b border-border px-1">
          {(["code", "preview"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "px-3 py-1.5 text-sm font-medium capitalize transition-colors",
                tab === t
                  ? "border-b-2 border-foreground text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {t}
            </button>
          ))}
          <div className="ml-auto flex items-center gap-1.5 pr-2">
            {phase === "code" && (
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <span className="size-1.5 animate-pulse rounded-full bg-orange-400" />
                Generating
              </span>
            )}
            {phase === "done" && (
              <span className="text-sm text-muted-foreground">Claude Artifact • React</span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          {tab === "code" && (
            <pre className="h-full p-3 font-mono text-sm leading-relaxed">
              {codeText ? (
                lines.map((line, i) => (
                  <div key={i}>
                    <CodeLine line={line} />
                  </div>
                ))
              ) : (
                <span className="text-muted-foreground/50">{"// Code will appear here…"}</span>
              )}
              {(phase === "code") && (
                <span className="ml-0.5 inline-block h-2.5 w-px animate-pulse bg-foreground/60 align-middle" />
              )}
            </pre>
          )}

          {tab === "preview" && (
            <div className="flex h-full items-center justify-center p-4">
              {phase === "done" ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full max-w-[200px] rounded-xl border border-border shadow-sm p-5 shadow-sm"
                >
                  <p className="text-sm font-semibold">Pro</p>
                  <p className="mt-1.5 text-[22px] font-bold leading-none">
                    $29<span className="text-sm font-normal text-muted-foreground">/mo</span>
                  </p>
                  <ul className="mt-3.5 space-y-2">
                    {CANVAS_FEATURES.map((f) => (
                      <li key={f} className="flex items-center gap-1.5 text-sm">
                        <svg viewBox="0 0 24 24" className="size-3 shrink-0 text-green-500">
                          <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button className="mt-4 w-full rounded-md bg-foreground py-1.5 text-sm font-medium text-background">
                    Get started
                  </button>
                </motion.div>
              ) : (
                <span className="text-sm text-muted-foreground">
                  Preview appears after generation
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* Minimal syntax coloring for the canvas code view */
function CodeLine({ line }: { line: string }) {
  if (line.trim().startsWith("//"))
    return <span className="text-muted-foreground">{line}</span>
  if (line.trim().startsWith("export") || line.trim().startsWith("return") || line.trim().startsWith("import"))
    return <span><span className="text-violet-600 dark:text-violet-400">{line.match(/^(\s*\w+)/)?.[1]}</span>{line.slice((line.match(/^(\s*\w+)/)?.[1] ?? "").length)}</span>
  if (line.includes("className="))
    return <span>{line.replace(/className="([^"]+)"/, (_, c) => `className=<span style="color:var(--muted-foreground,#888)">"${c}"</span>`)}</span>
  return <span>{line}</span>
}


/* ─────────────────────────────────────────────────────────────────
 * VOICE INPUT BUTTON  — ChatGPT Voice mic with recording states + waveform
 * ───────────────────────────────────────────────────────────────── */

const WAVEFORM_HEIGHTS = Array.from({ length: 28 }, (_, i) =>
  Math.round(8 + Math.abs(Math.sin((i / 28) * Math.PI * 3)) * 28)
)

type VoiceState = "idle" | "listening" | "processing" | "done"

export function VoiceInputPreview() {
  const [state, setState] = useState<VoiceState>("idle")
  const [elapsed, setElapsed] = useState(0)
  const timerRef = useRef<ReturnType<typeof setTimeout>[]>([])
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  function clearTimers() {
    timerRef.current.forEach(clearTimeout)
    timerRef.current = []
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null }
  }

  function startRecording() {
    if (state !== "idle" && state !== "done") return
    clearTimers()
    setElapsed(0)
    setState("listening")
    intervalRef.current = setInterval(() => setElapsed((e) => e + 100), 100)
    timerRef.current.push(setTimeout(() => {
      setState("processing")
      if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null }
    }, 2800))
    timerRef.current.push(setTimeout(() => setState("done"), 4000))
    timerRef.current.push(setTimeout(() => setState("idle"), 6500))
  }

  useEffect(() => () => clearTimers(), [])

  const formatTime = (ms: number) => {
    const s = Math.floor(ms / 1000)
    return `0:${String(s).padStart(2, "0")}`
  }

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col items-center gap-5 p-6 pt-8">
      {/* Waveform */}
      <div className="flex h-10 items-center gap-[2px]">
        {WAVEFORM_HEIGHTS.map((h, i) => (
          <div
            key={i}
            className={cn(
              "w-[2.5px] rounded-full transition-colors duration-300",
              state === "listening" ? "bg-foreground" : "bg-foreground/20",
            )}
            style={{
              height: state === "listening" ? `${h}px` : "3px",
              animation:
                state === "listening"
                  ? `up-wave 0.7s ease-in-out ${i * 0.035}s infinite alternate`
                  : "none",
              transition: "height 0.4s ease, background-color 0.3s",
            }}
          />
        ))}
      </div>

      {/* Mic button */}
      <div className="relative flex items-center justify-center">
        {state === "listening" && (
          <>
            <span
              className="absolute inset-0 -m-4 rounded-full border border-border"
              style={{ animation: "ping-slow 1.4s ease-out infinite" }}
            />
            <span
              className="absolute inset-0 -m-8 rounded-full border border-border"
              style={{ animation: "ping-slow 1.4s ease-out 0.4s infinite" }}
            />
          </>
        )}

        <motion.button
          onClick={startRecording}
          whileTap={{ scale: 0.92 }}
          className={cn(
            "relative flex size-14 items-center justify-center rounded-full transition-all duration-300",
            state === "idle" && "cursor-pointer border border-border bg-background hover:border-foreground/25 hover:bg-card/80",
            state === "listening" && "bg-foreground shadow-lg",
            state === "processing" && "border border-border bg-card",
            state === "done" && "cursor-pointer border border-emerald-500/40 bg-emerald-500/10",
          )}
        >
          <AnimatePresence mode="wait">
            {state === "idle" && (
              <motion.span key="mic" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ duration: 0.15 }}>
                <MicIcon className="size-5 text-foreground" />
              </motion.span>
            )}
            {state === "listening" && (
              <motion.span key="stop" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ duration: 0.15 }}>
                <StopIcon className="size-4 text-background" />
              </motion.span>
            )}
            {state === "processing" && (
              <motion.span key="spin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <SpinnerIcon className="size-5 text-muted-foreground" />
              </motion.span>
            )}
            {state === "done" && (
              <motion.span key="check" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ duration: 0.15 }}>
                <CheckIcon className="size-5 text-emerald-500" />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Status + Timer */}
      <div className="flex flex-col items-center gap-1">
        <AnimatePresence mode="wait">
          <motion.p
            key={state}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="text-sm text-muted-foreground"
          >
            {state === "idle" ? "Tap for ChatGPT Voice" : state === "listening" ? "ChatGPT listening…" : state === "processing" ? "ChatGPT transcribing…" : "ChatGPT Voice ready"}
          </motion.p>
        </AnimatePresence>
        <AnimatePresence>
          {state === "listening" && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="font-mono text-sm tabular-nums text-muted-foreground/70"
            >
              {formatTime(elapsed)}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Transcript */}
      <AnimatePresence>
        {state === "done" && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="w-full rounded-xl border border-border shadow-sm bg-card/80 px-4 py-3"
          >
            <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground/60">ChatGPT Voice Transcript</p>
            <p className="mt-1 text-sm leading-relaxed text-foreground">
              &ldquo;Build a pricing card component with three tiers&rdquo;
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}


/* ─────────────────────────────────────────────────────────────────
 * STREAMING MARKDOWN  — ChatGPT-style markdown renderer with streaming effect
 * ───────────────────────────────────────────────────────────────── */

const MD_BLOCKS = [
  { type: "h1", text: "Quick Sort Algorithm" },
  { type: "p", parts: [{ t: "Quick sort is a " }, { t: "divide and conquer", bold: true }, { t: " algorithm with " }, { t: "O(n log n)", code: true }, { t: " average time complexity." }] },
  { type: "h2", text: "Implementation" },
  {
    type: "code",
    lang: "typescript",
    text: `function quickSort(arr: number[]): number[] {
  if (arr.length <= 1) return arr
  const pivot = arr[Math.floor(arr.length / 2)]
  const left = arr.filter((x) => x < pivot)
  const right = arr.filter((x) => x > pivot)
  return [...quickSort(left), pivot, ...quickSort(right)]
}`,
  },
  {
    type: "list",
    items: [
      "O(n log n) average, O(n²) worst case",
      "In-place variant available",
      "Not stable by default",
    ],
  },
]

export function StreamingMarkdownPreview() {
  const [revealed, setRevealed] = useState(0) // how many blocks shown
  const [charCount, setCharCount] = useState(0) // chars revealed in current block
  const [running, setRunning] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout>[]>([])

  function clearTimers() { timerRef.current.forEach(clearTimeout); timerRef.current = [] }

  function start() {
    clearTimers()
    setRevealed(0)
    setCharCount(0)
    setRunning(true)
    revealBlock(0, 0)
  }

  function revealBlock(blockIdx: number, charIdx: number) {
    if (blockIdx >= MD_BLOCKS.length) { setRunning(false); return }
    const block = MD_BLOCKS[blockIdx]
    const fullText = blockFullText(block)
    const nextChar = charIdx + Math.floor(Math.random() * 5) + 3

    if (nextChar < fullText.length) {
      setRevealed(blockIdx)
      setCharCount(nextChar)
      timerRef.current.push(setTimeout(() => revealBlock(blockIdx, nextChar), 20))
    } else {
      setRevealed(blockIdx + 1)
      setCharCount(0)
      timerRef.current.push(setTimeout(() => revealBlock(blockIdx + 1, 0), 120))
    }
  }

  useEffect(() => () => clearTimers(), [])

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-4 p-6">
      {!running && revealed === 0 && (
        <div className="flex justify-center pt-4">
          <button
            onClick={start}
            className="rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background"
          >
            Stream like ChatGPT →
          </button>
        </div>
      )}

      {MD_BLOCKS.slice(0, revealed + 1).map((block, bi) => {
        const isActive = bi === revealed && running
        const fullText = blockFullText(block)
        const visibleText = isActive ? fullText.slice(0, charCount) : fullText

        if (bi > revealed) return null

        return (
          <motion.div key={bi} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <MDBlock block={block} visibleText={visibleText} isActive={isActive} />
          </motion.div>
        )
      })}

      {!running && revealed >= MD_BLOCKS.length && (
        <button
          onClick={start}
          className="mt-2 self-start text-sm text-muted-foreground hover:text-foreground"
        >
          Stream again with ChatGPT
        </button>
      )}
    </div>
  )
}

function blockFullText(block: (typeof MD_BLOCKS)[0]): string {
  if (block.type === "p" && "parts" in block && block.parts) return block.parts.map((p) => p.t).join("")
  if (block.type === "code" && "text" in block) return (block as any).text
  if (block.type === "list" && "items" in block) return (block as any).items.join("\n")
  if ("text" in block) return (block as any).text
  return ""
}

function MDBlock({
  block,
  visibleText,
  isActive,
}: {
  block: (typeof MD_BLOCKS)[0]
  visibleText: string
  isActive: boolean
}) {
  const cursor = isActive ? (
    <span className="ml-px inline-block h-3 w-px animate-pulse bg-foreground/60 align-middle" />
  ) : null

  if (block.type === "h1") return <h1 className="text-base font-bold">{visibleText}{cursor}</h1>
  if (block.type === "h2") return <h2 className="text-sm font-semibold text-foreground">{visibleText}{cursor}</h2>

  if (block.type === "p" && "parts" in block && block.parts) {
    let remaining = visibleText
    return (
      <p className="text-sm leading-[1.75] text-foreground">
        {block.parts.map((part, i) => {
          if (remaining.length === 0) return null
          const slice = remaining.slice(0, part.t.length)
          remaining = remaining.slice(part.t.length)
          if (!slice) return null
          if (part.bold) return <strong key={i} className="font-semibold text-foreground">{slice}</strong>
          if (part.code) return <code key={i} className="rounded bg-card px-1 py-0.5 font-mono text-sm">{slice}</code>
          return <span key={i}>{slice}</span>
        })}
        {cursor}
      </p>
    )
  }

  if (block.type === "code") {
    const lines = visibleText.split("\n")
    return (
      <div className="overflow-hidden rounded-md border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-3 py-1.5">
          <span className="font-mono text-sm text-muted-foreground">typescript</span>
        </div>
        <pre className="overflow-x-auto p-3 font-mono text-sm leading-[1.7]">
          {lines.map((line, i) => (
            <div key={i} className={cn(line.includes("return") || line.startsWith("function") ? "text-violet-600 dark:text-violet-400" : "text-foreground")}>
              {line}
            </div>
          ))}
          {cursor}
        </pre>
      </div>
    )
  }

  if (block.type === "list" && "items" in block) {
    const visibleItems = visibleText.split("\n").filter(Boolean)
    return (
      <ul className="space-y-1 pl-1">
        {visibleItems.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-foreground/90">
            <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-muted-foreground/40" />
            {item}
            {isActive && i === visibleItems.length - 1 && cursor}
          </li>
        ))}
      </ul>
    )
  }

  return null
}


/* ─────────────────────────────────────────────────────────────────
 * MODEL SELECTOR  — OpenRouter command-palette provider + model picker
 * ───────────────────────────────────────────────────────────────── */

const MODELS = [
  {
    group: "Anthropic",
    color: "bg-orange-400",
    models: ["Claude 4 Sonnet", "Claude 4 Haiku", "Claude 4 Opus"],
  },
  {
    group: "OpenAI",
    color: "bg-emerald-400",
    models: ["GPT-4o", "GPT-4o mini", "o3-mini"],
  },
  {
    group: "Google",
    color: "bg-blue-400",
    models: ["Gemini 2.5 Pro", "Gemini 2.0 Flash", "Gemini 1.5 Pro"],
  },
]

export function ModelSelectorPreview() {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState({ group: "Anthropic", name: "Claude 4 Sonnet" })
  const [search, setSearch] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  const filtered = MODELS.map((g) => ({
    ...g,
    models: g.models.filter((m) => m.toLowerCase().includes(search.toLowerCase())),
  })).filter((g) => g.models.length > 0)

  const selectedColor = MODELS.find((g) => g.group === selected.group)?.color ?? "bg-muted"

  function pick(group: string, name: string) {
    setSelected({ group, name })
    setOpen(false)
    setSearch("")
  }

  useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 80) }, [open])

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col items-center gap-4 p-6">
      {/* Trigger */}
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex w-full items-center justify-between rounded-xl border px-3.5 py-2.5 transition-all duration-150",
          open
            ? "border-border bg-background shadow-sm"
            : "border-border bg-background hover:border-border"
        )}
      >
        <div className="flex items-center gap-2.5">
          <span className={cn("size-2 rounded-full", selectedColor)} />
          <span className="text-sm font-medium text-foreground">{selected.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded bg-card px-1.5 py-0.5 font-mono text-sm text-muted-foreground/70">⌘K</span>
          <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronIcon className="size-3.5 text-muted-foreground/70" />
          </motion.span>
        </div>
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="w-full overflow-hidden rounded-xl border border-border shadow-sm bg-background shadow-lg"
          >
            {/* Search */}
            <div className="border-b border-border px-3.5 py-2.5">
              <div className="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-muted-foreground/60" strokeLinecap="round">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
                <input
                  ref={inputRef}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search OpenRouter models…"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/70"
                />
              </div>
            </div>

            {/* List */}
            <div className="max-h-52 overflow-y-auto py-1">
              {filtered.map((g) => (
                <div key={g.group}>
                  <div className="flex items-center justify-between px-3.5 py-1.5">
                    <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground/60">
                      {g.group}
                    </p>
                    <span className="font-mono text-sm text-muted-foreground/50">{g.models.length}</span>
                  </div>
                  {g.models.map((name) => (
                    <button
                      key={name}
                      onClick={() => pick(g.group, name)}
                      className={cn(
                        "flex w-full items-center gap-2.5 px-3.5 py-2 text-left transition-colors hover:bg-card",
                        selected.name === name && "bg-card/80",
                      )}
                    >
                      <span className={cn("size-1.5 rounded-full", g.color)} />
                      <span className="flex-1 text-sm text-foreground">{name}</span>
                      {selected.name === name && (
                        <svg viewBox="0 0 24 24" className="size-3.5 text-foreground/80">
                          <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              ))}
              {filtered.length === 0 && (
                <p className="px-3.5 py-4 text-center text-sm text-muted-foreground/70">
                  No OpenRouter models found
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!open && (
        <p className="font-mono text-sm text-foreground/50">
          OpenRouter · {selected.group} · {selected.name}
        </p>
      )}
    </div>
  )
}


/* ─────────────────────────────────────────────────────────────────
 * PROMPT SUGGESTIONS  — ChatGPT-style empty state with suggestion chips
 * ───────────────────────────────────────────────────────────────── */

const SUGGESTIONS = [
  { icon: "⬡", label: "Understand code", text: "Explain this codebase to me" },
  { icon: "⚡", label: "Write tests", text: "Write unit tests for my API routes" },
  { icon: "⬢", label: "Find bugs", text: "Find security vulnerabilities in my code" },
  { icon: "✦", label: "Refactor", text: "Refactor this component to use hooks" },
]

export function PromptSuggestionsPreview() {
  const [input, setInput] = useState("")
  const [selected, setSelected] = useState<string | null>(null)

  function pick(text: string) {
    setSelected(text)
    setInput(text)
  }

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col items-center gap-5 p-6 pt-8">
      {/* Brand */}
      <div className="text-center">
        <p className="text-[18px] font-semibold tracking-tight">What can ChatGPT help you build?</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Pick a ChatGPT suggestion or type your own
        </p>
      </div>

      {/* 2×2 grid */}
      <div className="grid w-full grid-cols-2 gap-2">
        {SUGGESTIONS.map((s) => (
          <motion.button
            key={s.text}
            onClick={() => pick(s.text)}
            whileTap={{ scale: 0.97 }}
            className={cn(
              "flex flex-col items-start rounded-xl border p-3 text-left transition-all",
              selected === s.text
                ? "border-foreground/30 bg-card"
                : "border-border hover:border-border hover:bg-card",
            )}
          >
            <span className="text-base">{s.icon}</span>
            <span className="mt-1.5 text-sm font-medium leading-snug">{s.text}</span>
            <span className="mt-0.5 text-sm text-muted-foreground">{s.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Input */}
      <div className="flex w-full items-center gap-2 rounded-full border border-border bg-card py-2 pl-4 pr-2">
        <input
          value={input}
          onChange={(e) => { setInput(e.target.value); setSelected(null) }}
          placeholder="Or ask ChatGPT anything…"
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
        <motion.button
          whileTap={{ scale: 0.9 }}
          disabled={!input.trim()}
          className={cn(
            "flex size-7 items-center justify-center rounded-full transition-colors",
            input.trim() ? "bg-foreground" : "bg-card",
          )}
        >
          <svg viewBox="0 0 24 24" className={cn("size-3.5", input.trim() ? "text-background" : "text-muted-foreground")}>
            <path d="M12 19V5M5 12l7-7 7 7" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.button>
      </div>
    </div>
  )
}


/* ─────────────────────────────────────────────────────────────────
 * TOKEN COUNTER  — OpenAI context window meter with circular ring
 * ───────────────────────────────────────────────────────────────── */

const MODEL_LIMITS = [
  { name: "Claude 3.5 Sonnet", limit: 200000 },
  { name: "GPT-4o", limit: 128000 },
  { name: "Gemini 1.5 Pro", limit: 1000000 },
]

export function TokenCounterPreview() {
  const [text, setText] = useState("")
  const [modelIdx, setModelIdx] = useState(0)

  const model = MODEL_LIMITS[modelIdx]
  const tokens = Math.round(text.length * 0.75)
  const pct = Math.min((tokens / model.limit) * 100, 100)

  const R = 18
  const circ = 2 * Math.PI * R
  const dash = (pct / 100) * circ

  const colorClass = pct < 50 ? "text-emerald-600 dark:text-emerald-400" : pct < 80 ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400"
  const strokeClass = pct < 50 ? "stroke-emerald-600 dark:stroke-emerald-400" : pct < 80 ? "stroke-amber-600 dark:stroke-amber-400" : "stroke-red-600 dark:stroke-red-400"

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-4 p-6">
      {/* Header with model picker + ring */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setModelIdx((i) => (i + 1) % MODEL_LIMITS.length)}
            className="flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1 text-sm transition-colors hover:bg-card"
          >
            <span>{model.name}</span>
            <ChevronIcon className="size-3 text-muted-foreground" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <svg width="36" height="36" className="-rotate-90 shrink-0">
            <circle cx="18" cy="18" r={R} className="stroke-border/40" strokeWidth="3" fill="none" />
            <circle
              cx="18"
              cy="18"
              r={R}
              className={strokeClass}
              strokeWidth="3"
              fill="none"
              strokeDasharray={`${dash} ${circ}`}
              strokeLinecap="round"
              style={{ transition: "stroke-dasharray 0.3s ease, stroke 0.3s ease" }}
            />
          </svg>
          <div className="text-right">
            <p className={cn("font-mono text-sm font-medium", colorClass)}>
              {tokens.toLocaleString()}
            </p>
            <p className="font-mono text-sm text-muted-foreground">
              / {(model.limit / 1000).toFixed(0)}k
            </p>
          </div>
        </div>
      </div>

      {/* Textarea */}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste your prompt to count OpenAI tokens in real-time…"
        rows={5}
        className="w-full resize-none rounded-lg border border-border shadow-sm bg-card p-3 text-sm leading-relaxed outline-none placeholder:text-muted-foreground focus:border-foreground/50"
      />

      {/* Footer stats */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>{text.length} chars</span>
        <span>{pct.toFixed(1)}% OpenAI context used</span>
        <span>{Math.max(0, model.limit - tokens).toLocaleString()} remaining</span>
      </div>
    </div>
  )
}


/* ─────────────────────────────────────────────────────────────────
 * AI LOADING STATES  — Claude-style wave, orb, shimmer, typing indicator
 * ───────────────────────────────────────────────────────────────── */

type LoadingType = "wave" | "orb" | "shimmer" | "typing"

export function AILoadingStatesPreview() {
  const [active, setActive] = useState<LoadingType>("wave")

  const TABS: { id: LoadingType; label: string }[] = [
    { id: "wave", label: "Wave" },
    { id: "orb", label: "Orb" },
    { id: "shimmer", label: "Shimmer" },
    { id: "typing", label: "Typing" },
  ]

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col items-center gap-6 p-6">
      {/* Tab switcher */}
      <div className="flex items-center gap-1 rounded-lg border border-border shadow-sm bg-card p-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setActive(t.id)}
            className={cn(
              "rounded-md px-3 py-1 text-sm font-medium transition-all",
              active === t.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Animation area */}
      <div className="flex h-28 w-full items-center justify-center rounded-xl border border-border shadow-sm bg-muted/10">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            className="flex items-center justify-center"
          >
            {active === "wave" && <WaveDotsAnimation />}
            {active === "orb" && <OrbAnimation />}
            {active === "shimmer" && <ShimmerAnimation />}
            {active === "typing" && <TypingIndicator />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Label */}
      <p className="text-sm text-muted-foreground">
        {active === "wave" && "Claude wave — 5-row dot grid"}
        {active === "orb" && "Claude orb — glow + scale"}
        {active === "shimmer" && "Claude shimmer — streaming"}
        {active === "typing" && "Claude typing — three dots"}
      </p>
    </div>
  )
}

const ELLIPSE = [3, 5, 7, 5, 3]
const ELLIPSE_MAX = 7

function WaveDotsAnimation() {
  return (
    <div className="flex flex-col items-center gap-[3px]">
      {ELLIPSE.map((count, row) => {
        const offset = (ELLIPSE_MAX - count) / 2
        return (
          <div key={row} className="flex gap-[3px]">
            {Array.from({ length: count }).map((_, col) => (
              <div
                key={col}
                className="size-[3px] rounded-full bg-foreground"
                style={{
                  animation: "up-wave 1.4s ease-in-out infinite",
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

function OrbAnimation() {
  return (
    <div className="relative flex items-center justify-center">
      <div
        className="absolute size-10 rounded-full bg-foreground/10"
        style={{ animation: "orb-pulse 1.8s ease-in-out 0.2s infinite" }}
      />
      <div
        className="absolute size-7 rounded-full bg-foreground/20"
        style={{ animation: "orb-pulse 1.8s ease-in-out 0.1s infinite" }}
      />
      <div
        className="size-5 rounded-full bg-foreground/80"
        style={{ animation: "orb-pulse 1.8s ease-in-out infinite" }}
      />
    </div>
  )
}

function ShimmerAnimation() {
  return (
    <div className="flex w-48 flex-col gap-2">
      {[100, 75, 88, 55].map((w, i) => (
        <div key={i} className="relative h-2.5 overflow-hidden rounded-full bg-card" style={{ width: `${w}%` }}>
          <div
            className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-foreground/10 to-transparent"
            style={{ animation: "shimmer-slide 1.6s ease-in-out infinite", animationDelay: `${i * 0.1}s` }}
          />
        </div>
      ))}
    </div>
  )
}

function TypingIndicator() {
  return (
    <div className="flex items-end gap-1.5 rounded-xl bg-card px-4 py-3">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="size-2 rounded-full bg-foreground/60"
          style={{
            animation: "up-wave 1s ease-in-out infinite alternate",
            animationDelay: `${i * 0.15}s`,
          }}
        />
      ))}
    </div>
  )
}


/* ─────────────────────────────────────────────────────────────────
 * STRUCTURED OUTPUT VIEWER  — OpenAI collapsible JSON tree
 * ───────────────────────────────────────────────────────────────── */

const EXTRACTED = {
  title: "Senior TypeScript Developer",
  salary: { min: 110000, max: 165000, currency: "USD" },
  skills: ["React", "Node.js", "TypeScript", "PostgreSQL"],
  metadata: { source: "linkedin", confidence: 0.96, extractedAt: "2026-02-26" },
}

export function StructuredOutputPreview() {
  const [expanded, setExpanded] = useState<Set<string>>(new Set(["root"]))

  function toggle(key: string) {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-3 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">OpenAI Structured Output</span>
        <span className="rounded-full bg-emerald-100 dark:bg-emerald-500/10 px-2 py-0.5 font-mono text-sm text-emerald-700 dark:text-emerald-400">
          confidence: 96%
        </span>
      </div>

      {/* JSON tree */}
      <div className="rounded-lg border border-border shadow-sm bg-card p-3 font-mono text-sm">
        <JSONNode label="root" value={EXTRACTED} expanded={expanded} toggle={toggle} path="root" depth={0} />
      </div>

      <p className="text-sm text-muted-foreground">
        OpenAI generateObject() + Zod schema
      </p>
    </div>
  )
}

function JSONNode({
  label,
  value,
  expanded,
  toggle,
  path,
  depth,
}: {
  label: string
  value: unknown
  expanded: Set<string>
  toggle: (k: string) => void
  path: string
  depth: number
}) {
  const isObj = typeof value === "object" && value !== null && !Array.isArray(value)
  const isArr = Array.isArray(value)
  const isExpanded = expanded.has(path)

  if (isObj) {
    const entries = Object.entries(value as Record<string, unknown>)
    return (
      <div>
        <button onClick={() => toggle(path)} className="flex items-center gap-1 hover:text-foreground">
          <span className="text-muted-foreground">{isExpanded ? "▾" : "▸"}</span>
          <span className="text-foreground/90">{label === "root" ? "" : <><span className="text-sky-600 dark:text-sky-400">{label}</span>: </>}</span>
          {!isExpanded && <span className="text-muted-foreground">{"{"}{Object.keys(value as object).length} fields{"}"}</span>}
        </button>
        {isExpanded && (
          <div className="ml-3 border-l border-border pl-3">
            {entries.map(([k, v]) => (
              <JSONNode key={k} label={k} value={v} expanded={expanded} toggle={toggle} path={`${path}.${k}`} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    )
  }

  if (isArr) {
    return (
      <div>
        <button onClick={() => toggle(path)} className="flex items-center gap-1 hover:text-foreground">
          <span className="text-muted-foreground">{isExpanded ? "▾" : "▸"}</span>
          <span className="text-sky-600 dark:text-sky-400">{label}</span>
          <span className="text-foreground/90">:</span>
          {!isExpanded && <span className="text-muted-foreground">[{(value as unknown[]).length} items]</span>}
        </button>
        {isExpanded && (
          <div className="ml-3 border-l border-border pl-3">
            {(value as unknown[]).map((v, i) => (
              <div key={i} className="flex gap-1">
                <span className="text-muted-foreground">{i}:</span>
                <span className="text-amber-600 dark:text-amber-400">"{String(v)}"</span>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex gap-1">
      <span className="text-sky-600 dark:text-sky-400">{label}</span>
      <span className="text-foreground/60">:</span>
      {typeof value === "string" && <span className="text-amber-600 dark:text-amber-400">"{value}"</span>}
      {typeof value === "number" && <span className="text-emerald-600 dark:text-emerald-400">{String(value)}</span>}
      {typeof value === "boolean" && <span className="text-violet-600 dark:text-violet-400">{String(value)}</span>}
    </div>
  )
}


/* ─────────────────────────────────────────────────────────────────
 * AI IMAGE OUTPUT  — Midjourney-style generation card with shimmer + metadata
 * ───────────────────────────────────────────────────────────────── */

const PROMPTS = [
  "A futuristic city at dusk, neon reflections on wet streets",
  "Abstract geometric patterns in warm earth tones",
  "Minimalist mountain landscape at golden hour",
]

export function AIImageOutputPreview() {
  const [phase, setPhase] = useState<"idle" | "generating" | "done">("idle")
  const [promptIdx, setPromptIdx] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const timerRef = useRef<ReturnType<typeof setTimeout>[]>([])
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  function clearAll() {
    timerRef.current.forEach(clearTimeout)
    timerRef.current = []
    if (intervalRef.current) clearInterval(intervalRef.current)
  }

  function generate() {
    clearAll()
    setPhase("generating")
    setElapsed(0)
    intervalRef.current = setInterval(() => setElapsed((e) => e + 0.1), 100)
    timerRef.current.push(
      setTimeout(() => {
        clearAll()
        setPhase("done")
      }, 3200),
    )
  }

  function next() {
    setPromptIdx((i) => (i + 1) % PROMPTS.length)
    setPhase("idle")
  }

  useEffect(() => () => clearAll(), [])

  const prompt = PROMPTS[promptIdx]

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-4 p-6">
      {/* Prompt input */}
      <div className="flex items-end gap-2">
        <div className="flex-1 rounded-lg border border-border shadow-sm bg-card px-3 py-2">
          <p className="text-sm text-muted-foreground">Prompt</p>
          <p className="mt-0.5 text-sm leading-snug">{prompt}</p>
        </div>
        <button
          onClick={generate}
          disabled={phase === "generating"}
          className="shrink-0 rounded-lg bg-foreground px-3 py-2 text-sm font-medium text-background disabled:opacity-40"
        >
          Generate
        </button>
      </div>

      {/* Image card */}
      {(phase === "generating" || phase === "done") && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-xl border border-border shadow-sm"
        >
          {/* Image area */}
          <div className="relative h-44 w-full bg-card">
            {phase === "generating" && (
              <div className="absolute inset-0 overflow-hidden">
                <div
                  className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-foreground/5 to-transparent"
                  style={{ animation: "shimmer-slide 1.4s ease-in-out infinite" }}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                  <OrbAnimation />
                  <p className="text-sm text-muted-foreground">Midjourney generating… {elapsed.toFixed(1)}s</p>
                </div>
              </div>
            )}
            {phase === "done" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                {/* Simulated gradient art */}
                <div className="h-full w-full bg-gradient-to-br from-violet-200 via-indigo-200 to-sky-200 dark:from-violet-900/40 dark:via-indigo-800/30 dark:to-sky-900/40" />
                <div className="absolute inset-0 flex items-end p-3">
                  <div className="flex w-full items-center justify-between">
                    <span className="rounded-full bg-background/60 px-2 py-0.5 font-mono text-sm backdrop-blur-sm">
                      1024 × 1024
                    </span>
                    <button className="rounded-full bg-background/60 px-2 py-0.5 font-mono text-sm backdrop-blur-sm">
                      ↓ Save
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Metadata */}
          {phase === "done" && (
            <div className="flex items-center justify-between border-t border-border px-3 py-2">
              <span className="font-mono text-sm text-muted-foreground">Midjourney v6 · 3.2s</span>
              <button onClick={next} className="text-sm text-muted-foreground hover:text-foreground">
                New prompt →
              </button>
            </div>
          )}
        </motion.div>
      )}

      {phase === "idle" && (
        <div className="flex h-44 items-center justify-center rounded-xl border border-dashed border-border shadow-sm">
          <p className="text-sm text-muted-foreground">Midjourney image will appear here</p>
        </div>
      )}
    </div>
  )
}


/* ─────────────────────────────────────────────────────────────────
 * Shared micro-icons (inline SVG, no lucide dep)
 * ───────────────────────────────────────────────────────────────── */

function MicIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="2" width="6" height="12" rx="3" />
      <path d="M5 10a7 7 0 0014 0M12 19v3M8 22h8" />
    </svg>
  )
}
function StopIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <rect x="6" y="6" width="12" height="12" rx="2" />
    </svg>
  )
}
function SpinnerIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn("animate-spin", className)} fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round" />
    </svg>
  )
}
function CheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  )
}
function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9l6 6 6-6" />
    </svg>
  )
}
