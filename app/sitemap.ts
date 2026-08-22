import type { MetadataRoute } from "next";
import { config } from "../content/config";
import { getAllPosts } from "../lib/posts";

/**
 * Sitemap. Static pages plus every published blog post. `/blog` itself is
 * only listed once at least one post exists — an empty index is noindex.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = config.getCanonicalUrl().replace(/\/$/, "");
  const now = new Date();
  const posts = getAllPosts();

  const entries: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  if (posts.length > 0) {
    entries.push({
      url: `${baseUrl}/blog`,
      lastModified: new Date(posts[0].updated ?? posts[0].date),
      changeFrequency: "weekly",
      priority: 0.7,
    });
    for (const p of posts) {
      entries.push({
        url: `${baseUrl}/blog/${p.slug}`,
        lastModified: new Date(p.updated ?? p.date),
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  }

  entries.push(
    {
      url: `${baseUrl}/editorial-standards`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
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
    }
  );

  return entries;
}
