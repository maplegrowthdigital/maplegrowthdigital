export type NavItem = { href: string; label: string };

export const defaultNavItems: NavItem[] = [
  { href: "/#services", label: "Services" },
  { href: "/#case-studies", label: "Case Studies" },
  { href: "/#about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/#contact", label: "Contact" },
];

export function getNavigationItems(): NavItem[] {
  return defaultNavItems;
}
