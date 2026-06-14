import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "../lib/og";

// Edge runtime — see app/opengraph-image.tsx for the rationale.
export const runtime = "edge";

// Twitter/X share card. Same render as the OG image (summary_large_image).
export const alt = "MapleGrowth Digital — Canadian growth marketing agency";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function TwitterImage() {
  return renderOgImage();
}
