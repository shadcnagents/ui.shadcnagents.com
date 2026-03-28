"use client"

import { useCallback } from "react"
import { motion as m } from "motion/react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { useSound } from "@/lib/hooks/use-sound"

export function ModeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const playClick = useSound("/assets/button-click.mp3")

  const switchTheme = useCallback(() => {
    playClick()
    const newTheme = resolvedTheme === "dark" ? "light" : "dark"
    setTheme(newTheme)
  }, [resolvedTheme, setTheme, playClick])

  return (
    <Button
      variant="ghost"
      className="size-9 px-0"
      onClick={() => {
        if (typeof document !== "undefined" && document.startViewTransition) {
          document.startViewTransition(switchTheme)
        } else {
          switchTheme()
        }
      }}
    >
      <m.svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-foreground"
        whileTap={{ scale: 0.9 }}
        animate={{ rotate: resolvedTheme === "dark" ? 180 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {/* Circle */}
        <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
        {/* Vertical divider */}
        <path d="M12 3l0 18" />
        {/* Diagonal stripes */}
        <path d="M12 9l4.65 -4.65" />
        <path d="M12 14.3l7.37 -7.37" />
        <path d="M12 19.6l8.85 -8.85" />
      </m.svg>
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
