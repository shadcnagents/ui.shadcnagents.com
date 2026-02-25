import "@/styles/globals.css"

import { Metadata, Viewport } from "next"

import { siteConfig } from "@/config/site"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"

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

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s · shadcncloud`,
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
  authors: [{ name: "shadcncloud", url: "https://shadcncloud.com" }],
  creator: "shadcncloud",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: "shadcncloud",
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "shadcncloud – AI SDK Agent Patterns",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: "@shadcncloud",
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
          GeistMono.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div vaul-drawer-wrapper="">
            <div className="relative z-10 flex min-h-screen flex-col">
              {children}
            </div>
          </div>
          <TailwindIndicator />
          <ThemeSwitcher />
          <Analytics />
          <NewYorkToaster />
          <DefaultToaster />
          <NewYorkSonner />
        </ThemeProvider>
      </body>
    </html>
  )
}
