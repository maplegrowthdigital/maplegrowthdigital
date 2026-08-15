"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useSectionReveals } from "../shared/useSectionReveals";

interface Partner {
  name: string;
  role: string;
  detail: string;
}

// Descriptions are drawn from each partner's own site (2026-08). If a partner
// repositions, re-check the source before editing — these are claims about
// other companies, so they should stay accurate rather than aspirational.
const PARTNERS: Partner[] = [
  {
    name: "Growmintech",
    role: "Apps & e-commerce",
    detail:
      "Custom mobile and e-commerce engineering in Next.js, TypeScript, and React Native — hand-built rather than assembled from page builders, with clients keeping full ownership of the code. Growmintech was founded by Tom Boban, one of our co-founders, which is why the two teams work as one rather than as vendor and client.",
  },
  {
    name: "Blue Vineyard",
    role: "Software & platforms",
    detail:
      "A technology partner for mission-driven organizations, building custom software, digital platforms, and websites under the banner “Tech for shared purpose” — 150+ clients and 40,000+ users across 12 countries.",
  },
  {
    name: "Dark Blue Tech",
    role: "Managed IT & security",
    detail:
      "A Michigan-based managed IT provider running helpdesk, cloud migration, and cybersecurity — endpoint protection, email security, and compliance — for when a client needs the infrastructure side covered too.",
  },
];

/**
 * AboutPartners — an interactive index of the extended team. Hovering (or
 * tapping) a row expands its detail and dims the rest; big Fraunces names,
 * no card boxes. Discrete active-index state only — no per-frame work.
 */
export function AboutPartners() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const isTouchRef = useRef(false);

  useSectionReveals(ref);

  useEffect(() => {
    isTouchRef.current = window.matchMedia("(hover: none)").matches;
  }, []);

  return (
    <section ref={ref} className="about-partners" aria-label="Partners and collaborators">
      <div className="about-partners__inner">
        <div className="about-partners__head">
          <div className="section-label" data-reveal="up">
            <span className="dot" />
            <span>The extended team</span>
          </div>
          <h2 className="about-partners__title" data-split>
            Specialists we <em>build</em> with.
          </h2>
          <p
            className="about-partners__note"
            data-reveal="up"
            data-reveal-delay="0.2"
          >
            We keep the core team small and experienced. When a project needs
            deep engineering or a specialist skill set, we bring in partners we
            trust &mdash; and stay accountable for the outcome, end to end. See{" "}
            <Link href="/services">which services we deliver in-house</Link>{" "}
            and which we build with partners.
          </p>
        </div>

        <ul className="about-partners__list" role="list">
          {PARTNERS.map((p, i) => (
            <li
              className={`about-partner${i === active ? " is-active" : ""}`}
              key={p.name}
              data-reveal="up"
              data-reveal-delay={String(i * 0.08)}
              onClick={() => setActive(i)}
              onMouseEnter={() => {
                if (!isTouchRef.current) setActive(i);
              }}
            >
              <div className="about-partner__row">
                <h3 className="about-partner__name">{p.name}</h3>
                <span className="about-partner__role">{p.role}</span>
              </div>
              <div className="about-partner__reveal">
                <p className="about-partner__detail">{p.detail}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
