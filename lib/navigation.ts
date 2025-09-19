import { createAnonServerClient } from "../utils/supabase/server";

export type NavItem = { href: string; label: string };

export const defaultNavItems: NavItem[] = [
  { href: "/#services", label: "Services" },
  { href: "/#process", label: "Process" },
  { href: "/#case-studies", label: "Case Studies" },
  { href: "/#about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/#contact", label: "Contact" },
];

export async function getNavigationItems(): Promise<NavItem[]> {
  try {
    const supabase = createAnonServerClient();
    const { data, error } = await supabase
      .from("sections")
      .select("data")
      .eq("id", "navigation")
      .single();

    if (!error && data?.data && Array.isArray(data.data)) {
      return data.data as NavItem[];
    }
  } catch (error) {
    console.log("Could not fetch navigation, using defaults");
  }

  return defaultNavItems;
}
