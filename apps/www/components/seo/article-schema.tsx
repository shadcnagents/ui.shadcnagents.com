import { siteConfig } from "@/config/site"

interface ArticleSchemaProps {
  title: string
  description: string
  url: string
  datePublished?: string
  dateModified?: string
}

export function ArticleSchema({
  title,
  description,
  url,
  datePublished,
  dateModified,
}: ArticleSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: title,
    description: description,
    url: url,
    author: {
      "@type": "Organization",
      name: "shadcnagents",
      url: siteConfig.url,
    },
    publisher: {
      "@type": "Organization",
      name: "shadcnagents",
      url: siteConfig.url,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    ...(datePublished && { datePublished }),
    ...(dateModified && { dateModified }),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
