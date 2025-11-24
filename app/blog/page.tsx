import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getAllBlogContent } from "../../content/podcasts";
import { Container } from "../../components/Container";
import { BreadcrumbSchema } from "../../components/BreadcrumbSchema";
import { generateBreadcrumbSchema } from "../../lib/breadcrumbs";

export const metadata: Metadata = {
  title: "Blog & Podcasts",
  description: "Insights on design, development, and product from MapleGrowth.",
};

export default function BlogIndex() {
  const content = getAllBlogContent();
  const breadcrumbSchema = generateBreadcrumbSchema("/blog");

  return (
    <>
      <BreadcrumbSchema schema={breadcrumbSchema} />
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
              Blog & Podcasts
            </h1>
            <p className="mt-3 max-w-2xl text-gray-600 dark:text-gray-300">
              Articles and episodes on building, shipping, and scaling great
              sites and products.
            </p>
          </Container>
        </section>
        <section className="pb-16">
          <Container>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {content.map((item) => {
                const isPodcast = item.type === "podcast";
                const baseUrl = isPodcast ? "/podcast" : "/blog";

                return (
                  <article
                    key={`${item.type}-${item.slug}`}
                    className="card overflow-hidden transition hover:shadow-md flex h-full flex-col"
                  >
                    {item.coverImage && (
                      <div className="relative aspect-[4/3] bg-gray-50 dark:bg-neutral-900">
                        <Image
                          src={item.coverImage}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                        {isPodcast && (
                          <div className="absolute bottom-2 right-2 rounded-full bg-brand-500 px-3 py-1 text-xs font-semibold text-white">
                            🎙️ Podcast
                          </div>
                        )}
                      </div>
                    )}
                    <div className="p-4 flex flex-1 flex-col">
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        {isPodcast && item.episodeNumber && (
                          <span className="rounded bg-brand-500/10 px-2 py-0.5 font-medium text-brand-600 dark:text-brand-400">
                            Episode {item.episodeNumber}
                          </span>
                        )}
                        <span>
                          {new Date(item.date).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                        {isPodcast && item.duration && (
                          <>
                            {" · "}
                            <span>{item.duration}</span>
                          </>
                        )}
                        {!isPodcast && item.author && (
                          <>
                            {" · "}
                            <span>{item.author}</span>
                          </>
                        )}
                      </div>
                      <h2 className="mt-2 text-lg font-semibold">
                        <Link
                          href={`${baseUrl}/${item.slug}`}
                          className="hover:underline"
                        >
                          {item.title}
                        </Link>
                      </h2>
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                        {item.excerpt}
                      </p>
                      {item.tags && item.tags.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {item.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-neutral-800 dark:text-gray-400"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="mt-auto pt-4">
                        <Link
                          href={`${baseUrl}/${item.slug}`}
                          className="btn-primary"
                        >
                          {isPodcast ? "Listen now" : "Read more"}
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </Container>
        </section>
      </main>
    </>
  );
}
