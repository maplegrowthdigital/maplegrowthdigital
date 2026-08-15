import type { Metadata } from "next";
import { config } from "../../content/config";

// Signature global effects (same ones the homepage mounts) so the About
// route feels like part of the same site rather than a bare inner page.
import { GrainOverlay } from "../../components/global/GrainOverlay";
import { CustomCursor } from "../../components/global/CustomCursor";
import { MagneticButtons } from "../../components/global/MagneticButtons";

import { Marquee } from "../../components/Marquee";
import { AboutMasthead } from "../../components/about/AboutMasthead";
import { AboutStats } from "../../components/about/AboutStats";
import { AboutEthos } from "../../components/about/AboutEthos";
import { AboutPrinciples } from "../../components/about/AboutPrinciples";
import { AboutFounder } from "../../components/about/AboutFounder";
import { AboutPartners } from "../../components/about/AboutPartners";
import { AboutCta } from "../../components/about/AboutCta";

const ORIGIN = config.getCanonicalUrl().replace(/\/$/, "");
const ABOUT_URL = `${ORIGIN}/about`;

// Deliberately does NOT target "canadian growth marketing agency" — the
// homepage ranks 11.5 for that query while this page sat at 56.9, competing
// with it across six queries and winning none (GSC, 90 days to 2026-08-13).
// This page's job is E-E-A-T support and brand queries, so the title and H1
// lead with the brand and the story instead of the head term.
export const metadata: Metadata = {
  title: "About MapleGrowth Digital — Our Story, Team & Partners",
  description:
    "The story, team, and partner network behind MapleGrowth Digital — founded in 2014, based in Mississauga and working remotely across Canada.",
  alternates: { canonical: ABOUT_URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: "About MapleGrowth Digital — Our Story, Team & Partners",
    description:
      "Founded in 2014. An experienced, outcome-first team based in Mississauga and remote across Canada.",
    url: ABOUT_URL,
    type: "website",
  },
};

// Page-specific structured data. Complements the site-wide graph injected in
// app/layout.tsx — which is also where the three co-founder Person nodes live,
// since they belong to the organisation rather than to this one route.
const aboutJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "AboutPage",
      "@id": `${ABOUT_URL}#aboutpage`,
      url: ABOUT_URL,
      name: "About MapleGrowth Digital",
      description:
        "The story, principles, and team behind MapleGrowth Digital — a Canadian growth marketing agency founded in 2014.",
      inLanguage: "en-CA",
      isPartOf: { "@id": `${ORIGIN}/#website` },
      about: { "@id": `${ORIGIN}/#organization` },
      breadcrumb: { "@id": `${ABOUT_URL}#breadcrumb` },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${ABOUT_URL}#breadcrumb`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: `${ORIGIN}/`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "About",
          item: ABOUT_URL,
        },
      ],
    },
  ],
};

const ABOUT_MARQUEE = [
  "Strategy",
  "Creative",
  "Engineering",
  "SEO & Analytics",
  "Paid Media",
  "Web & E-commerce",
  "Content & Email",
  "Brand",
  "Growth Strategy",
];

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }}
      />

      {/* Homepage-parity ambient effects */}
      <GrainOverlay />
      <CustomCursor />
      <MagneticButtons />

      <div className="about-page">
        <AboutMasthead />
        <Marquee marquee={ABOUT_MARQUEE} />
        <AboutStats />
        <AboutEthos />
        <AboutPrinciples />
        <AboutFounder />
        <AboutPartners />
        <AboutCta />
      </div>
    </>
  );
}
