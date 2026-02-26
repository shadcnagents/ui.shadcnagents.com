import type { MetadataRoute } from "next"

import { siteConfig } from "@/config/site"
import { getAllStacks } from "@/config/stacks"
import { source } from "@/lib/source"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url
  const now = new Date()

  // Core static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/stacks`, lastModified: now, changeFrequency: "daily", priority: 0.95 },
    { url: `${baseUrl}/templates`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/pricing`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/directory`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
  ]

  // All 60+ stack pages — highest priority, these are the money pages
  const stackRoutes: MetadataRoute.Sitemap = getAllStacks().map((stack) => ({
    url: `${baseUrl}${stack.link}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }))

  // All docs pages via fumadocs source
  const docRoutes: MetadataRoute.Sitemap = source.getPages().map((page) => ({
    url: `${baseUrl}${page.url}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }))

  return [...staticRoutes, ...stackRoutes, ...docRoutes]
}
