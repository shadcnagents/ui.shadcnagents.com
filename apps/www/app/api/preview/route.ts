import { groq } from "@ai-sdk/groq"
import { streamText } from "ai"

export async function POST(req: Request) {
  try {
    const { messages, system } = await req.json()

    const result = streamText({
      model: groq("llama-3.3-70b-versatile"),
      system: system || "You are a helpful AI assistant. Keep responses concise.",
      messages,
    })

    return result.toTextStreamResponse()
  } catch (error) {
    console.error("[preview]", error)
    return Response.json({ error: "Failed to process" }, { status: 500 })
  }
}
