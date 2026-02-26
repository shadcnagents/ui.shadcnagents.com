import { examples } from "@/registry/examples"
import { type Registry } from "@/registry/schema"
import { ui } from "@/registry/ui"

export const registry = {
  name: "shadcnagents",
  homepage: "https://shadcnagents.com",
  items: [...ui, ...examples],
} satisfies Registry
