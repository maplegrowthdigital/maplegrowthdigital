import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "../../lib/og";

// Edge runtime — see app/opengraph-image.tsx for why.
export const runtime = "edge";

/**
 * Per-route share card for /about.
 *
 * Needed because this page sets its own `openGraph` block in metadata, and a
 * page-level openGraph object without `images` suppresses the root
 * opengraph-image. A route-segment image file restores it — and gets us a
 * card tailored to the page rather than the generic homepage one.
 */
export const alt = "About MapleGrowth Digital — our story, team, and partners";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function AboutOpengraphImage() {
  return renderOgImage({
    eyebrow: "About · Est. 2014",
    title: "The team behind MapleGrowth Digital.",
    subtitle:
      "A small, experienced team in Mississauga — delivering with specialist partners across Canada, the US, and Australia.",
  });
}
