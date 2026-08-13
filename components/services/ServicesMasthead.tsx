"use client";

import { useRef } from "react";
import { useSectionReveals } from "../shared/useSectionReveals";

const STRATEGY_CALL_URL =
  "https://tidycal.com/maplegrowthdigital/strategy-call";

export function ServicesMasthead() {
  const ref = useRef<HTMLElement>(null);
  useSectionReveals(ref);

  return (
    <section
      ref={ref}
      className="svc-masthead"
      aria-label="Growth marketing services"
    >
      <div className="svc-masthead__inner">
        <div className="section-label" data-reveal="up">
          <span className="dot" />
          <span>Services</span>
        </div>

        <h1 className="svc-masthead__title" data-split>
          Growth marketing services for Canadian <em>businesses</em>.
        </h1>

        <div className="svc-masthead__tail">
          <p
            className="svc-masthead__lead"
            data-reveal="up"
            data-reveal-delay="0.15"
          >
            Eight services, one accountable team. We scope the work, set the
            strategy, and run the engagement &mdash; then bring in specialist
            partners to build where that gets you a better result than doing it
            all ourselves.
          </p>
          <div
            className="svc-masthead__actions"
            data-reveal="up"
            data-reveal-delay="0.28"
          >
            <a
              className="btn btn--primary btn--large"
              href={STRATEGY_CALL_URL}
              target="_blank"
              rel="noreferrer"
              data-magnetic
            >
              <span>Book a strategy call</span>
              <span className="btn__arrow" aria-hidden="true">
                &rarr;
              </span>
            </a>
            <a className="btn btn--ghost btn--large" href="#engagement">
              <span>See how we price it</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
