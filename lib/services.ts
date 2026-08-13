/**
 * SERVICE_CATALOG — single source of truth for the 6 services.
 * Used by:
 *  - QuickQuote modal (chips + cost math)
 *  - ConfigureWizard modal (services step chips)
 *  - ServiceDeepDive modal (full content rendering)
 *  - Services section card → deep-dive lookup
 */

interface ServiceEntry {
  id: string;
  /** Display title shown on cards + modals. Must match Services card titles. */
  title: string;
  /** Short subtitle / category for the deep-dive modal eyebrow. */
  tag: string;
  /** Monthly cost band [low, high] used by the quote calculator. */
  band: [number, number];
  /**
   * Fractional team count contribution per role.
   * Sum across selected services then ceil (min 1 per role if total ≥ 0.4).
   */
  teamFactor: {
    strategists: number;
    designers: number;
    devs: number;
  };
  lead: string;
  deliverables: string[];
  results: string[];
  quote: string;
}

export const SERVICE_CATALOG: ServiceEntry[] = [
  {
    id: "seo",
    title: "SEO & Analytics",
    tag: "Compounding visibility",
    band: [500, 2000],
    teamFactor: { strategists: 0.5, designers: 0, devs: 0.5 },
    lead: "Technical SEO, on-page optimization, content strategy, and analytics that compound — not vanity metrics.",
    deliverables: [
      "Technical SEO audit & priority roadmap",
      "Keyword research & content briefs",
      "On-page optimization (titles, schema, internal links)",
      "GA4 + Looker Studio dashboards",
      "Local + national visibility programs",
    ],
    results: [
      "Voyamore: 90+ technical SEO score at launch",
      "Technical foundations built to compound, not spike",
      "GA4 + Looker Studio reporting so progress is measurable",
    ],
    quote: "We chase compounding visibility, not vanity rankings — traffic that keeps paying after the invoice clears.",
  },
  {
    id: "ppc",
    title: "PPC & Paid Media",
    tag: "ROI-first acquisition",
    band: [600, 2400],
    teamFactor: { strategists: 0.75, designers: 0.5, devs: 0.25 },
    lead: "ROI-first campaigns across Google, Performance Max, YouTube, and social. Built for measurable, compounding growth.",
    deliverables: [
      "Account audit + structural rebuild",
      "Creative kits (display, video, social)",
      "Landing page CRO + A/B testing",
      "Retargeting & lifecycle ads",
      "Weekly performance + spend reviews",
    ],
    results: [
      "ROI-first account structure built for measurable payback",
      "Creative + landing pages tested to lower acquisition cost",
      "Transparent spend reporting — every dollar accounted for",
    ],
    quote: "Paid media should pay for itself, fast. If it doesn't, we change the plan — not the invoice.",
  },
  {
    id: "web",
    title: "Web Design & Development",
    tag: "Conversion-first builds",
    band: [750, 4000],
    teamFactor: { strategists: 0.5, designers: 1, devs: 1 },
    lead: "Conversion-focused, accessible websites engineered for speed, security, and scalability — not just aesthetics.",
    deliverables: [
      "Information architecture + wireframes",
      "Brand-aligned visual design system",
      "WordPress, Headless, or Shopify builds",
      "Core Web Vitals optimization",
      "Analytics + tagging implementation",
    ],
    results: [
      "Voyamore: travel aggregator shipped with zero third-party plugin bloat",
      "Voyamore: 90+ technical SEO score at launch",
      "Voyamore: 8 Canadian departure hubs on one fast codebase",
    ],
    quote: "Fast, accessible, and built to convert — not just to look good in a screenshot.",
  },
  {
    id: "content",
    title: "Content & Email",
    tag: "Nurture demand",
    band: [500, 1500],
    teamFactor: { strategists: 0.5, designers: 0.25, devs: 0 },
    lead: "Editorial calendars, sales enablement content, and lifecycle email that nurtures demand without spamming inboxes.",
    deliverables: [
      "Editorial calendars + content briefs",
      "Long-form articles & lead magnets",
      "Newsletter sequences + automations",
      "Klaviyo / HubSpot / Mailchimp setup",
      "CRM integrations + segmentation",
    ],
    results: [
      "Editorial calendars mapped to real buyer questions",
      "Lifecycle email that nurtures without spamming inboxes",
      "CRM + segmentation wired so results are attributable",
    ],
    quote: "Content that earns attention and email that earns the sale — without ever spamming an inbox.",
  },
  {
    id: "brand",
    title: "Brand & Creative",
    tag: "Recognition + conversion",
    band: [500, 2400],
    teamFactor: { strategists: 0.5, designers: 1, devs: 0 },
    lead: "Brand systems, ad creative, and motion assets that lift recognition and convert — beyond decoration.",
    deliverables: [
      "Visual identity + brand guidelines",
      "Ad creative kits (static, video, motion)",
      "Pitch deck + sales collateral",
      "Social templates + asset library",
      "Brand voice + messaging frameworks",
    ],
    results: [
      "Identity systems that hold up across web, social, and ads",
      "Brand voice + messaging documented so it stays consistent",
      "Creative built to convert — not just to win awards",
    ],
    quote: "A brand should do a job: recognition that turns into revenue.",
  },
  {
    id: "strategy",
    title: "Growth Strategy",
    tag: "Aligned execution",
    band: [500, 2000],
    teamFactor: { strategists: 1, designers: 0.25, devs: 0.25 },
    lead: "Positioning, messaging, and go-to-market plans tailored to your stage. We don't just consult — we ship.",
    deliverables: [
      "ICP definition + messaging hierarchy",
      "Channel mix planning + budget allocation",
      "KPI framework + dashboard",
      "Quarterly OKRs + sprint planning",
      "Competitive landscape + positioning audit",
    ],
    results: [
      "Positioning + channel mix mapped to your stage",
      "A KPI framework so progress is measurable, not vibes",
      "We don't just advise — we ship the plan with you",
    ],
    quote: "Strategy you can act on Monday — not a deck that gathers dust.",
  },
  {
    id: "mobile-app",
    title: "Mobile App Development",
    tag: "Native + cross-platform",
    band: [2500, 12000],
    teamFactor: { strategists: 0.25, designers: 0.5, devs: 1.5 },
    lead: "Native and cross-platform mobile apps, designed and built with our engineering partner Growmintech — from concept to App Store launch.",
    deliverables: [
      "Product scoping + UX flows",
      "iOS & Android (native or React Native / Flutter)",
      "API + backend integration",
      "App Store + Play Store submission",
      "Post-launch maintenance & iteration",
    ],
    results: [
      "Delivered with our engineering partner, Growmintech",
      "Built for performance, offline resilience, and scale",
      "One team from strategy through store launch",
    ],
    quote: "An app is a product, not a project — we plan for version two before we ship version one.",
  },
  {
    id: "ecommerce",
    title: "E-Commerce Store Development",
    tag: "Stores that sell",
    band: [2000, 9000],
    teamFactor: { strategists: 0.25, designers: 0.75, devs: 1.25 },
    lead: "High-converting online stores — Shopify, headless commerce, or custom — built with our engineering partner Growmintech and tuned to convert.",
    deliverables: [
      "Storefront design + build (Shopify / headless)",
      "Payments, checkout & tax configuration",
      "Product + catalog architecture",
      "Conversion-rate optimization",
      "Analytics + lifecycle email integration",
    ],
    results: [
      "Delivered with our engineering partner, Growmintech",
      "Built on conversion best-practices, not just aesthetics",
      "Integrated with your marketing + email stack",
    ],
    quote: "A store's only job is to sell — every design choice should defend the checkout.",
  },
];

export const findServiceById = (id: string) =>
  SERVICE_CATALOG.find((s) => s.id === id);
