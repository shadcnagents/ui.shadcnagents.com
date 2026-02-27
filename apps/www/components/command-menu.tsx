"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  CircleIcon,
  FileIcon,
  LaptopIcon,
  MoonIcon,
  SunIcon,
} from "@radix-ui/react-icons"
import { useTheme } from "next-themes"

import { docsConfig } from "@/config/docs"
import { stacksConfig, isSubCategory } from "@/config/stacks"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"

export function CommandMenu() {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const { setTheme } = useTheme()

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
        if (
          (e.target instanceof HTMLElement && e.target.isContentEditable) ||
          e.target instanceof HTMLInputElement ||
          e.target instanceof HTMLTextAreaElement ||
          e.target instanceof HTMLSelectElement
        ) {
          return
        }

        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const openMenu = React.useCallback(() => setOpen(true), [])

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false)
    command()
  }, [])

  const renderItems = (items: any[]) => {
    return items.map((item) => {
      if (item.href) {
        return (
          <CommandItem
            key={item.href}
            value={item.title}
            onSelect={() => {
              runCommand(() => router.push(item.href as string))
            }}
          >
            <div className="mr-2 flex size-4 items-center justify-center">
              <CircleIcon className="size-3" />
            </div>
            {item.title}
          </CommandItem>
        )
      } else if (item.items) {
        return (
          <CommandGroup key={item.title} heading={item.title}>
            {renderItems(item.items)}
          </CommandGroup>
        )
      }
    })
  }

  return (
    <>
      <CommandMenuTrigger onClick={openMenu} />
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Links">
            {docsConfig.mainNav
              .filter((navitem) => !navitem.external)
              .map((navItem) => (
                <CommandItem
                  key={navItem.href}
                  value={navItem.title}
                  onSelect={() => {
                    runCommand(() => router.push(navItem.href as string))
                  }}
                >
                  <FileIcon className="mr-2 size-4" />
                  {navItem.title}
                </CommandItem>
              ))}
          </CommandGroup>
          {docsConfig.sidebarNav.map((group) => (
            <CommandGroup key={group.title} heading={group.title}>
              {renderItems(group.items)}
            </CommandGroup>
          ))}
          <CommandSeparator />
          {stacksConfig.map((category) => (
            <CommandGroup key={category.id} heading={category.name}>
              {category.items.map((item) => {
                if (isSubCategory(item)) {
                  return item.children.map((child) => (
                    <CommandItem
                      key={child.link}
                      value={`${child.text} ${child.description}`}
                      onSelect={() => {
                        runCommand(() => router.push(child.link))
                      }}
                    >
                      <div className="mr-2 flex size-4 items-center justify-center">
                        <CircleIcon className="size-3" />
                      </div>
                      {child.text}
                    </CommandItem>
                  ))
                }
                return (
                  <CommandItem
                    key={item.link}
                    value={`${item.text} ${item.description}`}
                    onSelect={() => {
                      runCommand(() => router.push(item.link))
                    }}
                  >
                    <div className="mr-2 flex size-4 items-center justify-center">
                      <CircleIcon className="size-3" />
                    </div>
                    {item.text}
                  </CommandItem>
                )
              })}
            </CommandGroup>
          ))}
          <CommandSeparator />
          <CommandGroup heading="Theme">
            <CommandItem onSelect={() => runCommand(() => setTheme("light"))}>
              <SunIcon className="mr-2 size-4" />
              Light
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme("dark"))}>
              <MoonIcon className="mr-2 size-4" />
              Dark
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme("system"))}>
              <LaptopIcon className="mr-2 size-4" />
              System
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}

function CommandMenuTrigger({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative ml-6 inline-flex h-8 w-64 items-center justify-start gap-2 rounded-md border border-border bg-muted/50 px-3 text-sm text-muted-foreground transition-colors hover:bg-muted"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-3.5"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
      <span className="flex-1 text-left text-xs">
        Search documentation...
      </span>
      <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-0.5 rounded border border-border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
        <span className="text-xs">&#8984;</span>K
      </kbd>
    </button>
  )
}
