import type { Metadata } from "next"
import { TranscribeDemo } from "@/components/transcribe-demo"

export const metadata: Metadata = {
  title: "Transcribe Audio — AI SDK Demo",
  description: "Transcribe audio files to text using OpenAI Whisper and the Vercel AI SDK.",
}

export default function Page() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-background px-4 py-12">
      <TranscribeDemo />
    </main>
  )
}
