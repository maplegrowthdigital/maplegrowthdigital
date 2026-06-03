"use client";

import { Fragment, useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP);
}

export function Marquee({ marquee }: { marquee?: ReadonlyArray<string> }) {
  const trackRef = useRef<HTMLDivElement>(null);

  const items =
    marquee && marquee.length > 0
      ? Array.from(marquee)
      : [
          "SEO & Analytics",
          "PPC & Paid Media",
          "Web Design",
          "Development",
          "Brand & Creative",
          "Content",
          "Growth Strategy",
          "Generative Engine Optimization",
        ];

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (prefersReduced || !trackRef.current) return;
      const distance = trackRef.current.scrollWidth / 2;
      gsap.to(trackRef.current, {
        x: -distance,
        duration: 28,
        ease: "none",
        repeat: -1,
      });
    },
    { scope: trackRef }
  );

  // Render text + ✦ as alternating <span> direct children so the
  // CSS `:nth-child(even)` accent-color rule works.
  const renderGroup = (keyPrefix: string, ariaHidden = false) => (
    <div
      className="mgd-marquee__group"
      {...(ariaHidden ? { "aria-hidden": true } : {})}
    >
      {items.map((text, i) => (
        <Fragment key={`${keyPrefix}-${i}`}>
          <span>{text}</span>
          <span aria-hidden="true">✦</span>
        </Fragment>
      ))}
    </div>
  );

  return (
    <section className="mgd-marquee" aria-label="What we’re known for">
      <div className="mgd-marquee__track" ref={trackRef}>
        {renderGroup("a")}
        {renderGroup("b", true)}
      </div>
    </section>
  );
}
