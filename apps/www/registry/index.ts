import { examples } from "@/registry/examples"
import { type Registry } from "@/registry/schema"
import { ui } from "@/registry/ui"

export const registry = {
  name: "shadcncloud",
  homepage: "https://shadcncloud.com",
  items: [...ui, ...examples],
} satisfies Registry
