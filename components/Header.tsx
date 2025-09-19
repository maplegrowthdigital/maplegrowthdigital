"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Container } from "./Container";
import { ThemeToggle } from "./ThemeToggle";
import { HeaderNav } from "./HeaderNav";
import { site } from "../content/site";
import type { NavItem } from "../lib/navigation";

export function Header({
  logoUrl,
  navItems,
  headerData,
}: {
  logoUrl?: string;
  navItems?: NavItem[];
  headerData?: any;
}) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={
        (scrolled ? "bg-gray-900/95 shadow-md" : "bg-gray-900/100 shadow-sm") +
        " sticky top-0 z-50 border-t-2 border-brand-500 text-white backdrop-blur"
      }
    >
      <Container className="flex h-16 items-center justify-between gap-6">
        <Link href="/" className="flex items-center" aria-label="Farbox home">
          <Image
            src={logoUrl || site.logoUrl}
            alt={headerData?.logoAlt || "Your Agency"}
            width={160}
            height={28}
            className="h-7 w-auto"
            priority
          />
        </Link>
        <HeaderNav navItems={navItems} />
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <a
            href={headerData?.ctaUrl || site.tidycal}
            target="_blank"
            rel="noreferrer"
            className="btn-cta"
          >
            {headerData?.ctaText || "Book a call"}
            <svg
              aria-hidden
              className="ml-2 h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </a>
        </div>
      </Container>
    </header>
  );
}
