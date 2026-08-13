import type { Metadata } from "next";
import { config } from "../../content/config";

import { GrainOverlay } from "../../components/global/GrainOverlay";
import { CustomCursor } from "../../components/global/CustomCursor";
import { MagneticButtons } from "../../components/global/MagneticButtons";

import { ServicesMasthead } from "../../components/services/ServicesMasthead";
import { DeliveryModel } from "../../components/services/DeliveryModel";
import { ServiceIndex } from "../../components/services/ServiceIndex";
import { EngagementModels } from "../../components/services/EngagementModels";
import { ServicesFaq } from "../../components/services/ServicesFaq";
import { SERVICES_FAQ } from "../../content/services-faq";
import { ServicesCta } from "../../components/services/ServicesCta";

// Mounted so the service panels can open the existing deep-dive modal and the
// pricing section can open the quote/wizard — these live on the homepage too.
import { ConfigureWizard } from "../../components/modals/ConfigureWizard";
import { QuickQuote } from "../../components/modals/QuickQuote";
import { ServiceDeepDive } from "../../components/modals/ServiceDeepDive";

const ORIGIN = config.getCanonicalUrl().replace(/\/$/, "");
const SERVICES_URL = `${ORIGIN}/services`;

export const metadata: Metadata = {
  title: "Growth Marketing Services in Canada | MapleGrowth Digital",
  description:
    "SEO, PPC, web design, content, brand, and growth strategy for Canadian businesses — one accountable team with specialist partners. Book a free strategy call.",
  alternates: { canonical: SERVICES_URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Growth Marketing Services — MapleGrowth Digital",
    description:
      "Eight services, one accountable team. SEO, PPC, web, content, brand, and growth strategy for Canadian businesses.",
    url: SERVICES_URL,
    type: "website",
  },
};

// The eight Service nodes already exist in the site-wide @graph injected by
// app/layout.tsx. Reference them by @id here instead of redefining them —
// duplicate nodes with conflicting properties are how structured data rots.
const SERVICE_IDS = [
  "service-seo-analytics",
  "service-ppc-paid-media",
  "service-web-design-development",
  "service-content-email",
  "service-brand-creative",
  "service-growth-strategy",
  "service-mobile-app",
  "service-ecommerce",
];

const servicesJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      "@id": `${SERVICES_URL}#page`,
      url: SERVICES_URL,
      name: "Growth Marketing Services",
      description:
        "SEO, PPC, web design, content, brand, and growth strategy for Canadian businesses, delivered by one accountable team with specialist partners.",
      inLanguage: "en-CA",
      isPartOf: { "@id": `${ORIGIN}/#website` },
      about: { "@id": `${ORIGIN}/#organization` },
      breadcrumb: { "@id": `${SERVICES_URL}#breadcrumb` },
      mainEntity: { "@id": `${SERVICES_URL}#list` },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${SERVICES_URL}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${ORIGIN}/` },
        {
          "@type": "ListItem",
          position: 2,
          name: "Services",
          item: SERVICES_URL,
        },
      ],
    },
    {
      "@type": "ItemList",
      "@id": `${SERVICES_URL}#list`,
      name: "Growth marketing services",
      numberOfItems: SERVICE_IDS.length,
      itemListElement: SERVICE_IDS.map((id, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: { "@id": `${ORIGIN}/#${id}` },
      })),
    },
    {
      // Built from the same array the page renders (components/services/
      // ServicesFaq.tsx), so the visible copy and the structured data cannot
      // drift apart.
      "@type": "FAQPage",
      "@id": `${SERVICES_URL}#faq`,
      mainEntity: SERVICES_FAQ.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    },
  ],
};

export default function ServicesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesJsonLd) }}
      />

      <GrainOverlay />
      <CustomCursor />
      <MagneticButtons />

      <div className="services-page">
        <ServicesMasthead />
        <DeliveryModel />
        <ServiceIndex />
        <EngagementModels />
        <ServicesFaq />
        <ServicesCta />
      </div>

      <ConfigureWizard />
      <QuickQuote />
      <ServiceDeepDive />
    </>
  );
}
