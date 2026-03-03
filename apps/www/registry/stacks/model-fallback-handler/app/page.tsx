"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import {
  useModelFallback,
  ProviderStatusGrid,
  FallbackTimeline,
  ActiveProviderBadge,
  HealthCheckPanel,
  DEFAULT_PROVIDERS,
} from "../components/model-fallback"

export default function ModelFallbackDemo() {
  const [messages, setMessages] = useState<
    Array<{ id: string; role: "user" | "assistant"; content: string; provider?: string }>
  >([])
  const [input, setInput] = useState("")
  const [isChecking, setIsChecking] = useState(false)
  const [showConfig, setShowConfig] = useState(false)
  const [simulateFailure, setSimulateFailure] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  const {
    activeProvider,
    providerHealth,
    fallbackHistory,
    isProcessing,
    providers,
    sendMessage,
    switchProvider,
    checkHealth,
    reset,
  } = useModelFallback({
    providers: DEFAULT_PROVIDERS,
    maxRetriesPerProvider: 2,
    onFallback: (event) => {
      console.log("Fallback triggered:", event)
    },
    onAllProvidersFailed: () => {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "All providers are currently unavailable. Please try again later.",
        },
      ])
    },
  })

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isProcessing) return

    const userMessage = {
      id: crypto.randomUUID(),
      role: "user" as const,
      content: input.trim(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")

    // Add placeholder for assistant
    const assistantId = crypto.randomUUID()
    setMessages((prev) => [
      ...prev,
      { id: assistantId, role: "assistant", content: "", provider: activeProvider.id },
    ])

    await sendMessage({
      messages: [...messages, userMessage].map((m) => ({
        role: m.role,
        content: m.content,
      })),
      onChunk: (chunk) => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, content: m.content + chunk } : m
          )
        )
      },
      onComplete: (_, provider) => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, provider: provider.id } : m
          )
        )
      },
    })
  }

  const handleCheckHealth = async () => {
    setIsChecking(true)
    await checkHealth()
    setIsChecking(false)
  }

  const handleSimulateFailure = (providerId: string) => {
    setSimulateFailure(providerId)
    // This would be passed to the API to simulate failure
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <aside className="hidden w-80 shrink-0 border-r border-border/50 lg:block">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="shrink-0 border-b border-border/50 p-4">
            <h2 className="text-sm font-semibold">Provider Status</h2>
            <p className="text-xs text-muted-foreground">
              Click to manually switch providers
            </p>
          </div>

          {/* Provider grid */}
          <div className="flex-1 overflow-y-auto p-4">
            <ProviderStatusGrid
              providers={providers}
              health={providerHealth}
              activeProviderId={activeProvider.id}
              onSelect={switchProvider}
            />

            {/* Health check panel */}
            <div className="mt-4">
              <HealthCheckPanel
                providers={providers}
                health={providerHealth}
                onCheckHealth={handleCheckHealth}
                isChecking={isChecking}
              />
            </div>

            {/* Fallback timeline */}
            <div className="mt-6">
              <h3 className="mb-3 text-sm font-semibold">Fallback History</h3>
              <FallbackTimeline events={fallbackHistory} providers={providers} />
            </div>
          </div>

          {/* Reset button */}
          <div className="shrink-0 border-t border-border/50 p-4">
            <button
              onClick={reset}
              className="w-full rounded-lg bg-muted px-4 py-2 text-sm font-medium transition-colors hover:bg-muted/80"
            >
              Reset All Providers
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Header */}
        <header className="shrink-0 border-b border-border/50 bg-background/80 backdrop-blur-sm">
          <div className="flex h-14 items-center justify-between px-4">
            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-sm font-semibold">Model Fallback Handler</h1>
                <p className="text-xs text-muted-foreground">
                  Auto-switch providers on errors
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <ActiveProviderBadge
                provider={activeProvider}
                health={providerHealth.get(activeProvider.id)}
                isProcessing={isProcessing}
              />

              <button
                onClick={() => setShowConfig(!showConfig)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  showConfig
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {showConfig ? "Hide Demo" : "Test Fallback"}
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {showConfig ? (
            <FallbackTestPanel
              providers={providers}
              simulateFailure={simulateFailure}
              onSimulate={handleSimulateFailure}
              onClear={() => setSimulateFailure(null)}
            />
          ) : (
            <div className="flex h-full flex-col">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4">
                {messages.length === 0 ? (
                  <EmptyState />
                ) : (
                  <div className="mx-auto max-w-3xl space-y-4">
                    <AnimatePresence mode="popLayout">
                      {messages.map((m) => (
                        <MessageBubble
                          key={m.id}
                          message={m}
                          providers={providers}
                        />
                      ))}
                    </AnimatePresence>

                    {isProcessing && messages[messages.length - 1]?.content === "" && (
                      <LoadingIndicator provider={activeProvider} />
                    )}

                    <div ref={bottomRef} />
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="shrink-0 border-t border-border/50 p-4">
                <form
                  onSubmit={handleSubmit}
                  className="mx-auto flex max-w-3xl gap-2"
                >
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Send a message to test fallback..."
                    disabled={isProcessing}
                    className="flex-1 rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none placeholder:text-muted-foreground/50 focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={isProcessing || !input.trim()}
                    className="rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
                  >
                    Send
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// MESSAGE BUBBLE
// ============================================================================

function MessageBubble({
  message,
  providers,
}: {
  message: { id: string; role: string; content: string; provider?: string }
  providers: typeof DEFAULT_PROVIDERS
}) {
  const provider = providers.find((p) => p.id === message.provider)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          message.role === "user"
            ? "rounded-br-sm bg-primary text-primary-foreground"
            : "rounded-bl-sm bg-muted"
        }`}
      >
        {message.content || "..."}

        {/* Provider badge for assistant messages */}
        {message.role === "assistant" && provider && message.content && (
          <div className="mt-2 flex items-center gap-1.5 border-t border-border/30 pt-2">
            <div
              className="flex size-4 items-center justify-center rounded"
              style={{ backgroundColor: `${provider.color}20` }}
            >
              <div className="scale-50" style={{ color: provider.color }}>
                {provider.icon}
              </div>
            </div>
            <span className="text-[10px] text-muted-foreground">
              via {provider.name}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  )
}

// ============================================================================
// LOADING INDICATOR
// ============================================================================

function LoadingIndicator({ provider }: { provider: typeof DEFAULT_PROVIDERS[0] }) {
  return (
    <div className="flex justify-start">
      <div className="rounded-2xl rounded-bl-sm bg-muted px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="size-1.5 rounded-full"
                style={{ backgroundColor: provider.color }}
                animate={{ y: [0, -4, 0] }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  delay: i * 0.1,
                }}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">
            Generating with {provider.name}...
          </span>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// EMPTY STATE
// ============================================================================

function EmptyState() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
      <div className="rounded-full bg-muted p-4">
        <ShieldIcon className="size-8 text-muted-foreground" />
      </div>
      <div>
        <p className="text-sm font-medium">Resilient AI Infrastructure</p>
        <p className="mt-1 text-xs text-muted-foreground max-w-sm">
          Send a message to test automatic provider fallback. If one provider
          fails, we&apos;ll seamlessly switch to the next available one.
        </p>
      </div>

      <div className="mt-4 grid gap-2 text-left">
        <FeatureItem text="Auto-switch on 429 rate limit errors" />
        <FeatureItem text="Fallback on 5xx server errors" />
        <FeatureItem text="Circuit breaker after repeated failures" />
        <FeatureItem text="Real-time provider health monitoring" />
      </div>
    </div>
  )
}

function FeatureItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex size-5 items-center justify-center rounded-full bg-emerald-500/10">
        <CheckIcon className="size-3 text-emerald-500" />
      </div>
      <span className="text-xs text-muted-foreground">{text}</span>
    </div>
  )
}

// ============================================================================
// FALLBACK TEST PANEL
// ============================================================================

function FallbackTestPanel({
  providers,
  simulateFailure,
  onSimulate,
  onClear,
}: {
  providers: typeof DEFAULT_PROVIDERS
  simulateFailure: string | null
  onSimulate: (id: string) => void
  onClear: () => void
}) {
  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-xl border border-border/50 bg-card p-6">
          <h2 className="text-lg font-semibold">Test Fallback Behavior</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Simulate provider failures to see automatic fallback in action
          </p>

          <div className="mt-6 space-y-4">
            {providers.map((provider) => (
              <div
                key={provider.id}
                className={`flex items-center justify-between rounded-lg border p-4 transition-colors ${
                  simulateFailure === provider.id
                    ? "border-destructive/50 bg-destructive/5"
                    : "border-border/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex size-10 items-center justify-center rounded-lg"
                    style={{ backgroundColor: `${provider.color}15` }}
                  >
                    <div style={{ color: provider.color }}>{provider.icon}</div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{provider.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {provider.model}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() =>
                    simulateFailure === provider.id
                      ? onClear()
                      : onSimulate(provider.id)
                  }
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    simulateFailure === provider.id
                      ? "bg-destructive text-destructive-foreground"
                      : "bg-muted hover:bg-muted/80"
                  }`}
                >
                  {simulateFailure === provider.id
                    ? "Stop Simulation"
                    : "Simulate 429"}
                </button>
              </div>
            ))}
          </div>

          {/* Instructions */}
          <div className="mt-6 rounded-lg bg-muted/50 p-4">
            <h3 className="text-sm font-semibold">How it works</h3>
            <ol className="mt-2 space-y-2 text-xs text-muted-foreground">
              <li>1. Click &quot;Simulate 429&quot; on any provider</li>
              <li>2. Send a message in the chat</li>
              <li>3. Watch the system automatically fallback to next provider</li>
              <li>4. Check the Fallback History in the sidebar</li>
            </ol>
          </div>

          {/* Code example */}
          <div className="mt-6">
            <h3 className="text-sm font-semibold mb-2">Usage</h3>
            <pre className="overflow-x-auto rounded-lg bg-zinc-950 p-4 text-xs text-zinc-100">
              <code>{`const { sendMessage, activeProvider } = useModelFallback({
  providers: [
    { id: "openai", model: "gpt-4o", priority: 1 },
    { id: "anthropic", model: "claude-sonnet-4-20250514", priority: 2 },
    { id: "google", model: "gemini-2.0-flash", priority: 3 },
  ],
  maxRetriesPerProvider: 2,
  onFallback: (event) => {
    console.log(\`Switched from \${event.fromProvider} to \${event.toProvider}\`)
  },
})

// Automatically handles 429, 500, 502, 503, 504 errors
await sendMessage({ messages, onChunk, onComplete })`}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// ICONS
// ============================================================================

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
    </svg>
  )
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
  )
}
