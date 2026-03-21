import { openai } from "@ai-sdk/openai"
import { generateImage } from "ai"

export async function POST(req: Request) {
  const { prompt } = await req.json()

  const { image } = await generateImage({
    model: openai.image("dall-e-3"),
    prompt,
    size: "1024x1024",
    quality: "standard",
  })

  return Response.json({ url: image.url })
}
