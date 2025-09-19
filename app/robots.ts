import type { MetadataRoute } from "next";
import { createAnonServerClient } from "../utils/supabase/server";

export default async function robots(): Promise<MetadataRoute.Robots> {
  let base = process.env.NEXT_PUBLIC_SITE_URL || "";
  try {
    const supabase = createAnonServerClient();
    const { data, error } = await supabase
      .from("sections")
      .select("data")
      .eq("id", "settings")
      .single();
    const canonical =
      !error && data?.data?.canonicalUrl
        ? (data.data.canonicalUrl as string)
        : undefined;
    if (canonical) base = canonical.replace(/\/$/, "");
  } catch {}
  if (!base) base = "https://example.com";
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api/admin"] }],
    sitemap: `${base}/sitemap.xml`,
  };
}
