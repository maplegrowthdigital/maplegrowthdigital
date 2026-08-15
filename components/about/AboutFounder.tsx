"use client";

import { useRef, useState } from "react";
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
  /** Role-scoped stance — describes what the role owns, not biography. */
  stance: string;
  /** Optional extra credit line (real, disclosed facts only). */
  extra?: string;
}

/**
 * The three co-founders. Keep names/roles in sync with the Person nodes in
 * content/schema.ts — Google expects structured data to match what's visible,
 * and these are real people's names, so they should never drift or be guessed.
 */
const FOUNDERS: Founder[] = [
  {
    name: "Rohan T George",
    role: "Strategy",
    stance:
      "Owns the plan — and the number every engagement is judged against.",
  },
  {
    name: "Tom Boban",
    role: "Engineering",
    stance:
      "Owns the build — fast, secure, and still maintainable after handover.",
    extra: "Founder of Growmintech, our build partner.",
  },
  {
    name: "Thomas Thomas",
    role: "Delivery",
    stance:
      "Owns the cadence — scoped honestly, shipped on time, reported every sprint.",
  },
];

/**
 * AboutFounder — the founding team as a full-width triptych.
 *
 * The section is built around "one line, three hands": a single accent line
 * draws itself across the band, scrubbed to scroll, and as its leading edge
 * crosses each founder's column their node pops and their panel rises in.
 * Hovering (or tapping) a founder makes them active — the others dim, their
 * node breathes. Three disciplines, one throughline.
 *
 * The names remain plain DOM text: they're mirrored by Person nodes in the
 * site-wide schema, and that parity must survive any animation. Panels are
 * animated on an inner wrapper so the li-level dim (CSS) never fights GSAP's
 * inline styles. Reduced motion gets the finished state, no draw, no pulse.
 */
export function AboutFounder() {
  const ref = useRef<HTMLElement>(null);
  const bandRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const isTouchRef = useRef(false);

  useSectionReveals(ref);

  useGSAP(
    () => {
      isTouchRef.current = window.matchMedia("(hover: none)").matches;

      const band = bandRef.current;
      const fill = fillRef.current;
      if (!band || !fill) return;

      const nodes = band.querySelectorAll<HTMLElement>("[data-founder-node]");
      const panels = band.querySelectorAll<HTMLElement>("[data-founder-in]");
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (prefersReduced) {
        gsap.set(fill, { scaleX: 1 });
        gsap.set([...nodes], { scale: 1 });
        gsap.set([...panels], { opacity: 1, y: 0 });
        lineRef.current?.classList.add("is-drawn");
        return;
      }

      gsap.set(fill, { scaleX: 0, transformOrigin: "left center" });
      gsap.set(nodes, { scale: 0 });
      gsap.set(panels, { opacity: 0, y: 30 });

      // One scrubbed timeline: the fill is the clock. Nodes sit centred over
      // each column (16.7% / 50% / 83.3% — see the CSS), and each pops just
      // before the line's leading edge arrives, with its panel rising behind.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: band,
          start: "top 85%",
          end: "top 35%",
          scrub: 1,
        },
        defaults: { ease: "none" },
        onComplete: () => lineRef.current?.classList.add("is-drawn"),
        onReverseComplete: () =>
          lineRef.current?.classList.remove("is-drawn"),
      });

      tl.to(fill, { scaleX: 1, duration: 1 }, 0);
      const CROSSINGS = [0.14, 0.47, 0.8];
      CROSSINGS.forEach((t, i) => {
        tl.to(nodes[i], { scale: 1, duration: 0.08, ease: "back.out(3)" }, t);
        tl.to(
          panels[i],
          { opacity: 1, y: 0, duration: 0.16, ease: "power2.out" },
          t + 0.02
        );
      });
    },
    { scope: ref }
  );

  const activate = (i: number) => setActive(i);
  const deactivate = () => setActive(null);

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

        <p
          className="about-founder__body"
          data-reveal="up"
          data-reveal-delay="0.15"
        >
          MapleGrowth started in 2014 with a simple conviction: marketing
          should be judged by what it moves, not how it looks in a deck. Three
          of us run it &mdash; small and experienced on purpose, with trusted
          partners when a build calls for it. Every client gets specialists,
          never a handoff.
        </p>

        <div
          className="founder-band"
          ref={bandRef}
          onMouseLeave={() => {
            if (!isTouchRef.current) deactivate();
          }}
        >
          <div className="founder-band__line" ref={lineRef} aria-hidden="true">
            <span className="founder-band__line-track">
              <span className="founder-band__line-fill" ref={fillRef} />
              <span className="founder-band__line-pulse" />
            </span>
            {FOUNDERS.map((f, i) => (
              <span
                className={`founder-band__node${
                  active === i ? " is-active" : ""
                }`}
                data-founder-node
                key={f.name}
                style={{ left: `${(i * 2 + 1) * (100 / 6)}%` }}
              />
            ))}
          </div>

          <ol className="founder-band__grid" role="list">
            {FOUNDERS.map((f, i) => (
              <li
                className={`founder${active === i ? " is-active" : ""}${
                  active !== null && active !== i ? " is-dim" : ""
                }`}
                key={f.name}
                onMouseEnter={() => {
                  if (!isTouchRef.current) activate(i);
                }}
                onClick={() => activate(i)}
              >
                <div className="founder__in" data-founder-in>
                  <span className="founder__eyebrow">
                    <span className="founder__num">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {f.role}
                  </span>
                  <h3 className="founder__name">{f.name}</h3>
                  <p className="founder__stance">{f.stance}</p>
                  {f.extra && <p className="founder__extra">{f.extra}</p>}
                </div>
              </li>
            ))}
          </ol>
        </div>

        <p className="about-founder__sign-note" data-reveal="up">
          Co-founders, MapleGrowth Digital
        </p>
      </div>
    </section>
  );
}
