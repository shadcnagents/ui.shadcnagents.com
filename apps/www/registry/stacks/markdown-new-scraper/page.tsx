import { generateText, tool } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"
import TurndownService from "turndown"

const turndown = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
})

export default async function Page() {
  const { text } = await generateText({
    model: openai("gpt-4o"),
    prompt: "Convert https://example.com to markdown and summarize it",
    tools: {
      urlToMarkdown: tool({
        description: "Convert a URL to markdown",
        parameters: z.object({ url: z.string().url() }),
        execute: async ({ url }) => {
          const html = await fetch(url).then((r) => r.text())
          const markdown = turndown.turndown(html)
          return { markdown: markdown.slice(0, 5000) }
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