/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [],
  },
  async headers() {
    const securityHeaders = [
      {
        key: "X-Frame-Options",
        value: "SAMEORIGIN",
      },
      {
        key: "X-Content-Type-Options",
        value: "nosniff",
      },
      {
        key: "Referrer-Policy",
        value: "strict-origin-when-cross-origin",
      },
      {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=()",
      },
      {
        key: "Strict-Transport-Security",
        value: "max-age=31536000; includeSubDomains",
      },
      {
        key: "Content-Security-Policy",
        value: [
          "default-src 'self'",
          // Cloudflare Turnstile loads its API script + renders an iframe.
          // Vercel Analytics loads /_vercel/insights/script.js from va.vercel-scripts.com.
          // GTM is optional (only if NEXT_PUBLIC_GTM_ID is set).
          "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://challenges.cloudflare.com https://va.vercel-scripts.com",
          "style-src 'self' 'unsafe-inline'",
          "font-src 'self' data:",
          "img-src 'self' data: https:",
          "connect-src 'self' https://www.google-analytics.com https://www.googletagmanager.com https://challenges.cloudflare.com https://va.vercel-scripts.com",
          "frame-src 'self' https://www.googletagmanager.com https://challenges.cloudflare.com",
          "base-uri 'self'",
        ].join("; "),
      },
    ];

    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
