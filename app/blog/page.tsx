import type { Metadata } from "next";
import Link from "next/link";
import { config } from "../../content/config";
import { FOUNDERS } from "../../content/founders";
import { getAllPosts } from "../../lib/posts";
import { PILLARS, formatDate } from "../../lib/post-format";
import { GrainOverlay } from "../../components/global/GrainOverlay";

const ORIGIN = config.getCanonicalUrl().replace(/\/$/, "");
const BLOG_URL = `${ORIGIN}/blog`;

const TITLE = "Marketing Guides for Canadian Businesses | MapleGrowth";
const DESCRIPTION =
  "Straight answers on what marketing costs, what works, and how to choose who does it — written by the founders of a Canadian growth marketing agency.";

export function generateMetadata(): Metadata {
  const hasPosts = getAllPosts().length > 0;
  return {
    title: TITLE,
    description: DESCRIPTION,
    alternates: { canonical: BLOG_URL },
    // An index with nothing on it is not worth indexing; flips to index
    // automatically on the build that ships the first post.
    robots: hasPosts
      ? { index: true, follow: true }
      : { index: false, follow: true },
    openGraph: {
      title: TITLE,
      description: DESCRIPTION,
      url: BLOG_URL,
      type: "website",
    },
  };
}

/**
 * Blog index. A Server Component with no GSAP on purpose: reading pages
 * should be fast and quiet. Editorial rows, not cards.
 */
export default function BlogIndexPage() {
  const posts = getAllPosts();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${BLOG_URL}#page`,
        url: BLOG_URL,
        name: "Marketing guides for Canadian businesses",
        description: DESCRIPTION,
        inLanguage: "en-CA",
        isPartOf: { "@id": `${ORIGIN}/#website` },
        about: { "@id": `${ORIGIN}/#organization` },
        breadcrumb: { "@id": `${BLOG_URL}#breadcrumb` },
        ...(posts.length
          ? {
              mainEntity: {
                "@type": "ItemList",
                itemListElement: posts.map((p, i) => ({
                  "@type": "ListItem",
                  position: i + 1,
                  url: `${BLOG_URL}/${p.slug}`,
                  name: p.title,
                })),
              },
            }
          : {}),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${BLOG_URL}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${ORIGIN}/` },
          { "@type": "ListItem", position: 2, name: "Blog", item: BLOG_URL },
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

      <div className="blog-page">
        <header className="blog-masthead">
          <div className="blog-masthead__inner">
            <div className="section-label">
              <span className="dot" />
              <span>Blog</span>
            </div>
            <h1 className="blog-masthead__title">
              Marketing guides for Canadian <em>businesses</em>.
            </h1>
            <p className="blog-masthead__lead">
              What things cost, what actually works, and how to choose who does
              it. Written by the founders, from the work &mdash; no guarantees,
              no filler.
            </p>
          </div>
        </header>

        <section className="blog-list-wrap" aria-label="All guides">
          {posts.length === 0 ? (
            <div className="blog-empty">
              <p className="blog-empty__title">The first guides are on their way.</p>
              <p className="blog-empty__body">
                Until then, the <Link href="/services">services page</Link>{" "}
                explains what we do and how we price it.
              </p>
            </div>
          ) : (
            <ol className="blog-list" role="list">
              {posts.map((p) => {
                const pillar = PILLARS[p.pillar];
                const author = FOUNDERS[p.author];
                return (
                  <li className="blog-row" key={p.slug}>
                    <div className="blog-row__meta">
                      <span className="blog-row__pillar">{pillar.label}</span>
                      <time dateTime={p.date}>{formatDate(p.date)}</time>
                      <span>{p.readingMinutes} min read</span>
                    </div>
                    <div className="blog-row__main">
                      <h2 className="blog-row__title">
                        <Link href={`/blog/${p.slug}`}>{p.title}</Link>
                      </h2>
                      <p className="blog-row__desc">{p.description}</p>
                      <p className="blog-row__by">By {author.name}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
        </section>
      </div>
    </>
  );
}
