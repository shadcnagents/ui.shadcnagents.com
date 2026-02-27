import { generateObject } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"

const schema = z.object({
  title: z.string(),
  salary: z.object({ min: z.number(), max: z.number(), currency: z.string() }),
  skills: z.array(z.string()),
  metadata: z.object({ source: z.string(), confidence: z.number() }),
})

export async function POST(req: Request) {
  const { text } = await req.json()

  const { object } = await generateObject({
    model: openai("gpt-4o"),
    schema,
    prompt: `Extract structured job posting data from: ${text}`,
  })

  return Response.json(object)
}