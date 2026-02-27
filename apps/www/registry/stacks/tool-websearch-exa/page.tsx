import { generateText, tool } from "ai"
import { openai } from "@ai-sdk/openai"
import Exa from "exa-js"
import { z } from "zod"

const exa = new Exa(process.env.EXA_API_KEY!)

export default async function Page() {
  const { text } = await generateText({
    model: openai("gpt-4o"),
    prompt: "Find the best resources about building AI agents",
    tools: {
      search: tool({
        description: "Search the web using Exa neural search",
        parameters: z.object({
          query: z.string(),
          numResults: z.number().default(5),
        }),
        execute: async ({ query, numResults }) => {
          const results = await exa.searchAndContents(query, {
            numResults,
            text: true,
          })
          return results.results.map((r) => ({
            title: r.title,
            url: r.url,
            text: r.text?.slice(0, 200),
          }))
        },
      }),
    },
    maxSteps: 3,
  })

  return (
    <div className="mx-auto max-w-xl p-8">
      <p className="text-sm">{text}</p>
    </div>
  )
}