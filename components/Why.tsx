"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);
}

interface Panel {
  num: string;
  title: string;
  desc: string;
}

const PANELS: Panel[] = [
  {
    num: "01",
    title: "Experts do the work",
    desc:
      "Every account is run by people with 5+ years of hands-on experience — not juniors learning on your budget. You work directly with the strategists, designers, and engineers doing the work.",
  },
  {
    num: "02",
    title: "Outcomes over outputs",
    desc:
      "We tie our work to dashboards, not slide decks. Every sprint ends with a number that moved — or an honest read on why it didn't.",
  },
  {
    num: "03",
    title: "Transparent pricing",
    desc:
      "Clear scope, predictable invoices, no scope creep games. You'll know exactly what we're billing for before we start.",
  },
  {
    num: "04",
    title: "Embedded, not arm's length",
    desc:
      "We work like an extension of your team — in your Slack, your standups, your roadmap. Less ceremony, more compounding.",
  },
];

export function Why() {
  const ref = useRef<HTMLElement>(null);
  const panelsRef = useRef<HTMLUListElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const isTouchRef = useRef(false);

  // Initialize touch flag on mount
  useGSAP(
    () => {
      isTouchRef.current = window.matchMedia("(hover: none)").matches;
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      // Split-text on the section title
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

      // Reveal-up label / intro
      const reveals = ref.current?.querySelectorAll<HTMLElement>(
        '[data-reveal="up"]'
      );
      if (reveals && reveals.length > 0) {
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

      // Scroll entrance for the panel band (early bail if already in view)
      const panels = panelsRef.current?.querySelectorAll<HTMLElement>(
        "[data-why-panel]"
      );
      if (!prefersReduced && panelsRef.current && panels) {
        const rect = panelsRef.current.getBoundingClientRect();
        const alreadyInView = rect.top < window.innerHeight * 0.85;
        if (!alreadyInView) {
          gsap.set(panels, { y: 40, opacity: 0 });
          ScrollTrigger.create({
            trigger: panelsRef.current,
            start: "top 85%",
            once: true,
            onEnter: () => {
              gsap.to(panels, {
                y: 0,
                opacity: 1,
                duration: 0.9,
                ease: "expo.out",
                stagger: 0.08,
                clearProps: "transform,opacity",
              });
            },
          });
        }
      }
    },
    { scope: ref }
  );

  // Animate description word-reveal each time the active panel changes
  useGSAP(
    () => {
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (prefersReduced) return;
      const activePanel = panelsRef.current?.querySelector(
        `[data-why-panel="${activeIndex}"]`
      );
      // Target the inner <span> instead of the <p>. We also pass
      // `aria: "none"` so SplitText doesn't write an aria-label — neither
      // <p> nor a roleless <span> may receive aria-label per ARIA. The split
      // word spans still hold the original text as textContent, so SRs read
      // the same sentence.
      const desc = activePanel?.querySelector<HTMLElement>(
        ".why-panel__desc-text"
      );
      if (!desc) return;
      const split = new SplitText(desc, { type: "words", aria: "none" });
      gsap.set(split.words, { opacity: 0, y: 10 });
      gsap.to(split.words, {
        opacity: 1,
        y: 0,
        duration: 0.55,
        stagger: 0.018,
        ease: "expo.out",
        delay: 0.28,
      });
      return () => {
        try { split.revert(); } catch {}
      };
    },
    { dependencies: [activeIndex], scope: ref }
  );

  const activate = (i: number) => setActiveIndex(i);

  return (
    <section ref={ref} className="why" id="why" aria-label="Why MapleGrowth">
      <div className="section-head">
        <div className="section-label" data-reveal="up">
          <span className="dot" />
          <span>Why MapleGrowth</span>
        </div>
        <h2 className="section-title" data-split>
          Built for partnership.<br /><em>Not</em> handovers.
        </h2>
        <p className="section-intro" data-reveal="up" data-reveal-delay="0.2">
          Four things we hold ourselves to, every engagement.
          <span className="why__hint">Hover or tap to explore.</span>
        </p>
      </div>
      <ul className="why__panels" role="list" ref={panelsRef}>
        {PANELS.map((panel, i) => (
          <li
            key={panel.num}
            className={`why-panel${i === activeIndex ? " is-active" : ""}`}
            data-why-panel={i}
            onClick={() => activate(i)}
            onMouseEnter={() => {
              if (!isTouchRef.current) activate(i);
            }}
          >
            <div className="why-panel__rail" aria-hidden="true" />
            <div className="why-panel__handle">
              <span className="why-panel__num">{panel.num}</span>
              <h3 className="why-panel__title">{panel.title}</h3>
            </div>
            <div className="why-panel__body">
              <p className="why-panel__desc">
                <span className="why-panel__desc-text">{panel.desc}</span>
              </p>
            </div>
            <span className="why-panel__arrow" aria-hidden="true">→</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
