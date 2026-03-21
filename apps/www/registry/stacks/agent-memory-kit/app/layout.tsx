import type { ReactNode } from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"

import "@/styles/globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Agent Memory Kit — Production Infrastructure",
  description:
    "Human-like memory patterns for AI agents with short-term, long-term, episodic, and semantic memory types.",
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
