/**
 * Migration script: stack-source.ts → registry/stacks/[slug]/
 *
 * Reads every remaining entry in stackSourceRegistry, writes each file
 * to registry/stacks/[slug]/[file.name], then adds the entries to
 * registry/registry-stacks.ts and wipes stack-source.ts clean.
 *
 * Run: pnpm migrate:stacks
 */

import { promises as fs } from "fs"
import path from "path"

// Migration complete — stackSourceRegistry is empty, this script is a no-op
const stackSourceRegistry: Record<string, { files: { name: string; code: string }[] }> = {}

const cwd = process.cwd()
const registryRoot = path.join(cwd, "registry", "stacks")

// ── 1. Write real .tsx files ─────────────────────────────────────────────────

let fileCount = 0

for (const [slug, source] of Object.entries(stackSourceRegistry)) {
  for (const file of source.files) {
    const dest = path.join(registryRoot, slug, file.name)
    await fs.mkdir(path.dirname(dest), { recursive: true })
    await fs.writeFile(dest, file.code, "utf-8")
    fileCount++
  }
  console.log(`✓  ${slug}  (${source.files.length} files)`)
}

console.log(`\n📁 Wrote ${fileCount} files to registry/stacks/\n`)

// ── 2. Append new stacks to registry/registry-stacks.ts ─────────────────────

const registryStacksPath = path.join(cwd, "registry", "registry-stacks.ts")
const existing = await fs.readFile(registryStacksPath, "utf-8")

// Build new entries (one per slug)
let newEntries = "\n"

for (const [slug, source] of Object.entries(stackSourceRegistry)) {
  // Infer dependencies from file content
  const allCode = source.files.map((f) => f.code).join("\n")
  const deps: string[] = []
  if (allCode.includes("from \"ai\"") || allCode.includes("from 'ai'")) deps.push("ai")
  if (allCode.includes("@ai-sdk/openai")) deps.push("@ai-sdk/openai")
  if (allCode.includes("@ai-sdk/react")) deps.push("@ai-sdk/react")
  if (allCode.includes("@ai-sdk/anthropic")) deps.push("@ai-sdk/anthropic")
  if (allCode.includes("@ai-sdk/google")) deps.push("@ai-sdk/google")
  if (allCode.includes("from \"zod\"") || allCode.includes("from 'zod'")) deps.push("zod")

  const filesStr = source.files
    .map((f) => {
      let type = "registry:file"
      if (f.name === "page.tsx" || f.name === "app/page.tsx" || f.name === "layout.tsx" || f.name === "app/layout.tsx") {
        type = "registry:page"
      } else if (f.name.endsWith("route.ts") || f.name.endsWith("route.tsx")) {
        type = "registry:file"
      } else if (f.name.endsWith(".tsx") || f.name.endsWith(".ts")) {
        type = "registry:component"
      }
      return `      {
        path: "registry/stacks/${slug}/${f.name}",
        type: "${type}",
        target: "${f.name}",
      },`
    })
    .join("\n")

  newEntries += `  {
    name: "${slug}",
    type: "registry:block",
    description: "",
    dependencies: ${JSON.stringify(deps)},
    files: [
${filesStr}
    ],
  },\n\n`
}

// Insert before the closing `]` of the stacks array
const updated = existing.replace(/\]\s*$/, newEntries + "]\n")
await fs.writeFile(registryStacksPath, updated, "utf-8")
console.log(`✅ Added ${Object.keys(stackSourceRegistry).length} entries to registry/registry-stacks.ts`)

// ── 3. Wipe stack-source.ts — keep only types, export empty object ───────────

const emptyStackSource = `/**
 * Source code for all free stacks.
 *
 * ⚠️  All stacks are now served from real .tsx files in registry/stacks/[slug]/.
 *     Edit files there, then run \`pnpm registry:build:stacks\` to rebuild.
 *     This file is intentionally empty — kept for type export compatibility.
 */

export interface PatternFile {
  name: string
  code: string
}

export interface PatternSource {
  files: PatternFile[]
}

export const stackSourceRegistry: Record<string, PatternSource> = {}
`

await fs.writeFile(path.join(cwd, "lib", "stack-source.ts"), emptyStackSource, "utf-8")
console.log("🧹 Wiped stack-source.ts (now empty, types preserved)")
