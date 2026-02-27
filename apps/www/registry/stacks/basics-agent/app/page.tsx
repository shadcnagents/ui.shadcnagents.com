import type { Metadata } from "next"
import { AgentDemo } from "@/components/agent-demo"

export const metadata: Metadata = {
  title: "Agent Loop — AI SDK Demo",
  description: "Multi-step AI agent with tool calling using the Vercel AI SDK.",
}

export default function Page() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-background px-4 py-12">
      <AgentDemo />
    </main>
  )
}
