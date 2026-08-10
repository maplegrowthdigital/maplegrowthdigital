"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useAboutReveals } from "./useAboutReveals";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger);
}

/**
 * AboutFounder — signed founder's note. The portrait is a swap-in slot:
 * drop a file at `/public/about/founder.jpg` and it replaces the monogram
 * placeholder with zero code changes (the <img> removes itself if missing).
 *
 * NOTE: keep the name/title here in sync with the Person JSON-LD in
 * app/about/page.tsx — Google expects on-page + structured data to match.
 */
export function AboutFounder() {
  const ref = useRef<HTMLElement>(null);
  const photoRef = useRef<HTMLElement>(null);

  useAboutReveals(ref);

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (prefersReduced || !photoRef.current) return;

      gsap.fromTo(
        photoRef.current,
        { y: 42 },
        {
          y: -42,
          ease: "none",
          scrollTrigger: {
            trigger: ref.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    },
    { scope: ref }
  );

  return (
    <section ref={ref} className="about-founder" aria-label="From the founder">
      <div className="about-founder__inner">
        <figure className="about-founder__photo" ref={photoRef}>
          {/* Swap slot — add /public/about/founder.jpg to replace the monogram. */}
          <img
            src="/about/founder.jpg"
            alt="Rohan T George, Founder of MapleGrowth Digital"
            className="about-founder__img"
            onError={(e) => {
              e.currentTarget.remove();
            }}
          />
          <span className="about-founder__monogram" aria-hidden="true">
            RTG
          </span>
          <figcaption className="about-founder__badge">
            <span>Rohan T George</span>
            <span>Founder</span>
          </figcaption>
        </figure>

        <div className="about-founder__col">
          <div className="section-label" data-reveal="up">
            <span className="dot" />
            <span>From the founder</span>
          </div>

          <blockquote className="about-founder__quote" data-split>
            Growth comes from pairing creativity with accountability &mdash;
            turning ideas into outcomes you can <em>measure</em>.
          </blockquote>

          <p
            className="about-founder__body"
            data-reveal="up"
            data-reveal-delay="0.15"
          >
            MapleGrowth started in 2014 with a simple conviction: marketing
            should be judged by what it moves, not how it looks in a deck. More
            than a decade on, that hasn&rsquo;t changed. We stay small and
            senior on purpose, and bring in trusted engineering partners when a
            build calls for it &mdash; so every client gets specialists, never a
            handoff.
          </p>

          <p
            className="about-founder__sign"
            data-reveal="up"
            data-reveal-delay="0.25"
          >
            <span className="about-founder__sign-name">Rohan T George</span>
            <span className="about-founder__sign-role">
              Founder, MapleGrowth Digital
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
