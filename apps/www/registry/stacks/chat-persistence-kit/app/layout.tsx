import type { ReactNode } from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"

import "@/styles/globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Chat Persistence Kit — Production Infrastructure",
  description:
    "Full-stack chat persistence with conversation history, database adapters, and message serialization.",
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
