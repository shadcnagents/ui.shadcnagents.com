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

/* ─── Sub-Agent Orchestrator (Chat UI with Nested Dropdowns) ─── */

// Globe/routing icon
function AgentIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  )
}

// Wrench/tool icon
function ToolIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  )
}

// Tool call badge component with expandable details
function ToolCallBadge({ name, status, input, output }: { name: string; status: "working" | "done"; input?: string; output?: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-sm hover:bg-muted/50 transition-colors"
      >
        <ToolIcon className="text-muted-foreground" />
        <span className="text-foreground">{name}</span>
        {status === "done" ? (
          <span className="flex items-center gap-1 text-emerald-600">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span className="text-xs">Completed</span>
          </span>
        ) : (
          <CircleSpinner size={14} className="text-muted-foreground" />
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

      {/* Expandable details */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden"
          >
            <div className="mt-2 rounded-lg border border-border bg-muted/30 p-3 space-y-2">
              {input && (
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60 mb-1">Input</p>
                  <p className="text-xs font-mono text-muted-foreground bg-background rounded px-2 py-1">{input}</p>
                </div>
              )}
              {output && (
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60 mb-1">Output</p>
                  <p className="text-xs text-foreground/80">{output}</p>
                </div>
              )}
              {!input && !output && (
                <p className="text-xs text-muted-foreground">Routed query to analysis agent for structured insights.</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Nested agent routing dropdown
function AgentRoutingDropdown({
  agents,
  isExpanded,
  onToggle
}: {
  agents: Array<{
    name: string
    description: string
    toolName: string
    status: "working" | "done"
    input?: string
    output?: string
  }>
  isExpanded: boolean
  onToggle: () => void
}) {
  return (
    <div className="space-y-1">
      {/* Agent Routing Header */}
      <button
        onClick={onToggle}
        className="flex items-center gap-2 text-foreground hover:text-foreground/80 transition-colors py-1"
      >
        <AgentIcon className="text-muted-foreground" />
        <span className="text-sm font-medium">Agent Routing</span>
        <motion.svg
          animate={{ rotate: isExpanded ? 180 : 0 }}
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
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden"
          >
            {agents.map((agent, i) => (
              <div key={i} className="pl-2 mt-2">
                {/* Agent header */}
                <div className="flex items-center gap-2 mb-1">
                  <AgentIcon className="text-muted-foreground" />
                  <span className="text-sm text-foreground">{agent.name}</span>
                </div>

                {/* Description with left border */}
                <div className="ml-2 pl-4 border-l-2 border-border">
                  <p className="text-sm text-muted-foreground mb-2">{agent.description}</p>
                  <ToolCallBadge
                    name={agent.toolName}
                    status={agent.status}
                    input={agent.input}
                    output={agent.output}
                  />
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function SubAgentOrchestratorPreview() {
  const [input, setInput] = useState("")
  const [phase, setPhase] = useState<"idle" | "routing" | "done">("idle")
  const [routingExpanded, setRoutingExpanded] = useState(true)
  const [agents, setAgents] = useState<Array<{
    name: string
    description: string
    toolName: string
    status: "working" | "done"
    input?: string
    output?: string
  }>>([])
  const [isProcessing, setIsProcessing] = useState(false)

  const exampleTasks = [
    "Analyze the pros and cons of microservices",
    "Research competitor pricing strategies",
    "Evaluate our Q4 sales performance",
  ]

  function handleSubmit() {
    if (!input.trim() || isProcessing) return
    setInput("")
    setPhase("routing")
    setIsProcessing(true)
    setAgents([])

    // Start routing
    setTimeout(() => {
      setAgents([{
        name: "Analysis Agent",
        description: "Query requires structured analysis and insights",
        toolName: "routeToAnalysis",
        status: "working",
        input: '{ "query": "microservices analysis", "type": "pros_cons" }',
      }])

      // Complete the agent
      setTimeout(() => {
        setAgents(prev => prev.map(a => ({
          ...a,
          status: "done" as const,
          output: "Analysis complete. Generated structured pros/cons with 4 pros and 2 cons identified."
        })))

        // Show result
        setTimeout(() => {
          setPhase("done")
          setIsProcessing(false)
        }, 400)
      }, 1500)
    }, 600)
  }

  function reset() {
    setPhase("idle")
    setAgents([])
    setInput("")
    setIsProcessing(false)
    setRoutingExpanded(true)
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
                <AgentIcon className="size-10 text-muted-foreground" />
              </div>
              <h1 className="mb-2 text-2xl font-medium text-foreground">Sub-Agent Orchestrator</h1>
              <p className="mb-6 text-sm text-muted-foreground text-center max-w-md">
                Routes queries to specialized sub-agents based on task requirements
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

              {/* Agent Routing Section */}
              <div className="px-6 pb-4">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <AgentRoutingDropdown
                    agents={agents}
                    isExpanded={routingExpanded}
                    onToggle={() => setRoutingExpanded(!routingExpanded)}
                  />
                </motion.div>

                {/* Response content */}
                {phase === "done" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: 0.1 }}
                    className="mt-6 text-[15px] leading-relaxed text-foreground"
                  >
                    <p className="mb-4">Here is an analysis of the pros and cons of microservices architecture:</p>

                    <p className="font-medium mb-2">Pros:</p>
                    <ul className="space-y-2 mb-4">
                      <li className="flex gap-2">
                        <span className="text-muted-foreground">•</span>
                        <span><span className="font-medium">Scalability and fault isolation:</span> <span className="text-muted-foreground">Microservices allow independent scaling of components and better containment of failures within individual services.</span></span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-muted-foreground">•</span>
                        <span><span className="font-medium">Faster team autonomy:</span> <span className="text-muted-foreground">Teams can own services end-to-end, improving throughput and aligning development with business capabilities.</span></span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-muted-foreground">•</span>
                        <span><span className="font-medium">Technology diversity:</span> <span className="text-muted-foreground">Teams can choose the best technology stack for each service, enhancing system resilience.</span></span>
                      </li>
                    </ul>

                    <p className="font-medium mb-2">Cons:</p>
                    <ul className="space-y-2">
                      <li className="flex gap-2">
                        <span className="text-muted-foreground">•</span>
                        <span><span className="font-medium">Operational complexity:</span> <span className="text-muted-foreground">Managing distributed systems requires sophisticated orchestration, monitoring, logging, and tracing.</span></span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-muted-foreground">•</span>
                        <span><span className="font-medium">Network overhead:</span> <span className="text-muted-foreground">Inter-service communication adds latency and requires careful API design and versioning.</span></span>
                      </li>
                    </ul>
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
            placeholder="Ask a question that will route to a sub-agent..."
            disabled={isProcessing}
            rows={2}
            className="min-h-[60px] w-full resize-none bg-transparent px-4 pt-3 pb-2 text-[15px] text-foreground outline-none placeholder:text-muted-foreground/60 disabled:opacity-50"
          />
          <div className="flex items-center justify-end px-3 pb-3">
            <button
              onClick={handleSubmit}
              disabled={!input.trim() || isProcessing}
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

/* ─── Agent Tool Approval ─── */

export function AgentToolApprovalPreview() {
  const [phase, setPhase] = useState<"idle" | "thinking" | "approval" | "executing" | "done">("idle")
  const [decision, setDecision] = useState<"approved" | "denied" | null>(null)

  const toolCall = {
    name: "delete_user_account",
    params: {
      user_id: "usr_2kx8mJ9pL",
      include_backups: true,
      notify_user: false,
    }
  }

  function handleApprove() {
    setDecision("approved")
    setPhase("executing")
    setTimeout(() => setPhase("done"), 1500)
  }

  function handleDeny() {
    setDecision("denied")
    setPhase("done")
  }

  function reset() {
    setPhase("idle")
    setDecision(null)
  }

  function startDemo() {
    setPhase("thinking")
    setTimeout(() => setPhase("approval"), 1000)
  }

  return (
    <div className="flex h-[400px] w-full items-center justify-center p-6">
      <style dangerouslySetInnerHTML={{ __html: WAVE_KEYFRAMES }} />

      <div className="w-full max-w-md">
        <AnimatePresence mode="wait">
          {/* Idle State */}
          {phase === "idle" && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="text-center"
            >
              <motion.button
                onClick={startDemo}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card px-8 py-6 text-left shadow-sm transition-all hover:border-foreground/20 hover:shadow-md"
              >
                <div className="flex items-start gap-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-orange-500/10">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-orange-500">
                      <path d="M12 9v4M12 17h.01" />
                      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Trigger Tool Approval</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Click to simulate an agent requesting permission to execute a destructive action
                    </p>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-r from-orange-500/0 via-orange-500/50 to-orange-500/0 opacity-0 transition-opacity group-hover:opacity-100" />
              </motion.button>
            </motion.div>
          )}

          {/* Thinking State */}
          {phase === "thinking" && (
            <motion.div
              key="thinking"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-center gap-3 py-12"
            >
              <WaveDotsLoader />
              <span className="text-sm text-muted-foreground">Agent is processing...</span>
            </motion.div>
          )}

          {/* Approval State */}
          {phase === "approval" && (
            <motion.div
              key="approval"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            >
              <div className="overflow-hidden rounded-2xl border border-orange-500/20 bg-card shadow-lg shadow-orange-500/5">
                {/* Header */}
                <div className="border-b border-border bg-orange-500/5 px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-orange-500/10">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-orange-500">
                        <path d="M12 9v4M12 17h.01" />
                        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Approval Required</p>
                      <p className="text-xs text-muted-foreground">Agent wants to execute a tool</p>
                    </div>
                  </div>
                </div>

                {/* Tool details */}
                <div className="px-5 py-4">
                  <div className="rounded-xl bg-muted/50 p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex size-6 items-center justify-center rounded-md bg-foreground/10">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-foreground">
                          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                        </svg>
                      </div>
                      <code className="text-sm font-semibold text-foreground">{toolCall.name}</code>
                    </div>
                    <pre className="text-xs leading-relaxed">
                      <code className="text-muted-foreground">
                        {JSON.stringify(toolCall.params, null, 2).split('\n').map((line, i) => (
                          <span key={i} className="block">
                            {line.includes(':') ? (
                              <>
                                <span className="text-muted-foreground">{line.split(':')[0]}:</span>
                                <span className="text-foreground">{line.split(':').slice(1).join(':')}</span>
                              </>
                            ) : (
                              <span className="text-muted-foreground">{line}</span>
                            )}
                          </span>
                        ))}
                      </code>
                    </pre>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 border-t border-border bg-muted/30 px-5 py-4">
                  <motion.button
                    onClick={handleDeny}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="flex-1 rounded-xl border border-border bg-background py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground"
                  >
                    Deny
                  </motion.button>
                  <motion.button
                    onClick={handleApprove}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="flex-1 rounded-xl bg-foreground py-2.5 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
                  >
                    Allow
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Executing State */}
          {phase === "executing" && (
            <motion.div
              key="executing"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
                <div className="px-5 py-6">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <CircleSpinner size={24} className="text-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Executing tool...</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        <code className="text-xs">{toolCall.name}</code>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="h-1 bg-muted overflow-hidden">
                  <motion.div
                    className="h-full bg-foreground"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Done State */}
          {phase === "done" && (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            >
              <div className={`overflow-hidden rounded-2xl border shadow-sm ${
                decision === "approved"
                  ? "border-emerald-500/20 bg-emerald-500/5"
                  : "border-border bg-card"
              }`}>
                <div className="px-5 py-6">
                  <div className="flex items-center gap-4">
                    {decision === "approved" ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 20 }}
                        className="flex size-10 items-center justify-center rounded-full bg-emerald-500/10"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-emerald-500">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 20 }}
                        className="flex size-10 items-center justify-center rounded-full bg-muted"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </motion.div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {decision === "approved" ? "Tool executed successfully" : "Tool execution denied"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {decision === "approved"
                          ? "The action was completed as requested"
                          : "The agent will proceed without this action"
                        }
                      </p>
                    </div>
                  </div>
                </div>
                <div className="border-t border-border/50 bg-muted/20 px-5 py-3">
                  <button
                    onClick={reset}
                    className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Reset demo
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
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

type ACBMessage = {
  id: string
  role: "ai" | "user"
  content: string
  type: "text" | "options" | "input"
  options?: string[]
  inputPlaceholder?: string
  answered?: boolean
  answer?: string
}

export function AgenticContextBuilderPreview() {
  const [messages, setMessages] = useState<ACBMessage[]>([])
  const [currentInput, setCurrentInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [contextComplete, setContextComplete] = useState(false)
  const [questionIndex, setQuestionIndex] = useState(0)

  const questions: Omit<ACBMessage, "id" | "answered" | "answer">[] = [
    {
      role: "ai",
      content: "Hi! I'm here to help you find the perfect candidates. Let me gather some context first. What role are you hiring for?",
      type: "input",
      inputPlaceholder: "e.g. Product Designer, Software Engineer..."
    },
    {
      role: "ai",
      content: "What skills are most important for this role?",
      type: "options",
      options: ["React", "TypeScript", "Python", "Figma", "Node.js", "SQL"]
    },
    {
      role: "ai",
      content: "How many years of experience should candidates have?",
      type: "options",
      options: ["0-2 years", "3-5 years", "5-10 years", "10+ years"]
    },
    {
      role: "ai",
      content: "What's the preferred work arrangement?",
      type: "options",
      options: ["Remote", "Hybrid", "On-site"]
    }
  ]

  // Collected context
  const [context, setContext] = useState<{
    role?: string
    skills?: string[]
    experience?: string
    location?: string
  }>({})

  // Start conversation
  useEffect(() => {
    if (messages.length === 0) {
      startConversation()
    }
  }, [])

  function startConversation() {
    setIsTyping(true)
    setTimeout(() => {
      setMessages([{
        ...questions[0],
        id: "q0",
        answered: false
      }])
      setIsTyping(false)
      setQuestionIndex(0)
    }, 800)
  }

  function handleAnswer(answer: string, isMultiSelect = false) {
    if (contextComplete) return

    // Update current message as answered
    setMessages(prev => prev.map((msg, i) =>
      i === prev.length - 1 ? { ...msg, answered: true, answer } : msg
    ))

    // Add user response
    const userMsg: ACBMessage = {
      id: `user-${questionIndex}`,
      role: "user",
      content: answer,
      type: "text",
      answered: true
    }
    setMessages(prev => [...prev, userMsg])

    // Update context
    const newContext = { ...context }
    if (questionIndex === 0) newContext.role = answer
    if (questionIndex === 1) newContext.skills = answer.split(", ")
    if (questionIndex === 2) newContext.experience = answer
    if (questionIndex === 3) newContext.location = answer
    setContext(newContext)

    // Next question or complete
    const nextIndex = questionIndex + 1
    if (nextIndex < questions.length) {
      setIsTyping(true)
      setTimeout(() => {
        setMessages(prev => [...prev, {
          ...questions[nextIndex],
          id: `q${nextIndex}`,
          answered: false
        }])
        setIsTyping(false)
        setQuestionIndex(nextIndex)
      }, 600)
    } else {
      // Context complete
      setIsTyping(true)
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: "complete",
          role: "ai",
          content: `I now have enough context. You're looking for a **${newContext.role}** with expertise in **${newContext.skills?.join(", ")}**, having **${newContext.experience}** of experience, preferring **${newContext.location}** work. I found **127 candidates** matching your criteria.`,
          type: "text",
          answered: true
        }])
        setIsTyping(false)
        setContextComplete(true)
      }, 800)
    }
  }

  function handleInputSubmit() {
    if (!currentInput.trim()) return
    handleAnswer(currentInput.trim())
    setCurrentInput("")
  }

  function reset() {
    setMessages([])
    setContext({})
    setContextComplete(false)
    setQuestionIndex(0)
    setCurrentInput("")
    setTimeout(() => startConversation(), 100)
  }

  // Calculate progress
  const progress = Math.min((questionIndex + (messages.some(m => m.id === "complete") ? 1 : 0)) / questions.length * 100, 100)

  return (
    <div className="mx-auto flex h-[540px] w-full max-w-2xl flex-col rounded-xl border border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-border">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Context Builder</h3>
          <p className="text-xs text-muted-foreground">AI is gathering information to help you</p>
        </div>
        <div className="flex items-center gap-3">
          {contextComplete && (
            <span className="flex items-center gap-1.5 text-xs text-blue-600 font-medium">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Context Ready
            </span>
          )}
          <button
            onClick={reset}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-border">
        <motion.div
          className="h-full bg-blue-500"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        <AnimatePresence mode="popLayout">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "ai" ? (
                <div className="max-w-[85%] space-y-3">
                  {/* AI message */}
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center size-8 rounded-full bg-blue-500/10 shrink-0">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-blue-500">
                        <path d="M12 2L13.09 8.26L18 6L15.74 10.91L22 12L15.74 13.09L18 18L13.09 15.74L12 22L10.91 15.74L6 18L8.26 13.09L2 12L8.26 10.91L6 6L10.91 8.26L12 2Z" />
                      </svg>
                    </div>
                    <div className="pt-1">
                      <p className="text-sm text-foreground leading-relaxed">
                        {msg.content.split("**").map((part, i) =>
                          i % 2 === 1 ? <span key={i} className="font-semibold text-blue-600">{part}</span> : part
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Options */}
                  {msg.type === "options" && !msg.answered && msg.options && (
                    <div className="ml-11 flex flex-wrap gap-2">
                      {msg.options.map((opt) => (
                        <button
                          key={opt}
                          onClick={() => handleAnswer(opt)}
                          className="px-4 py-2 rounded-full border border-border text-sm text-muted-foreground hover:border-blue-500 hover:text-blue-600 hover:bg-blue-500/5 transition-all"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Text input */}
                  {msg.type === "input" && !msg.answered && (
                    <div className="ml-11">
                      <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2">
                        <input
                          type="text"
                          value={currentInput}
                          onChange={(e) => setCurrentInput(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleInputSubmit()}
                          placeholder={msg.inputPlaceholder}
                          className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                          autoFocus
                        />
                        <button
                          onClick={handleInputSubmit}
                          disabled={!currentInput.trim()}
                          className="flex items-center justify-center size-7 rounded-lg bg-blue-500 text-white disabled:opacity-40 transition-opacity"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="max-w-[70%]">
                  <div className="rounded-2xl bg-foreground text-background px-4 py-2.5">
                    <p className="text-sm">{msg.content}</p>
                  </div>
                </div>
              )}
            </motion.div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-3"
            >
              <div className="flex items-center justify-center size-8 rounded-full bg-blue-500/10">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-blue-500">
                  <path d="M12 2L13.09 8.26L18 6L15.74 10.91L22 12L15.74 13.09L18 18L13.09 15.74L12 22L10.91 15.74L6 18L8.26 13.09L2 12L8.26 10.91L6 6L10.91 8.26L12 2Z" />
                </svg>
              </div>
              <div className="flex gap-1">
                <span className="size-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="size-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="size-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Context summary footer */}
      {contextComplete && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-t border-border bg-muted/30 px-5 py-4"
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-medium text-muted-foreground">COLLECTED CONTEXT</p>
            <span className="text-xs text-blue-600">4/4 questions</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {context.role && (
              <span className="px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-600 text-xs font-medium">{context.role}</span>
            )}
            {context.skills?.map(skill => (
              <span key={skill} className="px-3 py-1.5 rounded-lg bg-foreground/5 text-foreground text-xs">{skill}</span>
            ))}
            {context.experience && (
              <span className="px-3 py-1.5 rounded-lg bg-foreground/5 text-foreground text-xs">{context.experience}</span>
            )}
            {context.location && (
              <span className="px-3 py-1.5 rounded-lg bg-foreground/5 text-foreground text-xs">{context.location}</span>
            )}
          </div>
          <button className="w-full h-10 mt-4 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors">
            Search with this context
          </button>
        </motion.div>
      )}
    </div>
  )
}

/* ─── Inquire Multiple Choice ─── */

// List icon
function ListCheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M11 6h9M11 12h9M12 18h8M3 6l2 2 4-4M3 12l2 2 4-4M3 18h4" />
    </svg>
  )
}

export function InquireMultipleChoicePreview() {
  const [input, setInput] = useState("")
  const [phase, setPhase] = useState<"idle" | "processing" | "selection" | "done">("idle")
  const [selected, setSelected] = useState<Set<number>>(new Set())
  const [mainExpanded, setMainExpanded] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)

  const examplePrompts = [
    "Set up a new web app",
    "Configure my project features",
    "Help me choose integrations",
  ]

  const options = [
    "Authentication & Authorization",
    "Real-time Data Sync",
    "File Upload & Storage",
    "Payment Processing",
  ]

  function handleSubmit() {
    if (!input.trim() || isProcessing) return
    setInput("")
    setPhase("processing")
    setIsProcessing(true)
    setSelected(new Set())

    setTimeout(() => {
      setPhase("selection")
      setIsProcessing(false)
    }, 800)
  }

  function toggle(i: number) {
    const next = new Set(selected)
    next.has(i) ? next.delete(i) : next.add(i)
    setSelected(next)
  }

  function handleConfirm() {
    if (selected.size === 0) return
    setPhase("done")
  }

  function reset() {
    setPhase("idle")
    setInput("")
    setSelected(new Set())
    setIsProcessing(false)
    setMainExpanded(true)
  }

  const selectedLabels = Array.from(selected).map(i => options[i])

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
                <ListCheckIcon className="size-10 text-muted-foreground" />
              </div>
              <h1 className="mb-2 text-2xl font-medium text-foreground">Multi-Choice Inquiry</h1>
              <p className="mb-6 text-sm text-muted-foreground text-center max-w-md">
                Agent asks clarifying questions with selectable options
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {examplePrompts.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => setInput(prompt)}
                    className="rounded-2xl border border-border bg-background px-4 py-2.5 text-sm text-muted-foreground hover:border-foreground/20 hover:text-foreground transition-all"
                  >
                    {prompt}
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
                    <span className="text-sm text-muted-foreground">Processing request...</span>
                  </motion.div>
                )}

                {/* Selection section */}
                {(phase === "selection" || phase === "done") && (
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
                      <ListCheckIcon className="text-muted-foreground" />
                      <span className="text-sm font-medium">Input Required</span>
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
                            {/* Question header */}
                            <div className="flex items-center gap-2">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground">
                                <circle cx="12" cy="12" r="10" />
                                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                                <path d="M12 17h.01" />
                              </svg>
                              <span className="text-sm text-foreground">Which features do you need?</span>
                            </div>

                            {/* Content with left border */}
                            <div className="ml-2 pl-4 border-l-2 border-border space-y-3">
                              <p className="text-sm text-muted-foreground">
                                Select all that apply to continue
                              </p>

                              {/* Options */}
                              <div className="space-y-1.5">
                                {options.map((opt, i) => {
                                  const isSelected = selected.has(i)
                                  const isDisabled = phase === "done"
                                  return (
                                    <button
                                      key={opt}
                                      onClick={() => !isDisabled && toggle(i)}
                                      disabled={isDisabled}
                                      className={`group flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-all ${
                                        isSelected
                                          ? "border-foreground/20 bg-muted/50"
                                          : "border-border hover:border-foreground/10 hover:bg-muted/30"
                                      } ${isDisabled ? "opacity-60 cursor-default" : ""}`}
                                    >
                                      <div
                                        className={`flex size-4 shrink-0 items-center justify-center rounded-[3px] border transition-all ${
                                          isSelected ? "border-foreground bg-foreground" : "border-muted-foreground/40"
                                        }`}
                                      >
                                        <AnimatePresence>
                                          {isSelected && (
                                            <motion.svg
                                              initial={{ scale: 0 }}
                                              animate={{ scale: 1 }}
                                              exit={{ scale: 0 }}
                                              transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                              width="10"
                                              height="10"
                                              viewBox="0 0 24 24"
                                              fill="none"
                                              stroke="currentColor"
                                              strokeWidth="3"
                                              className="text-background"
                                            >
                                              <polyline points="20 6 9 17 4 12" />
                                            </motion.svg>
                                          )}
                                        </AnimatePresence>
                                      </div>
                                      <span className={`text-sm ${isSelected ? "text-foreground" : "text-muted-foreground"}`}>
                                        {opt}
                                      </span>
                                    </button>
                                  )
                                })}
                              </div>

                              {/* Submit button */}
                              {phase === "selection" && (
                                <div className="flex items-center justify-between pt-2">
                                  <span className="text-xs text-muted-foreground">
                                    {selected.size === 0 ? "Select at least one" : `${selected.size} selected`}
                                  </span>
                                  <motion.button
                                    onClick={handleConfirm}
                                    disabled={selected.size === 0}
                                    whileTap={{ scale: 0.97 }}
                                    className="h-9 rounded-lg bg-foreground px-4 text-sm font-medium text-background transition-colors hover:bg-foreground/90 disabled:opacity-40 disabled:cursor-not-allowed"
                                  >
                                    Submit
                                  </motion.button>
                                </div>
                              )}

                              {/* Confirmed indicator */}
                              {phase === "done" && (
                                <div className="flex items-center gap-2 pt-1">
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-foreground">
                                    <polyline points="20 6 9 17 4 12" />
                                  </svg>
                                  <span className="text-xs text-muted-foreground">
                                    {selected.size} option{selected.size > 1 ? "s" : ""} submitted
                                  </span>
                                </div>
                              )}
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
                    className="mt-6"
                  >
                    <p className="text-[15px] leading-relaxed text-foreground mb-3">
                      Setting up your project with the selected features:
                    </p>
                    <div className="rounded-lg border border-border bg-muted/30 overflow-hidden">
                      <div className="border-b border-border px-3 py-1.5">
                        <span className="font-mono text-[10px] text-muted-foreground">config.ts</span>
                      </div>
                      <div className="p-3 font-mono text-[11px] text-muted-foreground leading-relaxed">
                        <div className="text-foreground">export const features = {"{"}</div>
                        {selectedLabels.map((label, i) => (
                          <div key={i} className="pl-4">
                            <span className="text-muted-foreground">{label.toLowerCase().replace(/ & /g, "_").replace(/ /g, "_")}:</span>
                            <span className="text-foreground"> true</span>
                            <span className="text-muted-foreground/50">,</span>
                          </div>
                        ))}
                        <div className="text-foreground">{"}"}</div>
                      </div>
                    </div>
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
            placeholder="Ask something that requires choices..."
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

/* ─── Inquire Text ─── */
// Text input icon
function TextInputIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M17 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Z" />
      <path d="M9 7h6M9 11h6M9 15h4" />
    </svg>
  )
}

export function InquireTextPreview() {
  const [input, setInput] = useState("")
  const [phase, setPhase] = useState<"idle" | "processing" | "input" | "done">("idle")
  const [textInput, setTextInput] = useState("")
  const [mainExpanded, setMainExpanded] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)

  const examplePrompts = [
    "Help me build a dashboard",
    "Create a landing page",
    "Set up an API integration",
  ]

  function handleSubmit() {
    if (!input.trim() || isProcessing) return
    setInput("")
    setPhase("processing")
    setIsProcessing(true)
    setTextInput("")

    setTimeout(() => {
      setPhase("input")
      setIsProcessing(false)
    }, 800)
  }

  function handleTextSubmit() {
    if (!textInput.trim()) return
    setPhase("done")
  }

  function reset() {
    setPhase("idle")
    setInput("")
    setTextInput("")
    setIsProcessing(false)
    setMainExpanded(true)
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
                <TextInputIcon className="size-10 text-muted-foreground" />
              </div>
              <h1 className="mb-2 text-2xl font-medium text-foreground">Text Input Inquiry</h1>
              <p className="mb-6 text-sm text-muted-foreground text-center max-w-md">
                Agent asks for free-form text input to gather context
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {examplePrompts.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => setInput(prompt)}
                    className="rounded-2xl border border-border bg-background px-4 py-2.5 text-sm text-muted-foreground hover:border-foreground/20 hover:text-foreground transition-all"
                  >
                    {prompt}
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
                    <span className="text-sm text-muted-foreground">Processing request...</span>
                  </motion.div>
                )}

                {/* Input section */}
                {(phase === "input" || phase === "done") && (
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
                      <TextInputIcon className="text-muted-foreground" />
                      <span className="text-sm font-medium">Input Required</span>
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
                            {/* Question header */}
                            <div className="flex items-center gap-2">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground">
                                <circle cx="12" cy="12" r="10" />
                                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                                <path d="M12 17h.01" />
                              </svg>
                              <span className="text-sm text-foreground">Describe your use case</span>
                            </div>

                            {/* Content with left border */}
                            <div className="ml-2 pl-4 border-l-2 border-border space-y-3">
                              <p className="text-sm text-muted-foreground">
                                Provide details so I can better assist you
                              </p>

                              {/* Text input */}
                              {phase === "input" && (
                                <div className="space-y-3">
                                  <textarea
                                    value={textInput}
                                    onChange={(e) => setTextInput(e.target.value)}
                                    placeholder="I want to build a dashboard that shows real-time analytics..."
                                    className="h-24 w-full rounded-lg border border-border bg-transparent p-3 text-sm outline-none placeholder:text-muted-foreground/60 focus:border-foreground/30 resize-none"
                                  />
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs text-muted-foreground">
                                      {textInput.length > 0 ? `${textInput.length} characters` : "Enter your response"}
                                    </span>
                                    <motion.button
                                      onClick={handleTextSubmit}
                                      disabled={!textInput.trim()}
                                      whileTap={{ scale: 0.97 }}
                                      className="h-9 rounded-lg bg-foreground px-4 text-sm font-medium text-background transition-colors hover:bg-foreground/90 disabled:opacity-40 disabled:cursor-not-allowed"
                                    >
                                      Submit
                                    </motion.button>
                                  </div>
                                </div>
                              )}

                              {/* Submitted indicator */}
                              {phase === "done" && (
                                <div className="space-y-2">
                                  <div className="rounded-lg border border-border bg-muted/30 p-3">
                                    <p className="text-sm text-foreground">{textInput}</p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-foreground">
                                      <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                    <span className="text-xs text-muted-foreground">Response submitted</span>
                                  </div>
                                </div>
                              )}
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
                    className="mt-6"
                  >
                    <p className="text-[15px] leading-relaxed text-foreground mb-3">
                      Based on your description, here's my recommendation:
                    </p>
                    <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="flex size-6 shrink-0 items-center justify-center rounded-full border border-border bg-background text-xs font-medium text-foreground">1</div>
                        <div>
                          <p className="text-sm font-medium text-foreground">Set up Next.js with TypeScript</p>
                          <p className="text-xs text-muted-foreground mt-0.5">Modern React framework with type safety</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="flex size-6 shrink-0 items-center justify-center rounded-full border border-border bg-background text-xs font-medium text-foreground">2</div>
                        <div>
                          <p className="text-sm font-medium text-foreground">Add real-time data layer</p>
                          <p className="text-xs text-muted-foreground mt-0.5">WebSocket integration for live updates</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="flex size-6 shrink-0 items-center justify-center rounded-full border border-border bg-background text-xs font-medium text-foreground">3</div>
                        <div>
                          <p className="text-sm font-medium text-foreground">Configure dashboard components</p>
                          <p className="text-xs text-muted-foreground mt-0.5">Charts, tables, and metrics cards</p>
                        </div>
                      </div>
                    </div>
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
            placeholder="Ask something that needs detailed input..."
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

/* ─── Human-in-the-Loop: Image Select ─── */

const SAMPLE_PORTRAITS = [
  { id: "1", src: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=400&fit=crop&q=80", label: "Emma" },
  { id: "2", src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop&q=80", label: "Marcus" },
  { id: "3", src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=400&fit=crop&q=80", label: "Sofia" },
  { id: "4", src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=400&fit=crop&q=80", label: "James" },
  { id: "5", src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=400&fit=crop&q=80", label: "Olivia" },
  { id: "6", src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=400&fit=crop&q=80", label: "Daniel" },
]

export function ImageSelectPreview() {
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [submitted, setSubmitted] = useState(false)

  function toggle(id: string) {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else if (next.size < 4) next.add(id)
      return next
    })
  }

  if (submitted) {
    const selectedImages = SAMPLE_PORTRAITS.filter(img => selected.has(img.id))
    return (
      <div className="mx-auto w-full max-w-md p-6">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-border bg-card p-5"
        >
          <div className="mb-4 flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-full bg-emerald-500/15">
              <svg className="size-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Selection confirmed</p>
              <p className="text-xs text-muted-foreground">{selected.size} characters selected</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedImages.map(img => (
              <div key={img.id} className="relative overflow-hidden rounded-lg">
                <img src={img.src} alt={img.label} className="h-20 w-16 object-cover" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-1.5 py-1">
                  <p className="text-[10px] font-medium text-white">{img.label}</p>
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => { setSubmitted(false); setSelected(new Set()) }} className="mt-4 text-xs text-muted-foreground hover:text-foreground">
            Change selection
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-md p-6">
      {/* Agent header */}
      <div className="mb-5 flex gap-3">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-600">
          <svg className="size-3.5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
          </svg>
        </div>
        <div>
          <p className="text-sm text-foreground">Select characters for transformation</p>
          <p className="text-xs text-muted-foreground">Choose up to 4 portraits</p>
        </div>
      </div>

      {/* Image grid */}
      <div className="grid grid-cols-3 gap-2.5">
        {SAMPLE_PORTRAITS.map((image) => {
          const isSelected = selected.has(image.id)
          const canSelect = selected.size < 4 || isSelected

          return (
            <motion.button
              key={image.id}
              onClick={() => canSelect && toggle(image.id)}
              disabled={!canSelect}
              className={`group relative aspect-[3/4] overflow-hidden rounded-xl transition-all duration-200 ${
                isSelected
                  ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                  : "ring-1 ring-border hover:ring-2"
              } ${!canSelect && !isSelected ? "opacity-40" : ""}`}
              whileHover={canSelect ? { y: -2 } : {}}
              whileTap={canSelect ? { scale: 0.97 } : {}}
            >
              <img
                src={image.src}
                alt={image.label}
                className={`h-full w-full object-cover transition-transform duration-300 ${
                  isSelected ? "scale-105" : "group-hover:scale-105"
                }`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              <AnimatePresence>
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="absolute right-1.5 top-1.5 flex size-5 items-center justify-center rounded-full bg-primary"
                  >
                    <svg className="size-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="absolute inset-x-0 bottom-0 px-2 pb-2">
                <p className="text-xs font-medium text-white drop-shadow">{image.label}</p>
              </div>
            </motion.button>
          )
        })}
      </div>

      {/* Footer */}
      <div className="mt-5 flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          {selected.size === 0 ? "Select up to 4" : `${selected.size} of 4 selected`}
        </p>
        <motion.button
          onClick={() => selected.size > 0 && setSubmitted(true)}
          disabled={selected.size === 0}
          className={`rounded-full px-4 py-2 text-xs font-medium transition-all ${
            selected.size > 0
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground"
          }`}
          whileHover={selected.size > 0 ? { scale: 1.02 } : {}}
          whileTap={selected.size > 0 ? { scale: 0.98 } : {}}
        >
          Continue
        </motion.button>
      </div>
    </div>
  )
}
