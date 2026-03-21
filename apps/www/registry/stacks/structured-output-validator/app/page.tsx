"use client"

import { useCallback, useState } from "react"
import { AnimatePresence, motion } from "motion/react"

import {
  JSONDiffViewer,
  RepairLog,
  SchemaEditor,
  useStructuredOutput,
  ValidationErrorsList,
  ValidationStatusBadge,
  ValidatorStatsPanel,
  type SchemaField,
  type ValidationResult,
} from "@/components/structured-validator"

// Example malformed JSON outputs for testing
const EXAMPLE_OUTPUTS = [
  {
    category: "Truncated Output",
    color: "red",
    examples: [
      {
        name: "Missing closing brackets",
        output: '{"name": "John", "age": 30, "address": {"city": "NYC"',
      },
      {
        name: "Cut off mid-string",
        output: '{"title": "The quick brown fox jumps over the la',
      },
      {
        name: "Incomplete array",
        output: '{"items": ["apple", "banana", "orange"',
      },
    ],
  },
  {
    category: "Format Issues",
    color: "amber",
    examples: [
      {
        name: "Trailing comma",
        output: '{"name": "John", "age": 30,}',
      },
      {
        name: "Single quotes",
        output: "{'name': 'John', 'age': 30}",
      },
      {
        name: "Unquoted keys",
        output: '{name: "John", age: 30}',
      },
    ],
  },
  {
    category: "Wrapper Issues",
    color: "orange",
    examples: [
      {
        name: "Markdown code block",
        output: '```json\n{"name": "John", "age": 30}\n```',
      },
      {
        name: "Leading text",
        output: 'Here is the JSON output:\n{"name": "John", "age": 30}',
      },
      {
        name: "Trailing explanation",
        output: '{"name": "John", "age": 30}\n\nThis JSON contains user data.',
      },
    ],
  },
  {
    category: "Valid JSON",
    color: "emerald",
    examples: [
      {
        name: "Clean output",
        output: '{"name": "John", "age": 30, "email": "john@example.com"}',
      },
      {
        name: "Nested object",
        output: '{"user": {"name": "John", "profile": {"bio": "Developer"}}}',
      },
    ],
  },
]

// Default schema for validation
const DEFAULT_SCHEMA: SchemaField[] = [
  { name: "name", type: "string", required: true },
  { name: "age", type: "number", required: false },
  { name: "email", type: "string", required: false },
]

export default function StructuredOutputValidatorPage() {
  const [input, setInput] = useState("")
  const [schema, setSchema] = useState<SchemaField[]>(DEFAULT_SCHEMA)
  const [enableRepair, setEnableRepair] = useState(true)
  const [strictMode, setStrictMode] = useState(false)
  const [activeTab, setActiveTab] = useState<"repairs" | "errors" | "diff">(
    "repairs"
  )

  const { validateOutput, lastResult, isValidating, stats } =
    useStructuredOutput({
      maxRetries: 3,
      enableAutoRepair: enableRepair,
      enableCorrectivePrompting: false,
      strictMode,
      schema,
    })

  const handleValidate = useCallback(async () => {
    if (!input.trim()) return
    await validateOutput(input)
  }, [input, validateOutput])

  const handleExampleClick = useCallback((output: string) => {
    setInput(output)
  }, [])

  return (
    <div className="min-h-svh bg-gradient-to-b from-background to-muted/30 p-6 md:p-10">
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-4 py-1.5 text-sm text-blue-600 dark:text-blue-400 mb-4">
            <ValidatorIcon className="size-4" />
            <span className="font-medium">Structured Output Validator</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            Auto-Repair Malformed JSON
          </h1>
          <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
            Automatically fix truncated, malformed, and wrapped LLM outputs.
            Schema validation with intelligent repair strategies.
          </p>
        </div>

        {/* Stats */}
        <ValidatorStatsPanel stats={stats} />

        {/* Configuration */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Options */}
          <div className="rounded-xl border border-border/50 bg-card p-4">
            <h3 className="text-sm font-semibold mb-4">Validator Options</h3>
            <div className="space-y-3">
              <label className="flex items-center justify-between">
                <span className="text-sm">Auto-repair enabled</span>
                <Switch
                  checked={enableRepair}
                  onCheckedChange={setEnableRepair}
                />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-sm">Strict schema mode</span>
                <Switch checked={strictMode} onCheckedChange={setStrictMode} />
              </label>
            </div>
          </div>

          {/* Schema */}
          <div className="rounded-xl border border-border/50 bg-card p-4">
            <SchemaEditor schema={schema} onChange={setSchema} />
          </div>
        </div>

        {/* Example Outputs */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-muted-foreground">
            Test with malformed examples:
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            {EXAMPLE_OUTPUTS.map((group) => (
              <div
                key={group.category}
                className={`rounded-lg border p-3 ${
                  group.color === "red"
                    ? "border-red-500/30 bg-red-500/5"
                    : group.color === "amber"
                      ? "border-amber-500/30 bg-amber-500/5"
                      : group.color === "orange"
                        ? "border-orange-500/30 bg-orange-500/5"
                        : "border-emerald-500/30 bg-emerald-500/5"
                }`}
              >
                <p
                  className={`text-xs font-semibold mb-2 ${
                    group.color === "red"
                      ? "text-red-600 dark:text-red-400"
                      : group.color === "amber"
                        ? "text-amber-600 dark:text-amber-400"
                        : group.color === "orange"
                          ? "text-orange-600 dark:text-orange-400"
                          : "text-emerald-600 dark:text-emerald-400"
                  }`}
                >
                  {group.category}
                </p>
                <div className="flex flex-wrap gap-2">
                  {group.examples.map((example) => (
                    <button
                      key={example.name}
                      onClick={() => handleExampleClick(example.output)}
                      className="rounded-full border border-border bg-background px-2.5 py-1 text-xs hover:bg-muted transition-colors"
                    >
                      {example.name}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="rounded-xl border border-border/50 bg-card p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium">LLM Output</span>
            <span className="text-xs text-muted-foreground">
              {input.length} characters
            </span>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='Paste malformed JSON here, e.g., {"name": "John", "age": 30'
            className="w-full h-32 rounded-lg border border-border bg-background px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring resize-none"
          />
          <div className="mt-3 flex items-center justify-between">
            <ValidationStatusBadge result={lastResult} />
            <button
              onClick={handleValidate}
              disabled={isValidating || !input.trim()}
              className="rounded-lg bg-foreground px-6 py-2 text-sm font-medium text-background hover:bg-foreground/90 transition-colors disabled:opacity-50"
            >
              {isValidating ? (
                <span className="flex items-center gap-2">
                  <LoadingSpinner className="size-4" />
                  Validating...
                </span>
              ) : (
                "Validate & Repair"
              )}
            </button>
          </div>
        </div>

        {/* Results */}
        <AnimatePresence mode="wait">
          {lastResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {/* Tabs */}
              <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-1">
                {(["repairs", "errors", "diff"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                      activeTab === tab
                        ? "bg-foreground text-background"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab === "repairs" && (
                      <span className="flex items-center justify-center gap-2">
                        <WrenchIcon className="size-4" />
                        Repairs ({lastResult.repairs.length})
                      </span>
                    )}
                    {tab === "errors" && (
                      <span className="flex items-center justify-center gap-2">
                        <AlertIcon className="size-4" />
                        Errors ({lastResult.validationErrors.length})
                      </span>
                    )}
                    {tab === "diff" && (
                      <span className="flex items-center justify-center gap-2">
                        <DiffIcon className="size-4" />
                        Diff View
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="rounded-xl border border-border/50 bg-card p-4">
                <AnimatePresence mode="wait">
                  {activeTab === "repairs" && (
                    <motion.div
                      key="repairs"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <RepairLog repairs={lastResult.repairs} />
                    </motion.div>
                  )}
                  {activeTab === "errors" && (
                    <motion.div
                      key="errors"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <ValidationErrorsList
                        errors={lastResult.validationErrors}
                      />
                    </motion.div>
                  )}
                  {activeTab === "diff" && lastResult.wasRepaired && (
                    <motion.div
                      key="diff"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <JSONDiffViewer
                        original={lastResult.originalOutput}
                        repaired={
                          lastResult.repairedOutput || lastResult.originalOutput
                        }
                      />
                    </motion.div>
                  )}
                  {activeTab === "diff" && !lastResult.wasRepaired && (
                    <motion.div
                      key="diff-empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="py-6 text-center text-sm text-muted-foreground"
                    >
                      No repairs were needed - JSON was already valid
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Parsed Data */}
              {lastResult.success && lastResult.data && (
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckIcon className="size-5 text-emerald-500" />
                    <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                      Parsed Data
                    </span>
                  </div>
                  <pre className="text-xs font-mono bg-background/50 rounded-lg p-3 overflow-auto max-h-[200px]">
                    {JSON.stringify(lastResult.data, null, 2)}
                  </pre>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* How it works */}
        <div className="rounded-xl border border-border/50 bg-muted/30 p-6">
          <h3 className="text-sm font-semibold mb-4">How Auto-Repair Works</h3>
          <div className="grid gap-4 md:grid-cols-4">
            <Step
              number={1}
              title="Parse Attempt"
              description="Try to parse the raw output as JSON. If successful, skip to validation."
            />
            <Step
              number={2}
              title="Apply Repairs"
              description="Fix common issues: remove wrappers, fix quotes, close brackets, strip text."
            />
            <Step
              number={3}
              title="Validate Schema"
              description="Check parsed data against your schema. Report missing/wrong type fields."
            />
            <Step
              number={4}
              title="Return Result"
              description="Return cleaned data with repair log, or detailed error information."
            />
          </div>
        </div>

        {/* Evidence */}
        <div className="rounded-xl border border-blue-500/30 bg-blue-500/5 p-4 text-center">
          <p className="text-sm">
            <span className="font-semibold text-blue-600 dark:text-blue-400">
              Based on real GitHub issues
            </span>
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            <a
              href="https://github.com/mastra-ai/mastra/issues/12519"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground"
            >
              Mastra #12519
            </a>
            {" · "}
            <a
              href="https://github.com/ray-project/ray/issues/54670"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground"
            >
              Ray #54670
            </a>
            {" · "}
            <a
              href="https://github.com/mangiucugna/json_repair"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground"
            >
              json_repair library
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

function Step({
  number,
  title,
  description,
}: {
  number: number
  title: string
  description: string
}) {
  return (
    <div className="flex gap-3">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-foreground text-background text-sm font-bold">
        {number}
      </div>
      <div>
        <p className="font-medium text-sm">{title}</p>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </div>
    </div>
  )
}

function Switch({
  checked,
  onCheckedChange,
}: {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onCheckedChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        checked ? "bg-foreground" : "bg-muted"
      }`}
    >
      <span
        className={`inline-block size-4 transform rounded-full bg-background transition-transform ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  )
}

function ValidatorIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"
      />
    </svg>
  )
}

function WrenchIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21.75 6.75a4.5 4.5 0 0 1-4.884 4.484c-1.076-.091-2.264.071-2.95.904l-7.152 8.684a2.548 2.548 0 1 1-3.586-3.586l8.684-7.152c.833-.686.995-1.874.904-2.95a4.5 4.5 0 0 1 6.336-4.486l-3.276 3.276a3.004 3.004 0 0 0 2.25 2.25l3.276-3.276c.256.565.398 1.192.398 1.852Z"
      />
    </svg>
  )
}

function AlertIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
      />
    </svg>
  )
}

function DiffIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
      />
    </svg>
  )
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m4.5 12.75 6 6 9-13.5"
      />
    </svg>
  )
}

function LoadingSpinner({ className }: { className?: string }) {
  return (
    <svg
      className={`animate-spin ${className}`}
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  )
}
