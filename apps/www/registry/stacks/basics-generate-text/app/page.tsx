import type { Metadata } from "next"
import { GenerateTextDemo } from "@/components/generate-text-demo"

export const metadata: Metadata = {
  title: "Generate Text — AI SDK Demo",
  description: "Generate text completions using the Vercel AI SDK and OpenAI GPT-4o.",
}

export default function Page() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-background px-4 py-12">
      <GenerateTextDemo />
    </main>
  )
}
