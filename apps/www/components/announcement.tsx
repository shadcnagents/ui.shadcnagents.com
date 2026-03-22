import Link from "next/link"
import { ExternalLink, Sparkles } from "lucide-react"

import { Separator } from "@/components/ui/separator"

export function Announcement() {
  return (
    <Link
      href="https://shadcnagents.com"
      className="hidden md:block"
      target="_blank"
      rel="noreferrer"
    >
      <span className="group inline-flex items-center rounded-full border border-border/50 bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
        <Sparkles className="mr-2 size-3.5 group-hover:text-cyan-500" />
        <Separator className="mx-2 h-4 bg-border/80" orientation="vertical" />
        <span>New! AI SDK agent patterns</span>
        <ExternalLink className="ml-2 size-3" />
      </span>
    </Link>
  )
}
