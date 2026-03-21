import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = streamText({
    model: openai("gpt-4o"),
    system:
      "You are a helpful assistant. Format responses with markdown — use headings, code blocks with language tags, bold/italic, and lists where appropriate.",
    messages,
  })

  return result.toDataStreamResponse()
}
