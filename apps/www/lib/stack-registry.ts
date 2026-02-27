import fs from "fs"
import path from "path"

export interface StackRegistryFile {
  name: string
  code: string
}

function collectFiles(dir: string, base: string): StackRegistryFile[] {
  const files: StackRegistryFile[] = []
  if (!fs.existsSync(dir)) return files

  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    const relativePath = base ? `${base}/${entry.name}` : entry.name
    if (entry.isDirectory()) {
      files.push(...collectFiles(fullPath, relativePath))
    } else {
      files.push({
        name: relativePath,
        code: fs.readFileSync(fullPath, "utf-8"),
      })
    }
  }
  return files
}

function sortFiles(files: StackRegistryFile[]): StackRegistryFile[] {
  const order = (name: string) => {
    if (name === "app/page.tsx") return 0
    if (name === "app/layout.tsx") return 1
    if (name.startsWith("app/api/")) return 2
    if (name.startsWith("components/")) return 3
    return 4
  }
  return [...files].sort((a, b) => order(a.name) - order(b.name))
}

/**
 * Reads real .tsx source files from registry/stacks/[slug]/ for display
 * in the stack page code panel. Falls back to null if the slug doesn't
 * have a folder-based registry entry yet.
 *
 * Server-only — never import this in a Client Component.
 */
export function getStackRegistrySource(slug: string): StackRegistryFile[] | null {
  // process.cwd() in Next.js points to apps/www/ (where next.config.ts lives)
  const registryDir = path.join(process.cwd(), "registry", "stacks", slug)
  if (!fs.existsSync(registryDir)) return null

  const files = collectFiles(registryDir, "")
  if (files.length === 0) return null

  return sortFiles(files)
}
