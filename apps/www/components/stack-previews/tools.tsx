"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { WaveDotsLoader, WAVE_KEYFRAMES, SPRING, FADE_UP, STAGGER } from "./shared"

/* ─── Perplexity Web Search ─── */
export function ClaudeWebSearchPreview() {
  const [query, setQuery] = useState("")
  const [phase, setPhase] = useState<"idle" | "searching" | "reading" | "done">("idle")
  const [visibleResults, setVisibleResults] = useState(0)

  const results = [
    {
      title: "Understanding Large Language Models",
      url: "arxiv.org/abs/2024.12345",
      snippet: "A comprehensive survey of LLM architectures, training methods, and deployment strategies for modern language models...",
      favicon: "📄",
    },
    {
      title: "Building Production AI Applications",
      url: "vercel.com/blog/ai-sdk-4",
      snippet: "Learn how to build and deploy AI-powered applications using the Vercel AI SDK and modern frameworks...",
      favicon: "▲",
    },
    {
      title: "The State of AI in 2025",
      url: "stateofai.report",
      snippet: "Annual report covering breakthroughs in machine learning, NLP, and computer vision research...",
      favicon: "📊",
    },
  ]

  function handleSearch() {
    if (!query.trim()) return
    setPhase("searching")
    setVisibleResults(0)
    setTimeout(() => {
      setPhase("reading")
      let count = 0
      const interval = setInterval(() => {
        count++
        setVisibleResults(count)
        if (count >= results.length) {
          clearInterval(interval)
          setTimeout(() => setPhase("done"), 400)
        }
      }, 500)
    }, 1200)
  }

  return (
    <div className="mx-auto w-full max-w-lg space-y-4 p-6">
      <style dangerouslySetInnerHTML={{ __html: WAVE_KEYFRAMES }} />

      <div className="flex items-end gap-2 rounded-2xl border border-border bg-background px-3 py-2 transition-all duration-150 focus-within:border-foreground/30 focus-within:shadow-md">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="Ask Perplexity anything..."
          className="h-9 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
        <motion.button
          onClick={handleSearch}
          disabled={phase === "searching" || phase === "reading"}
          whileTap={{ scale: 0.95 }}
          className={`h-9 shrink-0 rounded-xl px-4 text-sm font-medium transition-all duration-150 ${
            query.trim() && phase === "idle"
              ? "bg-primary text-primary-foreground"
              : "bg-foreground/10 text-muted-foreground/50"
          }`}
        >
          Search
        </motion.button>
      </div>

      {/* Searching state */}
      <AnimatePresence>
        {phase === "searching" && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ ...SPRING }}
            className="flex items-center gap-3 rounded-xl border border-border bg-card p-3"
          >
            <WaveDotsLoader />
            <div>
              <p className="text-sm font-medium text-foreground">Perplexity is searching...</p>
              <p className="text-xs text-muted-foreground">Querying multiple sources</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reading/revealing results */}
      <AnimatePresence>
        {(phase === "reading" || phase === "done") && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {phase === "reading" && <WaveDotsLoader />}
                {phase === "done" && (
                  <motion.svg
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
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
                )}
                <span className="font-mono text-xs tabular-nums text-muted-foreground">
                  {phase === "reading" ? `Perplexity reading ${visibleResults}/${results.length}` : `${results.length} results`}
                </span>
              </div>
              {phase === "done" && (
                <button
                  onClick={() => { setPhase("idle"); setVisibleResults(0) }}
                  className="font-mono text-xs text-muted-foreground transition-all duration-150 hover:text-foreground"
                >
                  clear
                </button>
              )}
            </div>

            {results.slice(0, visibleResults).map((result, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...SPRING }}
                className="rounded-xl border border-border p-3 transition-all duration-150 hover:bg-card"
              >
                <div className="flex items-start gap-2.5">
                  <span className="mt-0.5 text-sm">{result.favicon}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground">
                      {result.title}
                    </p>
                    <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                      {result.url}
                    </p>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                      {result.snippet}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ─── Exa Web Search ─── */
export function ExaWebSearchPreview() {
  const [query, setQuery] = useState("")
  const [phase, setPhase] = useState<"idle" | "searching" | "done">("idle")

  const results = [
    {
      title: "Neural Search: Beyond Keyword Matching",
      url: "blog.exa.ai/neural-search",
      score: 0.95,
      snippet: "How neural search understands semantic meaning to deliver more relevant results...",
    },
    {
      title: "Embeddings for Information Retrieval",
      url: "research.google/embeddings",
      score: 0.89,
      snippet: "Dense vector representations enable similarity-based document retrieval...",
    },
    {
      title: "Retrieval Augmented Generation Explained",
      url: "docs.anthropic.com/rag",
      score: 0.84,
      snippet: "Combining retrieval with generation for more accurate and grounded AI responses...",
    },
  ]

  function handleSearch() {
    if (!query.trim() || phase === "searching") return
    setPhase("searching")
    setTimeout(() => setPhase("done"), 1500)
  }

  return (
    <div className="mx-auto w-full max-w-lg space-y-4 p-6">
      <style dangerouslySetInnerHTML={{ __html: WAVE_KEYFRAMES }} />

      <div className="flex items-end gap-2 rounded-2xl border border-border bg-background px-3 py-2 transition-all duration-150 focus-within:border-foreground/30 focus-within:shadow-md">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="Find papers about neural information retrieval"
          className="h-9 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
        <motion.button
          onClick={handleSearch}
          disabled={phase === "searching"}
          whileTap={{ scale: 0.95 }}
          className={`h-9 shrink-0 rounded-xl px-4 text-sm font-medium transition-all duration-150 ${
            query.trim() && phase !== "searching"
              ? "bg-primary text-primary-foreground"
              : "bg-foreground/10 text-muted-foreground/50"
          }`}
        >
          Search
        </motion.button>
      </div>

      <AnimatePresence>
        {phase === "searching" && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ ...SPRING }}
            className="flex items-center gap-3 rounded-xl border border-border bg-card p-3"
          >
            <WaveDotsLoader />
            <div>
              <p className="text-sm font-medium text-foreground">Exa neural search...</p>
              <p className="text-xs text-muted-foreground">Computing semantic embeddings</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {phase === "done" && (
          <motion.div
            initial="initial"
            animate="animate"
            variants={{ animate: { ...STAGGER } }}
            className="space-y-2"
          >
            {results.map((result, i) => (
              <motion.div
                key={i}
                variants={FADE_UP}
                transition={{ ...SPRING }}
                className="flex gap-3 rounded-xl border border-border p-3 transition-all duration-150 hover:bg-card"
              >
                <div className="shrink-0">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 font-mono text-xs font-semibold tabular-nums text-primary">
                    {result.score}
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground">
                    {result.title}
                  </p>
                  <p className="font-mono text-xs text-muted-foreground">
                    {result.url}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {result.snippet}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ─── Perplexity Scraper ─── */
export function CheerioScraperPreview() {
  const [url, setUrl] = useState("")
  const [phase, setPhase] = useState<"idle" | "scraping" | "done">("idle")

  const domTree = [
    { tag: "html", indent: 0 },
    { tag: "head", indent: 1 },
    { tag: "title", indent: 2, text: "Example Page" },
    { tag: "meta charset='utf-8'", indent: 2 },
    { tag: "body", indent: 1 },
    { tag: "header", indent: 2 },
    { tag: "h1", indent: 3, text: "Welcome" },
    { tag: "nav", indent: 3, text: "3 links" },
    { tag: "main", indent: 2 },
    { tag: "article", indent: 3, text: "1,247 words" },
    { tag: "footer", indent: 2, text: "Copyright 2025" },
  ]

  function handleScrape() {
    if (!url.trim() || phase !== "idle") return
    setPhase("scraping")
    setTimeout(() => setPhase("done"), 1400)
  }

  return (
    <div className="mx-auto w-full max-w-lg space-y-4 p-6">
      <style dangerouslySetInnerHTML={{ __html: WAVE_KEYFRAMES }} />

      <div className="flex items-end gap-2 rounded-2xl border border-border bg-background px-3 py-2 transition-all duration-150 focus-within:border-foreground/30 focus-within:shadow-md">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleScrape()}
          placeholder="https://example.com"
          className="h-9 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
        <motion.button
          onClick={handleScrape}
          whileTap={{ scale: 0.95 }}
          className={`h-9 shrink-0 rounded-xl px-4 text-sm font-medium transition-all duration-150 ${
            url.trim() && phase === "idle"
              ? "bg-primary text-primary-foreground"
              : "bg-foreground/10 text-muted-foreground/50"
          }`}
        >
          Scrape
        </motion.button>
      </div>

      <AnimatePresence>
        {phase === "scraping" && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ ...SPRING }}
            className="flex items-center gap-3 rounded-xl border border-border bg-card p-3"
          >
            <WaveDotsLoader />
            <div>
              <p className="text-sm font-medium text-foreground">Perplexity scraping page...</p>
              <p className="text-xs text-muted-foreground">Parsing DOM structure</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {phase === "done" && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING }}
            className="rounded-xl border border-border bg-card p-4"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Perplexity DOM Structure
              </span>
              <button
                onClick={() => { setPhase("idle"); setUrl("") }}
                className="font-mono text-xs text-muted-foreground transition-all duration-150 hover:text-foreground"
              >
                clear
              </button>
            </div>
            <motion.div
              initial="initial"
              animate="animate"
              variants={{ animate: { ...STAGGER } }}
              className="space-y-0.5 font-mono"
            >
              {domTree.map((node, i) => (
                <motion.div
                  key={i}
                  variants={FADE_UP}
                  transition={{ ...SPRING }}
                  className="flex items-baseline gap-1"
                  style={{ paddingLeft: `${node.indent * 16}px` }}
                >
                  <span className="text-xs text-primary">
                    &lt;{node.tag}&gt;
                  </span>
                  {node.text && (
                    <span className="text-xs text-foreground">
                      {node.text}
                    </span>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ─── Jina AI Scraper ─── */
export function JinaScraperPreview() {
  const [url, setUrl] = useState("")
  const [phase, setPhase] = useState<"idle" | "extracting" | "done">("idle")

  function handleExtract() {
    if (!url.trim() || phase !== "idle") return
    setPhase("extracting")
    setTimeout(() => setPhase("done"), 1400)
  }

  return (
    <div className="mx-auto w-full max-w-lg space-y-4 p-6">
      <style dangerouslySetInnerHTML={{ __html: WAVE_KEYFRAMES }} />

      <div className="flex items-end gap-2 rounded-2xl border border-border bg-background px-3 py-2 transition-all duration-150 focus-within:border-foreground/30 focus-within:shadow-md">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleExtract()}
          placeholder="https://example.com/blog/post"
          className="h-9 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
        <motion.button
          onClick={handleExtract}
          whileTap={{ scale: 0.95 }}
          className={`h-9 shrink-0 rounded-xl px-4 text-sm font-medium transition-all duration-150 ${
            url.trim() && phase === "idle"
              ? "bg-primary text-primary-foreground"
              : "bg-foreground/10 text-muted-foreground/50"
          }`}
        >
          Extract
        </motion.button>
      </div>

      <AnimatePresence>
        {phase === "extracting" && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ ...SPRING }}
            className="flex items-center gap-3 rounded-xl border border-border bg-card p-3"
          >
            <WaveDotsLoader />
            <div>
              <p className="text-sm font-medium text-foreground">Jina AI extracting content...</p>
              <p className="text-xs text-muted-foreground">Jina Reader API processing</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {phase === "done" && (
          <motion.div
            initial="initial"
            animate="animate"
            variants={{ animate: { ...STAGGER } }}
            className="space-y-3"
          >
            <motion.div
              variants={FADE_UP}
              transition={{ ...SPRING }}
              className="rounded-xl border border-border p-3"
            >
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-xs text-muted-foreground">Title</span>
                  <p className="mt-0.5 font-medium text-foreground">
                    Building AI-Powered Apps
                  </p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Author</span>
                  <p className="mt-0.5 font-medium text-foreground">Jane Smith</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Published</span>
                  <p className="mt-0.5 font-mono text-xs text-foreground">2025-01-15</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Word Count</span>
                  <p className="mt-0.5 font-mono text-xs text-foreground">2,340</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={FADE_UP}
              transition={{ ...SPRING }}
              className="rounded-xl border border-border bg-card p-4"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Jina AI Extracted Content
                </span>
                <button
                  onClick={() => { setPhase("idle"); setUrl("") }}
                  className="font-mono text-xs text-muted-foreground transition-all duration-150 hover:text-foreground"
                >
                  clear
                </button>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Building AI-powered applications has become more accessible with
                modern frameworks and APIs. This guide walks through the process
                of integrating language models into production applications,
                covering topics like streaming responses, tool calling, and
                agent orchestration...
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ─── Firecrawl Markdown Scraper ─── */
export function MarkdownScraperPreview() {
  const [url, setUrl] = useState("")
  const [phase, setPhase] = useState<"idle" | "converting" | "done">("idle")
  const [copied, setCopied] = useState(false)

  const markdown = `# Building AI Applications

Modern AI development requires understanding several key concepts.

## Prerequisites

- Node.js 18 or later
- An API key from your AI provider
- Basic knowledge of TypeScript

## Getting Started

\`\`\`typescript
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

const result = await generateText({
  model: openai("gpt-4o"),
  prompt: "Hello, world!",
})
\`\`\`

## Next Steps

Read the [documentation](https://docs.example.com) for more details.`

  function handleConvert() {
    if (phase === "converting") return
    setPhase("converting")
    setCopied(false)
    setTimeout(() => setPhase("done"), 1400)
  }

  function handleCopy() {
    navigator.clipboard.writeText(markdown).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }).catch(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="mx-auto w-full max-w-lg space-y-4 p-6">
      <style dangerouslySetInnerHTML={{ __html: WAVE_KEYFRAMES }} />

      <div className="flex items-end gap-2 rounded-2xl border border-border bg-background px-3 py-2 transition-all duration-150 focus-within:border-foreground/30 focus-within:shadow-md">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleConvert()}
          placeholder="https://docs.example.com/guide"
          className="h-9 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
        <motion.button
          onClick={handleConvert}
          disabled={phase === "converting"}
          whileTap={{ scale: 0.95 }}
          className={`h-9 shrink-0 rounded-xl px-4 text-sm font-medium transition-all duration-150 ${
            phase !== "converting"
              ? "bg-primary text-primary-foreground"
              : "bg-foreground/10 text-muted-foreground/50"
          }`}
        >
          Convert
        </motion.button>
      </div>

      <AnimatePresence>
        {phase === "converting" && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ ...SPRING }}
            className="flex items-center gap-3 rounded-xl border border-border bg-card p-3"
          >
            <WaveDotsLoader />
            <div>
              <p className="text-sm font-medium text-foreground">Firecrawl fetching page...</p>
              <p className="text-xs text-muted-foreground">Converting HTML to Markdown</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {phase === "done" && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING }}
            className="rounded-xl border border-border bg-card p-4"
          >
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Firecrawl Output
                </span>
                <span className="font-mono text-[10px] tabular-nums text-muted-foreground/40">
                  {markdown.length} chars
                </span>
              </div>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-xs text-muted-foreground transition-all duration-150 hover:text-foreground"
              >
                {copied ? (
                  <>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-primary">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Copied
                  </>
                ) : (
                  <>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect width="14" height="14" x="8" y="8" rx="2" />
                      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                    </svg>
                    Copy
                  </>
                )}
              </button>
            </div>
            <pre className="max-h-64 overflow-y-auto overflow-x-auto font-mono text-xs leading-relaxed text-foreground/80 [&::-webkit-scrollbar]:hidden">
              {markdown}
            </pre>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ─── ChatGPT PDF Analysis ─── */
export function PDFAnalysisPreview() {
  const [phase, setPhase] = useState<"upload" | "analyzing" | "done">("upload")

  function handleUpload() {
    setPhase("analyzing")
    setTimeout(() => setPhase("done"), 2000)
  }

  return (
    <div className="mx-auto w-full max-w-lg space-y-4 p-6">
      <style dangerouslySetInnerHTML={{ __html: WAVE_KEYFRAMES }} />

      <AnimatePresence mode="wait">
        {phase === "upload" && (
          <motion.div
            key="upload"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -8 }}
            onClick={handleUpload}
            className="flex h-32 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-border transition-all duration-150 hover:border-foreground/20 hover:bg-card"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-muted-foreground"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
            <p className="mt-2 text-sm text-muted-foreground">
              Drop PDF file or click to upload
            </p>
          </motion.div>
        )}

        {(phase === "analyzing" || phase === "done") && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3 rounded-xl border border-border p-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 font-mono text-xs font-semibold text-primary">
                PDF
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">
                  research-paper.pdf
                </p>
                <p className="font-mono text-xs text-muted-foreground">
                  2.4 MB · 12 pages
                </p>
              </div>
            </div>

            {phase === "analyzing" && (
              <div className="flex items-center gap-3 px-1">
                <WaveDotsLoader />
                <span className="text-sm text-muted-foreground">ChatGPT analyzing document...</span>
              </div>
            )}

            <AnimatePresence>
              {phase === "done" && (
                <motion.div
                  initial="initial"
                  animate="animate"
                  variants={{ animate: { ...STAGGER } }}
                  className="space-y-3"
                >
                  <motion.div
                    variants={FADE_UP}
                    transition={{ ...SPRING }}
                    className="rounded-xl border border-border bg-card p-4"
                  >
                    <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      ChatGPT Summary
                    </span>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      This research paper presents a novel approach to transformer
                      architecture optimization, achieving 40% reduction in
                      computational cost while maintaining model quality. Key
                      contributions include a new attention mechanism and efficient
                      training strategy.
                    </p>
                  </motion.div>

                  <motion.div
                    variants={FADE_UP}
                    transition={{ ...SPRING }}
                    className="grid grid-cols-3 gap-2"
                  >
                    {[
                      { label: "Pages", value: "12" },
                      { label: "Figures", value: "8" },
                      { label: "References", value: "47" },
                    ].map((stat) => (
                      <div
                        key={stat.label}
                        className="rounded-xl border border-border p-3 text-center"
                      >
                        <p className="font-mono text-lg font-semibold tabular-nums text-foreground">
                          {stat.value}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {stat.label}
                        </p>
                      </div>
                    ))}
                  </motion.div>

                  <motion.div
                    variants={FADE_UP}
                    transition={{ ...SPRING }}
                    className="border-t border-border pt-2"
                  >
                    <button
                      onClick={() => setPhase("upload")}
                      className="font-mono text-xs text-muted-foreground transition-all duration-150 hover:text-foreground"
                    >
                      reset
                    </button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
