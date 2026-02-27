import type { Metadata } from "next"
import { GenerateSpeechDemo } from "@/components/generate-speech-demo"

export const metadata: Metadata = {
  title: "Generate Speech — AI SDK Demo",
  description: "Convert text to speech using OpenAI TTS with the Vercel AI SDK.",
}

export default function Page() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-background px-4 py-12">
      <GenerateSpeechDemo />
    </main>
  )
}
