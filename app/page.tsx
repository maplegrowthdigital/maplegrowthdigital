import { createAnonServerClient } from "../utils/supabase/server";
import { site as fallback } from "../content/site";
import { Hero } from "../components/Hero";
import { Marquee } from "../components/Marquee";
import { Services } from "../components/Services";
import { Clients } from "../components/Clients";
import { Process } from "../components/Process";
import { Belief } from "../components/Belief";
import { CaseStudies } from "../components/CaseStudies";
import { About } from "../components/About";
import { BookCall } from "../components/BookCall";
import { Contact } from "../components/Contact";
import { site } from "../content/site";
import { getSectionVisibility, isSectionVisible } from "../lib/visibility";
import Script from "next/script";

export default async function Page() {
  let hero = fallback.hero;
  let marquee: string[] = Array.from(fallback.marquee);
  let services = fallback.services;
  let processContent = fallback.process;
  let aboutContent = fallback.about;
  let bookContent = fallback.book;
  let contactContent = fallback.contact;
  let caseStudiesContent = fallback.caseStudies;
  let clientsHeading = fallback.clients;
  let clientsLogos: { src: string; alt: string }[] = Array.from(
    fallback.clientLogos
  );
  let beliefs: { title: string; quote: string }[] = Array.from(
    fallback.beliefs
  );
  let schemaJson: any = null;

  // Get section visibility settings
  const sectionVisibility = await getSectionVisibility();

  try {
    const supabase = createAnonServerClient();
    const { data, error } = await supabase.from("sections").select("id, data");
    if (!error && Array.isArray(data)) {
      const map = new Map<string, any>(
        data.map((row: any) => [row.id, row.data])
      );
      const v = (k: string) => map.get(k);

      const h = v("hero");
      if (h && typeof h === "object") hero = { ...hero, ...h };

      const sc = v("schema");
      if (sc && typeof sc === "object") schemaJson = sc;

      const cl = v("clients");
      if (cl && typeof cl === "object")
        clientsHeading = { ...clientsHeading, ...cl };

      const logos = v("clientLogos");
      if (Array.isArray(logos))
        clientsLogos = logos as { src: string; alt: string }[];

      const bel = v("beliefs");
      if (Array.isArray(bel) && bel.length > 0)
        beliefs = bel as { title: string; quote: string }[];

      const cs = v("caseStudies");
      if (cs && typeof cs === "object") {
        caseStudiesContent = {
          ...caseStudiesContent,
          ...cs,
        } as typeof caseStudiesContent;
        if (!Array.isArray((caseStudiesContent as any).items))
          (caseStudiesContent as any).items = fallback.caseStudies.items;
      }

      const bk = v("book");
      if (bk && typeof bk === "object") bookContent = { ...bookContent, ...bk };

      const ct = v("contact");
      if (ct && typeof ct === "object")
        contactContent = { ...contactContent, ...ct };

      const sv = v("services");
      if (sv && typeof sv === "object") services = { ...services, ...sv };

      const pr = v("process");
      if (pr && typeof pr === "object")
        processContent = { ...processContent, ...pr };

      const ab = v("about");
      if (ab && typeof ab === "object")
        aboutContent = { ...aboutContent, ...ab };

      const mq = v("marquee");
      if (Array.isArray(mq) && mq.length > 0) marquee = mq as string[];
    }
  } catch {}
  return (
    <>
      {schemaJson && (
        <Script
          id="jsonld-schema"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJson) }}
        />
      )}

      {/* Hero is always visible (required section) */}
      <Hero hero={hero} />

      {/* Conditionally render sections based on visibility settings */}
      {isSectionVisible("marquee", sectionVisibility) && (
        <Marquee marquee={marquee} />
      )}

      {isSectionVisible("services", sectionVisibility) && (
        <Services services={services} />
      )}

      {isSectionVisible("clients", sectionVisibility) && (
        <Clients clients={clientsHeading} clientLogos={clientsLogos} />
      )}

      {isSectionVisible("process", sectionVisibility) && (
        <Process process={processContent} />
      )}

      {isSectionVisible("beliefs", sectionVisibility) && beliefs[0] && (
        <Belief
          title={(beliefs[0] ?? fallback.beliefs[0]).title}
          quote={(beliefs[0] ?? fallback.beliefs[0]).quote}
        />
      )}

      {isSectionVisible("caseStudies", sectionVisibility) && (
        <CaseStudies caseStudies={caseStudiesContent} />
      )}

      {isSectionVisible("about", sectionVisibility) && (
        <About about={aboutContent} />
      )}

      {isSectionVisible("beliefs", sectionVisibility) && beliefs[1] && (
        <Belief
          title={
            (
              beliefs[1] ??
              beliefs[0] ??
              fallback.beliefs[1] ??
              fallback.beliefs[0]
            ).title
          }
          quote={
            (
              beliefs[1] ??
              beliefs[0] ??
              fallback.beliefs[1] ??
              fallback.beliefs[0]
            ).quote
          }
        />
      )}

      {isSectionVisible("book", sectionVisibility) && (
        <BookCall book={bookContent} />
      )}

      {/* Contact is always visible (required section) */}
      <Contact contact={contactContent} />
    </>
  );
}
