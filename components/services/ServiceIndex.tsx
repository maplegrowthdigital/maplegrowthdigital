"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useSectionReveals } from "../shared/useSectionReveals";
import { useModal } from "../global/ModalProvider";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger);
}

interface HubService {
  /** Must match an id in lib/services.ts so the deep-dive modal resolves. */
  id: string;
  title: string;
  /** Who actually builds it — shown verbatim, so keep it true. */
  delivery: string;
  /** Hub-specific positioning. Deliberately NOT the catalogue `lead`, which
   *  is already published in the deep-dive modal — avoids duplicate content. */
  positioning: string;
}

const SERVICES: HubService[] = [
  {
    id: "seo",
    title: "SEO & Analytics",
    delivery: "In-house",
    positioning:
      "Visibility that compounds. Technical foundations, content aimed at questions buyers actually type, and GA4 reporting you can act on — not a rankings screenshot.",
  },
  {
    id: "ppc",
    title: "PPC & Paid Media",
    delivery: "In-house",
    positioning:
      "Acquisition you can switch on. Search, Performance Max, YouTube and social, structured so every dollar traces to a result — and gets paused the moment it doesn't.",
  },
  {
    id: "web",
    title: "Web Design & Development",
    delivery: "In-house, with partner engineering",
    positioning:
      "Sites built to convert and to survive contact with reality: fast, accessible, maintainable. We design and build in-house, with partner engineers when scope demands it.",
  },
  {
    id: "content",
    title: "Content & Email",
    delivery: "In-house",
    positioning:
      "The long game. Editorial mapped to what buyers search for, plus lifecycle email that nurtures without wearing out its welcome.",
  },
  {
    id: "brand",
    title: "Brand & Creative",
    delivery: "In-house",
    positioning:
      "Identity that holds up everywhere it lands — web, social, ads, decks. Built as a system and documented, so it stays consistent after we hand it over.",
  },
  {
    id: "strategy",
    title: "Growth Strategy",
    delivery: "In-house",
    positioning:
      "For when the problem isn't execution, it's direction. Positioning, channel mix, and a KPI framework you can act on Monday.",
  },
  {
    id: "mobile-app",
    title: "Mobile App Development",
    delivery: "With our partner Growmintech",
    positioning:
      "Native and cross-platform apps from product definition through store launch. We scope and run it; Growmintech builds it.",
  },
  {
    id: "ecommerce",
    title: "E-Commerce Development",
    delivery: "With our partner Growmintech",
    positioning:
      "Shopify and headless storefronts built to sell. Catalogue, payments, and checkout tuned around conversion rather than decoration.",
  },
];

/**
 * ServiceIndex — sticky index on the left, detail panels on the right.
 *
 * The index scroll-spies the panels (active item highlights as you scroll) and
 * doubles as in-page navigation, which a hub with eight entries needs. Full
 * detail opens the existing ServiceDeepDive modal rather than repeating its
 * content inline.
 *
 * Only a discrete active index lives in React state — ScrollTrigger drives the
 * updates, so there's no per-frame re-rendering.
 */
export function ServiceIndex() {
  const ref = useRef<HTMLElement>(null);
  const panelsRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const { open } = useModal();

  useSectionReveals(ref);

  useGSAP(
    () => {
      const panels =
        panelsRef.current?.querySelectorAll<HTMLElement>("[data-svc-panel]");
      if (!panels) return;

      panels.forEach((el, i) => {
        ScrollTrigger.create({
          trigger: el,
          start: "top 55%",
          end: "bottom 55%",
          onToggle: (self) => {
            if (self.isActive) setActive(i);
          },
        });
      });
    },
    { scope: ref }
  );

  const jumpTo = (i: number) => {
    const el = panelsRef.current?.querySelector<HTMLElement>(
      `[data-svc-panel="${i}"]`
    );
    if (!el) return;
    const lenis = (window as unknown as { __lenis?: { scrollTo: Function } })
      .__lenis;
    if (lenis) lenis.scrollTo(el, { offset: -120, duration: 1.0 });
    else el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section
      ref={ref}
      className="svc-index"
      id="services"
      aria-label="What we do"
    >
      <div className="svc-index__inner">
        <nav className="svc-index__nav" aria-label="Services index">
          <span className="section-label" data-reveal="up">
            <span className="dot" />
            <span>What we do</span>
          </span>
          <ol className="svc-index__list">
            {SERVICES.map((s, i) => (
              <li key={s.id}>
                <button
                  type="button"
                  className={`svc-index__link${
                    i === active ? " is-active" : ""
                  }`}
                  onClick={() => jumpTo(i)}
                  aria-current={i === active ? "true" : undefined}
                >
                  <span className="svc-index__num">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{s.title}</span>
                </button>
              </li>
            ))}
          </ol>
        </nav>

        <div className="svc-index__panels" ref={panelsRef}>
          {SERVICES.map((s, i) => (
            <article
              className="svc-panel"
              key={s.id}
              data-svc-panel={i}
              id={`service-${s.id}`}
            >
              <span className="svc-panel__num" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h2 className="svc-panel__title">{s.title}</h2>
              <p className="svc-panel__delivery">
                <span className="svc-panel__dot" aria-hidden="true" />
                {s.delivery}
              </p>
              <p className="svc-panel__body">{s.positioning}</p>
              <button
                type="button"
                className="btn btn--link svc-panel__more"
                onClick={() =>
                  open("service", { payload: { serviceId: s.id } })
                }
              >
                <span>Deliverables &amp; detail</span>
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
