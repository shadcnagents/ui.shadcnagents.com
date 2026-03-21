import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json()

    if (!prompt || typeof prompt !== "string") {
      return Response.json({ error: "prompt is required" }, { status: 400 })
    }

    const start = Date.now()

    const { text, usage } = await generateText({
      model: openai("gpt-4o"),
      prompt,
    })

    return Response.json({
      text,
      meta: {
        model: "gpt-4o",
        promptTokens: usage.promptTokens,
        completionTokens: usage.completionTokens,
        totalTokens: usage.totalTokens,
        latencyMs: Date.now() - start,
      },
    })
  } catch (error) {
    console.error("[generate-text]", error)
    return Response.json({ error: "Failed to generate text" }, { status: 500 })
  }
}
