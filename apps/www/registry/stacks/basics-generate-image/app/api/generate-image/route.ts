import { experimental_generateImage as generateImage } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json()

    if (!prompt || typeof prompt !== "string") {
      return Response.json({ error: "prompt is required" }, { status: 400 })
    }

    const { image } = await generateImage({
      model: openai.image("dall-e-3"),
      prompt,
      size: "1024x1024",
    })

    return Response.json({ base64: image.base64 })
  } catch (error) {
    console.error("[generate-image]", error)
    return Response.json({ error: "Failed to generate image" }, { status: 500 })
  }
}
