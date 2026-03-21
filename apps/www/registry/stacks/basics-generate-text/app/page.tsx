import type { Metadata } from "next"

import { GenerateTextDemo } from "@/components/generate-text-demo"

export const metadata: Metadata = {
  title: "Generate Text — AI SDK",
  description:
    "Server-side text generation with GPT-4o. Returns typed responses with usage metadata.",
}

export default function Page() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-background px-4 py-12">
      <GenerateTextDemo />
    </main>
  )
}
