import { generateText, tool } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"

export default async function Page() {
  const { text } = await generateText({
    model: openai("gpt-4o"),
    prompt: "Extract the main content from https://example.com",
    tools: {
      jinaReader: tool({
        description: "Use Jina AI Reader to extract content from a URL",
        parameters: z.object({ url: z.string().url() }),
        execute: async ({ url }) => {
          const response = await fetch(`https://r.jina.ai/${url}`, {
            headers: {
              Authorization: `Bearer ${process.env.JINA_API_KEY}`,
              Accept: "application/json",
            },
          })
          const data = await response.json()
          return {
            title: data.data?.title,
            content: data.data?.content?.slice(0, 3000),
          }
        },
      }),
    },
    maxSteps: 2,
  })

  return (
    <div className="mx-auto max-w-xl p-8">
      <p className="text-sm">{text}</p>
    </div>
  )
}