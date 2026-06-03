"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);
}

interface AboutItem {
  strong: string;
  text: string;
}

const DEFAULT_ITEMS: AboutItem[] = [
  {
    strong: "Direct collaboration",
    text: "with designers, developers, and strategists.",
  },
  {
    strong: "Transparent pricing",
    text: "and clear timelines from the start.",
  },
  {
    strong: "Remote-first",
    text: ", with support available across Canada.",
  },
  {
    strong: "Outcome-driven",
    text: "reporting, not vanity dashboards.",
  },
];

export function About({ about }: { about?: { title?: string; body?: string } }) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

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

      // Reveal-up label + lead + each list item
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
    },
    { scope: ref }
  );

  return (
    <section ref={ref} className="about" id="about" aria-label="About">
      <div className="about__inner">
        <div className="section-label" data-reveal="up">
          <span className="dot" />
          <span>About</span>
        </div>
        <h2 className="section-title" data-split>
          {about?.title ? (
            about.title
          ) : (
            <>
              One focused team.<br />
              <em>No</em> handovers.
            </>
          )}
        </h2>
        <p className="about__lead" data-reveal="up" data-reveal-delay="0.2">
          {about?.body ??
            "Strategy, creative, and engineering working in the same room — so your roadmap doesn't get diluted on its way to launch."}
        </p>
        <ul className="about__list">
          {DEFAULT_ITEMS.map((item, i) => (
            <li
              key={i}
              data-reveal="up"
              data-reveal-delay={String(i * 0.1)}
            >
              <strong>{item.strong}</strong> {item.text}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
