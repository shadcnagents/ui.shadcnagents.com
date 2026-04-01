"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import Image from "next/image"
import { AnimatePresence, motion } from "motion/react"
import { AIInput, AIInputTextarea, AIInputFooter, AIInputAction } from "@/components/ui/ai-input"
import { WaveDotsLoader, CircleSpinner, WAVE_KEYFRAMES, SPRING, FADE_UP, STAGGER } from "./shared"

/* ─── Shared API Helper ─── */
async function streamChat(
  messages: { role: "user" | "assistant"; content: string }[],
  systemPrompt: string,
  onChunk: (text: string) => void,
  onComplete: (fullText: string) => void,
  onError: (error: string) => void
) {
  try {
    const response = await fetch("/api/preview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: messages.map((m) => ({ role: m.role, content: m.content })),
        system: systemPrompt,
      }),
    })

    if (!response.ok) throw new Error("Failed to fetch response")

    const reader = response.body?.getReader()
    if (!reader) throw new Error("No reader available")

    const decoder = new TextDecoder()
    let fullText = ""

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      const chunk = decoder.decode(value, { stream: true })
      fullText += chunk
      onChunk(fullText)
    }

    onComplete(fullText)
  } catch (error) {
    onError(error instanceof Error ? error.message : "An error occurred")
  }
}

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

  async function handleSubmit() {
    if (!input.trim() || isProcessing) return
    const userMessage = input.trim()
    setInput("")
    setMessages([{ role: "user", content: userMessage }])
    setIsProcessing(true)

    // Step 1: Thinking
    await new Promise(r => setTimeout(r, 600))
    setMessages(prev => [...prev, {
      role: "thinking",
      content: "I'll break this into subtasks and delegate to specialized agents:\n1. Research Agent → gather sources\n2. Writer Agent → draft content\n3. Editor Agent → polish output"
    }])

    // Step 2: Research tool
    await new Promise(r => setTimeout(r, 800))
    setMessages(prev => [...prev, {
      role: "tool",
      toolName: "research_agent",
      content: "query: \"" + userMessage + "\"",
      toolStatus: "running"
    }])

    await new Promise(r => setTimeout(r, 1000))
    setMessages(prev => prev.map((m, i) =>
      i === prev.length - 1 ? { ...m, toolStatus: "done" as const, toolResult: "Found 3 sources. Key themes identified and compiled." } : m
    ))

    // Step 3: Writer tool
    await new Promise(r => setTimeout(r, 400))
    setMessages(prev => [...prev, {
      role: "tool",
      toolName: "writer_agent",
      content: "sources: [3 articles], target: concise summary",
      toolStatus: "running"
    }])

    await new Promise(r => setTimeout(r, 1200))
    setMessages(prev => prev.map((m, i) =>
      i === prev.length - 1 ? { ...m, toolStatus: "done" as const, toolResult: "Draft completed with key insights." } : m
    ))

    // Step 4: Editor tool
    await new Promise(r => setTimeout(r, 400))
    setMessages(prev => [...prev, {
      role: "tool",
      toolName: "editor_agent",
      content: "draft: [complete], check: clarity, formatting",
      toolStatus: "running"
    }])

    await new Promise(r => setTimeout(r, 1000))
    setMessages(prev => prev.map((m, i) =>
      i === prev.length - 1 ? { ...m, toolStatus: "done" as const, toolResult: "Polished and finalized." } : m
    ))

    // Step 5: Real AI final response
    await new Promise(r => setTimeout(r, 600))

    const systemPrompt = `You are an AI orchestrator that coordinates multiple specialized agents. You just completed a task using Research, Writer, and Editor agents.

Provide a brief summary (3-4 sentences) of what was accomplished for this request: "${userMessage}"

Format: Start with "I've completed your request by coordinating three specialized agents:" then briefly describe what each agent contributed.`

    let finalResponse = ""
    setMessages(prev => [...prev, { role: "assistant", content: "" }])

    await streamChat(
      [{ role: "user", content: userMessage }],
      systemPrompt,
      (text) => {
        finalResponse = text
        setMessages(prev => {
          const newMessages = [...prev]
          newMessages[newMessages.length - 1] = { role: "assistant", content: text }
          return newMessages
        })
      },
      () => setIsProcessing(false),
      () => {
        setMessages(prev => {
          const newMessages = [...prev]
          newMessages[newMessages.length - 1] = { role: "assistant", content: "Task completed successfully. The coordinated agents have processed your request." }
          return newMessages
        })
        setIsProcessing(false)
      }
    )
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
              <div className="sticky top-0 z-10 flex w-full justify-end bg-gradient-to-b from-white via-white to-transparent dark:from-zinc-950 dark:via-zinc-950 px-6 pt-3 pb-2">
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

  const [responseContent, setResponseContent] = useState("")

  async function handleSubmit() {
    if (!input.trim() || isProcessing) return
    const userQuery = input.trim()
    setInput("")
    setPhase("routing")
    setIsProcessing(true)
    setAgents([])
    setResponseContent("")

    // Start routing
    await new Promise(r => setTimeout(r, 600))
    setAgents([{
      name: "Analysis Agent",
      description: "Query requires structured analysis and insights",
      toolName: "routeToAnalysis",
      status: "working",
      input: `{ "query": "${userQuery.slice(0, 30)}...", "type": "analysis" }`,
    }])

    // Complete the agent
    await new Promise(r => setTimeout(r, 1500))
    setAgents(prev => prev.map(a => ({
      ...a,
      status: "done" as const,
      output: "Analysis complete. Generating structured response."
    })))

    await new Promise(r => setTimeout(r, 400))
    setPhase("done")

    // Stream real AI response
    const systemPrompt = `You are an analysis agent. Provide a concise, structured analysis for the user's query.

Format your response with:
- A brief intro (1 sentence)
- "Pros:" section with 3 bullet points
- "Cons:" section with 2 bullet points

Keep each point to 1 short sentence. Be specific and actionable.`

    await streamChat(
      [{ role: "user", content: userQuery }],
      systemPrompt,
      (text) => setResponseContent(text),
      () => setIsProcessing(false),
      () => {
        setResponseContent("Analysis completed. Please try again for detailed insights.")
        setIsProcessing(false)
      }
    )
  }

  function reset() {
    setPhase("idle")
    setAgents([])
    setInput("")
    setIsProcessing(false)
    setRoutingExpanded(true)
    setResponseContent("")
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
              <div className="sticky top-0 z-10 flex w-full justify-end bg-gradient-to-b from-white via-white to-transparent dark:from-zinc-950 dark:via-zinc-950 px-6 pt-3 pb-2">
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
                    className="mt-6 text-[15px] leading-relaxed text-foreground whitespace-pre-wrap"
                  >
                    {responseContent || (
                      <div className="flex items-center gap-2">
                        <CircleSpinner size={14} className="text-muted-foreground" />
                        <span className="text-muted-foreground">Generating analysis...</span>
                      </div>
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
        <AIInput
          value={input}
          onValueChange={setInput}
          onSubmit={handleSubmit}
          isLoading={isProcessing}
        >
          <AIInputTextarea placeholder="Ask a question that will route to a sub-agent..." />
          <AIInputFooter className="justify-end">
            <AIInputAction>
              <button
                onClick={handleSubmit}
                disabled={!input.trim() || isProcessing}
                className="flex size-8 items-center justify-center rounded-full bg-foreground text-background transition-all hover:bg-foreground/90 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </AIInputAction>
          </AIInputFooter>
        </AIInput>
      </div>
    </div>
  )
}

/* ─── Agent Tool Approval ─── */

// ─── Types for Tool Approval ───
interface ToolRequest {
  id: string
  name: string
  description: string
  status: "pending" | "approved" | "rejected" | "executing" | "done"
  riskLevel: "low" | "medium" | "high"
  parameters: Record<string, string | number | boolean | string[]>
  confidence: number
  result?: { success: boolean; message: string }
}

interface ToolMessage {
  id: string
  role: "user" | "assistant" | "tool"
  content: string
  toolRequest?: ToolRequest
}

export function AgentToolApprovalPreview() {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<ToolMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [editingTool, setEditingTool] = useState<string | null>(null)
  const [editedParams, setEditedParams] = useState<Record<string, string | number | boolean | string[]>>({})
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const examplePrompts = [
    "Schedule a team meeting",
    "Send project update email",
    "Delete old user data",
  ]

  // Example tool scenarios
  const toolScenarios: Record<string, ToolRequest> = {
    calendar: {
      id: "tool_cal_1",
      name: "create_calendar_event",
      description: "Create a new calendar event",
      status: "pending",
      riskLevel: "low",
      parameters: {
        title: "Team Standup",
        date: "2026-03-31",
        time: "10:00 AM",
        attendees: ["team@company.com"]
      },
      confidence: 0.92
    },
    email: {
      id: "tool_email_1",
      name: "send_email",
      description: "Send an email message",
      status: "pending",
      riskLevel: "medium",
      parameters: {
        to: "client@example.com",
        subject: "Project Update",
        body: "Here's the latest update..."
      },
      confidence: 0.85
    },
    delete: {
      id: "tool_del_1",
      name: "delete_account_data",
      description: "Permanently delete user data",
      status: "pending",
      riskLevel: "high",
      parameters: {
        user_id: "usr_2kx8mJ9pL",
        include_backups: true,
        notify_user: true
      },
      confidence: 0.78
    }
  }

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Handle message submission
  const handleSubmit = async () => {
    if (!input.trim() || isLoading) return

    const userMessage = input.trim().toLowerCase()
    setInput("")

    const userMsg: ToolMessage = { id: `user-${Date.now()}`, role: "user", content: input.trim() }
    setMessages(prev => [...prev, userMsg])
    setIsLoading(true)

    await new Promise(r => setTimeout(r, 800))

    let toolKey: string | null = null
    if (userMessage.includes("meeting") || userMessage.includes("schedule") || userMessage.includes("calendar")) {
      toolKey = "calendar"
    } else if (userMessage.includes("email") || userMessage.includes("send") || userMessage.includes("message")) {
      toolKey = "email"
    } else if (userMessage.includes("delete") || userMessage.includes("remove") || userMessage.includes("clear")) {
      toolKey = "delete"
    }

    if (toolKey) {
      const tool = { ...toolScenarios[toolKey], id: `tool-${Date.now()}` }
      const assistantMsg: ToolMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: `I'll help you with that. I need your approval to execute the following action:`,
        toolRequest: tool
      }
      setMessages(prev => [...prev, assistantMsg])
    } else {
      const assistantMsg: ToolMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: "I can help you schedule meetings, send emails, or manage data. What would you like me to do?"
      }
      setMessages(prev => [...prev, assistantMsg])
    }

    setIsLoading(false)
  }

  // Handle tool approval
  const handleApprove = async (messageId: string) => {
    setMessages(prev => prev.map(m => {
      if (m.id === messageId && m.toolRequest) {
        return { ...m, toolRequest: { ...m.toolRequest, status: "executing" as const } }
      }
      return m
    }))

    await new Promise(r => setTimeout(r, 1500))

    setMessages(prev => prev.map(m => {
      if (m.id === messageId && m.toolRequest) {
        return {
          ...m,
          toolRequest: {
            ...m.toolRequest,
            status: "done" as const,
            result: { success: true, message: "Action completed successfully" }
          }
        }
      }
      return m
    }))
  }

  // Handle tool rejection
  const handleReject = (messageId: string) => {
    setMessages(prev => prev.map(m => {
      if (m.id === messageId && m.toolRequest) {
        return {
          ...m,
          toolRequest: {
            ...m.toolRequest,
            status: "rejected" as const,
            result: { success: false, message: "Action was cancelled" }
          }
        }
      }
      return m
    }))
  }

  // Handle edit mode
  const handleStartEdit = (toolId: string, params: Record<string, string | number | boolean | string[]>) => {
    setEditingTool(toolId)
    setEditedParams({ ...params })
  }

  const handleSaveEdit = (messageId: string) => {
    setMessages(prev => prev.map(m => {
      if (m.id === messageId && m.toolRequest) {
        return { ...m, toolRequest: { ...m.toolRequest, parameters: editedParams } }
      }
      return m
    }))
    setEditingTool(null)
    setEditedParams({})
  }

  const handleCancelEdit = () => {
    setEditingTool(null)
    setEditedParams({})
  }

  // Reset demo
  const handleReset = () => {
    setMessages([])
    setInput("")
    setEditingTool(null)
    setEditedParams({})
  }

  // Risk badge styles
  const getRiskStyles = (risk: "low" | "medium" | "high") => {
    switch (risk) {
      case "low": return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
      case "medium": return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
      case "high": return "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20"
    }
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
              <h1 className="mb-2 text-2xl font-medium text-foreground">Tool Approval Flow</h1>
              <p className="mb-6 text-sm text-muted-foreground text-center max-w-md">
                AI requests permission before executing actions. Review parameters, edit if needed, then approve or reject.
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
              <div className="sticky top-0 z-10 flex w-full justify-end bg-gradient-to-b from-white via-white to-transparent dark:from-zinc-950 dark:via-zinc-950 px-6 pt-3 pb-2">
                <button
                  onClick={handleReset}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Clear
                </button>
              </div>

              {/* Messages */}
              <div className="flex flex-col gap-4 px-6 pb-4">
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
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

                    {/* Assistant message */}
                    {msg.role === "assistant" && (
                      <div className="flex flex-col gap-3">
                        <p className="text-[15px] leading-relaxed text-foreground">{msg.content}</p>

                        {/* Tool Request Card */}
                        {msg.toolRequest && (
                          <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className={`overflow-hidden rounded-xl border ${getRiskStyles(msg.toolRequest.riskLevel).split(" ")[2]} bg-card shadow-sm`}
                          >
                            {/* Tool Header */}
                            <div className="border-b border-border/50 px-4 py-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                  <div className={`size-7 rounded-lg ${getRiskStyles(msg.toolRequest.riskLevel).split(" ")[0]} flex items-center justify-center`}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={getRiskStyles(msg.toolRequest.riskLevel).split(" ")[1]}>
                                      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                                    </svg>
                                  </div>
                                  <div>
                                    <code className="text-sm font-semibold text-foreground">{msg.toolRequest.name}</code>
                                    <p className="text-[11px] text-muted-foreground">{msg.toolRequest.description}</p>
                                  </div>
                                </div>
                                <span className={`rounded-full border px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide ${getRiskStyles(msg.toolRequest.riskLevel)}`}>
                                  {msg.toolRequest.riskLevel}
                                </span>
                              </div>
                            </div>

                            {/* Tool Parameters */}
                            <div className="px-4 py-3 bg-muted/20">
                              {editingTool === msg.toolRequest.id ? (
                                <div className="space-y-2">
                                  {Object.entries(editedParams).map(([key, value]) => (
                                    <div key={key} className="flex items-center gap-3">
                                      <span className="text-xs text-muted-foreground w-24 shrink-0 font-medium">{key}</span>
                                      <input
                                        type="text"
                                        value={Array.isArray(value) ? value.join(", ") : String(value)}
                                        onChange={(e) => setEditedParams(prev => ({ ...prev, [key]: e.target.value }))}
                                        className="flex-1 rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground outline-none focus:border-foreground/30 transition-colors"
                                      />
                                    </div>
                                  ))}
                                  <div className="flex gap-2 pt-2">
                                    <button
                                      onClick={() => handleSaveEdit(msg.id)}
                                      className="flex-1 rounded-lg bg-foreground py-2 text-xs font-medium text-background transition-colors hover:bg-foreground/90"
                                    >
                                      Save Changes
                                    </button>
                                    <button
                                      onClick={handleCancelEdit}
                                      className="flex-1 rounded-lg border border-border py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className="space-y-1.5">
                                  {Object.entries(msg.toolRequest.parameters).map(([key, value]) => (
                                    <div key={key} className="flex items-start gap-3">
                                      <span className="text-xs text-muted-foreground w-24 shrink-0 font-medium">{key}</span>
                                      <span className="text-xs text-foreground">
                                        {Array.isArray(value) ? value.join(", ") : String(value)}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Confidence */}
                            {msg.toolRequest.status === "pending" && !editingTool && (
                              <div className="border-t border-border/50 px-4 py-2.5 bg-muted/10">
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] text-muted-foreground font-medium">Confidence</span>
                                  <div className="flex items-center gap-2">
                                    <div className="h-1.5 w-20 rounded-full bg-muted overflow-hidden">
                                      <motion.div
                                        className="h-full bg-foreground/60 rounded-full"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${msg.toolRequest.confidence * 100}%` }}
                                        transition={{ duration: 0.5 }}
                                      />
                                    </div>
                                    <span className="text-[11px] text-muted-foreground font-medium">{Math.round(msg.toolRequest.confidence * 100)}%</span>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Actions */}
                            {msg.toolRequest.status === "pending" && !editingTool && (
                              <div className="flex gap-2 border-t border-border/50 p-3 bg-muted/5">
                                <motion.button
                                  onClick={() => handleApprove(msg.id)}
                                  whileHover={{ scale: 1.01 }}
                                  whileTap={{ scale: 0.99 }}
                                  className="flex-1 rounded-xl bg-emerald-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
                                >
                                  Approve
                                </motion.button>
                                <motion.button
                                  onClick={() => handleStartEdit(msg.toolRequest!.id, msg.toolRequest!.parameters)}
                                  whileHover={{ scale: 1.01 }}
                                  whileTap={{ scale: 0.99 }}
                                  className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                                >
                                  Edit
                                </motion.button>
                                <motion.button
                                  onClick={() => handleReject(msg.id)}
                                  whileHover={{ scale: 1.01 }}
                                  whileTap={{ scale: 0.99 }}
                                  className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 transition-colors hover:bg-red-500/20"
                                >
                                  Reject
                                </motion.button>
                              </div>
                            )}

                            {/* Executing State */}
                            {msg.toolRequest.status === "executing" && (
                              <div className="border-t border-border/50 p-4">
                                <div className="flex items-center gap-3">
                                  <CircleSpinner size={16} className="text-foreground" />
                                  <span className="text-sm text-muted-foreground">Executing action...</span>
                                </div>
                                <div className="mt-3 h-1.5 rounded-full bg-muted overflow-hidden">
                                  <motion.div
                                    className="h-full bg-foreground"
                                    initial={{ width: "0%" }}
                                    animate={{ width: "100%" }}
                                    transition={{ duration: 1.5, ease: "easeInOut" }}
                                  />
                                </div>
                              </div>
                            )}

                            {/* Result State */}
                            {msg.toolRequest.status === "done" && msg.toolRequest.result && (
                              <div className={`border-t p-4 ${msg.toolRequest.result.success ? "border-emerald-500/20 bg-emerald-500/5" : "border-border/50 bg-muted/20"}`}>
                                <div className="flex items-center gap-3">
                                  {msg.toolRequest.result.success ? (
                                    <motion.div
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      className="size-6 rounded-full bg-emerald-500/20 flex items-center justify-center"
                                    >
                                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-emerald-500">
                                        <polyline points="20 6 9 17 4 12" />
                                      </svg>
                                    </motion.div>
                                  ) : (
                                    <div className="size-6 rounded-full bg-muted flex items-center justify-center">
                                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground">
                                        <line x1="18" y1="6" x2="6" y2="18" />
                                        <line x1="6" y1="6" x2="18" y2="18" />
                                      </svg>
                                    </div>
                                  )}
                                  <span className={`text-sm ${msg.toolRequest.result.success ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}`}>
                                    {msg.toolRequest.result.message}
                                  </span>
                                </div>
                              </div>
                            )}

                            {/* Rejected State */}
                            {msg.toolRequest.status === "rejected" && (
                              <div className="border-t border-border/50 bg-muted/20 p-4">
                                <div className="flex items-center gap-3">
                                  <div className="size-6 rounded-full bg-muted flex items-center justify-center">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground">
                                      <line x1="18" y1="6" x2="6" y2="18" />
                                      <line x1="6" y1="6" x2="18" y2="18" />
                                    </svg>
                                  </div>
                                  <span className="text-sm text-muted-foreground">Action cancelled by user</span>
                                </div>
                              </div>
                            )}
                          </motion.div>
                        )}
                      </div>
                    )}
                  </motion.div>
                ))}

                {/* Loading indicator */}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-2 py-2"
                  >
                    <CircleSpinner size={16} className="text-muted-foreground" />
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input */}
      <div className="shrink-0 px-4 pb-4">
        <div
          className="rounded-3xl border border-border bg-popover p-1 shadow-sm"
          onClick={() => document.getElementById("tool-approval-input")?.focus()}
        >
          <textarea
            id="tool-approval-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSubmit()
              }
            }}
            placeholder="Try scheduling a meeting, sending an email, or deleting data..."
            disabled={isLoading}
            className="w-full resize-none bg-transparent px-4 py-3 text-[15px] text-foreground placeholder:text-muted-foreground/70 focus:outline-none disabled:opacity-50"
            rows={1}
          />
          <div className="flex items-center justify-between px-3 pb-2">
            <span className="text-[10px] text-muted-foreground">AI will request approval before actions</span>
            <button
              onClick={handleSubmit}
              disabled={!input.trim() || isLoading}
              className="flex size-8 items-center justify-center rounded-full bg-foreground text-background transition-opacity disabled:opacity-30"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m5 12 7-7 7 7M12 19V5" />
              </svg>
            </button>
          </div>
        </div>
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

// Task status type
type TaskStatus = "pending" | "running" | "completed"

// Message types for the context builder
interface CopilotMessage {
  id: string
  type: "text" | "task" | "file" | "tasks-list" | "working" | "context-question" | "context-gathering" | "context-files" | "context-summary"
  content?: string
  taskNumber?: number
  totalTasks?: number
  taskLabel?: string
  filename?: string
  additions?: number
  deletions?: number
  tasks?: Array<{ label: string; status: TaskStatus; isNew?: boolean }>
  options?: string[]
  items?: Array<{ label: string; status: TaskStatus }>
  files?: string[]
  summary?: { project: string; focus: string; files: number; ready: boolean }
}

// Check circle icon
function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <polyline points="9 12 12 15 16 10" />
    </svg>
  )
}

// Empty circle icon
function CircleOutlineIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
    </svg>
  )
}

// File change component
function FileChange({ filename, additions, deletions }: { filename: string; additions: number; deletions: number }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-3 py-2">
      <span className="font-mono text-xs text-foreground">{filename}</span>
      <div className="flex items-center gap-2 text-xs">
        <span className="text-emerald-500">+{additions}</span>
        <span className="text-rose-500">-{deletions}</span>
        <button className="rounded border border-border bg-card px-1.5 py-0.5 text-[10px] text-muted-foreground hover:bg-muted">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="9" y="9" width="13" height="13" rx="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
        </button>
        <button className="rounded border border-border bg-card px-1.5 py-0.5 text-[10px] text-muted-foreground hover:bg-muted">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  )
}

// Task progress component
function TaskProgress({ taskNumber, totalTasks, taskLabel }: { taskNumber: number; totalTasks: number; taskLabel: string }) {
  return (
    <div className="rounded-lg border border-border bg-muted/30 px-3 py-2">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          Task {taskNumber} of {totalTasks} Complete
        </span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M3 9h18" />
        </svg>
      </div>
      <div className="mt-1.5 flex items-center gap-2">
        <CheckCircleIcon className="size-4 text-emerald-500" />
        <span className="text-xs text-foreground">{taskLabel}</span>
      </div>
    </div>
  )
}

// Tasks list component
function TasksList({ tasks }: { tasks: Array<{ label: string; status: TaskStatus; isNew?: boolean }> }) {
  return (
    <div className="rounded-lg border border-border bg-muted/30 px-3 py-2">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Tasks Updated</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M3 9h18" />
        </svg>
      </div>
      <div className="mt-2 space-y-1.5">
        {tasks.map((task, i) => (
          <div key={i} className="flex items-center gap-2">
            {task.status === "completed" ? (
              <CheckCircleIcon className="size-3.5 text-emerald-500" />
            ) : (
              <CircleOutlineIcon className="size-3.5 text-muted-foreground" />
            )}
            <span className={`text-xs ${task.status === "completed" ? "text-muted-foreground" : "text-foreground"}`}>
              {task.label}
            </span>
            {task.isNew && (
              <span className="rounded bg-blue-500/20 px-1 py-0.5 text-[9px] font-medium text-blue-500">NEW</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// Working indicator
function WorkingIndicator() {
  return (
    <div className="flex items-center gap-2">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="size-4 rounded-full border-2 border-blue-500 border-t-transparent"
      />
      <span className="text-xs text-muted-foreground">Working...</span>
    </div>
  )
}

// Files updated summary
function FilesUpdated({ count }: { count: number }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-3 py-2">
      <div className="flex items-center gap-2">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground">
          <polyline points="9 18 15 12 9 6" />
        </svg>
        <span className="text-xs text-muted-foreground">{count} files updated</span>
      </div>
      <div className="flex items-center gap-1">
        <button className="rounded bg-emerald-500 px-2 py-0.5 text-[10px] font-medium text-white">Keep</button>
        <button className="rounded border border-border bg-card px-2 py-0.5 text-[10px] text-muted-foreground">Undo</button>
      </div>
    </div>
  )
}


interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
}

export function AgenticContextBuilderPreview() {
  const [buildStatus, setBuildStatus] = useState<"building" | "approved">("building")
  const [context, setContext] = useState<Record<string, string>>({})
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "system-1",
      role: "assistant",
      content: "Hi! I'm here to help you create something. What would you like me to help you create today?"
    }
  ])
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const contextFields = ["goal", "audience", "tone"]
  const filledCount = Object.keys(context).length

  // Stream response from AI
  const streamResponse = useCallback(async (userMessage: string, allMessages: ChatMessage[], currentContext: Record<string, string>) => {
    setIsLoading(true)

    const systemPrompt = `You are an AI context builder. Your job is to gather information before generating content.

RULES:
1. Ask ONE question at a time to gather context
2. Questions should be about: goal (what to create), audience (who it's for), tone (how it should sound)
3. After getting 3 answers, generate the requested content
4. Keep questions short and friendly
5. Keep generated content concise (2-3 sentences max)

Current context gathered: ${JSON.stringify(currentContext)}
Questions asked: ${Object.keys(currentContext).length}

If you have received 3 answers, generate the content. Otherwise, ask the next logical question.`

    try {
      const response = await fetch("/api/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: allMessages.map(m => ({ role: m.role, content: m.content })),
          system: systemPrompt
        })
      })

      if (!response.ok) throw new Error("Failed to fetch")

      const reader = response.body?.getReader()
      if (!reader) throw new Error("No reader")

      const assistantId = `assistant-${Date.now()}`
      let assistantContent = ""

      // Add empty assistant message
      setMessages(prev => [...prev, { id: assistantId, role: "assistant", content: "" }])

      const decoder = new TextDecoder()
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const text = decoder.decode(value)
        assistantContent += text

        setMessages(prev =>
          prev.map(m => m.id === assistantId ? { ...m, content: assistantContent } : m)
        )
      }

      // Check if content was generated
      const lower = assistantContent.toLowerCase()
      if (lower.includes("generated") || lower.includes("here's") || lower.includes("here is") || Object.keys(currentContext).length >= 3) {
        setBuildStatus("approved")
      }
    } catch (error) {
      console.error("Stream error:", error)
      setMessages(prev => [...prev, {
        id: `error-${Date.now()}`,
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again."
      }])
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Handle form submission
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput("")

    // Track context based on message count
    const userMsgCount = messages.filter(m => m.role === "user").length
    let newContext = { ...context }
    if (userMsgCount === 0) {
      newContext = { ...newContext, goal: userMessage }
    } else if (userMsgCount === 1) {
      newContext = { ...newContext, audience: userMessage }
    } else if (userMsgCount === 2) {
      newContext = { ...newContext, tone: userMessage }
    }
    setContext(newContext)

    // Add user message
    const userMsg: ChatMessage = { id: `user-${Date.now()}`, role: "user", content: userMessage }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)

    // Stream AI response
    await streamResponse(userMessage, newMessages, newContext)
  }

  // Reset
  const handleReset = () => {
    setBuildStatus("building")
    setContext({})
    setInput("")
    setMessages([
      {
        id: "system-1",
        role: "assistant",
        content: "Hi! I'm here to help you create something. What would you like me to help you create today?"
      }
    ])
  }

  // Auto-focus input
  useEffect(() => {
    inputRef.current?.focus()
  }, [messages])

  return (
    <div className="mx-auto flex h-[600px] w-full flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900">
      {/* Window Header */}
      <div className="flex items-center gap-2 px-5 py-3.5 border-b border-neutral-200 dark:border-neutral-800">
        <div className="size-2.5 rounded-full bg-neutral-300 dark:bg-neutral-700" />
        <div className="size-2.5 rounded-full bg-neutral-300 dark:bg-neutral-700" />
        <div className="size-2.5 rounded-full bg-neutral-300 dark:bg-neutral-700" />
        <span className="ml-3 text-xs text-neutral-500 dark:text-neutral-400">Agentic Context Builder</span>
        <div className="ml-auto flex items-center gap-2">
          {isLoading && (
            <span className="flex items-center gap-1.5 text-[10px] text-neutral-500 dark:text-neutral-400">
              <span className="flex gap-0.5">
                <span className="size-1 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="size-1 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="size-1 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "300ms" }} />
              </span>
              AI thinking...
            </span>
          )}
          {!isLoading && buildStatus === "building" && (
            <span className="flex items-center gap-1.5 text-[10px] text-neutral-400">
              <span className="size-1.5 rounded-full bg-emerald-400" />
              Live AI
            </span>
          )}
          {buildStatus === "approved" && (
            <span className="flex items-center gap-1.5 text-[10px] text-emerald-600 dark:text-emerald-400">
              <svg className="size-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M20 6L9 17l-5-5" />
              </svg>
              Complete
            </span>
          )}
        </div>
      </div>

      {/* Two Panel Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Context Status */}
        <div className="w-[30%] border-r border-neutral-200 dark:border-neutral-800 flex flex-col">
          <div className="px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center gap-2">
              <Image src="/logo/logo.png" alt="agent" width={16} height={16} className="size-4" />
              <span className="text-xs font-medium text-neutral-900 dark:text-neutral-100">Context</span>
            </div>
          </div>

          <div className="flex-1 px-4 py-3 space-y-3 overflow-y-auto">
            {contextFields.map((field) => (
              <div key={field} className="space-y-1">
                <span className="text-[10px] text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">{field}</span>
                <p className={`text-sm ${context[field] ? "text-neutral-900 dark:text-neutral-100" : "text-neutral-300 dark:text-neutral-600"}`}>
                  {context[field] || "Waiting..."}
                </p>
              </div>
            ))}
          </div>

          {/* Context Progress */}
          <div className="px-4 py-3 border-t border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-neutral-500 dark:text-neutral-400">Progress</span>
              <span className="text-xs text-neutral-500 dark:text-neutral-400">{filledCount}/{contextFields.length}</span>
            </div>
            <div className="flex gap-1">
              {contextFields.map((field, i) => (
                <div
                  key={i}
                  className={`h-1.5 flex-1 rounded-full transition-colors ${context[field] ? "bg-emerald-400" : "bg-neutral-200 dark:bg-neutral-700"}`}
                />
              ))}
            </div>
            {buildStatus === "approved" && (
              <button
                onClick={handleReset}
                className="mt-3 w-full rounded-lg border border-neutral-200 dark:border-neutral-700 py-1.5 text-xs text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                Start over
              </button>
            )}
          </div>
        </div>

        {/* Right: Chat */}
        <div className="flex-1 flex flex-col">
          <div className="px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
            <span className="text-xs font-medium text-neutral-900 dark:text-neutral-100">Conversation</span>
          </div>

          <div className="flex-1 px-4 py-3 overflow-y-auto space-y-3">
            <AnimatePresence mode="popLayout">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.role === "user" ? "justify-end" : "gap-2"}`}
                >
                  {message.role === "assistant" && (
                    <div className="size-5 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0 mt-0.5">
                      <Image src="/logo/logo.png" alt="ai" width={12} height={12} className="size-3" />
                    </div>
                  )}
                  <div className={`rounded-xl px-3 py-2 max-w-[85%] ${
                    message.role === "user"
                      ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900"
                      : "bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-2"
                >
                  <div className="size-5 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0 mt-0.5">
                    <Image src="/logo/logo.png" alt="ai" width={12} height={12} className="size-3" />
                  </div>
                  <div className="bg-neutral-100 dark:bg-neutral-800 rounded-xl px-3 py-2">
                    <span className="flex gap-1">
                      <span className="size-1.5 rounded-full bg-neutral-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="size-1.5 rounded-full bg-neutral-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="size-1.5 rounded-full bg-neutral-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Real Input */}
          <form onSubmit={onSubmit} className="px-4 py-3 border-t border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center gap-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2.5 focus-within:border-neutral-400 dark:focus-within:border-neutral-500 transition-colors">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={buildStatus === "approved" ? "Conversation complete" : "Type your response..."}
                disabled={buildStatus === "approved" || isLoading}
                className="flex-1 bg-transparent text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 outline-none disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!input.trim() || buildStatus === "approved" || isLoading}
                className={`size-7 rounded-lg flex items-center justify-center transition-colors ${
                  input.trim() && buildStatus !== "approved" && !isLoading
                    ? "bg-neutral-900 dark:bg-white"
                    : "bg-neutral-100 dark:bg-neutral-700"
                }`}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  className={input.trim() && buildStatus !== "approved" && !isLoading ? "text-white dark:text-neutral-900" : "text-neutral-400"}
                >
                  <path d="m5 12 7-7 7 7M12 19V5" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
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
              <div className="sticky top-0 z-10 flex w-full justify-end bg-gradient-to-b from-white via-white to-transparent dark:from-zinc-950 dark:via-zinc-950 px-6 pt-3 pb-2">
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
        <AIInput
          value={input}
          onValueChange={setInput}
          onSubmit={handleSubmit}
          isLoading={isProcessing}
          disabled={phase !== "idle"}
        >
          <AIInputTextarea placeholder="Ask something that requires choices..." />
          <AIInputFooter className="justify-end">
            <AIInputAction>
              <button
                onClick={handleSubmit}
                disabled={!input.trim() || isProcessing || phase !== "idle"}
                className="flex size-8 items-center justify-center rounded-full bg-foreground text-background transition-all hover:bg-foreground/90 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </AIInputAction>
          </AIInputFooter>
        </AIInput>
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
              <div className="sticky top-0 z-10 flex w-full justify-end bg-gradient-to-b from-white via-white to-transparent dark:from-zinc-950 dark:via-zinc-950 px-6 pt-3 pb-2">
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
        <AIInput
          value={input}
          onValueChange={setInput}
          onSubmit={handleSubmit}
          isLoading={isProcessing}
          disabled={phase !== "idle"}
        >
          <AIInputTextarea placeholder="Ask something that needs detailed input..." />
          <AIInputFooter className="justify-end">
            <AIInputAction>
              <button
                onClick={handleSubmit}
                disabled={!input.trim() || isProcessing || phase !== "idle"}
                className="flex size-8 items-center justify-center rounded-full bg-foreground text-background transition-all hover:bg-foreground/90 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </AIInputAction>
          </AIInputFooter>
        </AIInput>
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
              ? "bg-foreground text-background"
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
