import type { Metadata } from "next";
import "./globals.css";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { MobileNav } from "../components/MobileNav";
import { DynamicStyles } from "../components/DynamicStyles";
import { Montserrat, Open_Sans } from "next/font/google";

import { Analytics } from "@vercel/analytics/next";
import { createAnonServerClient } from "../utils/supabase/server";
import { getNavigationItems } from "../lib/navigation";

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-heading-default",
  weight: ["400", "500", "600", "700"],
});

const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body-default",
  weight: ["400", "500", "600", "700"],
});

const DEFAULT_TITLE = "Your Agency";
const DEFAULT_DESCRIPTION = "Professional web solutions for growing businesses";
const DEFAULT_HEADING_FONT =
  'var(--font-heading-default), "Montserrat", sans-serif';
const DEFAULT_BODY_FONT = 'var(--font-body-default), "Open Sans", sans-serif';

export async function generateMetadata(): Promise<Metadata> {
  let icons: Metadata["icons"] | undefined = undefined;
  let title = DEFAULT_TITLE;
  let description = DEFAULT_DESCRIPTION;
  let siteName: string | undefined = undefined;
  let canonicalUrl: string | undefined = undefined;
  let ogTitle: string | undefined = undefined;
  let ogDescription: string | undefined = undefined;
  let ogImageUrl: string | undefined = undefined;
  let twitterCard: string | undefined = undefined;
  let twitterSite: string | undefined = undefined;
  try {
    const supabase = createAnonServerClient();
    const { data, error } = await supabase
      .from("sections")
      .select("data")
      .eq("id", "settings")
      .single();
    const settings: any = !error ? data?.data : undefined;
    const faviconUrl = settings?.faviconUrl as string | undefined;
    if (faviconUrl) {
      icons = {
        icon: [{ url: faviconUrl }],
        shortcut: [{ url: faviconUrl }],
        apple: [{ url: faviconUrl }],
      } as NonNullable<Metadata["icons"]>;
    }
    if (settings) {
      title = (settings.seoTitle as string) || title;
      description = (settings.seoDescription as string) || description;
      siteName = (settings.siteName as string) || undefined;
      canonicalUrl = (settings.canonicalUrl as string) || undefined;
      ogTitle = (settings.ogTitle as string) || title;
      ogDescription = (settings.ogDescription as string) || description;
      ogImageUrl = (settings.ogImageUrl as string) || undefined;
      twitterCard = (settings.twitterCard as string) || "summary_large_image";
      twitterSite = (settings.twitterSite as string) || undefined;
    }
  } catch {}
  // Normalize twitter card to allowed union
  const card: "summary" | "summary_large_image" | "player" | "app" =
    twitterCard === "summary" ||
    twitterCard === "player" ||
    twitterCard === "app"
      ? (twitterCard as any)
      : "summary_large_image";

  return {
    title,
    description,
    icons,
    openGraph: {
      title: ogTitle || title,
      description: ogDescription || description,
      siteName: siteName || title,
      url: canonicalUrl,
      images: ogImageUrl ? [{ url: ogImageUrl }] : undefined,
      type: "website",
    },
    twitter: {
      card,
      site: twitterSite,
      title: ogTitle || title,
      description: ogDescription || description,
      images: ogImageUrl ? [ogImageUrl] : undefined,
    },
    alternates: canonicalUrl ? { canonical: canonicalUrl } : undefined,
  } satisfies Metadata;
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Load dynamic settings (e.g., logoUrl, brandColor, typography, navigation, header, footer)
  let logoUrl: string | undefined = undefined;
  let brandColor: string = "#C62828"; // Default brand color
  let buttonColor: string = brandColor;
  let headingFont: string = DEFAULT_HEADING_FONT;
  let bodyFont: string = DEFAULT_BODY_FONT;
  let headerData: any = undefined;
  let footerData: any = undefined;

  // Load navigation items server-side to prevent flash
  const navItems = await getNavigationItems();

  // Try to load from database with better error handling
  try {
    const supabase = createAnonServerClient();
    const { data, error } = await supabase
      .from("sections")
      .select("id, data")
      .in("id", ["settings", "brand", "header", "footer", "contact"]);

    if (!error && Array.isArray(data)) {
      const sectionsMap = new Map(data.map((row: any) => [row.id, row.data]));

      const settings = sectionsMap.get("settings") || {};
      const brand = sectionsMap.get("brand") || {};

      const isHex = (val: unknown): string | null =>
        typeof val === "string" && /^#[0-9A-Fa-f]{6}$/.test(val) ? val : null;

      const isFont = (val: unknown): string | null => {
        if (typeof val !== "string") return null;
        const trimmed = val.trim();
        if (!trimmed) return null;
        return /^[a-zA-Z0-9\s,"'\/\-:\(\)_]+$/.test(trimmed) ? trimmed : null;
      };

      const brandLogo =
        typeof brand.logoUrl === "string" && brand.logoUrl
          ? (brand.logoUrl as string)
          : undefined;
      const settingsLogo =
        typeof settings.logoUrl === "string" && settings.logoUrl
          ? (settings.logoUrl as string)
          : undefined;
      if (brandLogo) logoUrl = brandLogo;
      else if (settingsLogo) logoUrl = settingsLogo;

      const baseColor =
        isHex((brand as any).brandColor) ?? isHex((settings as any).brandColor);
      if (baseColor) {
        brandColor = baseColor;
      }

      const buttonOverride =
        isHex((brand as any).primaryButtonColor) ??
        isHex((settings as any).primaryButtonColor);
      buttonColor = buttonOverride ?? brandColor;

      const headingOverride =
        isFont((brand as any).headingFontFamily) ??
        isFont((settings as any).headingFontFamily);
      const bodyOverride =
        isFont((brand as any).bodyFontFamily) ??
        isFont((settings as any).bodyFontFamily);
      const legacyFont =
        isFont((brand as any).fontFamily) ??
        isFont((settings as any).fontFamily);

      if (headingOverride) headingFont = headingOverride;
      else if (legacyFont) headingFont = legacyFont;

      if (bodyOverride) bodyFont = bodyOverride;
      else if (legacyFont) bodyFont = legacyFont;

      headerData = sectionsMap.get("header");
      footerData = sectionsMap.get("footer");
      const contactData = sectionsMap.get("contact");

      // Merge contact data into footer data for convenience
      if (footerData && contactData) {
        footerData = { ...footerData, contact: contactData };
      } else if (contactData) {
        footerData = { contact: contactData };
      }
    }
  } catch (error) {
    // Silently fall back to defaults if database is unavailable
    console.log("Using default settings - database unavailable");
  }

  return (
    <html lang="en" className={`${montserrat.variable} ${openSans.variable}`}>
      <head>
        <style
          dangerouslySetInnerHTML={{
            __html: `:root { --brand-500: ${brandColor}; --button-primary: ${buttonColor}; --font-heading: ${headingFont}; --font-body: ${bodyFont}; }`,
          }}
        />
      </head>
      <body className="antialiased bg-white text-gray-900 dark:bg-neutral-950 dark:text-gray-100">
        <Analytics />
        <DynamicStyles />
        <Header logoUrl={logoUrl} navItems={navItems} headerData={headerData} />
        <main className="md:pb-0">{children}</main>
        <Footer footerData={footerData} />
        <MobileNav navItems={navItems} />
      </body>
    </html>
  );
}
