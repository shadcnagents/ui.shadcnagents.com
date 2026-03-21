import type { ReactNode } from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"

import "@/styles/globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Prompt Injection Guard — Production Infrastructure",
  description:
    "OWASP LLM01 protection with real-time detection of jailbreaks, data extraction, and manipulation attempts.",
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
