"use client";

import { useRef } from "react";
import { useSectionReveals } from "../shared/useSectionReveals";

interface Founder {
  name: string;
  role: string;
}

/**
 * The three co-founders. Keep these in sync with the Person nodes in
 * content/schema.ts — Google expects structured data to match what's visible,
 * and these are real people's names, so they should never drift or be guessed.
 */
const FOUNDERS: Founder[] = [
  { name: "Rohan T George", role: "Strategy" },
  { name: "Tom Boban", role: "Engineering" },
  { name: "Thomas Thomas", role: "Delivery" },
];

/**
 * AboutFounder — signed note from the founding team, set typographically.
 *
 * Deliberately image-free: the E-E-A-T signal is three named people matched by
 * Person structured data, not portraits.
 */
export function AboutFounder() {
  const ref = useRef<HTMLElement>(null);

  useSectionReveals(ref);

  return (
    <section ref={ref} className="about-founder" aria-label="From the founders">
      <div className="about-founder__inner">
        <div className="section-label" data-reveal="up">
          <span className="dot" />
          <span>From the founders</span>
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
            than a decade on, that hasn&rsquo;t changed. Three of us run it
            &mdash; strategy, engineering, and delivery &mdash; and we stay
            small and experienced on purpose, bringing in trusted partners when
            a build calls for it. Every client gets specialists, never a
            handoff.
          </p>

          <ul
            className="about-founder__signatures"
            role="list"
            data-reveal="up"
            data-reveal-delay="0.25"
          >
            {FOUNDERS.map((f) => (
              <li className="about-founder__sign" key={f.name}>
                <span className="about-founder__sign-name">{f.name}</span>
                <span className="about-founder__sign-role">{f.role}</span>
              </li>
            ))}
          </ul>
          <p className="about-founder__sign-note">
            Co-founders, MapleGrowth Digital
          </p>
        </div>
      </div>
    </section>
  );
}
