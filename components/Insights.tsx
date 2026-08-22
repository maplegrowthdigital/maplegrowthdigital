"use client";

import Link from "next/link";
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { PILLARS, formatDate, type PostMeta } from "../lib/post-format";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);
}

/**
 * Insights — the homepage "From the blog" section.
 *
 * Driven entirely by real published posts passed from the Server Component
 * (app/page.tsx only renders it once there are ≥3). The original had a
 * hardcoded featured article and a fictional podcast card; both are gone —
 * nothing here can show content that doesn't exist.
 *
 * Layout: featured (latest) spans the top row, up to three more below.
 */
export function Insights({ posts }: { posts: PostMeta[] }) {
  const ref = useRef<HTMLElement>(null);

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

      // Bento entrance — skipped if already in view on initial render
      // (avoids the stale-transform bug on mid-page reload).
      const bento = ref.current?.querySelector(".insights__bento");
      const cards = ref.current?.querySelectorAll<HTMLElement>("[data-insight]");
      if (bento && cards && !prefersReduced) {
        const rect = bento.getBoundingClientRect();
        if (rect.top >= window.innerHeight * 0.82) {
          gsap.set(cards, { opacity: 0, y: 60 });
          ScrollTrigger.create({
            trigger: bento,
            start: "top 82%",
            once: true,
            onEnter: () => {
              gsap.to(cards, {
                y: 0,
                opacity: 1,
                duration: 1.0,
                ease: "expo.out",
                stagger: 0.1,
                clearProps: "transform",
              });
            },
          });
        }
      }
    },
    { scope: ref }
  );

  if (posts.length === 0) return null;
  const [featured, ...rest] = posts;

  const Meta = ({ p }: { p: PostMeta }) => (
    <div className="insight__foot">
      <div className="insight__meta">
        <time dateTime={p.date}>{formatDate(p.date)}</time>
        <span aria-hidden="true">·</span>
        <span>{p.readingMinutes} min read</span>
      </div>
    </div>
  );

  return (
    <section
      ref={ref}
      className="insights"
      id="insights"
      aria-label="Latest guides from the blog"
    >
      <div className="section-head insights__head">
        <div>
          <div className="section-label" data-reveal="up">
            <span className="dot" />
            <span>From the blog</span>
          </div>
          <h2 className="section-title" data-split>
            Field notes from the&nbsp;<em>work</em>.
          </h2>
        </div>
        <Link
          href="/blog"
          className="btn btn--ghost btn--small"
          data-reveal="up"
          data-reveal-delay="0.15"
        >
          <span>All guides</span>
          <span className="btn__arrow" aria-hidden="true">
            →
          </span>
        </Link>
      </div>

      <div className="insights__bento">
        <Link
          href={`/blog/${featured.slug}`}
          className="insight insight--featured"
          data-insight
        >
          <div className="insight__media">
            <span className="insight__media-grid" aria-hidden="true" />
            <svg
              className="insight__media-shape"
              viewBox="0 0 200 200"
              aria-hidden="true"
            >
              <circle cx="100" cy="100" r="85" stroke="currentColor" strokeWidth="1.2" fill="none" opacity="0.35" />
              <circle cx="100" cy="100" r="58" stroke="currentColor" strokeWidth="1.2" fill="none" opacity="0.55" />
              <circle cx="100" cy="100" r="30" fill="currentColor" opacity="0.4" />
            </svg>
            <span className="insight__tag">
              Latest · {PILLARS[featured.pillar].label}
            </span>
          </div>
          <div className="insight__body">
            <h3 className="insight__title">{featured.title}</h3>
            <p className="insight__excerpt">{featured.description}</p>
            <Meta p={featured} />
          </div>
        </Link>

        {rest.slice(0, 3).map((p) => (
          <Link
            href={`/blog/${p.slug}`}
            className="insight"
            data-insight
            key={p.slug}
          >
            <div className="insight__body">
              <span className="insight__tag">{PILLARS[p.pillar].label}</span>
              <h3 className="insight__title">{p.title}</h3>
              <p className="insight__excerpt">{p.description}</p>
              <Meta p={p} />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
