import { siteConfig } from "@/config/site"

export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "shadcnagents",
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.png`,
    description: siteConfig.description,
    sameAs: [siteConfig.links.twitter, siteConfig.links.github],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      url: `${siteConfig.url}/support`,
    },
    foundingDate: "2024",
    founder: {
      "@type": "Person",
      name: "shadcnagents",
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
