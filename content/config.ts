import { settings } from "./settings";
import { schema } from "./schema";

/**
 * Site-wide config surface. Trimmed to what the homepage + layout actually
 * consume (`settings`, `schema`, `getCanonicalUrl`). The legacy brand /
 * font / page-title / page-description helpers were dropped along with
 * the inner pages — restore from git history if you need them back.
 */
export const config = {
  settings,
  schema,

  getCanonicalUrl: (path?: string) => {
    const base = settings.canonicalUrl || "https://maplegrowthdigital.ca/";
    return path ? `${base.replace(/\/$/, "")}${path}` : base;
  },
} as const;

export type Config = typeof config;
