import { notFound } from "next/navigation"
import { mdxComponents } from "@/mdx-components"

import { source } from "@/lib/source"

export const revalidate = false
export const dynamic = "force-static"
export const dynamicParams = false

export function generateStaticParams() {
  return source.generateParams()
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>
}) {
  const params = await props.params
  const page = source.getPage(params.slug)
  if (!page) return {}

  return {
    title: page.data.title,
    description: page.data.description,
  }
}

export default async function StackDocsPage(props: {
  params: Promise<{ slug?: string[] }>
}) {
  const params = await props.params
  const page = source.getPage(params.slug)
  if (!page) {
    notFound()
  }

  const doc = page.data
  // @ts-expect-error - revisit fumadocs types.
  const MDX = doc.body

  return (
    <div className="flex h-full flex-col">
      {/* Top bar matching pattern detail page */}
      <div className="shrink-0 flex items-center border-b border-border px-6 py-3">
        <div className="flex items-center gap-3">
          <h1 className="text-sm font-semibold text-foreground">
            {doc.title}
          </h1>
          {doc.description && (
            <>
              <span className="text-xs text-muted-foreground/40">—</span>
              <p className="text-xs text-muted-foreground">{doc.description}</p>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="min-h-0 flex-1 overflow-y-scroll scrollbar-hide">
        <div className="mx-auto max-w-3xl px-6 py-8">
          <article className="prose prose-neutral dark:prose-invert prose-sm max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-h2:mt-8 prose-h2:text-lg prose-h3:mt-6 prose-h3:text-base prose-p:leading-relaxed prose-pre:rounded-lg prose-pre:border prose-pre:border-border prose-code:text-[13px] prose-a:text-foreground prose-a:underline prose-a:underline-offset-4 hover:prose-a:text-foreground/80">
            <MDX components={mdxComponents} />
          </article>
        </div>
      </div>
    </div>
  )
}
