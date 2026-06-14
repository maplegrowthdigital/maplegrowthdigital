export const settings = {
  // Favicon
  faviconUrl: "/images/favico.png",

  // SEO Meta
  siteName: "MapleGrowth Digital",
  seoTitle: "MapleGrowth Digital — Canadian Growth Marketing Agency",
  seoDescription:
    "Canadian digital marketing agency helping small businesses grow with SEO, PPC, content, and conversion-first web design.",
  canonicalUrl: "https://maplegrowthdigital.ca/",

  // Open Graph
  // og:image is generated dynamically via app/opengraph-image.tsx (next/og) —
  // no static image path needed.
  ogTitle: "MapleGrowth Digital — Canadian Growth Marketing Agency",
  ogDescription:
    "Canadian digital marketing agency helping small businesses grow with SEO, PPC, content, and conversion-first web design.",

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

  // Additional SEO keywords from data.json
  keywords: [
    "maple growth digital",
    "digital marketing Mississauga",
    "SEO services Canada",
    "website design Mississauga",
    "PPC management Canada",
  ],
} as const;
