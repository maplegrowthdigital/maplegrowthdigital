"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { BookingWidget } from "./BookingWidget";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);
}

export function CTA() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      const titleEl = ref.current?.querySelector<HTMLElement>(
        ".cta__title[data-split]"
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
    <section ref={ref} className="cta" id="contact" aria-label="Get in touch">
      <div className="cta__inner">
        <h2 className="cta__title" data-split>
          Let's build the next chapter of your&nbsp;<em>growth</em>.
        </h2>
        <p className="cta__sub" data-reveal="up" data-reveal-delay="0.2">
          Pick a time that works for you. We'll come prepared with a quick read
          on your site, channels, and category — and leave with prioritized next
          steps for your team.
        </p>

        <div data-reveal="up" data-reveal-delay="0.3">
          <BookingWidget />
        </div>

        <div className="cta__alt" data-reveal="up" data-reveal-delay="0.4">
          <span>Prefer email?</span>
          <a href="mailto:info@maplegrowthdigital.ca" className="btn btn--link">
            <span>info@maplegrowthdigital.ca</span>
          </a>
        </div>
      </div>
    </section>
  );
}
