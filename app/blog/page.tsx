import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getAllPosts } from "../../content/posts";
import { Container } from "../../components/Container";

export const metadata: Metadata = {
  title: "Blog",
  description: "Insights on design, development, and product from MapleGrowth.",
};

function estimateReadMinutes(post: {
  content?: string[];
  contentMd?: string;
}): number {
  let text = "";
  if (post.contentMd && typeof post.contentMd === "string")
    text = post.contentMd;
  else if (Array.isArray(post.content)) text = post.content.join(" ");
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const wpm = 220;
  return Math.max(1, Math.round(words / wpm));
}

export default function BlogIndex() {
  const posts = getAllPosts();
  return (
    <main className="bg-white text-gray-900 dark:bg-neutral-950 dark:text-gray-100">
      <section className="relative overflow-hidden pb-10 pt-16 sm:pt-20">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-brand-500/5 via-white to-white dark:via-neutral-950 dark:to-neutral-950" />
        <Container>
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
              <li className="text-gray-900 dark:text-gray-100">Blog</li>
            </ol>
          </nav>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">
            Blog
          </h1>
          <p className="mt-3 max-w-2xl text-gray-600 dark:text-gray-300">
            Notes on building, shipping, and scaling great sites and products.
          </p>
        </Container>
      </section>
      <section className="pb-16">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="card overflow-hidden transition hover:shadow-md flex h-full flex-col"
              >
                {post.coverImage && (
                  <div className="relative aspect-[4/3] bg-gray-50 dark:bg-neutral-900">
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="p-4 flex flex-1 flex-col">
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(post.date).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                    {" · "}
                    {estimateReadMinutes(post)} min read
                  </div>
                  <h2 className="mt-1 text-lg font-semibold">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="hover:underline"
                    >
                      {post.title}
                    </Link>
                  </h2>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                    {post.excerpt}
                  </p>
                  <div className="mt-auto pt-4">
                    <Link href={`/blog/${post.slug}`} className="btn-primary">
                      Read more
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>
    </main>
  );
}
