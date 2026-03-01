"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { WaveDotsLoader, SuggestionPills, WAVE_KEYFRAMES, SPRING, FADE_UP, STAGGER } from "./shared"

/* ─── Chat Base Clone ─── */

const CHATBASE_RESPONSE =
  "You can embed Chatbase on any site with a simple script tag. First, create a chatbot in the Chatbase dashboard, train it on your data, then copy the embed code. I'll walk you through the full setup, training, and customization process."

const CHATBASE_SUGGESTIONS = [
  "How do I integrate Chatbase?",
  "Train on my documentation",
  "Customize the chat widget",
  "Set up auto-replies",
]

export function ChatBaseClonePreview() {
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([])
  const [input, setInput] = useState("")
  const [state, setState] = useState<"idle" | "thinking" | "streaming">("idle")
  const [displayed, setDisplayed] = useState("")
  const bottomRef = useRef<HTMLDivElement>(null)
  const idxRef = useRef(0)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, displayed])

  function handleSend(text?: string) {
    const msg = text || input
    if (!msg.trim() || state !== "idle") return
    setMessages((prev) => [...prev, { role: "user", content: msg.trim() }])
    setInput("")
    setState("thinking")
    setDisplayed("")
    idxRef.current = 0
    setTimeout(() => setState("streaming"), 1500)
  }

  useEffect(() => {
    if (state !== "streaming") return
    const iv = setInterval(() => {
      if (idxRef.current < CHATBASE_RESPONSE.length) {
        idxRef.current += 1
        setDisplayed(CHATBASE_RESPONSE.slice(0, idxRef.current))
      } else {
        clearInterval(iv)
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: CHATBASE_RESPONSE },
        ])
        setDisplayed("")
        setState("idle")
      }
    }, 12)
    return () => clearInterval(iv)
  }, [state])

  return (
    <div className="mx-auto flex h-[420px] w-full max-w-lg flex-col">
      <style dangerouslySetInnerHTML={{ __html: WAVE_KEYFRAMES }} />

      {/* Header */}
      <div className="flex items-center gap-2 border-b border-border px-6 py-3">
        <div className="size-4 rounded-full bg-foreground/20" />
        <span className="text-sm font-medium text-foreground">Chatbase</span>
        <span className="rounded-lg bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">Custom GPT</span>
      </div>

      {/* Messages */}
      <div className="flex-1 space-y-3 overflow-y-auto p-6 [&::-webkit-scrollbar]:hidden">
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...SPRING }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-foreground"
                }`}
              >
                {msg.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {state === "thinking" && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING }}
            className="flex justify-start"
          >
            <div className="flex items-center gap-2.5 rounded-2xl bg-card px-4 py-3">
              <WaveDotsLoader />
            </div>
          </motion.div>
        )}

        {state === "streaming" && displayed && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING }}
            className="flex justify-start"
          >
            <div className="max-w-[80%] rounded-2xl bg-card px-3.5 py-2.5 text-sm leading-relaxed text-foreground">
              {displayed}
              <span
                className="ml-0.5 inline-block size-[3px] rounded-full bg-foreground"
                style={{ animation: "gt-blink 0.8s infinite" }}
              />
            </div>
          </motion.div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-border p-4">
        <AnimatePresence>
          {!input && state === "idle" && messages.length === 0 && (
            <div className="mb-3">
              <SuggestionPills suggestions={CHATBASE_SUGGESTIONS} onSelect={(s) => handleSend(s)} />
            </div>
          )}
        </AnimatePresence>
        <div className="flex items-end gap-2 rounded-2xl border border-border bg-background px-3 py-2 transition-all duration-150 focus-within:border-foreground/30 focus-within:shadow-md">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask Chatbase..."
            className="h-9 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <motion.button
            onClick={() => handleSend()}
            disabled={!input.trim() || state !== "idle"}
            whileTap={{ scale: 0.9 }}
            className={`flex size-9 shrink-0 items-center justify-center rounded-xl transition-all duration-150 ${
              input.trim() && state === "idle"
                ? "bg-primary text-primary-foreground"
                : "bg-foreground/10 text-muted-foreground/50"
            }`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </motion.button>
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
    <div className="mx-auto w-full max-w-lg p-6">
      <style dangerouslySetInnerHTML={{ __html: WAVE_KEYFRAMES }} />

      <div className="mb-4">
        <span className="text-sm font-medium text-foreground">Typeform AI Builder</span>
        <p className="mt-1 text-xs text-muted-foreground">
          &quot;Create a Typeform contact form for a SaaS product&quot;
        </p>
      </div>
      <div className="space-y-3">
        <AnimatePresence>
          {fields.map((field) => (
            <motion.div
              key={field.label}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ ...SPRING }}
              className="space-y-1 overflow-hidden"
            >
              <label className="text-sm font-medium text-foreground">{field.label}</label>
              <div className="h-9 rounded-xl border border-border bg-muted/40 px-3 text-sm leading-9 text-muted-foreground/70">
                {field.type === "select" ? "Select..." : `Enter ${field.label.toLowerCase()}`}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {generating && fields.length < 4 && (
          <div className="flex items-center gap-2 py-2">
            <WaveDotsLoader />
            <span className="text-xs text-muted-foreground">Generating Typeform fields...</span>
          </div>
        )}
        <AnimatePresence>
          {fields.length >= 4 && (
            <motion.button
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...SPRING }}
              whileTap={{ scale: 0.97 }}
              className="h-9 w-full rounded-xl bg-foreground text-sm font-medium text-background"
            >
              Submit
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

/* ─── Agent Data Analysis ─── */
export function AgentDataAnalysisPreview() {
  const [step, setStep] = useState(0)
  const steps = [
    "Uploading to ChatGPT...",
    "Detecting column types...",
    "Running ChatGPT analysis...",
    "Generating insights...",
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
        <span className="text-sm font-medium text-foreground">ChatGPT Data Analyst</span>
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
            <span className={`text-sm ${i <= step ? (i === step ? "font-medium text-foreground" : "text-muted-foreground") : "text-muted-foreground/60"}`}>
              {s}
            </span>
            {i === step && i < steps.length && (
              <span className="ml-auto font-mono text-[10px] text-muted-foreground/40">running</span>
            )}
          </motion.div>
        ))}
      </div>
      <AnimatePresence>
        {step >= steps.length && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING }}
            className="rounded-xl border border-border bg-card p-4"
          >
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">ChatGPT Insights</p>
            <motion.div
              initial="initial"
              animate="animate"
              variants={{ animate: { ...STAGGER } }}
              className="mt-2 space-y-1"
            >
              {["Revenue grew 23% QoQ", "Customer churn decreased to 4.2%", "Top segment: Enterprise (62%)"].map((item) => (
                <motion.p
                  key={item}
                  variants={FADE_UP}
                  transition={{ ...SPRING }}
                  className="text-sm text-muted-foreground"
                >
                  {item}
                </motion.p>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ─── Agent Branding ─── */
export function AgentBrandingPreview() {
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 800)
    const t2 = setTimeout(() => setPhase(2), 1800)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  const colors = ["#1a1a2e", "#16213e", "#0f3460", "#e94560", "#f5f5f5"]

  return (
    <div className="mx-auto w-full max-w-lg p-6">
      <style dangerouslySetInnerHTML={{ __html: WAVE_KEYFRAMES }} />

      <div className="mb-4">
        <span className="text-sm font-medium text-foreground">Canva Brand Kit</span>
        <p className="mt-1 text-xs text-muted-foreground">Canva AI-generated brand identity</p>
      </div>

      {phase === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-3 py-8"
        >
          <WaveDotsLoader />
          <span className="text-sm text-muted-foreground">Generating brand identity...</span>
        </motion.div>
      )}

      <AnimatePresence>
        {phase >= 1 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING }}
            className="space-y-4"
          >
            <div className="rounded-xl border border-border p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Canva Palette</p>
              <motion.div
                initial="initial"
                animate="animate"
                variants={{ animate: { ...STAGGER } }}
                className="mt-2 flex gap-2"
              >
                {colors.map((c) => (
                  <motion.div
                    key={c}
                    variants={FADE_UP}
                    transition={{ ...SPRING }}
                    className="flex flex-col items-center gap-1"
                  >
                    <div className="size-8 rounded-xl border border-border" style={{ backgroundColor: c }} />
                    <span className="font-mono text-[10px] text-muted-foreground">{c}</span>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            <AnimatePresence>
              {phase >= 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...SPRING }}
                  className="rounded-xl border border-border p-4"
                >
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Canva Typography</p>
                  <p className="mt-2 text-lg font-bold text-foreground">Inter Bold</p>
                  <p className="text-sm text-foreground/90">Inter Regular for body text</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ─── Agent Competitor ─── */
export function AgentCompetitorPreview() {
  const [visible, setVisible] = useState(0)

  const competitors = [
    { name: "Anthropic", score: 85, trend: "+12%" },
    { name: "Google DeepMind", score: 72, trend: "+5%" },
    { name: "OpenAI", score: 91, trend: "+18%" },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setVisible((p) => Math.min(p + 1, competitors.length))
    }, 600)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="mx-auto w-full max-w-lg p-6">
      <style dangerouslySetInnerHTML={{ __html: WAVE_KEYFRAMES }} />

      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">OpenAI Competitor Intel</span>
        {visible < competitors.length && (
          <div className="flex items-center gap-2">
            <WaveDotsLoader />
            <span className="text-xs text-muted-foreground">Analyzing...</span>
          </div>
        )}
      </div>
      <div className="space-y-2">
        <AnimatePresence>
          {competitors.slice(0, visible).map((c, i) => (
            <motion.div
              key={c.name}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ ...SPRING }}
              className="flex items-center justify-between rounded-xl border border-border px-4 py-3"
            >
              <span className={`text-sm font-medium ${c.name === "OpenAI" ? "text-foreground" : "text-muted-foreground"}`}>
                {c.name}
              </span>
              <div className="flex items-center gap-3">
                <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${c.score}%` }}
                    transition={{ ...SPRING, delay: 0.2 }}
                    className="h-full rounded-full bg-primary"
                  />
                </div>
                <span className="w-8 text-right font-mono text-xs text-muted-foreground">{c.score}</span>
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ ...SPRING, delay: 0.3 }}
                  className="text-xs text-foreground/80"
                >
                  {c.trend}
                </motion.span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

/* ─── Agent SEO Audit ─── */
export function AgentSEOAuditPreview() {
  const [visible, setVisible] = useState(0)

  const checks = [
    { check: "Meta descriptions", status: "pass", detail: "Ahrefs: all pages indexed" },
    { check: "Image alt tags", status: "warn", detail: "3 images missing alt text" },
    { check: "Page speed", status: "pass", detail: "LCP: 1.8s (Good)" },
    { check: "Backlink health", status: "pass", detail: "Ahrefs DR: 54" },
    { check: "Broken links", status: "fail", detail: "2 broken external links" },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setVisible((p) => Math.min(p + 1, checks.length))
    }, 800)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="mx-auto w-full max-w-lg p-6">
      <style dangerouslySetInnerHTML={{ __html: WAVE_KEYFRAMES }} />

      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">Ahrefs Site Audit</span>
        <span className="font-mono text-xs tabular-nums text-muted-foreground">
          {visible}/{checks.length}
        </span>
      </div>
      <div className="space-y-2">
        {checks.map((item, i) => (
          <motion.div
            key={item.check}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: i < visible ? 1 : 0.15, x: 0 }}
            transition={{ ...SPRING, delay: i * 0.06 }}
            className="flex items-center justify-between rounded-xl border border-border px-3 py-2.5"
          >
            <div className="flex items-center gap-2">
              {i < visible ? (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ ...SPRING }}
                  className={`size-2 rounded-full ${item.status === "pass" ? "bg-green-500" : item.status === "warn" ? "bg-yellow-500" : "bg-red-500"}`}
                />
              ) : (
                <div className="size-2 rounded-full bg-foreground/15" />
              )}
              <span className="text-sm text-foreground">{item.check}</span>
            </div>
            {i < visible && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ ...SPRING }}
                className="text-xs text-muted-foreground"
              >
                {item.detail}
              </motion.span>
            )}
          </motion.div>
        ))}
      </div>
      {visible < checks.length && (
        <div className="mt-3 flex items-center gap-2 px-1">
          <WaveDotsLoader />
          <span className="text-xs text-muted-foreground">Scanning...</span>
        </div>
      )}
    </div>
  )
}

/* ─── Agent Reddit Validation ─── */
export function AgentRedditValidationPreview() {
  const [visible, setVisible] = useState(0)

  const subreddits = [
    { sub: "r/SaaS", sentiment: "Positive", mentions: 47 },
    { sub: "r/startups", sentiment: "Mixed", mentions: 23 },
    { sub: "r/webdev", sentiment: "Positive", mentions: 31 },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setVisible((p) => Math.min(p + 1, subreddits.length))
    }, 800)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="mx-auto w-full max-w-lg p-6">
      <style dangerouslySetInnerHTML={{ __html: WAVE_KEYFRAMES }} />

      <div className="mb-4">
        <span className="text-sm font-medium text-foreground">Reddit Pulse</span>
        <p className="mt-1 text-xs text-muted-foreground">Analyzing Reddit community sentiment</p>
      </div>
      <div className="space-y-2">
        <AnimatePresence>
          {subreddits.slice(0, visible).map((item) => (
            <motion.div
              key={item.sub}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ ...SPRING }}
              className="flex items-center justify-between rounded-xl border border-border px-4 py-3"
            >
              <div>
                <span className="font-mono text-sm font-medium text-foreground">{item.sub}</span>
                <p className="text-xs text-muted-foreground">{item.mentions} mentions</p>
              </div>
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ ...SPRING, delay: 0.2 }}
                className={`rounded-lg px-2 py-0.5 text-xs font-medium ${
                  item.sentiment === "Positive"
                    ? "bg-green-500/10 text-green-600"
                    : "bg-yellow-500/10 text-yellow-600"
                }`}
              >
                {item.sentiment}
              </motion.span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      {visible < subreddits.length && (
        <div className="mt-3 flex items-center gap-2 px-1">
          <WaveDotsLoader />
          <span className="text-xs text-muted-foreground">Analyzing communities...</span>
        </div>
      )}
    </div>
  )
}

/* ─── Agent A11y Audit ─── */
export function AgentA11yAuditPreview() {
  const [phase, setPhase] = useState(0)
  const [visible, setVisible] = useState(0)

  const rules = [
    { rule: "Color contrast ratio", level: "AA", status: "fail" },
    { rule: "ARIA labels present", level: "A", status: "pass" },
    { rule: "Keyboard navigation", level: "AA", status: "pass" },
    { rule: "Focus indicators", level: "AA", status: "warn" },
  ]

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 1000)
    return () => clearTimeout(t1)
  }, [])

  useEffect(() => {
    if (phase < 1) return
    const timer = setInterval(() => {
      setVisible((p) => Math.min(p + 1, rules.length))
    }, 600)
    return () => clearInterval(timer)
  }, [phase])

  return (
    <div className="mx-auto w-full max-w-lg p-6">
      <style dangerouslySetInnerHTML={{ __html: WAVE_KEYFRAMES }} />

      <div className="mb-4">
        <span className="text-sm font-medium text-foreground">Lighthouse Accessibility</span>
      </div>

      {phase === 0 ? (
        <div className="flex items-center gap-3 py-8">
          <WaveDotsLoader />
          <span className="text-sm text-muted-foreground">Lighthouse scanning...</span>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ ...SPRING }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ ...SPRING }}
            className="mb-4 flex items-center gap-4"
          >
            <div className="flex size-16 items-center justify-center rounded-full border-4 border-border">
              <span className="text-lg font-bold text-foreground">87</span>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Good</p>
              <p className="text-xs text-muted-foreground">Lighthouse: 3 critical, 5 warnings</p>
            </div>
          </motion.div>
          <div className="space-y-1.5">
            {rules.map((item, i) => (
              <motion.div
                key={item.rule}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: i < visible ? 1 : 0.15, x: 0 }}
                transition={{ ...SPRING, delay: i * 0.06 }}
                className="flex items-center justify-between rounded-xl px-3 py-2 text-sm"
              >
                <div className="flex items-center gap-2">
                  {i < visible ? (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ ...SPRING }}
                      className={`size-1.5 rounded-full ${item.status === "pass" ? "bg-green-500" : item.status === "warn" ? "bg-yellow-500" : "bg-red-500"}`}
                    />
                  ) : (
                    <div className="size-1.5 rounded-full bg-foreground/15" />
                  )}
                  <span className="text-foreground">{item.rule}</span>
                </div>
                <span className="rounded-lg bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">{item.level}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}
