"use client"

import { useState, useCallback, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"

/* ─────────────────────────────────────────────────────────────────────────────
 * Types
 * ───────────────────────────────────────────────────────────────────────────── */

interface StepToolCall {
  toolName: string
  args: Record<string, unknown>
}

interface AgentStep {
  toolCalls?: StepToolCall[]
}

interface AgentResult {
  text: string
  stepCount: number
  steps: AgentStep[]
}

interface ModePreset {
  id: string
  name: string
  icon: string
  temperature: number
  description: string
  color: string
}

interface ModelOption {
  id: string
  name: string
  provider: string
  costPer1k: number
}

/* ─────────────────────────────────────────────────────────────────────────────
 * Data
 * ───────────────────────────────────────────────────────────────────────────── */

const MODE_PRESETS: ModePreset[] = [
  {
    id: "creative",
    name: "Creative",
    icon: "✨",
    temperature: 0.9,
    description: "Imaginative and varied responses",
    color: "from-purple-500/20 to-pink-500/20",
  },
  {
    id: "precise",
    name: "Precise",
    icon: "🎯",
    temperature: 0.2,
    description: "Factual and deterministic",
    color: "from-blue-500/20 to-cyan-500/20",
  },
  {
    id: "coder",
    name: "Coder",
    icon: "💻",
    temperature: 0.0,
    description: "Strict code generation",
    color: "from-green-500/20 to-emerald-500/20",
  },
  {
    id: "balanced",
    name: "Balanced",
    icon: "⚖️",
    temperature: 0.5,
    description: "Best of both worlds",
    color: "from-orange-500/20 to-amber-500/20",
  },
]

const MODELS: ModelOption[] = [
  { id: "gpt-4o", name: "GPT-4o", provider: "OpenAI", costPer1k: 0.005 },
  { id: "gpt-4o-mini", name: "GPT-4o Mini", provider: "OpenAI", costPer1k: 0.00015 },
  { id: "claude-3-5-sonnet", name: "Claude 3.5 Sonnet", provider: "Anthropic", costPer1k: 0.003 },
  { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro", provider: "Google", costPer1k: 0.00125 },
]

const TOOLS = [
  { name: "search", icon: "🔍", description: "Web search" },
  { name: "analyze", icon: "📊", description: "Content analysis" },
]

/* ─────────────────────────────────────────────────────────────────────────────
 * Agent Composer Component
 * ───────────────────────────────────────────────────────────────────────────── */

export function AgentDemo() {
  const [prompt, setPrompt] = useState("")
  const [result, setResult] = useState<AgentResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeStep, setActiveStep] = useState(-1)

  // Configuration state
  const [selectedMode, setSelectedMode] = useState<string>("balanced")
  const [temperature, setTemperature] = useState(0.5)
  const [selectedModel, setSelectedModel] = useState<string>("gpt-4o")
  const [showSettings, setShowSettings] = useState(false)

  const currentMode = MODE_PRESETS.find((m) => m.id === selectedMode)
  const currentModel = MODELS.find((m) => m.id === selectedModel)

  // Sync temperature with mode
  const handleModeChange = useCallback((modeId: string) => {
    const mode = MODE_PRESETS.find((m) => m.id === modeId)
    if (mode) {
      setSelectedMode(modeId)
      setTemperature(mode.temperature)
    }
  }, [])

  // Keyboard shortcut: ⌘Enter to submit
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter" && prompt.trim() && !loading) {
        handleSubmit()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [prompt, loading])

  // Animate steps during loading
  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setActiveStep((prev) => (prev + 1) % 5)
      }, 800)
      return () => clearInterval(interval)
    } else {
      setActiveStep(-1)
    }
  }, [loading])

  async function handleSubmit() {
    if (!prompt.trim() || loading) return

    setLoading(true)
    setResult(null)
    setError(null)

    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: prompt.trim(),
          temperature,
          model: selectedModel,
        }),
      })
      if (!res.ok) throw new Error(await res.text())
      setResult(await res.json())
    } catch (err) {
      setError(err instanceof Error ? err.message : "Agent failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 text-lg">
            🤖
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Agent Composer</h1>
            <p className="text-sm text-muted-foreground">
              Multi-step AI agent with tool calling
            </p>
          </div>
        </div>
      </div>

      {/* Mode Presets */}
      <div className="mb-6">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground/60">
            Mode
          </span>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Settings
          </button>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {MODE_PRESETS.map((mode) => (
            <motion.button
              key={mode.id}
              onClick={() => handleModeChange(mode.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`relative flex flex-col items-center gap-1.5 rounded-xl border p-3 transition-all ${
                selectedMode === mode.id
                  ? "border-foreground/20 bg-gradient-to-br " + mode.color
                  : "border-transparent bg-muted/50 hover:bg-muted"
              }`}
            >
              <span className="text-xl">{mode.icon}</span>
              <span className="text-xs font-medium">{mode.name}</span>
              {selectedMode === mode.id && (
                <motion.div
                  layoutId="mode-indicator"
                  className="absolute -bottom-px left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full bg-foreground/60"
                />
              )}
            </motion.button>
          ))}
        </div>

        {currentMode && (
          <motion.p
            key={currentMode.id}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 text-center text-xs text-muted-foreground"
          >
            {currentMode.description}
          </motion.p>
        )}
      </div>

      {/* Advanced Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="mb-6 overflow-hidden"
          >
            <div className="space-y-4 rounded-xl border border-border/50 bg-muted/30 p-4">
              {/* Model Selector */}
              <div>
                <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-muted-foreground/60">
                  Model
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {MODELS.map((model) => (
                    <button
                      key={model.id}
                      onClick={() => setSelectedModel(model.id)}
                      className={`flex items-center justify-between rounded-lg border px-3 py-2 text-left text-sm transition-all ${
                        selectedModel === model.id
                          ? "border-foreground/20 bg-background"
                          : "border-transparent bg-muted/50 hover:bg-muted"
                      }`}
                    >
                      <div>
                        <div className="font-medium">{model.name}</div>
                        <div className="text-[10px] text-muted-foreground">{model.provider}</div>
                      </div>
                      <span className="font-mono text-[10px] text-muted-foreground">
                        ${model.costPer1k}/1k
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Temperature Slider */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground/60">
                    Temperature
                  </label>
                  <span className="font-mono text-sm tabular-nums text-foreground">
                    {temperature.toFixed(1)}
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={temperature}
                    onChange={(e) => setTemperature(parseFloat(e.target.value))}
                    className="h-2 w-full cursor-pointer appearance-none rounded-full bg-muted [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-foreground [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110"
                  />
                  <div className="mt-1 flex justify-between text-[10px] text-muted-foreground/60">
                    <span>Precise</span>
                    <span>Creative</span>
                  </div>
                </div>
              </div>

              {/* Available Tools */}
              <div>
                <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-muted-foreground/60">
                  Available Tools
                </label>
                <div className="flex gap-2">
                  {TOOLS.map((tool) => (
                    <div
                      key={tool.name}
                      className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-1.5"
                    >
                      <span>{tool.icon}</span>
                      <span className="text-xs font-medium">{tool.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Prompt Input */}
      <div className="relative mb-4">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="What would you like the agent to do?"
          rows={3}
          className="w-full resize-none rounded-xl border border-border/50 bg-muted/30 px-4 py-3 pr-24 text-sm outline-none transition-all placeholder:text-muted-foreground/40 focus:border-foreground/20 focus:bg-background focus:ring-2 focus:ring-foreground/5"
        />
        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          <span className="hidden text-[10px] text-muted-foreground/40 sm:block">⌘↵</span>
          <motion.button
            onClick={handleSubmit}
            disabled={loading || !prompt.trim()}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex h-8 items-center gap-2 rounded-lg bg-foreground px-3 text-xs font-medium text-background transition-colors hover:bg-foreground/90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {loading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="size-3 rounded-full border-2 border-background/30 border-t-background"
                />
                Running
              </>
            ) : (
              <>
                <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-7-7l7 7-7 7" />
                </svg>
                Run
              </>
            )}
          </motion.button>
        </div>
      </div>

      {/* Cost Estimate */}
      {currentModel && (
        <div className="mb-6 flex items-center justify-center gap-4 text-[11px] text-muted-foreground/60">
          <span>Est. cost: ~${(currentModel.costPer1k * 2).toFixed(4)}/request</span>
          <span>•</span>
          <span>Max 5 steps</span>
        </div>
      )}

      {/* Error State */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-4 flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3"
          >
            <svg className="size-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-red-500">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading State - Animated Steps */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mb-4 rounded-xl border border-border/50 bg-muted/20 p-4"
          >
            <div className="mb-3 flex items-center gap-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="size-4 rounded-full border-2 border-foreground/20 border-t-foreground"
              />
              <span className="text-xs font-medium text-muted-foreground">Agent thinking...</span>
            </div>
            <div className="flex gap-1">
              {[0, 1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  animate={{
                    opacity: activeStep === i ? 1 : 0.3,
                    scale: activeStep === i ? 1.1 : 1,
                  }}
                  className="h-1.5 flex-1 rounded-full bg-foreground/40"
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-4"
          >
            {/* Execution Trace */}
            <div className="rounded-xl border border-border/50 bg-muted/20 p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground/60">
                  Execution Trace
                </span>
                <span className="rounded-full bg-foreground/10 px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                  {result.stepCount} steps
                </span>
              </div>

              <div className="space-y-2">
                {result.steps.map((step, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    {/* Step indicator */}
                    <div className="flex flex-col items-center">
                      <div className="flex size-6 items-center justify-center rounded-full bg-foreground/10 text-[10px] font-medium text-foreground/60">
                        {i + 1}
                      </div>
                      {i < result.steps.length - 1 && (
                        <div className="h-8 w-px bg-border" />
                      )}
                    </div>

                    {/* Step content */}
                    <div className="flex-1 pb-2">
                      {step.toolCalls?.map((tc, j) => (
                        <div
                          key={j}
                          className="flex flex-wrap items-center gap-2"
                        >
                          <span className="inline-flex items-center gap-1 rounded-md bg-foreground/10 px-2 py-1 text-xs font-medium text-foreground/80">
                            {tc.toolName === "search" ? "🔍" : "📊"}
                            {tc.toolName}
                          </span>
                          <code className="max-w-[300px] truncate rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                            {JSON.stringify(tc.args)}
                          </code>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Final Response */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="rounded-xl border border-foreground/10 bg-gradient-to-br from-foreground/5 to-transparent p-4"
            >
              <div className="mb-2 flex items-center gap-2">
                <div className="flex size-5 items-center justify-center rounded-full bg-green-500/20 text-[10px]">
                  ✓
                </div>
                <span className="text-xs font-medium text-muted-foreground/60">
                  Final Response
                </span>
              </div>
              <p className="text-sm leading-relaxed text-foreground/90">
                {result.text}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {!loading && !result && !error && (
        <div className="py-8 text-center">
          <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-2xl bg-muted/50 text-2xl">
            💭
          </div>
          <p className="text-sm text-muted-foreground/60">
            Enter a prompt to start the agent
          </p>
          <p className="mt-1 text-xs text-muted-foreground/40">
            The agent will use tools to research and analyze
          </p>
        </div>
      )}
    </div>
  )
}
