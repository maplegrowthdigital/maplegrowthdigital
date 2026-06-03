"use client";

import Script from "next/script";

interface AnalyticsProps {
  googleAnalyticsId?: string;
  googleTagManagerId?: string;
}

// Strict format validators — both Google products use stable ID shapes:
//   GTM container IDs:      GTM-XXXXXXX  (uppercase alphanum after the dash)
//   GA4 measurement IDs:    G-XXXXXXXXXX
//   Universal Analytics:    UA-NNNNNNNN-N  (legacy, kept for compat)
//
// Reject anything that doesn't match before injecting into a <script>.
// This guarantees no attacker-controlled chars reach a JS context even
// if someone misconfigures the env var.
const GTM_ID = /^GTM-[A-Z0-9]+$/;
const GA_ID = /^(G-[A-Z0-9]+|UA-\d+-\d+)$/;

const isValidGtm = (s: string | undefined): s is string =>
  typeof s === "string" && GTM_ID.test(s);
const isValidGa = (s: string | undefined): s is string =>
  typeof s === "string" && GA_ID.test(s);

export function AnalyticsProvider({
  googleAnalyticsId,
  googleTagManagerId,
}: AnalyticsProps) {
  const validGtm = isValidGtm(googleTagManagerId) ? googleTagManagerId : null;
  const validGa = isValidGa(googleAnalyticsId) ? googleAnalyticsId : null;

  return (
    <>
      {/* Google Tag Manager */}
      {validGtm && (
        <>
          {/* Validated against GTM_ID regex above before interpolation. */}
          <Script
            id="google-tag-manager"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${validGtm}');
              `,
            }}
          />
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${validGtm}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        </>
      )}

      {/* Google Analytics */}
      {validGa && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${validGa}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${validGa}', {
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
