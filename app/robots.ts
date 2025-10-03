import type { MetadataRoute } from "next";
import { config } from "../content/config";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = config.getCanonicalUrl();
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${baseUrl.replace(/\/$/, "")}/sitemap.xml`,
  };
}
