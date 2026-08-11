"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger);
}

interface Principle {
  num: string;
  title: string;
  desc: string;
}

const PRINCIPLES: Principle[] = [
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
      "We tie our work to dashboards, not slide decks. Every sprint ends with a number that moved — or an honest read on why it didn’t.",
  },
  {
    num: "03",
    title: "Transparent pricing",
    desc:
      "Clear scope, predictable invoices, no scope-creep games. You’ll know exactly what we’re billing for before we start.",
  },
  {
    num: "04",
    title: "Embedded, not arm’s length",
    desc:
      "We work like an extension of your team — in your Slack, your standups, your roadmap. Less ceremony, more compounding.",
  },
];

/**
 * AboutPrinciples — the page's signature scene.
 *
 * On desktop (and when motion is allowed) the four panels are pinned and
 * pan horizontally as you scroll, driven by a scrubbed GSAP timeline via
 * `gsap.matchMedia` (auto-reverts across breakpoints). Below 900px or under
 * reduced-motion, none of that runs and the panels fall back to a plain
 * vertical stack — no horizontal overflow, no hijack. The horizontal
 * layout is only applied once JS confirms the pin is active (`is-pinned`).
 */
export function AboutPrinciples() {
  const ref = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        "(min-width: 900px) and (prefers-reduced-motion: no-preference)",
        () => {
          const section = ref.current;
          const track = trackRef.current;
          if (!section || !track) return;

          section.classList.add("is-pinned");
          const distance = () =>
            Math.max(0, track.scrollWidth - window.innerWidth);

          const tween = gsap.to(track, {
            x: () => -distance(),
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: () => "+=" + distance(),
              pin: true,
              scrub: 1,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });

          return () => {
            // matchMedia reverts the tween + ScrollTrigger for us; just undo
            // the layout flag so the fallback stack is clean.
            tween.scrollTrigger?.kill();
            tween.kill();
            gsap.set(track, { x: 0 });
            section.classList.remove("is-pinned");
          };
        }
      );

      return () => mm.revert();
    },
    { scope: ref }
  );

  return (
    <section
      ref={ref}
      className="about-principles"
      aria-label="How we work"
    >
      <div className="about-principles__track" ref={trackRef}>
        <div className="about-principles__intro" aria-hidden="false">
          <div className="section-label">
            <span className="dot" />
            <span>How we work</span>
          </div>
          <h2 className="about-principles__heading">
            Four things we hold to.
            <br />
            <em>Every</em> engagement.
          </h2>
          <p className="about-principles__hint">
            <span aria-hidden="true">Scroll</span>
            <span className="about-principles__hint-arrow" aria-hidden="true">
              &rarr;
            </span>
          </p>
        </div>

        {PRINCIPLES.map((p) => (
          <article className="about-principle" key={p.num}>
            <span className="about-principle__num">{p.num}</span>
            <div className="about-principle__body">
              <h3 className="about-principle__title">{p.title}</h3>
              <p className="about-principle__desc">{p.desc}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
