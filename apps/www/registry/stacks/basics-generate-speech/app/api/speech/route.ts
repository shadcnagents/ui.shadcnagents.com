import { experimental_generateSpeech as generateSpeech } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(req: Request) {
  try {
    const { text, voice = "alloy" } = await req.json()

    if (!text || typeof text !== "string") {
      return Response.json({ error: "text is required" }, { status: 400 })
    }

    const { audio } = await generateSpeech({
      model: openai.speech("tts-1"),
      text,
      voice,
    })

    return new Response(audio, {
      headers: { "Content-Type": "audio/mpeg" },
    })
  } catch (error) {
    console.error("[speech]", error)
    return Response.json({ error: "Failed to generate speech" }, { status: 500 })
  }
}
