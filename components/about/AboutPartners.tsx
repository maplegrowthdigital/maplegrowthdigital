"use client";

import { useEffect, useRef, useState } from "react";
import { useAboutReveals } from "./useAboutReveals";

interface Partner {
  name: string;
  role: string;
  detail: string;
}

// NOTE: Growmintech's role is confirmed (engineering partner for the app +
// e-commerce services). The other two descriptors are best-guess placeholders
// — confirm/adjust before treating them as final copy.
const PARTNERS: Partner[] = [
  {
    name: "Growmintech",
    role: "Engineering partner",
    detail:
      "Our build partner for mobile apps and e-commerce — from product scoping through App Store launch and post-launch iteration.",
  },
  {
    name: "Blue Vineyard",
    role: "Web & WordPress studio",
    detail:
      "Design and web-build collaborators for content-driven sites and bespoke WordPress work.",
  },
  {
    name: "Dark Blue Tech",
    role: "Product & technology",
    detail:
      "Specialist technology support we bring in for heavier product and platform engineering.",
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

  useAboutReveals(ref);

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
            We keep the core team small and senior. When a project needs deep
            engineering or a specialist skill set, we bring in partners we
            trust &mdash; and stay accountable for the outcome, end to end.
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
