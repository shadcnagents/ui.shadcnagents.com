"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { SPRING, FADE_UP, STAGGER } from "./shared"

/* ─── Code Block 1 ─── */
export function CodeBlock1Preview() {
  const [activeTab, setActiveTab] = useState("typescript")
  const [copied, setCopied] = useState(false)

  const codeExamples: Record<string, string> = {
    typescript: `import { deploy } from "@vercel/sdk"

const deployment = await deploy({
  project: "my-next-app",
  target: "production",
  regions: ["iad1", "sfo1", "cdg1"],
  framework: "nextjs",
})

console.log(deployment.url)`,
    python: `import requests

response = requests.post(
    "https://api.vercel.com/v13/deployments",
    headers={"Authorization": "Bearer <token>"},
    json={
        "name": "my-next-app",
        "target": "production",
        "gitSource": {"ref": "main"},
    },
)

print(response.json()["url"])`,
  }

  function handleCopy() {
    navigator.clipboard.writeText(codeExamples[activeTab]).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="mx-auto w-full max-w-2xl p-6">
      <div className="mb-6 text-center">
        <h3 className="text-base font-semibold tracking-tight text-foreground">
          Deploy with Vercel in Seconds
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Push to git. We handle the rest with zero configuration.
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-border">
        <div className="flex items-center justify-between border-b border-border bg-card px-4">
          <div className="flex items-center gap-0">
            {Object.keys(codeExamples).map((lang) => (
              <button
                key={lang}
                onClick={() => { setActiveTab(lang); setCopied(false) }}
                className={`border-b-2 px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
                  activeTab === lang
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-xs text-muted-foreground transition-all duration-150 hover:text-foreground"
          >
            {copied ? (
              <>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-primary">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Copied
              </>
            ) : (
              <>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect width="14" height="14" x="8" y="8" rx="2" />
                  <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                </svg>
                Copy
              </>
            )}
          </button>
        </div>
        <pre className="overflow-x-auto p-4 text-sm leading-relaxed [&::-webkit-scrollbar]:hidden">
          <code className="font-mono text-foreground/90">{codeExamples[activeTab]}</code>
        </pre>
      </div>
    </div>
  )
}

/* ─── Code Block 2 ─── */
export function CodeBlock2Preview() {
  const [copiedPane, setCopiedPane] = useState<string | null>(null)

  function handleCopy(pane: string, code: string) {
    navigator.clipboard.writeText(code).catch(() => {})
    setCopiedPane(pane)
    setTimeout(() => setCopiedPane(null), 2000)
  }

  const serverCode = `import Stripe from "stripe"

const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY!
)

export async function createCheckout(
  priceId: string
) {
  const session =
    await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: priceId }],
    success_url: "/success",
  })
  return session.url
}`

  const clientCode = `"use client"

import { loadStripe } from "@stripe/stripe-js"

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_KEY!
)

export default function Pricing() {
  async function handleCheckout() {
    const res = await fetch("/api/checkout")
    const { sessionId } = await res.json()
    const stripe = await stripePromise
    stripe?.redirectToCheckout({ sessionId })
  }

  return (
    <button onClick={handleCheckout}>
      Subscribe
    </button>
  )
}`

  return (
    <div className="mx-auto w-full max-w-2xl p-6">
      <motion.div
        initial="initial"
        animate="animate"
        variants={{ animate: { ...STAGGER } }}
        className="grid gap-4 md:grid-cols-2"
      >
        {[
          { title: "Payment Backend", file: "checkout.ts", code: serverCode, pane: "server" },
          { title: "Pricing Page", file: "pricing.tsx", code: clientCode, pane: "client" },
        ].map(({ title, file, code, pane }) => (
          <motion.div
            key={pane}
            variants={FADE_UP}
            transition={{ ...SPRING }}
            className="space-y-2"
          >
            <h3 className="text-sm font-semibold text-foreground">{title}</h3>
            <div className="overflow-hidden rounded-xl border border-border bg-card">
              <div className="flex items-center justify-between border-b border-border px-3 py-1.5">
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-muted-foreground/30" />
                  <span className="font-mono text-xs text-muted-foreground">
                    {file}
                  </span>
                </div>
                <button
                  onClick={() => handleCopy(pane, code)}
                  className="text-xs text-muted-foreground transition-all duration-150 hover:text-foreground"
                >
                  {copiedPane === pane ? "Copied" : "Copy"}
                </button>
              </div>
              <pre className="p-3 text-sm leading-relaxed">
                <code className="font-mono text-foreground/90">{code}</code>
              </pre>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

/* ─── Code Block 3 ─── */
export function CodeBlock3Preview() {
  const [copied, setCopied] = useState(false)

  const code = `// Create and assign Linear issues
import { LinearClient } from "@linear/sdk"

const linear = new LinearClient({
  apiKey: process.env.LINEAR_API_KEY,
})

const issue = await linear.createIssue({
  teamId: "TEAM_ENG",
  title: "Fix auth token refresh",
  priority: 1,
  assigneeId: "usr_abc123",
})`

  function handleCopy() {
    navigator.clipboard.writeText(code).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="mx-auto w-full max-w-2xl p-6">
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="size-2.5 rounded-full bg-muted-foreground/20" />
              <div className="size-2.5 rounded-full bg-muted-foreground/20" />
              <div className="size-2.5 rounded-full bg-muted-foreground/20" />
            </div>
            <span className="ml-2 font-mono text-xs text-muted-foreground">linear.ts</span>
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-xs text-muted-foreground transition-all duration-150 hover:text-foreground"
          >
            {copied ? (
              <>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-primary">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Copied
              </>
            ) : (
              <>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect width="14" height="14" x="8" y="8" rx="2" />
                  <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                </svg>
                Copy
              </>
            )}
          </button>
        </div>
        <pre className="overflow-x-auto p-4 text-sm leading-relaxed [&::-webkit-scrollbar]:hidden">
          <code className="font-mono">
            <span className="text-muted-foreground">{"// "}</span>
            <span className="text-muted-foreground">Create and assign Linear issues</span>
            {"\n"}
            <span className="text-primary/70">import</span>
            <span className="text-foreground">{" { LinearClient }"}</span>
            <span className="text-primary/70"> from </span>
            <span className="text-foreground/80">{'"@linear/sdk"'}</span>
            {"\n\n"}
            <span className="text-primary/70">const</span>
            <span className="text-foreground"> linear </span>
            <span className="text-primary/70">= new</span>
            <span className="text-foreground">{" LinearClient({"}</span>
            {"\n"}
            <span className="text-foreground">{"  apiKey: "}</span>
            <span className="text-foreground/80">process.env.LINEAR_API_KEY</span>
            <span className="text-foreground">,</span>
            {"\n"}
            <span className="text-foreground">{"})"}</span>
            {"\n\n"}
            <span className="text-primary/70">const</span>
            <span className="text-foreground"> issue </span>
            <span className="text-primary/70">= await</span>
            <span className="text-foreground">{" linear.createIssue({"}</span>
            {"\n"}
            <span className="text-foreground">{"  teamId: "}</span>
            <span className="text-foreground/80">{'"TEAM_ENG"'}</span>
            <span className="text-foreground">,</span>
            {"\n"}
            <span className="text-foreground">{"  title: "}</span>
            <span className="text-foreground/80">{'"Fix auth token refresh"'}</span>
            <span className="text-foreground">,</span>
            {"\n"}
            <span className="text-foreground">{"  priority: "}</span>
            <span className="text-primary">1</span>
            <span className="text-foreground">,</span>
            {"\n"}
            <span className="text-foreground">{"  assigneeId: "}</span>
            <span className="text-foreground/80">{'"usr_abc123"'}</span>
            {"\n"}
            <span className="text-foreground">{"})"}</span>
          </code>
        </pre>
      </div>
    </div>
  )
}

/* ─── Feature Grid ─── */

const FEATURE_ICONS: Record<string, React.ReactElement> = {
  "Edge Network": (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  "Serverless Functions": (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  ),
  "Image Optimization": (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </svg>
  ),
  "Framework Agnostic": (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  ),
  "Preview Deploys": (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  Analytics: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 3v18h18" />
      <path d="m19 9-5 5-4-4-3 3" />
    </svg>
  ),
}

export function FeatureGridPreview() {
  const features = [
    { title: "Edge Network", description: "Deploy to 100+ global edge locations with zero config" },
    { title: "Serverless Functions", description: "Auto-scaling compute that runs only when you need it" },
    { title: "Image Optimization", description: "Automatic WebP/AVIF conversion and lazy loading" },
    { title: "Framework Agnostic", description: "Works with Next.js, Nuxt, SvelteKit, Astro, and more" },
    { title: "Preview Deploys", description: "Every pull request gets its own live preview URL" },
    { title: "Analytics", description: "Real-time Web Vitals and audience insights built in" },
  ]

  return (
    <div className="mx-auto w-full max-w-3xl p-6">
      <div className="mb-6 text-center">
        <h3 className="text-base font-semibold tracking-tight text-foreground">
          Develop. Preview. Ship.
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          The complete platform for frontend teams
        </p>
      </div>

      <motion.div
        initial="initial"
        animate="animate"
        variants={{ animate: { ...STAGGER } }}
        className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
      >
        {features.map((feature) => (
          <motion.div
            key={feature.title}
            variants={FADE_UP}
            transition={{ ...SPRING }}
            className="rounded-xl border border-border p-4 transition-all duration-150 hover:border-primary/30 hover:bg-card"
          >
            <div className="mb-2 flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              {FEATURE_ICONS[feature.title]}
            </div>
            <h4 className="text-sm font-semibold text-foreground">
              {feature.title}
            </h4>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

/* ─── Bento Layout ─── */
export function BentoLayoutPreview() {
  return (
    <div className="mx-auto w-full max-w-3xl p-6">
      <div className="mb-6 text-center">
        <h3 className="text-base font-semibold tracking-tight text-foreground">
          Built for Apple Silicon
        </h3>
      </div>

      <motion.div
        initial="initial"
        animate="animate"
        variants={{ animate: { ...STAGGER } }}
        className="grid grid-cols-3 gap-3"
      >
        {/* Large card */}
        <motion.div
          variants={FADE_UP}
          transition={{ ...SPRING }}
          className="col-span-2 row-span-2 flex flex-col justify-between rounded-xl border border-border p-5 transition-all duration-150 hover:border-primary/30 hover:bg-card"
        >
          <div>
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Apple Intelligence
            </span>
            <h4 className="mt-2 text-base font-semibold text-foreground">
              Deeply Integrated AI
            </h4>
            <p className="mt-1 text-sm text-muted-foreground">
              Personal, private, and powerful. AI that understands your context
              across every Apple device.
            </p>
          </div>
          <div className="mt-4 space-y-1.5">
            {["iPhone", "iPad", "Mac", "Apple Watch"].map((p) => (
              <div
                key={p}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <div className="size-1.5 rounded-full bg-primary" />
                {p}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Small cards */}
        <motion.div
          variants={FADE_UP}
          transition={{ ...SPRING }}
          className="flex flex-col justify-between rounded-xl border border-border p-4 transition-all duration-150 hover:border-primary/30 hover:bg-card"
        >
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Battery
          </span>
          <div className="mt-2">
            <p className="font-mono text-2xl font-semibold tabular-nums text-foreground">
              24hr
            </p>
            <p className="text-xs text-muted-foreground">All-day battery life</p>
          </div>
        </motion.div>

        <motion.div
          variants={FADE_UP}
          transition={{ ...SPRING }}
          className="flex flex-col justify-between rounded-xl border border-border p-4 transition-all duration-150 hover:border-primary/30 hover:bg-card"
        >
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Performance
          </span>
          <div className="mt-2">
            <p className="font-mono text-2xl font-semibold tabular-nums text-foreground">
              M4 Pro
            </p>
            <p className="text-xs text-muted-foreground">Latest chip generation</p>
          </div>
        </motion.div>

        {/* Wide card */}
        <motion.div
          variants={FADE_UP}
          transition={{ ...SPRING }}
          className="col-span-3 rounded-xl border border-border p-4 transition-all duration-150 hover:border-primary/30"
        >
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-foreground">
                Trade in your device
              </h4>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Get credit toward a new Mac when you trade in an eligible device.
              </p>
            </div>
            <motion.button
              whileTap={{ scale: 0.97 }}
              className="h-9 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-all duration-150 hover:bg-primary/90"
            >
              Learn More
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
