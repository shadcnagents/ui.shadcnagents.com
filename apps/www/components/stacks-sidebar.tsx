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
import { getBrandKeyForStack } from "@/config/brands"
import { brandIconMap } from "@/components/brand-icons"

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
        <span className="text-xs font-bold uppercase tracking-[0.15em] text-foreground/50">
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
        className="group flex w-full items-center gap-1.5 rounded-md py-[7px] pl-3.5 pr-2 text-left font-mono text-[15px] font-medium text-foreground/70 transition-colors hover:text-foreground"
      >
        <span className="min-w-0 flex-1 truncate">{sub.text}</span>
        <ChevronDown
          className={cn(
            "ml-auto size-3.5 shrink-0 text-foreground/40 transition-transform duration-150",
            !isOpen && "-rotate-90"
          )}
        />
      </button>

      <div
        className={cn(
          "grid transition-[grid-template-rows] duration-200 ease-out",
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <div className="overflow-hidden">
          <div className="ml-5 border-l border-foreground/[0.08] pl-2">
            {sub.children.map((child) => (
              <ItemLink key={child.link} item={child} pathname={pathname} nested />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function ItemLink({
  item,
  pathname,
  nested,
}: {
  item: StackItem
  pathname: string
  nested?: boolean
}) {
  const isActive = pathname === item.link
  const slug = item.link.replace("/stacks/", "")
  const brandKey = getBrandKeyForStack(slug)
  const BrandIcon = brandKey ? brandIconMap[brandKey] : undefined

  return (
    <Link
      href={item.link}
      scroll={false}
      className={cn(
        "group flex w-full items-center gap-2 rounded-md pr-2 font-mono transition-colors",
        nested ? "py-[5px] pl-3 text-[13.5px]" : "py-[7px] pl-3.5 text-[15px]",
        isActive
          ? "bg-foreground/[0.06] text-foreground font-medium"
          : "text-foreground/60 hover:bg-foreground/[0.03] hover:text-foreground"
      )}
    >
      {BrandIcon && (
        <BrandIcon className="size-3.5 shrink-0 text-foreground/30" />
      )}
      <span className="truncate">{item.text}</span>
      {item.tier === "pro" && (
        <Lock className="ml-auto size-3 shrink-0 text-blue-500/60" />
      )}
    </Link>
  )
}
