import type { Metadata } from "next"

import { AgentDemo } from "@/components/agent-demo"

export const metadata: Metadata = {
  title: "Agent Composer — AI SDK Demo",
  description: "Multi-step AI agent with configurable modes, model selection, and tool calling.",
}

export default function Page() {
  return (
    <main className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-background px-4 py-12">
      {/* Subtle gradient background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-muted/50 via-background to-background" />

      {/* Grid pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px),
                           linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full">
        <AgentDemo />
      </div>
    </main>
  )
}
