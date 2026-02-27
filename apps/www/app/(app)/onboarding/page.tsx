"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Check } from "lucide-react"

const USE_CASES = [
  { id: "saas", label: "Building a SaaS product", emoji: "🚀" },
  { id: "agency", label: "Freelancer / agency", emoji: "🎨" },
  { id: "internal", label: "Internal tools for my company", emoji: "🏢" },
  { id: "learning", label: "Learning / side project", emoji: "📚" },
]

const TECH_STACKS = [
  { id: "nextjs-vercel-ai", label: "Next.js + Vercel AI SDK", emoji: "⚡" },
  { id: "nextjs-other", label: "Next.js + another AI SDK", emoji: "🔧" },
  { id: "other", label: "Other framework", emoji: "🌐" },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [useCase, setUseCase] = useState("")
  const [techStack, setTechStack] = useState("")
  const [saving, setSaving] = useState(false)

  async function handleSubmit() {
    if (!useCase || !techStack) return
    setSaving(true)

    await fetch("/api/user/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ useCase, techStack }),
    })

    router.push("/stacks")
  }

  return (
    <div className="container flex min-h-[calc(100vh-8rem)] items-center justify-center py-16">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold tracking-tight">Welcome to shadcnagents</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Two quick questions to help us show you the most relevant stacks.
          </p>
        </div>

        <div className="space-y-6">
          {/* Question 1 */}
          <div className="space-y-3">
            <p className="text-sm font-medium">What best describes you?</p>
            <div className="grid grid-cols-2 gap-2">
              {USE_CASES.map((uc) => (
                <button
                  key={uc.id}
                  onClick={() => setUseCase(uc.id)}
                  className={`relative flex flex-col items-start gap-1 rounded-lg border p-3 text-left text-sm transition-colors ${
                    useCase === uc.id
                      ? "border-foreground bg-foreground/5"
                      : "border-border hover:border-foreground/30 hover:bg-muted/30"
                  }`}
                >
                  {useCase === uc.id && (
                    <span className="absolute right-2 top-2 flex size-4 items-center justify-center rounded-full bg-foreground">
                      <Check className="size-2.5 text-background" />
                    </span>
                  )}
                  <span className="text-base">{uc.emoji}</span>
                  <span className="font-medium leading-tight">{uc.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Question 2 */}
          <div className="space-y-3">
            <p className="text-sm font-medium">What stack are you using?</p>
            <div className="space-y-2">
              {TECH_STACKS.map((ts) => (
                <button
                  key={ts.id}
                  onClick={() => setTechStack(ts.id)}
                  className={`relative flex w-full items-center gap-3 rounded-lg border p-3 text-left text-sm transition-colors ${
                    techStack === ts.id
                      ? "border-foreground bg-foreground/5"
                      : "border-border hover:border-foreground/30 hover:bg-muted/30"
                  }`}
                >
                  {techStack === ts.id && (
                    <span className="absolute right-3 flex size-4 items-center justify-center rounded-full bg-foreground">
                      <Check className="size-2.5 text-background" />
                    </span>
                  )}
                  <span className="text-base">{ts.emoji}</span>
                  <span className="font-medium">{ts.label}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!useCase || !techStack || saving}
            className="h-10 w-full rounded-md bg-primary text-sm font-medium text-primary-foreground transition-opacity disabled:opacity-40 hover:opacity-90"
          >
            {saving ? "Saving…" : "Get started →"}
          </button>

          <button
            onClick={() => router.push("/stacks")}
            className="w-full text-center text-xs text-muted-foreground hover:text-foreground"
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  )
}
