import Link from "next/link";
import type { Founder } from "../../content/founders";
import { formatDate, type PostMeta, type TocItem } from "../../lib/post-format";

/**
 * The article anatomy around an MDX body — byline with reviewer and dates,
 * the AI-use disclosure, table of contents, key takeaways, references, and
 * the author box. All Server Components; no client JS.
 */

export function PostByline({
  post,
  author,
  reviewer,
}: {
  post: PostMeta;
  author: Founder;
  reviewer?: Founder;
}) {
  return (
    <div className="post__meta">
      <p className="post__byline">
        Written by <Link href="/about">{author.name}</Link>, {author.role}
        {reviewer && (
          <>
            <span aria-hidden="true"> · </span>
            Reviewed by <Link href="/about">{reviewer.name}</Link>, {reviewer.role}
          </>
        )}
      </p>
      <p className="post__dates">
        Published <time dateTime={post.date}>{formatDate(post.date)}</time>
        <span aria-hidden="true"> · </span>
        Last reviewed{" "}
        <time dateTime={post.updated ?? post.date}>
          {formatDate(post.updated ?? post.date)}
        </time>
        <span aria-hidden="true"> · </span>
        <span>{post.readingMinutes} min read</span>
      </p>
      {/* This sentence must stay true to the actual process in
          app/editorial-standards — it is a public commitment. */}
      <p className="post__disclosure">
        AI tools assisted with research, drafting, and formatting. The facts
        come from the founders&rsquo; own work, and the named author approved
        every claim before publication.{" "}
        <Link href="/editorial-standards">How we create and review content</Link>.
      </p>
    </div>
  );
}

export function TableOfContents({ items }: { items: TocItem[] }) {
  if (items.length < 3) return null;
  return (
    <nav className="post__toc" aria-label="On this page">
      <p className="post__toc-title">On this page</p>
      <ol>
        {items.map((it, i) => (
          <li key={it.id}>
            <a href={`#${it.id}`}>
              <span className="post__toc-num">
                {String(i + 1).padStart(2, "0")}
              </span>
              {it.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function KeyTakeaways({ items }: { items: string[] }) {
  if (items.length === 0) return null;
  return (
    <aside className="post__takeaways" aria-labelledby="key-takeaways">
      <h2 id="key-takeaways">Key takeaways</h2>
      <ul>
        {items.map((t, i) => (
          <li key={i}>{t}</li>
        ))}
      </ul>
    </aside>
  );
}

export function References({
  sources,
}: {
  sources: { title: string; url: string }[];
}) {
  if (sources.length === 0) return null;
  return (
    <section className="post__refs" aria-labelledby="references">
      <h2 id="references">References</h2>
      <ol>
        {sources.map((s) => (
          <li key={s.url}>
            <a href={s.url} target="_blank" rel="noopener noreferrer">
              {s.title}
            </a>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function AuthorBox({ author }: { author: Founder }) {
  return (
    <aside className="post__author" aria-label="About the author">
      <span className="section-label">
        <span className="dot" />
        <span>About the author</span>
      </span>
      <p className="post__author-name">
        {author.name}
        <span className="post__author-role">{author.jobTitle}</span>
      </p>
      <p className="post__author-bio">
        {author.stance}
        {author.extra ? ` ${author.extra}` : ""}
      </p>
      <Link href="/about" className="btn btn--link">
        <span>More about the founders</span>
      </Link>
    </aside>
  );
}
