"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { cn } from "@/lib/utils"
import { SuggestionPills } from "./shared"

/* ══════════════════════════════════════════
   Rich Output Previews
   ══════════════════════════════════════════ */

/* ─── JSON → shadcn Render ─── */
export function JSONRenderShadcnPreview() {
  return (
    <div className="mx-auto w-full max-w-lg p-8">
      <div className="mb-4">
        <span className="text-sm font-medium text-foreground">JSON → shadcn/ui</span>
        <p className="mt-1 text-sm text-muted-foreground">Render structured data as UI components</p>
      </div>
      <div className="space-y-3">
        <div className="rounded-md border border-border bg-card p-3 font-mono text-sm text-muted-foreground">
          {`{ "type": "card", "title": "Revenue", "value": "$12,450" }`}
        </div>
        <div className="flex items-center justify-center py-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground/70">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
        <div className="rounded-lg border border-border shadow-sm p-4">
          <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Revenue</p>
          <p className="mt-1 text-2xl font-bold text-foreground">$12,450</p>
          <p className="mt-0.5 text-sm text-muted-foreground">+12.5% from last month</p>
        </div>
      </div>
    </div>
  )
}

/* ─── JSON → Generate Code ─── */
export function JSONRenderGeneratePreview() {
  const [mode, setMode] = useState<"json" | "code">("json")

  return (
    <div className="mx-auto w-full max-w-lg p-8">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">JSON → Code Generator</span>
        <div className="flex gap-1 rounded-md border border-border p-0.5">
          {(["json", "code"] as const).map((m) => (
            <button key={m} onClick={() => setMode(m)} className={`rounded px-2.5 py-1 text-sm font-medium capitalize ${mode === m ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>
              {m}
            </button>
          ))}
        </div>
      </div>
      <div className="rounded-md border border-border bg-card p-4 font-mono text-sm">
        {mode === "json" ? (
          <pre className="text-muted-foreground">{`{
  "component": "UserCard",
  "props": {
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": "/avatars/john.jpg"
  }
}`}</pre>
        ) : (
          <pre className="text-foreground">{`export function UserCard() {
  return (
    <div className="flex items-center gap-3">
      <Avatar src="/avatars/john.jpg" />
      <div>
        <p className="font-medium">John Doe</p>
        <p className="text-sm text-muted">john@example.com</p>
      </div>
    </div>
  )
}`}</pre>
        )}
      </div>
    </div>
  )
}

/* ─── JSON → PDF ─── */
export function JSONRenderPDFPreview() {
  return (
    <div className="mx-auto w-full max-w-lg p-8">
      <div className="mb-4">
        <span className="text-sm font-medium text-foreground">JSON → PDF Export</span>
      </div>
      <div className="rounded-md border border-border bg-card p-6">
        <div className="border-b border-border pb-3">
          <p className="text-sm font-bold text-foreground">Invoice #2024-001</p>
          <p className="text-sm text-muted-foreground">December 15, 2024</p>
        </div>
        <div className="mt-3 space-y-2">
          {[
            { item: "Pro Subscription", qty: 1, price: "$49" },
            { item: "Extra Seats", qty: 3, price: "$30" },
          ].map((row) => (
            <div key={row.item} className="flex justify-between text-sm text-muted-foreground">
              <span>{row.item} x{row.qty}</span>
              <span>{row.price}</span>
            </div>
          ))}
          <div className="flex justify-between border-t border-border pt-2 text-sm font-medium text-foreground">
            <span>Total</span>
            <span>$79.00</span>
          </div>
        </div>
      </div>
      <div className="mt-3 flex justify-end">
        <div className="rounded-md bg-foreground px-3 py-1.5 text-sm font-medium text-background">
          Export PDF
        </div>
      </div>
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
    <div className="mx-auto w-full max-w-lg p-8">
      <div className="mb-4">
        <span className="text-sm font-medium text-foreground">JSON → Remotion Video</span>
      </div>
      <div className="overflow-hidden rounded-md border border-border">
        <div className="flex aspect-video items-center justify-center bg-muted/30">
          <div className="text-center" style={{ opacity: Math.min(1, frame / 15) }}>
            <p className="text-lg font-bold text-foreground">Welcome</p>
            <p className="mt-1 text-sm text-muted-foreground" style={{ opacity: Math.min(1, Math.max(0, (frame - 20) / 15)) }}>
              AI-generated video from structured data
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 border-t border-border px-3 py-2">
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-foreground/40 transition-all" style={{ width: `${(frame / 60) * 100}%` }} />
          </div>
          <span className="font-mono text-sm text-muted-foreground">
            {Math.floor(frame / 30)}:{String(frame % 30).padStart(2, "0")}
          </span>
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════
   Connectors Previews
   ══════════════════════════════════════════ */

/* ─── Web Preview Sandbox ─── */
export function WebPreviewSandboxPreview() {
  return (
    <div className="mx-auto w-full max-w-lg p-8">
      <div className="overflow-hidden rounded-md border border-border">
        <div className="flex items-center gap-2 border-b border-border bg-muted/50 px-3 py-2">
          <div className="flex gap-1">
            <div className="size-2.5 rounded-full bg-red-400/60" />
            <div className="size-2.5 rounded-full bg-yellow-400/60" />
            <div className="size-2.5 rounded-full bg-green-400/60" />
          </div>
          <div className="flex-1 rounded bg-card px-2 py-0.5 text-center text-sm text-muted-foreground">
            localhost:3000
          </div>
        </div>
        <div className="flex aspect-[16/10] items-center justify-center bg-card">
          <div className="text-center">
            <p className="text-sm font-medium text-foreground">Live Preview</p>
            <p className="mt-1 text-sm text-muted-foreground">Sandboxed web preview of generated code</p>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Exa Web Search v2 ─── */
export function ExaWebSearch2Preview() {
  return (
    <div className="mx-auto w-full max-w-lg p-8">
      <div className="mb-4">
        <span className="text-sm font-medium text-foreground">Exa Neural Search v2</span>
      </div>
      <div className="mb-4 flex h-9 items-center rounded-md border border-border px-3">
        <span className="text-sm text-muted-foreground/80">Search with neural embeddings…</span>
      </div>
      <div className="space-y-2">
        {[
          { title: "Building AI-powered apps with Next.js", url: "vercel.com", score: 0.95 },
          { title: "The future of semantic search", url: "arxiv.org", score: 0.89 },
          { title: "RAG patterns for production", url: "langchain.dev", score: 0.84 },
        ].map((r) => (
          <div key={r.title} className="rounded-md border border-border px-4 py-3">
            <p className="text-sm font-medium text-foreground">{r.title}</p>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{r.url}</span>
              <span className="font-mono text-sm text-muted-foreground/80">score: {r.score}</span>
            </div>
          </div>
        ))}
      </div>
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

  const steps = ["Crawling pages", "Extracting content", "Converting to markdown"]

  return (
    <div className="mx-auto w-full max-w-lg p-8">
      <div className="mb-4">
        <span className="text-sm font-medium text-foreground">Firecrawl Web Scraper</span>
      </div>
      <div className="mb-4 space-y-1">
        {steps.map((s, i) => (
          <div key={s} className={`flex items-center gap-2 rounded px-2 py-1.5 text-sm transition-opacity ${i <= step ? "opacity-100" : "opacity-50"}`}>
            {i < step ? (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-foreground/80"><polyline points="20 6 9 17 4 12" /></svg>
            ) : i === step ? (
              <div className="size-3 animate-spin rounded-full border border-border border-t-foreground" />
            ) : (
              <div className="size-2 rounded-full bg-foreground/15" />
            )}
            <span className="text-muted-foreground">{s}</span>
          </div>
        ))}
      </div>
      {step >= 3 && (
        <div className="rounded-md border border-border bg-card p-3 font-mono text-sm text-muted-foreground">
          # Extracted Content<br />
          12 pages crawled, 45KB markdown generated
        </div>
      )}
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
    <div className="mx-auto w-full max-w-lg p-8">
      <div className="mb-6">
        <span className="text-sm font-medium text-foreground">Sequential Pipeline</span>
      </div>
      <div className="flex items-center justify-between">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center">
            <div className={`flex size-10 items-center justify-center rounded-full border-2 text-sm font-medium transition-all ${
              i < active ? "border-foreground/30 bg-foreground/[0.05] text-foreground" : i === active ? "border-foreground bg-primary text-primary-foreground" : "border-border text-muted-foreground"
            }`}>
              {i < active ? "✓" : i + 1}
            </div>
            {i < steps.length - 1 && (
              <div className={`mx-1 h-px w-8 transition-colors ${i < active ? "bg-foreground/30" : "bg-foreground/15"}`} />
            )}
          </div>
        ))}
      </div>
      <div className="mt-3 flex justify-between px-1">
        {steps.map((s) => (
          <span key={s} className="text-sm text-muted-foreground">{s}</span>
        ))}
      </div>
    </div>
  )
}

/* ─── Evaluator Workflow ─── */
export function EvaluatorWorkflowPreview() {
  return (
    <div className="mx-auto w-full max-w-lg p-8">
      <div className="mb-4">
        <span className="text-sm font-medium text-foreground">Evaluator Pipeline</span>
        <p className="mt-1 text-sm text-muted-foreground">Score → threshold → retry or accept</p>
      </div>
      <div className="space-y-2">
        {[
          { round: 1, score: 0.45, action: "Retry" },
          { round: 2, score: 0.72, action: "Retry" },
          { round: 3, score: 0.91, action: "Accept ✓" },
        ].map((r) => (
          <div key={r.round} className="flex items-center justify-between rounded-md border border-border px-4 py-2.5">
            <span className="text-sm text-muted-foreground">Round {r.round}</span>
            <div className="flex items-center gap-3">
              <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-foreground/100" style={{ width: `${r.score * 100}%` }} />
              </div>
              <span className="w-8 text-right font-mono text-sm text-foreground">{r.score}</span>
              <span className="w-14 text-right text-sm text-muted-foreground">{r.action}</span>
            </div>
          </div>
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
    <div className="mx-auto w-full max-w-lg p-8">
      <div className="mb-4">
        <span className="text-sm font-medium text-foreground">Orchestrator Workflow</span>
      </div>
      <div className="mb-4 rounded-md border border-border bg-muted/50 px-4 py-2.5 text-center text-sm text-muted-foreground">
        Orchestrator → coordinating {agents.length} agents
      </div>
      <div className="space-y-2">
        {agents.map((a, i) => (
          <div key={a.name} className={`flex items-center justify-between rounded-md border px-4 py-3 transition-all ${i === active ? "border-border bg-muted/30" : "border-border"}`}>
            <div>
              <p className="text-sm font-medium text-foreground">{a.name}</p>
              <p className="text-sm text-muted-foreground">{a.task}</p>
            </div>
            {i === active && <div className="size-3 animate-spin rounded-full border border-border border-t-foreground" />}
          </div>
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

  return (
    <div className="mx-auto w-full max-w-lg p-8">
      <div className="mb-4">
        <span className="text-sm font-medium text-foreground">Parallel Execution</span>
        <p className="mt-1 text-sm text-muted-foreground">3 agents running simultaneously</p>
      </div>
      <div className="space-y-3">
        {tasks.map((task, i) => {
          const pct = Math.round(progress[i])
          return (
            <div key={task} className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-sm text-foreground">{task}</span>
                <span className="text-sm tabular-nums text-muted-foreground">{pct >= 100 ? "Done" : `${pct}%`}</span>
              </div>
              <div className="h-1 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-foreground/100 transition-all duration-200" style={{ width: `${pct}%` }} />
              </div>
            </div>
          )
        })}
      </div>
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
    <div className="mx-auto w-full max-w-lg p-8">
      <div className="mb-4">
        <span className="text-sm font-medium text-foreground">Routing Workflow</span>
      </div>
      <div className="flex items-center justify-between gap-4">
        <div className="w-40 space-y-1.5">
          {routes.map((r, i) => (
            <div key={r.input} className={`rounded-md border px-3 py-2 text-sm transition-all ${i === route ? "border-border bg-muted/30 text-foreground" : "border-border text-muted-foreground"}`}>
              {r.input}
            </div>
          ))}
        </div>
        <div className="text-muted-foreground/60">→</div>
        <div className="rounded-md border border-border px-3 py-2 text-sm text-muted-foreground">Router</div>
        <div className="text-muted-foreground/60">→</div>
        <div className="w-36 space-y-1.5">
          {routes.map((r, i) => (
            <div key={r.dest} className={`rounded-md border px-3 py-2 text-sm transition-all ${i === route ? "border-border bg-muted/30 text-foreground" : "border-border text-muted-foreground"}`}>
              {r.dest}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─── Few-Shot Prompt ─── */
export function FewShotPromptPreview() {
  return (
    <div className="mx-auto w-full max-w-lg p-8">
      <div className="mb-4">
        <span className="text-sm font-medium text-foreground">Few-Shot Prompting</span>
      </div>
      <div className="space-y-2">
        {[
          { label: "Example 1", input: "The movie was great!", output: "positive" },
          { label: "Example 2", input: "Terrible experience", output: "negative" },
          { label: "Example 3", input: "It was okay", output: "neutral" },
        ].map((ex) => (
          <div key={ex.label} className="rounded-md border border-border bg-card px-3 py-2">
            <span className="text-sm font-medium uppercase tracking-wider text-muted-foreground/80">{ex.label}</span>
            <div className="mt-1 flex items-center gap-2 text-sm">
              <span className="text-foreground">"{ex.input}"</span>
              <span className="text-muted-foreground/70">→</span>
              <span className="rounded bg-foreground/15 px-1.5 py-0.5 font-mono text-foreground/90">{ex.output}</span>
            </div>
          </div>
        ))}
        <div className="rounded-md border border-border bg-foreground/[0.02] px-3 py-2">
          <span className="text-sm font-medium uppercase tracking-wider text-foreground/70">Input</span>
          <div className="mt-1 flex items-center gap-2 text-sm">
            <span className="text-foreground">"I absolutely love this product"</span>
            <span className="text-muted-foreground/70">→</span>
            <span className="animate-pulse font-mono text-foreground/70">…</span>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════
   Marketing Previews
   ══════════════════════════════════════════ */

/* ─── Model Comparison ─── */
export function ModelComparisonPreview() {
  return (
    <div className="mx-auto w-full max-w-lg p-8">
      <div className="mb-4">
        <span className="text-sm font-medium text-foreground">Model Comparison</span>
      </div>
      <div className="space-y-3">
        {[
          { name: "GPT-4o", speed: 85, quality: 92, cost: "$" },
          { name: "Claude 3.5", speed: 78, quality: 95, cost: "$$" },
          { name: "Gemini Pro", speed: 90, quality: 88, cost: "$" },
        ].map((m) => (
          <div key={m.name} className="rounded-md border border-border px-4 py-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">{m.name}</span>
              <span className="text-sm text-muted-foreground">{m.cost}</span>
            </div>
            <div className="mt-2 space-y-1">
              {[
                { label: "Speed", value: m.speed },
                { label: "Quality", value: m.quality },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center gap-2">
                  <span className="w-12 text-sm text-muted-foreground">{stat.label}</span>
                  <div className="h-1 flex-1 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-foreground/40" style={{ width: `${stat.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── Model Comparison Compact ─── */
export function ModelComparisonCompactPreview() {
  return (
    <div className="mx-auto w-full max-w-lg p-8">
      <div className="mb-4">
        <span className="text-sm font-medium text-foreground">Model Selector</span>
      </div>
      <div className="flex gap-2">
        {[
          { name: "GPT-4o", tag: "Fast" },
          { name: "Claude", tag: "Best" },
          { name: "Gemini", tag: "Cheap" },
        ].map((m, i) => (
          <button key={m.name} className={`flex-1 rounded-lg border px-3 py-3 text-center transition-all ${i === 1 ? "border-border bg-foreground/15" : "border-border"}`}>
            <p className="text-sm font-medium text-foreground">{m.name}</p>
            <span className="mt-1 inline-block rounded-full bg-muted px-2 py-0.5 text-sm text-muted-foreground">{m.tag}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

/* ─── Model Comparison Table ─── */
export function ModelComparisonTablePreview() {
  return (
    <div className="mx-auto w-full max-w-lg p-8">
      <div className="overflow-hidden rounded-md border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-3 py-2 text-left font-medium text-muted-foreground">Model</th>
              <th className="px-3 py-2 text-right font-medium text-muted-foreground">Latency</th>
              <th className="px-3 py-2 text-right font-medium text-muted-foreground">Quality</th>
              <th className="px-3 py-2 text-right font-medium text-muted-foreground">$/1M tok</th>
            </tr>
          </thead>
          <tbody>
            {[
              { model: "GPT-4o", latency: "340ms", quality: "92", cost: "$5.00" },
              { model: "Claude 3.5", latency: "420ms", quality: "95", cost: "$3.00" },
              { model: "Gemini Pro", latency: "280ms", quality: "88", cost: "$1.25" },
              { model: "Llama 3.1", latency: "180ms", quality: "82", cost: "$0.20" },
            ].map((row) => (
              <tr key={row.model} className="border-b border-border last:border-0">
                <td className="px-3 py-2 font-medium text-foreground">{row.model}</td>
                <td className="px-3 py-2 text-right text-muted-foreground">{row.latency}</td>
                <td className="px-3 py-2 text-right text-muted-foreground">{row.quality}</td>
                <td className="px-3 py-2 text-right text-muted-foreground">{row.cost}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
    <div className="mx-auto w-full max-w-lg p-8">
      <div className="mb-4">
        <span className="text-sm font-medium text-foreground">Integrations</span>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {integrations.map((name) => (
          <div key={name} className="flex flex-col items-center gap-1.5 rounded-lg border border-border shadow-sm px-2 py-3 transition-colors hover:bg-muted/50">
            <div className="flex size-8 items-center justify-center rounded-md bg-foreground/15 text-sm font-bold text-foreground/60">
              {name[0]}
            </div>
            <span className="text-sm text-muted-foreground">{name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── Integrations v2 ─── */
export function IntegrationsGrid2Preview() {
  const integrations = [
    { name: "OpenAI", desc: "GPT models" },
    { name: "Anthropic", desc: "Claude models" },
    { name: "Google", desc: "Gemini models" },
    { name: "Mistral", desc: "Open models" },
  ]

  return (
    <div className="mx-auto w-full max-w-lg p-8">
      <div className="mb-4">
        <span className="text-sm font-medium text-foreground">Provider Integrations</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {integrations.map((item) => (
          <div key={item.name} className="flex items-center gap-3 rounded-lg border border-border shadow-sm px-4 py-3">
            <div className="flex size-8 items-center justify-center rounded-md bg-foreground/15 text-sm font-bold text-foreground/60">
              {item.name[0]}
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{item.name}</p>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── Calculator Agent ROI ─── */
export function CalculatorAgentROIPreview() {
  const [hours, setHours] = useState(40)

  return (
    <div className="mx-auto w-full max-w-lg p-8">
      <div className="mb-4">
        <span className="text-sm font-medium text-foreground">ROI Calculator</span>
      </div>
      <div className="space-y-4">
        <div>
          <label className="text-sm text-muted-foreground">Hours saved per month</label>
          <input
            type="range"
            min="10"
            max="100"
            value={hours}
            onChange={(e) => setHours(Number(e.target.value))}
            className="mt-1 w-full"
          />
          <p className="text-right text-sm tabular-nums text-foreground">{hours}h</p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-md border border-border p-3">
            <p className="text-sm uppercase text-muted-foreground">Annual savings</p>
            <p className="mt-1 text-lg font-bold text-foreground">${(hours * 75 * 12).toLocaleString()}</p>
          </div>
          <div className="rounded-md border border-border p-3">
            <p className="text-sm uppercase text-muted-foreground">ROI</p>
            <p className="mt-1 text-lg font-bold text-foreground">{Math.round((hours * 75 * 12) / 588)}x</p>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Changelog ─── */
export function ChangelogPreview() {
  return (
    <div className="mx-auto w-full max-w-lg p-8">
      <div className="mb-4">
        <span className="text-sm font-medium text-foreground">Changelog</span>
      </div>
      <div className="space-y-4">
        {[
          { ver: "v2.1.0", date: "Dec 15", items: ["Multi-model support", "Streaming improvements", "Bug fixes"] },
          { ver: "v2.0.0", date: "Nov 28", items: ["Complete redesign", "Agent orchestration", "Pro tier launch"] },
        ].map((release) => (
          <div key={release.ver} className="border-l-2 border-border pl-4">
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-foreground">{release.ver}</span>
              <span className="text-sm text-muted-foreground">{release.date}</span>
            </div>
            <ul className="mt-1.5 space-y-0.5">
              {release.items.map((item) => (
                <li key={item} className="text-sm text-muted-foreground">• {item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
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
    "Ask me anything…",
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
                  <span className="font-mono text-sm text-muted-foreground/60">12 KB</span>
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
          placeholder="Ask anything..."
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

            {/* Model pill */}
            <button className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-muted-foreground transition-colors hover:bg-card hover:text-muted-foreground">
              <span className="size-2 rounded-full bg-orange-400" />
              <span className="text-sm">Sonnet</span>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M6 9l6 6 6-6" /></svg>
            </button>

            {/* Think toggle */}
            <button
              onClick={() => setThinking((t) => !t)}
              className={cn(
                "flex items-center gap-1 rounded-lg px-2 py-1.5 text-sm transition-all",
                thinking
                  ? "bg-foreground/15 text-foreground"
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
      <p className="mt-2.5 text-center font-mono text-sm text-foreground/50">
        ↵ send · shift+↵ newline · ⌘V paste files
      </p>
    </div>
  )
}
