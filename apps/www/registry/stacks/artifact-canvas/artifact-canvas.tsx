"use client"

import { useChat } from "@ai-sdk/react"
import { useState } from "react"
import { cn } from "@/lib/utils"

export function ArtifactCanvas() {
  const [tab, setTab] = useState<"code" | "preview">("code")
  const [artifact, setArtifact] = useState<{ code: string; lang: string } | null>(null)

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/artifact",
    onFinish(message) {
      // Parse code block from assistant response
      const match = message.content.match(/```(\w+)?\n([\s\S]*?)```/)
      if (match) setArtifact({ lang: match[1] ?? "tsx", code: match[2] })
    },
  })

  return (
    <div className="flex h-screen">
      {/* Chat panel */}
      <div className="flex w-80 shrink-0 flex-col border-r border-border/40">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m) => (
            <div key={m.id} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
              <div
                className={cn(
                  "max-w-[85%] rounded-xl px-3 py-2 text-sm",
                  m.role === "user"
                    ? "bg-foreground text-background rounded-br-sm"
                    : "bg-muted/50 rounded-bl-sm",
                )}
              >
                {m.role === "user" ? m.content : m.content.replace(/```[\s\S]*?```/g, "✦ Generated artifact")}
              </div>
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="border-t border-border/40 p-3">
          <div className="flex gap-2 rounded-lg border border-border/40 bg-muted/20 px-3 py-2">
            <input
              value={input}
              onChange={handleInputChange}
              placeholder="Ask Claude to build…"
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/40"
            />
            <button type="submit" disabled={isLoading} className="text-xs font-medium text-foreground/60 hover:text-foreground disabled:opacity-40">
              Send
            </button>
          </div>
        </form>
      </div>

      {/* Artifact panel */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex items-center gap-0 border-b border-border/40 px-2">
          {(["code", "preview"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "px-4 py-2.5 text-sm font-medium capitalize transition-colors",
                tab === t ? "border-b-2 border-foreground text-foreground" : "text-muted-foreground",
              )}
            >
              {t}
            </button>
          ))}
          {isLoading && (
            <span className="ml-auto flex items-center gap-1.5 pr-3 text-xs text-muted-foreground">
              <span className="size-1.5 animate-pulse rounded-full bg-orange-400" />
              Generating…
            </span>
          )}
        </div>

        <div className="flex-1 overflow-auto p-4">
          {tab === "code" && artifact && (
            <pre className="font-mono text-xs leading-relaxed text-foreground/80">
              {artifact.code}
            </pre>
          )}
          {tab === "preview" && (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground/40">
              Sandboxed preview here
            </div>
          )}
          {!artifact && !isLoading && (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground/30">
              Ask Claude to build a component
            </div>
          )}
        </div>
      </div>
    </div>
  )
}