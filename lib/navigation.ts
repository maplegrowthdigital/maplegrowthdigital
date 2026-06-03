export type NavItem = { href: string; label: string };

/**
 * Primary nav items used by both the desktop Header and the full-screen
 * MobileNav overlay. Ships as a single-page site, so every entry is an
 * anchor link into a homepage section.
 *
 * `/#section` (vs bare `#section`) so links also work from any non-home
 * route — Next.js navigates home first, then the hash scrolls into view.
 */
export const defaultNavItems: NavItem[] = [
  { href: "/#services", label: "Services" },
  { href: "/#work", label: "Work" },
  { href: "/#process", label: "Process" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/#about", label: "About" },
];

export function getNavigationItems(): NavItem[] {
  return defaultNavItems;
}
