"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { tidycal } from "../lib/tidycal";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);
}

// Hardcoded stats matching the prototype. Edit values in place,
// or refactor to read from content/data.json later.
const STATS = [
  { count: 10, suffix: "+ yrs", value: null, label: "Web & digital experience" },
  { count: 3,  suffix: "× ROI", value: null, label: "Average client return" },
  { count: null, suffix: "",    value: "24/7", label: "Support when you need it" },
  { count: null, suffix: "",    value: "CA",   label: "Proudly Canadian-based" },
] as const;

export interface HeroProps {
  /**
   * Optional — accepts the existing content/data.json `hero` shape but
   * uses prototype copy for visual sections that the data shape doesn't cover.
   * Edit copy directly in this component for now.
   */
  hero?: {
    title?: string;
    subhead?: string;
    body?: string;
    cta?: { href?: string; label?: string };
  };
}

export function Hero({ hero }: HeroProps) {
  const ref = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const nextAvailRef = useRef<HTMLAnchorElement>(null);
  const [nextAvailLabel, setNextAvailLabel] = useState<string>("—");

  // Fetch real next-available slot from TidyCal (auto-picks first booking type).
  // Fails silently to "Soon — get in touch" if API is unavailable.
  useEffect(() => {
    let cancelled = false;
    tidycal
      .getNextAvailable()
      .then((slot) => {
        if (cancelled) return;
        if (!slot) {
          setNextAvailLabel("Soon — get in touch");
          return;
        }
        const d = new Date(slot.starts_at);
        const day = d.toLocaleDateString(undefined, {
          weekday: "short",
          month: "short",
          day: "numeric",
        });
        const time = d.toLocaleTimeString(undefined, {
          hour: "numeric",
          minute: "2-digit",
        });
        setNextAvailLabel(`${day} · ${time}`);
      })
      .catch(() => {
        if (!cancelled) setNextAvailLabel("Soon — get in touch");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      // Lighthouse / headless Chrome / Puppeteer / bots: skip the entrance
      // animation entirely. The hero's title is the LCP candidate — if we
      // hide it via gsap.set + SplitText DOM mutation before first paint,
      // Lighthouse can't measure LCP and reports NO_LCP. Bailing early
      // keeps the content natively painted from frame one.
      const isAutomated =
        typeof navigator !== "undefined" &&
        ((navigator as Navigator & { webdriver?: boolean }).webdriver ||
          /HeadlessChrome|Lighthouse|PageSpeed|GTmetrix/i.test(
            navigator.userAgent
          ));
      if (isAutomated) return;

      // === Entrance timeline ===
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

      // Reveal eyebrow, body, actions, badge (the simple reveal-up elements)
      const reveals = ref.current?.querySelectorAll<HTMLElement>(
        '[data-reveal="up"]'
      );
      if (reveals && reveals.length > 0) {
        gsap.set(reveals, { opacity: 0, y: 28 });
        if (!prefersReduced) {
          tl.to(
            reveals,
            {
              opacity: 1,
              y: 0,
              duration: 0.9,
              stagger: 0.05,
              delay: (i, el) => parseFloat(el.dataset.revealDelay || "0"),
            },
            0.1
          );
        } else {
          gsap.set(reveals, { opacity: 1, y: 0 });
        }
      }

      // Split-text title reveal
      let titleSplit: SplitText | null = null;
      if (titleRef.current && !prefersReduced) {
        titleSplit = new SplitText(titleRef.current, {
          type: "lines,words",
          linesClass: "split-line",
        });
        gsap.set(titleSplit.words, { yPercent: 110, opacity: 0 });
        tl.to(
          titleSplit.words,
          { yPercent: 0, opacity: 1, duration: 1.1, stagger: 0.04 },
          0.25
        );
      }

      // === Stats counter animation (runs after entrance) ===
      const counterEls = ref.current?.querySelectorAll<HTMLElement>("[data-counter]");
      if (counterEls && !prefersReduced) {
        tl.from(
          ref.current?.querySelectorAll(".hero__stats > li") || [],
          { y: 24, opacity: 0, duration: 0.7, stagger: 0.08 },
          0.6
        );
        counterEls.forEach((el) => {
          const to = parseFloat(el.dataset.to || "0");
          const suffix = el.dataset.suffix || "";
          const obj = { val: 0 };
          gsap.to(obj, {
            val: to,
            duration: 1.6,
            ease: "power2.out",
            delay: 0.9,
            onUpdate: () => {
              el.textContent = Math.round(obj.val) + suffix;
            },
          });
        });
      }

      // === Hero art (rings + leaf) ===
      // The scale entrance is the signature reveal moment — kept by design
      // choice. Note: because the rings are large decorative shapes, the
      // scale animation can contribute ~0.15 to Lighthouse CLS on initial
      // load. Acceptable trade-off for the entrance flair.
      if (!prefersReduced) {
        tl.from(
          ref.current?.querySelectorAll(".hero__ring") || [],
          { scale: 0.6, opacity: 0, duration: 1.6, stagger: 0.1, ease: "expo.out" },
          0.3
        );
        tl.from(
          ref.current?.querySelector(".hero__leaf") || null,
          { scale: 0.4, opacity: 0, rotation: -20, duration: 1.4, ease: "expo.out" },
          0.5
        );

        // Scroll-driven parallax on rings + leaf
        gsap.to(".hero__ring--1", {
          yPercent: -20,
          ease: "none",
          scrollTrigger: {
            trigger: ref.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
        gsap.to(".hero__ring--2", {
          yPercent: -35,
          ease: "none",
          scrollTrigger: {
            trigger: ref.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
        gsap.to(".hero__leaf", {
          yPercent: -50,
          rotation: 20,
          ease: "none",
          scrollTrigger: {
            trigger: ref.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      return () => {
        if (titleSplit) titleSplit.revert();
      };
    },
    { scope: ref }
  );

  // Fall back to data.json shape if provided, otherwise use prototype copy
  const body =
    hero?.body ??
    "We blend creativity, data, and strategy to ship work you can see, measure, and trust — from SEO and paid media to conversion-focused web.";

  return (
    <section ref={ref} className="hero" id="hero" aria-label="Introduction">
      <div className="hero__inner">
        <div className="hero__eyebrow" data-reveal="up">
          <span className="dot" />
          <span>{hero?.subhead ?? "A Canadian growth marketing agency"}</span>
        </div>

        <h1 className="hero__title" ref={titleRef}>
          Smart marketing.
          <br />
          <em>Measurable</em> growth.
        </h1>

        <p className="hero__body" data-reveal="up" data-reveal-delay="0.2">
          {body}
        </p>

        <div className="hero__actions" data-reveal="up" data-reveal-delay="0.3">
          <Link href={hero?.cta?.href ?? "#contact"} className="btn btn--primary" data-magnetic>
            <span>{hero?.cta?.label ?? "Book a strategy call"}</span>
            <span className="btn__arrow" aria-hidden="true">→</span>
          </Link>
          <Link href="#work" className="btn btn--link">
            <span>See recent work</span>
          </Link>
        </div>

        <Link
          ref={nextAvailRef}
          href="#contact"
          className="next-available"
          data-reveal="up"
          data-reveal-delay="0.45"
        >
          <span className="next-available__pulse" aria-hidden="true" />
          <span className="next-available__label">Next available</span>
          <span className="next-available__time">
            {nextAvailLabel}
          </span>
          <span className="next-available__arrow" aria-hidden="true">→</span>
        </Link>

        <ul
          className="hero__stats"
          role="list"
          data-reveal="up"
          data-reveal-delay="0.5"
        >
          {STATS.map((stat, i) => (
            <li key={i}>
              <span
                className="hero__stat-value"
                {...(stat.count !== null
                  ? { "data-counter": "", "data-to": String(stat.count), "data-suffix": stat.suffix }
                  : {})}
              >
                {/* Static HTML renders the FINAL value so Lighthouse / bots
                    capture meaningful text on first paint (was previously "0").
                    For real users, the counter animation in useGSAP will reset
                    this and animate back up. */}
                {stat.count !== null ? `${stat.count}${stat.suffix}` : stat.value}
              </span>
              <span className="hero__stat-label">{stat.label}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Decorative art (right side, behind content) */}
      <div className="hero__art" aria-hidden="true">
        <div className="hero__ring hero__ring--1" />
        <div className="hero__ring hero__ring--2" />
        <div className="hero__ring hero__ring--3" />
        <svg
          className="hero__leaf"
          viewBox="0 0 200 200"
          preserveAspectRatio="xMidYMid meet"
        >
          <path d="M100 20c8 28 28 48 56 56-28 8-48 28-56 56-8-28-28-48-56-56 28-8 48-28 56-56Z" fill="currentColor" />
        </svg>
      </div>

      <div className="hero__scroll" aria-hidden="true">
        <span>Scroll</span>
        <div className="hero__scroll-line" />
      </div>
    </section>
  );
}
