"use client"

import { useChat } from "@ai-sdk/react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"

export function StreamingMarkdown() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat()

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      {messages.map((m) => (
        <div key={m.id} className={m.role === "user" ? "text-right" : ""}>
          <div
            className={
              m.role === "user"
                ? "inline-block rounded-xl bg-foreground px-4 py-2 text-sm text-background"
                : "prose prose-sm dark:prose-invert max-w-none"
            }
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "")
                  return !inline && match ? (
                    <SyntaxHighlighter language={match[1]} PreTag="div" {...props}>
                      {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                  ) : (
                    <code className="rounded bg-muted px-1 py-0.5 font-mono text-sm" {...props}>
                      {children}
                    </code>
                  )
                },
              }}
            >
              {m.content}
            </ReactMarkdown>
          </div>
        </div>
      ))}

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Ask something…"
          className="flex-1 rounded-lg border border-border/60 bg-muted/20 px-3 py-2 text-sm outline-none"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background disabled:opacity-40"
        >
          Send
        </button>
      </form>
    </div>
  )
}