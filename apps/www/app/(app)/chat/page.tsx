import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Chat UI Stacks — Every Chat Interface You'll Ever Need",
  description:
    "Production-ready chat interface stacks with streaming, reasoning display, citations, plan rendering, voice input, and more. Built with Vercel AI SDK v6 and shadcn/ui.",
}

/* ─────────────── Chat stacks data ─────────────── */

const chatStacks = [
  {
    category: "Chat Interfaces",
    items: [
      {
        name: "Basic Chat",
        description: "Minimal streaming chat with message history",
        href: "/stacks/ai-elements-chat",
        tier: "free" as const,
      },
      {
        name: "ChatGPT Clone",
        description: "OpenAI-style chat UI with sidebar and model picker",
        href: "/stacks/chat-gpt",
        tier: "pro" as const,
      },
      {
        name: "Claude Clone",
        description: "Anthropic-style chat with artifacts pane",
        href: "/stacks/chat-claude",
        tier: "pro" as const,
      },
      {
        name: "Grok Clone",
        description: "xAI-style chat with dark minimal aesthetic",
        href: "/stacks/chat-grok",
        tier: "pro" as const,
      },
    ],
  },
  {
    category: "Reasoning & Sources",
    items: [
      {
        name: "Reasoning Display",
        description: "Show the model's thinking process with collapsible chains",
        href: "/stacks/ai-elements-reasoning-chat",
        tier: "free" as const,
      },
      {
        name: "Sources & Citations",
        description: "Display referenced sources with link previews",
        href: "/stacks/ai-elements-sources-chat",
        tier: "free" as const,
      },
      {
        name: "Inline Citations",
        description: "Perplexity-style numbered in-text references",
        href: "/stacks/ai-elements-inline-citation",
        tier: "pro" as const,
      },
    ],
  },
  {
    category: "Confirmations & Plans",
    items: [
      {
        name: "Plan Display",
        description: "Render step-by-step execution plans with status indicators",
        href: "/stacks/ai-elements-plan",
        tier: "free" as const,
      },
      {
        name: "Tool Approval",
        description: "Inline approve/reject for tool call confirmations",
        href: "/stacks/ai-elements-confirmation",
        tier: "free" as const,
      },
      {
        name: "Queue Display",
        description: "Visualize pending, running, and completed tasks",
        href: "/stacks/ai-elements-queue",
        tier: "free" as const,
      },
    ],
  },
  {
    category: "Input & Controls",
    items: [
      {
        name: "AI Prompt Input",
        description: "Auto-growing textarea with file attachment and shortcuts",
        href: "/stacks/ai-prompt-input",
        tier: "free" as const,
      },
      {
        name: "Voice Input",
        description: "Mic button with recording waveform and transcription",
        href: "/stacks/voice-input-button",
        tier: "free" as const,
      },
      {
        name: "Model Selector",
        description: "Command palette model picker grouped by provider",
        href: "/stacks/model-selector",
        tier: "free" as const,
      },
      {
        name: "Token Counter",
        description: "Circular progress ring showing context window usage",
        href: "/stacks/token-counter",
        tier: "free" as const,
      },
    ],
  },
  {
    category: "Conversation",
    items: [
      {
        name: "Prompt Suggestions",
        description: "Empty state with clickable suggestion chips",
        href: "/stacks/prompt-suggestion-pills",
        tier: "free" as const,
      },
      {
        name: "Multimodal Upload",
        description: "File and image attachment tray for chat input",
        href: "/stacks/multimodal-file-upload",
        tier: "pro" as const,
      },
      {
        name: "History Sidebar",
        description: "Conversation list with date grouping and search",
        href: "/stacks/conversation-history-sidebar",
        tier: "pro" as const,
      },
      {
        name: "Message Branch",
        description: "Navigate between regenerated responses with arrows",
        href: "/stacks/message-branch-navigator",
        tier: "pro" as const,
      },
    ],
  },
  {
    category: "Loading & Streaming",
    items: [
      {
        name: "AI Loading States",
        description: "Wave dots, shimmer, and pulsing orb loading animations",
        href: "/stacks/ai-loading-states",
        tier: "free" as const,
      },
      {
        name: "Token Stream Effect",
        description: "Smooth token-by-token text reveal animation",
        href: "/stacks/ai-token-stream",
        tier: "free" as const,
      },
    ],
  },
]

const includes = [
  "Streaming text with token-by-token rendering",
  "Reasoning chain display with collapsible sections",
  "Source citations with link previews",
  "Plan rendering with step status",
  "Tool call confirmation with approve/reject",
  "Voice input with waveform visualization",
  "Model selection with provider grouping",
  "Context window token counter",
  "File and image attachment handling",
  "Conversation history with search",
  "Message branching and regeneration",
  "Loading states and skeleton animations",
]

/* ─────────────── Page ─────────────── */

export default function ChatPage() {
  const totalStacks = chatStacks.reduce(
    (sum, cat) => sum + cat.items.length,
    0
  )

  return (
    <div className="isolate min-h-screen">
      {/* ═══════ Hero ═══════ */}
      <section className="mx-auto flex max-w-[860px] flex-col items-center gap-6 px-4 py-16 text-center md:py-24">
        <span className="rounded-full border border-border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          {totalStacks} chat stacks
        </span>
        <h1
          className="max-w-3xl leading-[1.15] tracking-[-0.03em]"
          style={{ fontSize: "clamp(26px, 12px + 3vw, 48px)" }}
        >
          <span className="block font-editorial italic text-[1.1em]">
            Every Chat Interface
          </span>
          <span className="block font-mono font-medium tracking-[-0.07em]">
            You&apos;ll Ever Need
          </span>
        </h1>
        <p className="mx-auto max-w-xl text-lg leading-relaxed text-muted-foreground">
          Streaming responses, reasoning chains, inline citations, tool
          confirmations, voice input, model selection — every chat UI pattern
          as a production-ready stack.
        </p>
        <div className="flex gap-3">
          <Link
            href="/stacks/ai-elements-chat"
            className="group inline-flex items-center gap-2 bg-foreground px-6 py-2.5 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
          >
            Start with basic chat
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/stacks"
            className="inline-flex items-center border border-border px-6 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
          >
            All stacks
          </Link>
        </div>
      </section>

      {/* ═══════ What's included checklist ═══════ */}
      <section className="mx-auto max-w-3xl px-4 pb-12 md:pb-20">
        <div className="border border-border">
          <div className="border-b border-border px-5 py-3">
            <h2 className="font-mono text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
              What&apos;s included
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-px bg-border sm:grid-cols-2">
            {includes.map((item) => (
              <div
                key={item}
                className="flex items-start gap-2.5 bg-background px-5 py-3"
              >
                <span className="mt-0.5 size-1.5 shrink-0 rounded-full bg-emerald-500" />
                <span className="text-[13px] leading-snug text-muted-foreground">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ Chat Stacks Grid ═══════ */}
      <section className="mx-auto max-w-5xl px-4 py-12 md:py-20">
        <div className="space-y-10">
          {chatStacks.map((group) => (
            <div key={group.category}>
              <h2 className="mb-4 font-mono text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                {group.category}
                <span className="ml-2 text-muted-foreground/50">
                  {group.items.length}
                </span>
              </h2>
              <div className="grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
                {group.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group flex flex-col gap-1.5 bg-background p-5 transition-colors hover:bg-muted/40"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium tracking-tight">
                        {item.name}
                      </h3>
                      <span
                        className={`rounded-full px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider ${
                          item.tier === "free"
                            ? "bg-emerald-500/10 text-emerald-600"
                            : "bg-amber-500/10 text-amber-600"
                        }`}
                      >
                        {item.tier}
                      </span>
                    </div>
                    <p className="text-[12px] leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                    <span className="mt-auto flex items-center gap-1 pt-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground/50 transition-colors group-hover:text-foreground">
                      View stack
                      <ArrowRight className="size-2.5 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════ CTA ═══════ */}
      <section className="mx-auto max-w-3xl px-4 py-12 md:py-20">
        <div className="flex flex-col items-center gap-6 border border-border bg-muted/20 px-6 py-12 text-center md:px-12">
          <h2 className="text-xl font-bold tracking-tight md:text-2xl">
            Build a complete chat experience in minutes
          </h2>
          <div className="w-full overflow-x-auto rounded-md border border-border bg-neutral-950 px-4 py-3">
            <code className="whitespace-nowrap font-mono text-[12px] text-neutral-300">
              npx shadcn@latest add
              https://shadcnagents.com/r/ai-elements-chat.json
            </code>
          </div>
          <Link
            href="/stacks"
            className="group inline-flex items-center gap-2 bg-foreground px-8 py-3 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
          >
            Browse all stacks
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </section>
    </div>
  )
}
