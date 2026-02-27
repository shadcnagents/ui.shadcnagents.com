import { transcribe } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(req: Request) {
  const form = await req.formData()
  const audio = form.get("audio") as File

  const { text } = await transcribe({
    model: openai.transcription("whisper-1"),
    audio,
  })

  return Response.json({ text })
}