import fallbackData from "../content/data.json";
import { Hero } from "../components/Hero";
import { Marquee } from "../components/Marquee";
import { Services } from "../components/Services";
import { Industries } from "../components/Industries";
import { Why } from "../components/Why";
import { Belief } from "../components/Belief";
import { Process } from "../components/Process";
import { CaseStudies } from "../components/CaseStudies";
import { About } from "../components/About";
// Insights renders real published posts only (see components/Insights.tsx);
// it stays hidden until at least three exist so the bento never looks thin.
import { Insights } from "../components/Insights";
import { getAllPosts } from "../lib/posts";
import { Pricing } from "../components/Pricing";
import { FAQ } from "../components/FAQ";
import { CTA } from "../components/CTA";
import { Newsletter } from "../components/Newsletter";
// Hiring — temporarily hidden pre-launch. Currently lists 3 placeholder
// roles that aren't actually open. Restore by wiring to real job listings
// (Ashby / Greenhouse / a careers JSON file).
// import { Hiring } from "../components/Hiring";
import { getAllCaseStudies } from "../content/case-studies";

// Homepage-only global effects
import { GrainOverlay } from "../components/global/GrainOverlay";
import { CustomCursor } from "../components/global/CustomCursor";
import { LeafCanvas } from "../components/global/LeafCanvas";
import { StickyBottomCta } from "../components/global/StickyBottomCta";
import { MagneticButtons } from "../components/global/MagneticButtons";

// Modals — mounted globally on the homepage so any section can open them
import { ConfigureWizard } from "../components/modals/ConfigureWizard";
import { QuickQuote } from "../components/modals/QuickQuote";
import { ServiceDeepDive } from "../components/modals/ServiceDeepDive";

export default function Page() {
  // Load content directly from JSON file
  const content = fallbackData as any;

  const hero = content.hero;
  const marquee: string[] = Array.from(
    content.marquee?.items || content.marquee || []
  );
  const services = content.services;
  const processContent = content.process;
  const aboutContent = content.about;
  const posts = getAllPosts();

  // Get dynamic case studies from TypeScript files.
  // Single-page mode: no per-study detail route, so we omit link/linkLabel —
  // CaseStudies will render the card without the "Read case study" CTA.
  // When detail pages come back, restore the link fields here.
  const allCaseStudies = getAllCaseStudies();
  const caseStudiesContent = {
    title: "Selected work",
    intro:
      "A closer look at what we build and how we approach it. More studies as current engagements wrap.",
    items: allCaseStudies.map((cs) => ({
      slug: cs.slug,
      title: cs.title,
      category: cs.category,
      image: cs.image,
      summary: cs.summary,
      results: cs.results.slice(0, 3).map((r) => `${r.value} ${r.metric}`),
    })),
  };
  const beliefs: { title: string; quote: string }[] = Array.from(
    content.beliefs?.items || content.beliefs || []
  );

  return (
    <>
      {/* Homepage-only global effects */}
      <GrainOverlay />
      <CustomCursor />
      <LeafCanvas />
      <StickyBottomCta />
      <MagneticButtons />

      <Hero hero={hero} />
      <Marquee marquee={marquee} />
      <Services services={services} />
      <Industries />
      <Why />
      {beliefs[0] && (
        <Belief title={beliefs[0].title} quote={beliefs[0].quote} />
      )}
      <Process process={processContent} />
      <CaseStudies caseStudies={caseStudiesContent} />
      <About about={aboutContent} />
      {posts.length >= 3 && <Insights posts={posts.slice(0, 4)} />}
      <Pricing />
      <FAQ />
      <CTA />
      <Newsletter />
      {/* <Hiring />  — hidden pre-launch (see import comment above) */}

      {/* Modals — always mounted, opened on demand via ModalProvider */}
      <ConfigureWizard />
      <QuickQuote />
      <ServiceDeepDive />
    </>
  );
}
