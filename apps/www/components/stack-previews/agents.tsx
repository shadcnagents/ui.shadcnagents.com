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

// Shield icon (outlined, monochrome)
function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  )
}

// Wrench/tool icon
function WrenchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  )
}

// Tool call badge - Claude style (monochrome)
function HITLToolBadge({
  name,
  status,
  isOpen,
  onToggle
}: {
  name: string
  status: "pending" | "approved" | "rejected"
  isOpen: boolean
  onToggle: () => void
}) {
  return (
    <button
      onClick={onToggle}
      className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1.5 text-sm transition-colors hover:bg-muted"
    >
      <ShieldIcon className="text-muted-foreground" />
      <span className="font-mono text-foreground">{name}</span>
      {status === "approved" && (
        <span className="flex items-center gap-1 text-foreground">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span className="text-xs">Approved</span>
        </span>
      )}
      {status === "rejected" && (
        <span className="flex items-center gap-1 text-muted-foreground">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
          <span className="text-xs">Rejected</span>
        </span>
      )}
      <motion.svg
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.15 }}
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="text-muted-foreground"
      >
        <path d="M6 9l6 6 6-6" />
      </motion.svg>
    </button>
  )
}

export function HumanInTheLoopPreview() {
  const [input, setInput] = useState("")
  const [phase, setPhase] = useState<"idle" | "processing" | "approval" | "done">("idle")
  const [mainExpanded, setMainExpanded] = useState(true)
  const [toolExpanded, setToolExpanded] = useState(true)
  const [toolStatus, setToolStatus] = useState<"pending" | "approved" | "rejected">("pending")
  const [isProcessing, setIsProcessing] = useState(false)

  const exampleTasks = [
    "Send weekly report to team",
    "Email the project update",
    "Share analytics with stakeholders",
  ]

  const emailParams = {
    to: "team@company.com",
    subject: "Weekly Report",
    body: "Here's the weekly progress summary with key metrics and action items for the upcoming sprint..."
  }

  function handleSubmit() {
    if (!input.trim() || isProcessing) return
    setInput("")
    setPhase("processing")
    setIsProcessing(true)
    setToolStatus("pending")

    setTimeout(() => {
      setPhase("approval")
      setIsProcessing(false)
    }, 800)
  }

  function handleApprove() {
    setToolStatus("approved")
    setTimeout(() => setPhase("done"), 400)
  }

  function handleReject() {
    setToolStatus("rejected")
    setTimeout(() => setPhase("done"), 400)
  }

  function reset() {
    setPhase("idle")
    setInput("")
    setIsProcessing(false)
    setToolStatus("pending")
    setMainExpanded(true)
    setToolExpanded(true)
  }

  return (
    <div className="relative flex h-[540px] w-full max-w-3xl mx-auto flex-col">
      <style dangerouslySetInnerHTML={{ __html: WAVE_KEYFRAMES }} />

      {/* Conversation area */}
      <div className="relative flex flex-1 flex-col overflow-hidden">
        <AnimatePresence initial={false} mode="popLayout">
          {phase === "idle" ? (
            <motion.div
              key="onboarding"
              className="absolute inset-0 flex flex-col items-center justify-center px-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="mb-4">
                <ShieldIcon className="size-10 text-muted-foreground" />
              </div>
              <h1 className="mb-2 text-2xl font-medium text-foreground">Human-in-the-Loop</h1>
              <p className="mb-6 text-sm text-muted-foreground text-center max-w-md">
                Get human approval before executing sensitive actions
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {exampleTasks.map((task) => (
                  <button
                    key={task}
                    onClick={() => setInput(task)}
                    className="rounded-2xl border border-border bg-background px-4 py-2.5 text-sm text-muted-foreground hover:border-foreground/20 hover:text-foreground transition-all"
                  >
                    {task}
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="conversation"
              className="flex h-full w-full flex-col overflow-y-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {/* Clear button */}
              <div className="sticky top-0 z-10 flex w-full justify-end bg-gradient-to-b from-background via-background to-transparent px-6 pt-3 pb-2">
                <button
                  onClick={reset}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Clear
                </button>
              </div>

              {/* Content */}
              <div className="px-6 pb-4">
                {/* Processing state */}
                {phase === "processing" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 py-3"
                  >
                    <CircleSpinner size={16} className="text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Analyzing request...</span>
                  </motion.div>
                )}

                {/* Approval section - Claude style */}
                {(phase === "approval" || phase === "done") && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* Main dropdown header */}
                    <button
                      onClick={() => setMainExpanded(!mainExpanded)}
                      className="flex items-center gap-2 text-foreground hover:text-foreground/80 transition-colors py-1"
                    >
                      <ShieldIcon className="text-muted-foreground" />
                      <span className="text-sm font-medium">Human Approval Required</span>
                      <motion.svg
                        animate={{ rotate: mainExpanded ? 0 : -90 }}
                        transition={{ duration: 0.15 }}
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-muted-foreground"
                      >
                        <path d="M6 9l6 6 6-6" />
                      </motion.svg>
                    </button>

                    {/* Expanded content */}
                    <AnimatePresence>
                      {mainExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.15 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-3 space-y-3">
                            {/* Tool Action header */}
                            <div className="flex items-center gap-2">
                              <WrenchIcon className="text-muted-foreground" />
                              <span className="text-sm text-foreground">Tool Action</span>
                            </div>

                            {/* Content with left border */}
                            <div className="ml-2 pl-4 border-l-2 border-border space-y-3">
                              <p className="text-sm text-muted-foreground">
                                Claude wants to execute an action that requires your approval
                              </p>

                              {/* Tool badge */}
                              <HITLToolBadge
                                name="sendEmail"
                                status={toolStatus}
                                isOpen={toolExpanded}
                                onToggle={() => setToolExpanded(!toolExpanded)}
                              />

                              {/* Expandable tool details */}
                              <AnimatePresence>
                                {toolExpanded && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.15 }}
                                    className="overflow-hidden"
                                  >
                                    <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-3">
                                      <div>
                                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">To</p>
                                        <p className="text-sm font-mono text-foreground">{emailParams.to}</p>
                                      </div>
                                      <div>
                                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">Subject</p>
                                        <p className="text-sm font-mono text-foreground">{emailParams.subject}</p>
                                      </div>
                                      <div>
                                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">Body</p>
                                        <p className="text-sm text-muted-foreground">{emailParams.body}</p>
                                      </div>

                                      {/* Approve/Reject buttons */}
                                      {toolStatus === "pending" && (
                                        <div className="flex gap-2 pt-2">
                                          <motion.button
                                            onClick={handleApprove}
                                            whileTap={{ scale: 0.97 }}
                                            className="flex-1 h-9 rounded-lg bg-foreground text-sm font-medium text-background transition-colors hover:bg-foreground/90"
                                          >
                                            Approve & Execute
                                          </motion.button>
                                          <motion.button
                                            onClick={handleReject}
                                            whileTap={{ scale: 0.97 }}
                                            className="flex-1 h-9 rounded-lg border border-border text-sm font-medium text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
                                          >
                                            Reject
                                          </motion.button>
                                        </div>
                                      )}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}

                {/* Response content */}
                {phase === "done" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: 0.1 }}
                    className="mt-6 text-[15px] leading-relaxed text-foreground"
                  >
                    {toolStatus === "approved" ? (
                      <p>The email has been sent successfully to {emailParams.to}.</p>
                    ) : (
                      <p className="text-muted-foreground">The action was rejected. No email was sent.</p>
                    )}
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input */}
      <div className="shrink-0 px-4 pb-4">
        <div className="rounded-2xl border border-border bg-background shadow-sm">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSubmit()
              }
            }}
            placeholder="Request an action that needs approval..."
            disabled={isProcessing || phase !== "idle"}
            rows={2}
            className="min-h-[60px] w-full resize-none bg-transparent px-4 pt-3 pb-2 text-[15px] text-foreground outline-none placeholder:text-muted-foreground/60 disabled:opacity-50"
          />
          <div className="flex items-center justify-end px-3 pb-3">
            <button
              onClick={handleSubmit}
              disabled={!input.trim() || isProcessing || phase !== "idle"}
              className="flex size-8 items-center justify-center rounded-lg bg-foreground text-background transition-all hover:bg-foreground/90 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
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
