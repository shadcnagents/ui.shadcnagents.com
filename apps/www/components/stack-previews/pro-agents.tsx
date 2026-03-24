"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { WaveDotsLoader, CircleSpinner, WAVE_KEYFRAMES, SPRING, FADE_UP, STAGGER } from "./shared"

/* ─── Orchestrator Pattern ─── */
export function OrchestratorPatternPreview() {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Array<{
    role: "user" | "thinking" | "tool" | "assistant"
    content: string
    toolName?: string
    toolStatus?: "running" | "done"
    toolResult?: string
  }>>([])
  const [isProcessing, setIsProcessing] = useState(false)

  const workers = [
    { id: "research", name: "research_agent", displayName: "Research Agent" },
    { id: "writer", name: "writer_agent", displayName: "Writer Agent" },
    { id: "editor", name: "editor_agent", displayName: "Editor Agent" },
  ]

  const exampleTasks = [
    "Write a blog post about AI agents",
    "Create a product launch email",
    "Analyze competitor pricing strategy",
  ]

  function handleSubmit() {
    if (!input.trim() || isProcessing) return
    const userMessage = input.trim()
    setInput("")
    setMessages([{ role: "user", content: userMessage }])
    setIsProcessing(true)

    // Step 1: Thinking
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: "thinking",
        content: "I'll break this into subtasks and delegate to specialized agents:\n1. Research Agent → gather sources\n2. Writer Agent → draft content\n3. Editor Agent → polish output"
      }])

      // Step 2: Research tool
      setTimeout(() => {
        setMessages(prev => [...prev, {
          role: "tool",
          toolName: "research_agent",
          content: "query: \"" + userMessage + "\"",
          toolStatus: "running"
        }])

        setTimeout(() => {
          setMessages(prev => prev.map((m, i) =>
            i === prev.length - 1 ? { ...m, toolStatus: "done" as const, toolResult: "Found 3 sources: MIT Tech Review, Anthropic Blog, arXiv paper. Key themes: autonomous agents, tool use, multi-agent systems." } : m
          ))

          // Step 3: Writer tool
          setTimeout(() => {
            setMessages(prev => [...prev, {
              role: "tool",
              toolName: "writer_agent",
              content: "sources: [3 articles], target: 800 words",
              toolStatus: "running"
            }])

            setTimeout(() => {
              setMessages(prev => prev.map((m, i) =>
                i === prev.length - 1 ? { ...m, toolStatus: "done" as const, toolResult: "Drafted 847 words covering introduction, key trends, challenges, and future outlook." } : m
              ))

              // Step 4: Editor tool
              setTimeout(() => {
                setMessages(prev => [...prev, {
                  role: "tool",
                  toolName: "editor_agent",
                  content: "draft: [847 words], check: citations, clarity",
                  toolStatus: "running"
                }])

                setTimeout(() => {
                  setMessages(prev => prev.map((m, i) =>
                    i === prev.length - 1 ? { ...m, toolStatus: "done" as const, toolResult: "Fixed 2 citation formats, improved clarity in section 2, added conclusion paragraph." } : m
                  ))

                  // Step 5: Final response
                  setTimeout(() => {
                    setMessages(prev => [...prev, {
                      role: "assistant",
                      content: "I've completed your request by coordinating three specialized agents:\n\nResearch Agent found 3 authoritative sources on AI agents from MIT Tech Review, Anthropic's blog, and a recent arXiv paper.\n\nWriter Agent drafted an 847-word article covering the key themes: autonomous agents, tool use patterns, and multi-agent coordination.\n\nEditor Agent polished the final output, fixing 2 citation formats and improving clarity.\n\nThe final article is ready for review. It covers current trends, implementation challenges, and future directions in AI agent development."
                    }])
                    setIsProcessing(false)
                  }, 600)
                }, 1000)
              }, 400)
            }, 1200)
          }, 400)
        }, 1000)
      }, 800)
    }, 600)
  }

  function reset() {
    setMessages([])
    setInput("")
    setIsProcessing(false)
  }

  const showOnboarding = messages.length === 0

  return (
    <div className="relative flex h-[540px] w-full max-w-3xl mx-auto flex-col">
      <style dangerouslySetInnerHTML={{ __html: WAVE_KEYFRAMES }} />

      {/* Conversation area */}
      <div className="relative flex flex-1 flex-col overflow-hidden">
        <AnimatePresence initial={false} mode="popLayout">
          {showOnboarding ? (
            <motion.div
              key="onboarding"
              className="absolute inset-0 flex flex-col items-center justify-center px-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h1 className="mb-2 text-2xl font-medium text-foreground">Orchestrator Pattern</h1>
              <p className="mb-6 text-sm text-muted-foreground text-center max-w-md">
                Break complex tasks into subtasks and delegate to specialized worker agents
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

              {/* Messages */}
              <div className="flex flex-col gap-4 px-6 pb-4">
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    {/* User message */}
                    {msg.role === "user" && (
                      <div className="flex justify-end">
                        <div className="bg-accent max-w-[80%] rounded-3xl px-5 py-3">
                          <p className="text-[15px] text-foreground">{msg.content}</p>
                        </div>
                      </div>
                    )}

                    {/* Thinking */}
                    {msg.role === "thinking" && (
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <div className="size-1.5 rounded-full bg-amber-500" />
                          <span className="text-xs font-medium text-muted-foreground">Thinking</span>
                        </div>
                        <div className="ml-3.5 border-l-2 border-border/60 pl-4 py-1">
                          <p className="text-sm text-muted-foreground whitespace-pre-line">{msg.content}</p>
                        </div>
                      </div>
                    )}

                    {/* Tool invocation */}
                    {msg.role === "tool" && (
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <div className={`size-1.5 rounded-full ${msg.toolStatus === "done" ? "bg-emerald-500" : "bg-blue-500 animate-pulse"}`} />
                          <span className="text-xs font-medium text-muted-foreground">
                            {msg.toolStatus === "running" ? "Calling" : "Called"} {msg.toolName}
                          </span>
                          {msg.toolStatus === "running" && <CircleSpinner size={14} className="text-muted-foreground" />}
                        </div>
                        <div className="ml-3.5 rounded-xl border border-border bg-muted/30 p-3">
                          <p className="font-mono text-xs text-muted-foreground">{msg.content}</p>
                          {msg.toolResult && (
                            <div className="mt-2 pt-2 border-t border-border/50">
                              <p className="text-xs text-foreground/80">{msg.toolResult}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Assistant response */}
                    {msg.role === "assistant" && (
                      <div className="flex flex-col">
                        <div className="text-[15px] leading-relaxed text-foreground whitespace-pre-line">
                          {msg.content}
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}

                {/* Loading indicator */}
                {isProcessing && messages.length > 0 && messages[messages.length - 1].role === "user" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-2 py-2"
                  >
                    <CircleSpinner size={16} className="text-muted-foreground" />
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input */}
      <div className="shrink-0 px-4 pb-4">
        <div
          className="rounded-3xl border border-border bg-popover p-1 shadow-sm"
          onClick={() => document.getElementById("orchestrator-input")?.focus()}
        >
          <textarea
            id="orchestrator-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSubmit()
              }
            }}
            placeholder="Describe a complex task..."
            disabled={isProcessing}
            rows={1}
            className="min-h-[44px] w-full resize-none bg-transparent px-4 pt-3 pb-2 text-[15px] text-foreground outline-none placeholder:text-muted-foreground/60 disabled:opacity-50"
          />
          <div className="flex items-center justify-between px-3 pb-2">
            <div className="flex items-center gap-3 pl-1 text-xs text-muted-foreground">
              <span>Research</span>
              <span>Writer</span>
              <span>Editor</span>
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
  )
}

/* ─── Sub-Agent Orchestrator ─── */
export function SubAgentOrchestratorPreview() {
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => setPhase((p) => (p + 1) % 4), 2000)
    return () => clearInterval(timer)
  }, [])

  const tree = [
    { name: "CrewAI Manager", depth: 0, activeAt: 0 },
    { name: "|- Crew Agent A", depth: 1, activeAt: 1 },
    { name: "|  |- Task A1", depth: 2, activeAt: 2 },
    { name: "|  \\- Task A2", depth: 2, activeAt: 2 },
    { name: "\\- Crew Agent B", depth: 1, activeAt: 3 },
    { name: "   \\- Task B1", depth: 2, activeAt: 3 },
  ]

  return (
    <div className="mx-auto w-full max-w-lg p-6">
      <style dangerouslySetInnerHTML={{ __html: WAVE_KEYFRAMES }} />

      <div className="mb-4 flex items-center justify-between">
        <div>
          <span className="text-sm font-medium text-foreground">CrewAI Agent Tree</span>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Hierarchical delegation with CrewAI agents
          </p>
        </div>
        <span className="font-mono text-xs tabular-nums text-muted-foreground">
          {Math.min(phase + 1, 4)}/4
        </span>
      </div>
      <div className="rounded-xl border border-border p-4">
        <div className="space-y-1 font-mono text-sm">
          {tree.map((node, i) => (
            <motion.div
              key={node.name}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ ...SPRING, delay: i * 0.06 }}
              className={`flex items-center gap-2 rounded-lg px-2 py-1 transition-all ${
                phase >= node.activeAt
                  ? "bg-card text-foreground"
                  : "text-muted-foreground/80"
              }`}
            >
              <span>{node.name}</span>
              {phase === node.activeAt && <WaveDotsLoader />}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─── Agent Tool Approval ─── */
export function AgentToolApprovalPreview() {
  const [decision, setDecision] = useState<"approved" | "denied" | null>(null)

  return (
    <div className="mx-auto w-full max-w-lg space-y-3 p-6">
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...SPRING }}
        className="rounded-xl border border-border p-4"
      >
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Claude Tool Use Request
        </p>
        <div className="mt-3 rounded-xl bg-muted/50 p-3 font-mono text-sm text-foreground">
          <span className="text-muted-foreground">tool:</span> delete_user_data
          <br />
          <span className="text-muted-foreground">input:</span> {"{ user_id: \"usr_123\" }"}
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Claude requires human approval before executing this tool.
        </p>
      </motion.div>

      <AnimatePresence mode="wait">
        {decision === null ? (
          <motion.div
            key="buttons"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="flex gap-2"
          >
            <motion.button
              onClick={() => setDecision("approved")}
              whileTap={{ scale: 0.97 }}
              className="h-9 flex-1 rounded-xl bg-foreground text-sm font-medium text-background transition-all duration-150 hover:bg-foreground/90"
            >
              Approve
            </motion.button>
            <motion.button
              onClick={() => setDecision("denied")}
              whileTap={{ scale: 0.97 }}
              className="h-9 flex-1 rounded-xl border border-border text-sm font-medium text-muted-foreground transition-all duration-150 hover:border-foreground/20 hover:text-foreground"
            >
              Deny
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
            <div className="flex items-center gap-1.5 text-sm">
              {decision === "approved" ? (
                <>
                  <motion.svg
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ ...SPRING }}
                    width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-primary"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </motion.svg>
                  <span className="font-medium text-foreground">Approved — Claude executing</span>
                </>
              ) : (
                <>
                  <motion.svg
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ ...SPRING }}
                    width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-destructive"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </motion.svg>
                  <span className="text-muted-foreground">Denied — Claude skipped</span>
                </>
              )}
            </div>
            <button
              onClick={() => setDecision(null)}
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

/* ─── Evaluator Optimizer ─── */
export function EvaluatorOptimizerPreview() {
  const [iteration, setIteration] = useState(0)
  const scores = [0.42, 0.67, 0.85, 0.93]

  useEffect(() => {
    const timer = setInterval(() => {
      setIteration((p) => (p < scores.length - 1 ? p + 1 : p))
    }, 1500)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="mx-auto w-full max-w-lg p-6">
      <style dangerouslySetInnerHTML={{ __html: WAVE_KEYFRAMES }} />

      <div className="mb-4 flex items-center justify-between">
        <div>
          <span className="text-sm font-medium text-foreground">Claude Evaluate → Optimize Loop</span>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Claude iteratively improving output quality
          </p>
        </div>
        <span className="font-mono text-xs tabular-nums text-muted-foreground">
          {iteration + 1}/{scores.length}
        </span>
      </div>
      <div className="space-y-2">
        {scores.slice(0, iteration + 1).map((score, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...SPRING }}
            className={`flex items-center justify-between rounded-xl border px-4 py-2.5 transition-all ${
              i === iteration ? "border-border bg-card" : "border-border"
            }`}
          >
            <div className="flex items-center gap-2">
              {i === iteration && iteration < scores.length - 1 ? (
                <WaveDotsLoader />
              ) : i <= iteration ? (
                <motion.svg
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ ...SPRING }}
                  width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-primary"
                >
                  <polyline points="20 6 9 17 4 12" />
                </motion.svg>
              ) : null}
              <span className="text-sm text-muted-foreground">Claude Pass {i + 1}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${score * 100}%` }}
                  transition={{ ...SPRING, delay: 0.2 }}
                  className="h-full rounded-full bg-primary"
                />
              </div>
              <span className="w-10 text-right font-mono text-xs text-foreground">
                {score.toFixed(2)}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
      <AnimatePresence>
        {iteration >= scores.length - 1 && (
          <motion.p
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING }}
            className="mt-3 text-center text-xs text-muted-foreground"
          >
            Quality threshold reached
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ─── Multi-Step Tool ─── */
export function MultiStepToolPreview() {
  const [step, setStep] = useState(0)
  const steps = [
    { tool: "web_search()", result: "Found 12 results" },
    { tool: "file_read()", result: "Parsed 3 documents" },
    { tool: "chat.completions()", result: "Generated summary" },
    { tool: "response.format()", result: "Formatted output" },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((p) => (p < steps.length ? p + 1 : p))
    }, 1200)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="mx-auto w-full max-w-lg p-6">
      <style dangerouslySetInnerHTML={{ __html: WAVE_KEYFRAMES }} />

      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">OpenAI Function Chain</span>
        <span className="font-mono text-xs tabular-nums text-muted-foreground">
          {Math.min(step, steps.length)}/{steps.length}
        </span>
      </div>
      <div className="space-y-0.5">
        {steps.map((s, i) => (
          <motion.div
            key={s.tool}
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
            <div className="flex-1">
              <span className="font-mono text-sm text-foreground">{s.tool}</span>
              {i < step && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ ...SPRING }}
                  className="ml-2 text-xs text-muted-foreground"
                >
                  → {s.result}
                </motion.span>
              )}
            </div>
            {i === step && step < steps.length && (
              <span className="font-mono text-[10px] text-muted-foreground/40">running</span>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}

/* ─── Agentic Context Builder ─── */
export function AgenticContextBuilderPreview() {
  const [step, setStep] = useState(0)
  const questions = [
    { q: "What is your project about?", a: "An AI-powered dashboard" },
    { q: "Who is the target audience?", a: "Product managers" },
    { q: "What features are most important?", a: "Real-time analytics" },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((p) => (p < questions.length ? p + 1 : p))
    }, 2000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="mx-auto w-full max-w-lg p-6">
      <style dangerouslySetInnerHTML={{ __html: WAVE_KEYFRAMES }} />

      <div className="mb-4 flex items-center justify-between">
        <div>
          <span className="text-sm font-medium text-foreground">Claude Context Builder</span>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Claude gathering multi-step context from user
          </p>
        </div>
        <span className="font-mono text-xs tabular-nums text-muted-foreground">
          {Math.min(step, questions.length)}/{questions.length}
        </span>
      </div>
      <div className="space-y-3">
        {questions.map((item, i) => (
          <motion.div
            key={item.q}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: i <= step ? 1 : 0.3, x: 0 }}
            transition={{ ...SPRING, delay: i * 0.06 }}
            className={`rounded-xl border px-4 py-3 transition-all ${
              i < step ? "border-border bg-muted/40" : i === step ? "border-border bg-card" : "border-border"
            }`}
          >
            <p className="text-sm font-medium text-foreground">{item.q}</p>
            {i < step && (
              <motion.p
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...SPRING }}
                className="mt-1 text-xs text-muted-foreground"
              >
                → {item.a}
              </motion.p>
            )}
            {i === step && step < questions.length && (
              <div className="mt-2 flex items-center gap-2">
                <WaveDotsLoader />
                <span className="text-xs text-muted-foreground/60">awaiting input</span>
              </div>
            )}
          </motion.div>
        ))}
      </div>
      <AnimatePresence>
        {step >= questions.length && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING }}
            className="mt-4 rounded-xl border border-border bg-card p-3 text-center text-xs text-muted-foreground"
          >
            Context complete — Claude generating response
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ─── Inquire Multiple Choice ─── */
export function InquireMultipleChoicePreview() {
  const [selected, setSelected] = useState<Set<number>>(new Set())
  const options = [
    "Authentication & Authorization",
    "Real-time Data Sync",
    "File Upload & Storage",
    "Payment Processing",
  ]

  return (
    <div className="mx-auto w-full max-w-lg p-6">
      <div className="mb-4">
        <span className="text-sm font-medium text-foreground">
          Claude: Which features do you need?
        </span>
        <p className="mt-1 text-xs text-muted-foreground">Select all that apply</p>
      </div>
      <motion.div
        initial="initial"
        animate="animate"
        variants={{ animate: { ...STAGGER } }}
        className="space-y-2"
      >
        {options.map((opt, i) => (
          <motion.button
            key={opt}
            variants={FADE_UP}
            transition={{ ...SPRING }}
            onClick={() => {
              const next = new Set(selected)
              next.has(i) ? next.delete(i) : next.add(i)
              setSelected(next)
            }}
            whileTap={{ scale: 0.98 }}
            className={`flex w-full items-center gap-3 rounded-xl border px-4 py-2.5 text-left text-sm transition-all ${
              selected.has(i)
                ? "border-border bg-card text-foreground"
                : "border-border text-muted-foreground hover:bg-card/50"
            }`}
          >
            <div
              className={`flex size-4 shrink-0 items-center justify-center rounded border transition-all ${
                selected.has(i) ? "border-foreground bg-foreground" : "border-border"
              }`}
            >
              <AnimatePresence>
                {selected.has(i) && (
                  <motion.svg
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ ...SPRING }}
                    width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </motion.svg>
                )}
              </AnimatePresence>
            </div>
            {opt}
          </motion.button>
        ))}
      </motion.div>
      <AnimatePresence>
        {selected.size > 0 && (
          <motion.p
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ ...SPRING }}
            className="mt-3 text-center font-mono text-xs text-muted-foreground"
          >
            {selected.size} selected
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ─── Inquire Text ─── */
export function InquireTextPreview() {
  const [submitted, setSubmitted] = useState(false)

  return (
    <div className="mx-auto w-full max-w-lg p-6">
      <div className="mb-4">
        <span className="text-sm font-medium text-foreground">
          Claude: Describe your use case
        </span>
        <p className="mt-1 text-xs text-muted-foreground">
          Claude needs more context to proceed
        </p>
      </div>
      <AnimatePresence mode="wait">
        {!submitted ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ ...SPRING }}
            className="space-y-3"
          >
            <textarea
              placeholder="I want to build a dashboard that..."
              className="h-24 w-full rounded-xl border border-border bg-transparent p-3 text-sm outline-none placeholder:text-muted-foreground/80 focus:border-foreground/50"
            />
            <motion.button
              onClick={() => setSubmitted(true)}
              whileTap={{ scale: 0.97 }}
              className="h-9 w-full rounded-xl bg-foreground text-sm font-medium text-background"
            >
              Submit
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING }}
            className="space-y-3"
          >
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Claude Response</p>
              <p className="mt-2 text-sm leading-relaxed text-foreground">
                Based on your description, I recommend starting with a Next.js template
                with real-time data integration. Let me set that up for you.
              </p>
            </div>
            <button
              onClick={() => setSubmitted(false)}
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
