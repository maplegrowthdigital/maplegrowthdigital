import { ImageResponse } from "next/og";

/**
 * Shared Open Graph / Twitter image renderer.
 *
 * App-Router metadata image files (`app/opengraph-image.tsx`,
 * `app/twitter-image.tsx`, and any per-route variants) call `renderOgImage`
 * so every page gets a programmatically-generated 1200×630 share card.
 * Pass `{ eyebrow, title, subtitle }` to tailor per page.
 *
 * Uses Satori's built-in sans (no font fetch) for reliability — the brand
 * comes through via the ink/paper/maple-red palette + the leaf motif. If we
 * want Fraunces here later, bundle a .ttf and pass it via `fonts`.
 */

export const OG_SIZE = { width: 1200, height: 630 } as const;
export const OG_CONTENT_TYPE = "image/png";

const INK = "#0d0c0a";
const PAPER = "#f4ede2";
const MUTED = "#8a847c";
const ACCENT = "#C62828";

interface OgParams {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
}

export function renderOgImage({
  eyebrow = "Canadian Growth Marketing Agency",
  title = "Smart marketing. Measurable growth.",
  subtitle = "SEO · Paid media · Web · Content — work you can see, measure, and trust.",
}: OgParams = {}) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: INK,
          padding: "72px 80px",
          position: "relative",
          fontFamily: "sans-serif",
        }}
      >
        {/* Decorative maple leaf, large, bleeding off the right edge */}
        <div
          style={{
            position: "absolute",
            right: -90,
            top: 90,
            display: "flex",
            opacity: 0.16,
          }}
        >
          <svg width="520" height="520" viewBox="0 0 200 200">
            <path
              d="M100 20c8 28 28 48 56 56-28 8-48 28-56 56-8-28-28-48-56-56 28-8 48-28 56-56Z"
              fill={ACCENT}
            />
          </svg>
        </div>

        {/* Top: brand lockup */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: 9999,
              background: ACCENT,
            }}
          />
          <div
            style={{
              color: PAPER,
              fontSize: 26,
              fontWeight: 700,
              letterSpacing: 2,
            }}
          >
            MAPLEGROWTH DIGITAL
          </div>
        </div>

        {/* Middle: eyebrow + headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18, maxWidth: 880 }}>
          <div
            style={{
              color: MUTED,
              fontSize: 22,
              letterSpacing: 4,
              textTransform: "uppercase",
            }}
          >
            {eyebrow}
          </div>
          <div
            style={{
              color: PAPER,
              fontSize: 72,
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: -1.5,
            }}
          >
            {title}
          </div>
        </div>

        {/* Bottom: subtitle + url */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div
            style={{
              width: 96,
              height: 4,
              background: ACCENT,
              borderRadius: 9999,
            }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div style={{ color: MUTED, fontSize: 24, maxWidth: 760, lineHeight: 1.4 }}>
              {subtitle}
            </div>
            <div style={{ color: PAPER, fontSize: 22, fontWeight: 600 }}>
              maplegrowthdigital.ca
            </div>
          </div>
        </div>
      </div>
    ),
    { ...OG_SIZE }
  );
}
