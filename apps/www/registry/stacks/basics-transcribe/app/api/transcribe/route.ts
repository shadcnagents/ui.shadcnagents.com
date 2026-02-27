import { experimental_transcribe as transcribe } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const audio = formData.get("audio") as File | null

    if (!audio) {
      return Response.json({ error: "audio file is required" }, { status: 400 })
    }

    const { text } = await transcribe({
      model: openai.transcription("whisper-1"),
      audio,
    })

    return Response.json({ text })
  } catch (error) {
    console.error("[transcribe]", error)
    return Response.json({ error: "Failed to transcribe audio" }, { status: 500 })
  }
}
