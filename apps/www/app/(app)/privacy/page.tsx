import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for shadcnagents.",
}

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 md:py-24">
      <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
      <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
        Last updated: February 27, 2026
      </p>

      <div className="mt-10 space-y-8 text-[14px] leading-relaxed text-muted-foreground">
        <section>
          <h2 className="mb-3 text-base font-semibold text-foreground">
            1. Information We Collect
          </h2>
          <p>
            When you sign in via GitHub or Google, we store your name, email
            address, and avatar URL. We also store your purchase status (free
            or pro tier). We do not collect payment card details — payments
            are processed by our third-party provider.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-base font-semibold text-foreground">
            2. How We Use Your Information
          </h2>
          <p>
            We use your information to authenticate your account, deliver Pro
            content, and send important service updates. We do not sell your
            data to third parties.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-base font-semibold text-foreground">
            3. Analytics
          </h2>
          <p>
            We use PostHog and Vercel Analytics to understand how the site is
            used. These tools collect anonymous usage data such as page views,
            browser type, and general location. No personally identifiable
            information is shared with analytics providers.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-base font-semibold text-foreground">
            4. Cookies
          </h2>
          <p>
            We use essential cookies for authentication session management.
            Analytics cookies are used to improve the service. You can disable
            non-essential cookies in your browser settings.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-base font-semibold text-foreground">
            5. Data Retention
          </h2>
          <p>
            Account data is retained as long as your account is active. You
            may request deletion of your account and associated data at any
            time by contacting us.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-base font-semibold text-foreground">
            6. Contact
          </h2>
          <p>
            For privacy-related inquiries, reach out via our GitHub repository
            or Twitter.
          </p>
        </section>
      </div>
    </div>
  )
}
