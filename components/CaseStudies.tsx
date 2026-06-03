"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);
}

interface CaseStudyItem {
  slug: string;
  title: string;
  category: string;
  image: string;
  summary: string;
  results: string[]; // already formatted like "+42% Repeat purchase"
  /** Optional — when present, renders a "Read case study" link.
   *  Single-page mode: leave undefined to suppress the click-through. */
  link?: string;
  linkLabel?: string;
}

interface CaseStudiesData {
  title?: string;
  intro?: string;
  items?: CaseStudyItem[];
}

export function CaseStudies({
  caseStudies,
}: {
  caseStudies?: CaseStudiesData;
}) {
  const ref = useRef<HTMLElement>(null);
  const items: CaseStudyItem[] = caseStudies?.items ?? [];

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      // Section title split-text
      const titleEl = ref.current?.querySelector<HTMLElement>(
        ".section-title[data-split]"
      );
      if (titleEl && !prefersReduced) {
        const split = new SplitText(titleEl, {
          type: "lines,words",
          linesClass: "split-line",
        });
        gsap.set(split.words, { yPercent: 110, opacity: 0 });
        ScrollTrigger.create({
          trigger: titleEl,
          start: "top 82%",
          once: true,
          onEnter: () => {
            gsap.to(split.words, {
              yPercent: 0,
              opacity: 1,
              duration: 1.0,
              stagger: 0.03,
              ease: "expo.out",
            });
          },
        });
      }

      // Reveal-up label
      const reveals = ref.current?.querySelectorAll<HTMLElement>(
        '[data-reveal="up"]'
      );
      if (reveals) {
        gsap.set(reveals, { opacity: 0, y: 28 });
        if (!prefersReduced) {
          reveals.forEach((el) => {
            ScrollTrigger.create({
              trigger: el,
              start: "top 88%",
              once: true,
              onEnter: () => {
                gsap.to(el, {
                  opacity: 1,
                  y: 0,
                  duration: 0.9,
                  delay: parseFloat(el.dataset.revealDelay || "0"),
                  ease: "expo.out",
                });
              },
            });
          });
        } else {
          gsap.set(reveals, { opacity: 1, y: 0 });
        }
      }

      // Case cards — opacity-only entrance (y would fight position: sticky)
      const cards = ref.current?.querySelectorAll<HTMLElement>("[data-case]");
      if (cards && !prefersReduced) {
        cards.forEach((el) => {
          gsap.from(el, {
            opacity: 0,
            duration: 0.7,
            ease: "expo.out",
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
          });
        });
      }

      // Subtle media parallax on each case placeholder
      const placeholders = ref.current?.querySelectorAll<HTMLElement>(
        ".case__placeholder"
      );
      if (placeholders && !prefersReduced) {
        placeholders.forEach((el) => {
          gsap.to(el, {
            yPercent: -8,
            ease: "none",
            scrollTrigger: {
              trigger: el.closest(".case"),
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          });
        });
      }
    },
    { scope: ref }
  );

  // Map dynamic case studies to placeholder colors (rose, ink, amber, forest)
  const colorCycle = ["rose", "ink", "amber", "forest"];

  return (
    <section ref={ref} className="work" id="work" aria-label="Selected work">
      <div className="section-head">
        <div className="section-label" data-reveal="up">
          <span className="dot" />
          <span>Selected work</span>
        </div>
        <h2 className="section-title" data-split>
          {caseStudies?.title ? (
            caseStudies.title
          ) : (
            <>
              Real results from&nbsp;<em>real</em> clients.
            </>
          )}
        </h2>
      </div>

      <div className="work__stack" data-work-stack>
        {items.map((item, i) => (
          <article
            key={item.slug}
            className="case"
            data-case
            style={{ ["--stack-i" as keyof React.CSSProperties]: i } as React.CSSProperties}
          >
            <div className="case__media">
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 880px) 100vw, 50vw"
                  style={{ objectFit: "cover" }}
                />
              ) : (
                <div
                  className="case__placeholder"
                  data-color={colorCycle[i % colorCycle.length]}
                />
              )}
              <span className="case__tag">{item.category}</span>
            </div>
            <div className="case__body">
              <h3 className="case__title">{item.title}</h3>
              <p className="case__summary">{item.summary}</p>
              <ul className="case__metrics">
                {item.results.slice(0, 3).map((r, j) => {
                  // Split "value metric" into bold + label
                  const m = r.match(/^(\S+)\s+(.+)$/);
                  return (
                    <li key={j}>
                      <strong>{m ? m[1] : r}</strong>
                      <span>{m ? m[2] : ""}</span>
                    </li>
                  );
                })}
              </ul>
              {item.link ? (
                <Link href={item.link} className="case__link">
                  {item.linkLabel || "Read case study"}{" "}
                  <span aria-hidden="true">→</span>
                </Link>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
