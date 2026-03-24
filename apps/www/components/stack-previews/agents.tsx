"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { WaveDotsLoader, CircleSpinner, WAVE_KEYFRAMES, SPRING, FADE_UP, STAGGER } from "./shared"

/* ─── Agent Configuration ─── */
const ROUTING_AGENTS = [
  { id: "code", name: "Code Expert", model: "gpt-4o" },
  { id: "writer", name: "Writer", model: "claude-3.5-sonnet" },
  { id: "analyst", name: "Analyst", model: "gpt-4o-mini" },
]

/* ─── Routing Pattern ─── */
export function RoutingPatternPreview() {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Array<{
    role: "user" | "routing" | "assistant"
    content: string
    agent?: string
    confidence?: number
  }>>([])
  const [isProcessing, setIsProcessing] = useState(false)

  function classifyQuery(text: string): { agent: string; confidence: number } {
    const lower = text.toLowerCase()
    if (lower.includes("code") || lower.includes("bug") || lower.includes("function") || lower.includes("debug") || lower.includes("react") || lower.includes("error")) {
      return { agent: "code", confidence: 94 }
    }
    if (lower.includes("write") || lower.includes("blog") || lower.includes("draft") || lower.includes("email") || lower.includes("story")) {
      return { agent: "writer", confidence: 91 }
    }
    return { agent: "analyst", confidence: 87 }
  }

  function handleSubmit() {
    if (!input.trim() || isProcessing) return

    const userMessage = input.trim()
    setInput("")
    setMessages(prev => [...prev, { role: "user", content: userMessage }])
    setIsProcessing(true)

    // Simulate routing decision
    setTimeout(() => {
      const { agent, confidence } = classifyQuery(userMessage)
      const agentInfo = ROUTING_AGENTS.find(a => a.id === agent)!

      setMessages(prev => [
        ...prev,
        { role: "routing", content: `Routed to ${agentInfo.name}`, agent, confidence }
      ])

      // Simulate agent response
      setTimeout(() => {
        const responses: Record<string, string> = {
          code: "Looking at your code, I found the issue. The type mismatch in your function parameters is causing the error.\n\nHere's the corrected version:\n\nfunction processData(items: string[]) {\n  return items.map(item => item.trim())\n}\n\nThe key change ensures the input type matches what you're passing.",
          writer: "Here's a draft for your content:\n\nIntroduction\nIn today's rapidly evolving landscape, understanding these key trends is essential.\n\nKey Points\n• The market is shifting toward AI-first solutions\n• Customer expectations continue to rise\n• Personalization drives engagement\n\nWould you like me to expand on any section?",
          analyst: "Based on my analysis:\n\nSummary\n• Total records: 2,847\n• Key improvement: +23.5%\n• Primary driver: Q3 initiatives\n\nRecommendation\nFocus resources on top-performing segments. The correlation between engagement and conversion is statistically significant (p < 0.01).",
        }

        setMessages(prev => [...prev, { role: "assistant", content: responses[agent], agent }])
        setIsProcessing(false)
      }, 1200)
    }, 600)
  }

  const showOnboarding = messages.length === 0

  function reset() {
    setMessages([])
    setInput("")
    setIsProcessing(false)
  }

  return (
    <div className="relative flex h-[540px] w-full max-w-3xl mx-auto flex-col">
      {/* Main Content Area */}
      <div className="relative flex flex-1 flex-col items-center justify-end overflow-hidden">
        <AnimatePresence initial={false} mode="popLayout">
          {showOnboarding ? (
            <motion.div
              key="onboarding"
              className="absolute bottom-[50%] mx-auto max-w-[50rem] px-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h1 className="mb-6 text-3xl font-medium tracking-tight text-center text-foreground">
                What can I route for you?
              </h1>
              <div className="flex flex-wrap justify-center gap-2">
                {[
                  "Fix the bug in my React code",
                  "Write a product announcement",
                  "Analyze this sales data",
                ].map((example) => (
                  <button
                    key={example}
                    onClick={() => setInput(example)}
                    className="rounded-2xl border border-border bg-background px-4 py-2.5 text-sm text-muted-foreground hover:border-foreground/20 hover:text-foreground transition-all"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="conversation"
              className="relative flex h-full w-full flex-col items-center overflow-y-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {/* Clear button - top right corner */}
              <div className="sticky top-0 z-10 flex w-full max-w-3xl justify-end px-6 pt-3">
                <button
                  onClick={reset}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Clear
                </button>
              </div>
              <div className="flex w-full flex-col items-center pb-4 px-6">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="w-full max-w-3xl mb-3"
                >
                  {/* User Message - Right aligned pill */}
                  {msg.role === "user" && (
                    <div className="flex w-full flex-col items-end">
                      <div className="bg-accent max-w-[70%] rounded-3xl px-5 py-2.5">
                        <p className="text-[15px] text-foreground">{msg.content}</p>
                      </div>
                    </div>
                  )}

                  {/* Routing indicator */}
                  {msg.role === "routing" && (
                    <div className="flex items-center gap-2 py-2">
                      <div className={`size-2 rounded-full ${
                        msg.agent === "code" ? "bg-emerald-500" :
                        msg.agent === "writer" ? "bg-violet-500" : "bg-blue-500"
                      }`} />
                      <span className="text-sm text-muted-foreground">
                        Routed to <span className="font-medium text-foreground">{ROUTING_AGENTS.find(a => a.id === msg.agent)?.name}</span>
                      </span>
                      <span className="text-sm text-muted-foreground">•</span>
                      <span className="text-sm text-muted-foreground">{msg.confidence}% confidence</span>
                      <span className="text-sm text-muted-foreground">•</span>
                      <span className="text-sm text-muted-foreground/60">{ROUTING_AGENTS.find(a => a.id === msg.agent)?.model}</span>
                    </div>
                  )}

                  {/* Assistant Message - Left aligned, full width */}
                  {msg.role === "assistant" && (
                    <div className="flex w-full flex-col items-start">
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <div className="text-[15px] leading-relaxed text-foreground whitespace-pre-wrap">
                          {msg.content}
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Loading state */}
              {isProcessing && messages[messages.length - 1]?.role !== "assistant" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="w-full max-w-3xl flex items-center gap-2 py-2"
                >
                  <CircleSpinner size={16} className="text-muted-foreground" />
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
        </AnimatePresence>

        {/* Input Area */}
        <div className="relative w-full max-w-3xl px-2 pb-4">
          <div
            className="relative z-10 rounded-3xl border border-border bg-popover p-1 shadow-sm"
            onClick={() => document.getElementById("routing-input")?.focus()}
          >
            <textarea
              id="routing-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSubmit()
                }
              }}
              placeholder="Ask anything..."
              disabled={isProcessing}
              rows={1}
              className="min-h-[44px] w-full resize-none bg-transparent px-4 pt-3 pb-2 text-[15px] leading-[1.4] text-foreground outline-none placeholder:text-muted-foreground/60 disabled:opacity-50"
            />
            <div className="flex items-center justify-between px-2 pb-2">
              <div className="flex items-center gap-2 pl-2">
                {ROUTING_AGENTS.map(agent => (
                  <div key={agent.id} className="flex items-center gap-1.5">
                    <div className={`size-1.5 rounded-full ${
                      agent.id === "code" ? "bg-emerald-500" :
                      agent.id === "writer" ? "bg-violet-500" : "bg-blue-500"
                    }`} />
                    <span className="text-xs text-muted-foreground">{agent.name}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={handleSubmit}
                disabled={!input.trim() || isProcessing}
                className="flex size-9 items-center justify-center rounded-full bg-foreground text-background transition-all hover:bg-foreground/90 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 19V5M5 12l7-7 7 7" />
                </svg>
              </button>
            </div>
          </div>
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
