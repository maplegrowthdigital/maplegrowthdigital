"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useAboutReveals } from "./useAboutReveals";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger);
}

interface Tenet {
  k: string;
  strong: string;
  body: string;
}

const TENETS: Tenet[] = [
  {
    k: "01",
    strong: "Clicks aren’t the point.",
    body:
      "We optimize for outcomes that show up on your P&L — pipeline, revenue, retention — not vanity dashboards that look good in a screenshot. If we can’t tie the work to a number that matters to you, we shouldn’t be doing it.",
  },
  {
    k: "02",
    strong: "One team, no handovers.",
    body:
      "Strategy, design, and engineering sit in the same room, so your roadmap doesn’t get watered down on its way to launch. You meet the people doing the work in week one and talk to them directly for the duration.",
  },
  {
    k: "03",
    strong: "We earn the retainer every month.",
    body:
      "Engagements are month-to-month with a 30-day notice. We’d rather keep your business by moving numbers than by locking you into a contract — most clients stay 12+ months because the work compounds.",
  },
];

/**
 * AboutEthos — sticky editorial column on the left, scrolling tenets on
 * the right, with a vertical progress rail that fills as the section moves
 * through the viewport (scrubbed scaleY, so it stays glued to scroll).
 */
export function AboutEthos() {
  const ref = useRef<HTMLElement>(null);
  const railRef = useRef<HTMLSpanElement>(null);
  const listRef = useRef<HTMLOListElement>(null);

  useAboutReveals(ref);

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (prefersReduced || !railRef.current || !listRef.current) return;

      gsap.set(railRef.current, { scaleY: 0, transformOrigin: "top center" });
      gsap.to(railRef.current, {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: listRef.current,
          start: "top 70%",
          end: "bottom 65%",
          scrub: true,
        },
      });
    },
    { scope: ref }
  );

  return (
    <section ref={ref} className="about-ethos" aria-label="What drives us">
      <div className="about-ethos__inner">
        <div className="about-ethos__head">
          <div className="section-label" data-reveal="up">
            <span className="dot" />
            <span>What drives us</span>
          </div>
          <h2 className="about-ethos__title" data-split>
            Growth is a <em>discipline</em>, not a growth hack.
          </h2>
          <p
            className="about-ethos__note"
            data-reveal="up"
            data-reveal-delay="0.2"
          >
            The same three convictions have shaped every engagement since we
            started.
          </p>
        </div>

        <ol className="about-ethos__list" ref={listRef}>
          <span className="about-ethos__rail" aria-hidden="true">
            <span className="about-ethos__rail-fill" ref={railRef} />
          </span>
          {TENETS.map((t) => (
            <li
              className="about-ethos__item"
              key={t.k}
              data-reveal="up"
            >
              <span className="about-ethos__k" aria-hidden="true">
                {t.k}
              </span>
              <p className="about-ethos__body">
                <strong>{t.strong}</strong> {t.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
