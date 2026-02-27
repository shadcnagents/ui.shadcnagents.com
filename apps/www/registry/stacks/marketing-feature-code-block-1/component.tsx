export function FeatureCodeBlock() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <h2 className="text-2xl font-semibold tracking-tight">
          Start Building in Minutes
        </h2>
        <p className="mt-3 text-muted-foreground">
          Simple, intuitive API that works with any language model
        </p>
        <div className="mt-8 overflow-hidden rounded-lg border text-left">
          <div className="border-b bg-muted/30 px-4 py-2">
            <span className="text-xs text-muted-foreground">page.tsx</span>
          </div>
          <pre className="overflow-x-auto p-4 text-sm">
{`import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

const { text } = await generateText({
  model: openai("gpt-4o"),
  prompt: "Explain quantum computing",
})`}
          </pre>
        </div>
      </div>
    </section>
  )
}