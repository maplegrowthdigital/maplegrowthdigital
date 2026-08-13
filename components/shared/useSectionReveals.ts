"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import type { RefObject } from "react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);
}

/**
 * Shared entrance choreography for page sections (About, Services).
 *
 * Mirrors the pattern used across the homepage (About / Why / CTA):
 *  - Any `[data-split]` heading is word-split and rises into view once.
 *  - Any `[data-reveal="up"]` element fades + slides up on scroll,
 *    honouring an optional `data-reveal-delay`.
 *
 * Fully reduced-motion aware. Scoped to the passed section ref so each
 * section wires its own triggers and cleans them up on unmount.
 */
export function useSectionReveals(scope: RefObject<HTMLElement>) {
  useGSAP(
    () => {
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      // --- Split-text headings -------------------------------------------
      const titles = scope.current?.querySelectorAll<HTMLElement>(
        "[data-split]"
      );
      const splits: SplitText[] = [];
      if (titles && !prefersReduced) {
        titles.forEach((titleEl) => {
          const split = new SplitText(titleEl, {
            type: "lines,words",
            linesClass: "split-line",
          });
          splits.push(split);
          gsap.set(split.words, { yPercent: 110, opacity: 0 });
          ScrollTrigger.create({
            trigger: titleEl,
            start: "top 85%",
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
        });
      }

      // --- Reveal-up elements --------------------------------------------
      const reveals = scope.current?.querySelectorAll<HTMLElement>(
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

      return () => {
        splits.forEach((s) => {
          try {
            s.revert();
          } catch {}
        });
      };
    },
    { scope }
  );
}
