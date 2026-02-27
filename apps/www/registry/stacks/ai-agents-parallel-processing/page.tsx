import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

async function analyzeInParallel(content: string) {
  const [sentiment, entities, topics] = await Promise.all([
    generateText({
      model: openai("gpt-4o-mini"),
      system: "Analyze sentiment. Return: positive, negative, or neutral.",
      prompt: content,
    }),
    generateText({
      model: openai("gpt-4o-mini"),
      system: "Extract named entities as a JSON array.",
      prompt: content,
    }),
    generateText({
      model: openai("gpt-4o-mini"),
      system: "Classify the main topics. Return as a JSON array.",
      prompt: content,
    }),
  ])

  return {
    sentiment: sentiment.text,
    entities: entities.text,
    topics: topics.text,
  }
}

export default async function Page() {
  const result = await analyzeInParallel(
    "OpenAI released GPT-5 today, marking a significant advance in AI."
  )

  return (
    <div className="mx-auto max-w-xl space-y-3 p-8">
      <h1 className="text-lg font-semibold">Parallel Processing</h1>
      {Object.entries(result).map(([key, value]) => (
        <div key={key} className="rounded-md border p-3">
          <p className="text-xs font-medium uppercase">{key}</p>
          <p className="mt-1 text-sm text-muted-foreground">{value}</p>
        </div>
      ))}
    </div>
  )
}