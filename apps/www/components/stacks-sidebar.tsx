"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronDown, Lock } from "lucide-react"

import {
  stacksConfig,
  isSubCategory,
  type StackCategory,
  type StackItem,
  type StackSubCategory,
} from "@/config/stacks"
import { cn } from "@/lib/utils"

export function StacksSidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full flex-col">
      <nav className="min-h-0 flex-1 overflow-y-scroll px-2 pb-8 pt-1 scrollbar-hide">
        {stacksConfig.map((category) => (
          <CategorySection
            key={category.id}
            category={category}
            pathname={pathname ?? ""}
          />
        ))}
      </nav>
    </div>
  )
}

function CategorySection({
  category,
  pathname,
}: {
  category: StackCategory
  pathname: string
}) {
  return (
    <div className="mb-6">
      {/* Category header */}
      <div className="px-2 pb-1.5 pt-1">
        <span className="text-[14px] font-bold uppercase tracking-[0.15em] text-foreground/90">
          {category.name}
        </span>
      </div>

      {/* Items */}
      <div>
        {category.items.map((item) => {
          if (isSubCategory(item)) {
            return (
              <SubCategorySection
                key={item.text}
                sub={item}
                pathname={pathname}
              />
            )
          }
          return (
            <ItemLink key={item.link} item={item} pathname={pathname} />
          )
        })}
      </div>
    </div>
  )
}

function SubCategorySection({
  sub,
  pathname,
}: {
  sub: StackSubCategory
  pathname: string
}) {
  const hasActive = sub.children.some((child) => pathname === child.link)
  const [open, setOpen] = useState(hasActive)

  const isOpen = open

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="group flex w-full items-center gap-1.5 rounded-md px-2 py-[7px] text-[15px] font-medium text-foreground/90 transition-colors hover:text-foreground"
      >
        <ChevronDown
          className={cn(
            "size-3.5 shrink-0 text-foreground/40 transition-transform duration-150",
            !isOpen && "-rotate-90"
          )}
        />
        <span>{sub.text}</span>
      </button>

      {isOpen && (
        <div className="ml-[15px] border-l border-border/50 pl-2">
          {sub.children.map((child) => (
            <ItemLink key={child.link} item={child} pathname={pathname} />
          ))}
        </div>
      )}
    </div>
  )
}

function ItemLink({
  item,
  pathname,
}: {
  item: StackItem
  pathname: string
}) {
  const isActive = pathname === item.link

  return (
    <Link
      href={item.link}
      scroll={false}
      className={cn(
        "group flex w-full items-center gap-2 rounded-md px-2 py-[7px] text-[15px] transition-colors",
        isActive
          ? "text-foreground font-medium"
          : "text-foreground/80 hover:text-foreground"
      )}
    >
      {/* Left accent bar for active state only */}
      {isActive && (
        <span className="h-4 w-[3px] shrink-0 rounded-full bg-primary" />
      )}
      <span className="truncate">{item.text}</span>
      {item.tier === "pro" && (
        <Lock className="ml-auto size-3 shrink-0 text-primary/40" />
      )}
    </Link>
  )
}
