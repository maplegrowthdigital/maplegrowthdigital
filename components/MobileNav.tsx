"use client";
import Link from "next/link";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import type { NavItem } from "../lib/navigation";
import { defaultNavItems } from "../lib/navigation";

type MobileNavItem = NavItem & { icon: ReactNode };

const Icon = {
  home: (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 12l9-9 9 9" />
      <path d="M9 21V9h6v12" />
    </svg>
  ),
  blog: (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M16 13H8" />
      <path d="M16 17H8" />
      <path d="M10 9H8" />
    </svg>
  ),
  services: (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
    </svg>
  ),
  process: (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="5" height="5" rx="1" />
      <rect x="16" y="3" width="5" height="5" rx="1" />
      <rect x="9.5" y="16" width="5" height="5" rx="1" />
      <path d="M8 5.5h8" />
      <path d="M12 8.5v7" />
      <path d="M5.5 8v5.5" />
      <path d="M18.5 8v5.5" />
    </svg>
  ),
  work: (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M16 7V5a3 3 0 0 0-3-3h-2a3 3 0 0 0-3 3v2" />
    </svg>
  ),
  about: (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="7" r="4" />
      <path d="M5.5 21a7.5 7.5 0 0 1 13 0" />
    </svg>
  ),
  contact: (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15a4 4 0 0 1-4 4H7l-4 4V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
    </svg>
  ),
};

// Map navigation labels to icons
const getIconForLabel = (label: string): ReactNode => {
  const normalizedLabel = label.toLowerCase();
  if (normalizedLabel.includes("service")) return Icon.services;
  if (normalizedLabel.includes("process")) return Icon.process;
  if (normalizedLabel.includes("case") || normalizedLabel.includes("work"))
    return Icon.work;
  if (normalizedLabel.includes("about")) return Icon.about;
  if (normalizedLabel.includes("blog")) return Icon.blog;
  if (normalizedLabel.includes("contact")) return Icon.contact;
  return Icon.home; // fallback
};

export function MobileNav({
  navItems: initialNavItems,
}: {
  navItems?: NavItem[];
}) {
  const [active, setActive] = useState<string>("");
  const [navItems, setNavItems] = useState<NavItem[]>(
    initialNavItems || defaultNavItems
  );

  // Create mobile nav items with icons
  const items: MobileNavItem[] = useMemo(() => {
    return navItems.map((item) => ({
      ...item,
      icon: getIconForLabel(item.label),
    }));
  }, [navItems]);

  // Update navItems if props change (server-side loaded navigation)
  useEffect(() => {
    if (initialNavItems && initialNavItems.length > 0) {
      setNavItems(initialNavItems);
    }
  }, [initialNavItems]);

  // No database fetching - use only props and defaults

  const sectionIds = useMemo(
    () =>
      items
        .filter((n) => n.href.startsWith("#"))
        .map((n) => n.href.replace("#", "")),
    [items]
  );

  useEffect(() => {
    let raf = 0 as number | 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const header = document.querySelector("header") as HTMLElement | null;
        const offset = (header?.offsetHeight ?? 80) + 8;
        const positions = sectionIds.map((id) => {
          const el = document.getElementById(id);
          const top = el
            ? el.getBoundingClientRect().top - offset
            : Number.POSITIVE_INFINITY;
          return { id, top };
        });
        const allAbove = positions.every((p) => p.top > 0);
        if (allAbove) {
          setActive("");
          return;
        }
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
      history.replaceState(null, "", href);
    } catch {}
    setActive(href);
  };

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white/90 backdrop-blur dark:border-gray-800 dark:bg-neutral-950/90"
      style={{ paddingBottom: "max(env(safe-area-inset-bottom), 0.25rem)" }}
      aria-label="Primary"
    >
      <ul className="mx-auto grid max-w-3xl auto-cols-max grid-flow-col justify-center gap-4 px-2 py-2">
        {items.map((item) => {
          const isActive = item.href.startsWith("#") && active === item.href;
          return (
            <li key={item.href} className="w-full">
              <Link
                href={item.href}
                onClick={(e) => handleClick(e, item.href)}
                className={
                  "flex w-full flex-col items-center justify-center gap-1 rounded-md px-2 py-2 text-center text-[11px] font-medium " +
                  (isActive
                    ? "text-brand-500 bg-brand-500/10"
                    : "text-gray-600 dark:text-gray-300")
                }
              >
                <span
                  className={
                    isActive
                      ? "text-brand-500"
                      : "text-gray-500 dark:text-gray-400"
                  }
                >
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
