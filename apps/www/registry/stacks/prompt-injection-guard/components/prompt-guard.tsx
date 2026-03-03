"use client"

import { useState, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "motion/react"

// ============================================================================
// TYPES
// ============================================================================

export interface ThreatPattern {
  id: string
  name: string
  pattern: RegExp
  severity: "critical" | "high" | "medium" | "low"
  description: string
  category: "jailbreak" | "extraction" | "manipulation" | "encoding"
}

export interface DetectionResult {
  isThreat: boolean
  threats: DetectedThreat[]
  riskScore: number
  sanitizedPrompt: string
  analysisTimeMs: number
}

export interface DetectedThreat {
  pattern: ThreatPattern
  match: string
  position: { start: number; end: number }
  confidence: number
}

export interface GuardConfig {
  enabledCategories?: ("jailbreak" | "extraction" | "manipulation" | "encoding")[]
  customPatterns?: ThreatPattern[]
  blockThreshold?: number
  sanitize?: boolean
}

// ============================================================================
// THREAT PATTERNS (OWASP LLM01 - Prompt Injection)
// ============================================================================

const THREAT_PATTERNS: ThreatPattern[] = [
  // JAILBREAK ATTEMPTS
  {
    id: "jailbreak-dan",
    name: "DAN (Do Anything Now)",
    pattern: /\b(DAN|do anything now|jailbreak|bypass|ignore previous|forget (your|all) (instructions|rules|training))\b/gi,
    severity: "critical",
    description: "Attempts to override safety guidelines using DAN-style prompts",
    category: "jailbreak",
  },
  {
    id: "jailbreak-roleplay",
    name: "Roleplay Jailbreak",
    pattern: /\b(pretend (you are|to be|you're)|act as|roleplay as|you are now|from now on you|imagine you are)\s*(an? )?(evil|unfiltered|uncensored|unrestricted)/gi,
    severity: "critical",
    description: "Malicious roleplay instructions to bypass restrictions",
    category: "jailbreak",
  },
  {
    id: "jailbreak-ignore",
    name: "Instruction Override",
    pattern: /\b(ignore|disregard|forget|override|bypass|circumvent)\s+(all\s+)?(previous|prior|above|earlier|system)\s*(instructions|prompts|rules|guidelines|restrictions)/gi,
    severity: "critical",
    description: "Direct attempts to override system instructions",
    category: "jailbreak",
  },
  {
    id: "jailbreak-developer",
    name: "Developer Mode Exploit",
    pattern: /\b(developer mode|debug mode|admin mode|root access|sudo|maintenance mode|god mode|test mode)\b/gi,
    severity: "high",
    description: "Attempts to activate fictitious privileged modes",
    category: "jailbreak",
  },

  // DATA EXTRACTION
  {
    id: "extraction-system",
    name: "System Prompt Extraction",
    pattern: /\b(what (is|are) your (instructions|system prompt|rules|guidelines)|repeat (your|the) (system|initial) (prompt|instructions)|print your (prompt|instructions)|show me your (prompt|rules))\b/gi,
    severity: "high",
    description: "Attempts to extract system prompt or instructions",
    category: "extraction",
  },
  {
    id: "extraction-api",
    name: "API Key Extraction",
    pattern: /\b(api[_\s]?key|secret[_\s]?key|access[_\s]?token|auth[_\s]?token|password|credentials|private[_\s]?key)\b/gi,
    severity: "critical",
    description: "Attempts to extract sensitive credentials",
    category: "extraction",
  },
  {
    id: "extraction-internal",
    name: "Internal Data Extraction",
    pattern: /\b(internal (data|documents|files)|confidential|proprietary|classified|sensitive (information|data)|database (dump|contents)|user (data|records))\b/gi,
    severity: "high",
    description: "Attempts to access internal or sensitive data",
    category: "extraction",
  },

  // MANIPULATION
  {
    id: "manipulation-injection",
    name: "SQL/Code Injection",
    pattern: /(SELECT\s+\*|DROP\s+TABLE|DELETE\s+FROM|INSERT\s+INTO|UNION\s+SELECT|exec\s*\(|eval\s*\(|__import__|subprocess|os\.system)/gi,
    severity: "critical",
    description: "SQL or code injection attempts",
    category: "manipulation",
  },
  {
    id: "manipulation-indirect",
    name: "Indirect Injection",
    pattern: /\b(when (you|the model) (see|read|encounter)|if .{0,30} then (ignore|override|forget)|<\/?system>|<\/?user>|<\/?assistant>|\[SYSTEM\]|\[INST\])/gi,
    severity: "high",
    description: "Indirect prompt injection via content",
    category: "manipulation",
  },
  {
    id: "manipulation-virtualization",
    name: "Prompt Virtualization",
    pattern: /\b(hypothetically|theoretically|in a (fictional|alternate) (world|scenario)|for educational purposes only|just for fun|let's play a game)\s+(what if|could you|would you)/gi,
    severity: "medium",
    description: "Attempts to create hypothetical scenarios for policy bypass",
    category: "manipulation",
  },

  // ENCODING ATTACKS
  {
    id: "encoding-base64",
    name: "Base64 Encoded Payload",
    pattern: /\b(decode|execute|run|eval).*base64|[A-Za-z0-9+/]{50,}={0,2}\b/gi,
    severity: "high",
    description: "Base64 encoded payloads that may hide malicious content",
    category: "encoding",
  },
  {
    id: "encoding-unicode",
    name: "Unicode Smuggling",
    pattern: /[\u200B-\u200D\uFEFF\u2060]|\\u00[0-9a-f]{2}|%[0-9a-f]{2}/gi,
    severity: "medium",
    description: "Hidden unicode characters or encoded sequences",
    category: "encoding",
  },
  {
    id: "encoding-homoglyph",
    name: "Homoglyph Attack",
    pattern: /[аеіорстухАЕІОРСТУХ]|[\u0430\u0435\u0456\u043E\u0440\u0441\u0442\u0443\u0445]/g,
    severity: "medium",
    description: "Cyrillic or lookalike characters that could bypass filters",
    category: "encoding",
  },
]

// ============================================================================
// HOOK: usePromptGuard
// ============================================================================

interface UsePromptGuardOptions extends GuardConfig {
  onThreatDetected?: (result: DetectionResult) => void
  onCleanPrompt?: (prompt: string) => void
}

export function usePromptGuard(options: UsePromptGuardOptions = {}) {
  const {
    enabledCategories = ["jailbreak", "extraction", "manipulation", "encoding"],
    customPatterns = [],
    blockThreshold = 50,
    sanitize = true,
    onThreatDetected,
    onCleanPrompt,
  } = options

  const [lastResult, setLastResult] = useState<DetectionResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [blockedCount, setBlockedCount] = useState(0)
  const [analyzedCount, setAnalyzedCount] = useState(0)

  // Combine built-in and custom patterns
  const allPatterns = useMemo(() => {
    const enabledPatterns = THREAT_PATTERNS.filter((p) =>
      enabledCategories.includes(p.category)
    )
    return [...enabledPatterns, ...customPatterns]
  }, [enabledCategories, customPatterns])

  // Analyze prompt for threats
  const analyzePrompt = useCallback(
    (prompt: string): DetectionResult => {
      const startTime = performance.now()
      const threats: DetectedThreat[] = []
      let sanitizedPrompt = prompt

      // Check each pattern
      for (const pattern of allPatterns) {
        const regex = new RegExp(pattern.pattern.source, pattern.pattern.flags)
        let match: RegExpExecArray | null

        while ((match = regex.exec(prompt)) !== null) {
          // Calculate confidence based on match length and pattern severity
          const severityWeight = {
            critical: 1.0,
            high: 0.8,
            medium: 0.6,
            low: 0.4,
          }

          const confidence = Math.min(
            0.95,
            severityWeight[pattern.severity] * (0.7 + match[0].length / 100)
          )

          threats.push({
            pattern,
            match: match[0],
            position: { start: match.index, end: match.index + match[0].length },
            confidence,
          })

          // Sanitize by redacting the match
          if (sanitize) {
            sanitizedPrompt = sanitizedPrompt.replace(match[0], "[REDACTED]")
          }
        }
      }

      // Calculate overall risk score (0-100)
      let riskScore = 0
      if (threats.length > 0) {
        const severityScores = threats.map((t) => {
          const base = { critical: 40, high: 25, medium: 15, low: 8 }
          return base[t.pattern.severity] * t.confidence
        })
        riskScore = Math.min(100, severityScores.reduce((a, b) => a + b, 0))
      }

      const result: DetectionResult = {
        isThreat: riskScore >= blockThreshold,
        threats,
        riskScore,
        sanitizedPrompt,
        analysisTimeMs: performance.now() - startTime,
      }

      return result
    },
    [allPatterns, blockThreshold, sanitize]
  )

  // Guard a prompt - returns true if safe, false if blocked
  const guardPrompt = useCallback(
    (prompt: string): { safe: boolean; result: DetectionResult } => {
      setIsAnalyzing(true)

      try {
        const result = analyzePrompt(prompt)
        setLastResult(result)
        setAnalyzedCount((c) => c + 1)

        if (result.isThreat) {
          setBlockedCount((c) => c + 1)
          onThreatDetected?.(result)
          return { safe: false, result }
        } else {
          onCleanPrompt?.(prompt)
          return { safe: true, result }
        }
      } finally {
        setIsAnalyzing(false)
      }
    },
    [analyzePrompt, onThreatDetected, onCleanPrompt]
  )

  // Get blocked rate
  const blockedRate = useMemo(() => {
    return analyzedCount > 0 ? (blockedCount / analyzedCount) * 100 : 0
  }, [blockedCount, analyzedCount])

  return {
    guardPrompt,
    analyzePrompt,
    lastResult,
    isAnalyzing,
    stats: {
      blockedCount,
      analyzedCount,
      blockedRate,
    },
  }
}

// ============================================================================
// THREAT INDICATOR
// ============================================================================

interface ThreatIndicatorProps {
  result: DetectionResult | null
}

export function ThreatIndicator({ result }: ThreatIndicatorProps) {
  if (!result) return null

  const riskLevel =
    result.riskScore >= 70
      ? "critical"
      : result.riskScore >= 40
        ? "high"
        : result.riskScore >= 20
          ? "medium"
          : "low"

  const colors = {
    critical: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30",
    high: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/30",
    medium: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
    low: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 ${colors[riskLevel]}`}
    >
      {result.isThreat ? (
        <ShieldAlertIcon className="size-4" />
      ) : (
        <ShieldCheckIcon className="size-4" />
      )}
      <span className="text-xs font-semibold uppercase">
        {result.isThreat ? "BLOCKED" : "SAFE"}
      </span>
      <span className="text-xs opacity-70">Risk: {result.riskScore.toFixed(0)}%</span>
      <span className="text-xs opacity-50">{result.analysisTimeMs.toFixed(1)}ms</span>
    </motion.div>
  )
}

// ============================================================================
// RISK METER
// ============================================================================

interface RiskMeterProps {
  riskScore: number
  threshold: number
}

export function RiskMeter({ riskScore, threshold }: RiskMeterProps) {
  const getColor = (score: number) => {
    if (score >= 70) return "bg-red-500"
    if (score >= 40) return "bg-orange-500"
    if (score >= 20) return "bg-amber-500"
    return "bg-emerald-500"
  }

  return (
    <div className="rounded-lg border border-border/50 bg-card p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium">Threat Risk Score</span>
        <span
          className={`text-lg font-bold ${
            riskScore >= threshold ? "text-red-500" : "text-emerald-500"
          }`}
        >
          {riskScore.toFixed(0)}%
        </span>
      </div>

      <div className="relative h-3 bg-muted rounded-full overflow-hidden">
        {/* Threshold marker */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-foreground/50 z-10"
          style={{ left: `${threshold}%` }}
        />

        {/* Risk bar */}
        <motion.div
          className={`h-full ${getColor(riskScore)}`}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, riskScore)}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>

      <div className="flex justify-between mt-1">
        <span className="text-[10px] text-muted-foreground">Safe</span>
        <span className="text-[10px] text-muted-foreground">
          Block threshold: {threshold}%
        </span>
        <span className="text-[10px] text-muted-foreground">Critical</span>
      </div>
    </div>
  )
}

// ============================================================================
// THREAT DETAILS
// ============================================================================

interface ThreatDetailsProps {
  threats: DetectedThreat[]
}

export function ThreatDetails({ threats }: ThreatDetailsProps) {
  if (threats.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="rounded-full bg-emerald-500/10 p-3">
          <ShieldCheckIcon className="size-6 text-emerald-500" />
        </div>
        <p className="mt-2 text-sm font-medium text-emerald-600 dark:text-emerald-400">
          No threats detected
        </p>
        <p className="text-xs text-muted-foreground">This prompt appears safe</p>
      </div>
    )
  }

  const severityColors = {
    critical: "bg-red-500/10 text-red-600 border-red-500/30",
    high: "bg-orange-500/10 text-orange-600 border-orange-500/30",
    medium: "bg-amber-500/10 text-amber-600 border-amber-500/30",
    low: "bg-zinc-500/10 text-zinc-600 border-zinc-500/30",
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <ShieldAlertIcon className="size-5 text-red-500" />
        <span className="text-sm font-semibold">
          {threats.length} threat{threats.length > 1 ? "s" : ""} detected
        </span>
      </div>

      <div className="space-y-2 max-h-[300px] overflow-y-auto">
        <AnimatePresence>
          {threats.map((threat, index) => (
            <motion.div
              key={`${threat.pattern.id}-${index}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="rounded-lg border border-border/50 bg-background p-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase ${severityColors[threat.pattern.severity]}`}
                    >
                      {threat.pattern.severity}
                    </span>
                    <span className="text-sm font-medium">{threat.pattern.name}</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {threat.pattern.description}
                  </p>
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {(threat.confidence * 100).toFixed(0)}% confidence
                </span>
              </div>

              <div className="mt-2 rounded bg-muted/50 px-2 py-1">
                <code className="text-xs text-red-600 dark:text-red-400">
                  "{threat.match}"
                </code>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

// ============================================================================
// GUARD STATS PANEL
// ============================================================================

interface GuardStatsPanelProps {
  stats: {
    blockedCount: number
    analyzedCount: number
    blockedRate: number
  }
}

export function GuardStatsPanel({ stats }: GuardStatsPanelProps) {
  return (
    <div className="rounded-xl border border-border/50 bg-card p-4">
      <h3 className="text-sm font-semibold mb-4">Guard Statistics</h3>

      <div className="grid grid-cols-3 gap-4">
        <StatCard
          label="Analyzed"
          value={stats.analyzedCount.toString()}
          icon={<ScanIcon className="size-4" />}
          color="blue"
        />
        <StatCard
          label="Blocked"
          value={stats.blockedCount.toString()}
          icon={<ShieldAlertIcon className="size-4" />}
          color="red"
        />
        <StatCard
          label="Block Rate"
          value={`${stats.blockedRate.toFixed(1)}%`}
          icon={<PercentIcon className="size-4" />}
          color={stats.blockedRate > 50 ? "red" : stats.blockedRate > 20 ? "amber" : "emerald"}
        />
      </div>

      {/* Blocked/Safe ratio bar */}
      <div className="mt-4">
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          <span>Blocked: {stats.blockedCount}</span>
          <span>Safe: {stats.analyzedCount - stats.blockedCount}</span>
        </div>
        <div className="flex h-2 overflow-hidden rounded-full bg-muted">
          <motion.div
            className="bg-red-500"
            initial={{ width: 0 }}
            animate={{
              width:
                stats.analyzedCount > 0
                  ? `${(stats.blockedCount / stats.analyzedCount) * 100}%`
                  : "0%",
            }}
            transition={{ duration: 0.5 }}
          />
          <motion.div
            className="bg-emerald-500"
            initial={{ width: 0 }}
            animate={{
              width:
                stats.analyzedCount > 0
                  ? `${((stats.analyzedCount - stats.blockedCount) / stats.analyzedCount) * 100}%`
                  : "0%",
            }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
    </div>
  )
}

function StatCard({
  label,
  value,
  icon,
  color,
}: {
  label: string
  value: string
  icon: React.ReactNode
  color: "emerald" | "amber" | "red" | "blue"
}) {
  const colorClasses = {
    emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    red: "bg-red-500/10 text-red-600 dark:text-red-400",
    blue: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  }

  return (
    <div className="rounded-lg border border-border/50 bg-background p-3">
      <div className={`inline-flex rounded-md p-1.5 ${colorClasses[color]}`}>{icon}</div>
      <p className="mt-2 text-lg font-bold">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  )
}

// ============================================================================
// PATTERN CATEGORIES
// ============================================================================

interface PatternCategoriesProps {
  enabledCategories: ("jailbreak" | "extraction" | "manipulation" | "encoding")[]
  onToggle: (category: "jailbreak" | "extraction" | "manipulation" | "encoding") => void
}

export function PatternCategories({ enabledCategories, onToggle }: PatternCategoriesProps) {
  const categories = [
    {
      id: "jailbreak" as const,
      name: "Jailbreak",
      description: "DAN, roleplay, instruction override",
      icon: <UnlockIcon className="size-4" />,
      count: THREAT_PATTERNS.filter((p) => p.category === "jailbreak").length,
    },
    {
      id: "extraction" as const,
      name: "Extraction",
      description: "System prompt, credentials, internal data",
      icon: <DatabaseIcon className="size-4" />,
      count: THREAT_PATTERNS.filter((p) => p.category === "extraction").length,
    },
    {
      id: "manipulation" as const,
      name: "Manipulation",
      description: "SQL injection, indirect injection",
      icon: <CodeIcon className="size-4" />,
      count: THREAT_PATTERNS.filter((p) => p.category === "manipulation").length,
    },
    {
      id: "encoding" as const,
      name: "Encoding",
      description: "Base64, unicode, homoglyphs",
      icon: <BinaryIcon className="size-4" />,
      count: THREAT_PATTERNS.filter((p) => p.category === "encoding").length,
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {categories.map((category) => {
        const isEnabled = enabledCategories.includes(category.id)
        return (
          <button
            key={category.id}
            onClick={() => onToggle(category.id)}
            className={`rounded-lg border p-3 text-left transition-colors ${
              isEnabled
                ? "border-foreground/20 bg-foreground/5"
                : "border-border/50 bg-card opacity-50 hover:opacity-75"
            }`}
          >
            <div className="flex items-center justify-between">
              <div
                className={`rounded-md p-1.5 ${
                  isEnabled
                    ? "bg-foreground/10 text-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {category.icon}
              </div>
              <span className="text-xs text-muted-foreground">
                {category.count} patterns
              </span>
            </div>
            <p className="mt-2 text-sm font-medium">{category.name}</p>
            <p className="text-xs text-muted-foreground">{category.description}</p>
          </button>
        )
      })}
    </div>
  )
}

// ============================================================================
// ICONS
// ============================================================================

function ShieldAlertIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
    </svg>
  )
}

function ShieldCheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
    </svg>
  )
}

function ScanIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
    </svg>
  )
}

function PercentIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z" />
    </svg>
  )
}

function UnlockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 1 1 9 0v3.75M3.75 21.75h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H3.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
    </svg>
  )
}

function DatabaseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
    </svg>
  )
}

function CodeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
    </svg>
  )
}

function BinaryIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
    </svg>
  )
}
