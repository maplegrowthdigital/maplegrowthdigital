"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useSectionReveals } from "../shared/useSectionReveals";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger);
}

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
 * AboutFounder — "one line, three hands".
 *
 * A single accent line draws itself left-to-right, scrubbed to scroll. As it
 * reaches each co-founder's column a node pops and their signature rises in —
 * three disciplines joined by one throughline. Once drawn, a faint highlight
 * travels the line on a slow loop (CSS-only, transform-based) so the section
 * stays quietly alive.
 *
 * The names remain plain DOM text: they're mirrored by Person nodes in the
 * site-wide schema, and that visible/structured parity must survive any
 * animation. Reduced motion gets the finished state with no draw or pulse.
 */
export function AboutFounder() {
  const ref = useRef<HTMLElement>(null);
  const signedRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);

  useSectionReveals(ref);

  useGSAP(
    () => {
      const signed = signedRef.current;
      const fill = fillRef.current;
      if (!signed || !fill) return;

      const nodes = signed.querySelectorAll<HTMLElement>("[data-founder-node]");
      const signs = signed.querySelectorAll<HTMLElement>("[data-founder-sign]");
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (prefersReduced) {
        gsap.set(fill, { scaleX: 1 });
        gsap.set([...nodes, ...signs], { opacity: 1, y: 0, scale: 1 });
        lineRef.current?.classList.add("is-drawn");
        return;
      }

      gsap.set(fill, { scaleX: 0, transformOrigin: "left center" });
      gsap.set(nodes, { scale: 0 });
      gsap.set(signs, { opacity: 0, y: 24 });

      // One scrubbed timeline: the fill is the clock, and each node/signature
      // fires at the moment the line's leading edge crosses its column
      // (columns start at 0%, 33.3%, 66.7% — see the CSS node positions).
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: signed,
          start: "top 85%",
          end: "top 40%",
          scrub: 1,
        },
        defaults: { ease: "none" },
        // The pulse is CSS-driven; gate it on the class so it only runs once
        // the line has fully drawn (and un-gate if the user scrolls back up).
        onComplete: () => lineRef.current?.classList.add("is-drawn"),
        onReverseComplete: () =>
          lineRef.current?.classList.remove("is-drawn"),
      });

      tl.to(fill, { scaleX: 1, duration: 1 }, 0);
      const CROSSINGS = [0.02, 0.35, 0.68];
      CROSSINGS.forEach((t, i) => {
        tl.to(
          nodes[i],
          { scale: 1, duration: 0.08, ease: "back.out(3)" },
          t
        );
        tl.to(
          signs[i],
          { opacity: 1, y: 0, duration: 0.16, ease: "power2.out" },
          t + 0.02
        );
      });
    },
    { scope: ref }
  );

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

          <div className="about-founder__signed" ref={signedRef}>
            <div
              className="about-founder__line"
              ref={lineRef}
              aria-hidden="true"
            >
              <span className="about-founder__line-track">
                <span className="about-founder__line-fill" ref={fillRef} />
                <span className="about-founder__line-pulse" />
              </span>
              {FOUNDERS.map((f, i) => (
                <span
                  className="about-founder__node"
                  data-founder-node
                  key={f.name}
                  style={{ left: `${(i * 100) / 3}%` }}
                />
              ))}
            </div>

            <ul className="about-founder__signatures" role="list">
              {FOUNDERS.map((f) => (
                <li
                  className="about-founder__sign"
                  data-founder-sign
                  key={f.name}
                >
                  <span className="about-founder__sign-name">{f.name}</span>
                  <span className="about-founder__sign-role">{f.role}</span>
                </li>
              ))}
            </ul>

            <p className="about-founder__sign-note" data-reveal="up">
              Co-founders, MapleGrowth Digital
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
