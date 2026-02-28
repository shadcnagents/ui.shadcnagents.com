"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { SPRING, FADE_UP, STAGGER } from "./shared"

/* ─── Table Editor ─── */
export function TableEditorPreview() {
  const [data, setData] = useState([
    { id: 1, name: "GPT-4o", provider: "OpenAI", latency: "320ms", cost: "$0.005" },
    { id: 2, name: "Claude 3.5", provider: "Anthropic", latency: "280ms", cost: "$0.003" },
    { id: 3, name: "Gemini Pro", provider: "Google", latency: "350ms", cost: "$0.004" },
    { id: 4, name: "Llama 3.1", provider: "Meta", latency: "180ms", cost: "$0.001" },
    { id: 5, name: "Mistral Large", provider: "Mistral", latency: "240ms", cost: "$0.002" },
  ])

  const [editing, setEditing] = useState<{ row: number; col: string } | null>(null)

  function handleEdit(rowId: number, col: string, value: string) {
    setData((prev) =>
      prev.map((row) => (row.id === rowId ? { ...row, [col]: value } : row))
    )
  }

  const columns = ["name", "provider", "latency", "cost"] as const

  return (
    <div className="mx-auto w-full max-w-2xl p-6">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm font-semibold text-foreground">
          AI Model Comparison
        </span>
        <span className="font-mono text-xs text-muted-foreground">
          Click to edit
        </span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...SPRING }}
        className="overflow-hidden rounded-xl border border-border"
      >
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-card">
              {columns.map((col) => (
                <th
                  key={col}
                  className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr
                key={row.id}
                className="border-b border-border last:border-0 transition-all duration-150 hover:bg-card/50"
              >
                {columns.map((col) => (
                  <td key={col} className="px-4 py-2">
                    {editing?.row === row.id && editing?.col === col ? (
                      <input
                        autoFocus
                        defaultValue={row[col]}
                        onBlur={(e) => {
                          handleEdit(row.id, col, e.target.value)
                          setEditing(null)
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleEdit(row.id, col, e.currentTarget.value)
                            setEditing(null)
                          }
                        }}
                        className="h-7 w-full rounded-md border border-primary bg-transparent px-1.5 text-sm outline-none"
                      />
                    ) : (
                      <button
                        onClick={() => setEditing({ row: row.id, col })}
                        className={`w-full text-left text-sm transition-all duration-150 hover:text-primary ${
                          col === "latency" || col === "cost"
                            ? "font-mono tabular-nums text-foreground"
                            : "text-foreground"
                        }`}
                      >
                        {row[col]}
                      </button>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  )
}

/* ─── Chart Generation ─── */
export function ChartGenerationPreview() {
  const [chartType, setChartType] = useState<"bar" | "line">("bar")

  const data = [
    { label: "Jan", value: 65 },
    { label: "Feb", value: 78 },
    { label: "Mar", value: 52 },
    { label: "Apr", value: 91 },
    { label: "May", value: 84 },
    { label: "Jun", value: 73 },
    { label: "Jul", value: 96 },
  ]

  const max = Math.max(...data.map((d) => d.value))

  return (
    <div className="mx-auto w-full max-w-lg p-6">
      <div className="mb-5 flex items-center justify-between">
        <span className="text-sm font-semibold text-foreground">
          API Usage Over Time
        </span>
        <div className="flex gap-0.5 rounded-lg border border-border p-0.5">
          {(["bar", "line"] as const).map((type) => (
            <button
              key={type}
              onClick={() => setChartType(type)}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition-all duration-150 ${
                chartType === type
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <motion.div
        key={chartType}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="relative h-48"
      >
        {chartType === "bar" ? (
          <div className="flex h-full items-end gap-3">
            {data.map((d, i) => (
              <div
                key={d.label}
                className="flex flex-1 flex-col items-center gap-1"
              >
                <span className="font-mono text-xs tabular-nums text-muted-foreground">
                  {d.value}k
                </span>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(d.value / max) * 100}%` }}
                  transition={{ ...SPRING, delay: i * 0.05 }}
                  className="w-full rounded-t bg-primary"
                />
                <span className="font-mono text-xs text-muted-foreground">
                  {d.label}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <svg viewBox="0 0 280 160" className="h-full w-full" fill="none">
            {/* Grid lines */}
            {[0, 1, 2, 3, 4].map((i) => (
              <line
                key={i}
                x1="0"
                y1={i * 40}
                x2="280"
                y2={i * 40}
                stroke="currentColor"
                strokeOpacity="0.12"
              />
            ))}
            {/* Area fill */}
            <path
              d={`M10,${160 - (data[0].value / max) * 140} ${data
                .map(
                  (d, i) =>
                    `L${(i / (data.length - 1)) * 260 + 10},${160 - (d.value / max) * 140}`
                )
                .join(" ")} L270,160 L10,160 Z`}
              className="fill-primary/10"
            />
            {/* Line */}
            <polyline
              points={data
                .map(
                  (d, i) =>
                    `${(i / (data.length - 1)) * 260 + 10},${160 - (d.value / max) * 140}`
                )
                .join(" ")}
              className="stroke-primary"
              strokeWidth="1.5"
              fill="none"
            />
            {/* Dots */}
            {data.map((d, i) => (
              <circle
                key={d.label}
                cx={(i / (data.length - 1)) * 260 + 10}
                cy={160 - (d.value / max) * 140}
                r="3"
                className="fill-primary"
              />
            ))}
          </svg>
        )}
      </motion.div>
    </div>
  )
}
