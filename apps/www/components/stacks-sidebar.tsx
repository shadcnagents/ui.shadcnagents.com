"use client"

import { useMemo, useRef, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronDown, Lock, Search } from "lucide-react"

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
  const [query, setQuery] = useState("")
  const [expandAll, setExpandAll] = useState(false)
  const searchRef = useRef<HTMLInputElement>(null)

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()
    if (!q) return stacksConfig

    return stacksConfig
      .map((cat) => ({
        ...cat,
        items: cat.items
          .map((item) => {
            if (isSubCategory(item)) {
              const children = item.children.filter(
                (child) =>
                  child.text.toLowerCase().includes(q) ||
                  child.description.toLowerCase().includes(q)
              )
              if (children.length > 0) return { ...item, children }
              return null
            }
            if (
              item.text.toLowerCase().includes(q) ||
              item.description.toLowerCase().includes(q)
            )
              return item
            return null
          })
          .filter(Boolean) as (StackItem | StackSubCategory)[],
      }))
      .filter((cat) => cat.items.length > 0)
  }, [query])

  const isSearching = query.length > 0

  return (
    <div className="flex h-full flex-col">
      {/* Search */}
      <div className="px-3 pb-2">
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground/60" />
          <input
            ref={searchRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setQuery("")
                searchRef.current?.blur()
              }
            }}
            placeholder="Search stacks..."
            className="h-8 w-full rounded-md border border-border/60 bg-background/60 pl-8 pr-3 text-sm text-foreground outline-none placeholder:text-muted-foreground/55 focus:border-border focus:bg-background"
          />
        </div>
      </div>

      {/* Collapse All toggle */}
      <div className="flex items-center px-3 pb-3">
        <button
          onClick={() => setExpandAll(!expandAll)}
          className="text-xs text-muted-foreground/65 hover:text-foreground/80 transition-colors"
        >
          {expandAll ? "Collapse All" : "Expand All"}
        </button>
      </div>

      {/* Tree */}
      <nav className="min-h-0 flex-1 overflow-y-scroll px-2 pb-8 scrollbar-hide">
        {filtered.map((category) => (
          <CategorySection
            key={category.id}
            category={category}
            pathname={pathname}
            forceOpen={isSearching || expandAll}
          />
        ))}

        {filtered.length === 0 && (
          <div className="px-2 py-8 text-center">
            <p className="text-sm text-muted-foreground/60">
              No stacks found.
            </p>
          </div>
        )}
      </nav>
    </div>
  )
}

function CategorySection({
  category,
  pathname,
  forceOpen,
}: {
  category: StackCategory
  pathname: string
  forceOpen: boolean
}) {
  return (
    <div className="mb-6">
      {/* Category header */}
      <div className="px-2 pb-2 pt-1">
        <span className="text-[12px] font-bold uppercase tracking-wide text-foreground/70">
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
                forceOpen={forceOpen}
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
  forceOpen,
}: {
  sub: StackSubCategory
  pathname: string
  forceOpen: boolean
}) {
  const hasActive = sub.children.some((child) => pathname === child.link)
  const [open, setOpen] = useState(hasActive)

  const isOpen = forceOpen || open

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="group flex w-full items-center gap-1.5 rounded-md px-2 py-2 text-[13.5px] text-foreground/85 transition-colors hover:text-foreground"
      >
        <ChevronDown
          className={cn(
            "size-3.5 shrink-0 text-foreground/45 transition-transform duration-150",
            !isOpen && "-rotate-90"
          )}
        />
        <span className="font-medium">{sub.text}</span>
      </button>

      {isOpen && (
        <div className="ml-[15px] border-l border-border/60 pl-2">
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
        "group flex w-full items-center justify-between rounded-md px-2 py-2 text-[13.5px] transition-colors",
        isActive
          ? "bg-foreground/[0.1] font-semibold text-foreground"
          : "text-foreground/80 hover:bg-foreground/[0.06] hover:text-foreground"
      )}
    >
      <span className="truncate">{item.text}</span>
      {item.tier === "pro" && (
        <Lock className="ml-1.5 size-3 shrink-0 text-muted-foreground/50" />
      )}
    </Link>
  )
}
