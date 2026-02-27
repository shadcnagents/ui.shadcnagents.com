import { streamText } from "ai"
import { anthropic } from "@ai-sdk/anthropic"

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = streamText({
    model: anthropic("claude-sonnet-4-20250514"),
    messages,
    providerOptions: {
      anthropic: { thinking: { type: "enabled", budgetTokens: 5000 } },
    },
  })

  return result.toDataStreamResponse()
}