"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const DISMISS_KEY = "mgd:sticky-cta-dismissed";

/**
 * StickyBottomCta — pill that appears after the hero on mobile.
 *
 * - Dismissable for the rest of the session
 * - Hidden when the user is in the contact section
 * - Self-pinning: appears after scrollY > triggerY (set on mount based on hero height
 *   if a `.hero` element exists, otherwise 60% of viewport)
 */
export function StickyBottomCta() {
  const [visible, setVisible] = useState(false);
  const dismissedRef = useRef<boolean>(false);

  useEffect(() => {
    try {
      dismissedRef.current = sessionStorage.getItem(DISMISS_KEY) === "1";
    } catch {}
    if (dismissedRef.current) return;

    const hero = document.querySelector(".hero");
    const triggerY = hero
      ? hero.getBoundingClientRect().bottom + window.scrollY - window.innerHeight * 0.4
      : window.innerHeight * 0.6;

    const contact = document.querySelector("#contact");

    const onScroll = () => {
      if (dismissedRef.current) {
        setVisible(false);
        return;
      }
      const y = window.scrollY;
      const past = y > triggerY;

      // Hide when user is in the contact section
      let inContact = false;
      if (contact) {
        const rect = contact.getBoundingClientRect();
        inContact = rect.top < window.innerHeight * 0.8;
      }

      setVisible(past && !inContact);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const dismiss = () => {
    dismissedRef.current = true;
    setVisible(false);
    try {
      sessionStorage.setItem(DISMISS_KEY, "1");
    } catch {}
  };

  // `inert` removes the element AND descendants from both the a11y tree
  // and the tab order in one attribute. Replaces the old aria-hidden+focusable
  // pattern that tripped axe's `aria-hidden-focus` rule (keyboard users
  // could tab to a link SRs refused to announce).
  // Note: React 19+ accepts `inert` as a boolean prop. React 18 needs the
  // string form via a spread to satisfy types.
  const inertProps = visible ? {} : ({ inert: "" } as Record<string, string>);

  return (
    <div
      className={`sticky-cta${visible ? " is-visible" : ""}`}
      {...inertProps}
    >
      <Link href="#contact" className="sticky-cta__link">
        <span>Book a strategy call</span>
        <span aria-hidden="true">→</span>
      </Link>
      <button
        type="button"
        className="sticky-cta__close"
        onClick={dismiss}
        aria-label="Dismiss sticky call to action"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
          <path
            d="M1 1l12 12M13 1L1 13"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );
}
