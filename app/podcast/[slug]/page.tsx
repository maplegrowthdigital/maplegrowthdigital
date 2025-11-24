import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getPodcastBySlug, getAllPodcasts } from "../../../content/podcasts";
import { Container } from "../../../components/Container";
import { Markdown } from "../../../components/Markdown";
import { BreadcrumbSchema } from "../../../components/BreadcrumbSchema";
import { generateBreadcrumbSchema } from "../../../lib/breadcrumbs";

type Props = {
  params: { slug: string };
};

export async function generateStaticParams() {
  const podcasts = getAllPodcasts();
  return podcasts.map((podcast) => ({
    slug: podcast.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const podcast = getPodcastBySlug(params.slug);
  if (!podcast) return {};

  return {
    title: podcast.title,
    description: podcast.excerpt,
    openGraph: {
      title: podcast.title,
      description: podcast.excerpt,
      type: "music.song",
      images: podcast.coverImage ? [{ url: podcast.coverImage }] : undefined,
    },
  };
}

export default function PodcastEpisode({ params }: Props) {
  const podcast = getPodcastBySlug(params.slug);

  if (!podcast) {
    notFound();
  }

  const breadcrumbSchema = generateBreadcrumbSchema(
    `/podcast/${params.slug}`,
    podcast.title
  );

  return (
    <>
      <BreadcrumbSchema schema={breadcrumbSchema} />
      <main className="bg-white text-gray-900 dark:bg-neutral-950 dark:text-gray-100">
        {/* Header Section */}
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
                <li>
                  <Link
                    href="/blog"
                    className="hover:text-gray-900 dark:hover:text-gray-200"
                  >
                    Blog
                  </Link>
                </li>
                <li aria-hidden>›</li>
                <li className="text-gray-900 dark:text-gray-100">
                  {podcast.title}
                </li>
              </ol>
            </nav>

            <div className="mt-8 grid gap-8 lg:grid-cols-3">
              {/* Episode Info */}
              <div className="lg:col-span-2">
                <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                  {podcast.episodeNumber && (
                    <span className="rounded bg-brand-500/10 px-3 py-1 font-medium text-brand-600 dark:text-brand-400">
                      🎙️ Episode {podcast.episodeNumber}
                    </span>
                  )}
                  <span>
                    {new Date(podcast.date).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                  {podcast.duration && (
                    <>
                      <span>•</span>
                      <span>{podcast.duration}</span>
                    </>
                  )}
                </div>

                <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">
                  {podcast.title}
                </h1>

                {podcast.host && (
                  <p className="mt-4 text-gray-600 dark:text-gray-300">
                    Hosted by{" "}
                    <span className="font-medium">{podcast.host}</span>
                    {podcast.guests && podcast.guests.length > 0 && (
                      <>
                        {" "}
                        with{" "}
                        <span className="font-medium">
                          {podcast.guests.join(", ")}
                        </span>
                      </>
                    )}
                  </p>
                )}

                <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                  {podcast.excerpt}
                </p>

                {podcast.tags && podcast.tags.length > 0 && (
                  <div className="mt-6 flex flex-wrap gap-2">
                    {podcast.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded bg-gray-100 px-3 py-1 text-sm text-gray-600 dark:bg-neutral-800 dark:text-gray-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Cover Art */}
              {podcast.coverImage && (
                <div className="lg:col-span-1">
                  <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-50 shadow-lg dark:bg-neutral-900">
                    <Image
                      src={podcast.coverImage}
                      alt={podcast.title}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                </div>
              )}
            </div>
          </Container>
        </section>

        {/* Audio Player Section */}
        <section className="border-t border-gray-100 bg-gray-50 py-8 dark:border-gray-800 dark:bg-neutral-900">
          <Container>
            <div className="mx-auto max-w-3xl">
              <audio controls className="w-full" preload="metadata">
                <source src={podcast.audioUrl} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>

              {/* Platform Links */}
              {(podcast.spotifyUrl ||
                podcast.applePodcastsUrl ||
                podcast.youtubeUrl) && (
                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Listen on:
                  </span>
                  {podcast.spotifyUrl && (
                    <a
                      href={podcast.spotifyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded bg-[#1DB954] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#1aa34a]"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                      </svg>
                      Spotify
                    </a>
                  )}
                  {podcast.applePodcastsUrl && (
                    <a
                      href={podcast.applePodcastsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded bg-[#A561F3] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#9451e3]"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 21.6c-5.307 0-9.6-4.293-9.6-9.6S6.693 2.4 12 2.4s9.6 4.293 9.6 9.6-4.293 9.6-9.6 9.6zm0-16.8c-3.973 0-7.2 3.227-7.2 7.2s3.227 7.2 7.2 7.2 7.2-3.227 7.2-7.2-3.227-7.2-7.2-7.2zm0 12c-2.64 0-4.8-2.16-4.8-4.8s2.16-4.8 4.8-4.8 4.8 2.16 4.8 4.8-2.16 4.8-4.8 4.8zm0-7.2c-1.32 0-2.4 1.08-2.4 2.4s1.08 2.4 2.4 2.4 2.4-1.08 2.4-2.4-1.08-2.4-2.4-2.4z" />
                      </svg>
                      Apple Podcasts
                    </a>
                  )}
                  {podcast.youtubeUrl && (
                    <a
                      href={podcast.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded bg-[#FF0000] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#cc0000]"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                      </svg>
                      YouTube
                    </a>
                  )}
                </div>
              )}
            </div>
          </Container>
        </section>

        {/* Show Notes */}
        {podcast.showNotes && (
          <section className="border-t border-gray-100 py-16 dark:border-gray-800">
            <Container>
              <div className="mx-auto max-w-3xl">
                <h2 className="mb-8 text-2xl font-semibold">Show Notes</h2>
                <div className="prose prose-gray max-w-none dark:prose-invert">
                  <Markdown content={podcast.showNotes} />
                </div>
              </div>
            </Container>
          </section>
        )}

        {/* Transcript */}
        {podcast.transcript && (
          <section className="border-t border-gray-100 bg-gray-50 py-16 dark:border-gray-800 dark:bg-neutral-900">
            <Container>
              <div className="mx-auto max-w-3xl">
                <h2 className="mb-8 text-2xl font-semibold">Transcript</h2>
                <div className="prose prose-gray max-w-none dark:prose-invert">
                  <Markdown content={podcast.transcript} />
                </div>
              </div>
            </Container>
          </section>
        )}

        {/* Back to Blog */}
        <section className="border-t border-gray-100 py-12 dark:border-gray-800">
          <Container>
            <div className="text-center">
              <Link href="/blog" className="btn-secondary">
                ← Back to Blog & Podcasts
              </Link>
            </div>
          </Container>
        </section>
      </main>
    </>
  );
}
