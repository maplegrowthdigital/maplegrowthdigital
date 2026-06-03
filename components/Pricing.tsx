"use client";

import Link from "next/link";
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { useModal } from "./global/ModalProvider";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);
}

export function Pricing() {
  const ref = useRef<HTMLElement>(null);
  const { open } = useModal();

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
    },
    { scope: ref }
  );

  return (
    <section ref={ref} className="pricing" id="pricing" aria-label="Pricing and engagement models">
      <div className="section-head">
        <div className="section-label" data-reveal="up">
          <span className="dot" />
          <span>Pricing</span>
        </div>
        <h2 className="section-title" data-split>
          Three ways to&nbsp;<em>engage</em>.
        </h2>
        <p className="section-intro" data-reveal="up" data-reveal-delay="0.2">
          From focused sprints to embedded partnerships. All transparent, all
          month-to-month — no lock-ins, no surprise invoices.
        </p>
      </div>

      <ol className="pricing__grid" role="list">
        {/* Sprint */}
        <li className="pricing-card" data-pricing-card>
          <header className="pricing-card__head">
            <span className="pricing-card__label">Sprint</span>
            <h3 className="pricing-card__title">Fixed-scope projects</h3>
            <p className="pricing-card__sub">
              Best for one-off work with a clear, time-boxed outcome.
            </p>
          </header>
          <div className="pricing-card__price">
            <span className="pricing-card__amount">From&nbsp;$4,500</span>
            <span className="pricing-card__period">per project</span>
          </div>
          <ul className="pricing-card__features">
            <li>4–6 week timeline</li>
            <li>Senior strategist + delivery team</li>
            <li>Fixed scope, fixed price</li>
            <li>Async-first communication</li>
            <li>One named point of contact</li>
          </ul>
          <div className="pricing-card__cta">
            <Link href="#contact" className="btn btn--ghost" data-magnetic>
              <span>Book a call</span>
              <span className="btn__arrow" aria-hidden="true">→</span>
            </Link>
          </div>
        </li>

        {/* Retainer */}
        <li className="pricing-card" data-pricing-card>
          <header className="pricing-card__head">
            <span className="pricing-card__label">Retainer</span>
            <h3 className="pricing-card__title">Ongoing growth partnership</h3>
            <p className="pricing-card__sub">
              Best for compounding work, sprint over sprint.
            </p>
          </header>
          <div className="pricing-card__price">
            <span className="pricing-card__amount">From&nbsp;$4,500</span>
            <span className="pricing-card__period">per month</span>
          </div>
          <ul className="pricing-card__features">
            <li>Month-to-month, 30-day notice</li>
            <li>Dedicated cross-functional team</li>
            <li>2-week sprints with reporting</li>
            <li>Direct Slack access</li>
            <li>Quarterly strategy reviews</li>
          </ul>
          <div className="pricing-card__cta">
            <Link href="#contact" className="btn btn--ghost" data-magnetic>
              <span>Book a call</span>
              <span className="btn__arrow" aria-hidden="true">→</span>
            </Link>
          </div>
        </li>

        {/* Custom (featured) */}
        <li className="pricing-card pricing-card--featured" data-pricing-card>
          <span className="pricing-card__ribbon">Most flexible</span>
          <header className="pricing-card__head">
            <span className="pricing-card__label">Custom</span>
            <h3 className="pricing-card__title">Bespoke engagement</h3>
            <p className="pricing-card__sub">
              Best for anything that doesn't fit a box.
            </p>
          </header>
          <div className="pricing-card__price">
            <span className="pricing-card__amount">Let's&nbsp;build it</span>
            <span className="pricing-card__period">scope to fit</span>
          </div>
          <ul className="pricing-card__features">
            <li>Embedded team or fractional roles</li>
            <li>Multi-channel programs</li>
            <li>Outcome-based pricing available</li>
            <li>White-label or co-branded work</li>
            <li>Anything Sprint + Retainer can't cover</li>
          </ul>
          <div className="pricing-card__cta pricing-card__cta--dual">
            <button
              type="button"
              className="btn btn--primary"
              data-magnetic
              onClick={() => open("configure")}
            >
              <span>Build your engagement</span>
              <span className="btn__arrow" aria-hidden="true">→</span>
            </button>
            <button
              type="button"
              className="btn btn--link"
              onClick={() => open("quote")}
            >
              <span>Or get a quick estimate</span>
            </button>
          </div>
        </li>
      </ol>
    </section>
  );
}
