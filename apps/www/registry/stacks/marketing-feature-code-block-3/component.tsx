export function FeatureCodeBlockDark() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <h2 className="text-2xl font-semibold tracking-tight">
          Agent Architecture
        </h2>
        <div className="mt-8 overflow-hidden rounded-xl bg-[#0a0a0a] text-left text-white">
          <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-2">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="size-2.5 rounded-full bg-white/10" />
                <div className="size-2.5 rounded-full bg-white/10" />
                <div className="size-2.5 rounded-full bg-white/10" />
              </div>
              <span className="ml-2 text-xs text-white/30">agent.ts</span>
            </div>
          </div>
          <pre className="p-4 text-xs leading-relaxed">
{`import { generateText, tool } from "ai"
import { anthropic } from "@ai-sdk/anthropic"
import { z } from "zod"

const result = await generateText({
  model: anthropic("claude-sonnet-4-20250514"),
  maxSteps: 5,
  tools: {
    search: tool({
      description: "Search the web",
      parameters: z.object({ query: z.string() }),
      execute: async ({ query }) => searchWeb(query),
    }),
  },
  prompt: "Research the latest AI trends",
})`}
          </pre>
        </div>
      </div>
    </section>
  )
}