import type { Metadata } from "next"
import { GenerateImageDemo } from "@/components/generate-image-demo"

export const metadata: Metadata = {
  title: "Generate Image — AI SDK Demo",
  description: "Generate images with DALL-E 3 using the Vercel AI SDK.",
}

export default function Page() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-background px-4 py-12">
      <GenerateImageDemo />
    </main>
  )
}
