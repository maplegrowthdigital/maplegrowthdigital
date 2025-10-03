import { brand } from "./brand";
import { settings } from "./settings";
import { schema } from "./schema";
import fallbackData from "./data.json";

export const config = {
  // Brand configuration
  brand,

  // Site settings
  settings,

  // JSON-LD Schema
  schema,

  // Main content (from JSON)
  content: fallbackData,

  // Utility functions
  getBrandColor: () => brand.brandColor || "#C62828",
  getButtonColor: () =>
    brand.primaryButtonColor || brand.brandColor || "#C62828",
  getHeadingFont: () =>
    brand.headingFontFamily ||
    'var(--font-heading-default), "Montserrat", sans-serif',
  getBodyFont: () =>
    brand.bodyFontFamily || 'var(--font-body-default), "Open Sans", sans-serif',
  getLogo: () =>
    brand.logoUrl || fallbackData.logoUrl || "/maplegrowth-logo.svg",

  // SEO helpers
  getPageTitle: (pageTitle?: string) => {
    const baseTitle =
      settings.seoTitle || settings.siteName || "MapleGrowth Digital";
    return pageTitle
      ? `${pageTitle} | ${settings.siteName || "MapleGrowth Digital"}`
      : baseTitle;
  },

  getPageDescription: (pageDescription?: string) => {
    return (
      pageDescription ||
      settings.seoDescription ||
      "Canadian digital marketing agency for growth-focused businesses."
    );
  },

  getCanonicalUrl: (path?: string) => {
    const base = settings.canonicalUrl || "https://www.maplegrowthdigital.ca/";
    return path ? `${base.replace(/\/$/, "")}${path}` : base;
  },
} as const;

export type Config = typeof config;
