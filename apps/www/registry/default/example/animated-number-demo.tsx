"use client"

import { useState } from "react"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { AnimatedNumber } from "@/registry/default/ui/animated-number"

export default function AnimatedNumberDemo() {
  const [value, setValue] = useState(1000)

  return (
    <div className="mx-auto flex max-w-sm flex-col items-center gap-4 py-6">
      <div className="rounded-xl border border-border bg-card p-6 text-center">
        <p className="mb-2 text-sm text-muted-foreground">Animated Counter</p>
        <div className="text-5xl font-bold tabular-nums">
          <AnimatedNumber value={value} />
        </div>
      </div>
      <Button
        variant="outline"
        className="gap-2"
        onClick={() => setValue(value + 100)}
      >
        <Plus className="size-4" />
        Add 100
      </Button>
    </div>
  )
}
