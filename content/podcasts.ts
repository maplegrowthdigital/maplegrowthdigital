// Podcast episode type definition
export type Podcast = {
  slug: string;
  title: string;
  episodeNumber?: number;
  date: string; // ISO string
  host?: string;
  guests?: string[];
  excerpt: string;
  coverImage?: string;
  audioUrl: string; // Required for podcasts
  duration?: string; // e.g., "45:30"
  tags?: string[];
  transcript?: string; // Optional markdown transcript
  showNotes?: string; // Optional markdown show notes
  spotifyUrl?: string;
  applePodcastsUrl?: string;
  youtubeUrl?: string;
};

// Import individual podcasts (add more as you create them)
import { podcast as futureOfWebDev } from "./podcasts/future-of-web-development";

// Combine all podcasts into array
export const podcasts: readonly Podcast[] = [futureOfWebDev];

export function getAllPodcasts() {
  // Sorted newest first
  return [...podcasts].sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPodcastBySlug(slug: string) {
  return podcasts.find((p) => p.slug === slug);
}

// Combined content type for blog listing page
export type BlogContent = {
  type: "post" | "podcast";
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  coverImage?: string;
  tags?: string[];
  // Post-specific
  author?: string;
  // Podcast-specific
  episodeNumber?: number;
  duration?: string;
  audioUrl?: string;
};

export function getAllBlogContent(): BlogContent[] {
  const { getAllPosts } = require("./posts");
  const posts = getAllPosts();

  // Convert posts to BlogContent
  const postContent: BlogContent[] = posts.map((post: any) => ({
    type: "post" as const,
    slug: post.slug,
    title: post.title,
    date: post.date,
    excerpt: post.excerpt,
    coverImage: post.coverImage,
    tags: post.tags,
    author: post.author,
  }));

  // Convert podcasts to BlogContent
  const podcastContent: BlogContent[] = podcasts.map((podcast) => ({
    type: "podcast" as const,
    slug: podcast.slug,
    title: podcast.title,
    date: podcast.date,
    excerpt: podcast.excerpt,
    coverImage: podcast.coverImage,
    tags: podcast.tags,
    episodeNumber: podcast.episodeNumber,
    duration: podcast.duration,
    audioUrl: podcast.audioUrl,
  }));

  // Combine and sort by date (newest first)
  return [...postContent, ...podcastContent].sort((a, b) =>
    a.date < b.date ? 1 : -1
  );
}
