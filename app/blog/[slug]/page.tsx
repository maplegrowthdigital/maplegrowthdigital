import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { config } from "../../../content/config";
import { FOUNDERS } from "../../../content/founders";
import { getAllPosts, getPost } from "../../../lib/posts";
import { PILLARS, extractToc } from "../../../lib/post-format";
import { mdxComponents } from "../../../components/blog/mdx-components";
import {
  AuthorBox,
  KeyTakeaways,
  PostByline,
  References,
  TableOfContents,
} from "../../../components/blog/ArticleParts";
import { GrainOverlay } from "../../../components/global/GrainOverlay";

const ORIGIN = config.getCanonicalUrl().replace(/\/$/, "");
const STRATEGY_CALL_URL =
  "https://tidycal.com/maplegrowthdigital/strategy-call";

interface Params {
  params: { slug: string };
}

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

// Only the slugs from generateStaticParams exist; anything else is a 404
// at build time rather than an on-demand render of a missing file.
export const dynamicParams = false;

export function generateMetadata({ params }: Params): Metadata {
  const post = getPost(params.slug);
  if (!post) return {};
  const url = `${ORIGIN}/blog/${post.slug}`;
  const author = FOUNDERS[post.author];
  return {
    title: `${post.title} | MapleGrowth`,
    description: post.description,
    alternates: { canonical: url },
    robots: { index: true, follow: true },
    openGraph: {
      title: post.title,
      description: post.description,
      url,
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.updated ?? post.date,
      authors: [author.name],
      section: PILLARS[post.pillar].label,
    },
  };
}

export default function BlogPostPage({ params }: Params) {
  const post = getPost(params.slug);
  if (!post) notFound();

  const url = `${ORIGIN}/blog/${post.slug}`;
  const author = FOUNDERS[post.author];
  const reviewer = post.reviewer ? FOUNDERS[post.reviewer] : undefined;
  const pillar = PILLARS[post.pillar];

  // "On this page": key takeaways (if any) → body H2s → references (if any).
  const toc = [
    ...(post.takeaways.length ? [{ id: "key-takeaways", text: "Key takeaways" }] : []),
    ...extractToc(post.content),
    ...(post.sources.length ? [{ id: "references", text: "References" }] : []),
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${url}#article`,
        url,
        mainEntityOfPage: url,
        headline: post.title,
        description: post.description,
        datePublished: post.date,
        dateModified: post.updated ?? post.date,
        inLanguage: "en-CA",
        keywords: post.keyword,
        // Author and reviewer resolve to the co-founder Person nodes in the
        // site-wide graph — the byline and the structured data are the same
        // people by construction (content/founders.ts).
        author: { "@id": author.id },
        ...(reviewer ? { reviewedBy: { "@id": reviewer.id } } : {}),
        publisher: { "@id": `${ORIGIN}/#organization` },
        about: { "@id": pillar.serviceId },
        image: `${url}/opengraph-image`,
        ...(post.sources.length
          ? {
              citation: post.sources.map((s) => ({
                "@type": "CreativeWork",
                name: s.title,
                url: s.url,
              })),
            }
          : {}),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${ORIGIN}/` },
          { "@type": "ListItem", position: 2, name: "Blog", item: `${ORIGIN}/blog` },
          { "@type": "ListItem", position: 3, name: post.title, item: url },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <GrainOverlay />

      <article className="post">
        <header className="post__head">
          <div className="post__eyebrow">
            <Link href="/blog" className="post__crumb">
              Blog
            </Link>
            <span aria-hidden="true">/</span>
            <Link href={pillar.href} className="post__pillar">
              {pillar.label}
            </Link>
          </div>
          <h1 className="post__title">{post.title}</h1>
          <p className="post__standfirst">{post.description}</p>
          <PostByline post={post} author={author} reviewer={reviewer} />
        </header>

        <div className="post__layout">
          <TableOfContents items={toc} />

          <div className="post__body">
            <KeyTakeaways items={post.takeaways} />
            <MDXRemote
              source={post.content}
              components={mdxComponents}
              // GitHub-flavoured markdown: pipe tables (the cost guides live
              // on them), strikethrough, task lists, bare-URL autolinks.
              options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
            />
            <References sources={post.sources} />
          </div>
        </div>

        <AuthorBox author={author} />

        <footer className="post__next">
          <div className="post__next-text">
            <span className="section-label">
              <span className="dot" />
              <span>Related service</span>
            </span>
            <p>
              This is the kind of work we do under{" "}
              <Link href={pillar.href}>{pillar.cta}</Link>. If it&rsquo;s the
              problem you&rsquo;re looking at, a call costs nothing and
              we&rsquo;ll tell you what we&rsquo;d prioritise.
            </p>
          </div>
          <div className="post__next-actions">
            <a
              className="btn btn--primary"
              href={STRATEGY_CALL_URL}
              target="_blank"
              rel="noreferrer"
            >
              <span>Book a strategy call</span>
              <span className="btn__arrow" aria-hidden="true">
                &rarr;
              </span>
            </a>
            <Link className="btn btn--link" href="/blog">
              <span>All guides</span>
            </Link>
          </div>
        </footer>
      </article>
    </>
  );
}
