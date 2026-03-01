"use client"

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body className="bg-background font-sans antialiased">
        <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
          <p className="font-mono text-sm uppercase tracking-widest text-neutral-500">
            Something went wrong
          </p>
          <h1 className="mt-3 text-2xl font-bold tracking-tight">
            Unexpected error
          </h1>
          <p className="mt-2 max-w-md text-sm text-neutral-500">
            An unexpected error occurred. Please try again.
          </p>
          <button
            onClick={reset}
            className="mt-6 inline-flex items-center justify-center rounded-md bg-neutral-900 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}
