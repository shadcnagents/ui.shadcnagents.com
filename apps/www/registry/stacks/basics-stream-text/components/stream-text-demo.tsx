"use client"

import { useCompletion } from "@ai-sdk/react"

export function StreamTextDemo() {
  const { completion, input, handleInputChange, handleSubmit, isLoading, error } =
    useCompletion({ api: "/api/completion" })

  return (
    <div className="mx-auto w-full max-w-lg space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Stream Text</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Tokens stream back in real-time as they are generated.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Ask something…"
          className="flex-1 rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground/60 focus-visible:ring-2 focus-visible:ring-ring"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg className="size-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Streaming
            </span>
          ) : (
            "Send"
          )}
        </button>
      </form>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2.5">
          <p className="text-sm text-destructive">{error.message}</p>
        </div>
      )}

      {completion && (
        <div className="rounded-lg border bg-muted/40 px-4 py-3">
          <p className="mb-2 text-[13px] font-medium text-muted-foreground/60">
            {isLoading ? "Streaming…" : "Response"}
          </p>
          <p className="text-sm leading-relaxed text-foreground/85">
            {completion}
            {isLoading && (
              <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-foreground/60 align-middle" />
            )}
          </p>
        </div>
      )}
    </div>
  )
}
