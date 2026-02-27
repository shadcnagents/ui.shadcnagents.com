import { generateText, tool } from "ai"
import { openai } from "@ai-sdk/openai"
import * as cheerio from "cheerio"
import { z } from "zod"

export default async function Page() {
  const { text } = await generateText({
    model: openai("gpt-4o"),
    prompt: "Scrape example.com and tell me what it contains",
    tools: {
      scrapeUrl: tool({
        description: "Scrape a URL and extract its text content",
        parameters: z.object({ url: z.string().url() }),
        execute: async ({ url }) => {
          const html = await fetch(url).then((r) => r.text())
          const $ = cheerio.load(html)

          // Remove scripts and styles
          $("script, style, nav, footer").remove()

          const title = $("title").text()
          const body = $("body").text().replace(/\s+/g, " ").trim()

          return { title, body: body.slice(0, 2000) }
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