import { z } from "zod"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

const onboardingSchema = z.object({
  useCase: z.enum(["saas", "agency", "internal", "learning"]),
  techStack: z.enum(["nextjs-vercel-ai", "nextjs-other", "other"]),
})

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const parsed = onboardingSchema.safeParse(await req.json())
  if (!parsed.success) {
    return Response.json({ error: "Invalid input" }, { status: 400 })
  }

  await db.user.update({
    where: { id: session.user.id },
    data: {
      useCase: parsed.data.useCase,
      techStack: parsed.data.techStack,
      onboarded: true,
    },
  })

  return Response.json({ ok: true })
}
