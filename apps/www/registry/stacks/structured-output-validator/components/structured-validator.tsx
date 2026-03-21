"use client"

import { useCallback, useMemo, useRef, useState } from "react"
import { AnimatePresence, motion } from "motion/react"

// ============================================================================
// TYPES
// ============================================================================

export interface ValidationResult {
  success: boolean
  data: unknown
  originalOutput: string
  repairedOutput?: string
  wasRepaired: boolean
  repairs: RepairAction[]
  validationErrors: ValidationError[]
  attempts: number
  totalLatencyMs: number
}

export interface RepairAction {
  type: RepairType
  description: string
  position?: { start: number; end: number }
  before: string
  after: string
}

export type RepairType =
  | "fix_truncation"
  | "fix_trailing_comma"
  | "fix_single_quotes"
  | "fix_unquoted_keys"
  | "fix_missing_brackets"
  | "fix_code_block"
  | "fix_extra_content"
  | "strip_markdown"

export interface ValidationError {
  path: string
  message: string
  expected?: string
  received?: string
}

export interface ValidatorConfig {
  maxRetries?: number
  enableAutoRepair?: boolean
  enableCorrectivePrompting?: boolean
  strictMode?: boolean
  timeout?: number
}

export interface SchemaField {
  name: string
  type: string
  required: boolean
  description?: string
}

// ============================================================================
// JSON REPAIR ENGINE
// ============================================================================

export function repairJSON(input: string): {
  output: string
  repairs: RepairAction[]
} {
  const repairs: RepairAction[] = []
  let output = input.trim()

  // 1. Strip markdown code blocks
  const codeBlockMatch = output.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (codeBlockMatch) {
    repairs.push({
      type: "fix_code_block",
      description: "Removed markdown code block wrapper",
      before: output.slice(0, 20) + "...",
      after: codeBlockMatch[1].slice(0, 20) + "...",
    })
    output = codeBlockMatch[1].trim()
  }

  // 2. Strip leading text before JSON
  const jsonStartMatch = output.match(/^[^{\[]*?([\{\[])/)
  if (jsonStartMatch && jsonStartMatch.index && jsonStartMatch.index > 0) {
    const leadingText = output.slice(0, jsonStartMatch.index)
    repairs.push({
      type: "strip_markdown",
      description: "Removed leading text before JSON",
      before: leadingText.slice(0, 30),
      after: "",
    })
    output = output.slice(jsonStartMatch.index)
  }

  // 3. Strip trailing text after JSON
  let depth = 0
  let inString = false
  let escape = false
  let jsonEnd = -1

  for (let i = 0; i < output.length; i++) {
    const char = output[i]

    if (escape) {
      escape = false
      continue
    }

    if (char === "\\") {
      escape = true
      continue
    }

    if (char === '"' && !escape) {
      inString = !inString
      continue
    }

    if (!inString) {
      if (char === "{" || char === "[") depth++
      if (char === "}" || char === "]") {
        depth--
        if (depth === 0) {
          jsonEnd = i + 1
          break
        }
      }
    }
  }

  if (jsonEnd > 0 && jsonEnd < output.length) {
    const trailing = output.slice(jsonEnd)
    if (trailing.trim()) {
      repairs.push({
        type: "fix_extra_content",
        description: "Removed trailing content after JSON",
        before: trailing.slice(0, 30),
        after: "",
      })
      output = output.slice(0, jsonEnd)
    }
  }

  // 4. Fix single quotes to double quotes (outside of strings)
  const singleQuotePattern = /'/g
  if (singleQuotePattern.test(output) && !output.includes('"')) {
    repairs.push({
      type: "fix_single_quotes",
      description: "Replaced single quotes with double quotes",
      before: "'key'",
      after: '"key"',
    })
    output = output.replace(/'/g, '"')
  }

  // 5. Fix unquoted keys
  const unquotedKeyPattern = /(\{|,)\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g
  if (unquotedKeyPattern.test(output)) {
    const before = output.match(unquotedKeyPattern)?.[0] || ""
    output = output.replace(unquotedKeyPattern, '$1"$2":')
    repairs.push({
      type: "fix_unquoted_keys",
      description: "Added quotes to unquoted object keys",
      before,
      after: before.replace(/([a-zA-Z_][a-zA-Z0-9_]*)/, '"$1"'),
    })
  }

  // 6. Fix trailing commas
  const trailingCommaPattern = /,(\s*[}\]])/g
  if (trailingCommaPattern.test(output)) {
    repairs.push({
      type: "fix_trailing_comma",
      description: "Removed trailing comma before closing bracket",
      before: ",}",
      after: "}",
    })
    output = output.replace(trailingCommaPattern, "$1")
  }

  // 7. Fix missing closing brackets (truncation)
  try {
    JSON.parse(output)
  } catch {
    // Count brackets
    let openBraces = 0
    let openBrackets = 0
    inString = false
    escape = false

    for (const char of output) {
      if (escape) {
        escape = false
        continue
      }
      if (char === "\\") {
        escape = true
        continue
      }
      if (char === '"' && !escape) {
        inString = !inString
        continue
      }
      if (!inString) {
        if (char === "{") openBraces++
        if (char === "}") openBraces--
        if (char === "[") openBrackets++
        if (char === "]") openBrackets--
      }
    }

    // Close unclosed strings if in string
    if (inString) {
      output += '"'
      repairs.push({
        type: "fix_truncation",
        description: "Closed unclosed string",
        before: "...",
        after: '..."',
      })
    }

    // Add missing closing brackets
    const closings: string[] = []
    for (let i = 0; i < openBrackets; i++) closings.push("]")
    for (let i = 0; i < openBraces; i++) closings.push("}")

    if (closings.length > 0) {
      repairs.push({
        type: "fix_missing_brackets",
        description: `Added ${closings.length} missing closing bracket(s)`,
        before: output.slice(-10),
        after: output.slice(-10) + closings.join(""),
      })
      output += closings.join("")
    }
  }

  return { output, repairs }
}

// ============================================================================
// SIMPLE SCHEMA VALIDATOR
// ============================================================================

export function validateSchema(
  data: unknown,
  schema: SchemaField[]
): ValidationError[] {
  const errors: ValidationError[] = []

  if (typeof data !== "object" || data === null) {
    errors.push({
      path: "$",
      message: "Expected object, received " + typeof data,
      expected: "object",
      received: typeof data,
    })
    return errors
  }

  const obj = data as Record<string, unknown>

  for (const field of schema) {
    const value = obj[field.name]

    if (field.required && (value === undefined || value === null)) {
      errors.push({
        path: field.name,
        message: `Required field "${field.name}" is missing`,
        expected: field.type,
        received: "undefined",
      })
      continue
    }

    if (value !== undefined && value !== null) {
      const actualType = Array.isArray(value) ? "array" : typeof value
      const expectedTypes = field.type
        .toLowerCase()
        .split("|")
        .map((t) => t.trim())

      if (!expectedTypes.includes(actualType)) {
        errors.push({
          path: field.name,
          message: `Field "${field.name}" has wrong type`,
          expected: field.type,
          received: actualType,
        })
      }
    }
  }

  return errors
}

// ============================================================================
// HOOK: useStructuredOutput
// ============================================================================

interface UseStructuredOutputOptions extends ValidatorConfig {
  schema?: SchemaField[]
  onValidationSuccess?: (result: ValidationResult) => void
  onValidationFailure?: (result: ValidationResult) => void
  onRepair?: (repairs: RepairAction[]) => void
}

export function useStructuredOutput(options: UseStructuredOutputOptions = {}) {
  const {
    maxRetries = 3,
    enableAutoRepair = true,
    enableCorrectivePrompting = true,
    strictMode = false,
    schema = [],
    onValidationSuccess,
    onValidationFailure,
    onRepair,
  } = options

  const [lastResult, setLastResult] = useState<ValidationResult | null>(null)
  const [isValidating, setIsValidating] = useState(false)
  const [stats, setStats] = useState({
    totalValidations: 0,
    successCount: 0,
    repairCount: 0,
    failureCount: 0,
  })

  // Validate and optionally repair JSON output
  const validateOutput = useCallback(
    async (
      rawOutput: string,
      retryFn?: (feedback: string) => Promise<string>
    ): Promise<ValidationResult> => {
      setIsValidating(true)
      const startTime = performance.now()
      let attempts = 0
      let currentOutput = rawOutput
      const allRepairs: RepairAction[] = []

      try {
        while (attempts < maxRetries) {
          attempts++

          // Step 1: Try to parse as-is
          let parsed: unknown
          let parseError: Error | null = null

          try {
            parsed = JSON.parse(currentOutput)
          } catch (e) {
            parseError = e as Error
          }

          // Step 2: If parse failed and auto-repair enabled, try repair
          if (parseError && enableAutoRepair) {
            const { output: repairedOutput, repairs } =
              repairJSON(currentOutput)

            if (repairs.length > 0) {
              allRepairs.push(...repairs)
              onRepair?.(repairs)

              try {
                parsed = JSON.parse(repairedOutput)
                currentOutput = repairedOutput
                parseError = null
              } catch {
                // Repair didn't fully fix it
              }
            }
          }

          // Step 3: If still failed and corrective prompting enabled, retry
          if (
            parseError &&
            enableCorrectivePrompting &&
            retryFn &&
            attempts < maxRetries
          ) {
            const feedback = `Your previous response was not valid JSON. Error: ${parseError.message}. Please respond with ONLY valid JSON, no markdown or explanation.`
            currentOutput = await retryFn(feedback)
            continue
          }

          // Step 4: If we have valid JSON, validate against schema
          if (!parseError && parsed !== undefined) {
            const schemaErrors =
              schema.length > 0 ? validateSchema(parsed, schema) : []

            if (schemaErrors.length === 0 || !strictMode) {
              const result: ValidationResult = {
                success: schemaErrors.length === 0,
                data: parsed,
                originalOutput: rawOutput,
                repairedOutput:
                  allRepairs.length > 0 ? currentOutput : undefined,
                wasRepaired: allRepairs.length > 0,
                repairs: allRepairs,
                validationErrors: schemaErrors,
                attempts,
                totalLatencyMs: performance.now() - startTime,
              }

              setLastResult(result)
              setStats((prev) => ({
                ...prev,
                totalValidations: prev.totalValidations + 1,
                successCount: prev.successCount + 1,
                repairCount: prev.repairCount + (allRepairs.length > 0 ? 1 : 0),
              }))
              onValidationSuccess?.(result)
              return result
            }

            // Schema validation failed, try corrective prompting
            if (enableCorrectivePrompting && retryFn && attempts < maxRetries) {
              const feedback = `Your JSON is valid but doesn't match the expected schema. Errors: ${schemaErrors.map((e) => e.message).join(", ")}. Please fix these issues.`
              currentOutput = await retryFn(feedback)
              continue
            }
          }

          // If we get here without success, break the loop
          if (parseError) {
            break
          }
        }

        // All retries exhausted
        const result: ValidationResult = {
          success: false,
          data: null,
          originalOutput: rawOutput,
          repairedOutput: allRepairs.length > 0 ? currentOutput : undefined,
          wasRepaired: allRepairs.length > 0,
          repairs: allRepairs,
          validationErrors: [
            {
              path: "$",
              message: "Failed to parse valid JSON after all retries",
            },
          ],
          attempts,
          totalLatencyMs: performance.now() - startTime,
        }

        setLastResult(result)
        setStats((prev) => ({
          ...prev,
          totalValidations: prev.totalValidations + 1,
          failureCount: prev.failureCount + 1,
        }))
        onValidationFailure?.(result)
        return result
      } finally {
        setIsValidating(false)
      }
    },
    [
      maxRetries,
      enableAutoRepair,
      enableCorrectivePrompting,
      strictMode,
      schema,
      onValidationSuccess,
      onValidationFailure,
      onRepair,
    ]
  )

  // Quick parse without retries
  const quickParse = useCallback(
    (
      rawOutput: string
    ): { success: boolean; data: unknown; error?: string } => {
      try {
        const { output } = enableAutoRepair
          ? repairJSON(rawOutput)
          : { output: rawOutput }
        const data = JSON.parse(output)
        return { success: true, data }
      } catch (e) {
        return { success: false, data: null, error: (e as Error).message }
      }
    },
    [enableAutoRepair]
  )

  return {
    validateOutput,
    quickParse,
    lastResult,
    isValidating,
    stats,
  }
}

// ============================================================================
// VALIDATION STATUS BADGE
// ============================================================================

interface ValidationStatusBadgeProps {
  result: ValidationResult | null
  size?: "sm" | "md"
}

export function ValidationStatusBadge({
  result,
  size = "md",
}: ValidationStatusBadgeProps) {
  if (!result) return null

  const sizeClasses =
    size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-3 py-1.5 text-xs"

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`inline-flex items-center gap-2 rounded-full ${sizeClasses} ${
        result.success
          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          : "bg-red-500/10 text-red-600 dark:text-red-400"
      }`}
    >
      {result.success ? (
        <CheckCircleIcon className="size-3.5" />
      ) : (
        <XCircleIcon className="size-3.5" />
      )}
      <span className="font-semibold uppercase">
        {result.success ? "VALID" : "INVALID"}
      </span>
      {result.wasRepaired && (
        <span className="flex items-center gap-1 rounded-full bg-amber-500/20 px-1.5 py-0.5 text-amber-600 dark:text-amber-400">
          <WrenchIcon className="size-3" />
          <span>Repaired</span>
        </span>
      )}
      <span className="opacity-60">
        {result.attempts} attempt{result.attempts > 1 ? "s" : ""}
      </span>
      <span className="opacity-40">{result.totalLatencyMs.toFixed(0)}ms</span>
    </motion.div>
  )
}

// ============================================================================
// REPAIR LOG
// ============================================================================

interface RepairLogProps {
  repairs: RepairAction[]
}

export function RepairLog({ repairs }: RepairLogProps) {
  if (repairs.length === 0) {
    return (
      <div className="flex items-center justify-center py-6 text-center">
        <div className="text-sm text-muted-foreground">No repairs needed</div>
      </div>
    )
  }

  const repairTypeConfig: Record<
    RepairType,
    { icon: React.ReactNode; color: string }
  > = {
    fix_truncation: {
      icon: <ScissorsIcon className="size-3.5" />,
      color: "text-red-500",
    },
    fix_trailing_comma: {
      icon: <CommaIcon className="size-3.5" />,
      color: "text-amber-500",
    },
    fix_single_quotes: {
      icon: <QuoteIcon className="size-3.5" />,
      color: "text-blue-500",
    },
    fix_unquoted_keys: {
      icon: <KeyIcon className="size-3.5" />,
      color: "text-purple-500",
    },
    fix_missing_brackets: {
      icon: <BracketsIcon className="size-3.5" />,
      color: "text-orange-500",
    },
    fix_code_block: {
      icon: <CodeIcon className="size-3.5" />,
      color: "text-cyan-500",
    },
    fix_extra_content: {
      icon: <TrashIcon className="size-3.5" />,
      color: "text-pink-500",
    },
    strip_markdown: {
      icon: <FileTextIcon className="size-3.5" />,
      color: "text-emerald-500",
    },
  }

  return (
    <div className="space-y-2">
      <div className="text-xs font-medium text-muted-foreground mb-3">
        {repairs.length} repair{repairs.length > 1 ? "s" : ""} applied
      </div>

      <div className="space-y-2 max-h-[300px] overflow-y-auto">
        <AnimatePresence>
          {repairs.map((repair, index) => {
            const config = repairTypeConfig[repair.type]
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="rounded-lg border border-border/50 bg-background p-3"
              >
                <div className="flex items-start gap-2">
                  <div className={`mt-0.5 ${config.color}`}>{config.icon}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{repair.description}</p>
                    <div className="mt-2 flex gap-2 text-[10px] font-mono">
                      <div className="flex-1 rounded bg-red-500/10 px-2 py-1 text-red-600 dark:text-red-400 truncate">
                        <span className="opacity-50">-</span>{" "}
                        {repair.before || "(empty)"}
                      </div>
                      <ArrowRightIcon className="size-4 text-muted-foreground shrink-0 self-center" />
                      <div className="flex-1 rounded bg-emerald-500/10 px-2 py-1 text-emerald-600 dark:text-emerald-400 truncate">
                        <span className="opacity-50">+</span>{" "}
                        {repair.after || "(empty)"}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}

// ============================================================================
// VALIDATION ERRORS LIST
// ============================================================================

interface ValidationErrorsListProps {
  errors: ValidationError[]
}

export function ValidationErrorsList({ errors }: ValidationErrorsListProps) {
  if (errors.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-6 text-center">
        <CheckCircleIcon className="size-8 text-emerald-500 mb-2" />
        <div className="text-sm text-muted-foreground">
          All validations passed
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-red-600 dark:text-red-400 mb-3">
        <AlertTriangleIcon className="size-4" />
        <span className="text-xs font-medium">
          {errors.length} validation error{errors.length > 1 ? "s" : ""}
        </span>
      </div>

      <div className="space-y-2">
        {errors.map((error, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="rounded-lg border border-red-500/30 bg-red-500/5 p-3"
          >
            <div className="flex items-start gap-2">
              <code className="shrink-0 rounded bg-red-500/20 px-1.5 py-0.5 text-[10px] text-red-600 dark:text-red-400">
                {error.path}
              </code>
              <p className="text-sm text-muted-foreground">{error.message}</p>
            </div>
            {(error.expected || error.received) && (
              <div className="mt-2 flex gap-4 text-[10px]">
                {error.expected && (
                  <div>
                    <span className="text-muted-foreground">Expected:</span>{" "}
                    <span className="text-emerald-600">{error.expected}</span>
                  </div>
                )}
                {error.received && (
                  <div>
                    <span className="text-muted-foreground">Received:</span>{" "}
                    <span className="text-red-600">{error.received}</span>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// ============================================================================
// VALIDATOR STATS PANEL
// ============================================================================

interface ValidatorStatsPanelProps {
  stats: {
    totalValidations: number
    successCount: number
    repairCount: number
    failureCount: number
  }
}

export function ValidatorStatsPanel({ stats }: ValidatorStatsPanelProps) {
  const successRate =
    stats.totalValidations > 0
      ? (stats.successCount / stats.totalValidations) * 100
      : 0
  const repairRate =
    stats.totalValidations > 0
      ? (stats.repairCount / stats.totalValidations) * 100
      : 0

  return (
    <div className="rounded-xl border border-border/50 bg-card p-4">
      <h3 className="text-sm font-semibold mb-4">Validation Statistics</h3>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard
          label="Total"
          value={stats.totalValidations.toString()}
          icon={<LayersIcon className="size-4" />}
          color="zinc"
        />
        <StatCard
          label="Success"
          value={stats.successCount.toString()}
          icon={<CheckCircleIcon className="size-4" />}
          color="emerald"
        />
        <StatCard
          label="Repaired"
          value={stats.repairCount.toString()}
          icon={<WrenchIcon className="size-4" />}
          color="amber"
        />
        <StatCard
          label="Failed"
          value={stats.failureCount.toString()}
          icon={<XCircleIcon className="size-4" />}
          color="red"
        />
      </div>

      {/* Success/Failure bar */}
      {stats.totalValidations > 0 && (
        <div className="mt-4">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Success: {successRate.toFixed(0)}%</span>
            <span>Repaired: {repairRate.toFixed(0)}%</span>
          </div>
          <div className="flex h-2 overflow-hidden rounded-full bg-muted">
            <motion.div
              className="bg-emerald-500"
              initial={{ width: 0 }}
              animate={{
                width: `${((stats.successCount - stats.repairCount) / Math.max(1, stats.totalValidations)) * 100}%`,
              }}
              transition={{ duration: 0.5 }}
            />
            <motion.div
              className="bg-amber-500"
              initial={{ width: 0 }}
              animate={{
                width: `${(stats.repairCount / Math.max(1, stats.totalValidations)) * 100}%`,
              }}
              transition={{ duration: 0.5 }}
            />
            <motion.div
              className="bg-red-500"
              initial={{ width: 0 }}
              animate={{
                width: `${(stats.failureCount / Math.max(1, stats.totalValidations)) * 100}%`,
              }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      )}
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
  color: "emerald" | "amber" | "red" | "zinc"
}) {
  const colorClasses = {
    emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    red: "bg-red-500/10 text-red-600 dark:text-red-400",
    zinc: "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400",
  }

  return (
    <div className="rounded-lg border border-border/50 bg-background p-3">
      <div className={`inline-flex rounded-md p-1.5 ${colorClasses[color]}`}>
        {icon}
      </div>
      <p className="mt-2 text-lg font-bold">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  )
}

// ============================================================================
// JSON DIFF VIEWER
// ============================================================================

interface JSONDiffViewerProps {
  original: string
  repaired: string
}

export function JSONDiffViewer({ original, repaired }: JSONDiffViewerProps) {
  const formatJSON = (str: string): string => {
    try {
      return JSON.stringify(JSON.parse(str), null, 2)
    } catch {
      return str
    }
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-3">
        <div className="flex items-center gap-2 mb-2">
          <div className="size-2 rounded-full bg-red-500" />
          <span className="text-xs font-medium text-red-600 dark:text-red-400">
            Original
          </span>
        </div>
        <pre className="text-xs font-mono whitespace-pre-wrap break-all text-muted-foreground max-h-[200px] overflow-auto">
          {formatJSON(original)}
        </pre>
      </div>

      <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3">
        <div className="flex items-center gap-2 mb-2">
          <div className="size-2 rounded-full bg-emerald-500" />
          <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
            Repaired
          </span>
        </div>
        <pre className="text-xs font-mono whitespace-pre-wrap break-all text-muted-foreground max-h-[200px] overflow-auto">
          {formatJSON(repaired)}
        </pre>
      </div>
    </div>
  )
}

// ============================================================================
// SCHEMA EDITOR
// ============================================================================

interface SchemaEditorProps {
  schema: SchemaField[]
  onChange: (schema: SchemaField[]) => void
}

export function SchemaEditor({ schema, onChange }: SchemaEditorProps) {
  const addField = () => {
    onChange([...schema, { name: "", type: "string", required: true }])
  }

  const updateField = (index: number, updates: Partial<SchemaField>) => {
    const newSchema = [...schema]
    newSchema[index] = { ...newSchema[index], ...updates }
    onChange(newSchema)
  }

  const removeField = (index: number) => {
    onChange(schema.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Expected Schema</span>
        <button
          onClick={addField}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          + Add field
        </button>
      </div>

      {schema.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border py-4 text-center text-xs text-muted-foreground">
          No schema defined. Add fields to enable validation.
        </div>
      ) : (
        <div className="space-y-2">
          {schema.map((field, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="text"
                value={field.name}
                onChange={(e) => updateField(index, { name: e.target.value })}
                placeholder="Field name"
                className="flex-1 rounded border border-border bg-background px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
              />
              <select
                value={field.type}
                onChange={(e) => updateField(index, { type: e.target.value })}
                className="rounded border border-border bg-background px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="string">string</option>
                <option value="number">number</option>
                <option value="boolean">boolean</option>
                <option value="array">array</option>
                <option value="object">object</option>
              </select>
              <label className="flex items-center gap-1 text-xs">
                <input
                  type="checkbox"
                  checked={field.required}
                  onChange={(e) =>
                    updateField(index, { required: e.target.checked })
                  }
                  className="rounded"
                />
                Required
              </label>
              <button
                onClick={() => removeField(index)}
                className="text-red-500 hover:text-red-700 transition-colors"
              >
                <XIcon className="size-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ============================================================================
// ICONS
// ============================================================================

function CheckCircleIcon({ className }: { className?: string }) {
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
        d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
      />
    </svg>
  )
}

function XCircleIcon({ className }: { className?: string }) {
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
        d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
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

function AlertTriangleIcon({ className }: { className?: string }) {
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
        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
      />
    </svg>
  )
}

function LayersIcon({ className }: { className?: string }) {
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
        d="M6.429 9.75 2.25 12l4.179 2.25m0-4.5 5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0 4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0-5.571 3-5.571-3"
      />
    </svg>
  )
}

function ArrowRightIcon({ className }: { className?: string }) {
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
        d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
      />
    </svg>
  )
}

function ScissorsIcon({ className }: { className?: string }) {
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
        d="m7.848 8.25 1.536.887M7.848 8.25a3 3 0 1 1-5.196-3 3 3 0 0 1 5.196 3Zm1.536.887a2.165 2.165 0 0 1 1.083 1.839c.005.351.054.695.14 1.024M9.384 9.137l2.077 1.199M7.848 15.75l1.536-.887m-1.536.887a3 3 0 1 1-5.196 3 3 3 0 0 1 5.196-3Zm1.536-.887a2.165 2.165 0 0 0 1.083-1.838c.005-.352.054-.695.14-1.025m-1.223 2.863 2.077-1.199m0-3.328a4.323 4.323 0 0 1 2.068-1.379l5.325-1.628a4.5 4.5 0 0 1 2.48-.044l.803.215-7.794 4.5m-2.882-1.664A4.33 4.33 0 0 0 10.607 12m3.736 0 7.794 4.5-.802.215a4.5 4.5 0 0 1-2.48-.043l-5.326-1.629a4.324 4.324 0 0 1-2.068-1.379M14.343 12l-2.882 1.664"
      />
    </svg>
  )
}

function CommaIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="16" r="2" />
      <path d="M12 18c-1.1 0-2 .9-2 2v2h2v-2c0-.55.45-1 1-1h1v-1h-2z" />
    </svg>
  )
}

function QuoteIcon({ className }: { className?: string }) {
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
        d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
      />
    </svg>
  )
}

function KeyIcon({ className }: { className?: string }) {
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
        d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z"
      />
    </svg>
  )
}

function BracketsIcon({ className }: { className?: string }) {
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
        d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5"
      />
    </svg>
  )
}

function CodeIcon({ className }: { className?: string }) {
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
        d="M14.25 9.75 16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z"
      />
    </svg>
  )
}

function TrashIcon({ className }: { className?: string }) {
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
        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
      />
    </svg>
  )
}

function FileTextIcon({ className }: { className?: string }) {
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
        d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
      />
    </svg>
  )
}

function XIcon({ className }: { className?: string }) {
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
        d="M6 18 18 6M6 6l12 12"
      />
    </svg>
  )
}
