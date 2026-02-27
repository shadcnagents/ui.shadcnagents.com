import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

const agents = {
  writer: openai("gpt-4o"),
  coder: openai("gpt-4o"),
  analyst: openai("gpt-4o"),
}

async function routeRequest(prompt: string) {
  const { text: route } = await generateText({
    model: openai("gpt-4o-mini"),
    system: `Classify the user request into one of: writer, coder, analyst.
Respond with only the category name.`,
    prompt,
  })

  const agent = route.trim().toLowerCase() as keyof typeof agents
  const model = agents[agent] ?? agents.writer

  const { text } = await generateText({
    model,
    prompt,
  })

  return { agent, text }
}

export default async function Page() {
  const { agent, text } = await routeRequest("Write a haiku about AI")

  return (
    <div className="mx-auto max-w-xl p-8">
      <p className="text-xs text-muted-foreground">Routed to: {agent}</p>
      <p className="mt-4 text-sm">{text}</p>
    </div>
  )
}