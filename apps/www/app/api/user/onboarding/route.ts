import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { useCase, techStack } = await req.json()

  await db.user.update({
    where: { id: session.user.id },
    data: {
      useCase,
      techStack,
      onboarded: true,
    },
  })

  return Response.json({ ok: true })
}
