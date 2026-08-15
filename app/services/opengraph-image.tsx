import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "../../lib/og";

// Edge runtime — see app/opengraph-image.tsx for why.
export const runtime = "edge";

/**
 * Per-route share card for /services.
 *
 * Needed because this page sets its own `openGraph` block in metadata, and a
 * page-level openGraph object without `images` suppresses the root
 * opengraph-image. A route-segment image file restores it — and gets us a
 * card tailored to the page rather than the generic homepage one.
 */
export const alt =
  "Growth marketing services from MapleGrowth Digital";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function ServicesOpengraphImage() {
  return renderOgImage({
    eyebrow: "Growth Marketing Services",
    title: "Eight services. One accountable team.",
    subtitle:
      "SEO · Paid media · Web · Content · Brand · Strategy · Apps · E-commerce — scoped and run by us, built with specialist partners.",
  });
}
