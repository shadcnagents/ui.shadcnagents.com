"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { WaveDotsLoader, SuggestionPills, WAVE_KEYFRAMES, SPRING, FADE_UP, STAGGER } from "./shared"

/* ─── Basic Chat · OpenAI (ChatGPT) ─── */

const CHAT_PLACEHOLDERS = [
  "Ask ChatGPT anything...",
  "Explain quantum computing...",
  "Help me debug this code...",
  "Write a haiku about AI...",
]

const CHAT_RESPONSE =
  "The key insight is that self-attention allows the model to weigh the importance of different parts of the input simultaneously, rather than processing tokens sequentially. This parallelization is what makes transformers so efficient at capturing long-range dependencies in text."

export function BasicChatPreview() {
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([
    { role: "assistant", content: "Hello! I'm ChatGPT. How can I help you today?" },
  ])
  const [input, setInput] = useState("")
  const [state, setState] = useState<"idle" | "thinking" | "streaming">("idle")
  const [displayed, setDisplayed] = useState("")
  const bottomRef = useRef<HTMLDivElement>(null)
  const idxRef = useRef(0)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, displayed])

  function handleSend() {
    if (!input.trim() || state !== "idle") return
    const userMsg = input
    setMessages((prev) => [...prev, { role: "user", content: userMsg }])
    setInput("")
    setState("thinking")
    setDisplayed("")
    idxRef.current = 0
    setTimeout(() => setState("streaming"), 1500)
  }

  useEffect(() => {
    if (state !== "streaming") return
    const iv = setInterval(() => {
      if (idxRef.current < CHAT_RESPONSE.length) {
        idxRef.current += 1
        setDisplayed(CHAT_RESPONSE.slice(0, idxRef.current))
      } else {
        clearInterval(iv)
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: CHAT_RESPONSE },
        ])
        setDisplayed("")
        setState("idle")
      }
    }, 12)
    return () => clearInterval(iv)
  }, [state])

  return (
    <div className="mx-auto flex h-[420px] w-full max-w-lg flex-col">
      <style dangerouslySetInnerHTML={{ __html: WAVE_KEYFRAMES }} />

      <div className="flex-1 space-y-3 overflow-y-auto p-6 [&::-webkit-scrollbar]:hidden">
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...SPRING }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-foreground"
                }`}
              >
                {msg.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Thinking indicator */}
        {state === "thinking" && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING }}
            className="flex justify-start"
          >
            <div className="flex items-center gap-2.5 rounded-2xl bg-card px-4 py-3">
              <WaveDotsLoader />
            </div>
          </motion.div>
        )}

        {/* Streaming response */}
        {state === "streaming" && displayed && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING }}
            className="flex justify-start"
          >
            <div className="max-w-[80%] rounded-2xl bg-card px-3.5 py-2.5 text-sm leading-relaxed text-foreground">
              {displayed}
              <span
                className="ml-0.5 inline-block size-[3px] rounded-full bg-foreground"
                style={{ animation: "gt-blink 0.8s infinite" }}
              />
            </div>
          </motion.div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Suggestions + Input area */}
      <div className="border-t border-border p-4">
        <AnimatePresence>
          {!input && state === "idle" && (
            <div className="mb-3">
              <SuggestionPills suggestions={CHAT_PLACEHOLDERS} onSelect={setInput} />
            </div>
          )}
        </AnimatePresence>
        <div className="flex items-end gap-2 rounded-2xl border border-border bg-background px-3 py-2 transition-all duration-150 focus-within:border-foreground/30 focus-within:shadow-md">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Message ChatGPT..."
            className="h-9 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <motion.button
            onClick={handleSend}
            disabled={!input.trim() || state !== "idle"}
            whileTap={{ scale: 0.9 }}
            className={`flex size-9 shrink-0 items-center justify-center rounded-xl transition-all duration-150 ${
              input.trim() && state === "idle"
                ? "bg-primary text-primary-foreground"
                : "bg-foreground/10 text-muted-foreground/50"
            }`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </motion.button>
        </div>
      </div>
    </div>
  )
}

/* ─── Reasoning Display · DeepSeek ─── */
export function ReasoningChatPreview() {
  const [showThinking, setShowThinking] = useState(true)

  return (
    <div className="mx-auto w-full max-w-lg space-y-3 p-6">
      <style dangerouslySetInnerHTML={{ __html: WAVE_KEYFRAMES }} />

      {/* User message */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...SPRING }}
        className="flex justify-end"
      >
        <div className="rounded-2xl bg-primary px-3.5 py-2.5 text-sm text-primary-foreground">
          What is the square root of 144?
        </div>
      </motion.div>

      {/* Assistant with reasoning */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...SPRING, delay: 0.1 }}
        className="space-y-2"
      >
        <button
          onClick={() => setShowThinking(!showThinking)}
          className="flex items-center gap-1.5 text-sm font-medium uppercase tracking-wider text-muted-foreground transition-all duration-150 hover:text-foreground"
        >
          <svg
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className={`transition-transform duration-200 ${showThinking ? "rotate-0" : "-rotate-90"}`}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
          DeepThink
          <span className="font-mono text-xs tabular-nums font-normal text-muted-foreground/60">
            324ms
          </span>
        </button>

        <AnimatePresence initial={false}>
          {showThinking && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ ...SPRING }}
              className="overflow-hidden"
            >
              <div className="border-l-2 border-border pl-3 pb-1">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  The user is asking for the square root of 144. I need to find a
                  number that, when multiplied by itself, equals 144. I know that
                  12 × 12 = 144, so the square root of 144 is 12. Let me verify:
                  12² = 144. Confirmed.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="rounded-2xl bg-card px-3.5 py-2.5 text-sm leading-relaxed text-foreground">
          The square root of 144 is <strong>12</strong>.
        </div>
      </motion.div>
    </div>
  )
}

/* ─── Sources & Citations · Perplexity ─── */
export function SourcesChatPreview() {
  const sources = [
    { title: "Transformer Architecture", url: "arxiv.org", year: "2017" },
    { title: "Attention Is All You Need", url: "papers.nips.cc", year: "2017" },
    { title: "BERT: Pre-training", url: "arxiv.org", year: "2018" },
  ]

  return (
    <div className="mx-auto w-full max-w-lg space-y-3 p-6">
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...SPRING }}
        className="flex justify-end"
      >
        <div className="rounded-2xl bg-primary px-3.5 py-2.5 text-sm text-primary-foreground">
          Explain the transformer architecture
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...SPRING, delay: 0.08 }}
        className="space-y-3"
      >
        <div className="rounded-2xl bg-card px-3.5 py-2.5 text-sm leading-relaxed text-foreground">
          The Transformer architecture, introduced in 2017, revolutionized NLP by
          replacing recurrence with self-attention mechanisms
          <sup className="ml-0.5 font-mono text-xs text-primary">[1]</sup>.
          The key innovation is the multi-head attention mechanism that allows the
          model to attend to different positions simultaneously
          <sup className="ml-0.5 font-mono text-xs text-primary">[2]</sup>.
          This approach was later extended by models like BERT
          <sup className="ml-0.5 font-mono text-xs text-primary">[3]</sup>.
        </div>

        <div className="space-y-1.5">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Sources
          </span>
          <motion.div
            initial="initial"
            animate="animate"
            variants={{ animate: { ...STAGGER } }}
            className="space-y-1.5"
          >
            {sources.map((source, i) => (
              <motion.div
                key={i}
                variants={FADE_UP}
                transition={{ ...SPRING }}
                className="flex items-center gap-2.5 rounded-xl border border-border px-3 py-2.5 transition-all duration-150 hover:bg-card"
              >
                <span className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-primary/10 font-mono text-xs font-medium text-primary">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">
                    {source.title}
                  </p>
                  <p className="font-mono text-xs text-muted-foreground">
                    {source.url} · {source.year}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

/* ─── Plan Display · Devin ─── */
export function PlanDisplayPreview() {
  const [completedSteps, setCompletedSteps] = useState(0)

  const steps = [
    { title: "Analyze requirements", detail: "Parse user specifications and constraints" },
    { title: "Design schema", detail: "Create normalized database models" },
    { title: "Generate migrations", detail: "SQL migration files with rollback" },
    { title: "Create API routes", detail: "RESTful endpoints with validation" },
    { title: "Write tests", detail: "Unit and integration test suites" },
  ]

  /* Auto-advance through steps */
  useEffect(() => {
    if (completedSteps >= steps.length) return
    const timer = setTimeout(
      () => setCompletedSteps((s) => s + 1),
      completedSteps === 0 ? 1200 : 1800
    )
    return () => clearTimeout(timer)
  }, [completedSteps, steps.length])

  return (
    <div className="mx-auto w-full max-w-lg p-6">
      <style dangerouslySetInnerHTML={{ __html: WAVE_KEYFRAMES }} />

      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm font-semibold text-foreground">
          Devin&apos;s Plan
        </span>
        <span className="font-mono text-xs tabular-nums text-muted-foreground">
          {completedSteps}/{steps.length}
        </span>
      </div>

      <div className="space-y-0.5">
        {steps.map((step, i) => {
          const done = i < completedSteps
          const current = i === completedSteps && completedSteps < steps.length
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ ...SPRING, delay: i * 0.06 }}
              className="flex items-start gap-3 rounded-xl px-3 py-2.5 transition-all duration-150 hover:bg-card"
            >
              <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center">
                <AnimatePresence mode="wait">
                  {done ? (
                    <motion.svg
                      key="check"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ ...SPRING }}
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      className="text-primary"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </motion.svg>
                  ) : current ? (
                    <WaveDotsLoader />
                  ) : (
                    <div className="size-2 rounded-full bg-foreground/15" />
                  )}
                </AnimatePresence>
              </div>
              <div className="min-w-0 flex-1">
                <p
                  className={`text-sm transition-all duration-150 ${
                    done
                      ? "text-muted-foreground line-through"
                      : current
                        ? "font-medium text-foreground"
                        : "text-muted-foreground/60"
                  }`}
                >
                  {step.title}
                </p>
                <p className="text-xs text-muted-foreground/60">
                  {step.detail}
                </p>
              </div>
              {current && (
                <span className="mt-0.5 font-mono text-[10px] text-muted-foreground/40">
                  running
                </span>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Completion metadata */}
      <AnimatePresence>
        {completedSteps >= steps.length && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING }}
            className="mt-4 flex items-center justify-between border-t border-border pt-3"
          >
            <span className="font-mono text-xs text-muted-foreground">
              5 steps · 8.2s · completed
            </span>
            <button
              onClick={() => setCompletedSteps(0)}
              className="font-mono text-xs text-muted-foreground transition-all duration-150 hover:text-foreground"
            >
              reset
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ─── Tool Approval / Confirmation · Anthropic (Claude) ─── */
export function ToolApprovalPreview() {
  const [status, setStatus] = useState<"pending" | "approved" | "denied">(
    "pending"
  )

  return (
    <div className="mx-auto w-full max-w-lg space-y-3 p-6">
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...SPRING }}
        className="flex justify-end"
      >
        <div className="rounded-2xl bg-primary px-3.5 py-2.5 text-sm text-primary-foreground">
          Delete all inactive users from the database
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...SPRING, delay: 0.08 }}
        className="space-y-3"
      >
        <div className="rounded-2xl bg-card px-3.5 py-2.5 text-sm text-foreground">
          Claude needs to run a destructive operation. Please confirm:
        </div>

        <div className="rounded-xl border border-border bg-card/50 p-4 backdrop-blur-xl">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-lg bg-destructive/10">
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-destructive"
              >
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-foreground">Confirmation Required</span>
          </div>

          <div className="mb-4 rounded-lg bg-muted/50 p-3">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Action
            </p>
            <p className="mt-1 font-mono text-sm text-foreground">
              deleteUsers({`{ where: { lastActive: { lt: "2024-01-01" } } }`})
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              This will permanently remove 847 inactive user records
            </p>
          </div>

          <AnimatePresence mode="wait">
            {status === "pending" ? (
              <motion.div
                key="buttons"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -4 }}
                className="flex gap-2"
              >
                <button
                  onClick={() => setStatus("approved")}
                  className="h-9 flex-1 rounded-lg bg-foreground text-sm font-medium text-background transition-all duration-150 hover:bg-foreground/90"
                >
                  Approve
                </button>
                <button
                  onClick={() => setStatus("denied")}
                  className="h-9 flex-1 rounded-lg border border-border text-sm font-medium text-muted-foreground transition-all duration-150 hover:border-foreground/20 hover:text-foreground"
                >
                  Deny
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...SPRING }}
                className="flex items-center gap-1.5 text-sm"
              >
                {status === "approved" ? (
                  <>
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      className="text-primary"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span className="font-medium text-foreground">Approved</span>
                  </>
                ) : (
                  <>
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-destructive"
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                    <span className="text-muted-foreground">Denied</span>
                  </>
                )}
                <button
                  onClick={() => setStatus("pending")}
                  className="ml-auto font-mono text-xs text-muted-foreground transition-all duration-150 hover:text-foreground"
                >
                  reset
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}

/* ─── Queue Display · Linear ─── */
export function QueueDisplayPreview() {
  const [tasks, setTasks] = useState([
    { id: 1, name: "LIN-101 Fetch user data", status: "done" as const },
    { id: 2, name: "LIN-102 Process analytics", status: "done" as const },
    { id: 3, name: "LIN-103 Generate report", status: "running" as const },
    { id: 4, name: "LIN-104 Send notifications", status: "queued" as const },
    { id: 5, name: "LIN-105 Update dashboard", status: "queued" as const },
  ])

  useEffect(() => {
    const timer = setInterval(() => {
      setTasks((prev) => {
        const running = prev.findIndex((t) => t.status === "running")
        if (running === -1) return prev
        const next = [...prev]
        next[running] = { ...next[running], status: "done" }
        if (running + 1 < next.length) {
          next[running + 1] = { ...next[running + 1], status: "running" }
        }
        return next
      })
    }, 2000)
    return () => clearInterval(timer)
  }, [])

  const done = tasks.filter((t) => t.status === "done").length

  return (
    <div className="mx-auto w-full max-w-lg p-6">
      <style dangerouslySetInnerHTML={{ __html: WAVE_KEYFRAMES }} />

      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm font-semibold text-foreground">Linear Queue</span>
        <span className="font-mono text-xs tabular-nums text-muted-foreground">
          {done}/{tasks.length}
        </span>
      </div>

      <div className="space-y-0.5">
        <AnimatePresence initial={false}>
          {tasks.map((task) => (
            <motion.div
              key={task.id}
              layout
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ ...SPRING }}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-150 hover:bg-card"
            >
              <div className="flex size-5 shrink-0 items-center justify-center">
                <AnimatePresence mode="wait">
                  {task.status === "done" && (
                    <motion.svg
                      key="check"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ ...SPRING }}
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      className="text-primary"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </motion.svg>
                  )}
                  {task.status === "running" && (
                    <motion.div
                      key="loader"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <WaveDotsLoader />
                    </motion.div>
                  )}
                  {task.status === "queued" && (
                    <div className="size-2 rounded-full bg-foreground/15" />
                  )}
                </AnimatePresence>
              </div>
              <span
                className={`text-sm transition-all duration-150 ${
                  task.status === "done"
                    ? "text-muted-foreground line-through"
                    : task.status === "running"
                      ? "font-medium text-foreground"
                      : "text-muted-foreground/60"
                }`}
              >
                {task.name}
              </span>
              {task.status === "running" && (
                <span className="ml-auto font-mono text-[10px] text-muted-foreground/40">
                  processing
                </span>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Completion metadata */}
      <AnimatePresence>
        {done >= tasks.length && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING }}
            className="mt-4 flex items-center justify-between border-t border-border pt-3"
          >
            <span className="font-mono text-xs text-muted-foreground">
              {tasks.length} tasks · completed
            </span>
            <button
              onClick={() =>
                setTasks([
                  { id: 1, name: "LIN-101 Fetch user data", status: "done" },
                  { id: 2, name: "LIN-102 Process analytics", status: "done" },
                  { id: 3, name: "LIN-103 Generate report", status: "running" },
                  { id: 4, name: "LIN-104 Send notifications", status: "queued" },
                  { id: 5, name: "LIN-105 Update dashboard", status: "queued" },
                ])
              }
              className="font-mono text-xs text-muted-foreground transition-all duration-150 hover:text-foreground"
            >
              reset
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
