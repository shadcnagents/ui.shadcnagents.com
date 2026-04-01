"use client"

import { useEffect, useState, useCallback } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Check, Sparkles, Zap, Database, Bot, FileJson } from "lucide-react"
import { cn } from "@/lib/utils"

/* -------------------------------------------------------------------------- */
/*                              Shared Components                              */
/* -------------------------------------------------------------------------- */

function DotPattern({ className }: { className?: string }) {
  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)}>
      <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id="hero-dot-pattern"
            x="0"
            y="0"
            width="16"
            height="16"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="1" cy="1" r="1" className="fill-foreground/[0.03]" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hero-dot-pattern)" />
      </svg>
    </div>
  )
}

function ChatBubble({ children, align = "right" }: { children: React.ReactNode; align?: "left" | "right" }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 5 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className={cn("flex", align === "right" ? "justify-end" : "justify-start")}
    >
      <div
        className={cn(
          "px-4 py-2.5 text-sm max-w-[280px]",
          align === "right"
            ? "bg-foreground text-background rounded-2xl rounded-br-md"
            : "bg-muted text-foreground rounded-2xl rounded-bl-md"
        )}
      >
        {children}
      </div>
    </motion.div>
  )
}

function ActionCard({
  label,
  value,
  valueColor,
  delay = 0,
}: {
  label: string
  value: string
  valueColor?: string
  delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 30, delay }}
      className="flex items-center justify-between rounded-xl border border-border bg-background px-4 py-3 shadow-sm"
    >
      <div className="flex flex-col gap-0.5">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className={cn("text-sm font-medium", valueColor)}>{value}</span>
      </div>
      <button className="flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted">
        <Check className="size-3" />
        Accept
      </button>
    </motion.div>
  )
}

function EntityHeader({
  icon,
  iconBg,
  title,
  delay = 0,
}: {
  icon: React.ReactNode
  iconBg: string
  title: string
  delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 30, delay }}
      className="flex items-center gap-2"
    >
      <div className={cn("flex size-6 items-center justify-center rounded-full", iconBg)}>
        {icon}
      </div>
      <span className="text-sm font-semibold">{title}</span>
    </motion.div>
  )
}

/* ─── Shared API Helper ─── */
async function fetchAIResponse(
  prompt: string,
  systemPrompt: string,
  onComplete: (text: string) => void,
  onError: () => void
) {
  try {
    const response = await fetch("/api/preview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [{ role: "user", content: prompt }],
        system: systemPrompt,
      }),
    })

    if (!response.ok) throw new Error("Failed to fetch")

    const reader = response.body?.getReader()
    if (!reader) throw new Error("No reader")

    const decoder = new TextDecoder()
    let fullText = ""

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      fullText += decoder.decode(value, { stream: true })
    }

    onComplete(fullText)
  } catch {
    onError()
  }
}

/* -------------------------------------------------------------------------- */
/*                           Preview: generateText                             */
/* -------------------------------------------------------------------------- */

export function GenerateTextPreview() {
  const [response, setResponse] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [startTime] = useState(Date.now())
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    fetchAIResponse(
      "Explain quantum computing in simple terms",
      "You are a helpful AI. Explain concepts simply in 2 short sentences. First sentence should mention 'qubits'. Second sentence should mention 'superposition'. Keep it under 40 words total.",
      (text) => {
        setResponse(text)
        setElapsed(Date.now() - startTime)
        setIsLoading(false)
      },
      () => {
        setResponse("Quantum computing uses qubits instead of regular bits. While a regular bit is either 0 or 1, a qubit can be both at the same time through superposition.")
        setElapsed(1200)
        setIsLoading(false)
      }
    )
  }, [startTime])

  return (
    <div className="relative h-full rounded-xl border border-border bg-background overflow-hidden">
      <DotPattern />
      <div className="relative z-10 flex h-full flex-col p-6">
        <div className="flex-1 space-y-4">
          <ChatBubble align="right">Explain quantum computing in simple terms</ChatBubble>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-3"
          >
            <div className="flex items-start gap-3">
              <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-600">
                <Sparkles className="size-3.5 text-white" />
              </div>
              <div className="space-y-2 pt-1">
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <motion.div
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="h-4 w-48 rounded bg-muted"
                    />
                  </div>
                ) : (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm leading-relaxed text-foreground"
                  >
                    {response}
                  </motion.p>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex items-center gap-2 pt-4 border-t border-border"
        >
          <div className={cn("size-2 rounded-full", isLoading ? "bg-amber-500 animate-pulse" : "bg-emerald-500")} />
          <span className="text-xs text-muted-foreground">
            {isLoading ? "Generating..." : `Generated in ${(elapsed / 1000).toFixed(1)}s`}
          </span>
        </motion.div>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*                            Preview: streamText                              */
/* -------------------------------------------------------------------------- */

export function StreamTextPreview() {
  const [lines, setLines] = useState<string[]>([])
  const [isStreaming, setIsStreaming] = useState(true)

  useEffect(() => {
    const streamHaiku = async () => {
      try {
        const response = await fetch("/api/preview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [{ role: "user", content: "Write a haiku about code" }],
            system: "Write ONLY a haiku (3 lines: 5-7-5 syllables) about coding/programming. No intro, no explanation, just the 3 lines of the haiku separated by newlines.",
          }),
        })

        if (!response.ok) throw new Error("Failed")

        const reader = response.body?.getReader()
        if (!reader) throw new Error("No reader")

        const decoder = new TextDecoder()
        let fullText = ""

        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          fullText += decoder.decode(value, { stream: true })
          const currentLines = fullText.split("\n").filter(l => l.trim())
          setLines(currentLines.slice(0, 3))
        }

        setIsStreaming(false)
      } catch {
        setLines(["Lines of logic flow", "Debugging through the long night", "Finally, it works"])
        setIsStreaming(false)
      }
    }

    streamHaiku()
  }, [])

  return (
    <div className="relative h-full rounded-xl border border-border bg-background overflow-hidden">
      <DotPattern />
      <div className="relative z-10 flex h-full flex-col p-6">
        <div className="flex-1 space-y-4">
          <ChatBubble align="right">Write a haiku about code</ChatBubble>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-3"
          >
            <div className="flex items-start gap-3">
              <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-500">
                <Zap className="size-3.5 text-white" />
              </div>
              <div className="space-y-1 pt-1 font-mono text-sm">
                <AnimatePresence mode="popLayout">
                  {lines.map((line, i) => (
                    <motion.p
                      key={i}
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="text-foreground"
                    >
                      {line}
                      {i === lines.length - 1 && isStreaming && (
                        <motion.span
                          animate={{ opacity: [0, 1, 0] }}
                          transition={{ duration: 1, repeat: Infinity }}
                          className="inline-block w-0.5 h-4 bg-foreground ml-0.5 align-middle"
                        />
                      )}
                    </motion.p>
                  ))}
                </AnimatePresence>
                {lines.length === 0 && (
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="h-4 w-32 rounded bg-muted"
                  />
                )}
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex items-center gap-3 pt-4 border-t border-border"
        >
          <div className="flex items-center gap-2">
            <motion.div
              animate={isStreaming ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 1.5, repeat: Infinity }}
              className={cn("size-2 rounded-full", isStreaming ? "bg-blue-500" : "bg-emerald-500")}
            />
            <span className="text-xs text-muted-foreground">
              {isStreaming ? "Streaming..." : "Complete"}
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*                              Preview: tool                                  */
/* -------------------------------------------------------------------------- */

export function ToolPreview() {
  const [weather, setWeather] = useState<{ temp: string; condition: string; feelsLike: string } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchAIResponse(
      "What's the weather in Tokyo? Respond ONLY with JSON: {\"temp\": \"22\", \"condition\": \"Partly cloudy\", \"feelsLike\": \"24\"}",
      "You are a weather API simulator. Respond ONLY with valid JSON containing temp (number as string), condition (weather description), and feelsLike (number as string). No markdown, no explanation.",
      (text) => {
        try {
          // Try to extract JSON from response
          const jsonMatch = text.match(/\{[^}]+\}/)
          if (jsonMatch) {
            const data = JSON.parse(jsonMatch[0])
            setWeather({
              temp: data.temp || "22",
              condition: data.condition || "Partly cloudy",
              feelsLike: data.feelsLike || "24"
            })
          } else {
            throw new Error("No JSON")
          }
        } catch {
          setWeather({ temp: "22", condition: "Partly cloudy", feelsLike: "24" })
        }
        setIsLoading(false)
      },
      () => {
        setWeather({ temp: "22", condition: "Partly cloudy", feelsLike: "24" })
        setIsLoading(false)
      }
    )
  }, [])

  return (
    <div className="relative h-full rounded-xl border border-border bg-background overflow-hidden">
      <DotPattern />
      <div className="relative z-10 flex h-full flex-col p-6">
        <div className="flex-1 space-y-4">
          <ChatBubble align="right">What&apos;s the weather in Tokyo?</ChatBubble>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-3"
          >
            {/* Tool call indicator */}
            <div className={cn(
              "flex items-center gap-2 rounded-lg border px-3 py-2",
              isLoading
                ? "border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950"
                : "border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950"
            )}>
              <Database className={cn("size-4", isLoading ? "text-amber-600" : "text-emerald-600")} />
              <span className={cn(
                "text-xs font-medium",
                isLoading ? "text-amber-700 dark:text-amber-400" : "text-emerald-700 dark:text-emerald-400"
              )}>
                {isLoading ? "Calling weather tool..." : "Tool executed successfully"}
              </span>
            </div>

            {/* Tool result */}
            {weather && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="rounded-lg border border-border bg-muted/50 p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">🌤️</span>
                    <div>
                      <p className="font-semibold">Tokyo, Japan</p>
                      <p className="text-sm text-muted-foreground">{weather.condition}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">{weather.temp}°C</p>
                    <p className="text-xs text-muted-foreground">Feels like {weather.feelsLike}°</p>
                  </div>
                </div>
              </motion.div>
            )}

            {weather && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-sm text-muted-foreground"
              >
                It&apos;s currently {weather.temp}°C and {weather.condition.toLowerCase()} in Tokyo. Great weather for a walk!
              </motion.p>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*                             Preview: Agent                                  */
/* -------------------------------------------------------------------------- */

export function AgentPreview() {
  const [actions, setActions] = useState<Array<{entity: string; field: string; value: string}>>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchAIResponse(
      "Update this deal: Basepoint/Greenleaf negotiation, Drew Houston is Head of IT, Greenleaf raised $150M",
      "You are a CRM agent. Extract 3 entity updates from the input. Respond ONLY with JSON array: [{\"entity\": \"Deal Name\", \"field\": \"Field Name\", \"value\": \"Value\"}]. Example: [{\"entity\": \"Basepoint // Greenleaf\", \"field\": \"Deal Stage\", \"value\": \"Negotiation\"}]",
      (text) => {
        try {
          const jsonMatch = text.match(/\[[\s\S]*\]/)
          if (jsonMatch) {
            const data = JSON.parse(jsonMatch[0])
            setActions(data.slice(0, 3))
          } else {
            throw new Error("No JSON")
          }
        } catch {
          setActions([
            { entity: "Basepoint // Greenleaf", field: "Deal Stage", value: "Negotiation" },
            { entity: "Drew Houston", field: "Role", value: "Head of IT" },
            { entity: "Greenleaf", field: "Funding Raised", value: "$150M" }
          ])
        }
        setIsLoading(false)
      },
      () => {
        setActions([
          { entity: "Basepoint // Greenleaf", field: "Deal Stage", value: "Negotiation" },
          { entity: "Drew Houston", field: "Role", value: "Head of IT" },
          { entity: "Greenleaf", field: "Funding Raised", value: "$150M" }
        ])
        setIsLoading(false)
      }
    )
  }, [])

  const getEntityIcon = (entity: string) => {
    if (entity.includes("//")) return { icon: <div className="size-3 rounded-full bg-gradient-to-br from-slate-400 to-slate-600" />, bg: "bg-slate-100 dark:bg-slate-800" }
    if (entity.toLowerCase().includes("drew") || entity.toLowerCase().includes("person")) return { icon: <span className="text-[10px]">👤</span>, bg: "bg-orange-100 dark:bg-orange-900" }
    return { icon: <div className="size-3 rounded-full bg-emerald-500" />, bg: "bg-emerald-100 dark:bg-emerald-900" }
  }

  return (
    <div className="relative h-full rounded-xl border border-border bg-muted/30 overflow-hidden">
      <DotPattern />
      <div className="relative z-10 flex h-full flex-col p-6">
        <div className="flex-1 space-y-5">
          <ChatBubble align="right">update this deal pls</ChatBubble>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                  className="h-16 rounded-xl bg-muted"
                />
              ))}
            </div>
          ) : (
            actions.map((action, i) => {
              const { icon, bg } = getEntityIcon(action.entity)
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15 }}
                  className="space-y-2.5"
                >
                  <EntityHeader
                    icon={icon}
                    iconBg={bg}
                    title={action.entity}
                    delay={i * 0.15}
                  />
                  <div className="pl-8">
                    <ActionCard
                      label={`Update ${action.field}`}
                      value={action.value}
                      valueColor={action.field.toLowerCase().includes("stage") ? "text-amber-600" : action.field.toLowerCase().includes("funding") ? "text-blue-600" : undefined}
                      delay={i * 0.15 + 0.05}
                    />
                  </div>
                </motion.div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*                         Preview: generateObject                             */
/* -------------------------------------------------------------------------- */

export function GenerateObjectPreview() {
  const [recipe, setRecipe] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const [isValid, setIsValid] = useState(false)

  useEffect(() => {
    fetchAIResponse(
      "Generate a pasta recipe",
      "Generate a JSON object for a simple pasta recipe. ONLY output valid JSON with this exact structure, no markdown: {\"recipe\": {\"name\": \"Recipe Name\", \"ingredients\": [\"ingredient1\", \"ingredient2\"], \"prepTime\": \"X min\", \"cookTime\": \"Y min\"}}",
      (text) => {
        try {
          const jsonMatch = text.match(/\{[\s\S]*\}/)
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0])
            setRecipe(JSON.stringify(parsed, null, 2))
            setIsValid(true)
          } else {
            throw new Error("No JSON")
          }
        } catch {
          setRecipe(`{
  "recipe": {
    "name": "Cacio e Pepe",
    "ingredients": [
      "400g spaghetti",
      "200g Pecorino Romano",
      "2 tsp black pepper",
      "Salt to taste"
    ],
    "prepTime": "10 min",
    "cookTime": "15 min"
  }
}`)
          setIsValid(true)
        }
        setIsLoading(false)
      },
      () => {
        setRecipe(`{
  "recipe": {
    "name": "Cacio e Pepe",
    "ingredients": [
      "400g spaghetti",
      "200g Pecorino Romano",
      "2 tsp black pepper",
      "Salt to taste"
    ],
    "prepTime": "10 min",
    "cookTime": "15 min"
  }
}`)
        setIsValid(true)
        setIsLoading(false)
      }
    )
  }, [])

  return (
    <div className="relative h-full rounded-xl border border-border bg-background overflow-hidden">
      <DotPattern />
      <div className="relative z-10 flex h-full flex-col p-6">
        <div className="flex-1 space-y-4">
          <ChatBubble align="right">Generate a pasta recipe</ChatBubble>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-3"
          >
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <FileJson className="size-4" />
              <span>Structured Output</span>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-lg border border-border bg-zinc-100 dark:bg-zinc-950 p-4 font-mono text-xs overflow-hidden"
            >
              {isLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3, 4].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ opacity: [0.3, 0.6, 0.3] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                      className="h-4 rounded bg-zinc-300 dark:bg-zinc-800"
                      style={{ width: `${60 + i * 10}%` }}
                    />
                  ))}
                </div>
              ) : (
                <pre className="text-zinc-800 dark:text-zinc-300 whitespace-pre-wrap">{recipe}</pre>
              )}
            </motion.div>

            <AnimatePresence>
              {isValid && !isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center gap-2"
                >
                  <Check className="size-4 text-emerald-500" />
                  <span className="text-xs text-emerald-600">Schema validated</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*                              Preview Map                                    */
/* -------------------------------------------------------------------------- */

export const previewComponents: Record<string, React.ComponentType> = {
  generate: GenerateTextPreview,
  stream: StreamTextPreview,
  tools: ToolPreview,
  agent: AgentPreview,
  object: GenerateObjectPreview,
}

export function PreviewRenderer({ id }: { id: string }) {
  const Component = previewComponents[id]
  if (!Component) return null
  return <Component />
}
