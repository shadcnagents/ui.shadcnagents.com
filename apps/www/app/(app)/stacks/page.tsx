import Link from "next/link"
import { Lock } from "lucide-react"

import { stacksConfig, isSubCategory } from "@/config/stacks"
import { cn } from "@/lib/utils"

export default function StacksPage() {
  return (
    <div className="mx-auto max-w-3xl px-8 py-16">
      <div className="mb-16 space-y-3">
        <h1 className="text-2xl font-medium tracking-tight">Stacks</h1>
        <p className="text-[15px] leading-relaxed text-muted-foreground">
          Production-ready AI stacks built with the Vercel AI SDK. Each
          stack is a self-contained implementation you can copy into your
          project.
        </p>
      </div>

      <div className="space-y-12">
        {stacksConfig.map((category) => (
          <section key={category.id}>
            <h2 className="mb-4 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/50">
              {category.name}
            </h2>
            <div className="divide-y divide-border/50">
              {category.items.map((item) => {
                if (isSubCategory(item)) {
                  return item.children.map((child) => (
                    <StackRow
                      key={child.link}
                      text={child.text}
                      description={child.description}
                      link={child.link}
                      tier={child.tier}
                    />
                  ))
                }
                return (
                  <StackRow
                    key={item.link}
                    text={item.text}
                    description={item.description}
                    link={item.link}
                    tier={item.tier}
                  />
                )
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}

function StackRow({
  text,
  description,
  link,
  tier,
}: {
  text: string
  description: string
  link: string
  tier: "free" | "pro"
}) {
  return (
    <Link
      href={link}
      className="group flex items-center justify-between py-3 transition-colors"
    >
      <div className="min-w-0">
        <span className="text-[15px] font-medium text-foreground group-hover:underline group-hover:underline-offset-4">
          {text}
        </span>
        <p className="mt-0.5 text-[13px] text-muted-foreground/60">
          {description}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-3 pl-4">
        {tier === "pro" && (
          <Lock className="size-3 text-muted-foreground/30" />
        )}
        <span
          className={cn(
            "text-[11px] font-medium uppercase tracking-wider",
            tier === "free"
              ? "text-muted-foreground/40"
              : "text-muted-foreground/30"
          )}
        >
          {tier}
        </span>
      </div>
    </Link>
  )
}
