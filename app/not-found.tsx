import type { Metadata } from "next";
import { NotFound404 } from "../components/NotFound404";

/**
 * Global 404 — App Router special file. Rendered inside the root layout,
 * so Header / Footer / theme / Lenis are all present. Server component so
 * we can export `metadata`; the animated view is the client child.
 */
export const metadata: Metadata = {
  title: "Page not found — MapleGrowth Digital",
  description: "The page you're looking for doesn't exist or has moved.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return <NotFound404 />;
}
