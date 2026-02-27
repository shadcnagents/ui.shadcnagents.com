import "@/styles/globals.css"

import { Metadata, Viewport } from "next"
import { Suspense } from "react"

import { siteConfig } from "@/config/site"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Playfair_Display, Boldonse, Pattaya, Oooh_Baby } from "next/font/google"

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  style: "italic",
  variable: "--font-playfair",
  display: "swap",
})

const pattaya = Pattaya({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-pattaya",
  display: "swap",
})

const boldonse = Boldonse({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-boldonse",
  display: "swap",
})

const ooohBaby = Oooh_Baby({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-oooh-baby",
  display: "swap",
})


import { cn } from "@/lib/utils"
import { Toaster as NewYorkSonner } from "@/components/ui/sonner"
import {
  Toaster as DefaultToaster,
  Toaster as NewYorkToaster,
} from "@/components/ui/toaster"
import { Analytics } from "@/components/analytics"
import { ThemeProvider } from "@/components/providers"
import { TailwindIndicator } from "@/components/tailwind-indicator"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { SessionProvider } from "@/components/session-provider"
import { PostHogProvider } from "@/components/posthog-provider"

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s · shadcnagents`,
  },
  metadataBase: new URL(siteConfig.url),
  description: siteConfig.description,
  keywords: [
    "ai sdk",
    "ai sdk agents",
    "ai sdk patterns",
    "vercel ai sdk",
    "shadcn",
    "shadcn ui",
    "agent patterns",
    "tool calling",
    "ai workflows",
    "next.js 16",
    "react 19",
    "tailwind v4",
    "turbopack",
  ],
  authors: [{ name: "shadcnagents", url: "https://shadcnagents.com" }],
  creator: "shadcnagents",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: "shadcnagents",
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "shadcnagents – AI SDK Agent Patterns",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: "@shadcnagents",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: `${siteConfig.url}/site.webmanifest`,
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "relative min-h-screen bg-background font-sans antialiased",
          GeistSans.variable,
          GeistMono.variable,
          playfairDisplay.variable,
          boldonse.variable,
          pattaya.variable,
          ooohBaby.variable
        )}
      >
        {/* Paper noise texture — two layers for light/dark, hidden on stacks */}
        <div
          aria-hidden
          className="noise-overlay pointer-events-none fixed inset-0 z-[9999] mix-blend-multiply opacity-[0.07] dark:hidden"
          style={{
            backgroundImage:
              'url("/page-background/light-bg-paper-texture.webp")',
            backgroundSize: "200px 200px",
          }}
        />
        <div
          aria-hidden
          className="noise-overlay pointer-events-none fixed inset-0 z-[9999] hidden mix-blend-screen opacity-[0.05] dark:block"
          style={{
            backgroundImage: 'url("/page-background/bg-paper-texture.webp")',
            backgroundSize: "200px 200px",
          }}
        />
        <SessionProvider>
          <PostHogProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <div vaul-drawer-wrapper="">
                <div className="relative z-10 flex min-h-screen flex-col">
                  <Suspense>{children}</Suspense>
                </div>
              </div>
              <TailwindIndicator />
              <ThemeSwitcher />
              <Analytics />
              <NewYorkToaster />
              <DefaultToaster />
              <NewYorkSonner />
            </ThemeProvider>
          </PostHogProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
