import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "../../../lib/og";
import { POSTS_INDEX } from "../../../lib/posts-index.generated";
import { PILLARS, isPillar } from "../../../lib/post-format";

/**
 * Per-post share card — Edge runtime, same as every other OG route here
 * (those are proven in production). Edge has no filesystem, so the post
 * metadata comes from lib/posts-index.generated.ts, written by
 * scripts/posts-index.mjs before each build. The Node-runtime alternative
 * was rejected: next/og's Node build mangles its font path on Windows and
 * can't be statically generated in Next 14.
 */
export const runtime = "edge";

export const alt = "MapleGrowth Digital guide";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function PostOpengraphImage({
  params,
}: {
  params: { slug: string };
}) {
  const post = POSTS_INDEX.find((p) => p.slug === params.slug);
  if (!post) {
    return renderOgImage({
      eyebrow: "Blog",
      title: "Marketing guides for Canadian businesses.",
    });
  }
  const pillar = isPillar(post.pillar) ? PILLARS[post.pillar].label : "Guide";
  return renderOgImage({
    eyebrow: `${pillar} · ${post.readingMinutes} min read`,
    title: post.title,
    subtitle: post.description,
  });
}
