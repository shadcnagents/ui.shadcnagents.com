import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

async function analyzeUrl(url: string) {
  // Step 1: Fetch content
  const html = await fetch(url).then((r) => r.text())

  // Step 2: Extract text
  const text = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()

  // Step 3: Analyze with AI
  const { text: analysis } = await generateText({
    model: openai("gpt-4o"),
    system: "Analyze the following webpage content. Provide a structured summary.",
    prompt: text.slice(0, 4000),
  })

  // Step 4: Generate structured output
  const { text: structured } = await generateText({
    model: openai("gpt-4o"),
    system: "Convert this analysis to JSON with keys: title, summary, topics, sentiment.",
    prompt: analysis,
  })

  return JSON.parse(structured)
}

export default async function Page() {
  const result = await analyzeUrl("https://example.com")

  return (
    <div className="mx-auto max-w-xl p-8">
      <h1 className="text-lg font-semibold">URL Analysis</h1>
      <pre className="mt-4 rounded-md bg-muted p-4 text-xs">
        {JSON.stringify(result, null, 2)}
      </pre>
    </div>
  )
}