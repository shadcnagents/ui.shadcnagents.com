import { streamText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json()

    if (!prompt || typeof prompt !== "string") {
      return Response.json({ error: "prompt is required" }, { status: 400 })
    }

    const result = streamText({
      model: openai("gpt-4o"),
      prompt,
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("[completion]", error)
    return Response.json({ error: "Failed to stream text" }, { status: 500 })
  }
}
