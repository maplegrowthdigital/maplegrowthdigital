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
    band: [1500, 4500],
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
      "+218% organic traffic for SBSB in 9 months",
      "#1 ranking on category-defining terms",
      "4.9★ Google Business profile (review velocity)",
    ],
    quote: "Six months in, organic was our #1 channel — and our cheapest.",
  },
  {
    id: "ppc",
    title: "PPC & Paid Media",
    tag: "ROI-first acquisition",
    band: [2500, 7500],
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
      "5.6× ROAS for JBT's cross-channel program",
      "+74% new customers, −18% blended CAC",
      "Sub-30-day payback on Meta cohorts",
    ],
    quote: "They cut our CAC by a third and doubled our new-customer rate. Same budget.",
  },
  {
    id: "web",
    title: "Web Design & Development",
    tag: "Conversion-first builds",
    band: [3000, 10000],
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
      "Twinings: re-platformed loyalty in 6 weeks",
      "+42% repeat purchase, 2.1× email CTR",
      "Lighthouse 95+ across the board",
    ],
    quote: "Looks great, ships fast, converts. Not three different agencies — one.",
  },
  {
    id: "content",
    title: "Content & Email",
    tag: "Nurture demand",
    band: [1500, 4500],
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
      "Liberty IT: 3.4× MQL volume from email",
      "+58% pipeline contribution",
      "Sub-2% unsubscribe rate at scale",
    ],
    quote: "Our newsletter is now the #1 source of qualified pipeline.",
  },
  {
    id: "brand",
    title: "Brand & Creative",
    tag: "Recognition + conversion",
    band: [2000, 6000],
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
      "30%+ recall lift across category",
      "Refreshed brand → +40% inbound interest",
      "Featured in DesignSpotlight, Brand New",
    ],
    quote: "It finally feels like one brand — not eight Slack threads of creative.",
  },
  {
    id: "strategy",
    title: "Growth Strategy",
    tag: "Aligned execution",
    band: [3000, 8000],
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
      "Repositioning → 2× win rate in 90 days",
      "Channel reallocation: 40% efficiency gain",
      "Executed within 60 days of kickoff",
    ],
    quote: "They run our growth team. We just unblock them.",
  },
];

export const findServiceById = (id: string) =>
  SERVICE_CATALOG.find((s) => s.id === id);
