import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

const PRIVATE_REPO = process.env.PRO_GITHUB_REPO ?? "shadcnagents/pro.shadcnagents.com"
const GITHUB_API = "https://api.github.com"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
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
    return Response.json({ error: "Pro subscription required" }, { status: 403 })
  }

  // 3. Validate slug — prevent path traversal attacks
  const { slug } = await params
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return Response.json({ error: "Invalid slug" }, { status: 400 })
  }

  try {
    // 4. List files in the private GitHub repo for this stack
    const listRes = await fetch(
      `${GITHUB_API}/repos/${PRIVATE_REPO}/contents/stacks/${slug}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_PRIVATE_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
        },
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    )

    if (!listRes.ok) {
      return Response.json({ error: "Stack not found" }, { status: 404 })
    }

    const files = await listRes.json()

    // 5. Fetch each file's content in parallel (decode from base64)
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
    return Response.json({ error: "Failed to fetch source" }, { status: 500 })
  }
}
