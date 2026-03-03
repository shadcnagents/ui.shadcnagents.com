"use client"

import { useState, useCallback, useMemo, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "motion/react"

// ============================================================================
// TYPES
// ============================================================================

export interface SanitizeConfig {
  allowedTags?: string[]
  allowedAttributes?: Record<string, string[]>
  allowedSchemes?: string[]
  stripScripts?: boolean
  stripStyles?: boolean
  stripComments?: boolean
  stripDataAttributes?: boolean
}

export interface ThreatDetection {
  type: "script" | "event_handler" | "data_uri" | "javascript_uri" | "svg_injection" | "style_injection" | "comment_injection"
  severity: "critical" | "high" | "medium" | "low"
  match: string
  position: number
  description: string
}

export interface SanitizeResult {
  clean: string
  original: string
  threats: ThreatDetection[]
  stats: {
    tagsRemoved: number
    attributesRemoved: number
    totalThreats: number
  }
}

// ============================================================================
// DEFAULT CONFIG
// ============================================================================

export const DEFAULT_ALLOWED_TAGS = [
  "p", "br", "hr", "div", "span",
  "h1", "h2", "h3", "h4", "h5", "h6",
  "strong", "em", "b", "i", "u", "s", "mark", "small",
  "ul", "ol", "li",
  "blockquote", "pre", "code",
  "a", "img",
  "table", "thead", "tbody", "tr", "th", "td",
]

export const DEFAULT_ALLOWED_ATTRIBUTES: Record<string, string[]> = {
  a: ["href", "title", "target", "rel"],
  img: ["src", "alt", "title", "width", "height"],
  code: ["class"],
  pre: ["class"],
  "*": ["class", "id"],
}

export const DEFAULT_ALLOWED_SCHEMES = ["http", "https", "mailto"]

// ============================================================================
// THREAT PATTERNS
// ============================================================================

const THREAT_PATTERNS: Array<{
  pattern: RegExp
  type: ThreatDetection["type"]
  severity: ThreatDetection["severity"]
  description: string
}> = [
  {
    pattern: /<script[\s\S]*?<\/script>/gi,
    type: "script",
    severity: "critical",
    description: "Inline script tag detected",
  },
  {
    pattern: /<script[^>]*>/gi,
    type: "script",
    severity: "critical",
    description: "Script tag detected",
  },
  {
    pattern: /on\w+\s*=\s*["'][^"']*["']/gi,
    type: "event_handler",
    severity: "critical",
    description: "Event handler attribute detected (onclick, onerror, etc.)",
  },
  {
    pattern: /on\w+\s*=\s*[^\s>]+/gi,
    type: "event_handler",
    severity: "critical",
    description: "Unquoted event handler detected",
  },
  {
    pattern: /javascript\s*:/gi,
    type: "javascript_uri",
    severity: "critical",
    description: "JavaScript URI scheme detected",
  },
  {
    pattern: /data\s*:\s*[^,]*;base64/gi,
    type: "data_uri",
    severity: "high",
    description: "Base64 data URI detected",
  },
  {
    pattern: /<svg[\s\S]*?<\/svg>/gi,
    type: "svg_injection",
    severity: "high",
    description: "SVG element detected (can contain scripts)",
  },
  {
    pattern: /<style[\s\S]*?<\/style>/gi,
    type: "style_injection",
    severity: "medium",
    description: "Style tag detected",
  },
  {
    pattern: /style\s*=\s*["'][^"']*expression\s*\(/gi,
    type: "style_injection",
    severity: "critical",
    description: "CSS expression detected (IE vulnerability)",
  },
  {
    pattern: /<!--[\s\S]*?-->/g,
    type: "comment_injection",
    severity: "low",
    description: "HTML comment detected",
  },
]

// ============================================================================
// SANITIZE FUNCTION
// ============================================================================

export function sanitizeHTML(
  html: string,
  config: SanitizeConfig = {}
): SanitizeResult {
  const {
    allowedTags = DEFAULT_ALLOWED_TAGS,
    allowedAttributes = DEFAULT_ALLOWED_ATTRIBUTES,
    allowedSchemes = DEFAULT_ALLOWED_SCHEMES,
    stripScripts = true,
    stripStyles = true,
    stripComments = true,
    stripDataAttributes = true,
  } = config

  const threats: ThreatDetection[] = []
  let clean = html
  let tagsRemoved = 0
  let attributesRemoved = 0

  // Detect threats
  for (const { pattern, type, severity, description } of THREAT_PATTERNS) {
    let match
    const regex = new RegExp(pattern.source, pattern.flags)
    while ((match = regex.exec(html)) !== null) {
      threats.push({
        type,
        severity,
        match: match[0].slice(0, 100),
        position: match.index,
        description,
      })
    }
  }

  // Remove script tags
  if (stripScripts) {
    const before = clean
    clean = clean.replace(/<script[\s\S]*?<\/script>/gi, "")
    clean = clean.replace(/<script[^>]*>/gi, "")
    if (clean !== before) tagsRemoved++
  }

  // Remove style tags
  if (stripStyles) {
    const before = clean
    clean = clean.replace(/<style[\s\S]*?<\/style>/gi, "")
    if (clean !== before) tagsRemoved++
  }

  // Remove comments
  if (stripComments) {
    clean = clean.replace(/<!--[\s\S]*?-->/g, "")
  }

  // Remove event handlers
  const eventHandlerPattern = /\s+on\w+\s*=\s*["'][^"']*["']/gi
  const eventHandlerMatches = clean.match(eventHandlerPattern) || []
  attributesRemoved += eventHandlerMatches.length
  clean = clean.replace(eventHandlerPattern, "")

  // Remove unquoted event handlers
  clean = clean.replace(/\s+on\w+\s*=\s*[^\s>]+/gi, () => {
    attributesRemoved++
    return ""
  })

  // Remove javascript: URIs
  clean = clean.replace(/href\s*=\s*["']javascript:[^"']*["']/gi, 'href="#"')
  clean = clean.replace(/src\s*=\s*["']javascript:[^"']*["']/gi, 'src=""')

  // Remove data: URIs (except safe ones)
  clean = clean.replace(/src\s*=\s*["']data:[^"']*["']/gi, (match) => {
    // Allow safe data URIs for images
    if (match.match(/data:image\/(png|jpeg|gif|webp|svg\+xml);base64/i)) {
      return match
    }
    attributesRemoved++
    return 'src=""'
  })

  // Remove data-* attributes if configured
  if (stripDataAttributes) {
    clean = clean.replace(/\s+data-[a-z0-9-]+\s*=\s*["'][^"']*["']/gi, () => {
      attributesRemoved++
      return ""
    })
  }

  // Remove disallowed tags
  const tagPattern = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi
  clean = clean.replace(tagPattern, (match, tagName) => {
    if (allowedTags.includes(tagName.toLowerCase())) {
      return match
    }
    tagsRemoved++
    return ""
  })

  // Validate URLs in allowed attributes
  clean = clean.replace(/href\s*=\s*["']([^"']*)["']/gi, (match, url) => {
    try {
      const parsed = new URL(url, "https://example.com")
      if (!allowedSchemes.includes(parsed.protocol.replace(":", ""))) {
        attributesRemoved++
        return 'href="#"'
      }
    } catch {
      // Relative URL, allow it
    }
    return match
  })

  return {
    clean,
    original: html,
    threats,
    stats: {
      tagsRemoved,
      attributesRemoved,
      totalThreats: threats.length,
    },
  }
}

// ============================================================================
// HOOK: useSanitizedOutput
// ============================================================================

interface UseSanitizedOutputOptions {
  config?: SanitizeConfig
  onThreatDetected?: (threats: ThreatDetection[]) => void
}

export function useSanitizedOutput(options: UseSanitizedOutputOptions = {}) {
  const { config, onThreatDetected } = options
  const [lastResult, setLastResult] = useState<SanitizeResult | null>(null)

  const sanitize = useCallback(
    (html: string): string => {
      const result = sanitizeHTML(html, config)
      setLastResult(result)

      if (result.threats.length > 0) {
        onThreatDetected?.(result.threats)
      }

      return result.clean
    },
    [config, onThreatDetected]
  )

  const reset = useCallback(() => {
    setLastResult(null)
  }, [])

  return {
    sanitize,
    lastResult,
    reset,
  }
}

// ============================================================================
// SANITIZED CONTENT COMPONENT
// ============================================================================

interface SanitizedContentProps {
  content: string
  config?: SanitizeConfig
  showReport?: boolean
  className?: string
}

export function SanitizedContent({
  content,
  config,
  showReport = false,
  className,
}: SanitizedContentProps) {
  const result = useMemo(() => sanitizeHTML(content, config), [content, config])

  return (
    <div className={className}>
      <div
        dangerouslySetInnerHTML={{ __html: result.clean }}
        className="prose prose-sm dark:prose-invert max-w-none"
      />

      {showReport && result.threats.length > 0 && (
        <SanitizationReport result={result} />
      )}
    </div>
  )
}

// ============================================================================
// SANITIZATION REPORT
// ============================================================================

interface SanitizationReportProps {
  result: SanitizeResult
  expanded?: boolean
}

export function SanitizationReport({
  result,
  expanded = false,
}: SanitizationReportProps) {
  const [isExpanded, setIsExpanded] = useState(expanded)

  const criticalCount = result.threats.filter((t) => t.severity === "critical").length
  const highCount = result.threats.filter((t) => t.severity === "high").length

  if (result.threats.length === 0) {
    return (
      <div className="mt-3 flex items-center gap-2 rounded-lg bg-emerald-500/10 px-3 py-2">
        <ShieldCheckIcon className="size-4 text-emerald-500" />
        <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
          Content is safe - no threats detected
        </span>
      </div>
    )
  }

  return (
    <div className="mt-3 rounded-lg border border-amber-500/30 bg-amber-500/5">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between px-3 py-2"
      >
        <div className="flex items-center gap-2">
          <ShieldAlertIcon className="size-4 text-amber-500" />
          <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
            {result.threats.length} threat{result.threats.length > 1 ? "s" : ""} sanitized
          </span>

          {criticalCount > 0 && (
            <span className="rounded-full bg-red-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-red-600">
              {criticalCount} critical
            </span>
          )}
          {highCount > 0 && (
            <span className="rounded-full bg-orange-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-orange-600">
              {highCount} high
            </span>
          )}
        </div>

        <ChevronIcon
          className={`size-4 text-amber-500 transition-transform ${
            isExpanded ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Details */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="border-t border-amber-500/20 px-3 py-2 space-y-2">
              {result.threats.map((threat, i) => (
                <ThreatItem key={i} threat={threat} />
              ))}

              {/* Stats */}
              <div className="mt-3 flex gap-4 border-t border-amber-500/20 pt-2">
                <Stat label="Tags removed" value={result.stats.tagsRemoved} />
                <Stat label="Attributes removed" value={result.stats.attributesRemoved} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function ThreatItem({ threat }: { threat: ThreatDetection }) {
  const severityColors: Record<ThreatDetection["severity"], string> = {
    critical: "bg-red-500/20 text-red-600 dark:text-red-400",
    high: "bg-orange-500/20 text-orange-600 dark:text-orange-400",
    medium: "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400",
    low: "bg-zinc-500/20 text-zinc-600 dark:text-zinc-400",
  }

  return (
    <div className="rounded-md bg-background/50 p-2">
      <div className="flex items-center gap-2">
        <span
          className={`rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase ${
            severityColors[threat.severity]
          }`}
        >
          {threat.severity}
        </span>
        <span className="text-xs font-medium">{threat.description}</span>
      </div>
      <code className="mt-1 block overflow-hidden text-ellipsis whitespace-nowrap rounded bg-muted px-2 py-1 text-[10px] text-muted-foreground">
        {threat.match}
      </code>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="text-xs">
      <span className="text-muted-foreground">{label}: </span>
      <span className="font-semibold">{value}</span>
    </div>
  )
}

// ============================================================================
// LIVE PREVIEW COMPONENT
// ============================================================================

interface LiveSanitizePreviewProps {
  input: string
  config?: SanitizeConfig
}

export function LiveSanitizePreview({ input, config }: LiveSanitizePreviewProps) {
  const result = useMemo(() => sanitizeHTML(input, config), [input, config])
  const [showOriginal, setShowOriginal] = useState(false)

  return (
    <div className="rounded-xl border border-border/50 overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-border/50 bg-muted/30">
        <button
          onClick={() => setShowOriginal(false)}
          className={`flex-1 px-4 py-2.5 text-sm font-medium transition-colors ${
            !showOriginal
              ? "border-b-2 border-primary text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Sanitized Output
        </button>
        <button
          onClick={() => setShowOriginal(true)}
          className={`flex-1 px-4 py-2.5 text-sm font-medium transition-colors ${
            showOriginal
              ? "border-b-2 border-primary text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Original Input
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <AnimatePresence mode="wait">
          {showOriginal ? (
            <motion.div
              key="original"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <pre className="overflow-x-auto rounded-lg bg-zinc-950 p-4 text-xs text-zinc-100">
                <code>{result.original || "(empty)"}</code>
              </pre>
            </motion.div>
          ) : (
            <motion.div
              key="sanitized"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div
                dangerouslySetInnerHTML={{ __html: result.clean || "<em>No output</em>" }}
                className="prose prose-sm dark:prose-invert max-w-none min-h-[100px] rounded-lg bg-card p-4 border border-border/50"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Report */}
      <div className="border-t border-border/50 px-4 py-3">
        <SanitizationReport result={result} />
      </div>
    </div>
  )
}

// ============================================================================
// THREAT METER
// ============================================================================

interface ThreatMeterProps {
  threats: ThreatDetection[]
}

export function ThreatMeter({ threats }: ThreatMeterProps) {
  const critical = threats.filter((t) => t.severity === "critical").length
  const high = threats.filter((t) => t.severity === "high").length
  const medium = threats.filter((t) => t.severity === "medium").length
  const low = threats.filter((t) => t.severity === "low").length

  const total = threats.length
  const score = total === 0 ? 100 : Math.max(0, 100 - critical * 30 - high * 15 - medium * 5 - low * 2)

  const getColor = () => {
    if (score >= 90) return "text-emerald-500"
    if (score >= 70) return "text-yellow-500"
    if (score >= 50) return "text-orange-500"
    return "text-red-500"
  }

  return (
    <div className="flex items-center gap-4">
      {/* Score circle */}
      <div className="relative size-16">
        <svg className="size-16 -rotate-90" viewBox="0 0 36 36">
          <path
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            className="text-muted"
          />
          <motion.path
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeDasharray={`${score}, 100`}
            className={getColor()}
            initial={{ strokeDasharray: "0, 100" }}
            animate={{ strokeDasharray: `${score}, 100` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-lg font-bold ${getColor()}`}>{score}</span>
        </div>
      </div>

      {/* Breakdown */}
      <div className="space-y-1">
        <p className="text-sm font-semibold">Security Score</p>
        <div className="flex gap-3 text-xs">
          {critical > 0 && (
            <span className="text-red-500">{critical} critical</span>
          )}
          {high > 0 && (
            <span className="text-orange-500">{high} high</span>
          )}
          {medium > 0 && (
            <span className="text-yellow-500">{medium} medium</span>
          )}
          {low > 0 && (
            <span className="text-zinc-500">{low} low</span>
          )}
          {total === 0 && (
            <span className="text-emerald-500">No threats</span>
          )}
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// ICONS
// ============================================================================

function ShieldCheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
    </svg>
  )
}

function ShieldAlertIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286Zm0 13.036h.008v.008H12v-.008Z" />
    </svg>
  )
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
    </svg>
  )
}
