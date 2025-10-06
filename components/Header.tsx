"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Container } from "./Container";
import { ThemeToggle } from "./ThemeToggle";
import { HeaderNav } from "./HeaderNav";
import fallbackData from "../content/data.json";
import type { NavItem } from "../lib/navigation";

export function Header({
  logoUrl,
  navItems,
}: {
  logoUrl?: string;
  navItems?: NavItem[];
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
      <Container className="flex h-[80px] items-center justify-between gap-6">
        <Link
          href="/"
          className="flex items-center"
          aria-label="MapleGrowth home"
        >
          <Image
            src={logoUrl || fallbackData.logoUrl}
            alt="MapleGrowth Digital"
            width={160}
            height={28}
            className="h-12 md:h-14 w-auto"
            priority
          />
        </Link>
        <HeaderNav navItems={navItems} />
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <a
            href={fallbackData.tidycal}
            target="_blank"
            rel="noreferrer"
            className="btn-cta"
            aria-label="Book a strategy call"
          >
            {/* Mobile: Show only call icon */}
            <svg
              className="h-5 w-5 sm:hidden"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.62-3.07 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.6 12.6 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.6 12.6 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>

            {/* Desktop: Show text with arrow */}
            <span className="hidden sm:inline">Book a call</span>
            <svg
              aria-hidden
              className="ml-2 h-4 w-4 hidden sm:block"
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
