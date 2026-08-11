export const settings = {
  // Favicon — the maple-leaf brand mark. Vector primary; the PNG fallbacks
  // (/favicon.png, /apple-icon.png, /icon-192.png, /icon-512.png) are
  // rendered from this same SVG, so re-export them if the mark ever changes.
  faviconUrl: "/favicon.svg",

  // SEO Meta
  // Primary keyword: "growth marketing agency" (Canada) — chosen from real
  // data: it's the term GSC already shows impressions for + brand-aligned
  // (MapleGrowth). Secondary: digital marketing agency, Toronto/GTA geo.
  // Title leads with the keyword, then the brand. ~55 chars.
  siteName: "MapleGrowth Digital",
  seoTitle: "Growth Marketing Agency in Canada | MapleGrowth Digital",
  seoDescription:
    "A Canadian growth marketing agency — SEO, PPC, content, and conversion-first web design that drives measurable growth. Book a free strategy call.",
  canonicalUrl: "https://maplegrowthdigital.ca/",

  // Open Graph
  // og:image is generated dynamically via app/opengraph-image.tsx (next/og) —
  // no static image path needed. OG title stays brand-led (social shares
  // benefit from brand recognition more than keyword placement).
  ogTitle: "MapleGrowth Digital — Canadian Growth Marketing Agency",
  ogDescription:
    "A Canadian growth marketing agency — SEO, PPC, content, and conversion-first web that drives measurable growth across Toronto, the GTA, and beyond.",

  // Twitter
  twitterCard: "summary_large_image",
  twitterSite: "@maplegrowthdigital",

  // Analytics
  // GA4 is loaded directly via gtag.js. A GTM container (GTM-WSVN3SR3) also
  // loads. ⚠️ If the GTM container ALSO contains a GA4 tag for this same
  // property (G-LVQFYZGN8R), pageviews will be double-counted — pick ONE:
  // either keep this direct load and ensure GTM has no GA4 tag, or blank
  // this field and configure GA4 inside GTM. Verify in GA4 Realtime after
  // deploy: one pageview per visit = correct.
  googleAnalyticsId: "G-LVQFYZGN8R",
  googleTagManagerId: "GTM-WSVN3SR3",

  // Target keywords — REFERENCE ONLY (internal documentation of what we're
  // optimizing for). Not rendered: Google has ignored the meta-keywords tag
  // since ~2009, so we intentionally don't emit it. Ordered by priority to
  // match the homepage strategy (growth-marketing-agency primary, from GSC data).
  keywords: [
    "growth marketing agency",
    "growth marketing agency Canada",
    "growth marketing agency Toronto",
    "digital marketing agency Canada",
    "digital growth agency",
    "Canadian digital marketing agency",
    "maplegrowth digital",
  ],
} as const;
