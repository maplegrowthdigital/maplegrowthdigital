/**
 * The three co-founders — single source of truth.
 *
 * Read by: content/schema.ts (Person nodes + Organization.founder),
 * components/about/AboutFounder.tsx (visible credits + stance lines),
 * lib/posts.ts (blog bylines → BlogPosting.author / reviewedBy), and the
 * article author box. Google expects the visible names and the structured
 * data to match, and these are real people, so they must come from one
 * place and never be retyped.
 */
export const SITE_ORIGIN = "https://maplegrowthdigital.ca";

export type FounderKey = "rohan" | "tom" | "thomas";

export interface Founder {
  key: FounderKey;
  name: string;
  /** Short discipline label shown on the About page and in bylines. */
  role: string;
  /** Full title used in structured data. */
  jobTitle: string;
  /** Stable Person @id in the site-wide JSON-LD graph. */
  id: string;
  /** Role-scoped stance — what the role owns, deliberately not biography. */
  stance: string;
  /** Optional extra credit line (real, disclosed facts only). */
  extra?: string;
}

export const FOUNDERS: Record<FounderKey, Founder> = {
  rohan: {
    key: "rohan",
    name: "Rohan T George",
    role: "Strategy",
    jobTitle: "Co-founder — Strategy",
    id: `${SITE_ORIGIN}/#rohan-t-george`,
    stance: "Owns the plan — and the number every engagement is judged against.",
  },
  tom: {
    key: "tom",
    name: "Tom Boban",
    role: "Engineering",
    jobTitle: "Co-founder — Engineering",
    id: `${SITE_ORIGIN}/#tom-boban`,
    stance: "Owns the build — fast, secure, and still maintainable after handover.",
    extra: "Founder of Growmintech, our build partner.",
  },
  thomas: {
    key: "thomas",
    name: "Thomas Thomas",
    role: "Delivery",
    jobTitle: "Co-founder — Delivery",
    id: `${SITE_ORIGIN}/#thomas-thomas`,
    stance: "Owns the cadence — scoped honestly, shipped on time, reported every sprint.",
  },
};

/** Display order. */
export const FOUNDER_LIST: Founder[] = [
  FOUNDERS.rohan,
  FOUNDERS.tom,
  FOUNDERS.thomas,
];

export const isFounderKey = (k: unknown): k is FounderKey =>
  typeof k === "string" && k in FOUNDERS;
