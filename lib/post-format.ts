/**
 * Pure helpers + types for post metadata — no Node APIs, so both Server
 * Components and the client-side homepage section can import them. The
 * filesystem reader lives in lib/posts.ts and must stay server-only.
 */
import type { FounderKey } from "../content/founders";

export type Pillar = "seo" | "ppc" | "web" | "content" | "brand" | "strategy";

export interface PostSource {
  title: string;
  url: string;
}

export interface PostMeta {
  slug: string;
  title: string;
  /** ≤ 155 chars — doubles as meta description and list excerpt. */
  description: string;
  /** ISO date, YYYY-MM-DD. */
  date: string;
  updated?: string;
  author: FounderKey;
  /** Optional second founder who reviewed the piece. */
  reviewer?: FounderKey;
  pillar: Pillar;
  /** The validated target keyword from the topic map. */
  keyword: string;
  /** Sourced one-line takeaways shown in a box at the top. */
  takeaways: string[];
  /** Primary sources cited in the body; rendered as References. */
  sources: PostSource[];
  readingMinutes: number;
}

export interface PillarInfo {
  label: string;
  /** Anchor on the /services hub (matches ServiceIndex panel ids). */
  href: string;
  /** Service @id in the site-wide JSON-LD graph, for BlogPosting.about. */
  serviceId: string;
  cta: string;
}

export const PILLARS: Record<Pillar, PillarInfo> = {
  seo: {
    label: "SEO",
    href: "/services#service-seo",
    serviceId: "https://maplegrowthdigital.ca/#service-seo-analytics",
    cta: "SEO & Analytics",
  },
  ppc: {
    label: "Paid media",
    href: "/services#service-ppc",
    serviceId: "https://maplegrowthdigital.ca/#service-ppc-paid-media",
    cta: "PPC & Paid Media",
  },
  web: {
    label: "Web",
    href: "/services#service-web",
    serviceId: "https://maplegrowthdigital.ca/#service-web-design-development",
    cta: "Web Design & Development",
  },
  content: {
    label: "Content & email",
    href: "/services#service-content",
    serviceId: "https://maplegrowthdigital.ca/#service-content-email",
    cta: "Content & Email",
  },
  brand: {
    label: "Brand",
    href: "/services#service-brand",
    serviceId: "https://maplegrowthdigital.ca/#service-brand-creative",
    cta: "Brand & Creative",
  },
  strategy: {
    label: "Strategy",
    href: "/services#service-strategy",
    serviceId: "https://maplegrowthdigital.ca/#service-growth-strategy",
    cta: "Growth Strategy",
  },
};

export const isPillar = (p: unknown): p is Pillar =>
  typeof p === "string" && p in PILLARS;

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/**
 * "2026-08-15" → "Aug 15, 2026". Parses the ISO date by hand so server and
 * client render the identical string regardless of timezone or locale —
 * `toLocaleDateString` can shift the day across midnight UTC and break
 * hydration.
 */
export function formatDate(iso: string): string {
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
  return `${MONTHS[(m || 1) - 1]} ${d}, ${y}`;
}

export function readingMinutes(text: string): number {
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

/**
 * Heading text → stable anchor id. Used both by the MDX `h2` override (to
 * set the id) and by the table of contents (to link to it), so the two can
 * never disagree. "How long does SEO take?" → "how-long-does-seo-take".
 */
export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export interface TocItem {
  id: string;
  text: string;
}

/**
 * Pull the H2s out of raw MDX for the "On this page" list. Only `## `
 * (not `###`), and markdown emphasis/links/code are stripped so the TOC
 * text matches what the heading renders.
 */
export function extractToc(mdx: string): TocItem[] {
  const items: TocItem[] = [];
  for (const line of mdx.split(/\r?\n/)) {
    const m = /^##\s+(.+?)\s*#*\s*$/.exec(line);
    if (!m) continue;
    const text = m[1]
      .replace(/`([^`]*)`/g, "$1")
      .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
      .replace(/[*_~]+/g, "")
      .trim();
    items.push({ id: slugifyHeading(text), text });
  }
  return items;
}
