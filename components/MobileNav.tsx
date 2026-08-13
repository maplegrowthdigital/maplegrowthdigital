"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useModal, useModalState } from "./global/ModalProvider";
import type { NavItem } from "../lib/navigation";
import { defaultNavItems } from "../lib/navigation";
import fallbackData from "../content/data.json";
import { nap, telHref } from "../content/nap";

const MODAL_NAME = "mobile-nav";

/**
 * MobileNav — full-screen overlay opened by the Header hamburger.
 *
 * Visibility is driven by ModalProvider (so ESC, body lock, focus
 * restore all work for free). Header's hamburger calls
 * `useModal().open("mobile-nav")` to open.
 */
export function MobileNav({ navItems }: { navItems?: NavItem[] }) {
  const items = navItems && navItems.length > 0 ? navItems : defaultNavItems;
  const { isOpen } = useModalState(MODAL_NAME);
  const { close } = useModal();
  const navRef = useRef<HTMLElement>(null);
  const footRef = useRef<HTMLDivElement>(null);

  const closeMenu = () => close(MODAL_NAME);

  // Stagger reveal on open
  useEffect(() => {
    if (!isOpen) return;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;
    const ctx = gsap.context(() => {
      gsap.from(navRef.current?.querySelectorAll("li") || [], {
        y: 30,
        opacity: 0,
        duration: 0.7,
        stagger: 0.06,
        ease: "expo.out",
        delay: 0.25,
      });
      if (footRef.current) {
        gsap.from(footRef.current, {
          y: 20,
          opacity: 0,
          duration: 0.6,
          ease: "expo.out",
          delay: 0.55,
        });
      }
    });
    return () => ctx.revert();
  }, [isOpen]);

  return (
    <div
      className={`mobile-menu${isOpen ? " is-open" : ""}`}
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      aria-hidden={!isOpen}
    >
      <div className="mobile-menu__panel">
        <nav className="mobile-menu__nav" aria-label="Mobile primary" ref={navRef}>
          <ul>
            {items.map((item, i) => (
              <li key={item.href}>
                <Link href={item.href} onClick={closeMenu}>
                  <span className="mobile-menu__num">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mobile-menu__foot" ref={footRef}>
          {/* Same source as the footer NAP + LocalBusiness schema, so the
              phone/email shown here can't drift out of sync. */}
          <a href={`mailto:${nap.email}`} onClick={closeMenu}>
            {nap.email}
          </a>
          <a href={telHref} onClick={closeMenu}>
            {nap.telephone}
          </a>
          <div className="mobile-menu__social">
            {(fallbackData.contact?.socials || []).map((s: { label: string; href: string }) => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer" onClick={closeMenu}>
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
