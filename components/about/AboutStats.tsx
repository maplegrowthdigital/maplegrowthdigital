"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useAboutReveals } from "./useAboutReveals";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger);
}

interface Stat {
  target: number;
  prefix?: string;
  suffix?: string;
  label: string;
}

// These are public claims on a commercial page — every figure must be one we
// could evidence if a prospect asked. "It appears elsewhere on the site" is
// NOT sufficient justification; verify the underlying fact before adding one.
const STATS: Stat[] = [
  { target: 10, suffix: "+", label: "Years in web & digital marketing" },
  { target: 3, suffix: "", label: "Specialist partners we deliver with" },
  { target: 2014, suffix: "", label: "Building for clients since" },
  { target: 100, suffix: "%", label: "Proudly Canadian-based" },
];

export function AboutStats() {
  const ref = useRef<HTMLElement>(null);

  useAboutReveals(ref);

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      const numEls = ref.current?.querySelectorAll<HTMLElement>(
        "[data-countup]"
      );
      if (!numEls) return;

      numEls.forEach((el) => {
        const target = parseFloat(el.dataset.countup || "0");
        const prefix = el.dataset.prefix || "";
        const suffix = el.dataset.suffix || "";
        const render = (v: number) =>
          `${prefix}${Math.round(v)}${suffix}`;

        if (prefersReduced) {
          el.textContent = render(target);
          return;
        }

        el.textContent = render(0);
        const counter = { v: 0 };
        ScrollTrigger.create({
          trigger: el,
          start: "top 88%",
          once: true,
          onEnter: () => {
            gsap.to(counter, {
              v: target,
              duration: 1.6,
              ease: "power2.out",
              onUpdate: () => {
                el.textContent = render(counter.v);
              },
            });
          },
        });
      });
    },
    { scope: ref }
  );

  return (
    <section ref={ref} className="about-stats" aria-label="MapleGrowth by the numbers">
      <div className="about-stats__inner">
        <div className="section-label" data-reveal="up">
          <span className="dot" />
          <span>By the numbers</span>
        </div>
        <ul className="about-stats__grid" role="list">
          {STATS.map((s, i) => (
            <li
              className="about-stat"
              key={s.label}
              data-reveal="up"
              data-reveal-delay={String(i * 0.08)}
            >
              <span
                className="about-stat__value"
                data-countup={s.target}
                data-prefix={s.prefix || ""}
                data-suffix={s.suffix || ""}
                aria-hidden="true"
              >
                {(s.prefix || "") + s.target + (s.suffix || "")}
              </span>
              {/* Screen-reader-friendly, non-animated value */}
              <span className="sr-only">
                {(s.prefix || "") + s.target + (s.suffix || "")}
              </span>
              <span className="about-stat__label">{s.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
