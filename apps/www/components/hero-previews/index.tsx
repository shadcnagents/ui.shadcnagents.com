"use client"

import { motion } from "motion/react"
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

/* -------------------------------------------------------------------------- */
/*                           Preview: generateText                             */
/* -------------------------------------------------------------------------- */

export function GenerateTextPreview() {
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
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-sm leading-relaxed text-foreground"
                >
                  Quantum computing uses <span className="font-medium text-violet-600">qubits</span> instead of regular bits.
                </motion.p>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-sm leading-relaxed text-muted-foreground"
                >
                  While a regular bit is either 0 or 1, a qubit can be both at the same time through <span className="font-medium text-foreground">superposition</span>.
                </motion.p>
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
          <div className="size-2 rounded-full bg-emerald-500" />
          <span className="text-xs text-muted-foreground">Generated in 1.2s</span>
        </motion.div>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*                            Preview: streamText                              */
/* -------------------------------------------------------------------------- */

export function StreamTextPreview() {
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
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-foreground"
                >
                  Lines of logic flow
                </motion.p>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-foreground"
                >
                  Debugging through the long night
                </motion.p>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="text-foreground"
                >
                  <span>Finally, it works</span>
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="inline-block w-0.5 h-4 bg-foreground ml-0.5 align-middle"
                  />
                </motion.p>
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
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="size-2 rounded-full bg-blue-500"
            />
            <span className="text-xs text-muted-foreground">Streaming...</span>
          </div>
          <div className="text-xs text-muted-foreground">42 tokens</div>
        </motion.div>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*                              Preview: tool                                  */
/* -------------------------------------------------------------------------- */

export function ToolPreview() {
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
            <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 dark:border-amber-900 dark:bg-amber-950">
              <Database className="size-4 text-amber-600" />
              <span className="text-xs font-medium text-amber-700 dark:text-amber-400">
                Calling weather tool...
              </span>
            </div>

            {/* Tool result */}
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
                    <p className="text-sm text-muted-foreground">Partly cloudy</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">22°C</p>
                  <p className="text-xs text-muted-foreground">Feels like 24°</p>
                </div>
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-sm text-muted-foreground"
            >
              It&apos;s currently 22°C and partly cloudy in Tokyo. Great weather for a walk!
            </motion.p>
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
  return (
    <div className="relative h-full rounded-xl border border-border bg-muted/30 overflow-hidden">
      <DotPattern />
      <div className="relative z-10 flex h-full flex-col p-6">
        <div className="flex-1 space-y-5">
          <ChatBubble align="right">update this deal pls</ChatBubble>

          {/* Entity: Basepoint // Greenleaf */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="space-y-2.5"
          >
            <EntityHeader
              icon={<div className="size-3 rounded-full bg-gradient-to-br from-slate-400 to-slate-600" />}
              iconBg="bg-slate-100 dark:bg-slate-800"
              title="Basepoint // Greenleaf"
              delay={0.15}
            />
            <div className="space-y-2 pl-8">
              <ActionCard label="Update Deal Stage" value="Negotiation" valueColor="text-amber-600" delay={0.2} />
              <ActionCard label="Update Next Step" value="Joshua to send documentation on..." delay={0.3} />
            </div>
          </motion.div>

          {/* Entity: Drew Houston */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-2.5"
          >
            <EntityHeader
              icon={<span className="text-[10px]">👤</span>}
              iconBg="bg-orange-100 dark:bg-orange-900"
              title="Drew Houston"
              delay={0.4}
            />
            <div className="pl-8">
              <ActionCard label="Updated Role" value="Head of IT" delay={0.45} />
            </div>
          </motion.div>

          {/* Entity: Greenleaf */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="space-y-2.5"
          >
            <EntityHeader
              icon={<div className="size-3 rounded-full bg-emerald-500" />}
              iconBg="bg-emerald-100 dark:bg-emerald-900"
              title="Greenleaf"
              delay={0.55}
            />
            <div className="pl-8">
              <ActionCard label="Funding Raised" value="$100M - $250M" valueColor="text-blue-600" delay={0.6} />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*                         Preview: generateObject                             */
/* -------------------------------------------------------------------------- */

export function GenerateObjectPreview() {
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
              className="rounded-lg border border-border bg-zinc-950 p-4 font-mono text-xs"
            >
              <pre className="text-zinc-300">
{`{
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
}`}
              </pre>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-2"
            >
              <Check className="size-4 text-emerald-500" />
              <span className="text-xs text-emerald-600">Schema validated</span>
            </motion.div>
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
