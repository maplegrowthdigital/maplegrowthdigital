"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { useSectionReveals } from "../shared/useSectionReveals";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP);
}

const STRATEGY_CALL_URL =
  "https://tidycal.com/maplegrowthdigital/strategy-call";

/**
 * AboutMasthead — asymmetric opening. Left column carries the headline +
 * lead + actions; the right column is an interactive "credentials" panel
 * that tilts toward the cursor and carries a cursor-following spotlight.
 *
 * The tilt/spotlight run entirely through gsap quick-setters driven by a
 * pointer handler — no React state, so there are no per-frame re-renders.
 */
export function AboutMasthead() {
  const ref = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useSectionReveals(ref);

  useGSAP(
    () => {
      const panel = panelRef.current;
      if (!panel) return;
      const isTouch = window.matchMedia("(hover: none)").matches;
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (isTouch || prefersReduced) return;

      const rotX = gsap.quickTo(panel, "rotateX", {
        duration: 0.6,
        ease: "power3.out",
      });
      const rotY = gsap.quickTo(panel, "rotateY", {
        duration: 0.6,
        ease: "power3.out",
      });

      const onMove = (e: PointerEvent) => {
        const rect = panel.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width; // 0..1
        const py = (e.clientY - rect.top) / rect.height; // 0..1
        rotY(gsap.utils.clamp(-8, 8, (px - 0.5) * 16));
        rotX(gsap.utils.clamp(-8, 8, (0.5 - py) * 16));
        panel.style.setProperty("--mx", `${px * 100}%`);
        panel.style.setProperty("--my", `${py * 100}%`);
      };
      const onLeave = () => {
        rotX(0);
        rotY(0);
        panel.style.setProperty("--mx", "50%");
        panel.style.setProperty("--my", "0%");
      };

      panel.addEventListener("pointermove", onMove);
      panel.addEventListener("pointerleave", onLeave);
      return () => {
        panel.removeEventListener("pointermove", onMove);
        panel.removeEventListener("pointerleave", onLeave);
      };
    },
    { scope: ref }
  );

  return (
    <section
      ref={ref}
      className="about-masthead"
      aria-label="About MapleGrowth Digital"
    >
      <div className="about-masthead__inner">
        <div className="about-masthead__lead-col">
          <div className="section-label" data-reveal="up">
            <span className="dot" />
            <span>About&nbsp;·&nbsp;Est. 2014&nbsp;·&nbsp;Mississauga, ON</span>
          </div>

          <h1 className="about-masthead__title" data-split>
            We&rsquo;re a Canadian <em>growth marketing</em> agency built for
            the long game.
          </h1>

          <p
            className="about-masthead__lead"
            data-reveal="up"
            data-reveal-delay="0.15"
          >
            Since 2014 we&rsquo;ve paired strategy, creative, and engineering
            under one roof &mdash; shipping marketing you can measure. No
            juniors on the keys, no handoffs that dilute the plan. Just
            experienced people held to the numbers that move your business.
          </p>

          <div
            className="about-masthead__actions"
            data-reveal="up"
            data-reveal-delay="0.28"
          >
            <a
              className="btn btn--primary btn--large"
              href={STRATEGY_CALL_URL}
              target="_blank"
              rel="noreferrer"
              data-magnetic
            >
              <span>Book a strategy call</span>
              <span className="btn__arrow" aria-hidden="true">
                &rarr;
              </span>
            </a>
            <a className="btn btn--ghost btn--large" href="/#work">
              <span>See the work</span>
            </a>
          </div>
        </div>

        <div className="about-masthead__aside" data-reveal="up" data-reveal-delay="0.2">
          <div className="about-cred" ref={panelRef}>
            <div className="about-cred__glow" aria-hidden="true" />
            <span className="about-cred__eyebrow">Founded</span>
            <span className="about-cred__year">2014</span>
            <p className="about-cred__place">
              Mississauga, ON &mdash; remote-first across Canada, with clients
              from the US to Australia.
            </p>
            <ul className="about-cred__chips" role="list">
              <li>Experts on the work</li>
              <li>Outcomes over outputs</li>
              <li>No lock-in retainers</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
