export type NavItem = { href: string; label: string };

export const defaultNavItems: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/contact", label: "Contact" },
];

export function getNavigationItems(): NavItem[] {
  return defaultNavItems;
}
