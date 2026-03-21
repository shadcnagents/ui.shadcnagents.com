import { NextResponse } from "next/server"
import { openai } from "@ai-sdk/openai"
import { embed, embedMany } from "ai"

export async function POST(request: Request) {
  try {
    const { text, texts } = await request.json()

    // Handle batch embedding
    if (texts && Array.isArray(texts)) {
      const { embeddings } = await embedMany({
        model: openai.embedding("text-embedding-3-small"),
        values: texts,
      })

      return NextResponse.json({ embeddings })
    }

    // Handle single embedding
    if (text) {
      const { embedding } = await embed({
        model: openai.embedding("text-embedding-3-small"),
        value: text,
      })

      return NextResponse.json({ embedding })
    }

    return NextResponse.json(
      { error: "Missing 'text' or 'texts' parameter" },
      { status: 400 }
    )
  } catch (error) {
    console.error("Embedding error:", error)
    return NextResponse.json(
      { error: "Failed to generate embedding" },
      { status: 500 }
    )
  }
}
