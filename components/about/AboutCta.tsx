"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { useAboutReveals } from "./useAboutReveals";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP);
}

const STRATEGY_CALL_URL =
  "https://tidycal.com/maplegrowthdigital/strategy-call";

/**
 * AboutCta — closing call to action. Reuses the site's `.cta` styling and
 * carries `id="contact"` so the header / mobile-nav "Book a call" links
 * (href="#contact") resolve on this route too. Lighter than the homepage
 * CTA (links straight to the booking page rather than embedding the widget).
 */
export function AboutCta() {
  const ref = useRef<HTMLElement>(null);
  useAboutReveals(ref);

  return (
    <section ref={ref} className="cta about-cta" id="contact" aria-label="Get in touch">
      <div className="cta__inner">
        <h2 className="cta__title" data-split>
          Let&rsquo;s build your next chapter of&nbsp;<em>growth</em>.
        </h2>
        <p className="cta__sub" data-reveal="up" data-reveal-delay="0.2">
          Book a free strategy call. We&rsquo;ll come prepared with a quick read
          on your site, channels, and category &mdash; and leave you with
          prioritized next steps, whether or not we end up working together.
        </p>

        <div
          className="cta__actions"
          data-reveal="up"
          data-reveal-delay="0.3"
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
          <a className="btn btn--link" href="mailto:info@maplegrowthdigital.ca">
            <span>info@maplegrowthdigital.ca</span>
          </a>
        </div>
      </div>
    </section>
  );
}
