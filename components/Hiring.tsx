"use client";

import Link from "next/link";
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);
}

interface Role {
  title: string;
  href: string;
}

const ROLES: Role[] = [
  { title: "Senior Designer", href: "#" },
  { title: "Growth Strategist", href: "#" },
  { title: "Full-stack Engineer", href: "#" },
];

export function Hiring() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      const titleEl = ref.current?.querySelector<HTMLElement>(
        ".hiring__title[data-split]"
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
    },
    { scope: ref }
  );

  return (
    <section ref={ref} className="hiring" aria-label="Open roles">
      <div className="hiring__inner">
        <div className="hiring__copy">
          <span className="section-label" data-reveal="up">
            <span className="dot" />
            <span>Careers</span>
          </span>
          <h3 className="hiring__title" data-split>
            We're hiring senior people to join the&nbsp;<em>studio</em>.
          </h3>
        </div>
        <ul className="hiring__roles" role="list">
          {ROLES.map((role) => (
            <li key={role.title}>
              <Link href={role.href}>
                <span>{role.title}</span>
                <span aria-hidden="true">→</span>
              </Link>
            </li>
          ))}
        </ul>
        <Link href="#" className="hiring__cta">
          See all open roles <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}
