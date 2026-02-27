import type { Metadata } from "next"
import { StreamTextDemo } from "@/components/stream-text-demo"

export const metadata: Metadata = {
  title: "Stream Text — AI SDK Demo",
  description: "Real-time text streaming with the Vercel AI SDK and useCompletion hook.",
}

export default function Page() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-background px-4 py-12">
      <StreamTextDemo />
    </main>
  )
}
