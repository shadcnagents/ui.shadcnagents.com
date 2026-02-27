"use client"

import { useState } from "react"

/* ─── Claude Web Search ─── */
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
    <div className="mx-auto w-full max-w-lg space-y-4 p-8">
      <div className="flex gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="Search the web..."
          className="h-9 flex-1 rounded-md border border-border/60 bg-transparent px-3 text-sm outline-none placeholder:text-muted-foreground focus:border-foreground/20"
        />
        <button
          onClick={handleSearch}
          disabled={phase === "searching" || phase === "reading"}
          className="h-9 rounded-md bg-foreground px-4 text-xs font-medium text-background transition-opacity disabled:opacity-50"
        >
          Search
        </button>
      </div>

      {/* Searching state */}
      {phase === "searching" && (
        <div className="flex items-center gap-3 rounded-md border border-border/60 bg-muted/40 p-3">
          <div className="size-4 animate-spin rounded-full border-2 border-foreground/15 border-t-foreground" />
          <div>
            <p className="text-xs font-medium text-foreground">Searching the web...</p>
            <p className="text-[12px] text-muted-foreground">Querying multiple sources</p>
          </div>
        </div>
      )}

      {/* Reading/revealing results */}
      {(phase === "reading" || phase === "done") && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {phase === "reading" && (
                <div className="size-3 animate-spin rounded-full border border-foreground/20 border-t-foreground" />
              )}
              {phase === "done" && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-emerald-600 dark:text-emerald-400">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
              <span className="text-[12px] text-muted-foreground">
                {phase === "reading" ? `Reading sources... (${visibleResults}/${results.length})` : `${results.length} results found`}
              </span>
            </div>
            {phase === "done" && (
              <button onClick={() => { setPhase("idle"); setVisibleResults(0) }} className="text-[12px] text-muted-foreground hover:text-muted-foreground">
                Clear
              </button>
            )}
          </div>
          {results.slice(0, visibleResults).map((result, i) => (
            <div key={i} className="animate-in fade-in slide-in-from-bottom-1 rounded-md border border-border/60 p-3 duration-300">
              <div className="flex items-start gap-2.5">
                <span className="mt-0.5 text-sm">{result.favicon}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground">
                    {result.title}
                  </p>
                  <p className="mt-0.5 text-[12px] text-muted-foreground">
                    {result.url}
                  </p>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                    {result.snippet}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ─── Exa Web Search ─── */
export function ExaWebSearchPreview() {
  const [query, setQuery] = useState("")
  const [searched, setSearched] = useState(false)

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

  return (
    <div className="mx-auto w-full max-w-lg space-y-4 p-8">
      <div className="space-y-2">
        <label className="text-xs font-medium text-muted-foreground">
          Neural Search Query
        </label>
        <div className="flex gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") setSearched(true)
            }}
            placeholder="Find papers about neural information retrieval"
            className="h-9 flex-1 rounded-md border border-border/60 bg-transparent px-3 text-sm outline-none placeholder:text-muted-foreground focus:border-foreground/20"
          />
          <button
            onClick={() => setSearched(true)}
            className="h-9 rounded-md bg-foreground px-4 text-xs font-medium text-background"
          >
            Search
          </button>
        </div>
      </div>

      {searched && (
        <div className="space-y-2">
          {results.map((result, i) => (
            <div
              key={i}
              className="flex gap-3 rounded-md border border-border/60 p-3"
            >
              <div className="shrink-0">
                <div className="flex size-8 items-center justify-center rounded-md bg-muted text-[12px] font-medium tabular-nums text-muted-foreground">
                  {result.score}
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground">
                  {result.title}
                </p>
                <p className="text-[12px] text-muted-foreground">
                  {result.url}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {result.snippet}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ─── Cheerio Scraper ─── */
export function CheerioScraperPreview() {
  const [url, setUrl] = useState("")
  const [scraped, setScraped] = useState(false)

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

  return (
    <div className="mx-auto w-full max-w-lg space-y-4 p-8">
      <div className="flex gap-2">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          className="h-9 flex-1 rounded-md border border-border/60 bg-transparent px-3 text-sm outline-none placeholder:text-muted-foreground focus:border-foreground/20"
        />
        <button
          onClick={() => setScraped(true)}
          className="h-9 rounded-md bg-foreground px-4 text-xs font-medium text-background"
        >
          Scrape
        </button>
      </div>

      {scraped && (
        <div className="rounded-md border border-border/60 bg-muted/40 p-4">
          <span className="text-[12px] font-medium uppercase tracking-wider text-muted-foreground">
            DOM Structure
          </span>
          <div className="mt-2 space-y-0.5 font-mono">
            {domTree.map((node, i) => (
              <div
                key={i}
                className="flex items-baseline gap-1"
                style={{ paddingLeft: `${node.indent * 16}px` }}
              >
                <span className="text-[13px] text-muted-foreground">
                  &lt;{node.tag}&gt;
                </span>
                {node.text && (
                  <span className="text-[13px] text-foreground/70">
                    {node.text}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/* ─── Jina AI Scraper ─── */
export function JinaScraperPreview() {
  const [url, setUrl] = useState("")
  const [scraped, setScraped] = useState(false)

  return (
    <div className="mx-auto w-full max-w-lg space-y-4 p-8">
      <div className="flex gap-2">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com/blog/post"
          className="h-9 flex-1 rounded-md border border-border/60 bg-transparent px-3 text-sm outline-none placeholder:text-muted-foreground focus:border-foreground/20"
        />
        <button
          onClick={() => setScraped(true)}
          className="h-9 rounded-md bg-foreground px-4 text-xs font-medium text-background"
        >
          Extract
        </button>
      </div>

      {scraped && (
        <div className="space-y-3">
          <div className="rounded-md border border-border/60 p-3">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-muted-foreground">Title</span>
                <p className="mt-0.5 font-medium text-foreground">
                  Building AI-Powered Apps
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Author</span>
                <p className="mt-0.5 font-medium text-foreground">Jane Smith</p>
              </div>
              <div>
                <span className="text-muted-foreground">Published</span>
                <p className="mt-0.5 text-foreground">2025-01-15</p>
              </div>
              <div>
                <span className="text-muted-foreground">Word Count</span>
                <p className="mt-0.5 text-foreground">2,340</p>
              </div>
            </div>
          </div>

          <div className="rounded-md border border-border/60 bg-muted/40 p-4">
            <span className="text-[12px] font-medium uppercase tracking-wider text-muted-foreground">
              Extracted Content
            </span>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              Building AI-powered applications has become more accessible with
              modern frameworks and APIs. This guide walks through the process
              of integrating language models into production applications,
              covering topics like streaming responses, tool calling, and
              agent orchestration...
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

/* ─── Markdown Scraper ─── */
export function MarkdownScraperPreview() {
  const [url, setUrl] = useState("")
  const [converting, setConverting] = useState(false)
  const [converted, setConverted] = useState(false)
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
    if (converting) return
    setConverting(true)
    setConverted(false)
    setCopied(false)
    setTimeout(() => {
      setConverting(false)
      setConverted(true)
    }, 1400)
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
    <div className="mx-auto w-full max-w-lg space-y-4 p-8">
      <div className="flex gap-2">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleConvert()}
          placeholder="https://docs.example.com/guide"
          className="h-9 flex-1 rounded-md border border-border/60 bg-transparent px-3 text-sm outline-none placeholder:text-muted-foreground focus:border-foreground/20"
        />
        <button
          onClick={handleConvert}
          disabled={converting}
          className="h-9 rounded-md bg-foreground px-4 text-xs font-medium text-background transition-opacity disabled:opacity-50"
        >
          {converting ? "Converting..." : "Convert"}
        </button>
      </div>

      {converting && (
        <div className="flex items-center gap-3 rounded-md border border-border/60 bg-muted/40 p-3">
          <div className="size-4 animate-spin rounded-full border-2 border-foreground/15 border-t-foreground" />
          <div>
            <p className="text-xs font-medium text-foreground">Fetching page...</p>
            <p className="text-[12px] text-muted-foreground">Converting HTML to Markdown</p>
          </div>
        </div>
      )}

      {converted && (
        <div className="rounded-md border border-border/60 bg-muted/40 p-4">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[12px] font-medium uppercase tracking-wider text-muted-foreground">
                Markdown Output
              </span>
              <span className="text-[12px] text-muted-foreground">
                {markdown.length} chars
              </span>
            </div>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 text-[12px] text-muted-foreground transition-colors hover:text-muted-foreground"
            >
              {copied ? (
                <>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-emerald-600 dark:text-emerald-400">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Copied!
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
          <pre className="max-h-64 overflow-y-auto overflow-x-auto text-[13px] leading-relaxed text-muted-foreground [&::-webkit-scrollbar]:hidden">
            {markdown}
          </pre>
        </div>
      )}
    </div>
  )
}

/* ─── PDF Analysis ─── */
export function PDFAnalysisPreview() {
  const [uploaded, setUploaded] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [done, setDone] = useState(false)

  function handleUpload() {
    setUploaded(true)
    setAnalyzing(true)
    setTimeout(() => {
      setAnalyzing(false)
      setDone(true)
    }, 2000)
  }

  return (
    <div className="mx-auto w-full max-w-lg space-y-4 p-8">
      {!uploaded ? (
        <div
          onClick={handleUpload}
          className="flex h-32 cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-border/60 transition-colors hover:border-foreground/20"
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
          <p className="mt-2 text-xs text-muted-foreground">
            Drop PDF file or click to upload
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-3 rounded-md border border-border/60 p-3">
            <div className="flex size-10 items-center justify-center rounded-md bg-muted text-[12px] font-medium text-muted-foreground">
              PDF
            </div>
            <div>
              <p className="text-xs font-medium text-foreground">
                research-paper.pdf
              </p>
              <p className="text-[12px] text-muted-foreground">
                2.4 MB · 12 pages
              </p>
            </div>
          </div>

          {analyzing && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="size-3 animate-spin rounded-full border border-foreground/20 border-t-foreground" />
              Analyzing document...
            </div>
          )}

          {done && (
            <div className="space-y-3">
              <div className="rounded-md border border-border/60 p-3">
                <span className="text-[12px] font-medium uppercase tracking-wider text-muted-foreground">
                  Document Summary
                </span>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  This research paper presents a novel approach to transformer
                  architecture optimization, achieving 40% reduction in
                  computational cost while maintaining model quality. Key
                  contributions include a new attention mechanism and efficient
                  training strategy.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "Pages", value: "12" },
                  { label: "Figures", value: "8" },
                  { label: "References", value: "47" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-md border border-border/60 p-2 text-center"
                  >
                    <p className="text-sm font-medium text-foreground">
                      {stat.value}
                    </p>
                    <p className="text-[12px] text-muted-foreground">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
