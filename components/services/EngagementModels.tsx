"use client";

import Link from "next/link";
import { useRef } from "react";
import { useSectionReveals } from "../shared/useSectionReveals";
import { useModal } from "../global/ModalProvider";

interface Tier {
  name: string;
  price: string;
  note: string;
}

// Mirrors the four tiers in components/Pricing.tsx — if those change, change
// these. Kept to headline figures only; the full comparison lives on /#pricing.
const TIERS: Tier[] = [
  { name: "Starter", price: "$500", note: "per month" },
  { name: "Sprint", price: "$1,500", note: "per project" },
  { name: "Retainer", price: "$1,000", note: "per month" },
  { name: "Custom", price: "Scoped", note: "to fit" },
];

export function EngagementModels() {
  const ref = useRef<HTMLElement>(null);
  const { open } = useModal();
  useSectionReveals(ref);

  return (
    <section
      ref={ref}
      className="svc-engage"
      id="engagement"
      aria-label="Engagement models and pricing"
    >
      <div className="svc-engage__inner">
        <div className="svc-engage__head">
          <div className="section-label" data-reveal="up">
            <span className="dot" />
            <span>Engagement models</span>
          </div>
          <h2 className="svc-engage__title" data-split>
            Four ways to <em>start</em>.
          </h2>
          <p
            className="svc-engage__note"
            data-reveal="up"
            data-reveal-delay="0.15"
          >
            Every model is month-to-month with a 30-day notice. Scope and
            pricing are agreed before we start &mdash; no surprise invoices.
          </p>
        </div>

        <ul className="svc-tiers" role="list">
          {TIERS.map((t, i) => (
            <li
              className="svc-tier"
              key={t.name}
              data-reveal="up"
              data-reveal-delay={String(i * 0.07)}
            >
              <span className="svc-tier__name">{t.name}</span>
              <span className="svc-tier__price">{t.price}</span>
              <span className="svc-tier__note">{t.note}</span>
            </li>
          ))}
        </ul>

        <div
          className="svc-engage__actions"
          data-reveal="up"
          data-reveal-delay="0.3"
        >
          <Link className="btn btn--ghost" href="/#pricing">
            <span>Compare all four</span>
            <span className="btn__arrow" aria-hidden="true">
              &rarr;
            </span>
          </Link>
          <button
            type="button"
            className="btn btn--link"
            onClick={() => open("quote")}
          >
            <span>Get a quick estimate</span>
          </button>
        </div>
      </div>
    </section>
  );
}
