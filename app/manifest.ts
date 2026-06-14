import type { MetadataRoute } from "next";

/**
 * Web app manifest (Next App Router convention → /manifest.webmanifest).
 * Gives the site an installable identity + a theme color for mobile browser
 * chrome. Icons reference existing assets; add dedicated 192/512 maskable
 * PNGs later for a polished install/PWA experience.
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
      { src: "/images/favico.png", sizes: "any", type: "image/png" },
      {
        src: "/mgd-logo.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
