"use client";

import { useRef } from "react";
import { useAboutReveals } from "./useAboutReveals";

/**
 * AboutFounder — signed founder's note, set typographically.
 *
 * Deliberately image-free: the E-E-A-T signal here is the named person plus
 * the matching Person JSON-LD in app/about/page.tsx, not a portrait. Keep the
 * name and role in sync with that structured data.
 */
export function AboutFounder() {
  const ref = useRef<HTMLElement>(null);

  useAboutReveals(ref);

  return (
    <section ref={ref} className="about-founder" aria-label="From the founder">
      <div className="about-founder__inner">
        <div className="section-label" data-reveal="up">
          <span className="dot" />
          <span>From the founder</span>
        </div>

        <span className="about-founder__mark" aria-hidden="true">
          &ldquo;
        </span>

        <blockquote className="about-founder__quote" data-split>
          Growth comes from pairing creativity with accountability &mdash;
          turning ideas into outcomes you can <em>measure</em>.
        </blockquote>

        <div className="about-founder__tail">
          <p
            className="about-founder__body"
            data-reveal="up"
            data-reveal-delay="0.15"
          >
            MapleGrowth started in 2014 with a simple conviction: marketing
            should be judged by what it moves, not how it looks in a deck. More
            than a decade on, that hasn&rsquo;t changed. We stay small and
            experienced on purpose, and bring in trusted engineering partners
            when a build calls for it &mdash; so every client gets specialists,
            never a handoff.
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
