"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { SidebarNavItem } from "types/nav"

import { cn } from "@/lib/utils"

export interface DocsSidebarNavProps {
  items: SidebarNavItem[]
}

export function DocsSidebarNav({ items }: DocsSidebarNavProps) {
  const pathname = usePathname()

  return items.length ? (
    <div className="w-full">
      {items.map((item, index) => (
        <div key={`${item.title}-${index}`} className={cn("pb-5")}>
          <h4 className="mb-1.5 px-2 py-1 text-xs font-semibold tracking-wide text-foreground/80">
            {item.title}
          </h4>
          {item?.items?.length && (
            <DocsSidebarNavItems items={item.items} pathname={pathname} />
          )}
        </div>
      ))}
    </div>
  ) : null
}

interface DocsSidebarNavItemsProps {
  items: SidebarNavItem[]
  pathname: string | null
}

export function DocsSidebarNavItems({
  items,
  pathname,
}: DocsSidebarNavItemsProps) {
  return items?.length ? (
    <div className="grid grid-flow-row auto-rows-max text-sm">
      {items.map((item, index) => (
        <NavItem
          key={`${item.title}-${index}`}
          item={item}
          pathname={pathname}
        />
      ))}
    </div>
  ) : null
}

interface NavItemProps {
  item: SidebarNavItem
  pathname: string | null
}

function NavItem({ item, pathname }: NavItemProps) {
  const isActive = pathname === item.href
  const hasChildren = item.items && item.items.length > 0

  if (hasChildren) {
    return (
      <div>
        <span className="flex w-full cursor-default items-center px-2 py-1.5 text-xs font-medium text-muted-foreground/70">
          {item.title}
        </span>
        <div className="ml-3 border-l border-border/50 pl-3">
          <DocsSidebarNavItems items={item.items} pathname={pathname} />
        </div>
      </div>
    )
  }

  if (item.href && !item.disabled) {
    return (
      <Link
        href={item.href}
        className={cn(
          "group flex w-full items-center rounded-md px-2 py-1.5 text-[13px] transition-colors hover:bg-muted/60 hover:text-foreground",
          item.disabled && "cursor-not-allowed opacity-60",
          isActive
            ? "bg-muted/80 font-medium text-foreground"
            : "text-muted-foreground"
        )}
        target={item.external ? "_blank" : ""}
        rel={item.external ? "noreferrer" : ""}
      >
        {item.title}
        {item.label && (
          <span className="ml-2 bg-primary px-1.5 py-0.5 text-[10px] font-semibold leading-none text-primary-foreground no-underline group-hover:no-underline">
            {item.label}
          </span>
        )}
      </Link>
    )
  }

  return (
    <span
      className={cn(
        "flex w-full cursor-not-allowed items-center p-2 text-muted-foreground hover:underline",
        item.disabled && "cursor-not-allowed opacity-60"
      )}
    >
      {item.title}
      {item.label && (
        <span className="ml-2 bg-primary/20 px-1.5 py-0.5 text-[10px] font-semibold leading-none text-primary no-underline group-hover:no-underline">
          {item.label}
        </span>
      )}
    </span>
  )
}
