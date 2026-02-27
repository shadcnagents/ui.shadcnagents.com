const features = [
  {
    title: "Streaming",
    description: "Real-time token streaming with backpressure handling",
  },
  {
    title: "Tool Calling",
    description: "Type-safe function invocation with automatic validation",
  },
  {
    title: "Multi-modal",
    description: "Text, image, audio, and video generation in one API",
  },
  {
    title: "Provider Agnostic",
    description: "Switch between OpenAI, Anthropic, Google with one line",
  },
  {
    title: "Edge Ready",
    description: "Deploy to Vercel Edge, Cloudflare Workers, or Deno",
  },
  {
    title: "Type Safe",
    description: "Full TypeScript support with inferred types",
  },
]

export function FeatureGrid() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-4xl px-6">
        <h2 className="text-center text-2xl font-semibold tracking-tight">
          Everything You Need
        </h2>
        <p className="mt-3 text-center text-muted-foreground">
          Built for modern AI applications
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="rounded-lg border p-5">
              <h3 className="text-sm font-medium">{f.title}</h3>
              <p className="mt-1.5 text-xs text-muted-foreground">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}