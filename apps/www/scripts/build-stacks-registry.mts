/**
 * Build script for stacks registry.
 *
 * Reads registry/registry-stacks.ts (metadata + file paths),
 * reads each real source file from registry/stacks/[name]/,
 * and writes shadcn-compatible JSON to public/r/[name].json.
 *
 * Run: pnpm registry:build:stacks
 */

import { promises as fs } from "fs"
import path from "path"
import { stacks } from "@/registry/registry-stacks"

const cwd = process.cwd()
const outDir = path.join(cwd, "public", "r")

await fs.mkdir(outDir, { recursive: true })

let built = 0
let skipped = 0

for (const stack of stacks) {
  const files: {
    path: string
    type: string
    target: string
    content: string
  }[] = []

  let allFilesExist = true

  for (const file of stack.files ?? []) {
    const filePath = path.join(cwd, file.path)

    try {
      const content = await fs.readFile(filePath, "utf-8")
      files.push({
        path: file.target ?? file.path,
        type: file.type,
        target: file.target ?? "",
        content,
      })
    } catch {
      console.warn(`  ⚠ Missing: ${file.path}`)
      allFilesExist = false
    }
  }

  if (!allFilesExist) {
    console.log(`⏭  Skipped ${stack.name} (missing files)`)
    skipped++
    continue
  }

  const registryItem = {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: stack.name,
    type: stack.type,
    description: stack.description ?? "",
    dependencies: stack.dependencies ?? [],
    devDependencies: stack.devDependencies ?? [],
    registryDependencies: stack.registryDependencies ?? [],
    files,
  }

  const outPath = path.join(outDir, `${stack.name}.json`)
  await fs.writeFile(outPath, JSON.stringify(registryItem, null, 2))
  console.log(`✓  Built ${stack.name}  →  public/r/${stack.name}.json`)
  built++
}

console.log(`\n✅ Done. ${built} built, ${skipped} skipped.`)
