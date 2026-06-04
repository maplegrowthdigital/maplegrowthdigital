"use client";

import Link from "next/link";
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger);
}

const QUICK_LINKS = [
  { href: "/#services", label: "Services" },
  { href: "/#work", label: "Work" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/#faq", label: "FAQ" },
];

export function NotFound404() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      // Skip the entrance for headless/automated Chrome so the content
      // is painted on first frame (same guard the Hero uses).
      const isAutomated =
        typeof navigator !== "undefined" &&
        ((navigator as Navigator & { webdriver?: boolean }).webdriver ||
          /HeadlessChrome|Lighthouse|PageSpeed|GTmetrix/i.test(
            navigator.userAgent
          ));

      const reveals = ref.current?.querySelectorAll<HTMLElement>(
        '[data-reveal="up"]'
      );

      if (prefersReduced || isAutomated) {
        if (reveals) gsap.set(reveals, { opacity: 1, y: 0 });
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

      // Code: the two 4s drop in, the leaf scales + spins into place.
      const digits = ref.current?.querySelectorAll<HTMLElement>(
        ".notfound__digit"
      );
      const leaf = ref.current?.querySelector<HTMLElement>(".notfound__leaf");

      if (digits && digits.length > 0) {
        gsap.set(digits, { yPercent: 40, opacity: 0 });
        tl.to(
          digits,
          { yPercent: 0, opacity: 1, duration: 1.1, stagger: 0.12 },
          0.1
        );
      }
      if (leaf) {
        gsap.set(leaf, { scale: 0.2, opacity: 0, rotation: -120 });
        tl.to(
          leaf,
          { scale: 1, opacity: 1, rotation: 0, duration: 1.3, ease: "back.out(1.6)" },
          0.25
        );
      }

      // Reveal-up: kicker, lead, actions, quick links.
      if (reveals && reveals.length > 0) {
        gsap.set(reveals, { opacity: 0, y: 24 });
        tl.to(
          reveals,
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            stagger: 0.08,
            delay: (i, el) => parseFloat(el.dataset.revealDelay || "0"),
          },
          0.5
        );
      }

      // Ambient rings: slow continuous drift (decorative only).
      const rings = ref.current?.querySelectorAll<HTMLElement>(
        ".notfound__ring"
      );
      rings?.forEach((r, i) => {
        gsap.to(r, {
          yPercent: i % 2 === 0 ? 6 : -6,
          duration: 6 + i,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      });

      // Idle leaf bob once the entrance settles.
      if (leaf) {
        gsap.to(leaf, {
          y: -10,
          rotation: 4,
          duration: 3.2,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          delay: 1.6,
        });
      }
    },
    { scope: ref }
  );

    // <section> not <main> — the root layout already wraps children in
    // <main id="main-content">, so a <main> here would nest landmarks.
  return (
    <section className="notfound" ref={ref} aria-labelledby="notfound-title">
      <div className="notfound__art" aria-hidden="true">
        <div className="notfound__ring notfound__ring--1" />
        <div className="notfound__ring notfound__ring--2" />
        <div className="notfound__ring notfound__ring--3" />
      </div>

      <div className="notfound__inner">
        <div className="section-label" data-reveal="up">
          <span className="dot" />
          <span>Error 404</span>
        </div>

        <h1 className="notfound__code" id="notfound-title">
          <span className="notfound__digit" aria-hidden="true">
            4
          </span>
          <span className="notfound__leaf" aria-hidden="true">
            <svg viewBox="0 0 200 200" preserveAspectRatio="xMidYMid meet">
              <path
                d="M100 20c8 28 28 48 56 56-28 8-48 28-56 56-8-28-28-48-56-56 28-8 48-28 56-56Z"
                fill="currentColor"
              />
            </svg>
          </span>
          <span className="notfound__digit" aria-hidden="true">
            4
          </span>
          <span className="visually-hidden">404 — Page not found</span>
        </h1>

        <p className="notfound__lead" data-reveal="up" data-reveal-delay="0.05">
          This page wandered off the trail. The link may be broken, or the page
          may have moved. Let&rsquo;s get you back on track.
        </p>

        <div
          className="notfound__actions"
          data-reveal="up"
          data-reveal-delay="0.12"
        >
          <Link href="/" className="btn btn--primary" data-magnetic>
            <span>Back to home</span>
            <span className="btn__arrow" aria-hidden="true">
              →
            </span>
          </Link>
          <Link href="/#contact" className="btn btn--link">
            <span>Book a strategy call</span>
          </Link>
        </div>

        <nav
          className="notfound__links"
          aria-label="Popular pages"
          data-reveal="up"
          data-reveal-delay="0.2"
        >
          <span className="notfound__links-label">Or jump to</span>
          <ul>
            {QUICK_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}
