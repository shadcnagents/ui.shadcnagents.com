import type { Metadata } from "next"

import { MultiModelDemo } from "@/components/multi-model-demo"

export const metadata: Metadata = {
  title: "Multi-Model Comparison — AI SDK",
  description:
    "Compare GPT-4o, Claude Sonnet 4, and Gemini 2.0 Flash responses side by side.",
}

export default function Page() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-background px-4 py-12">
      <MultiModelDemo />
    </main>
  )
}
