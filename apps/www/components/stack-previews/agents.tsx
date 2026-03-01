"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { WaveDotsLoader, WAVE_KEYFRAMES, SPRING, FADE_UP, STAGGER } from "./shared"

/* ─── Routing Pattern ─── */
export function RoutingPatternPreview() {
  const [activeIdx, setActiveIdx] = useState(0)

  const routes = [
    { input: "Write a poem about rain", agent: "Claude Creative" },
    { input: "Translate to Spanish", agent: "Claude Translator" },
    { input: "Fix this bug in my code", agent: "Claude Code" },
    { input: "Summarize this article", agent: "Claude Haiku" },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIdx((i) => (i + 1) % routes.length)
    }, 2000)
    return () => clearInterval(timer)
  }, [routes.length])

  return (
    <div className="mx-auto w-full max-w-xl p-6">
      <div className="mb-5 text-center">
        <span className="text-sm font-semibold text-foreground">Claude Router</span>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Intelligent routing to specialized Claude models
        </p>
      </div>

      <div className="flex items-start justify-between gap-4">
        {/* Incoming requests */}
        <div className="w-[160px] space-y-1.5">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Incoming
          </span>
          {routes.map((route, i) => (
            <motion.div
              key={route.agent}
              animate={{
                backgroundColor: activeIdx === i ? "var(--color-primary)" : "transparent",
                color: activeIdx === i ? "var(--color-primary-foreground)" : "var(--color-muted-foreground)",
              }}
              transition={{ duration: 0.15 }}
              className="rounded-lg border border-border px-2.5 py-2 text-xs leading-snug"
            >
              {route.input}
            </motion.div>
          ))}
        </div>

        {/* Router connector */}
        <div className="flex flex-col items-center gap-1.5 pt-10">
          <div className="h-px w-8 bg-border" />
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="rounded-lg border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary"
          >
            Router
          </motion.div>
          <div className="h-px w-8 bg-border" />
        </div>

        {/* Agents */}
        <div className="w-[140px] space-y-1.5">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Claude Models
          </span>
          {routes.map((route, i) => (
            <motion.div
              key={route.agent}
              animate={{
                borderColor: activeIdx === i ? "var(--color-primary)" : "var(--color-border)",
                backgroundColor: activeIdx === i ? "oklch(from var(--primary) l c h / 0.1)" : "transparent",
              }}
              transition={{ duration: 0.15 }}
              className={`rounded-lg border px-2.5 py-2 text-xs transition-all duration-150 ${
                activeIdx === i
                  ? "font-medium text-foreground"
                  : "text-muted-foreground"
              }`}
            >
              {route.agent}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─── Parallel Processing ─── */
export function ParallelProcessingPreview() {
  const [progress, setProgress] = useState([0, 0, 0])

  const tasks = [
    { name: "Sentiment Analysis", target: 100 },
    { name: "Entity Extraction", target: 80 },
    { name: "Topic Classification", target: 60 },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) =>
        prev.map((p, i) => Math.min(p + Math.random() * 8, tasks[i].target))
      )
    }, 200)

    const cleanup = setTimeout(() => clearInterval(timer), 4000)
    return () => {
      clearInterval(timer)
      clearTimeout(cleanup)
    }
  }, [])

  const allDone = progress.every((p, i) => p >= tasks[i].target)

  return (
    <div className="mx-auto w-full max-w-lg p-6">
      <style dangerouslySetInnerHTML={{ __html: WAVE_KEYFRAMES }} />

      <div className="mb-5">
        <span className="text-sm font-semibold text-foreground">
          LangChain Parallel Execution
        </span>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Processing document across 3 LangChain chains simultaneously
        </p>
      </div>

      <div className="space-y-4">
        {tasks.map((task, i) => {
          const pct = Math.round(progress[i])
          const done = pct >= task.target
          return (
            <motion.div
              key={task.name}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ ...SPRING, delay: i * 0.08 }}
              className="space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {done ? (
                    <motion.svg
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ ...SPRING }}
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      className="text-primary"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </motion.svg>
                  ) : (
                    <WaveDotsLoader />
                  )}
                  <span className="text-sm font-medium text-foreground">
                    {task.name}
                  </span>
                </div>
                <span className="font-mono text-xs tabular-nums text-muted-foreground">
                  {done ? "done" : `${pct}%`}
                </span>
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
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              LangChain Combined Result
            </p>
            <div className="mt-2 space-y-1 font-mono text-sm text-muted-foreground">
              <p>Sentiment: <span className="text-foreground">Positive (0.87)</span></p>
              <p>Entities: <span className="text-foreground">4 orgs, 2 people, 3 locations</span></p>
              <p>Topics: <span className="text-foreground">Technology, AI Research, ML</span></p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ─── Human in the Loop ─── */
export function HumanInTheLoopPreview() {
  const [approved, setApproved] = useState<boolean | null>(null)

  return (
    <div className="mx-auto w-full max-w-lg space-y-3 p-6">
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...SPRING }}
        className="rounded-xl border border-border bg-card p-4"
      >
        <div className="mb-3 flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Claude Request</p>
            <p className="text-xs text-muted-foreground">Claude wants to execute an action</p>
          </div>
        </div>

        <div className="rounded-lg bg-muted/50 p-3">
          <code className="font-mono text-xs text-foreground">
            sendEmail({`{`}
            <br />
            {"  "}to: &quot;team@company.com&quot;,
            <br />
            {"  "}subject: &quot;Weekly Report&quot;,
            <br />
            {"  "}body: &quot;...generated content...&quot;
            <br />
            {`}`})
          </code>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {approved === null ? (
          <motion.div
            key="buttons"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="flex gap-2"
          >
            <motion.button
              onClick={() => setApproved(true)}
              whileTap={{ scale: 0.97 }}
              className="h-9 flex-1 rounded-lg bg-primary text-sm font-medium text-primary-foreground transition-all duration-150 hover:bg-primary/90"
            >
              Approve & Execute
            </motion.button>
            <motion.button
              onClick={() => setApproved(false)}
              whileTap={{ scale: 0.97 }}
              className="h-9 flex-1 rounded-lg border border-border text-sm font-medium text-muted-foreground transition-all duration-150 hover:border-foreground/20 hover:text-foreground"
            >
              Reject
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING }}
            className="flex items-center justify-between rounded-xl border border-border px-4 py-3"
          >
            <div className="flex items-center gap-2 text-sm">
              {approved ? (
                <>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-primary">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span className="font-medium text-foreground">Approved and executed</span>
                </>
              ) : (
                <>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-destructive">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                  <span className="text-muted-foreground">Action rejected</span>
                </>
              )}
            </div>
            <button
              onClick={() => setApproved(null)}
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

/* ─── URL Analysis Workflow ─── */
export function URLAnalysisPreview() {
  const [url, setUrl] = useState("")
  const [step, setStep] = useState(-1)

  const steps = [
    { name: "Fetching page", detail: "Zapier webhook triggered" },
    { name: "Extracting text", detail: "Parsing DOM via Zapier action" },
    { name: "Analyzing content", detail: "Running Zapier AI analysis" },
    { name: "Generating summary", detail: "Creating Zap output" },
  ]

  function handleAnalyze() {
    if (!url.trim()) return
    setStep(0)
    let s = 0
    const timer = setInterval(() => {
      s++
      if (s < steps.length) {
        setStep(s)
      } else {
        clearInterval(timer)
      }
    }, 1200)
  }

  function reset() {
    setStep(-1)
    setUrl("")
  }

  return (
    <div className="mx-auto w-full max-w-lg space-y-4 p-6">
      <style dangerouslySetInnerHTML={{ __html: WAVE_KEYFRAMES }} />

      <div className="flex items-end gap-2 rounded-2xl border border-border bg-background px-3 py-2 transition-all duration-150 focus-within:border-foreground/30 focus-within:shadow-md">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
          placeholder="https://example.com/article"
          className="h-9 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
        <motion.button
          onClick={handleAnalyze}
          disabled={!url.trim() || step >= 0}
          whileTap={{ scale: 0.95 }}
          className={`h-9 shrink-0 rounded-xl px-4 text-sm font-medium transition-all duration-150 ${
            url.trim() && step < 0
              ? "bg-primary text-primary-foreground"
              : "bg-foreground/10 text-muted-foreground/50"
          }`}
        >
          Analyze
        </motion.button>
      </div>

      <AnimatePresence>
        {step >= 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ ...SPRING }}
            className="space-y-0.5 overflow-hidden"
          >
            {steps.map((s, i) => (
              <motion.div
                key={s.name}
                initial={{ opacity: 0, x: -8 }}
                animate={{
                  opacity: i <= step ? 1 : 0.3,
                  x: 0,
                }}
                transition={{ ...SPRING, delay: i * 0.06 }}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5"
              >
                <div className="flex size-5 shrink-0 items-center justify-center">
                  {i < step ? (
                    <motion.svg
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
                  ) : i === step ? (
                    <WaveDotsLoader />
                  ) : (
                    <div className="size-2 rounded-full bg-foreground/15" />
                  )}
                </div>
                <div>
                  <p className={`text-sm ${i <= step ? "font-medium text-foreground" : "text-muted-foreground/60"}`}>
                    {s.name}
                  </p>
                  <p className="text-xs text-muted-foreground/60">{s.detail}</p>
                </div>
                {i === step && step < steps.length - 1 && (
                  <span className="ml-auto font-mono text-[10px] text-muted-foreground/40">running</span>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {step >= steps.length - 1 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING }}
            className="rounded-xl border border-border bg-card p-4"
          >
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Zapier Analysis Result
            </p>
            <div className="mt-2 space-y-1.5 text-sm">
              <p className="text-muted-foreground">Title: <span className="font-medium text-foreground">Example Article</span></p>
              <p className="text-muted-foreground">Words: <span className="font-mono text-foreground">1,247</span></p>
              <p className="text-muted-foreground">Reading: <span className="font-mono text-foreground">5 min</span></p>
              <p className="text-muted-foreground">Summary: <span className="text-foreground">Covers fundamentals of modern web development and emerging industry trends.</span></p>
            </div>
            <div className="mt-3 border-t border-border pt-2">
              <button
                onClick={reset}
                className="font-mono text-xs text-muted-foreground transition-all duration-150 hover:text-foreground"
              >
                reset
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
