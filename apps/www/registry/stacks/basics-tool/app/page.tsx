import type { Metadata } from "next"
import { ToolCallDemo } from "@/components/tool-call-demo"

export const metadata: Metadata = {
  title: "Tool Calling — AI SDK Demo",
  description: "Type-safe tool calling with the Vercel AI SDK. Define functions the model can invoke.",
}

export default function Page() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-background px-4 py-12">
      <ToolCallDemo />
    </main>
  )
}
