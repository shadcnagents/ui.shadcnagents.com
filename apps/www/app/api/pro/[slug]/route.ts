import { promises as fs } from "fs"
import path from "path"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

const DEV_PRO_PATH = process.env.DEV_PRO_PATH
const PRIVATE_REPO =
  process.env.PRO_GITHUB_REPO ?? "shadcnagents/pro.shadcnagents.com"
const GITHUB_API = "https://api.github.com"

/** Recursively read all files from a directory, returning relative paths. */
async function readDirRecursive(
  dir: string,
  base: string = dir
): Promise<{ name: string; code: string }[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  const results: { name: string; code: string }[] = []

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      results.push(...(await readDirRecursive(fullPath, base)))
    } else if (entry.isFile()) {
      const code = await fs.readFile(fullPath, "utf-8")
      results.push({ name: path.relative(base, fullPath), code })
    }
  }

  return results
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  // Validate slug — prevent path traversal
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return Response.json({ error: "Invalid slug" }, { status: 400 })
  }

  // ── Dev mode: read from local filesystem ──
  if (DEV_PRO_PATH) {
    const stackDir = path.join(DEV_PRO_PATH, "stacks", slug)

    try {
      const stat = await fs.stat(stackDir)
      if (!stat.isDirectory()) {
        return Response.json({ error: "Stack not found" }, { status: 404 })
      }
    } catch {
      return Response.json({ error: "Stack not found" }, { status: 404 })
    }

    try {
      const files = await readDirRecursive(stackDir)
      return Response.json({ files })
    } catch (error) {
      console.error("[pro/source] Error reading local files:", error)
      return Response.json(
        { error: "Failed to read source" },
        { status: 500 }
      )
    }
  }

  // ── Production: auth + GitHub API ──

  // 1. Auth check
  const session = await auth()
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  // 2. Check isPro directly from DB — never trust client-sent data
  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { isPro: true },
  })

  if (!user?.isPro) {
    return Response.json(
      { error: "Pro subscription required" },
      { status: 403 }
    )
  }

  try {
    // 3. List files in the private GitHub repo for this stack
    const listRes = await fetch(
      `${GITHUB_API}/repos/${PRIVATE_REPO}/contents/stacks/${slug}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_PRIVATE_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
        },
        next: { revalidate: 3600 },
      }
    )

    if (!listRes.ok) {
      return Response.json({ error: "Stack not found" }, { status: 404 })
    }

    const files = await listRes.json()

    // 4. Fetch each file's content in parallel (decode from base64)
    const filesWithContent = await Promise.all(
      (Array.isArray(files) ? files : [])
        .filter((f: { type: string }) => f.type === "file")
        .map(async (file: { name: string; url: string }) => {
          const fileRes = await fetch(file.url, {
            headers: {
              Authorization: `Bearer ${process.env.GITHUB_PRIVATE_TOKEN}`,
              Accept: "application/vnd.github.v3+json",
            },
          })
          const fileData = await fileRes.json()
          return {
            name: file.name,
            code: Buffer.from(fileData.content, "base64").toString("utf8"),
          }
        })
    )

    return Response.json({ files: filesWithContent })
  } catch (error) {
    console.error("[pro/source] Error fetching from GitHub:", error)
    return Response.json(
      { error: "Failed to fetch source" },
      { status: 500 }
    )
  }
}
