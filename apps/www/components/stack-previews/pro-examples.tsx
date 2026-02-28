"use client"

import { useEffect, useState } from "react"

/* ─── Chat Base Clone ─── */
export function ChatBaseClonePreview() {
  const [messages] = useState([
    { role: "user", text: "Help me write a blog post" },
    { role: "assistant", text: "I'd be happy to help! What topic would you like to write about? I can help with structure, tone, and content." },
  ])

  return (
    <div className="mx-auto w-full max-w-lg p-8">
      <div className="mb-4 flex items-center gap-2">
        <div className="size-4 rounded-full bg-foreground/20" />
        <span className="text-sm font-medium text-foreground">Chat Clone</span>
        <span className="rounded bg-muted px-1.5 py-0.5 text-sm text-muted-foreground">Starter</span>
      </div>
      <div className="space-y-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`rounded-lg px-4 py-2.5 text-sm leading-relaxed ${
              msg.role === "user"
                ? "ml-8 bg-primary text-primary-foreground"
                : "bg-card text-foreground"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <div className="mt-4 flex gap-2">
        <div className="h-9 flex-1 rounded-lg border border-border shadow-sm px-3 text-sm leading-9 text-muted-foreground/70">
          Type a message…
        </div>
        <div className="flex h-9 items-center rounded-lg bg-foreground px-3 text-sm font-medium text-background">
          Send
        </div>
      </div>
    </div>
  )
}

/* ─── Form Generator ─── */
export function FormGeneratorPreview() {
  const [generating, setGenerating] = useState(false)
  const [fields, setFields] = useState<{ label: string; type: string }[]>([])

  useEffect(() => {
    const timer = setTimeout(() => {
      setGenerating(true)
      const fieldTimer = setInterval(() => {
        setFields((prev) => {
          const all = [
            { label: "Full Name", type: "text" },
            { label: "Email Address", type: "email" },
            { label: "Company", type: "text" },
            { label: "Role", type: "select" },
          ]
          if (prev.length >= all.length) {
            clearInterval(fieldTimer)
            return prev
          }
          return [...prev, all[prev.length]]
        })
      }, 600)
      return () => clearInterval(fieldTimer)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="mx-auto w-full max-w-lg p-8">
      <div className="mb-4">
        <span className="text-sm font-medium text-foreground">AI Form Generator</span>
        <p className="mt-1 text-sm text-muted-foreground">
          "Create a contact form for a SaaS product"
        </p>
      </div>
      <div className="space-y-3">
        {fields.map((field) => (
          <div key={field.label} className="space-y-1">
            <label className="text-sm font-medium text-foreground">{field.label}</label>
            <div className="h-9 rounded-md border border-border bg-muted/40 px-3 text-sm leading-9 text-muted-foreground/70">
              {field.type === "select" ? "Select…" : `Enter ${field.label.toLowerCase()}`}
            </div>
          </div>
        ))}
        {generating && fields.length < 4 && (
          <div className="flex items-center gap-2 py-2">
            <div className="size-3 animate-spin rounded-full border border-border border-t-foreground" />
            <span className="text-sm text-muted-foreground">Generating fields…</span>
          </div>
        )}
        {fields.length >= 4 && (
          <button className="h-9 w-full rounded-md bg-foreground text-sm font-medium text-background">
            Submit
          </button>
        )}
      </div>
    </div>
  )
}

/* ─── Agent Data Analysis ─── */
export function AgentDataAnalysisPreview() {
  const [step, setStep] = useState(0)
  const steps = [
    "Loading dataset…",
    "Detecting column types…",
    "Running statistical analysis…",
    "Generating insights…",
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((p) => (p < steps.length ? p + 1 : p))
    }, 1200)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="mx-auto w-full max-w-lg p-8">
      <div className="mb-4">
        <span className="text-sm font-medium text-foreground">Data Analysis Agent</span>
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
      {step >= steps.length && (
        <div className="rounded-md border border-border bg-muted/50 p-4">
          <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Key Insights</p>
          <div className="mt-2 space-y-1 text-sm text-muted-foreground">
            <p>• Revenue grew 23% QoQ</p>
            <p>• Customer churn decreased to 4.2%</p>
            <p>• Top segment: Enterprise (62%)</p>
          </div>
        </div>
      )}
    </div>
  )
}

/* ─── Agent Branding ─── */
export function AgentBrandingPreview() {
  return (
    <div className="mx-auto w-full max-w-lg p-8">
      <div className="mb-4">
        <span className="text-sm font-medium text-foreground">Branding Agent</span>
        <p className="mt-1 text-sm text-muted-foreground">AI-generated brand identity</p>
      </div>
      <div className="space-y-4">
        <div className="rounded-md border border-border p-4">
          <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Color Palette</p>
          <div className="mt-2 flex gap-2">
            {["#1a1a2e", "#16213e", "#0f3460", "#e94560", "#f5f5f5"].map((c) => (
              <div key={c} className="flex flex-col items-center gap-1">
                <div className="size-8 rounded-md border border-foreground/15" style={{ backgroundColor: c }} />
                <span className="font-mono text-sm text-muted-foreground">{c}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-md border border-border p-4">
          <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Typography</p>
          <p className="mt-2 text-lg font-bold text-foreground">Inter Bold</p>
          <p className="text-sm text-foreground/90">Inter Regular for body text</p>
        </div>
      </div>
    </div>
  )
}

/* ─── Agent Competitor ─── */
export function AgentCompetitorPreview() {
  return (
    <div className="mx-auto w-full max-w-lg p-8">
      <div className="mb-4">
        <span className="text-sm font-medium text-foreground">Competitor Analysis</span>
      </div>
      <div className="space-y-2">
        {[
          { name: "Competitor A", score: 85, trend: "+12%" },
          { name: "Competitor B", score: 72, trend: "+5%" },
          { name: "Your Product", score: 91, trend: "+18%" },
        ].map((c) => (
          <div key={c.name} className="flex items-center justify-between rounded-md border border-border px-4 py-3">
            <span className={`text-sm font-medium ${c.name === "Your Product" ? "text-foreground" : "text-muted-foreground"}`}>{c.name}</span>
            <div className="flex items-center gap-3">
              <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-foreground/100" style={{ width: `${c.score}%` }} />
              </div>
              <span className="w-8 text-right font-mono text-sm text-muted-foreground">{c.score}</span>
              <span className="text-sm text-foreground/80">{c.trend}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── Agent SEO Audit ─── */
export function AgentSEOAuditPreview() {
  return (
    <div className="mx-auto w-full max-w-lg p-8">
      <div className="mb-4">
        <span className="text-sm font-medium text-foreground">SEO Audit Report</span>
      </div>
      <div className="space-y-2">
        {[
          { check: "Meta descriptions", status: "pass", detail: "All pages have unique meta" },
          { check: "Image alt tags", status: "warn", detail: "3 images missing alt text" },
          { check: "Page speed", status: "pass", detail: "LCP: 1.8s (Good)" },
          { check: "Mobile responsive", status: "pass", detail: "All breakpoints tested" },
          { check: "Broken links", status: "fail", detail: "2 broken external links" },
        ].map((item) => (
          <div key={item.check} className="flex items-center justify-between rounded-md border border-border px-3 py-2.5">
            <div className="flex items-center gap-2">
              <span className={`size-2 rounded-full ${item.status === "pass" ? "bg-green-500" : item.status === "warn" ? "bg-yellow-500" : "bg-red-500"}`} />
              <span className="text-sm text-foreground">{item.check}</span>
            </div>
            <span className="text-sm text-muted-foreground">{item.detail}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── Agent Reddit Validation ─── */
export function AgentRedditValidationPreview() {
  return (
    <div className="mx-auto w-full max-w-lg p-8">
      <div className="mb-4">
        <span className="text-sm font-medium text-foreground">Reddit Validation Agent</span>
        <p className="mt-1 text-sm text-muted-foreground">Analyzing community sentiment</p>
      </div>
      <div className="space-y-2">
        {[
          { sub: "r/SaaS", sentiment: "Positive", mentions: 47 },
          { sub: "r/startups", sentiment: "Mixed", mentions: 23 },
          { sub: "r/webdev", sentiment: "Positive", mentions: 31 },
        ].map((item) => (
          <div key={item.sub} className="flex items-center justify-between rounded-md border border-border px-4 py-3">
            <div>
              <span className="font-mono text-sm font-medium text-foreground">{item.sub}</span>
              <p className="text-sm text-muted-foreground">{item.mentions} mentions</p>
            </div>
            <span className={`rounded px-2 py-0.5 text-sm font-medium ${item.sentiment === "Positive" ? "bg-green-500/10 text-green-600" : "bg-yellow-500/10 text-yellow-600"}`}>
              {item.sentiment}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── Agent A11y Audit ─── */
export function AgentA11yAuditPreview() {
  return (
    <div className="mx-auto w-full max-w-lg p-8">
      <div className="mb-4">
        <span className="text-sm font-medium text-foreground">Accessibility Audit</span>
      </div>
      <div className="mb-4 flex items-center gap-4">
        <div className="flex size-16 items-center justify-center rounded-full border-4 border-border">
          <span className="text-lg font-bold text-foreground">87</span>
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">Good</p>
          <p className="text-sm text-muted-foreground">3 critical, 5 warnings</p>
        </div>
      </div>
      <div className="space-y-1.5">
        {[
          { rule: "Color contrast ratio", level: "AA", status: "fail" },
          { rule: "ARIA labels present", level: "A", status: "pass" },
          { rule: "Keyboard navigation", level: "AA", status: "pass" },
          { rule: "Focus indicators", level: "AA", status: "warn" },
        ].map((item) => (
          <div key={item.rule} className="flex items-center justify-between rounded px-3 py-2 text-sm">
            <div className="flex items-center gap-2">
              <span className={`size-1.5 rounded-full ${item.status === "pass" ? "bg-green-500" : item.status === "warn" ? "bg-yellow-500" : "bg-red-500"}`} />
              <span className="text-foreground">{item.rule}</span>
            </div>
            <span className="rounded bg-muted px-1.5 py-0.5 text-sm text-muted-foreground">{item.level}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
