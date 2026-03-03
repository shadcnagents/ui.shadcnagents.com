import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { prompt, model = "gpt-4o-mini" } = await request.json()

    const startTime = Date.now()

    const { text, usage } = await generateText({
      model: openai(model),
      prompt,
      maxTokens: 500,
    })

    const latencyMs = Date.now() - startTime

    return NextResponse.json({
      text,
      usage: {
        promptTokens: usage?.promptTokens || 0,
        completionTokens: usage?.completionTokens || 0,
        totalTokens: usage?.totalTokens || 0,
      },
      latencyMs,
      cached: false,
    })
  } catch (error) {
    console.error("Chat error:", error)
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    )
  }
}
