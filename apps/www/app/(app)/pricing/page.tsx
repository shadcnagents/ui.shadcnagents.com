import type { Metadata } from "next"
import Link from "next/link"

import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Get lifetime access to 90+ pro AI SDK agent stacks, templates, and full-stack examples.",
}

const freePlan = {
  name: "Free",
  price: "$0",
  description: "Get started with 30+ free stacks",
  cta: "Browse Free Stacks",
  href: "/stacks",
  features: [
    "30+ free stacks (MIT)",
    "All SDK API basics",
    "Core chat UI",
    "Basic agent stacks",
    "Community support",
    "Radix + Base UI",
    "Theme customization",
    "GitHub access",
  ],
}

const proPlan = {
  name: "Pro",
  price: "$149",
  originalPrice: "$249",
  description: "One-time payment, lifetime access",
  cta: "Get Lifetime Access",
  href: "#",
  features: [
    "Everything in Free",
    "90+ pro stacks",
    "All templates",
    "Advanced agent stacks",
    "Full-stack example agents",
    "Chat clones",
    "JSON Render",
    "WDK Workflows",
    "Marketing UI",
    "Priority support",
    "Commercial license",
    "30-day guarantee",
  ],
}

export default function PricingPage() {
  return (
    <div className="container py-16 md:py-24">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight">Pricing</h1>
          <p className="text-muted-foreground mt-3 text-lg">
            Simple pricing. One-time payment. Lifetime access.
          </p>
        </div>

        {/* Plan Cards */}
        <div className="grid gap-8 md:grid-cols-2">
          {/* Free Plan */}
          <div className="border-border flex flex-col rounded-lg border p-8">
            <div className="mb-6">
              <h2 className="text-xl font-semibold">{freePlan.name}</h2>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-4xl font-bold tracking-tight">
                  {freePlan.price}
                </span>
              </div>
              <p className="text-muted-foreground mt-2 text-sm">
                {freePlan.description}
              </p>
            </div>

            <ul className="mb-8 flex-1 space-y-3">
              {freePlan.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-2 text-sm"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={16}
                    height={16}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-muted-foreground mt-0.5 shrink-0"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>

            <Link
              href={freePlan.href}
              className="border-border hover:bg-muted inline-flex items-center justify-center rounded-md border px-6 py-3 text-sm font-medium transition-colors"
            >
              {freePlan.cta}
            </Link>
          </div>

          {/* Pro Plan */}
          <div className="ring-foreground flex flex-col rounded-lg border-2 p-8 ring-2">
            <div className="mb-6">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-semibold">{proPlan.name}</h2>
                <span className="bg-foreground text-background rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider">
                  Lifetime
                </span>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-4xl font-bold tracking-tight">
                  {proPlan.price}
                </span>
                <span className="text-muted-foreground text-lg line-through">
                  {proPlan.originalPrice}
                </span>
              </div>
              <p className="text-muted-foreground mt-2 text-sm">
                {proPlan.description}
              </p>
            </div>

            <ul className="mb-8 flex-1 space-y-3">
              {proPlan.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-2 text-sm"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={16}
                    height={16}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mt-0.5 shrink-0"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>

            <Link
              href={proPlan.href}
              className="bg-foreground text-background hover:bg-foreground/90 inline-flex items-center justify-center rounded-md px-6 py-3 text-sm font-medium transition-colors"
            >
              {proPlan.cta}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
