import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "AI Agent Stacks — Build Agents That Reason, Act, and Collaborate",
  description:
    "Production-ready AI agent patterns for routing, orchestration, human-in-the-loop, evaluator-optimizer, and multi-step tool calling. Built with Vercel AI SDK v6.",
}

/* ─────────────── Agent stacks data ─────────────── */

const agentStacks = [
  {
    category: "Routing",
    items: [
      {
        name: "Agent Routing",
        description: "Route requests to specialized agents based on intent classification",
        href: "/stacks/ai-agents-routing",
        tier: "free" as const,
      },
    ],
  },
  {
    category: "Orchestration",
    items: [
      {
        name: "Orchestrator-Worker",
        description: "Delegate subtasks to specialized worker agents",
        href: "/stacks/ai-chat-agent-orchestrator-pattern",
        tier: "pro" as const,
      },
      {
        name: "Sub-Agent Orchestrator",
        description: "Nested agent coordination with shared context",
        href: "/stacks/sub-agent-orchestrator",
        tier: "pro" as const,
      },
      {
        name: "Parallel Processing",
        description: "Run multiple agents concurrently and merge results",
        href: "/stacks/ai-agents-parallel-processing",
        tier: "free" as const,
      },
    ],
  },
  {
    category: "Human-in-the-Loop",
    items: [
      {
        name: "Tool Approval",
        description: "Gate dangerous tool calls behind user confirmation",
        href: "/stacks/ai-human-in-the-loop",
        tier: "free" as const,
      },
      {
        name: "Context Builder",
        description: "Agent-guided context gathering before execution",
        href: "/stacks/ai-human-in-the-loop-agentic-context-builder",
        tier: "pro" as const,
      },
      {
        name: "Needs Approval",
        description: "Gated tool execution with approve/reject flow",
        href: "/stacks/ai-chat-agent-tool-approval",
        tier: "pro" as const,
      },
      {
        name: "Inquire Multi-Choice",
        description: "Ask users to pick from generated options",
        href: "/stacks/ai-human-in-the-loop-inquire-multiple-choice",
        tier: "pro" as const,
      },
      {
        name: "Inquire Text Input",
        description: "Free-form user input during agent execution",
        href: "/stacks/ai-human-in-the-loop-inquire-text",
        tier: "pro" as const,
      },
    ],
  },
  {
    category: "Evaluation & Optimization",
    items: [
      {
        name: "Evaluator-Optimizer",
        description: "Self-improving feedback loops with quality scoring",
        href: "/stacks/ai-chat-agent-evaluator-optimizer-pattern",
        tier: "pro" as const,
      },
      {
        name: "Multi-Step Tools",
        description: "Chained sequential tool calls with intermediate reasoning",
        href: "/stacks/ai-chat-agent-multi-step-tool-pattern",
        tier: "pro" as const,
      },
    ],
  },
]

const architectureSteps = [
  {
    step: "01",
    title: "Route",
    description:
      "Classify user intent and route to the right specialized agent. No if-else chains — the model decides.",
  },
  {
    step: "02",
    title: "Execute",
    description:
      "Agents call tools, gather data, and reason through multi-step tasks. Workers run in parallel when possible.",
  },
  {
    step: "03",
    title: "Verify",
    description:
      "Human-in-the-loop gates catch high-risk actions. Evaluators score output quality and trigger re-runs.",
  },
  {
    step: "04",
    title: "Ship",
    description:
      "Every pattern includes the UI, the API route, and the wiring. Install with one CLI command and deploy.",
  },
]

/* ─────────────── Page ─────────────── */

export default function AgentsPage() {
  const totalStacks = agentStacks.reduce(
    (sum, cat) => sum + cat.items.length,
    0
  )

  return (
    <div className="isolate min-h-screen">
      {/* ═══════ Hero ═══════ */}
      <section className="mx-auto flex max-w-[860px] flex-col items-center gap-6 px-4 py-16 text-center md:py-24">
        <span className="rounded-full border border-border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          {totalStacks} agent stacks
        </span>
        <h1
          className="max-w-3xl leading-[1.15] tracking-[-0.03em]"
          style={{ fontSize: "clamp(26px, 12px + 3vw, 48px)" }}
        >
          <span className="block font-editorial italic text-[1.1em]">
            Build AI Agents That
          </span>
          <span className="block font-mono font-medium tracking-[-0.07em]">
            Reason, Act, and Collaborate
          </span>
        </h1>
        <p className="mx-auto max-w-xl text-lg leading-relaxed text-muted-foreground">
          From single-tool agents to multi-agent orchestration with
          human-in-the-loop gates. Every pattern is a full stack — UI, API
          route, types — installable with one CLI command.
        </p>
        <div className="flex gap-3">
          <Link
            href="/stacks/ai-agents-routing"
            className="group inline-flex items-center gap-2 bg-foreground px-6 py-2.5 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
          >
            Start with routing
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

      {/* ═══════ Architecture Flow ═══════ */}
      <section className="mx-auto max-w-4xl px-4 pb-12 md:pb-20">
        <div className="mb-8 text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            How agent stacks work
          </p>
        </div>
        <div className="grid grid-cols-2 gap-px border border-border bg-border md:grid-cols-4">
          {architectureSteps.map((s) => (
            <div key={s.step} className="flex flex-col gap-2 bg-background p-5">
              <span className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground">
                {s.step}
              </span>
              <h3 className="font-mono text-base font-semibold tracking-tight">
                {s.title}
              </h3>
              <p className="text-[12px] leading-relaxed text-muted-foreground">
                {s.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════ Agent Stacks Grid ═══════ */}
      <section className="mx-auto max-w-5xl px-4 py-12 md:py-20">
        <div className="space-y-10">
          {agentStacks.map((group) => (
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

      {/* ═══════ CLI Install CTA ═══════ */}
      <section className="mx-auto max-w-3xl px-4 py-12 md:py-20">
        <div className="flex flex-col items-center gap-6 border border-border bg-muted/20 px-6 py-12 text-center md:px-12">
          <h2 className="text-xl font-bold tracking-tight md:text-2xl">
            Install any agent pattern in seconds
          </h2>
          <div className="w-full overflow-x-auto rounded-md border border-border bg-neutral-950 px-4 py-3">
            <code className="whitespace-nowrap font-mono text-[12px] text-neutral-300">
              npx shadcn@latest add
              https://shadcnagents.com/r/ai-agents-routing.json
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
