import type { ReactNode } from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"

import "@/styles/globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Semantic Response Cache — Production Infrastructure",
  description:
    "Reduce LLM costs by 80% with intelligent semantic caching using embeddings and cosine similarity.",
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`min-h-svh bg-background font-sans antialiased ${inter.className}`}
      >
        {children}
      </body>
    </html>
  )
}
