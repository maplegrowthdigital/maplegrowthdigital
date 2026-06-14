import type { Metadata } from "next";
import "./globals.css";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { MobileNav } from "../components/MobileNav";
import { Fraunces, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { AnalyticsProvider } from "../components/Analytics";
import { getNavigationItems } from "../lib/navigation";
import { config } from "../content/config";
import Script from "next/script";
import { LenisProvider } from "../components/global/LenisProvider";
import { ModalProvider } from "../components/global/ModalProvider";
import { CookieBanner } from "../components/global/CookieBanner";

// === MGD homepage fonts (Fraunces display + Inter body) ===
// Both are VARIABLE fonts on Google Fonts. For next/font/google, variable
// fonts want `weight: "variable"` (or no weight at all) — specifying static
// weights causes silent load failure.
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans-mgd",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = config;

  return {
    metadataBase: new URL(settings.canonicalUrl),
    title: settings.seoTitle,
    description: settings.seoDescription,
    icons: settings.faviconUrl
      ? {
          icon: [{ url: settings.faviconUrl }],
          shortcut: [{ url: settings.faviconUrl }],
          apple: [{ url: settings.faviconUrl }],
        }
      : undefined,
    // NOTE: og:image / twitter:image are auto-injected by the file-based
    // metadata convention (app/opengraph-image.tsx + app/twitter-image.tsx),
    // so we intentionally don't set `images` here.
    openGraph: {
      title: settings.ogTitle,
      description: settings.ogDescription,
      siteName: settings.siteName,
      url: settings.canonicalUrl,
      type: "website",
    },
    twitter: {
      card: settings.twitterCard as any,
      site: settings.twitterSite,
      title: settings.ogTitle,
      description: settings.ogDescription,
    },
    alternates: settings.canonicalUrl
      ? { canonical: settings.canonicalUrl }
      : undefined,
  } satisfies Metadata;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { settings } = config;
  const navItems = getNavigationItems();

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${fraunces.variable} ${inter.variable}`}
    >
      <head>
        {/* Theme preload — runs synchronously before paint to set [data-theme]
            so there's no flash of the wrong theme on initial render. */}
        <Script
          id="mgd-theme-preload"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem("mgd:theme");var p=window.matchMedia("(prefers-color-scheme: light)").matches;var t=s||(p?"light":"dark");document.documentElement.dataset.theme=t;}catch(e){}})();`,
          }}
        />
        {/* JSON-LD schema (org / local business) from static config */}
        <Script
          id="jsonld-schema"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(config.schema) }}
        />
      </head>
      <body className="antialiased">
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>
        <a className="skip-link" href="#site-navigation">
          Skip to primary navigation
        </a>
        <a className="skip-link" href="#site-footer">
          Skip to footer
        </a>
        <AnalyticsProvider
          googleAnalyticsId={settings.googleAnalyticsId}
          googleTagManagerId={settings.googleTagManagerId}
        />
        <LenisProvider>
          <ModalProvider>
            <Header navItems={navItems} />
            <main id="main-content" className="md:pb-0">
              {children}
            </main>
            <Footer />
            <MobileNav navItems={navItems} />
            <CookieBanner />
          </ModalProvider>
        </LenisProvider>
        {/* Vercel Analytics — Web Vitals + page-view tracking.
            Loaded last so it doesn't compete with interactive content. */}
        <Analytics />
      </body>
    </html>
  );
}
