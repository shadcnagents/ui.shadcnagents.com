"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

type JSONValue = string | number | boolean | null | JSONValue[] | { [k: string]: JSONValue }

function JSONNode({
  label,
  value,
  depth = 0,
}: {
  label?: string
  value: JSONValue
  depth?: number
}) {
  const [open, setOpen] = useState(depth < 2)

  const isObj = typeof value === "object" && value !== null && !Array.isArray(value)
  const isArr = Array.isArray(value)

  if (isObj) {
    const entries = Object.entries(value as Record<string, JSONValue>)
    return (
      <div>
        <button onClick={() => setOpen((o) => !o)} className="flex items-center gap-1 font-mono text-xs hover:text-foreground">
          <span className="text-muted-foreground/40">{open ? "▾" : "▸"}</span>
          {label && <><span className="text-sky-500">{label}</span><span className="text-foreground/40">:</span></>}
          {!open && <span className="text-muted-foreground/40">{"{"}{entries.length}{"}"}</span>}
        </button>
        {open && (
          <div className="ml-4 border-l border-border/30 pl-3">
            {entries.map(([k, v]) => <JSONNode key={k} label={k} value={v} depth={depth + 1} />)}
          </div>
        )}
      </div>
    )
  }

  if (isArr) {
    return (
      <div>
        <button onClick={() => setOpen((o) => !o)} className="flex items-center gap-1 font-mono text-xs hover:text-foreground">
          <span className="text-muted-foreground/40">{open ? "▾" : "▸"}</span>
          {label && <><span className="text-sky-500">{label}</span><span className="text-foreground/40">:</span></>}
          {!open && <span className="text-muted-foreground/40">[{(value as JSONValue[]).length}]</span>}
        </button>
        {open && (
          <div className="ml-4 border-l border-border/30 pl-3">
            {(value as JSONValue[]).map((v, i) => <JSONNode key={i} label={String(i)} value={v} depth={depth + 1} />)}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex gap-1 font-mono text-xs">
      {label && <><span className="text-sky-500">{label}</span><span className="text-foreground/40">:</span></>}
      {typeof value === "string" && <span className="text-amber-500">"{value}"</span>}
      {typeof value === "number" && <span className="text-emerald-500">{value}</span>}
      {typeof value === "boolean" && <span className="text-violet-400">{String(value)}</span>}
      {value === null && <span className="text-muted-foreground">null</span>}
    </div>
  )
}

export function StructuredOutputViewer({ data }: { data: JSONValue }) {
  return (
    <div className="rounded-lg border border-border/40 bg-muted/20 p-4">
      <JSONNode value={data} />
    </div>
  )
}