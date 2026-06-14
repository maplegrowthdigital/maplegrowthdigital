import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "../lib/og";

// next/og's ImageResponse (Satori + resvg WASM) is built for the Edge
// runtime — this is the one place Edge is the right call (isolated image
// generation, not app compute). Avoids the build-time prerender error.
export const runtime = "edge";

// App-Router metadata image convention. Generates /opengraph-image for the
// homepage (and cascades to any child route without its own). To tailor a
// specific route, add an `opengraph-image.tsx` in that segment that calls
// renderOgImage({ title, subtitle }).
export const alt = "MapleGrowth Digital — Canadian growth marketing agency";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function OpengraphImage() {
  return renderOgImage();
}
