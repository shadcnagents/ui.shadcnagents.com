"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { cn } from "@/lib/utils"
import { SuggestionPills, WaveDotsLoader, WAVE_KEYFRAMES, SPRING, FADE_UP, STAGGER } from "./shared"

/* ══════════════════════════════════════════
   Rich Output Previews
   ══════════════════════════════════════════ */

/* ─── JSON → shadcn Render ─── */
export function JSONRenderShadcnPreview() {
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 800)
    const t2 = setTimeout(() => setPhase(2), 1800)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  return (
    <div className="mx-auto w-full max-w-lg p-6">
      <style dangerouslySetInnerHTML={{ __html: WAVE_KEYFRAMES }} />

      <div className="mb-4">
        <span className="text-sm font-medium text-foreground">JSON → shadcn/ui</span>
        <p className="mt-1 text-xs text-muted-foreground">Render structured data as shadcn/ui components</p>
      </div>
      <div className="space-y-3">
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...SPRING }}
          className="rounded-xl border border-border bg-card p-3 font-mono text-sm text-muted-foreground"
        >
          {`{ "type": "shadcn/card", "title": "Revenue", "value": "$12,450" }`}
        </motion.div>

        {phase >= 1 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ ...SPRING }}
            className="flex items-center justify-center py-2"
          >
            {phase < 2 ? (
              <WaveDotsLoader />
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground/70">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            )}
          </motion.div>
        )}

        <AnimatePresence>
          {phase >= 2 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...SPRING }}
              className="rounded-xl border border-border p-4"
            >
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Revenue</p>
              <p className="mt-1 text-2xl font-bold text-foreground">$12,450</p>
              <p className="mt-0.5 text-xs text-muted-foreground">+12.5% from last month</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

/* ─── JSON → Generate Code ─── */
export function JSONRenderGeneratePreview() {
  const [mode, setMode] = useState<"json" | "code">("json")

  return (
    <div className="mx-auto w-full max-w-lg p-6">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">v0 Code Generator</span>
        <div className="flex gap-1 rounded-xl border border-border p-0.5">
          {(["json", "code"] as const).map((m) => (
            <button key={m} onClick={() => setMode(m)} className={`rounded-lg px-2.5 py-1 text-xs font-medium capitalize transition-all duration-150 ${mode === m ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>
              {m}
            </button>
          ))}
        </div>
      </div>
      <div className="overflow-hidden rounded-xl border border-border bg-card p-4 font-mono text-sm">
        <AnimatePresence mode="wait">
          {mode === "json" ? (
            <motion.pre
              key="json"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ ...SPRING }}
              className="text-muted-foreground"
            >{`{
  "component": "UserCard",
  "props": {
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": "/avatars/john.jpg"
  }
}`}</motion.pre>
          ) : (
            <motion.pre
              key="code"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ ...SPRING }}
              className="text-foreground"
            >{`export function UserCard() {
  return (
    <div className="flex items-center gap-3">
      <Avatar src="/avatars/john.jpg" />
      <div>
        <p className="font-medium">John Doe</p>
        <p className="text-sm text-muted">john@example.com</p>
      </div>
    </div>
  )
}`}</motion.pre>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

/* ─── JSON → PDF ─── */
export function JSONRenderPDFPreview() {
  const [generated, setGenerated] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setGenerated(true), 1200)
    return () => clearTimeout(timer)
  }, [])

  const items = [
    { item: "Pro Subscription", qty: 1, price: "$49" },
    { item: "Extra Seats", qty: 3, price: "$30" },
  ]

  return (
    <div className="mx-auto w-full max-w-lg p-6">
      <style dangerouslySetInnerHTML={{ __html: WAVE_KEYFRAMES }} />

      <div className="mb-4">
        <span className="text-sm font-medium text-foreground">Adobe PDF Export</span>
      </div>

      {!generated ? (
        <div className="flex items-center gap-3 py-8">
          <WaveDotsLoader />
          <span className="text-sm text-muted-foreground">Generating invoice...</span>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...SPRING }}
        >
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="border-b border-border pb-3">
              <p className="text-sm font-bold text-foreground">Invoice #2024-001</p>
              <p className="text-xs text-muted-foreground">December 15, 2024</p>
            </div>
            <motion.div
              initial="initial"
              animate="animate"
              variants={{ animate: { ...STAGGER } }}
              className="mt-3 space-y-2"
            >
              {items.map((row) => (
                <motion.div
                  key={row.item}
                  variants={FADE_UP}
                  transition={{ ...SPRING }}
                  className="flex justify-between text-sm text-muted-foreground"
                >
                  <span>{row.item} x{row.qty}</span>
                  <span>{row.price}</span>
                </motion.div>
              ))}
              <motion.div
                variants={FADE_UP}
                transition={{ ...SPRING }}
                className="flex justify-between border-t border-border pt-2 text-sm font-medium text-foreground"
              >
                <span>Total</span>
                <span>$79.00</span>
              </motion.div>
            </motion.div>
          </div>
          <div className="mt-3 flex justify-end">
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="rounded-xl bg-foreground px-3 py-1.5 text-sm font-medium text-background"
            >
              Export via Adobe
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  )
}

/* ─── JSON → Remotion Video ─── */
export function JSONRenderRemotionPreview() {
  const [frame, setFrame] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => setFrame((p) => (p + 1) % 60), 100)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="mx-auto w-full max-w-lg p-6">
      <div className="mb-4">
        <span className="text-sm font-medium text-foreground">JSON → Remotion Video</span>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...SPRING }}
        className="overflow-hidden rounded-xl border border-border"
      >
        <div className="flex aspect-video items-center justify-center bg-muted/30">
          <div className="text-center" style={{ opacity: Math.min(1, frame / 15) }}>
            <motion.p
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...SPRING }}
              className="text-lg font-bold text-foreground"
            >
              Welcome
            </motion.p>
            <p className="mt-1 text-sm text-muted-foreground" style={{ opacity: Math.min(1, Math.max(0, (frame - 20) / 15)) }}>
              Remotion-powered video from structured data
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 border-t border-border px-3 py-2">
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-muted">
            <motion.div
              className="h-full rounded-full bg-primary/40"
              animate={{ width: `${(frame / 60) * 100}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
          <span className="font-mono text-xs text-muted-foreground">
            {Math.floor(frame / 30)}:{String(frame % 30).padStart(2, "0")}
          </span>
        </div>
      </motion.div>
    </div>
  )
}

/* ══════════════════════════════════════════
   Connectors Previews
   ══════════════════════════════════════════ */

/* ─── Web Preview Sandbox ─── */
export function WebPreviewSandboxPreview() {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 1400)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="mx-auto w-full max-w-lg p-6">
      <style dangerouslySetInnerHTML={{ __html: WAVE_KEYFRAMES }} />

      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...SPRING }}
        className="overflow-hidden rounded-xl border border-border"
      >
        <div className="flex items-center gap-2 border-b border-border bg-muted/50 px-3 py-2">
          <motion.div
            initial="initial"
            animate="animate"
            variants={{ animate: { ...STAGGER } }}
            className="flex gap-1"
          >
            {["bg-red-400/60", "bg-yellow-400/60", "bg-green-400/60"].map((c) => (
              <motion.div
                key={c}
                variants={FADE_UP}
                transition={{ ...SPRING }}
                className={`size-2.5 rounded-full ${c}`}
              />
            ))}
          </motion.div>
          <div className="flex-1 rounded-lg bg-card px-2 py-0.5 text-center text-xs text-muted-foreground">
            v0.dev/preview
          </div>
        </div>
        <div className="flex aspect-[16/10] items-center justify-center bg-card">
          {!loaded ? (
            <div className="flex items-center gap-2">
              <WaveDotsLoader />
              <span className="text-xs text-muted-foreground">Loading preview...</span>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ ...SPRING }}
              className="text-center"
            >
              <p className="text-sm font-medium text-foreground">v0 Live Preview</p>
              <p className="mt-1 text-xs text-muted-foreground">Sandboxed v0 preview of generated code</p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

/* ─── Exa Web Search v2 ─── */
export function ExaWebSearch2Preview() {
  const [query, setQuery] = useState("")
  const [phase, setPhase] = useState<"idle" | "searching" | "done">("idle")

  const results = [
    { title: "Building AI-powered apps with Next.js", url: "exa.ai/docs", score: 0.95 },
    { title: "Exa neural search for semantic retrieval", url: "exa.ai/blog", score: 0.89 },
    { title: "RAG patterns with Exa embeddings", url: "exa.ai/examples", score: 0.84 },
  ]

  function handleSearch() {
    if (!query.trim() || phase === "searching") return
    setPhase("searching")
    setTimeout(() => setPhase("done"), 1500)
  }

  return (
    <div className="mx-auto w-full max-w-lg space-y-4 p-6">
      <style dangerouslySetInnerHTML={{ __html: WAVE_KEYFRAMES }} />

      <div className="mb-2">
        <span className="text-sm font-medium text-foreground">Exa Neural Search v2</span>
      </div>
      <div className="flex items-end gap-2 rounded-2xl border border-border bg-background px-3 py-2 transition-all duration-150 focus-within:border-foreground/30 focus-within:shadow-md">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="Search with Exa neural embeddings..."
          className="h-9 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
        <motion.button
          onClick={handleSearch}
          disabled={phase === "searching"}
          whileTap={{ scale: 0.95 }}
          className={`h-9 shrink-0 rounded-xl px-4 text-sm font-medium transition-all duration-150 ${
            query.trim() && phase !== "searching"
              ? "bg-primary text-primary-foreground"
              : "bg-foreground/10 text-muted-foreground/50"
          }`}
        >
          Search
        </motion.button>
      </div>

      <AnimatePresence>
        {phase === "searching" && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ ...SPRING }}
            className="flex items-center gap-3 rounded-xl border border-border bg-card p-3"
          >
            <WaveDotsLoader />
            <div>
              <p className="text-sm font-medium text-foreground">Exa neural search...</p>
              <p className="text-xs text-muted-foreground">Computing semantic embeddings</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {phase === "done" && (
          <motion.div
            initial="initial"
            animate="animate"
            variants={{ animate: { ...STAGGER } }}
            className="space-y-2"
          >
            {results.map((r, i) => (
              <motion.div
                key={r.title}
                variants={FADE_UP}
                transition={{ ...SPRING }}
                className="rounded-xl border border-border px-4 py-3 transition-all duration-150 hover:bg-card"
              >
                <p className="text-sm font-medium text-foreground">{r.title}</p>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{r.url}</span>
                  <span className="font-mono text-xs text-muted-foreground/80">score: {r.score}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ─── Firecrawl Scraper ─── */
export function FirecrawlScraperPreview() {
  const [step, setStep] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => setStep((p) => Math.min(p + 1, 3)), 1200)
    return () => clearInterval(timer)
  }, [])

  const steps = ["Firecrawl crawling pages", "Firecrawl extracting content", "Converting to markdown"]

  return (
    <div className="mx-auto w-full max-w-lg p-6">
      <style dangerouslySetInnerHTML={{ __html: WAVE_KEYFRAMES }} />

      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">Firecrawl Web Scraper</span>
        <span className="font-mono text-xs tabular-nums text-muted-foreground">
          {Math.min(step, steps.length)}/{steps.length}
        </span>
      </div>
      <div className="mb-4 space-y-0.5">
        {steps.map((s, i) => (
          <motion.div
            key={s}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: i <= step ? 1 : 0.3, x: 0 }}
            transition={{ ...SPRING, delay: i * 0.06 }}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5"
          >
            <div className="flex size-5 shrink-0 items-center justify-center">
              {i < step ? (
                <motion.svg
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ ...SPRING }}
                  width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-primary"
                >
                  <polyline points="20 6 9 17 4 12" />
                </motion.svg>
              ) : i === step ? (
                <WaveDotsLoader />
              ) : (
                <div className="size-2 rounded-full bg-foreground/15" />
              )}
            </div>
            <span className={`text-sm ${i <= step ? "text-muted-foreground" : "text-muted-foreground/60"}`}>{s}</span>
          </motion.div>
        ))}
      </div>
      <AnimatePresence>
        {step >= 3 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING }}
            className="rounded-xl border border-border bg-card p-3 font-mono text-sm text-muted-foreground"
          >
            # Firecrawl Output<br />
            12 pages crawled, 45KB markdown generated
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ══════════════════════════════════════════
   Pipeline/Workflow Previews
   ══════════════════════════════════════════ */

/* ─── Sequential Workflow ─── */
export function SequentialWorkflowPreview() {
  const [active, setActive] = useState(0)
  const steps = ["Input", "Process", "Validate", "Output"]

  useEffect(() => {
    const timer = setInterval(() => setActive((p) => (p + 1) % (steps.length + 1)), 1200)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="mx-auto w-full max-w-lg p-6">
      <style dangerouslySetInnerHTML={{ __html: WAVE_KEYFRAMES }} />

      <div className="mb-6">
        <span className="text-sm font-medium text-foreground">LangChain Sequential Pipeline</span>
      </div>
      <div className="flex items-center justify-between">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center">
            <motion.div
              animate={{
                backgroundColor: i < active ? "var(--color-primary)" : i === active ? "var(--color-primary)" : "transparent",
                color: i <= active ? "var(--color-primary-foreground)" : "var(--color-muted-foreground)",
                borderColor: i <= active ? "var(--color-primary)" : "var(--color-border)",
              }}
              transition={{ duration: 0.2 }}
              className="flex size-10 items-center justify-center rounded-full border-2 text-sm font-medium"
            >
              {i < active ? (
                <motion.svg
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ ...SPRING }}
                  width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                >
                  <polyline points="20 6 9 17 4 12" />
                </motion.svg>
              ) : i === active ? (
                <WaveDotsLoader />
              ) : (
                i + 1
              )}
            </motion.div>
            {i < steps.length - 1 && (
              <motion.div
                animate={{ backgroundColor: i < active ? "var(--color-primary)" : "var(--color-border)" }}
                transition={{ duration: 0.2 }}
                className="mx-1 h-px w-8"
              />
            )}
          </div>
        ))}
      </div>
      <div className="mt-3 flex justify-between px-1">
        {steps.map((s) => (
          <span key={s} className="text-xs text-muted-foreground">{s}</span>
        ))}
      </div>
    </div>
  )
}

/* ─── Evaluator Workflow ─── */
export function EvaluatorWorkflowPreview() {
  const [visible, setVisible] = useState(0)

  const rounds = [
    { round: 1, score: 0.45, action: "Retry" },
    { round: 2, score: 0.72, action: "Retry" },
    { round: 3, score: 0.91, action: "Accept" },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setVisible((p) => Math.min(p + 1, rounds.length))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="mx-auto w-full max-w-lg p-6">
      <div className="mb-4">
        <span className="text-sm font-medium text-foreground">LangChain Evaluator Pipeline</span>
        <p className="mt-1 text-xs text-muted-foreground">LangChain score → threshold → retry or accept</p>
      </div>
      <div className="space-y-2">
        {rounds.slice(0, visible).map((r) => (
          <motion.div
            key={r.round}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...SPRING }}
            className="flex items-center justify-between rounded-xl border border-border px-4 py-2.5"
          >
            <span className="text-sm text-muted-foreground">Round {r.round}</span>
            <div className="flex items-center gap-3">
              <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${r.score * 100}%` }}
                  transition={{ ...SPRING, delay: 0.2 }}
                  className="h-full rounded-full bg-primary"
                />
              </div>
              <span className="w-8 text-right font-mono text-xs text-foreground">{r.score}</span>
              <span className="w-14 text-right text-xs text-muted-foreground">{r.action}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

/* ─── Orchestrator Workflow ─── */
export function OrchestratorWorkflowPreview() {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => setActive((p) => (p + 1) % 3), 2000)
    return () => clearInterval(timer)
  }, [])

  const agents = [
    { name: "Planner", task: "Breaking down the request" },
    { name: "Executor", task: "Running sub-tasks" },
    { name: "Synthesizer", task: "Combining results" },
  ]

  return (
    <div className="mx-auto w-full max-w-lg p-6">
      <style dangerouslySetInnerHTML={{ __html: WAVE_KEYFRAMES }} />

      <div className="mb-4">
        <span className="text-sm font-medium text-foreground">LangChain Orchestrator</span>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...SPRING }}
        className="mb-4 rounded-xl border border-border bg-muted/50 px-4 py-2.5 text-center text-xs text-muted-foreground"
      >
        LangChain orchestrator → coordinating {agents.length} agents
      </motion.div>
      <div className="space-y-2">
        {agents.map((a, i) => (
          <motion.div
            key={a.name}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...SPRING, delay: i * 0.06 }}
            className={`flex items-center justify-between rounded-xl border px-4 py-3 transition-all ${
              i === active ? "border-border bg-card" : "border-border"
            }`}
          >
            <div>
              <p className="text-sm font-medium text-foreground">{a.name}</p>
              <p className="text-xs text-muted-foreground">{a.task}</p>
            </div>
            {i === active && <WaveDotsLoader />}
          </motion.div>
        ))}
      </div>
    </div>
  )
}

/* ─── Parallel Workflow ─── */
export function ParallelWorkflowPreview() {
  const [progress, setProgress] = useState([0, 0, 0])

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => prev.map((p) => Math.min(p + Math.random() * 12, 100)))
    }, 300)
    const cleanup = setTimeout(() => clearInterval(timer), 3000)
    return () => { clearInterval(timer); clearTimeout(cleanup) }
  }, [])

  const tasks = ["Search Agent", "Analysis Agent", "Summary Agent"]
  const allDone = progress.every((p) => p >= 100)

  return (
    <div className="mx-auto w-full max-w-lg p-6">
      <style dangerouslySetInnerHTML={{ __html: WAVE_KEYFRAMES }} />

      <div className="mb-4">
        <span className="text-sm font-medium text-foreground">LangChain Parallel Execution</span>
        <p className="mt-1 text-xs text-muted-foreground">3 LangChain agents running simultaneously</p>
      </div>
      <div className="space-y-3">
        {tasks.map((task, i) => {
          const pct = Math.round(progress[i])
          const done = pct >= 100
          return (
            <motion.div
              key={task}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ ...SPRING, delay: i * 0.06 }}
              className="space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {done ? (
                    <motion.svg
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ ...SPRING }}
                      width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-primary"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </motion.svg>
                  ) : (
                    <WaveDotsLoader />
                  )}
                  <span className="text-sm text-foreground">{task}</span>
                </div>
                <span className="font-mono text-xs tabular-nums text-muted-foreground">{done ? "Done" : `${pct}%`}</span>
              </div>
              <div className="h-1 overflow-hidden rounded-full bg-muted">
                <motion.div
                  className="h-full rounded-full bg-primary"
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.2 }}
                />
              </div>
            </motion.div>
          )
        })}
      </div>

      <AnimatePresence>
        {allDone && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING }}
            className="mt-5 rounded-xl border border-border bg-card p-4"
          >
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Combined Result</p>
            <div className="mt-2 space-y-1 font-mono text-sm text-muted-foreground">
              <p>Search: <span className="text-foreground">12 sources found</span></p>
              <p>Analysis: <span className="text-foreground">3 key insights</span></p>
              <p>Summary: <span className="text-foreground">Generated (342 words)</span></p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ─── Routing Workflow ─── */
export function RoutingWorkflowPreview() {
  const [route, setRoute] = useState(0)
  const routes = [
    { input: "Translate this text", dest: "Translation Agent" },
    { input: "Analyze this data", dest: "Analysis Agent" },
    { input: "Write a poem", dest: "Creative Agent" },
  ]

  useEffect(() => {
    const timer = setInterval(() => setRoute((p) => (p + 1) % routes.length), 2000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="mx-auto w-full max-w-lg p-6">
      <div className="mb-4">
        <span className="text-sm font-medium text-foreground">LangChain Routing Workflow</span>
      </div>
      <div className="flex items-center justify-between gap-4">
        <div className="w-[140px] space-y-1.5">
          {routes.map((r, i) => (
            <motion.div
              key={r.input}
              animate={{
                backgroundColor: i === route ? "var(--color-primary)" : "transparent",
                color: i === route ? "var(--color-primary-foreground)" : "var(--color-muted-foreground)",
              }}
              transition={{ duration: 0.15 }}
              className="rounded-xl border border-border px-3 py-2 text-xs"
            >
              {r.input}
            </motion.div>
          ))}
        </div>
        <div className="text-muted-foreground/60">→</div>
        <motion.div
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="rounded-xl border border-primary/30 bg-primary/10 px-3 py-2 text-xs font-semibold text-primary"
        >
          Router
        </motion.div>
        <div className="text-muted-foreground/60">→</div>
        <div className="w-[130px] space-y-1.5">
          {routes.map((r, i) => (
            <motion.div
              key={r.dest}
              animate={{
                borderColor: i === route ? "var(--color-primary)" : "var(--color-border)",
                backgroundColor: i === route ? "oklch(from var(--primary) l c h / 0.1)" : "transparent",
              }}
              transition={{ duration: 0.15 }}
              className={`rounded-xl border px-3 py-2 text-xs transition-all ${
                i === route ? "font-medium text-foreground" : "text-muted-foreground"
              }`}
            >
              {r.dest}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─── Few-Shot Prompt ─── */
export function FewShotPromptPreview() {
  const [classified, setClassified] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setClassified(true), 2000)
    return () => clearTimeout(timer)
  }, [])

  const examples = [
    { label: "Example 1", input: "The movie was great!", output: "positive" },
    { label: "Example 2", input: "Terrible experience", output: "negative" },
    { label: "Example 3", input: "It was okay", output: "neutral" },
  ]

  return (
    <div className="mx-auto w-full max-w-lg p-6">
      <div className="mb-4">
        <span className="text-sm font-medium text-foreground">OpenAI Few-Shot Prompting</span>
      </div>
      <motion.div
        initial="initial"
        animate="animate"
        variants={{ animate: { ...STAGGER } }}
        className="space-y-2"
      >
        {examples.map((ex) => (
          <motion.div
            key={ex.label}
            variants={FADE_UP}
            transition={{ ...SPRING }}
            className="rounded-xl border border-border bg-card px-3 py-2"
          >
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground/80">{ex.label}</span>
            <div className="mt-1 flex items-center gap-2 text-sm">
              <span className="text-foreground">&quot;{ex.input}&quot;</span>
              <span className="text-muted-foreground/70">→</span>
              <span className="rounded-lg bg-primary/10 px-1.5 py-0.5 font-mono text-xs text-primary">{ex.output}</span>
            </div>
          </motion.div>
        ))}
        <motion.div
          variants={FADE_UP}
          transition={{ ...SPRING }}
          className="rounded-xl border border-border bg-card/50 px-3 py-2"
        >
          <span className="text-xs font-medium uppercase tracking-wider text-foreground/70">Input</span>
          <div className="mt-1 flex items-center gap-2 text-sm">
            <span className="text-foreground">&quot;I absolutely love this product&quot;</span>
            <span className="text-muted-foreground/70">→</span>
            <AnimatePresence mode="wait">
              {classified ? (
                <motion.span
                  key="result"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ ...SPRING }}
                  className="rounded-lg bg-primary/10 px-1.5 py-0.5 font-mono text-xs text-primary"
                >
                  positive
                </motion.span>
              ) : (
                <motion.span key="loading" className="font-mono text-foreground/70">
                  <WaveDotsLoader />
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

/* ══════════════════════════════════════════
   Marketing Previews
   ══════════════════════════════════════════ */

/* ─── Model Comparison ─── */
export function ModelComparisonPreview() {
  const models = [
    { name: "Claude Opus 4", speed: 72, quality: 98, cost: "$$" },
    { name: "Claude Sonnet 4", speed: 85, quality: 95, cost: "$" },
    { name: "Claude Haiku 3.5", speed: 95, quality: 88, cost: "$" },
  ]

  return (
    <div className="mx-auto w-full max-w-lg p-6">
      <div className="mb-4">
        <span className="text-sm font-medium text-foreground">Anthropic Model Comparison</span>
      </div>
      <motion.div
        initial="initial"
        animate="animate"
        variants={{ animate: { ...STAGGER } }}
        className="space-y-3"
      >
        {models.map((m) => (
          <motion.div
            key={m.name}
            variants={FADE_UP}
            transition={{ ...SPRING }}
            className="rounded-xl border border-border px-4 py-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">{m.name}</span>
              <span className="text-xs text-muted-foreground">{m.cost}</span>
            </div>
            <div className="mt-2 space-y-1">
              {[
                { label: "Speed", value: m.speed },
                { label: "Quality", value: m.quality },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center gap-2">
                  <span className="w-12 text-xs text-muted-foreground">{stat.label}</span>
                  <div className="h-1 flex-1 overflow-hidden rounded-full bg-muted">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${stat.value}%` }}
                      transition={{ ...SPRING, delay: 0.3 }}
                      className="h-full rounded-full bg-primary/40"
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

/* ─── Model Comparison Compact ─── */
export function ModelComparisonCompactPreview() {
  const [selected, setSelected] = useState(1)

  return (
    <div className="mx-auto w-full max-w-lg p-6">
      <div className="mb-4">
        <span className="text-sm font-medium text-foreground">OpenRouter Model Selector</span>
      </div>
      <motion.div
        initial="initial"
        animate="animate"
        variants={{ animate: { ...STAGGER } }}
        className="flex gap-2"
      >
        {[
          { name: "GPT-4o", tag: "Fast" },
          { name: "Claude", tag: "Best" },
          { name: "Mixtral", tag: "Cheap" },
        ].map((m, i) => (
          <motion.button
            key={m.name}
            variants={FADE_UP}
            transition={{ ...SPRING }}
            onClick={() => setSelected(i)}
            whileTap={{ scale: 0.97 }}
            className={`flex-1 rounded-xl border px-3 py-3 text-center transition-all ${
              i === selected ? "border-primary bg-primary/10" : "border-border hover:bg-card"
            }`}
          >
            <p className="text-sm font-medium text-foreground">{m.name}</p>
            <span className="mt-1 inline-block rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">{m.tag}</span>
          </motion.button>
        ))}
      </motion.div>
    </div>
  )
}

/* ─── Model Comparison Table ─── */
export function ModelComparisonTablePreview() {
  const rows = [
    { model: "Llama 3.1", latency: "180ms", quality: "88", cost: "$0.20" },
    { model: "Mistral Large", latency: "240ms", quality: "90", cost: "$0.80" },
    { model: "Gemma 2", latency: "160ms", quality: "82", cost: "$0.10" },
    { model: "Phi-3", latency: "120ms", quality: "78", cost: "$0.05" },
  ]

  return (
    <div className="mx-auto w-full max-w-lg p-6">
      <div className="mb-4">
        <span className="text-sm font-medium text-foreground">Hugging Face Model Leaderboard</span>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...SPRING }}
        className="overflow-hidden rounded-xl border border-border"
      >
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Model</th>
              <th className="px-3 py-2 text-right text-xs font-medium text-muted-foreground">Latency</th>
              <th className="px-3 py-2 text-right text-xs font-medium text-muted-foreground">Quality</th>
              <th className="px-3 py-2 text-right text-xs font-medium text-muted-foreground">$/1M tok</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <motion.tr
                key={row.model}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ ...SPRING, delay: i * 0.06 }}
                className="border-b border-border last:border-0 transition-colors hover:bg-card/50"
              >
                <td className="px-3 py-2 font-medium text-foreground">{row.model}</td>
                <td className="px-3 py-2 text-right font-mono text-xs text-muted-foreground">{row.latency}</td>
                <td className="px-3 py-2 text-right font-mono text-xs text-muted-foreground">{row.quality}</td>
                <td className="px-3 py-2 text-right font-mono text-xs text-muted-foreground">{row.cost}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  )
}

/* ─── Integrations Grid ─── */
export function IntegrationsGridPreview() {
  const integrations = [
    "Stripe", "Supabase", "Vercel", "GitHub",
    "Slack", "Discord", "Notion", "Linear",
  ]

  return (
    <div className="mx-auto w-full max-w-lg p-6">
      <div className="mb-4">
        <span className="text-sm font-medium text-foreground">Vercel Integrations</span>
      </div>
      <motion.div
        initial="initial"
        animate="animate"
        variants={{ animate: { ...STAGGER } }}
        className="grid grid-cols-4 gap-2"
      >
        {integrations.map((name) => (
          <motion.div
            key={name}
            variants={FADE_UP}
            transition={{ ...SPRING }}
            whileHover={{ scale: 1.03 }}
            className="flex flex-col items-center gap-1.5 rounded-xl border border-border px-2 py-3 transition-colors hover:bg-card"
          >
            <div className="flex size-8 items-center justify-center rounded-xl bg-primary/10 text-sm font-bold text-primary/60">
              {name[0]}
            </div>
            <span className="text-xs text-muted-foreground">{name}</span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

/* ─── Integrations v2 ─── */
export function IntegrationsGrid2Preview() {
  const integrations = [
    { name: "Notion AI", desc: "Writing assistant" },
    { name: "Notion DBs", desc: "Database sync" },
    { name: "Notion API", desc: "Page access" },
    { name: "Notion Search", desc: "Workspace search" },
  ]

  return (
    <div className="mx-auto w-full max-w-lg p-6">
      <div className="mb-4">
        <span className="text-sm font-medium text-foreground">Notion Integrations</span>
      </div>
      <motion.div
        initial="initial"
        animate="animate"
        variants={{ animate: { ...STAGGER } }}
        className="grid grid-cols-2 gap-2"
      >
        {integrations.map((item) => (
          <motion.div
            key={item.name}
            variants={FADE_UP}
            transition={{ ...SPRING }}
            className="flex items-center gap-3 rounded-xl border border-border px-4 py-3 transition-colors hover:bg-card"
          >
            <div className="flex size-8 items-center justify-center rounded-xl bg-primary/10 text-sm font-bold text-primary/60">
              {item.name[0]}
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{item.name}</p>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

/* ─── Calculator Agent ROI ─── */
export function CalculatorAgentROIPreview() {
  const [hours, setHours] = useState(40)

  return (
    <div className="mx-auto w-full max-w-lg p-6">
      <div className="mb-4">
        <span className="text-sm font-medium text-foreground">Intercom ROI Calculator</span>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...SPRING }}
        className="space-y-4"
      >
        <div>
          <label className="text-xs text-muted-foreground">Support hours saved per month</label>
          <input
            type="range"
            min="10"
            max="100"
            value={hours}
            onChange={(e) => setHours(Number(e.target.value))}
            className="mt-1 w-full"
          />
          <p className="text-right font-mono text-xs tabular-nums text-foreground">{hours}h</p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <motion.div
            key={`savings-${hours}`}
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            className="rounded-xl border border-border p-3"
          >
            <p className="text-xs uppercase text-muted-foreground">Intercom savings</p>
            <p className="mt-1 text-lg font-bold text-foreground">${(hours * 75 * 12).toLocaleString()}</p>
          </motion.div>
          <motion.div
            key={`roi-${hours}`}
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            className="rounded-xl border border-border p-3"
          >
            <p className="text-xs uppercase text-muted-foreground">Intercom ROI</p>
            <p className="mt-1 text-lg font-bold text-foreground">{Math.round((hours * 75 * 12) / 588)}x</p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

/* ─── Changelog ─── */
export function ChangelogPreview() {
  const releases = [
    { ver: "v2.1.0", date: "Dec 15", items: ["Linear project views", "Cycle improvements", "Bug fixes"] },
    { ver: "v2.0.0", date: "Nov 28", items: ["Linear redesign", "Triage workflow", "Linear Asks launch"] },
  ]

  return (
    <div className="mx-auto w-full max-w-lg p-6">
      <div className="mb-4">
        <span className="text-sm font-medium text-foreground">Linear Changelog</span>
      </div>
      <motion.div
        initial="initial"
        animate="animate"
        variants={{ animate: { ...STAGGER } }}
        className="space-y-4"
      >
        {releases.map((release) => (
          <motion.div
            key={release.ver}
            variants={FADE_UP}
            transition={{ ...SPRING }}
            className="border-l-2 border-border pl-4"
          >
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-foreground">{release.ver}</span>
              <span className="text-xs text-muted-foreground">{release.date}</span>
            </div>
            <ul className="mt-1.5 space-y-0.5">
              {release.items.map((item) => (
                <li key={item} className="text-sm text-muted-foreground">{item}</li>
              ))}
            </ul>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

/* ══════════════════════════════════════════
   Free Stack — missing preview
   ══════════════════════════════════════════ */

/* ─── AI Prompt Input ─── */
export function AIPromptInputPreview() {
  const [value, setValue] = useState("")
  const [focused, setFocused] = useState(false)
  const [thinking, setThinking] = useState(false)
  const [hasAttachment, setHasAttachment] = useState(false)
  const suggestions = [
    "Ask ChatGPT anything...",
    "Write a blog post about AI agents",
    "Explain quantum entanglement",
    "Debug my React component",
  ]

  return (
    <div className="mx-auto w-full max-w-xl p-6">
      {/* Suggestions */}
      <AnimatePresence>
        {!value && (
          <div className="mb-3">
            <SuggestionPills suggestions={suggestions} onSelect={setValue} />
          </div>
        )}
      </AnimatePresence>

      <div
        className={cn(
          "relative rounded-2xl border bg-background transition-all duration-200",
          focused
            ? "border-border ring-1 ring-foreground/[0.04]"
            : "border-border"
        )}
      >
        {/* Attachment preview */}
        <AnimatePresence>
          {hasAttachment && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden border-b border-border"
            >
              <div className="px-4 py-2.5">
                <div className="flex items-center gap-2.5 rounded-lg bg-card px-3 py-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="shrink-0 text-muted-foreground/80">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                  <span className="text-sm text-muted-foreground">requirements.pdf</span>
                  <span className="font-mono text-xs text-muted-foreground/60">12 KB</span>
                  <button
                    onClick={() => setHasAttachment(false)}
                    className="ml-auto rounded-md p-0.5 text-muted-foreground/60 transition-colors hover:bg-card hover:text-muted-foreground"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Textarea */}
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Ask ChatGPT anything..."
          rows={3}
          className="block w-full resize-none bg-transparent px-4 pt-4 pb-2 text-base leading-relaxed text-foreground outline-none placeholder:text-muted-foreground/70"
        />

        {/* Toolbar */}
        <div className="flex items-center justify-between px-3 pb-3">
          <div className="flex items-center gap-1">
            {/* Attachment */}
            <button
              onClick={() => setHasAttachment((a) => !a)}
              className="flex size-8 items-center justify-center rounded-lg text-muted-foreground/70 transition-colors hover:bg-card hover:text-muted-foreground"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </button>

            {/* Divider */}
            <div className="mx-0.5 h-4 w-px bg-foreground/15" />

            {/* Model label */}
            <span className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-muted-foreground/60">
              <span className="size-2 rounded-full bg-green-500" />
              <span className="text-xs">ChatGPT</span>
            </span>

            {/* Think toggle */}
            <button
              onClick={() => setThinking((t) => !t)}
              className={cn(
                "flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs transition-all",
                thinking
                  ? "bg-primary/10 text-foreground"
                  : "text-muted-foreground/60 hover:text-muted-foreground"
              )}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              Think
            </button>
          </div>

          {/* Send */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            className={cn(
              "flex size-8 items-center justify-center rounded-lg transition-colors",
              value.trim()
                ? "bg-primary text-primary-foreground"
                : "bg-foreground/15 text-muted-foreground/25"
            )}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
          </motion.button>
        </div>
      </div>

      {/* Subtle keyboard hints */}
      <p className="mt-2.5 text-center font-mono text-[10px] text-foreground/50">
        ChatGPT · ↵ send · shift+↵ newline · ⌘V paste files
      </p>
    </div>
  )
}
