"use client";

import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";

interface AnalyticsProps {
  googleAnalyticsId?: string;
}

export function AnalyticsProvider({ googleAnalyticsId }: AnalyticsProps) {
  return (
    <>
      {/* Vercel Analytics */}
      <Analytics />

      {/* Google Analytics */}
      {googleAnalyticsId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${googleAnalyticsId}', {
                page_title: document.title,
                page_location: window.location.href,
              });
            `}
          </Script>
        </>
      )}
    </>
  );
}
