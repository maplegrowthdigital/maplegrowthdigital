"use client";

import { useRef, useState } from "react";
import { useSectionReveals } from "../shared/useSectionReveals";
import { SERVICES_FAQ } from "../../content/services-faq";

export function ServicesFaq() {
  const ref = useRef<HTMLElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  useSectionReveals(ref);

  return (
    <section
      ref={ref}
      className="svc-faq"
      id="services-faq"
      aria-label="Service questions"
    >
      <div className="svc-faq__inner">
        <div className="svc-faq__head">
          <div className="section-label" data-reveal="up">
            <span className="dot" />
            <span>Questions</span>
          </div>
          <h2 className="svc-faq__title" data-split>
            Before you <em>ask</em>.
          </h2>
        </div>

        <ul className="svc-faq__list" role="list">
          {SERVICES_FAQ.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <li
                className={`svc-faq__item${isOpen ? " is-open" : ""}`}
                key={item.q}
                data-reveal="up"
                data-reveal-delay={String(i * 0.06)}
              >
                <h3>
                  <button
                    type="button"
                    className="svc-faq__q"
                    aria-expanded={isOpen}
                    aria-controls={`svc-faq-a-${i}`}
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                  >
                    <span>{item.q}</span>
                    <span className="svc-faq__icon" aria-hidden="true" />
                  </button>
                </h3>
                <div className="svc-faq__reveal" id={`svc-faq-a-${i}`}>
                  <p className="svc-faq__a">{item.a}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
