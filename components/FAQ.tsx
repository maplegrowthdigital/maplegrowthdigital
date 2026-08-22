"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { HOME_FAQ } from "../content/home-faq";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);
}

export function FAQ() {
  const ref = useRef<HTMLElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

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

  // Animate height when openIndex changes
  useGSAP(
    () => {
      const items = ref.current?.querySelectorAll<HTMLDetailsElement>(".faq__item");
      if (!items) return;
      items.forEach((item, i) => {
        const answer = item.querySelector<HTMLElement>(".faq__answer");
        if (!answer) return;
        const shouldBeOpen = i === openIndex;
        const isOpen = item.hasAttribute("open");
        if (shouldBeOpen && !isOpen) {
          item.setAttribute("open", "");
          const target = answer.scrollHeight;
          gsap.fromTo(
            answer,
            { height: 0 },
            {
              height: target,
              duration: 0.5,
              ease: "expo.out",
              onComplete: () => gsap.set(answer, { clearProps: "height" }),
            }
          );
        } else if (!shouldBeOpen && isOpen) {
          const start = answer.scrollHeight;
          gsap.fromTo(
            answer,
            { height: start },
            {
              height: 0,
              duration: 0.4,
              ease: "power2.inOut",
              onComplete: () => {
                item.removeAttribute("open");
                gsap.set(answer, { clearProps: "height" });
              },
            }
          );
        }
      });
    },
    { dependencies: [openIndex], scope: ref }
  );

  const toggle = (i: number) => (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault(); // stop native details toggle, we manage via state
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <section ref={ref} className="faq" id="faq" aria-label="Frequently asked questions">
      <div className="section-head">
        <div className="section-label" data-reveal="up">
          <span className="dot" />
          <span>FAQ</span>
        </div>
        <h2 className="section-title" data-split>
          Common questions,<br />
          honest&nbsp;<em>answers</em>.
        </h2>
      </div>
      <div className="faq__list">
        {HOME_FAQ.map((item, i) => (
          <details
            key={i}
            className="faq__item"
            open={i === openIndex}
          >
            <summary onClick={toggle(i)}>
              <span className="faq__q">{item.q}</span>
              <span className="faq__icon" aria-hidden="true" />
            </summary>
            <div className="faq__answer">
              <p>{item.a}</p>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
