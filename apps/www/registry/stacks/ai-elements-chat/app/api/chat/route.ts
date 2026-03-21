import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    const result = streamText({
      model: openai("gpt-4o"),
      system:
        "You are a helpful assistant. Keep responses concise and friendly.",
      messages,
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("[chat]", error)
    return Response.json({ error: "Failed to process chat" }, { status: 500 })
  }
}
