import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(req: Request) {
  try {
    const { prompt, system, temperature = 0.7 } = await req.json()

    if (!prompt || typeof prompt !== "string") {
      return Response.json({ error: "prompt is required" }, { status: 400 })
    }

    const temp = Math.min(Math.max(Number(temperature) || 0.7, 0), 2)
    const start = Date.now()

    const { text, usage } = await generateText({
      model: openai("gpt-4o"),
      system: system || undefined,
      prompt,
      temperature: temp,
    })

    return Response.json({
      text,
      meta: {
        model: "gpt-4o",
        system: system || null,
        temperature: temp,
        promptTokens: usage.promptTokens,
        completionTokens: usage.completionTokens,
        totalTokens: usage.totalTokens,
        latencyMs: Date.now() - start,
      },
    })
  } catch (error) {
    console.error("[generate]", error)
    return Response.json(
      { error: "Failed to generate text" },
      { status: 500 }
    )
  }
}
