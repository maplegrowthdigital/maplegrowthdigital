"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);
}

interface FAQItem {
  q: string;
  a: string;
}

const FAQS: FAQItem[] = [
  {
    q: "How long does a typical engagement last?",
    a:
      "It depends on the shape of the work. Sprints run 4–6 weeks for focused deliverables (audits, launches, redesigns). Retainers typically start at 3 months and run as long as we're earning our keep — most clients stay 12+ months because the work compounds.",
  },
  {
    q: "Do you work with companies outside of Canada?",
    a:
      "Yes. We're proudly Canadian-based but ~40% of our active clients are in the US and Europe. We're remote-first and have running engagements across four time zones at any given time.",
  },
  {
    q: "Do you require long-term contracts?",
    a:
      "No lock-ins. Retainers are month-to-month with a 30-day notice period. We'd rather earn your business every month than rely on a contract to keep you.",
  },
  {
    q: "How do you measure success?",
    a:
      "We agree on the metrics before kickoff and report against them every sprint. Common ones: pipeline created, qualified leads, organic sessions, MRR contribution, CAC, ROAS. If we can't tie the work to a number that matters to you, we shouldn't be doing it.",
  },
  {
    q: "Will I get a dedicated team?",
    a:
      "Yes. Every engagement has a named team — usually a strategist, a designer, and an engineer at minimum. You'll meet them in week one and have direct contact (Slack, email, calls) for the duration of the engagement.",
  },
  {
    q: "How fast can we start?",
    a:
      "Usually within 1–2 weeks of signing. We intentionally keep ~15% capacity open so new engagements don't wait on a queue. Urgent sprints can sometimes start within 48 hours.",
  },
  {
    q: "What's your pricing model?",
    a:
      "Three options: fixed-scope sprints, monthly retainers, or custom engagements. Sprints start at $4.5K, retainers at $4.5K/month. We share specific scope and pricing on the discovery call — no surprises later.",
  },
];

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
        {FAQS.map((item, i) => (
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
