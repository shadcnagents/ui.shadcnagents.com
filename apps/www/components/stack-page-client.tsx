"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ClipboardCopy,
  Code2,
  Copy,
  ExternalLink,
  Eye,
  FileIcon,
  FolderIcon,
  FolderOpenIcon,
  Layers,
  Lock,
  Monitor,
  PenTool,
  RefreshCw,
  Smartphone,
  Square,
  Tablet,
  Github,
  Terminal,
  X,
} from "lucide-react"

import { getAllStacks } from "@/config/stacks"
import { stackContent } from "@/config/stack-content"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { stackPreviewRegistry } from "@/components/stack-previews"
import type { StackRegistryFile } from "@/lib/stack-registry"
import { Button } from "@/components/ui/button"
import {
  ClaudeAIIcon,
  OpenAIIcon,
  GoogleIcon,
  NextjsIcon,
  ReactIcon,
  TypeScriptIcon,
  TailwindCSSIcon,
  SupabaseIconGreen,
} from "@/components/icons"

interface ProSourceFile {
  name: string
  code: string
}

type PkgManager = "npm" | "pnpm" | "yarn" | "bun"

const PKG_MANAGERS: { id: PkgManager; label: string }[] = [
  { id: "npm", label: "npm" },
  { id: "pnpm", label: "pnpm" },
  { id: "yarn", label: "yarn" },
  { id: "bun", label: "bun" },
]

function getCLICommand(pkgManager: PkgManager, slug: string): string {
  const url = `https://shadcnagents.com/r/${slug}`
  switch (pkgManager) {
    case "npm":  return `npx shadcn@latest add ${url}`
    case "pnpm": return `pnpm dlx shadcn@latest add ${url}`
    case "yarn": return `yarn dlx shadcn@latest add ${url}`
    case "bun":  return `bunx --bun shadcn@latest add ${url}`
  }
}

/* ─── Provider / Tech icon mapping ─── */

const TECH_ICON_MAP: { match: string; icon: React.ComponentType<any>; label: string }[] = [
  { match: "Anthropic", icon: ClaudeAIIcon, label: "Anthropic Claude" },
  { match: "Claude", icon: ClaudeAIIcon, label: "Anthropic Claude" },
  { match: "OpenAI", icon: OpenAIIcon, label: "OpenAI" },
  { match: "Google", icon: GoogleIcon, label: "Google" },
  { match: "Gemini", icon: GoogleIcon, label: "Google Gemini" },
  { match: "Next.js", icon: NextjsIcon, label: "Next.js" },
  { match: "React", icon: ReactIcon, label: "React" },
  { match: "TypeScript", icon: TypeScriptIcon, label: "TypeScript" },
  { match: "Tailwind", icon: TailwindCSSIcon, label: "Tailwind CSS" },
  { match: "Supabase", icon: SupabaseIconGreen, label: "Supabase" },
]

function getProviderIcons(techStack: string[]) {
  const seen = new Set<React.ComponentType<any>>()
  const result: { icon: React.ComponentType<any>; label: string }[] = []
  for (const tech of techStack) {
    const entry = TECH_ICON_MAP.find((m) => tech.includes(m.match))
    if (entry && !seen.has(entry.icon)) {
      seen.add(entry.icon)
      result.push({ icon: entry.icon, label: entry.label })
    }
  }
  return result
}

function StackBlitzIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 28 28" fill="none" {...props}>
      <path d="M12.747 16.273h-7.46L18.925 1.5l-3.671 10.227h7.46L9.075 26.5l3.672-10.227z" fill="currentColor" />
    </svg>
  )
}

function makeThemeVars(base: Record<string, string>) {
  const vars: Record<string, string> = {}
  for (const [key, value] of Object.entries(base)) {
    vars[key] = value
    vars[`--color-${key.slice(2)}`] = value
  }
  return vars
}

const themePresets = [
  {
    name: "Default",
    dot: "#18181b",
    vars: makeThemeVars({
      "--primary": "oklch(0.205 0 0)",
      "--primary-foreground": "oklch(0.985 0 0)",
      "--accent": "oklch(0.97 0 0)",
      "--accent-foreground": "oklch(0.205 0 0)",
      "--muted": "oklch(0.97 0 0)",
      "--muted-foreground": "oklch(0.556 0 0)",
    }),
  },
  {
    name: "Blue",
    dot: "#2563eb",
    vars: makeThemeVars({
      "--primary": "oklch(0.546 0.245 262.881)",
      "--primary-foreground": "oklch(0.985 0 0)",
      "--accent": "oklch(0.932 0.032 255)",
      "--accent-foreground": "oklch(0.21 0.066 265)",
      "--muted": "oklch(0.932 0.032 255)",
      "--muted-foreground": "oklch(0.556 0.02 260)",
    }),
  },
  {
    name: "Green",
    dot: "#16a34a",
    vars: makeThemeVars({
      "--primary": "oklch(0.596 0.171 149.214)",
      "--primary-foreground": "oklch(0.985 0 0)",
      "--accent": "oklch(0.94 0.03 155)",
      "--accent-foreground": "oklch(0.21 0.06 150)",
      "--muted": "oklch(0.94 0.03 155)",
      "--muted-foreground": "oklch(0.556 0.02 150)",
    }),
  },
  {
    name: "Orange",
    dot: "#ea580c",
    vars: makeThemeVars({
      "--primary": "oklch(0.606 0.213 41.116)",
      "--primary-foreground": "oklch(0.985 0 0)",
      "--accent": "oklch(0.94 0.04 55)",
      "--accent-foreground": "oklch(0.21 0.06 40)",
      "--muted": "oklch(0.94 0.04 55)",
      "--muted-foreground": "oklch(0.556 0.02 45)",
    }),
  },
  {
    name: "Rose",
    dot: "#e11d48",
    vars: makeThemeVars({
      "--primary": "oklch(0.577 0.245 27.325)",
      "--primary-foreground": "oklch(0.985 0 0)",
      "--accent": "oklch(0.94 0.03 15)",
      "--accent-foreground": "oklch(0.21 0.06 20)",
      "--muted": "oklch(0.94 0.03 15)",
      "--muted-foreground": "oklch(0.556 0.02 15)",
    }),
  },
  {
    name: "Violet",
    dot: "#7c3aed",
    vars: makeThemeVars({
      "--primary": "oklch(0.541 0.281 293.009)",
      "--primary-foreground": "oklch(0.985 0 0)",
      "--accent": "oklch(0.93 0.04 290)",
      "--accent-foreground": "oklch(0.21 0.08 290)",
      "--muted": "oklch(0.93 0.04 290)",
      "--muted-foreground": "oklch(0.556 0.02 290)",
    }),
  },
]

const radiusOptions = [
  { label: "0", value: "0" },
  { label: "0.3", value: "0.3rem" },
  { label: "0.5", value: "0.5rem" },
  { label: "0.75", value: "0.75rem" },
  { label: "1.0", value: "1rem" },
]

type DeviceSize = "desktop" | "tablet" | "mobile"

// ─── File tree for code tab ──────────────────────────────────────────────────

interface TreeFile {
  type: "file"
  name: string
  fileIndex: number
}
interface TreeFolder {
  type: "folder"
  name: string
  children: (TreeFile | TreeFolder)[]
}
type TreeNode = TreeFile | TreeFolder

function buildFileTree(files: { name: string; code: string }[]): TreeNode[] {
  const root: TreeNode[] = []
  files.forEach((file, fileIndex) => {
    const parts = file.name.split("/")
    let level = root
    for (let i = 0; i < parts.length - 1; i++) {
      const folderName = parts[i]
      let folder = level.find(
        (n): n is TreeFolder => n.type === "folder" && n.name === folderName
      )
      if (!folder) {
        folder = { type: "folder", name: folderName, children: [] }
        level.push(folder)
      }
      level = folder.children
    }
    level.push({ type: "file", name: parts[parts.length - 1], fileIndex })
  })
  return root
}

function FileTreeNode({
  node,
  depth,
  activeIndex,
  onSelect,
}: {
  node: TreeNode
  depth: number
  activeIndex: number
  onSelect: (i: number) => void
}) {
  const [open, setOpen] = useState(true)
  const indent = depth * 16

  if (node.type === "folder") {
    return (
      <div>
        <button
          onClick={() => setOpen((v) => !v)}
          style={{ paddingLeft: `${6 + indent}px` }}
          className="flex w-full items-center gap-1.5 rounded-sm py-[5px] pr-2 text-[13px] text-muted-foreground/70 transition-colors hover:bg-muted/60 hover:text-foreground"
        >
          {open ? (
            <FolderOpenIcon className="size-4 shrink-0 text-muted-foreground/60" />
          ) : (
            <FolderIcon className="size-4 shrink-0 text-muted-foreground/60" />
          )}
          <span className="truncate font-medium">{node.name}</span>
        </button>
        {open && (
          <div className="relative">
            {/* Vertical connector line — matches shadcn file-tree design */}
            <div
              className="pointer-events-none absolute bottom-1 top-0 w-px rounded-full bg-border"
              style={{ left: `${13 + indent}px` }}
            />
            {node.children.map((child, i) => (
              <FileTreeNode
                key={`${child.name}-${i}`}
                node={child}
                depth={depth + 1}
                activeIndex={activeIndex}
                onSelect={onSelect}
              />
            ))}
          </div>
        )}
      </div>
    )
  }

  const isActive = node.fileIndex === activeIndex

  return (
    <button
      onClick={() => onSelect(node.fileIndex)}
      style={{ paddingLeft: `${6 + indent}px` }}
      className={cn(
        "flex w-full items-center gap-1.5 rounded-sm py-[5px] pr-2 text-[13px] transition-colors",
        isActive
          ? "bg-muted font-medium text-foreground"
          : "text-muted-foreground/70 hover:bg-muted/60 hover:text-foreground"
      )}
    >
      <FileIcon className="size-4 shrink-0 text-muted-foreground/50" />
      <span className="truncate">{node.name}</span>
    </button>
  )
}

// ─────────────────────────────────────────────────────────────────────────────

type ComponentStyle = "default" | "outlined" | "elevated"

const COMPONENT_STYLES: { name: ComponentStyle; icon: typeof Layers; label: string }[] = [
  { name: "default", icon: Layers, label: "Default" },
  { name: "outlined", icon: PenTool, label: "Outlined" },
  { name: "elevated", icon: Square, label: "Elevated" },
]

interface StackPageClientProps {
  slug: string
  registrySource?: StackRegistryFile[] | null
  devMode?: boolean
  defaultStyle?: ComponentStyle
}

export function StackPageClient({ slug, registrySource, devMode = false, defaultStyle }: StackPageClientProps) {
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview")
  const [cliCopied, setCliCopied] = useState(false)
  const [codeCopied, setCodeCopied] = useState(false)
  const [activeFileIndex, setActiveFileIndex] = useState(0)
  const [device, setDevice] = useState<DeviceSize>("desktop")
  const [componentStyle, setComponentStyle] = useState<ComponentStyle>(defaultStyle ?? "default")
  const [activeTheme, setActiveTheme] = useState(0)
  const [activeRadius, setActiveRadius] = useState(2)
  const [showThemePanel, setShowThemePanel] = useState(false)
  const [customColor, setCustomColor] = useState("")
  const [previewKey, setPreviewKey] = useState(0)
  const [proFiles, setProFiles] = useState<ProSourceFile[] | null>(null)
  const [proLoading, setProLoading] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [highlightedLines, setHighlightedLines] = useState<string[] | null>(null)
  const [pkgManager, setPkgManager] = useState<PkgManager>("npm")
  const previewRef = useRef<HTMLDivElement>(null)
  const themePanelRef = useRef<HTMLDivElement>(null)

  const allStacks = getAllStacks()
  const stackIndex = allStacks.findIndex((p) => p.link === `/stacks/${slug}`)
  const stack = allStacks[stackIndex]
  const stackName = stack?.text ?? slug
  const isPro = stack?.tier === "pro"
  const description = stack?.description ?? ""

  const prevStack = stackIndex > 0 ? allStacks[stackIndex - 1] : null
  const nextStack =
    stackIndex < allStacks.length - 1 ? allStacks[stackIndex + 1] : null

  const PreviewComponent = stackPreviewRegistry[slug]
  const userIsPro = devMode || (session?.user?.isPro ?? false)

  const freeSource = registrySource ? { files: registrySource } : undefined
  const source = isPro && userIsPro && proFiles
    ? { files: proFiles }
    : freeSource
  const activeFile = source?.files[activeFileIndex]
  const content = stackContent[slug]

  const cliCommand = getCLICommand(pkgManager, slug)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        themePanelRef.current &&
        !themePanelRef.current.contains(e.target as Node)
      ) {
        setShowThemePanel(false)
      }
    }
    if (showThemePanel) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showThemePanel])

  // Fetch pro source from private GitHub repo (or local FS in dev mode)
  useEffect(() => {
    if (!isPro) return
    if (!devMode && !session?.user?.isPro) return
    if (proFiles) return // already fetched

    setProLoading(true)
    fetch(`/api/pro/${slug}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.files) setProFiles(data.files)
      })
      .catch(console.error)
      .finally(() => setProLoading(false))
  }, [slug, isPro, devMode, session?.user?.isPro, proFiles])

  // Syntax-highlight the active file with shiki whenever it changes.
  // Uses DOMParser to extract per-line innerHTML — regex breaks on nested spans.
  useEffect(() => {
    if (!activeFile) {
      setHighlightedLines(null)
      return
    }
    const ext = activeFile.name.split(".").pop() ?? "tsx"
    const lang = ["ts", "tsx", "js", "jsx", "json", "css", "html", "md"].includes(ext) ? ext : "tsx"
    setHighlightedLines(null)

    import("shiki")
      .then(({ codeToHtml }) =>
        codeToHtml(activeFile.code, {
          lang,
          themes: { dark: "github-dark", light: "github-light" },
          defaultColor: false,
        })
      )
      .then((html) => {
        // DOMParser safely handles arbitrarily nested span trees per line
        const doc = new DOMParser().parseFromString(html, "text/html")
        const lineEls = doc.querySelectorAll("code .line")
        if (lineEls.length === 0) {
          setHighlightedLines(null)
          return
        }
        setHighlightedLines(Array.from(lineEls).map((el) => el.innerHTML))
      })
      .catch(() => setHighlightedLines(null))
  }, [activeFile])

  function handleCopyCli() {
    navigator.clipboard.writeText(cliCommand)
    setCliCopied(true)
    setTimeout(() => setCliCopied(false), 2000)
  }

  function handleCopyCode() {
    if (activeFile) {
      navigator.clipboard.writeText(activeFile.code)
      setCodeCopied(true)
      setTimeout(() => setCodeCopied(false), 2000)
    }
  }

  const radiusVal = radiusOptions[activeRadius].value
  const previewThemeVars: Record<string, string> = {
    ...themePresets[activeTheme].vars,
    "--radius": radiusVal,
    "--radius-lg": radiusVal,
    "--radius-md": radiusVal ? `calc(${radiusVal} - 2px)` : "0",
    "--radius-sm": radiusVal ? `calc(${radiusVal} - 4px)` : "0",
    "--radius-xl": radiusVal ? `calc(${radiusVal} + 4px)` : "0",
  }
  if (customColor) {
    previewThemeVars["--primary"] = customColor
    previewThemeVars["--color-primary"] = customColor
  }

  const deviceWidthClass =
    device === "tablet"
      ? "max-w-[768px]"
      : device === "mobile"
        ? "max-w-[375px]"
        : "max-w-none"

  return (
    <div className="flex h-full flex-col">
      {/* Top bar */}
      <div className="shrink-0 flex items-center justify-between border-b border-border px-4 py-2.5">
        <div className="flex items-center gap-3 min-w-0">
          <h1 className="shrink-0 text-[15px] font-semibold text-foreground">{stackName}</h1>
          {isPro && (
            <span className="shrink-0 rounded border border-border bg-muted px-1.5 py-0.5 text-[11px] font-medium uppercase text-muted-foreground">
              Pro
            </span>
          )}
          <span className="shrink-0 text-sm text-muted-foreground/50">—</span>
          <p className="truncate text-[13px] text-muted-foreground">{description}</p>
          {content && (() => {
            const icons = getProviderIcons(content.techStack)
            if (icons.length === 0) return null
            return (
              <>
                <div className="h-4 w-px shrink-0 bg-border" />
                <div className="flex shrink-0 items-center gap-1.5">
                  {icons.map(({ icon: Icon, label }) => (
                    <span key={label} title={label} className="flex size-6 items-center justify-center rounded text-foreground/70 transition-colors hover:text-foreground">
                      <Icon className="size-[18px]" />
                    </span>
                  ))}
                </div>
              </>
            )
          })()}
        </div>
        <div className="flex items-center gap-1.5">
          {content && (
            <button
              onClick={() => setShowDetails((v) => !v)}
              title={showDetails ? "Hide details" : "Show details"}
              className="flex size-8 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <ChevronDown className={cn("size-4 transition-transform duration-200", showDetails && "rotate-180")} />
            </button>
          )}
          {prevStack && (
            <Link
              href={prevStack.link}
              scroll={false}
              className="flex size-8 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <ChevronLeft className="size-4" />
            </Link>
          )}
          {nextStack && (
            <Link
              href={nextStack.link}
              scroll={false}
              className="flex size-8 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <ChevronRight className="size-4" />
            </Link>
          )}
        </div>
      </div>

      {/* Details panel — always in DOM for SEO, collapsed by default */}
      <div
        className={cn(
          "shrink-0 overflow-hidden border-b border-border/40 bg-muted/10 transition-all duration-300",
          showDetails ? "max-h-[420px]" : "max-h-0 border-b-0"
        )}
      >
        {content && (
          <div className="grid grid-cols-1 gap-6 px-6 py-5 md:grid-cols-[1fr_auto]">
            {/* Left: intro + use cases */}
            <div className="space-y-4 min-w-0">
              <p className="text-[13px] leading-[1.75] text-foreground/80">{content.intro}</p>
              <ul className="space-y-1.5">
                {content.useCases.map((uc) => (
                  <li key={uc} className="flex items-start gap-2 text-[13px] leading-[1.6] text-foreground/70">
                    <span className="mt-[7px] size-1 shrink-0 rounded-full bg-foreground/40" />
                    {uc}
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: tech stack + related */}
            <div className="shrink-0 space-y-4 md:w-56">
              <div className="space-y-2">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Tech stack</p>
                <div className="flex flex-wrap gap-1.5">
                  {content.techStack.map((tech) => {
                    const iconEntry = TECH_ICON_MAP.find((m) => tech.includes(m.match))
                    const TechIcon = iconEntry?.icon
                    return (
                      <span
                        key={tech}
                        className="flex items-center gap-1 rounded border border-border/60 bg-muted/50 px-2 py-0.5 font-mono text-[11px] text-foreground/80"
                      >
                        {TechIcon && <TechIcon className="size-3.5 shrink-0" />}
                        {tech}
                      </span>
                    )
                  })}
                </div>
              </div>

              {content.relatedSlugs && content.relatedSlugs.length > 0 && (
                <div className="space-y-2">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Related</p>
                  <div className="flex flex-wrap gap-1.5">
                    {content.relatedSlugs.map((relSlug) => {
                      const relStack = getAllStacks().find((s) => s.link === `/stacks/${relSlug}`)
                      if (!relStack) return null
                      return (
                        <Link
                          key={relSlug}
                          href={relStack.link}
                          scroll={false}
                          onClick={() => setShowDetails(false)}
                          className="rounded border border-border/60 bg-muted/40 px-2 py-0.5 text-[12px] text-foreground/70 transition-colors hover:border-border hover:bg-muted/70 hover:text-foreground"
                        >
                          {relStack.text}
                        </Link>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* CLI Command bar — package manager tabs */}
      <div className="shrink-0 border-b border-border">
        {/* Tab row */}
        <div className="flex items-center gap-0 border-b border-border/50 px-4">
          {PKG_MANAGERS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setPkgManager(id)}
              className={cn(
                "border-b-2 px-3 py-2 text-[12px] font-medium transition-colors",
                pkgManager === id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              {label}
            </button>
          ))}
        </div>
        {/* Command row */}
        <div className="flex items-center gap-3 px-4 py-2">
          <Terminal className="size-4 shrink-0 text-muted-foreground" />
          <code className="flex-1 truncate font-mono text-[13px] text-foreground/80">
            {cliCommand}
          </code>
          <button
            onClick={handleCopyCli}
            className="flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1 text-[12px] font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            {cliCopied ? (
              <>
                <Check className="size-3.5" />
                Copied
              </>
            ) : (
              <>
                <Copy className="size-3.5" />
                Copy
              </>
            )}
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="shrink-0 flex items-center justify-between border-b border-border px-4 py-2">
        <div className="flex items-center gap-3">
          <div className="flex overflow-hidden rounded-md border border-border">
            <button
              onClick={() => { setActiveTab("preview"); setActiveFileIndex(0); setHighlightedLines(null) }}
              className={cn(
                "flex items-center gap-1.5 px-3.5 py-2 text-[13px] font-medium transition-colors",
                activeTab === "preview"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Eye className="size-3.5" />
              Preview
            </button>
            <button
              onClick={() => { setActiveTab("code"); setActiveFileIndex(0) }}
              className={cn(
                "flex items-center gap-1.5 border-l border-border px-3.5 py-2 text-[13px] font-medium transition-colors",
                activeTab === "code"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Code2 className="size-3.5" />
              Code
            </button>
          </div>

          {source?.files && source.files.length > 0 && (
            <span className="hidden text-[12px] tabular-nums text-muted-foreground sm:inline">
              {source.files.length} {source.files.length === 1 ? "file" : "files"}
              <span className="mx-1.5 text-border">·</span>
              {source.files.reduce((sum, f) => sum + f.code.split("\n").length, 0)} lines
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0.5 rounded-md border border-border p-0.5">
            {(
              [
                { icon: Monitor, size: "desktop" },
                { icon: Tablet, size: "tablet" },
                { icon: Smartphone, size: "mobile" },
              ] as const
            ).map(({ icon: Icon, size }) => (
              <button
                key={size}
                onClick={() => setDevice(size)}
                className={cn(
                  "flex size-8 items-center justify-center rounded-sm transition-colors",
                  device === size
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="size-4" />
              </button>
            ))}
            <div className="mx-0.5 h-4 w-px bg-border" />
            <button
              onClick={() => {
                const themeName = customColor
                  ? "default"
                  : themePresets[activeTheme].name.toLowerCase()
                const p = new URLSearchParams()
                p.set("theme", themeName)
                p.set("radius", radiusOptions[activeRadius].value || "0")
                if (customColor) p.set("color", customColor)
                window.open(`/preview/${slug}?${p.toString()}`, "_blank")
              }}
              title="Open in new tab"
              className="flex size-8 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ExternalLink className="size-4" />
            </button>
            <button
              onClick={() => setPreviewKey((k) => k + 1)}
              title="Refresh preview"
              className="flex size-8 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <RefreshCw className="size-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-0.5 rounded-md border border-border p-0.5">
            {COMPONENT_STYLES.map(({ name, icon: Icon, label }) => (
              <button
                key={name}
                onClick={() => setComponentStyle(name)}
                title={label}
                className={cn(
                  "flex size-8 items-center justify-center rounded-sm transition-colors",
                  componentStyle === name
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="size-4" />
              </button>
            ))}
          </div>

          <div className="relative" ref={themePanelRef}>
            <div className="flex items-center gap-0.5 rounded-md border border-border p-0.5">
              {themePresets.map((preset, i) => (
                <button
                  key={preset.name}
                  onClick={() => { setActiveTheme(i); setCustomColor("") }}
                  title={preset.name}
                  className={cn(
                    "flex size-8 items-center justify-center rounded-sm transition-colors",
                    activeTheme === i && !customColor ? "bg-muted" : "hover:bg-muted/50"
                  )}
                >
                  <span
                    className={cn(
                      "size-3.5 rounded-full border transition-transform",
                      activeTheme === i && !customColor
                        ? "scale-110 border-foreground/30"
                        : "border-transparent"
                    )}
                    style={{ backgroundColor: preset.dot }}
                  />
                </button>
              ))}
              <div className="mx-0.5 h-4 w-px bg-border" />
              <button
                onClick={() => setShowThemePanel(!showThemePanel)}
                className="flex items-center gap-1 rounded-sm px-2 py-1.5 text-[13px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {customColor ? "Custom" : themePresets[activeTheme].name}
                <ChevronDown className="size-3.5" />
              </button>
            </div>

            {showThemePanel && (
              <div className="absolute right-0 top-full z-50 mt-1 w-[280px] rounded-lg border border-border bg-background p-4 shadow-lg">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-[13px] font-medium text-foreground">Customize Theme</span>
                  <button onClick={() => setShowThemePanel(false)} className="text-muted-foreground hover:text-foreground">
                    <X className="size-4" />
                  </button>
                </div>
                <div className="mb-3">
                  <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Color</p>
                  <div className="flex flex-wrap gap-1">
                    {themePresets.map((preset, i) => (
                      <button
                        key={preset.name}
                        onClick={() => { setActiveTheme(i); setCustomColor("") }}
                        className={cn(
                          "flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-[12px] transition-colors",
                          activeTheme === i && !customColor
                            ? "border-foreground/20 bg-muted font-medium text-foreground"
                            : "border-transparent text-muted-foreground hover:bg-muted"
                        )}
                      >
                        <span className="size-3 rounded-full" style={{ backgroundColor: preset.dot }} />
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mb-3">
                  <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Custom Primary</p>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={customColor || themePresets[activeTheme].dot}
                      onChange={(e) => setCustomColor(e.target.value)}
                      className="size-8 cursor-pointer rounded border border-border bg-transparent p-0"
                    />
                    <input
                      type="text"
                      value={customColor}
                      onChange={(e) => setCustomColor(e.target.value)}
                      placeholder="oklch(0.6 0.2 260) or #hex"
                      className="h-8 flex-1 rounded-md border border-border bg-transparent px-2 text-[12px] text-foreground outline-none placeholder:text-muted-foreground/50"
                    />
                    {customColor && (
                      <button onClick={() => setCustomColor("")} className="text-[11px] text-muted-foreground hover:text-foreground">
                        Reset
                      </button>
                    )}
                  </div>
                </div>
                <div>
                  <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Radius</p>
                  <div className="flex gap-1">
                    {radiusOptions.map((opt, i) => (
                      <button
                        key={opt.label}
                        onClick={() => setActiveRadius(i)}
                        className={cn(
                          "flex-1 rounded-md border py-1.5 text-center text-[12px] transition-colors",
                          activeRadius === i
                            ? "border-foreground/20 bg-muted font-medium text-foreground"
                            : "border-transparent text-muted-foreground hover:bg-muted"
                        )}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <a
            href={`https://stackblitz.com/github/shadcnagents/ui?file=apps/www/registry/stacks/${slug}/page.tsx`}
            target="_blank"
            rel="noopener noreferrer"
            title="Open in StackBlitz"
            className="flex size-8 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <StackBlitzIcon className="size-4" />
          </a>

          <a
            href={`${siteConfig.links.github}/tree/main/apps/www/registry/stacks/${slug}`}
            target="_blank"
            rel="noopener noreferrer"
            title="View source on GitHub"
            className="flex size-8 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Github className="size-4" />
          </a>

          <button
            onClick={handleCopyCli}
            className="flex size-8 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            title="Copy CLI command"
          >
            <ClipboardCopy className="size-4" />
          </button>
        </div>
      </div>

      {/* Content area — padded viewport frame with rounded border */}
      <div className="flex min-h-0 flex-1 flex-col p-3">
        <div className="isolate flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-border bg-background shadow-sm">
          {activeTab === "preview" && (
            <div className="h-full overflow-y-scroll scrollbar-hide">
              {isPro && !userIsPro ? (
                <div className="flex min-h-full items-center justify-center p-8">
                  <div className="text-center">
                    <Lock className="mx-auto mb-3 size-5 text-primary/30" />
                    <p className="text-sm font-medium text-foreground">Pro Stack</p>
                    <p className="mt-1 text-xs text-muted-foreground/50">
                      {session?.user
                        ? "Upgrade to Pro to unlock full preview and source code"
                        : "Sign in or upgrade to Pro to access this stack"}
                    </p>
                    <div className="mt-4 flex items-center justify-center gap-2">
                      {!session?.user && (
                        <Button asChild variant="outline" size="sm">
                          <Link href="/auth/login">Sign In</Link>
                        </Button>
                      )}
                      <Button asChild size="sm">
                        <Link href="/pricing">Unlock with Pro</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  ref={previewRef}
                  data-component-style={componentStyle !== "default" ? componentStyle : undefined}
                  className={cn(
                    "mx-auto flex min-h-full items-center justify-center p-8 transition-all duration-300",
                    deviceWidthClass
                  )}
                  style={previewThemeVars as React.CSSProperties}
                >
                  {PreviewComponent ? (
                    <div className="w-full" key={previewKey}>
                      <PreviewComponent />
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Preview coming soon</p>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === "code" && (
            <div className="flex h-full">
              {source && source.files.length > 0 && (
                <div className="w-[200px] shrink-0 overflow-y-scroll border-r border-border bg-muted/10 py-3 scrollbar-hide">
                  <p className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                    Files
                  </p>
                  <div className="px-1.5">
                    {buildFileTree(source.files).map((node, i) => (
                      <FileTreeNode
                        key={`${node.name}-${i}`}
                        node={node}
                        depth={0}
                        activeIndex={activeFileIndex}
                        onSelect={setActiveFileIndex}
                      />
                    ))}
                  </div>
                </div>
              )}
              <div className="relative flex min-w-0 flex-1 flex-col">
                {source && activeFile ? (
                  <>
                    <div className="shrink-0 flex items-center justify-between border-b border-border px-4 py-1.5">
                      <span className="text-[13px] text-muted-foreground">{activeFile.name}</span>
                      <button
                        onClick={handleCopyCode}
                        className="flex items-center gap-1.5 text-[12px] text-muted-foreground transition-colors hover:text-foreground"
                      >
                        <ClipboardCopy className="size-3.5" />
                        {codeCopied ? "Copied" : "Copy"}
                      </button>
                    </div>
                    {/* Code with line numbers — same font-size + leading so rows stay aligned */}
                    <div className="min-h-0 flex-1 overflow-auto scrollbar-hide">
                      <div className="flex min-w-full font-mono text-[13px] leading-relaxed">
                        {/* Gutter: line numbers */}
                        <div
                          aria-hidden
                          className="sticky left-0 z-10 shrink-0 select-none border-r border-border/40 bg-muted/10 px-3 py-4 text-right text-muted-foreground/50"
                        >
                          {activeFile.code.split("\n").map((_, i) => (
                            <div key={i}>{i + 1}</div>
                          ))}
                        </div>
                        {/* Code content — syntax-highlighted via shiki, plain fallback while loading */}
                        <pre className="shiki-pre flex-1 overflow-x-auto py-4 pl-5 pr-8">
                          {highlightedLines ? (
                            highlightedLines.map((line, i) => (
                              <span
                                key={i}
                                className="block"
                                dangerouslySetInnerHTML={{ __html: line || "\u200B" }}
                              />
                            ))
                          ) : (
                            <code className="text-foreground/80">{activeFile.code}</code>
                          )}
                        </pre>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-1 items-center justify-center">
                    <p className="text-sm text-muted-foreground">Source code coming soon</p>
                  </div>
                )}
                {isPro && !userIsPro && (
                  <div className="absolute inset-0 top-[140px]">
                    <div className="h-16 bg-gradient-to-b from-transparent to-background/80" />
                    <div className="flex h-full flex-col items-center bg-background/80 pt-8 backdrop-blur-sm">
                      {proLoading ? (
                        <p className="text-xs text-muted-foreground animate-pulse">Loading source…</p>
                      ) : (
                        <>
                          <Lock className="mb-3 size-5 text-primary/30" />
                          <p className="text-sm font-medium">Pro Stack</p>
                          <p className="mt-1 text-xs text-muted-foreground/50">
                            {session?.user ? "Upgrade to Pro" : "Sign in or upgrade to Pro"}
                          </p>
                          <div className="mt-4 flex gap-2">
                            {!session?.user && (
                              <Button asChild variant="outline" size="sm">
                                <Link href="/auth/login">Sign In</Link>
                              </Button>
                            )}
                            <Button asChild size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                              <Link href="/pricing">Unlock with Pro</Link>
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
