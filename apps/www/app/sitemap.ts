import type { MetadataRoute } from "next"

import { siteConfig } from "@/config/site"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url

  const routes: MetadataRoute.Sitemap = [
    "",
    "/stacks",
    "/templates",
    "/pricing",
    "/directory",
    "/docs",
    "/docs/theming",
    "/docs/changelog",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: route === "" ? 1 : 0.8,
  }))

  return routes
}
