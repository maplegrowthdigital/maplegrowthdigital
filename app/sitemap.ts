import type { MetadataRoute } from "next";
import { config } from "../content/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = config.getCanonicalUrl();

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${baseUrl.replace(/\/$/, "")}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl.replace(/\/$/, "")}/services`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl.replace(/\/$/, "")}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];
}
