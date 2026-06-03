"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { useModal, useModalState } from "./global/ModalProvider";
import type { NavItem } from "../lib/navigation";

const MOBILE_NAV = "mobile-nav";

export function Header({
  navItems,
}: {
  navItems?: NavItem[];
}) {
  const [scrolled, setScrolled] = useState(false);
  const { open, close } = useModal();
  const { isOpen: mobileNavOpen } = useModalState(MOBILE_NAV);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleMobileNav = () => {
    if (mobileNavOpen) close(MOBILE_NAV);
    else open(MOBILE_NAV);
  };

  return (
    <header
      id="site-navigation"
      className={`site-header${scrolled ? " is-scrolled" : ""}`}
      data-header
    >
      <Link href="/" className="logo" aria-label="MapleGrowth Digital home">
        {/* Two variants — one shown per theme via CSS [data-theme] swap.
            The hidden one is `display: none`, so screen readers only see
            one, and most browsers skip fetching the off-theme image. */}
        <img
          src="/mgd-logo.svg"
          alt="MapleGrowth Digital"
          width={182}
          height={60}
          className="logo__img logo__img--dark"
        />
        <img
          src="/mgd-logo-light.svg"
          alt=""
          width={182}
          height={60}
          className="logo__img logo__img--light"
          aria-hidden="true"
        />
      </Link>

      <nav className="nav" aria-label="Primary">
        {(navItems || []).map((item) => (
          <Link key={item.href} href={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="site-header__actions">
        <ThemeToggle />
        <Link
          href="#contact"
          className="btn btn--ghost btn--small site-header__cta"
          data-magnetic
        >
          <span>Book a call</span>
          <span className="btn__arrow" aria-hidden="true">→</span>
        </Link>
        <button
          className={`hamburger${mobileNavOpen ? " is-open" : ""}`}
          type="button"
          onClick={toggleMobileNav}
          aria-controls="mobile-menu"
          aria-expanded={mobileNavOpen}
          aria-label={mobileNavOpen ? "Close menu" : "Open menu"}
        >
          <span className="hamburger__bar" />
          <span className="hamburger__bar" />
          <span className="hamburger__bar" />
        </button>
      </div>
    </header>
  );
}
