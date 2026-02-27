export function BentoGrid() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-4xl px-6">
        <h2 className="text-center text-2xl font-semibold tracking-tight">
          Platform Features
        </h2>
        <div className="mt-10 grid grid-cols-3 gap-3">
          {/* Large card */}
          <div className="col-span-2 row-span-2 flex flex-col justify-between rounded-lg border p-6">
            <div>
              <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                AI Models
              </span>
              <h3 className="mt-2 text-lg font-semibold">Unified Model API</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                One interface for every provider.
              </p>
            </div>
            <div className="mt-4 space-y-1">
              {["OpenAI", "Anthropic", "Google", "Meta"].map((p) => (
                <div key={p} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="size-1.5 rounded-full bg-foreground/30" />
                  {p}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border p-4">
            <span className="text-[10px] uppercase text-muted-foreground">Latency</span>
            <p className="mt-2 text-2xl font-semibold">&lt;100ms</p>
            <p className="text-xs text-muted-foreground">First token</p>
          </div>

          <div className="rounded-lg border p-4">
            <span className="text-[10px] uppercase text-muted-foreground">Uptime</span>
            <p className="mt-2 text-2xl font-semibold">99.9%</p>
            <p className="text-xs text-muted-foreground">SLA</p>
          </div>

          <div className="col-span-3 rounded-lg border p-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium">Ready to get started?</h3>
                <p className="text-xs text-muted-foreground">
                  Build your first AI app in under 5 minutes.
                </p>
              </div>
              <button className="rounded-md bg-foreground px-4 py-2 text-sm text-background">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}