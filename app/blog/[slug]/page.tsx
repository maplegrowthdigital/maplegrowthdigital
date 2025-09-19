import Image from "next/image";
import Script from "next/script";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "../../../components/Container";
import { ShapesBackdrop } from "../../../components/ShapesBackdrop";
import Link from "next/link";
import { Markdown, extractToc } from "../../../components/Markdown";
import { BlogNav } from "../../../components/BlogNav";
import { getPostBySlug, getAllPosts } from "../../../content/posts";
import { createAnonServerClient } from "../../../utils/supabase/server";

type Props = { params: { slug: string } };

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Try Supabase first
  try {
    const supabase = createAnonServerClient();
    const { data } = await supabase
      .from("posts")
      .select("title,excerpt,cover_image,published")
      .eq("slug", params.slug)
      .single();
    if (data && data.published) {
      return {
        title: data.title,
        description: data.excerpt || undefined,
        openGraph: {
          title: data.title,
          description: data.excerpt || undefined,
          images: data.cover_image ? [{ url: data.cover_image }] : undefined,
          type: "article",
        },
        twitter: {
          card: "summary_large_image",
          title: data.title,
          description: data.excerpt || undefined,
          images: data.cover_image ? [data.cover_image] : undefined,
        },
      };
    }
  } catch {}
  const post = getPostBySlug(params.slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.coverImage ? [{ url: post.coverImage }] : undefined,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: post.coverImage ? [post.coverImage] : undefined,
    },
  };
}

export default async function BlogPost({ params }: Props) {
  let post = getPostBySlug(params.slug);
  try {
    const supabase = createAnonServerClient();
    const { data } = await supabase
      .from("posts")
      .select(
        "slug,title,excerpt,content_md,cover_image,author,tags,date,published,audio_url"
      )
      .eq("slug", params.slug)
      .single();
    if (data && data.published) {
      post = {
        slug: data.slug,
        title: data.title,
        date: data.date,
        author: data.author ?? undefined,
        excerpt: data.excerpt ?? "",
        coverImage: data.cover_image ?? undefined,
        tags: Array.isArray(data.tags) ? data.tags : undefined,
        content: [],
        contentMd: data.content_md ?? undefined,
        audioUrl: data.audio_url ?? undefined,
      } as any;
    }
  } catch {}
  if (!post) return notFound();

  const jsonld = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    datePublished: post.date,
    image: post.coverImage
      ? [{ "@type": "ImageObject", url: post.coverImage }]
      : undefined,
  } as any;

  const toc = post.contentMd ? extractToc(post.contentMd) : [];
  const all = getAllPosts();
  const idx = all.findIndex((p) => p.slug === post.slug);
  const prev =
    idx >= 0 && idx + 1 < all.length
      ? { slug: all[idx + 1].slug, title: all[idx + 1].title }
      : undefined;
  const next =
    idx > 0
      ? { slug: all[idx - 1].slug, title: all[idx - 1].title }
      : undefined;

  return (
    <main className="bg-white text-gray-900 dark:bg-neutral-950 dark:text-gray-100">
      <Script
        id="jsonld-article"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonld) }}
      />
      <article>
        <header className="pt-10 sm:pt-12">
          <Container>
            <div className="relative overflow-hidden rounded-3xl border border-brand-500/30 bg-white px-6 py-8 shadow-md sm:p-10 dark:bg-neutral-950">
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand-500/5 to-transparent" />
              <ShapesBackdrop />
              <nav
                aria-label="Breadcrumb"
                className="text-xs text-gray-600 dark:text-gray-400"
              >
                <ol className="flex items-center gap-2">
                  <li>
                    <Link
                      href="/"
                      className="hover:text-gray-900 dark:hover:text-gray-200"
                    >
                      Home
                    </Link>
                  </li>
                  <li aria-hidden>›</li>
                  <li>
                    <Link
                      href="/blog"
                      className="hover:text-gray-900 dark:hover:text-gray-200"
                    >
                      Blog
                    </Link>
                  </li>
                  <li aria-hidden>›</li>
                  <li className="text-gray-900 dark:text-gray-100 truncate max-w-[60vw] sm:max-w-none">
                    {post.title}
                  </li>
                </ol>
              </nav>
              <span className="chip-brand mt-3 inline-block">Blog</span>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                {post.title}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
                <span>
                  {new Date(post.date).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                {post.author && (
                  <>
                    <span className="h-1 w-1 rounded-full bg-brand-500" />
                    <span>By {post.author}</span>
                  </>
                )}
                {Array.isArray(post.tags) && post.tags.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-brand-500" />
                    {post.tags.map((t) => (
                      <span key={t} className="chip">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Container>
          {/* Featured image moved into left column below */}
        </header>
        <section className="pb-16 pt-8">
          <Container>
            <div className="grid gap-8 lg:grid-cols-12">
              <div className="lg:col-span-8">
                {post.coverImage && (
                  <div className="relative mb-6 aspect-[16/9] overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 shadow-sm dark:border-gray-800 dark:bg-neutral-900">
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                {post.audioUrl && (
                  <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/5">
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                      Listen
                    </div>
                    <audio
                      controls
                      preload="none"
                      src={post.audioUrl}
                      className="w-full"
                    >
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                )}
                {post.contentMd ? (
                  <Markdown content={post.contentMd} />
                ) : (
                  <div className="article-content">
                    {post.content.map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                )}
              </div>
              <aside className="lg:col-span-4">
                <div className="sticky top-24 space-y-6">
                  {toc.length > 0 && (
                    <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/5">
                      <div className="text-sm font-semibold">On this page</div>
                      <ul className="mt-3 space-y-2 text-sm">
                        {toc.map((h, i) => (
                          <li key={i} className={h.level === 3 ? "ml-3" : ""}>
                            <a
                              href={`#${h.id}`}
                              className="text-gray-700 hover:text-brand-500 dark:text-gray-200"
                            >
                              {h.text}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {Array.isArray(post.tags) && post.tags.length > 0 && (
                    <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/5">
                      <div className="text-sm font-semibold">Tags</div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {post.tags.map((t) => (
                          <span key={t} className="chip">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {(() => {
                    const recent = getAllPosts()
                      .filter((p) => p.slug !== post.slug)
                      .slice(0, 5);
                    if (recent.length === 0) return null;
                    return (
                      <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/5">
                        <div className="text-sm font-semibold">
                          Recent posts
                        </div>
                        <ul className="mt-3 space-y-2 text-sm">
                          {recent.map((r) => (
                            <li
                              key={r.slug}
                              className="flex items-start justify-between gap-3"
                            >
                              <Link
                                href={`/blog/${r.slug}`}
                                className="text-gray-800 hover:underline dark:text-gray-200"
                              >
                                {r.title}
                              </Link>
                              <span className="shrink-0 text-xs text-gray-500 dark:text-gray-400">
                                {new Date(r.date).toLocaleDateString(
                                  undefined,
                                  {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  }
                                )}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })()}
                  <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/5">
                    <div className="text-sm font-semibold">Stay in touch</div>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                      Like what you’re reading? Book a quick call or reach out.
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Link href="#contact" className="btn-secondary">
                        Contact
                      </Link>
                      <Link href="#call" className="btn-primary">
                        Book a call
                      </Link>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </Container>
        </section>
      </article>
      <BlogNav prev={prev} next={next} />
    </main>
  );
}
