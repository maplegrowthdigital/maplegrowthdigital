import type { MetadataRoute } from "next";
import { config } from "../content/config";

/**
 * Sitemap entries. Single-page marketing site + the two legal pages
 * (which are `index, follow`-able).
 *
 * When inner pages come back, add them here as new entries.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = config.getCanonicalUrl().replace(/\/$/, "");
  const now = new Date();

  return [
    {
      url: `${baseUrl}/`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
