import type { MetadataRoute } from "next";

/**
 * Web app manifest (Next App Router convention → /manifest.webmanifest).
 * Gives the site an installable identity + a theme color for mobile browser
 * chrome. Icons are the maple-leaf brand mark, rendered from public/favicon.svg
 * onto an opaque brand-paper tile (install surfaces don't handle transparency
 * consistently).
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "MapleGrowth Digital",
    short_name: "MapleGrowth",
    description:
      "Canadian growth marketing agency — SEO, PPC, content, and conversion-first web design.",
    start_url: "/",
    display: "standalone",
    background_color: "#0d0c0a",
    theme_color: "#0d0c0a",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
