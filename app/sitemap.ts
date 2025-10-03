import type { MetadataRoute } from "next";
import { config } from "../content/config";
import { getAllPosts } from "../content/posts";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = config.getCanonicalUrl();
  const posts = getAllPosts();

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${baseUrl.replace(/\/$/, "")}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...posts.map((post) => ({
      url: `${baseUrl.replace(/\/$/, "")}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
