import { streamText } from "ai"
import { anthropic } from "@ai-sdk/anthropic"

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = streamText({
    model: anthropic("claude-sonnet-4-6"),
    system: `You are an expert React developer. When asked to build a component:
1. Write clean, production-ready TypeScript/React code
2. Use Tailwind CSS for styling
3. Return ONLY a single fenced code block with the complete component
4. Include a brief one-sentence description before the code block`,
    messages,
  })

  return result.toDataStreamResponse()
}