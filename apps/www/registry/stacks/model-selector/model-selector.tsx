"use client"

import { useState } from "react"
import { Check, ChevronDown, Search } from "lucide-react"
import { cn } from "@/lib/utils"

const PROVIDERS = [
  {
    group: "Anthropic",
    color: "bg-orange-400",
    models: [
      { id: "claude-sonnet-4-5", name: "Claude Sonnet 4.5" },
      { id: "claude-haiku-4-5", name: "Claude Haiku 4.5" },
      { id: "claude-opus-4-5", name: "Claude Opus 4.5" },
    ],
  },
  {
    group: "OpenAI",
    color: "bg-emerald-400",
    models: [
      { id: "gpt-4o", name: "GPT-4o" },
      { id: "gpt-4o-mini", name: "GPT-4o mini" },
      { id: "o3-mini", name: "o3-mini" },
    ],
  },
  {
    group: "Google",
    color: "bg-blue-400",
    models: [
      { id: "gemini-2.0-flash", name: "Gemini 2.0 Flash" },
      { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro" },
    ],
  },
]

export function ModelSelector({
  value,
  onChange,
}: {
  value: string
  onChange: (id: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")

  const selected = PROVIDERS.flatMap((g) => g.models).find((m) => m.id === value)
  const selectedGroup = PROVIDERS.find((g) => g.models.some((m) => m.id === value))

  const filtered = PROVIDERS.map((g) => ({
    ...g,
    models: g.models.filter((m) =>
      m.name.toLowerCase().includes(search.toLowerCase()),
    ),
  })).filter((g) => g.models.length > 0)

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-lg border border-border/60 bg-muted/20 px-3 py-2 text-sm transition-colors hover:border-foreground/20"
      >
        <span className={cn("size-2 rounded-full", selectedGroup?.color ?? "bg-muted")} />
        <span>{selected?.name ?? "Select model"}</span>
        <ChevronDown className={cn("size-3.5 text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 w-64 overflow-hidden rounded-lg border border-border/60 bg-background shadow-lg">
          <div className="border-b border-border/30 px-3 py-2">
            <div className="flex items-center gap-2">
              <Search className="size-3.5 text-muted-foreground/50" />
              <input
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search models…"
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/40"
              />
            </div>
          </div>

          <div className="max-h-60 overflow-y-auto py-1">
            {filtered.map((g) => (
              <div key={g.group}>
                <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/40">
                  {g.group}
                </p>
                {g.models.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => { onChange(m.id); setOpen(false); setSearch("") }}
                    className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm transition-colors hover:bg-muted/40"
                  >
                    <span className={cn("size-1.5 rounded-full", g.color)} />
                    {m.name}
                    {value === m.id && <Check className="ml-auto size-3.5" />}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}