export const settings = {
  // Favicon
  faviconUrl: "/images/favico.png",

  // SEO Meta
  // Primary keyword target: "digital marketing agency Mississauga / GTA"
  // (local-first — easier to rank, ties to the LocalBusiness schema + HQ
  // address). Title leads with the keyword, then the brand. ~58 chars.
  siteName: "MapleGrowth Digital",
  seoTitle: "Mississauga Digital Marketing Agency | MapleGrowth Digital",
  seoDescription:
    "A Mississauga digital marketing agency serving the GTA and across Canada — SEO, PPC, content, and conversion-first web design built for measurable growth.",
  canonicalUrl: "https://maplegrowthdigital.ca/",

  // Open Graph
  // og:image is generated dynamically via app/opengraph-image.tsx (next/og) —
  // no static image path needed. OG title stays brand-led (social shares
  // benefit from brand recognition more than keyword placement).
  ogTitle: "MapleGrowth Digital — Canadian Growth Marketing Agency",
  ogDescription:
    "A Mississauga digital marketing agency serving the GTA and across Canada — SEO, PPC, content, and conversion-first web design built for measurable growth.",

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
  // since ~2009, so we intentionally don't emit it. Ordered by priority,
  // local-first to match the homepage strategy.
  keywords: [
    "digital marketing agency Mississauga",
    "marketing agency GTA",
    "SEO services Mississauga",
    "PPC management Mississauga",
    "web design Mississauga",
    "Canadian digital marketing agency",
    "maplegrowth digital",
  ],
} as const;
