"use client"

import { useEffect, useState } from "react"

/* ─── ChatGPT Clone ─── */
export function ChatGPTPreview() {
  const [messages, setMessages] = useState([
    { role: "user", text: "Explain quantum computing" },
  ])
  const [typing, setTyping] = useState(true)

  useEffect(() => {
    if (!typing) return
    const timer = setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Quantum computing uses qubits that can exist in superposition — representing both 0 and 1 simultaneously. This enables parallel processing of complex calculations that classical computers handle sequentially.",
        },
      ])
      setTyping(false)
    }, 2000)
    return () => clearTimeout(timer)
  }, [typing])

  return (
    <div className="mx-auto w-full max-w-lg p-8">
      <div className="mb-3 flex items-center gap-2">
        <div className="size-5 rounded-full bg-foreground/20" />
        <span className="text-sm font-medium text-foreground">ChatGPT</span>
      </div>
      <div className="space-y-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`rounded-lg px-4 py-3 text-sm leading-relaxed ${
              msg.role === "user"
                ? "ml-8 bg-foreground/[0.05] text-foreground"
                : "text-foreground"
            }`}
          >
            {msg.text}
          </div>
        ))}
        {typing && (
          <div className="flex gap-1 px-1 py-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="size-1.5 animate-pulse rounded-full bg-muted-foreground/40"
                style={{ animationDelay: `${i * 200}ms` }}
              />
            ))}
          </div>
        )}
      </div>
      <div className="mt-4 flex h-9 items-center rounded-lg border border-border shadow-sm px-3">
        <span className="text-sm text-muted-foreground/80">Message ChatGPT…</span>
      </div>
    </div>
  )
}

/* ─── Claude Chat ─── */
export function ChatClaudePreview() {
  const [messages, setMessages] = useState([
    { role: "user", text: "What makes you different?" },
  ])
  const [typing, setTyping] = useState(true)

  useEffect(() => {
    if (!typing) return
    const timer = setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "I aim to be helpful, harmless, and honest. I think carefully about nuance, acknowledge uncertainty, and try to give balanced perspectives rather than oversimplified answers.",
        },
      ])
      setTyping(false)
    }, 2000)
    return () => clearTimeout(timer)
  }, [typing])

  return (
    <div className="mx-auto w-full max-w-lg p-8">
      <div className="mb-3 flex items-center gap-2">
        <div className="flex size-5 items-center justify-center rounded-full bg-[#D97757]/10 text-sm text-[#D97757]">
          C
        </div>
        <span className="text-sm font-medium text-foreground">Claude</span>
      </div>
      <div className="space-y-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`rounded-lg px-4 py-3 text-sm leading-relaxed ${
              msg.role === "user"
                ? "ml-8 bg-foreground/[0.05] text-foreground"
                : "text-foreground"
            }`}
          >
            {msg.text}
          </div>
        ))}
        {typing && (
          <div className="flex gap-1 px-1 py-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="size-1.5 animate-pulse rounded-full bg-[#D97757]/40"
                style={{ animationDelay: `${i * 200}ms` }}
              />
            ))}
          </div>
        )}
      </div>
      <div className="mt-4 flex h-9 items-center rounded-xl border border-border shadow-sm px-3">
        <span className="text-sm text-muted-foreground/80">Reply to Claude…</span>
      </div>
    </div>
  )
}

/* ─── Grok Chat ─── */
export function ChatGrokPreview() {
  const [messages, setMessages] = useState([
    { role: "user", text: "Tell me something interesting" },
  ])
  const [typing, setTyping] = useState(true)

  useEffect(() => {
    if (!typing) return
    const timer = setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "A day on Venus is longer than a year on Venus. It takes 243 Earth days to rotate once but only 225 Earth days to orbit the Sun. Time is weird.",
        },
      ])
      setTyping(false)
    }, 1800)
    return () => clearTimeout(timer)
  }, [typing])

  return (
    <div className="mx-auto w-full max-w-lg p-8">
      <div className="mb-3 flex items-center gap-2">
        <div className="flex size-5 items-center justify-center rounded bg-foreground text-sm font-bold text-background">
          G
        </div>
        <span className="font-mono text-sm font-medium text-foreground">Grok</span>
      </div>
      <div className="space-y-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`rounded px-4 py-3 font-mono text-sm leading-relaxed ${
              msg.role === "user"
                ? "ml-8 bg-foreground/[0.05] text-foreground"
                : "text-foreground"
            }`}
          >
            {msg.text}
          </div>
        ))}
        {typing && (
          <span className="font-mono text-sm text-muted-foreground animate-pulse">▌</span>
        )}
      </div>
      <div className="mt-4 flex h-9 items-center rounded border border-border px-3">
        <span className="font-mono text-sm text-muted-foreground/80">Ask Grok…</span>
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
    <div className="mx-auto w-full max-w-lg p-8">
      <div className="mb-4">
        <span className="text-sm font-medium text-foreground">AI Response with Citations</span>
      </div>
      <div className="text-sm leading-[1.8] text-foreground">
        Global temperatures have risen by 1.1°C since pre-industrial times
        <button
          onMouseEnter={() => setHoveredCite(1)}
          onMouseLeave={() => setHoveredCite(null)}
          className="relative mx-0.5 inline-flex size-4 items-center justify-center rounded bg-foreground/20 text-sm font-medium text-foreground/60 hover:bg-foreground/20"
        >
          1
          {hoveredCite === 1 && (
            <span className="absolute bottom-full left-1/2 mb-1 -translate-x-1/2 whitespace-nowrap rounded border border-border bg-background px-2 py-1 text-sm text-muted-foreground shadow-sm">
              {sources[0].title}
            </span>
          )}
        </button>
        , affecting over 3.6 billion people worldwide
        <button
          onMouseEnter={() => setHoveredCite(2)}
          onMouseLeave={() => setHoveredCite(null)}
          className="relative mx-0.5 inline-flex size-4 items-center justify-center rounded bg-foreground/20 text-sm font-medium text-foreground/60 hover:bg-foreground/20"
        >
          2
          {hoveredCite === 2 && (
            <span className="absolute bottom-full left-1/2 mb-1 -translate-x-1/2 whitespace-nowrap rounded border border-border bg-background px-2 py-1 text-sm text-muted-foreground shadow-sm">
              {sources[1].title}
            </span>
          )}
        </button>
        . AI-driven climate models are now being used to predict weather patterns with unprecedented accuracy
        <button
          onMouseEnter={() => setHoveredCite(3)}
          onMouseLeave={() => setHoveredCite(null)}
          className="relative mx-0.5 inline-flex size-4 items-center justify-center rounded bg-foreground/20 text-sm font-medium text-foreground/60 hover:bg-foreground/20"
        >
          3
          {hoveredCite === 3 && (
            <span className="absolute bottom-full left-1/2 mb-1 -translate-x-1/2 whitespace-nowrap rounded border border-border bg-background px-2 py-1 text-sm text-muted-foreground shadow-sm">
              {sources[2].title}
            </span>
          )}
        </button>
        .
      </div>

      <div className="mt-4 space-y-1.5 border-t border-foreground/15 pt-3">
        <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Sources</p>
        {sources.map((s) => (
          <div
            key={s.id}
            className={`flex items-center gap-2 rounded px-2 py-1.5 text-sm transition-colors ${
              hoveredCite === s.id ? "bg-foreground/15" : ""
            }`}
          >
            <span className="flex size-4 items-center justify-center rounded bg-foreground/20 text-sm text-foreground/60">
              {s.id}
            </span>
            <span className="text-muted-foreground">{s.title}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── Multimodal File Upload ─── */
export function MultimodalFileUploadPreview() {
  const [files, setFiles] = useState<{ name: string; type: string; size: string }[]>([])
  const [dragOver, setDragOver] = useState(false)

  function addFile() {
    const samples = [
      { name: "report.pdf", type: "PDF", size: "2.4 MB" },
      { name: "screenshot.png", type: "Image", size: "840 KB" },
      { name: "data.csv", type: "CSV", size: "156 KB" },
    ]
    if (files.length < 3) {
      setFiles((prev) => [...prev, samples[prev.length]])
    }
  }

  return (
    <div className="mx-auto w-full max-w-lg p-8">
      <div
        onClick={addFile}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        className={`cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
          dragOver ? "border-foreground/30 bg-foreground/[0.02]" : "border-foreground/15"
        }`}
      >
        <svg className="mx-auto size-8 text-muted-foreground/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        <p className="mt-2 text-sm text-muted-foreground">
          Drop files here or click to browse
        </p>
        <p className="mt-1 text-sm text-muted-foreground/80">
          PDF, Images, CSV, TXT up to 10MB
        </p>
      </div>

      {files.length > 0 && (
        <div className="mt-3 space-y-1.5">
          {files.map((f) => (
            <div
              key={f.name}
              className="flex items-center justify-between rounded-md border border-border px-3 py-2"
            >
              <div className="flex items-center gap-2">
                <span className="rounded bg-muted px-1.5 py-0.5 text-sm font-medium text-muted-foreground">
                  {f.type}
                </span>
                <span className="text-sm text-foreground">{f.name}</span>
              </div>
              <span className="text-sm text-muted-foreground">{f.size}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ─── Conversation History Sidebar ─── */
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
    <div className="mx-auto w-full max-w-lg p-8">
      <div className="rounded-lg border border-border shadow-sm">
        <div className="border-b border-foreground/15 px-3 py-2.5">
          <div className="flex h-7 items-center rounded-md border border-foreground/15 bg-muted/50 px-2">
            <svg className="mr-1.5 size-3 text-muted-foreground/80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <span className="text-sm text-muted-foreground/80">Search conversations…</span>
          </div>
        </div>
        <div className="max-h-[220px] overflow-y-auto p-1.5">
          {groups.map((group) => (
            <div key={group}>
              <p className="px-2 pb-1 pt-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground/80">
                {group}
              </p>
              {conversations
                .filter((c) => c.group === group)
                .map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => setActiveId(conv.id)}
                    className={`flex w-full items-center justify-between rounded-md px-2.5 py-2 text-left transition-colors ${
                      activeId === conv.id
                        ? "bg-foreground/[0.05] text-foreground"
                        : "text-muted-foreground hover:bg-card"
                    }`}
                  >
                    <span className="truncate text-sm">{conv.title}</span>
                    <span className="shrink-0 text-sm text-muted-foreground/80">{conv.time}</span>
                  </button>
                ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─── Message Branch Navigator ─── */
export function MessageBranchNavigatorPreview() {
  const [branch, setBranch] = useState(0)
  const branches = [
    "Quantum computing uses qubits that exist in superposition, allowing parallel computation.",
    "Quantum computing harnesses quantum mechanics to process information in fundamentally new ways.",
    "At its core, quantum computing leverages entanglement and superposition for exponential speedups.",
  ]

  return (
    <div className="mx-auto w-full max-w-lg p-8">
      <div className="space-y-3">
        <div className="rounded-lg bg-foreground/15 px-4 py-3 text-sm text-foreground">
          Explain quantum computing simply
        </div>
        <div className="rounded-lg border border-border shadow-sm px-4 py-3">
          <p className="text-sm leading-relaxed text-foreground">{branches[branch]}</p>
          <div className="mt-3 flex items-center justify-between border-t border-foreground/15 pt-2">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setBranch((p) => Math.max(0, p - 1))}
                disabled={branch === 0}
                className="flex size-6 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted disabled:opacity-50"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <span className="text-sm tabular-nums text-muted-foreground">
                {branch + 1} / {branches.length}
              </span>
              <button
                onClick={() => setBranch((p) => Math.min(branches.length - 1, p + 1))}
                disabled={branch === branches.length - 1}
                className="flex size-6 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted disabled:opacity-50"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
            <span className="text-sm text-muted-foreground/80">
              Branch {branch + 1}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
