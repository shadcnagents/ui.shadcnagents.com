"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { WaveDotsLoader, SuggestionPills, WAVE_KEYFRAMES, SPRING } from "./shared"

/* ─── ChatGPT Clone ─── */

const CHATGPT_RESPONSE =
  "Quantum computing uses qubits that can exist in superposition — representing both 0 and 1 simultaneously. This enables parallel processing of complex calculations that classical computers handle sequentially. Combined with entanglement, quantum computers can solve certain problems exponentially faster than classical machines."

const CHATGPT_SUGGESTIONS = [
  "Explain quantum computing",
  "Write a Python script",
  "Debug my React code",
  "Compare GPT models",
]

export function ChatGPTPreview() {
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
      if (idxRef.current < CHATGPT_RESPONSE.length) {
        idxRef.current += 1
        setDisplayed(CHATGPT_RESPONSE.slice(0, idxRef.current))
      } else {
        clearInterval(iv)
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: CHATGPT_RESPONSE },
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
        <div className="size-5 rounded-full bg-foreground/20" />
        <span className="text-sm font-medium text-foreground">ChatGPT</span>
        <span className="rounded-md bg-foreground/[0.06] px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
          GPT-4o
        </span>
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
              <SuggestionPills suggestions={CHATGPT_SUGGESTIONS} onSelect={(s) => handleSend(s)} />
            </div>
          )}
        </AnimatePresence>
        <div className="flex items-end gap-2 rounded-2xl border border-border bg-background px-3 py-2 transition-all duration-150 focus-within:border-foreground/30 focus-within:shadow-md">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Message ChatGPT..."
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

/* ─── Claude Chat ─── */

const CLAUDE_RESPONSE =
  "I aim to be helpful, harmless, and honest. I think carefully about nuance, acknowledge uncertainty, and try to give balanced perspectives rather than oversimplified answers. What sets me apart is my focus on being genuinely useful while being transparent about my limitations."

const CLAUDE_SUGGESTIONS = [
  "What makes you different?",
  "Explain attention mechanisms",
  "Review my TypeScript code",
  "Compare Claude models",
]

export function ChatClaudePreview() {
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
      if (idxRef.current < CLAUDE_RESPONSE.length) {
        idxRef.current += 1
        setDisplayed(CLAUDE_RESPONSE.slice(0, idxRef.current))
      } else {
        clearInterval(iv)
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: CLAUDE_RESPONSE },
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
        <div className="flex size-5 items-center justify-center rounded-full bg-[#D97757]/10 text-xs font-semibold text-[#D97757]">
          C
        </div>
        <span className="text-sm font-medium text-foreground">Claude</span>
        <span className="rounded-md bg-[#D97757]/10 px-1.5 py-0.5 text-[10px] font-medium text-[#D97757]/70">
          Sonnet 4
        </span>
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
                className="ml-0.5 inline-block size-[3px] rounded-full bg-[#D97757]"
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
              <SuggestionPills suggestions={CLAUDE_SUGGESTIONS} onSelect={(s) => handleSend(s)} />
            </div>
          )}
        </AnimatePresence>
        <div className="flex items-end gap-2 rounded-2xl border border-border bg-background px-3 py-2 transition-all duration-150 focus-within:border-foreground/30 focus-within:shadow-md">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Reply to Claude..."
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

/* ─── Grok Chat ─── */

const GROK_RESPONSE =
  "A day on Venus is longer than a year on Venus. It takes 243 Earth days to rotate once but only 225 Earth days to orbit the Sun. Time is weird. And if you think that's wild, Venus also rotates backwards compared to most planets."

const GROK_SUGGESTIONS = [
  "Tell me something interesting",
  "Roast my code style",
  "Explain black holes",
  "What's trending on X?",
]

export function ChatGrokPreview() {
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
    setTimeout(() => setState("streaming"), 1200)
  }

  useEffect(() => {
    if (state !== "streaming") return
    const iv = setInterval(() => {
      if (idxRef.current < GROK_RESPONSE.length) {
        idxRef.current += 1
        setDisplayed(GROK_RESPONSE.slice(0, idxRef.current))
      } else {
        clearInterval(iv)
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: GROK_RESPONSE },
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
        <div className="flex size-5 items-center justify-center rounded bg-foreground font-mono text-xs font-bold text-background">
          G
        </div>
        <span className="font-mono text-sm font-medium text-foreground">Grok</span>
        <span className="rounded-md bg-foreground/[0.06] px-1.5 py-0.5 font-mono text-[10px] font-medium text-muted-foreground">
          Grok-3
        </span>
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
                className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 font-mono text-sm leading-relaxed ${
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
            <div className="max-w-[80%] rounded-2xl bg-card px-3.5 py-2.5 font-mono text-sm leading-relaxed text-foreground">
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
              <SuggestionPills suggestions={GROK_SUGGESTIONS} onSelect={(s) => handleSend(s)} />
            </div>
          )}
        </AnimatePresence>
        <div className="flex items-end gap-2 rounded-2xl border border-border bg-background px-3 py-2 transition-all duration-150 focus-within:border-foreground/30 focus-within:shadow-md">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask Grok..."
            className="h-9 min-w-0 flex-1 bg-transparent font-mono text-sm outline-none placeholder:text-muted-foreground"
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

/* ─── Inline Citation ─── */
export function InlineCitationPreview() {
  const [hoveredCite, setHoveredCite] = useState<number | null>(null)

  const sources = [
    { id: 1, title: "Nature — Climate Report 2024", url: "nature.com" },
    { id: 2, title: "WHO — Global Health Statistics", url: "who.int" },
    { id: 3, title: "MIT Tech Review — AI Trends", url: "technologyreview.com" },
  ]

  return (
    <div className="mx-auto w-full max-w-lg p-6">
      <div className="mb-4 flex items-center gap-2">
        <span className="text-sm font-medium text-foreground">Perplexity</span>
        <span className="rounded-md bg-foreground/[0.06] px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
          Pro Search
        </span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...SPRING }}
        className="text-sm leading-[1.8] text-foreground"
      >
        Global temperatures have risen by 1.1°C since pre-industrial times
        <button
          onMouseEnter={() => setHoveredCite(1)}
          onMouseLeave={() => setHoveredCite(null)}
          className="relative mx-0.5 inline-flex size-4 items-center justify-center rounded bg-primary/15 text-xs font-medium text-primary hover:bg-primary/25"
        >
          1
          <AnimatePresence>
            {hoveredCite === 1 && (
              <motion.span
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ ...SPRING }}
                className="absolute bottom-full left-1/2 mb-1 -translate-x-1/2 whitespace-nowrap rounded-lg border border-border bg-background px-2.5 py-1 text-xs text-muted-foreground shadow-sm"
              >
                {sources[0].title}
              </motion.span>
            )}
          </AnimatePresence>
        </button>
        , affecting over 3.6 billion people worldwide
        <button
          onMouseEnter={() => setHoveredCite(2)}
          onMouseLeave={() => setHoveredCite(null)}
          className="relative mx-0.5 inline-flex size-4 items-center justify-center rounded bg-primary/15 text-xs font-medium text-primary hover:bg-primary/25"
        >
          2
          <AnimatePresence>
            {hoveredCite === 2 && (
              <motion.span
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ ...SPRING }}
                className="absolute bottom-full left-1/2 mb-1 -translate-x-1/2 whitespace-nowrap rounded-lg border border-border bg-background px-2.5 py-1 text-xs text-muted-foreground shadow-sm"
              >
                {sources[1].title}
              </motion.span>
            )}
          </AnimatePresence>
        </button>
        . AI-driven climate models are now being used to predict weather patterns with unprecedented accuracy
        <button
          onMouseEnter={() => setHoveredCite(3)}
          onMouseLeave={() => setHoveredCite(null)}
          className="relative mx-0.5 inline-flex size-4 items-center justify-center rounded bg-primary/15 text-xs font-medium text-primary hover:bg-primary/25"
        >
          3
          <AnimatePresence>
            {hoveredCite === 3 && (
              <motion.span
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ ...SPRING }}
                className="absolute bottom-full left-1/2 mb-1 -translate-x-1/2 whitespace-nowrap rounded-lg border border-border bg-background px-2.5 py-1 text-xs text-muted-foreground shadow-sm"
              >
                {sources[2].title}
              </motion.span>
            )}
          </AnimatePresence>
        </button>
        .
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...SPRING, delay: 0.1 }}
        className="mt-4 space-y-1.5 border-t border-border pt-3"
      >
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Sources</p>
        {sources.map((s, i) => (
          <motion.div
            key={s.id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING, delay: 0.15 + i * 0.06 }}
            className={`flex items-center gap-2 rounded-xl px-2.5 py-1.5 text-sm transition-colors ${
              hoveredCite === s.id ? "bg-card" : ""
            }`}
          >
            <span className="flex size-5 items-center justify-center rounded-lg bg-primary/10 font-mono text-xs font-medium text-primary">
              {s.id}
            </span>
            <span className="text-muted-foreground">{s.title}</span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

/* ─── Multimodal File Upload (ChatGPT) ─── */
export function MultimodalFileUploadPreview() {
  const [files, setFiles] = useState<{ name: string; type: string; size: string }[]>([])
  const [dragOver, setDragOver] = useState(false)

  const samples = [
    { name: "report.pdf", type: "PDF", size: "2.4 MB" },
    { name: "screenshot.png", type: "Image", size: "840 KB" },
    { name: "data.csv", type: "CSV", size: "156 KB" },
  ]

  function addFile() {
    if (files.length < 3) {
      setFiles((prev) => [...prev, samples[prev.length]])
    }
  }

  function removeFile(idx: number) {
    setFiles((prev) => prev.filter((_, i) => i !== idx))
  }

  return (
    <div className="mx-auto w-full max-w-lg p-6">
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...SPRING }}
        onClick={addFile}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        className={`cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
          dragOver ? "border-foreground/30 bg-card" : "border-border"
        }`}
      >
        <svg className="mx-auto size-8 text-muted-foreground/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        <p className="mt-2 text-sm text-muted-foreground">Upload files to ChatGPT</p>
        <p className="mt-1 text-xs text-muted-foreground/80">PDF, Images, CSV, TXT up to 10MB</p>
      </motion.div>

      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ ...SPRING }}
            className="mt-3 space-y-1.5 overflow-hidden"
          >
            {files.map((f, i) => (
              <motion.div
                key={f.name}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ ...SPRING }}
                className="flex items-center justify-between rounded-xl border border-border px-3 py-2"
              >
                <div className="flex items-center gap-2">
                  <span className="rounded-lg bg-muted px-1.5 py-0.5 text-xs font-medium text-muted-foreground">
                    {f.type}
                  </span>
                  <span className="text-sm text-foreground">{f.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground">{f.size}</span>
                  <motion.button
                    onClick={(e) => { e.stopPropagation(); removeFile(i) }}
                    whileTap={{ scale: 0.9 }}
                    className="rounded-md p-0.5 text-muted-foreground/50 transition-colors hover:text-foreground"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ─── Conversation History Sidebar (ChatGPT) ─── */
export function ConversationHistorySidebarPreview() {
  const [activeId, setActiveId] = useState("1")
  const conversations = [
    { id: "1", title: "Quantum computing basics", time: "Just now", group: "Today" },
    { id: "2", title: "React performance tips", time: "2h ago", group: "Today" },
    { id: "3", title: "Writing a cover letter", time: "Yesterday", group: "Yesterday" },
    { id: "4", title: "Python data analysis", time: "2 days ago", group: "Previous 7 days" },
    { id: "5", title: "Travel planning Japan", time: "5 days ago", group: "Previous 7 days" },
  ]

  const groups = [...new Set(conversations.map((c) => c.group))]

  return (
    <div className="mx-auto w-full max-w-lg p-6">
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...SPRING }}
        className="overflow-hidden rounded-xl border border-border"
      >
        <div className="border-b border-border px-3 py-2.5">
          <div className="flex h-7 items-center rounded-lg border border-border bg-muted/50 px-2">
            <svg className="mr-1.5 size-3 text-muted-foreground/80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <span className="text-xs text-muted-foreground/80">Search ChatGPT...</span>
          </div>
        </div>
        <div className="max-h-[220px] overflow-y-auto p-1.5 [&::-webkit-scrollbar]:hidden">
          {groups.map((group, gi) => (
            <motion.div
              key={group}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...SPRING, delay: gi * 0.06 }}
            >
              <p className="px-2 pb-1 pt-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">
                {group}
              </p>
              {conversations
                .filter((c) => c.group === group)
                .map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => setActiveId(conv.id)}
                    className={`flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-left transition-colors ${
                      activeId === conv.id
                        ? "bg-card text-foreground"
                        : "text-muted-foreground hover:bg-card/50"
                    }`}
                  >
                    <span className="truncate text-sm">{conv.title}</span>
                    <span className="shrink-0 font-mono text-xs text-muted-foreground/80">{conv.time}</span>
                  </button>
                ))}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

/* ─── Message Branch Navigator (ChatGPT) ─── */
export function MessageBranchNavigatorPreview() {
  const [branch, setBranch] = useState(0)
  const branches = [
    "Quantum computing uses qubits that exist in superposition, allowing parallel computation.",
    "Quantum computing harnesses quantum mechanics to process information in fundamentally new ways.",
    "At its core, quantum computing leverages entanglement and superposition for exponential speedups.",
  ]

  return (
    <div className="mx-auto w-full max-w-lg p-6">
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...SPRING }}
        className="space-y-3"
      >
        <div className="ml-8 rounded-2xl bg-primary px-3.5 py-2.5 text-sm text-primary-foreground">
          Explain quantum computing simply
        </div>
        <div className="rounded-xl border border-border px-4 py-3">
          <AnimatePresence mode="wait">
            <motion.p
              key={branch}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ ...SPRING }}
              className="text-sm leading-relaxed text-foreground"
            >
              {branches[branch]}
            </motion.p>
          </AnimatePresence>
          <div className="mt-3 flex items-center justify-between border-t border-border pt-2">
            <div className="flex items-center gap-1">
              <motion.button
                onClick={() => setBranch((p) => Math.max(0, p - 1))}
                disabled={branch === 0}
                whileTap={{ scale: 0.9 }}
                className="flex size-6 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-card disabled:opacity-50"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </motion.button>
              <span className="font-mono text-xs tabular-nums text-muted-foreground">
                {branch + 1} / {branches.length}
              </span>
              <motion.button
                onClick={() => setBranch((p) => Math.min(branches.length - 1, p + 1))}
                disabled={branch === branches.length - 1}
                whileTap={{ scale: 0.9 }}
                className="flex size-6 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-card disabled:opacity-50"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </motion.button>
            </div>
            <span className="font-mono text-[10px] text-muted-foreground/40">
              ChatGPT Branch {branch + 1}
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
