"use client"

import { useState } from "react"

/* ─── Button & Input Groups ─── */
export function ButtonInputGroupPreview() {
  const [selectedSize, setSelectedSize] = useState("md")
  const [inputValue, setInputValue] = useState("")

  return (
    <div className="mx-auto w-full max-w-lg space-y-8 p-8">
      {/* Button Group */}
      <div className="space-y-3">
        <span className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Button Group
        </span>
        <div className="flex">
          {["Day", "Week", "Month", "Year"].map((label, i, arr) => (
            <button
              key={label}
              className={`h-8 border border-border px-4 text-sm font-medium transition-colors first:rounded-l-md last:rounded-r-md ${
                i > 0 ? "-ml-px" : ""
              } ${
                label === "Week"
                  ? "z-10 bg-primary text-primary-foreground"
                  : "bg-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Segmented Control */}
      <div className="space-y-3">
        <span className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Segmented Control
        </span>
        <div className="inline-flex rounded-md bg-card p-0.5">
          {["sm", "md", "lg", "xl"].map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`rounded-[5px] px-4 py-1.5 text-sm font-medium transition-colors ${
                selectedSize === size
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {size.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Input Group */}
      <div className="space-y-3">
        <span className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Input Group
        </span>
        <div className="flex">
          <span className="flex h-9 items-center rounded-l-md border border-r-0 border-border bg-card px-3 text-sm text-muted-foreground">
            https://
          </span>
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="example.com"
            className="h-9 flex-1 border border-border bg-transparent px-3 text-sm outline-none placeholder:text-muted-foreground focus:border-foreground/60"
          />
          <button className="h-9 rounded-r-md border border-l-0 border-border bg-foreground px-4 text-sm font-medium text-background">
            Go
          </button>
        </div>
      </div>

      {/* Input with Icon */}
      <div className="space-y-3">
        <span className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Search Input
        </span>
        <div className="relative">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            placeholder="Search patterns..."
            className="h-9 w-full rounded-md border border-border bg-transparent pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:border-foreground/60"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 rounded border border-border bg-card px-1.5 py-0.5 text-sm text-muted-foreground">
            /
          </kbd>
        </div>
      </div>
    </div>
  )
}
