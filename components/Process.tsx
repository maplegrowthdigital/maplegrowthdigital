"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);
}

interface Phase {
  num: string;
  title: string;
  desc: string;
  bullets: string[];
}

const PHASES: Phase[] = [
  {
    num: "01",
    title: "Discover",
    desc:
      "Goals, audience, and market mapping. We surface the highest-leverage opportunities and align the team on what matters first.",
    bullets: ["Stakeholder interviews", "Competitive teardown", "Channel & audience audit"],
  },
  {
    num: "02",
    title: "Design",
    desc:
      "Wireframes, brand systems, and creative concepts that prioritize clarity and conversion over decoration.",
    bullets: ["Information architecture", "Design systems", "Creative concepts"],
  },
  {
    num: "03",
    title: "Develop",
    desc:
      "Fast, accessible builds and campaign setups tracked end-to-end with clear acceptance criteria.",
    bullets: ["Performance & security", "Tagging & analytics", "Campaign & ad setup"],
  },
  {
    num: "04",
    title: "Deploy",
    desc:
      "Launch, learn, iterate. Dashboards, sprint reviews, and a steady cadence of experiments turn signal into compounding growth.",
    bullets: ["Launch & QA", "Dashboards & reporting", "Growth sprints"],
  },
];

export function Process({ process }: { process?: { title?: string; intro?: string } }) {
  const ref = useRef<HTMLElement>(null);
  const [activeStep, setActiveStep] = useState(0);

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      // Section title split-text reveal
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

      // Reveal-up label + intro
      const reveals = ref.current?.querySelectorAll<HTMLElement>(
        '[data-reveal="up"]'
      );
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

      // Phase card scroll-reveals
      const phases = ref.current?.querySelectorAll<HTMLElement>(".phase");
      if (phases && !prefersReduced) {
        phases.forEach((phase) => {
          gsap.from(phase, {
            y: 60,
            opacity: 0,
            duration: 1.0,
            ease: "expo.out",
            scrollTrigger: { trigger: phase, start: "top 85%", once: true },
            clearProps: "transform,opacity",
          });
        });
      }

      // Sticky stepper highlighting — track which phase is centered
      if (phases && phases.length > 0) {
        phases.forEach((phase, i) => {
          ScrollTrigger.create({
            trigger: phase,
            start: "top 55%",
            end: "bottom 45%",
            onEnter: () => setActiveStep(i),
            onEnterBack: () => setActiveStep(i),
          });
        });
      }

      // DrawSVG connector — animated path through stepper
      const path = ref.current?.querySelector<SVGPathElement>(
        "[data-process-path]"
      );
      const processEl = ref.current;
      if (path && processEl && !prefersReduced) {
        const length = path.getTotalLength();
        path.style.strokeDashoffset = String(length);
        gsap.to(path, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: processEl,
            start: "top 60%",
            end: "bottom 70%",
            scrub: 0.8,
          },
        });
      }
    },
    { scope: ref }
  );

  return (
    <section ref={ref} className="process" id="process" aria-label="Our process">
      <div className="process__inner">
        <aside className="process__aside">
          <div className="section-label" data-reveal="up">
            <span className="dot" />
            <span>Process</span>
          </div>
          <h2 className="section-title" data-split>
            {process?.title ? (
              process.title
            ) : (
              <>
                A repeatable system for&nbsp;<em>real</em> growth.
              </>
            )}
          </h2>
          <p className="section-intro" data-reveal="up" data-reveal-delay="0.2">
            {process?.intro ??
              "Four phases that align strategy with execution. Predictable, transparent, and tied to outcomes you can see in the dashboard."}
          </p>

          <div className="process__stepper-wrap">
            <svg
              className="process__line"
              viewBox="0 0 60 360"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                data-process-path
                d="M 20 5 C 20 35, 40 50, 40 80 S 20 125, 20 155 S 40 200, 40 230 S 20 275, 20 305 L 20 355"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeDasharray="3 5"
              />
            </svg>
            <ol className="process__stepper">
              {PHASES.map((phase, i) => (
                <li
                  key={phase.num}
                  className={i === activeStep ? "is-active" : ""}
                >
                  <span className="process__stepper-num">{phase.num}</span>
                  <span>{phase.title}</span>
                </li>
              ))}
            </ol>
          </div>
        </aside>

        <ol className="process__phases" role="list">
          {PHASES.map((phase) => (
            <li key={phase.num} className="phase">
              <div className="phase__head">
                <span className="phase__num">{phase.num}</span>
                <h3 className="phase__title">{phase.title}</h3>
              </div>
              <p className="phase__desc">{phase.desc}</p>
              <ul className="phase__list">
                {phase.bullets.map((b, j) => (
                  <li key={j}>{b}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
