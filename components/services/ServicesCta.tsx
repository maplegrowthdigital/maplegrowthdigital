"use client";

import { useRef } from "react";
import { useSectionReveals } from "../shared/useSectionReveals";
import { useModal } from "../global/ModalProvider";

const STRATEGY_CALL_URL =
  "https://tidycal.com/maplegrowthdigital/strategy-call";

/**
 * ServicesCta — closing CTA. Carries id="contact" so the header and mobile-nav
 * "Book a call" links resolve on this route too.
 */
export function ServicesCta() {
  const ref = useRef<HTMLElement>(null);
  const { open } = useModal();
  useSectionReveals(ref);

  return (
    <section
      ref={ref}
      className="cta svc-cta"
      id="contact"
      aria-label="Get in touch"
    >
      <div className="cta__inner">
        <h2 className="cta__title" data-split>
          Not sure where to&nbsp;<em>start</em>?
        </h2>
        <p className="cta__sub" data-reveal="up" data-reveal-delay="0.2">
          Book a free strategy call. We&rsquo;ll come prepared with a read on
          your site, channels, and category &mdash; and tell you what
          we&rsquo;d prioritise, even if that&rsquo;s less work than you
          expected.
        </p>

        <div className="cta__actions" data-reveal="up" data-reveal-delay="0.3">
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
          <button
            type="button"
            className="btn btn--ghost btn--large"
            onClick={() => open("configure")}
          >
            <span>Build your engagement</span>
          </button>
        </div>
      </div>
    </section>
  );
}
