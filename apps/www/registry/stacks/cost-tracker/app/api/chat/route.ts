import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"

export const maxDuration = 30

export async function POST(req: Request) {
  const { messages, model = "gpt-4o-mini" } = await req.json()

  const result = streamText({
    model: openai(model),
    messages,
  })

  // Get usage from the result for cost tracking
  const response = result.toDataStreamResponse()

  return response
}
