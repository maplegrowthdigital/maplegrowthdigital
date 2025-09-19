"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { NavItem } from "../lib/navigation";
import { defaultNavItems } from "../lib/navigation";

export function HeaderNav({
  navItems: initialNavItems,
}: {
  navItems?: NavItem[];
}) {
  const [active, setActive] = useState<string>("");
  const [navItems, setNavItems] = useState<NavItem[]>(
    initialNavItems || defaultNavItems
  );

  // Update navItems if props change (server-side loaded navigation)
  useEffect(() => {
    if (initialNavItems && initialNavItems.length > 0) {
      setNavItems(initialNavItems);
    }
  }, [initialNavItems]);

  // Fetch navigation items from database only if not provided via props
  useEffect(() => {
    if (initialNavItems && initialNavItems.length > 0) {
      return; // Skip API call if we have server-side navigation
    }

    const fetchNavigation = async () => {
      try {
        const res = await fetch("/api/admin/content", { cache: "no-store" });
        const data = await res.json();
        if (data.navigation && Array.isArray(data.navigation)) {
          setNavItems(data.navigation);
        }
      } catch (error) {
        console.log("Could not fetch navigation, using defaults");
      }
    };

    fetchNavigation();
  }, [initialNavItems]);

  const sectionIds = useMemo(
    () => navItems.map((n) => n.href.replace("#", "")),
    [navItems]
  );

  useEffect(() => {
    let raf = 0 as number | 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const header = document.querySelector("header") as HTMLElement | null;
        const offset = (header?.offsetHeight ?? 80) + 8; // account for sticky header + small gap
        const positions = sectionIds.map((id) => {
          const el = document.getElementById(id);
          const top = el
            ? el.getBoundingClientRect().top - offset
            : Number.POSITIVE_INFINITY;
          return { id, top };
        });
        // If we are above the first section, clear active
        const allAbove = positions.every((p) => p.top > 0);
        if (allAbove) {
          setActive("");
          return;
        }
        // Choose the last section whose top is <= 0 (closest to top)
        const current = positions
          .filter((p) => p.top <= 0)
          .sort((a, b) => b.top - a.top)[0];
        if (current) setActive("#" + current.id);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf as number);
    };
  }, [sectionIds]);

  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (!href.startsWith("#")) return;
    e.preventDefault();
    const id = href.substring(1);
    const el = document.getElementById(id);
    if (!el) return;
    const header = document.querySelector("header") as HTMLElement | null;
    const offset = (header?.offsetHeight ?? 80) + 8;
    const y = el.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top: y, behavior: "smooth" });
    try {
      if (typeof history !== "undefined") history.replaceState(null, "", href);
    } catch {}
    setActive(href);
  };

  return (
    <nav className="hidden md:flex gap-6 text-sm text-white/80">
      {navItems.map((item) => {
        const isActive = active === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={(e) => handleClick(e, item.href)}
            className="group relative py-1 hover:text-white"
          >
            <span>{item.label}</span>
            <span
              className={
                "pointer-events-none absolute left-1/2 -bottom-1 h-0.5 w-8 -translate-x-1/2 transform origin-center rounded-full bg-brand-500 transition-transform duration-300 " +
                (isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100")
              }
            />
          </Link>
        );
      })}
    </nav>
  );
}
