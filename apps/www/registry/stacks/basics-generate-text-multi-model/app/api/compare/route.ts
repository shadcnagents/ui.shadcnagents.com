import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { anthropic } from "@ai-sdk/anthropic"
import { google } from "@ai-sdk/google"

const models = [
  { name: "GPT-4o", provider: () => openai("gpt-4o") },
  { name: "Claude Sonnet 4", provider: () => anthropic("claude-sonnet-4-20250514") },
  { name: "Gemini 2.0 Flash", provider: () => google("gemini-2.0-flash") },
]

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json()

    if (!prompt || typeof prompt !== "string") {
      return Response.json({ error: "prompt is required" }, { status: 400 })
    }

    const settled = await Promise.allSettled(
      models.map(async (model) => {
        const start = Date.now()
        const { text, usage } = await generateText({
          model: model.provider(),
          prompt,
        })
        return {
          model: model.name,
          text,
          tokens: usage.totalTokens,
          latencyMs: Date.now() - start,
        }
      })
    )

    return Response.json({
      results: settled.map((r, i) =>
        r.status === "fulfilled"
          ? r.value
          : {
              model: models[i].name,
              text: null,
              error: r.reason?.message || "Failed to generate",
              tokens: 0,
              latencyMs: 0,
            }
      ),
    })
  } catch (error) {
    console.error("[compare]", error)
    return Response.json(
      { error: "Failed to compare models" },
      { status: 500 }
    )
  }
}
