"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);
}

export function Insights() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      const titleEl = ref.current?.querySelector<HTMLElement>(
        ".section-title[data-split]"
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

      // Bento cards entrance — skip if section already in view on initial render
      // (safe pattern — avoids stale-transform bug on mid-page reload)
      const bento = ref.current?.querySelector(".insights__bento");
      const cards = ref.current?.querySelectorAll<HTMLElement>("[data-insight]");
      if (bento && cards && !prefersReduced) {
        const rect = bento.getBoundingClientRect();
        if (rect.top >= window.innerHeight * 0.82) {
          gsap.set(cards, { opacity: 0, y: 60 });
          ScrollTrigger.create({
            trigger: bento,
            start: "top 82%",
            once: true,
            onEnter: () => {
              gsap.to(cards, {
                y: 0,
                opacity: 1,
                duration: 1.0,
                ease: "expo.out",
                stagger: 0.1,
                clearProps: "transform",
              });
            },
          });
        }
      }
    },
    { scope: ref }
  );

  return (
    <section
      ref={ref}
      className="insights"
      id="insights"
      aria-label="Insights and podcast"
    >
      <div className="section-head insights__head">
        <div>
          <div className="section-label" data-reveal="up">
            <span className="dot" />
            <span>Insights</span>
          </div>
          <h2 className="section-title" data-split>
            Field notes from the&nbsp;<em>work</em>.
          </h2>
        </div>
        {/* Single-page mode: blog + podcast indexes don't exist yet, so the
            "All articles / All episodes" header links are suppressed. Re-add
            once those routes come back. */}
      </div>

      <div className="insights__bento">
        {/* Featured article — Single-page mode: no detail page, so card is
            a static preview tile (no click-through). */}
        <div className="insight insight--featured" data-insight>
          <div className="insight__media">
            <span className="insight__media-grid" aria-hidden="true" />
            <svg
              className="insight__media-shape"
              viewBox="0 0 200 200"
              aria-hidden="true"
            >
              <circle cx="100" cy="100" r="85" stroke="currentColor" strokeWidth="1.2" fill="none" opacity="0.35" />
              <circle cx="100" cy="100" r="58" stroke="currentColor" strokeWidth="1.2" fill="none" opacity="0.55" />
              <circle cx="100" cy="100" r="30" fill="currentColor" opacity="0.4" />
            </svg>
            <span className="insight__tag">Featured · SEO</span>
          </div>
          <div className="insight__body">
            <h3 className="insight__title">
              The SEO playbook for Canadian small businesses in 2026
            </h3>
            <p className="insight__excerpt">
              The strategies that are quietly compounding for Canadian small
              businesses right now — and the dead-end tactics still recommended
              by most agencies.
            </p>
            <div className="insight__foot">
              <div className="insight__meta">
                <time>May 14, 2026</time>
                <span aria-hidden="true">·</span>
                <span>6 min read</span>
              </div>
            </div>
          </div>
        </div>

        {/* Podcast card */}
        <div className="insight insight--podcast" data-insight>
          <div className="insight__podcast-visual">
            <div className="insight__podcast-bg" aria-hidden="true" />
            <span className="insight__pod-num">Ep. 12</span>
            <button
              className="insight__play"
              type="button"
              aria-label="Play latest episode"
              onClick={(e) => e.preventDefault()}
            >
              <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                <path d="M7 5l12 7-12 7V5Z" fill="currentColor" />
              </svg>
              <span className="insight__play-rim" aria-hidden="true" />
              <span
                className="insight__play-rim insight__play-rim--2"
                aria-hidden="true"
              />
            </button>
          </div>
          <div className="insight__body">
            <span className="insight__tag">The MapleGrowth Podcast</span>
            <h3 className="insight__title">
              Building a brand that compounds — with Priya Anand
            </h3>
            <p className="insight__excerpt">
              How founder-led brands keep their voice as they scale, and the
              channels that move the needle in year two and beyond.
            </p>
            <div className="insight__foot">
              <div className="insight__meta">
                <time>May 18, 2026</time>
                <span aria-hidden="true">·</span>
                <span>52 min</span>
              </div>
            </div>
          </div>
        </div>

        {/* Small post 1 */}
        <div className="insight insight--small" data-insight>
          <div className="insight__body">
            <span className="insight__tag">PPC</span>
            <h3 className="insight__title">
              Why your paid campaigns aren't compounding
            </h3>
            <p className="insight__excerpt">
              The compounding ad accounts share three habits. Most teams do none
              of them.
            </p>
            <div className="insight__foot">
              <div className="insight__meta">
                <time>May 06, 2026</time>
                <span aria-hidden="true">·</span>
                <span>8 min read</span>
              </div>
            </div>
          </div>
        </div>

        {/* Small post 2 */}
        <div className="insight insight--small" data-insight>
          <div className="insight__body">
            <span className="insight__tag">Web</span>
            <h3 className="insight__title">
              We re-platformed in 6 weeks. Here's what we'd do differently.
            </h3>
            <p className="insight__excerpt">
              A retrospective on a tight-window migration — what worked, what
              we'd rebuild from scratch.
            </p>
            <div className="insight__foot">
              <div className="insight__meta">
                <time>Apr 28, 2026</time>
                <span aria-hidden="true">·</span>
                <span>5 min read</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
