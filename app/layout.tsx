import type { Metadata } from "next";
import "./globals.css";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { MobileNav } from "../components/MobileNav";
import { DynamicStyles } from "../components/DynamicStyles";
import localFont from "next/font/local";
import { AnalyticsProvider } from "../components/Analytics";
import { getNavigationItems } from "../lib/navigation";
import { config } from "../content/config";
import Script from "next/script";

const montserrat = localFont({
  src: [
    {
      path: "../public/fonts/Montserrat/Montserrat-VariableFont_wght.ttf",
      weight: "100 900",
      style: "normal",
    },
    {
      path: "../public/fonts/Montserrat/Montserrat-Italic-VariableFont_wght.ttf",
      weight: "100 900",
      style: "italic",
    },
  ],
  display: "swap",
  variable: "--font-heading-default",
});

const openSans = localFont({
  src: [
    {
      path: "../public/fonts/Open_Sans/OpenSans-VariableFont_wdth,wght.ttf",
      weight: "300 800",
      style: "normal",
    },
    {
      path: "../public/fonts/Open_Sans/OpenSans-Italic-VariableFont_wdth,wght.ttf",
      weight: "300 800",
      style: "italic",
    },
  ],
  display: "swap",
  variable: "--font-body-default",
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
    openGraph: {
      title: settings.ogTitle,
      description: settings.ogDescription,
      siteName: settings.siteName,
      url: settings.canonicalUrl,
      images: settings.ogImageUrl ? [{ url: settings.ogImageUrl }] : undefined,
      type: "website",
    },
    twitter: {
      card: settings.twitterCard as any,
      site: settings.twitterSite,
      title: settings.ogTitle,
      description: settings.ogDescription,
      images: settings.ogImageUrl ? [settings.ogImageUrl] : undefined,
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
  // Load configuration from static files
  const { brand, settings } = config;
  const navItems = getNavigationItems();

  // Apply brand configuration
  const brandColor = config.getBrandColor();
  const buttonColor = config.getButtonColor();
  const headingFont = config.getHeadingFont();
  const bodyFont = config.getBodyFont();
  const logoUrl = config.getLogo();

  return (
    <html lang="en" className={`${montserrat.variable} ${openSans.variable}`}>
      <head>
        <style
          dangerouslySetInnerHTML={{
            __html: `:root { 
              --brand-500: ${brandColor}; 
              --button-primary: ${buttonColor}; 
              --font-heading: ${headingFont}; 
              --font-body: ${bodyFont}; 
            }`,
          }}
        />
        {/* JSON-LD Schema */}
        <Script
          id="jsonld-schema"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(config.schema) }}
        />
      </head>
      <body className="antialiased bg-white text-gray-900 dark:bg-neutral-950 dark:text-gray-100">
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
        <DynamicStyles />
        <Header logoUrl={logoUrl} navItems={navItems} />
        <main id="main-content" className="md:pb-0">
          {children}
        </main>
        <Footer />
        <MobileNav navItems={navItems} />
      </body>
    </html>
  );
}
