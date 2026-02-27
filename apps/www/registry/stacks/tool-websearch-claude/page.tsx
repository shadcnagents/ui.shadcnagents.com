import { generateText } from "ai"
import { anthropic } from "@ai-sdk/anthropic"

export default async function Page() {
  const { text, sources } = await generateText({
    model: anthropic("claude-sonnet-4-20250514"),
    prompt: "What are the latest developments in AI?",
    tools: {
      web_search: anthropic.tools.webSearch_20250305({
        maxUses: 3,
      }),
    },
    maxSteps: 3,
  })

  return (
    <div className="mx-auto max-w-xl p-8">
      <p className="text-sm leading-relaxed">{text}</p>
      {sources && (
        <div className="mt-4 space-y-2">
          <p className="text-xs font-medium">Sources</p>
          {sources.map((s, i) => (
            <a
              key={i}
              href={s.url}
              className="block rounded border p-2 text-xs hover:bg-muted"
            >
              {s.title}
            </a>
          ))}
        </div>
      )}
    </div>
  )
}