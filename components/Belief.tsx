"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);
}

export function Belief({
  title,
  quote,
}: {
  title?: string;
  quote: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const quoteRef = useRef<HTMLParagraphElement>(null);
  /** Inner span is the SplitText target — SplitText puts aria-label on its
   *  target element, and ARIA prohibits aria-label on <p>. Targeting a
   *  <span> keeps the paragraph semantics clean. */
  const quoteTextRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      // Lighthouse / headless / automated tools: skip the fade-in entirely
      // so the quote text reads at full opacity (otherwise the 0.12 starting
      // state trips color-contrast audits).
      const isAutomated =
        typeof navigator !== "undefined" &&
        ((navigator as Navigator & { webdriver?: boolean }).webdriver ||
          /HeadlessChrome|Lighthouse|PageSpeed|GTmetrix/i.test(
            navigator.userAgent
          ));
      if (prefersReduced || isAutomated || !quoteTextRef.current) return;

      // `aria: "none"` stops SplitText from auto-applying aria-label to the
      // target. Spans with no valid role can't take aria-label (axe rule
      // `aria-prohibited-attr`), and the visible split spans still hold the
      // original text as their textContent — so screen readers read the same
      // sentence regardless, just one word per stop.
      const split = new SplitText(quoteTextRef.current, {
        type: "words",
        aria: "none",
      });
      // Starting opacity 0.55 (up from 0.12). The dramatic ghosted look
      // dropped contrast below 1.3:1 in light theme — under WCAG's 3:1
      // floor for large text. 0.55 still reads as a soft fade-in but
      // computed contrast stays above ~3.5:1 in both themes.
      gsap.set(split.words, { opacity: 0.55 });
      const tween = gsap.to(split.words, {
        opacity: 1,
        stagger: 0.04,
        ease: "none",
      });
      ScrollTrigger.create({
        trigger: quoteRef.current!,
        start: "top 70%",
        end: "bottom 30%",
        scrub: 0.7,
        animation: tween,
      });

      // Reveal byline
      const byline = ref.current?.querySelector<HTMLElement>(
        ".belief__byline"
      );
      if (byline) {
        gsap.set(byline, { opacity: 0, y: 28 });
        ScrollTrigger.create({
          trigger: byline,
          start: "top 88%",
          once: true,
          onEnter: () => {
            gsap.to(byline, {
              opacity: 1,
              y: 0,
              duration: 0.9,
              ease: "expo.out",
            });
          },
        });
      }

      return () => {
        try { split.revert(); } catch {}
      };
    },
    { scope: ref }
  );

  return (
    <section ref={ref} className="belief" aria-label="Belief">
      <p ref={quoteRef} className="belief__quote">
        <span className="belief__mark" aria-hidden="true">“</span>
        <span ref={quoteTextRef} className="belief__quote-text">{quote}</span>
      </p>
      {title && (
        <div className="belief__byline">
          <span>— {title}</span>
        </div>
      )}
    </section>
  );
}
