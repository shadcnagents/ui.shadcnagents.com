/**
 * Scaffold a new pro stack in the private pro repo.
 *
 * Usage: pnpm new-pro-stack <slug>
 *
 * Requires DEV_PRO_PATH env var pointing to the pro.shadcnagents.com checkout.
 * Reads from .env.local automatically.
 */

import { existsSync } from "fs"
import { mkdir, readFile, writeFile } from "fs/promises"
import path from "path"

// ── Load .env.local if present ──
const envPath = path.join(process.cwd(), ".env.local")
if (existsSync(envPath)) {
  const envContent = await readFile(envPath, "utf-8")
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith("#")) continue
    const eqIdx = trimmed.indexOf("=")
    if (eqIdx === -1) continue
    const key = trimmed.slice(0, eqIdx).trim()
    const value = trimmed.slice(eqIdx + 1).trim()
    if (!process.env[key]) {
      process.env[key] = value
    }
  }
}

const DEV_PRO_PATH = process.env.DEV_PRO_PATH
if (!DEV_PRO_PATH) {
  console.error(
    "Error: DEV_PRO_PATH is not set.\n" +
      "Add it to .env.local:\n" +
      "  DEV_PRO_PATH=/path/to/pro.shadcnagents.com"
  )
  process.exit(1)
}

const slug = process.argv[2]
if (!slug) {
  console.error("Usage: pnpm new-pro-stack <slug>")
  process.exit(1)
}

if (!/^[a-z0-9-]+$/.test(slug)) {
  console.error(
    `Invalid slug "${slug}". Use lowercase letters, numbers, and hyphens only.`
  )
  process.exit(1)
}

const stackDir = path.join(DEV_PRO_PATH, "stacks", slug)

if (existsSync(stackDir)) {
  // Check if directory has any files — allow scaffolding into empty pre-created dirs
  const { readdir } = await import("fs/promises")
  const entries = await readdir(stackDir)
  const realFiles = entries.filter((e) => !e.startsWith("."))
  if (realFiles.length > 0) {
    console.error(
      `Directory already has files: ${stackDir}\n` +
        `  Found: ${realFiles.join(", ")}\n` +
        `  Use --force to overwrite.`
    )
    if (!process.argv.includes("--force")) {
      process.exit(1)
    }
  }
} else {
  await mkdir(stackDir, { recursive: true })
}

// ── Template: page.tsx ──
await writeFile(
  path.join(stackDir, "page.tsx"),
  `import { Component } from "./component"

export default function Page() {
  return <Component />
}
`
)

// ── Template: component.tsx ──
const displayName = slug
  .split("-")
  .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
  .join(" ")

await writeFile(
  path.join(stackDir, "component.tsx"),
  `"use client"

export function Component() {
  return (
    <div className="mx-auto w-full max-w-2xl p-6">
      <h2 className="text-sm font-medium">${displayName}</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        TODO: implement this pro stack.
      </p>
    </div>
  )
}
`
)

// ── Template: route.ts ──
await writeFile(
  path.join(stackDir, "route.ts"),
  `import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const body = await request.json()

  // TODO: implement
  return NextResponse.json({ result: "ok" })
}
`
)

console.log(`\n  Created pro stack: ${slug}\n`)
console.log(`  ${stackDir}/`)
console.log(`    page.tsx`)
console.log(`    component.tsx`)
console.log(`    route.ts`)
console.log()
console.log(`  Next steps:`)
console.log(`    1. Edit component.tsx with your stack implementation`)
console.log(
  `    2. Add to apps/www/config/stacks.ts with tier: "pro"`
)
console.log(
  `    3. Add to apps/www/config/stack-content.ts with SEO content`
)
console.log(`    4. Run pnpm dev and visit /stacks/${slug}\n`)
