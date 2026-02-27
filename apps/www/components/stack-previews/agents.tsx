"use client"

import { useEffect, useState } from "react"

/* ─── Routing Pattern ─── */
export function RoutingPatternPreview() {
  const [activeRoute, setActiveRoute] = useState<string | null>(null)

  const routes = [
    { input: "Write a poem about rain", agent: "Creative Writer", color: "foreground" },
    { input: "Translate to Spanish", agent: "Translator", color: "foreground" },
    { input: "Fix this bug in my code", agent: "Code Assistant", color: "foreground" },
    { input: "Summarize this article", agent: "Summarizer", color: "foreground" },
  ]

  useEffect(() => {
    let i = 0
    const timer = setInterval(() => {
      setActiveRoute(routes[i % routes.length].agent)
      i++
    }, 1500)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="mx-auto w-full max-w-lg p-8">
      <div className="mb-6 text-center">
        <span className="text-xs font-medium text-muted-foreground">
          Request Router
        </span>
      </div>

      <div className="flex items-start justify-between gap-8">
        {/* Input */}
        <div className="w-40 space-y-2">
          <span className="text-[12px] font-medium uppercase tracking-wider text-muted-foreground">
            Incoming
          </span>
          {routes.map((route) => (
            <div
              key={route.agent}
              className={`rounded-md border px-3 py-2 text-xs transition-all ${
                activeRoute === route.agent
                  ? "border-foreground/20 bg-foreground/[0.03] text-foreground"
                  : "border-border/50 text-muted-foreground"
              }`}
            >
              {route.input}
            </div>
          ))}
        </div>

        {/* Router */}
        <div className="flex flex-col items-center gap-2 pt-12">
          <div className="h-px w-12 bg-border/40" />
          <div className="rounded-md border border-border/60 px-3 py-1.5 text-[12px] font-medium text-muted-foreground">
            Router
          </div>
          <div className="h-px w-12 bg-border/40" />
        </div>

        {/* Agents */}
        <div className="w-36 space-y-2">
          <span className="text-[12px] font-medium uppercase tracking-wider text-muted-foreground">
            Agents
          </span>
          {routes.map((route) => (
            <div
              key={route.agent}
              className={`rounded-md border px-3 py-2 text-xs transition-all ${
                activeRoute === route.agent
                  ? "border-foreground/20 bg-foreground/[0.03] font-medium text-foreground"
                  : "border-border/50 text-muted-foreground"
              }`}
            >
              {route.agent}
            </div>
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

  return (
    <div className="mx-auto w-full max-w-lg p-8">
      <div className="mb-6">
        <span className="text-xs font-medium text-foreground">
          Parallel Agent Execution
        </span>
        <p className="mt-1 text-[13px] text-muted-foreground">
          Processing document across 3 agents simultaneously
        </p>
      </div>

      <div className="space-y-4">
        {tasks.map((task, i) => {
          const pct = Math.round(progress[i])
          const done = pct >= task.target
          return (
            <div key={task.name} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-foreground">
                  {task.name}
                </span>
                <span className="text-[12px] tabular-nums text-muted-foreground">
                  {done ? "Complete" : `${pct}%`}
                </span>
              </div>
              <div className="h-1 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-foreground/60 transition-all duration-200"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>

      {progress.every((p, i) => p >= tasks[i].target) && (
        <div className="mt-6 rounded-md border border-border/60 bg-muted/50 p-4">
          <p className="text-[12px] font-medium uppercase tracking-wider text-muted-foreground">
            Combined Result
          </p>
          <div className="mt-2 space-y-1 text-xs text-muted-foreground">
            <p>Sentiment: Positive (0.87)</p>
            <p>Entities: 4 organizations, 2 people, 3 locations</p>
            <p>Topics: Technology, AI Research, Machine Learning</p>
          </div>
        </div>
      )}
    </div>
  )
}

/* ─── Human in the Loop ─── */
export function HumanInTheLoopPreview() {
  const [approved, setApproved] = useState<boolean | null>(null)

  return (
    <div className="mx-auto w-full max-w-lg space-y-4 p-8">
      <div className="space-y-3">
        <div className="rounded-md border border-border/60 bg-muted/50 p-4">
          <p className="text-[12px] font-medium uppercase tracking-wider text-muted-foreground">
            Agent Request
          </p>
          <p className="mt-2 text-sm text-foreground">
            The agent wants to execute the following action:
          </p>
          <div className="mt-3 rounded-md bg-muted/50 p-3">
            <code className="text-xs text-foreground">
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
        </div>

        {approved === null ? (
          <div className="flex gap-2">
            <button
              onClick={() => setApproved(true)}
              className="h-8 flex-1 rounded-md bg-foreground text-xs font-medium text-background"
            >
              Approve & Execute
            </button>
            <button
              onClick={() => setApproved(false)}
              className="h-8 flex-1 rounded-md border border-border/60 text-xs font-medium text-muted-foreground"
            >
              Reject
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between rounded-md border border-border/60 p-3">
            <div className="flex items-center gap-2 text-xs">
              {approved ? (
                <>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span className="text-foreground">Action approved and executed</span>
                </>
              ) : (
                <>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                  <span className="text-muted-foreground">Action rejected</span>
                </>
              )}
            </div>
            <button
              onClick={() => setApproved(null)}
              className="text-[12px] text-muted-foreground hover:text-muted-foreground"
            >
              Reset
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

/* ─── URL Analysis Workflow ─── */
export function URLAnalysisPreview() {
  const [url, setUrl] = useState("")
  const [step, setStep] = useState(-1)

  const steps = [
    { name: "Fetching page", detail: "Downloading HTML content" },
    { name: "Extracting text", detail: "Parsing DOM structure" },
    { name: "Analyzing content", detail: "Running AI analysis" },
    { name: "Generating summary", detail: "Creating structured output" },
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
    }, 1000)
  }

  return (
    <div className="mx-auto w-full max-w-lg space-y-4 p-8">
      <div className="flex gap-2">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com/article"
          className="h-9 flex-1 rounded-md border border-border/60 bg-transparent px-3 text-sm outline-none placeholder:text-muted-foreground focus:border-foreground/20"
        />
        <button
          onClick={handleAnalyze}
          className="h-9 rounded-md bg-foreground px-4 text-xs font-medium text-background"
        >
          Analyze
        </button>
      </div>

      {step >= 0 && (
        <div className="space-y-1">
          {steps.map((s, i) => (
            <div
              key={s.name}
              className={`flex items-center gap-3 rounded-md px-3 py-2 transition-opacity ${
                i <= step ? "opacity-100" : "opacity-30"
              }`}
            >
              <div className="flex size-4 shrink-0 items-center justify-center">
                {i < step ? (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-foreground/50">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : i === step ? (
                  <div className="size-3 animate-spin rounded-full border border-foreground/20 border-t-foreground" />
                ) : (
                  <div className="size-2 rounded-full bg-border" />
                )}
              </div>
              <div>
                <p className="text-xs font-medium text-foreground">{s.name}</p>
                <p className="text-[12px] text-muted-foreground">{s.detail}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {step >= steps.length - 1 && (
        <div className="rounded-md border border-border/60 bg-muted/50 p-4">
          <p className="text-[12px] font-medium uppercase tracking-wider text-muted-foreground">
            Analysis Result
          </p>
          <div className="mt-2 space-y-2 text-xs text-muted-foreground">
            <p><span className="font-medium text-foreground">Title:</span> Example Article</p>
            <p><span className="font-medium text-foreground">Word Count:</span> 1,247</p>
            <p><span className="font-medium text-foreground">Reading Time:</span> 5 min</p>
            <p><span className="font-medium text-foreground">Summary:</span> This article covers the fundamentals of modern web development practices and emerging trends in the industry.</p>
          </div>
        </div>
      )}
    </div>
  )
}
