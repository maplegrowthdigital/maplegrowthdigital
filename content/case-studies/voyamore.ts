import { CaseStudy } from "../case-studies";

export const caseStudy: CaseStudy = {
  slug: "voyamore-travel-deals",
  title: "Voyamore — Canadian Travel Deal Aggregator",
  category: "Travel / Web Development",
  client: {
    name: "Voyamore",
    industry: "Travel & Tourism",
    location: "Canada",
    size: "Founder-led travel platform",
  },
  summary:
    "We built a custom, lightweight WordPress platform for a Canadian-focused travel deal aggregator — including a proprietary plugin that replaced bloated third-party dependencies and consistently scores 90+ on technical SEO.",
  image: "/case/voyamore-hero.png",
  date: "2026-05-01",
  duration: "Ongoing",
  services: [
    "Web Design & Development",
    "Custom WordPress Plugin Development",
    "Technical SEO",
    "Site Architecture",
  ],
  challenge:
    "Voyamore needed a fast, scalable platform to curate and share time-sensitive travel deals for Canadian travelers — specifically targeting departures from eight major Canadian cities. Off-the-shelf WordPress themes and plugin-heavy stacks introduced bloat, slowed page loads, and hurt SEO. The platform also needed complex filtering logic for browsing deals by departure hub, deal type (flights, packages, cruises), and destination, without sacrificing performance.",
  solution:
    "We built Voyamore on Oxygen Builder for a lightweight, bloat-free frontend, then engineered a proprietary plugin — 'Voyamore Core' — to handle every dynamic part of the site: custom post types, custom fields, taxonomies, and advanced filtering logic. This eliminated reliance on Advanced Custom Fields (ACF) and other heavy third-party plugins, keeping the codebase lean and the database queries fast. Every deal and blog post is published through this custom architecture, with structured metadata that consistently scores 90+ on technical SEO audits.",
  results: [
    {
      metric: "Technical SEO Score",
      value: "90+",
      description:
        "Every deal and blog post consistently scores 90+ on Lighthouse SEO audits thanks to the lean, custom-built architecture and structured metadata.",
    },
    {
      metric: "Canadian Departure Hubs",
      value: "8 cities",
      description:
        "Custom hub-based browsing supports Toronto, Montreal, Vancouver, Calgary, Quebec City, Ottawa, Edmonton, and Halifax with fast, filtered deal listings.",
    },
    {
      metric: "Third-Party CMS Plugins Removed",
      value: "Zero dependencies",
      description:
        "Voyamore Core replaces ACF, custom field plugins, and CPT generators with a single proprietary plugin — reducing maintenance overhead, security surface area, and load time.",
    },
  ],
  content: {
    overview:
      "A custom-built travel deal aggregator for the Canadian market. Voyamore curates and shares discounted flights, vacation packages, and cruises through a free, ad-supported model with a real-time email alert system. MapleGrowth Digital designed and developed the entire platform, including a proprietary WordPress plugin that powers all dynamic content and filtering.",
    approach: [
      "Used Oxygen Builder for a lightweight, bloat-free frontend instead of a commercial WordPress theme",
      "Built 'Voyamore Core' — a custom WordPress plugin handling custom post types, fields, taxonomies, and query logic",
      "Eliminated ACF and similar third-party dependencies to reduce plugin bloat and improve performance",
      "Designed hub-based browsing (filter deals by departure city) and category filters (flights, packages, cruises)",
      "Structured metadata and clean markup to consistently hit 90+ Lighthouse SEO scores",
      "Integrated email subscription system to push real-time deal alerts to subscribers",
    ],
    timeline: [
      {
        phase: "Discovery & Architecture",
        duration: "Phase 1",
        activities: [
          "Defined deal-aggregation requirements and Canadian-market focus",
          "Mapped out custom post types, taxonomies, and filtering logic",
          "Chose Oxygen Builder + custom plugin architecture over off-the-shelf themes",
          "Drafted technical SEO requirements and structured-data schema",
        ],
      },
      {
        phase: "Voyamore Core Plugin",
        duration: "Phase 2",
        activities: [
          "Built custom post types for deals, destinations, and blog content",
          "Implemented native custom field creator (ACF replacement)",
          "Developed advanced filter queries for hub and category browsing",
          "Wrote structured metadata generators for every content type",
        ],
      },
      {
        phase: "Frontend Build",
        duration: "Phase 3",
        activities: [
          "Designed and built the public site in Oxygen Builder",
          "Wired Voyamore Core's filtering UI into deal listings",
          "Implemented the 'Explore Destinations' blog and city-guide templates",
          "Optimized page-load performance and core web vitals",
        ],
      },
      {
        phase: "Launch & Growth",
        duration: "Phase 4",
        activities: [
          "Launched the platform with deal feeds across all 8 Canadian hubs",
          "Set up the email alert subscription pipeline",
          "Established social distribution across Instagram, TikTok, YouTube, Pinterest, Facebook",
          "Ongoing iteration on filter UX and SEO performance",
        ],
      },
    ],
    keyLearnings: [
      "A custom-built CMS layer outperforms plugin-heavy WordPress stacks for niche, query-heavy use cases like deal aggregation",
      "Eliminating ACF and similar third-party plugins paid off in both performance and long-term maintainability",
      "Oxygen Builder gave the design team full creative control without injecting the DOM bloat typical of page builders",
      "Time-sensitive content (flash deals) requires both real-time email delivery and tight SEO so deals are discoverable while still live",
    ],
    nextSteps: [
      "Premium subscription tier for early-access deal alerts",
      "Expanded affiliate partner integrations for deeper monetization",
      "Mobile app companion with push notifications for flash deals",
      "Multi-language support for French-Canadian travelers",
    ],
  },
  seo: {
    title:
      "Voyamore Travel Platform Case Study — MapleGrowth Digital | Custom WordPress Build",
    description:
      "How MapleGrowth Digital built Voyamore, a Canadian travel deal aggregator, with a lightweight Oxygen Builder + custom WordPress plugin stack that consistently scores 90+ on technical SEO.",
    keywords: [
      "travel platform case study",
      "custom WordPress development",
      "Oxygen Builder case study",
      "Canadian travel website",
      "WordPress plugin development",
      "technical SEO case study",
      "travel deal aggregator",
    ],
    canonical:
      "https://www.maplegrowthdigital.ca/case-studies/voyamore-travel-deals",
  },
};
