"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);
}

interface Industry {
  title: string;
  desc: string;
  icon: React.ReactNode;
}

const INDUSTRIES: Industry[] = [
  {
    title: "SaaS & Software",
    desc: "Demand engines, product-led growth, technical content.",
    icon: (
      <svg className="industry__icon" viewBox="0 0 32 32" aria-hidden="true">
        <rect x="4" y="6" width="24" height="18" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M9 14h6M9 18h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="22" cy="14" r="2" fill="currentColor" />
      </svg>
    ),
  },
  {
    title: "E-commerce & DTC",
    desc: "Shopify storefronts, paid & lifecycle engines, CRO.",
    icon: (
      <svg className="industry__icon" viewBox="0 0 32 32" aria-hidden="true">
        <path d="M6 10h20l-2 14H8L6 10Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M11 10V7a5 5 0 0 1 10 0v3" fill="none" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    title: "Professional Services",
    desc: "Local SEO, lead nurture, trust-building content.",
    icon: (
      <svg className="industry__icon" viewBox="0 0 32 32" aria-hidden="true">
        <path d="M6 26V12l10-6 10 6v14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M13 26v-8h6v8" fill="none" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    title: "Healthcare & Wellness",
    desc: "Compliance-aware funnels, patient acquisition, brand systems.",
    icon: (
      <svg className="industry__icon" viewBox="0 0 32 32" aria-hidden="true">
        <path d="M16 26s-9-5.5-9-13a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 7.5-9 13-9 13Z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Hospitality & Travel",
    desc: "Direct booking funnels, brand storytelling, OTA strategy.",
    icon: (
      <svg className="industry__icon" viewBox="0 0 32 32" aria-hidden="true">
        <path d="M6 22h20M9 22V12l7-5 7 5v10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <circle cx="16" cy="15" r="2" fill="currentColor" />
      </svg>
    ),
  },
  {
    title: "B2B & Enterprise",
    desc: "Account-based plays, demand gen, sales enablement.",
    icon: (
      <svg className="industry__icon" viewBox="0 0 32 32" aria-hidden="true">
        <rect x="5" y="11" width="22" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M11 11V8a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v3" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M5 17h22" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
];

export function Industries() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      const isTouch = window.matchMedia("(hover: none)").matches;

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

      const reveals = ref.current?.querySelectorAll<HTMLElement>('[data-reveal="up"]');
      if (reveals && reveals.length > 0) {
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

      const cards = gsap.utils.toArray<HTMLElement>("[data-industry]");
      if (!cards.length) return;

      // Per-card perspective so children's translateZ doesn't get
      // distorted by grid-relative perspective origin.
      gsap.set(cards, {
        transformPerspective: 1500,
        transformOrigin: "center center",
      });

      // Scroll entrance — skip if already past trigger on initial render
      // (avoids the stale-transform bug on mid-page reload)
      const grid = ref.current?.querySelector(".industries__grid");
      if (!prefersReduced && grid) {
        const rect = grid.getBoundingClientRect();
        const alreadyInView = rect.top < window.innerHeight * 0.78;
        if (!alreadyInView) {
          gsap.set(cards, {
            y: 100,
            opacity: 0,
            rotationX: -28,
            rotationY: (i) => (i % 2 === 0 ? -6 : 6),
            scale: 0.96,
          });
          ScrollTrigger.create({
            trigger: grid,
            start: "top 78%",
            once: true,
            onEnter: () => {
              gsap.to(cards, {
                y: 0,
                opacity: 1,
                rotationX: 0,
                rotationY: 0,
                scale: 1,
                duration: 1.15,
                ease: "expo.out",
                stagger: { each: 0.08, from: "start" },
                clearProps: "y,opacity,rotationX,rotationY,scale",
              });
            },
          });
        }
      }

      // 3D cursor tilt — desktop only
      if (isTouch || prefersReduced) return;
      cards.forEach((card) => {
        const rotateX = gsap.quickTo(card, "rotationX", {
          duration: 0.55,
          ease: "power2.out",
        });
        const rotateY = gsap.quickTo(card, "rotationY", {
          duration: 0.55,
          ease: "power2.out",
        });

        const onMove = (e: MouseEvent) => {
          const rect = card.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width;
          const y = (e.clientY - rect.top) / rect.height;
          rotateY((x - 0.5) * 18);
          rotateX((0.5 - y) * 14);
          card.style.setProperty("--mx", `${x * 100}%`);
          card.style.setProperty("--my", `${y * 100}%`);
        };
        const onLeave = () => {
          rotateX(0);
          rotateY(0);
        };
        card.addEventListener("mousemove", onMove);
        card.addEventListener("mouseleave", onLeave);
      });
    },
    { scope: ref }
  );

  return (
    <section ref={ref} className="industries" id="industries" aria-label="Industries we serve">
      <div className="section-head">
        <div className="section-label" data-reveal="up">
          <span className="dot" />
          <span>Industries</span>
        </div>
        <h2 className="section-title" data-split>
          Built for businesses that&nbsp;<em>compound</em>.
        </h2>
        <p className="section-intro" data-reveal="up" data-reveal-delay="0.2">
          We've shipped growth work across these verticals. Different playbooks,
          same focus on outcomes you can measure.
        </p>
      </div>
      <ul className="industries__grid" role="list">
        {INDUSTRIES.map((industry, i) => (
          <li key={industry.title} className="industry" data-industry>
            <span className="industry__index" aria-hidden="true">
              {String(i + 1).padStart(2, "0")}
            </span>
            {industry.icon}
            <h3 className="industry__title">{industry.title}</h3>
            <p className="industry__desc">{industry.desc}</p>
            <span className="industry__arrow" aria-hidden="true">→</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
