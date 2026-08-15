"use client";

import Link from "next/link";
import { useRef } from "react";
import { useSectionReveals } from "../shared/useSectionReveals";

interface Partner {
  name: string;
  covers: string;
  where: string;
}

// Kept factual and in sync with the partner section on /about. These are
// statements about other companies — verify against their own sites before
// editing rather than embellishing.
const PARTNERS: Partner[] = [
  {
    name: "Blue Vineyard",
    covers: "Custom software and digital platforms",
    where: "Australia",
  },
  {
    name: "Growmintech",
    covers: "Mobile apps and e-commerce builds",
    where: "India",
  },
  {
    name: "Dark Blue Technologies",
    covers: "Managed IT, cloud and cybersecurity",
    where: "United States",
  },
];

/**
 * DeliveryModel — the honest differentiator, and the section that earns this
 * page. States plainly what MapleGrowth does itself and what partners deliver,
 * rather than implying a large in-house department.
 */
export function DeliveryModel() {
  const ref = useRef<HTMLElement>(null);
  useSectionReveals(ref);

  return (
    <section
      ref={ref}
      className="svc-delivery"
      id="how-we-deliver"
      aria-label="How we deliver"
    >
      <div className="svc-delivery__inner">
        <div className="svc-delivery__head">
          <div className="section-label" data-reveal="up">
            <span className="dot" />
            <span>How we deliver</span>
          </div>
          <h2 className="svc-delivery__title" data-split>
            A small core team, and <em>specialists</em> for the build.
          </h2>
        </div>

        <div className="svc-delivery__body">
          <p data-reveal="up">
            Most agencies go one of two ways: keep everything in-house and
            spread the team thin, or quietly white-label the work and lose the
            thread of it. We do neither, and we&rsquo;d rather say so plainly
            than let you find out later.
          </p>
          <p data-reveal="up" data-reveal-delay="0.1">
            MapleGrowth scopes the work, sets the strategy, and runs the
            engagement. You get one named point of contact and one team
            accountable for the outcome. Where a project needs deep engineering
            or a specialist skill set, we bring in partners we&rsquo;ve worked
            with for years &mdash; and we tell you which parts they&rsquo;re
            building. Growmintech is founded by one of our own co-founders, so
            that partnership in particular runs as a single team.
          </p>
          <p data-reveal="up" data-reveal-delay="0.2">
            The trade is deliberate: you get people who do one thing properly
            instead of generalists learning on your budget, without having to
            manage three vendors yourself. More on{" "}
            <Link href="/about">who we are and how we got here</Link>, or see{" "}
            <Link href="/#work">the work</Link>.
          </p>
        </div>

        <ul className="svc-partners" role="list">
          {PARTNERS.map((p, i) => (
            <li
              className="svc-partner"
              key={p.name}
              data-reveal="up"
              data-reveal-delay={String(0.1 + i * 0.08)}
            >
              <span className="svc-partner__name">{p.name}</span>
              <span className="svc-partner__covers">{p.covers}</span>
              <span className="svc-partner__where">{p.where}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
