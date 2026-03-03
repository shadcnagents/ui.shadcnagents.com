import type { Metadata } from "next"
import { Inter } from "next/font/google"
import type { ReactNode } from "react"
import "@/styles/globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Output Sanitizer — Production Infrastructure",
  description: "XSS prevention for AI-generated content with threat detection and security reporting.",
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
