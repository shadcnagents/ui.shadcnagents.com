import type { Metadata } from "next"

import { PromptEngineeringDemo } from "@/components/prompt-demo"

export const metadata: Metadata = {
  title: "Prompt Engineering — AI SDK",
  description:
    "Control AI output with system prompts, persona presets, and temperature tuning.",
}

export default function Page() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-background px-4 py-12">
      <PromptEngineeringDemo />
    </main>
  )
}
