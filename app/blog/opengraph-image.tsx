import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "../../lib/og";

// Edge runtime — see app/opengraph-image.tsx for why.
export const runtime = "edge";

// Needed because the index sets its own `openGraph` block; without a
// segment-level image that suppresses the root card.
export const alt = "Marketing guides for Canadian businesses — MapleGrowth Digital";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function BlogOpengraphImage() {
  return renderOgImage({
    eyebrow: "Blog",
    title: "Marketing guides for Canadian businesses.",
    subtitle:
      "What things cost, what works, and how to choose who does it — from the founders, no filler.",
  });
}
