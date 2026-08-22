import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { isFounderKey } from "../content/founders";
import {
  isPillar,
  readingMinutes,
  type PostMeta,
  type PostSource,
} from "./post-format";

export type { PostMeta } from "./post-format";

/**
 * Blog post loader — server-only (uses the filesystem).
 *
 * Posts are .mdx files in content/posts/ with frontmatter (see the README
 * there). Invalid frontmatter throws at build time on purpose: a post with
 * a bad author key or pillar would silently produce wrong structured data,
 * and failing the build is the cheapest place to catch that.
 *
 * A post is published when it is not `draft: true` AND its date is not in
 * the future. Publishing is "commit + deploy"; to schedule, set a future
 * date and redeploy on the day.
 */

export interface Post extends PostMeta {
  content: string;
}

const POSTS_DIR = path.join(process.cwd(), "content", "posts");
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function readPostFile(file: string): Post | null {
  const slug = file.replace(/\.mdx$/, "");
  const raw = fs.readFileSync(path.join(POSTS_DIR, file), "utf8");
  const { data, content } = matter(raw);

  // Explicitly annotated so TypeScript's control-flow analysis treats a
  // call as terminating and narrows the guarded values afterwards.
  const fail: (msg: string) => never = (msg) => {
    throw new Error(`content/posts/${file}: ${msg}`);
  };

  if (data.draft === true) return null;
  if (typeof data.title !== "string" || !data.title.trim()) fail("missing title");
  if (typeof data.description !== "string" || !data.description.trim())
    fail("missing description");
  if (data.description.length > 160)
    fail(`description is ${data.description.length} chars (max 160)`);
  if (typeof data.date !== "string" || !ISO_DATE.test(data.date))
    fail("date must be a quoted YYYY-MM-DD string");
  if (data.updated !== undefined && !ISO_DATE.test(String(data.updated)))
    fail("updated must be a quoted YYYY-MM-DD string");
  if (!isFounderKey(data.author))
    fail(`author must be one of rohan | tom | thomas (got "${data.author}")`);
  if (data.reviewer !== undefined && !isFounderKey(data.reviewer))
    fail(`reviewer must be one of rohan | tom | thomas (got "${data.reviewer}")`);
  if (!isPillar(data.pillar))
    fail(
      `pillar must be seo | ppc | web | content | brand | strategy (got "${data.pillar}")`
    );
  if (typeof data.keyword !== "string" || !data.keyword.trim())
    fail("missing keyword (the validated target from CONTENT_TOPIC_MAP.md)");

  const takeaways: string[] = [];
  if (data.takeaways !== undefined) {
    if (!Array.isArray(data.takeaways) || !data.takeaways.every((t: unknown) => typeof t === "string"))
      fail("takeaways must be a list of strings");
    if (data.takeaways.length > 6) fail("takeaways: keep it to 6 or fewer");
    takeaways.push(...data.takeaways.map((t: string) => t.trim()).filter(Boolean));
  }

  const sources: PostSource[] = [];
  if (data.sources !== undefined) {
    if (!Array.isArray(data.sources)) fail("sources must be a list of { title, url }");
    for (const s of data.sources as unknown[]) {
      const o = s as Record<string, unknown>;
      if (typeof o?.title !== "string" || typeof o?.url !== "string" || !/^https?:\/\//.test(o.url))
        fail("each source needs a title and an http(s) url");
      sources.push({ title: o.title.trim(), url: o.url.trim() });
    }
  }

  // Scheduled for the future → not published yet.
  const today = new Date().toISOString().slice(0, 10);
  if (data.date > today) return null;

  return {
    slug,
    title: data.title.trim(),
    description: data.description.trim(),
    date: data.date,
    updated: data.updated ? String(data.updated) : undefined,
    author: data.author,
    reviewer: data.reviewer,
    pillar: data.pillar,
    keyword: data.keyword.trim(),
    takeaways,
    sources,
    readingMinutes: readingMinutes(content),
    content,
  };
}

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map(readPostFile)
    .filter((p): p is Post => p !== null)
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
    .map(({ content: _content, ...meta }) => meta);
}

export function getPost(slug: string): Post | null {
  if (!/^[a-z0-9-]+$/.test(slug)) return null;
  const file = `${slug}.mdx`;
  if (!fs.existsSync(path.join(POSTS_DIR, file))) return null;
  return readPostFile(file);
}
