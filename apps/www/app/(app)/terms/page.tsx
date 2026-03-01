import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of service for shadcnagents.",
}

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 md:py-24">
      <h1 className="text-3xl font-bold tracking-tight">Terms of Service</h1>
      <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
        Last updated: February 27, 2026
      </p>

      <div className="mt-10 space-y-8 text-[14px] leading-relaxed text-muted-foreground">
        <section>
          <h2 className="mb-3 text-base font-semibold text-foreground">
            1. Acceptance of Terms
          </h2>
          <p>
            By accessing or using shadcnagents (&ldquo;the Service&rdquo;), you
            agree to be bound by these Terms of Service. If you do not agree,
            do not use the Service.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-base font-semibold text-foreground">
            2. License
          </h2>
          <p>
            Free-tier stacks are provided under the MIT License. Pro-tier
            stacks are provided under a perpetual commercial license upon
            purchase. You may use both in unlimited personal and commercial
            projects. No attribution is required.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-base font-semibold text-foreground">
            3. Payments & Refunds
          </h2>
          <p>
            Pro access is a one-time lifetime purchase. We offer a 30-day
            money-back guarantee. Refund requests after 30 days are handled on
            a case-by-case basis.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-base font-semibold text-foreground">
            4. Acceptable Use
          </h2>
          <p>
            You may not redistribute, resell, or sublicense the source code of
            Pro stacks as a competing product or template marketplace. You may
            use the code in any end-user application, SaaS, or internal tool.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-base font-semibold text-foreground">
            5. Disclaimer
          </h2>
          <p>
            The Service is provided &ldquo;as is&rdquo; without warranty of any
            kind. We do not guarantee uptime, accuracy, or fitness for a
            particular purpose.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-base font-semibold text-foreground">
            6. Contact
          </h2>
          <p>
            For questions about these terms, email us at{" "}
            <a href="mailto:support@shadcnagents.com" className="text-foreground underline underline-offset-4 hover:no-underline">
              support@shadcnagents.com
            </a>{" "}
            or reach out via our GitHub repository or Twitter.
          </p>
        </section>
      </div>
    </div>
  )
}
