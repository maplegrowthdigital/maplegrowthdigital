// Blog post type definition
export type Post = {
  slug: string;
  title: string;
  date: string; // ISO string
  author?: string;
  excerpt: string;
  coverImage?: string;
  tags?: string[];
  content: string[]; // simple paragraphs for now
  contentMd?: string; // optional markdown content
  audioUrl?: string; // optional podcast audio
};

// Import individual posts
import { post as aiInDigitalMarketing } from "./posts/ai-in-digital-marketing-2025";
import { post as craftingFastSites } from "./posts/crafting-fast-accessible-sites";
import { post as designSystems } from "./posts/design-systems-that-scale";
import { post as seoFoundations } from "./posts/seo-foundations-for-2024";

// Combine all posts into array
export const posts: readonly Post[] = [
  aiInDigitalMarketing,
  craftingFastSites,
  designSystems,
  seoFoundations,
];

export function getAllPosts() {
  // Sorted newest first
  return [...posts].sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostBySlug(slug: string) {
  return posts.find((p) => p.slug === slug);
}
