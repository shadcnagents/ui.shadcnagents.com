import type { Metadata } from "next"
import { Inter } from "next/font/google"
import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Generate Speech — AI SDK Demo",
  description: "Convert text to speech using OpenAI TTS with the Vercel AI SDK.",
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-svh bg-background font-sans antialiased", inter.className)}>
        {children}
      </body>
    </html>
  )
}
