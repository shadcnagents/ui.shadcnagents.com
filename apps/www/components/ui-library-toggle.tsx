"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

type UILibrary = "radix" | "baseui"

const UI_LIBRARY_KEY = "ui-library"
const DEFAULT_LIBRARY: UILibrary = "radix"

const UILibraryContext = React.createContext<{
  library: UILibrary
  setLibrary: (library: UILibrary) => void
}>({
  library: DEFAULT_LIBRARY,
  setLibrary: () => {},
})

export function UILibraryProvider({ children }: { children: React.ReactNode }) {
  const [library, setLibraryState] = React.useState<UILibrary>(DEFAULT_LIBRARY)

  React.useEffect(() => {
    const stored = localStorage.getItem(UI_LIBRARY_KEY) as UILibrary | null
    if (stored === "radix" || stored === "baseui") {
      setLibraryState(stored)
    }
  }, [])

  const setLibrary = React.useCallback((value: UILibrary) => {
    setLibraryState(value)
    localStorage.setItem(UI_LIBRARY_KEY, value)
    document.cookie = `${UI_LIBRARY_KEY}=${value};path=/;max-age=31536000;SameSite=Lax`
  }, [])

  return (
    <UILibraryContext.Provider value={{ library, setLibrary }}>
      {children}
    </UILibraryContext.Provider>
  )
}

export function useUILibrary() {
  const context = React.useContext(UILibraryContext)
  if (!context) {
    throw new Error("useUILibrary must be used within a UILibraryProvider")
  }
  return context
}

const options: { value: UILibrary; label: string }[] = [
  { value: "radix", label: "Radix" },
  { value: "baseui", label: "Base UI" },
]

export function UILibraryToggle() {
  const { library, setLibrary } = useUILibrary()

  return (
    <div className="inline-flex items-center rounded-md border border-border p-0.5 text-xs">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => setLibrary(option.value)}
          className={cn(
            "relative rounded-sm px-2.5 py-1 text-xs font-medium transition-colors",
            library === option.value
              ? "bg-foreground text-background shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
