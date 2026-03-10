import type { Metadata } from "next"
import { Inter } from "next/font/google"
import type { ReactNode } from "react"
import "@/styles/globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Request Deduplicator — Production Infrastructure",
  description: "Prevent duplicate API requests with intelligent request deduplication and caching.",
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`min-h-svh bg-background font-sans antialiased ${inter.className}`}>
        {children}
      </body>
    </html>
  )
}
