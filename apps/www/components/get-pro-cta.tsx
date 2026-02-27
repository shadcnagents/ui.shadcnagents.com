import Link from "next/link"

export function GetProCta() {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4">
      <p className="text-sm font-medium">Copy and Paste 90+ AI SDK patterns.</p>
      <p className="text-xs text-muted-foreground">
        Get early access pricing and shape the future of the product.
      </p>
      <Link
        href="/pricing"
        className="inline-flex items-center justify-center rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Unlock All Access
      </Link>
    </div>
  )
}
