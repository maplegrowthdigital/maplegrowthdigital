import type { MetadataRoute } from 'next';
import { createAnonServerClient } from '../utils/supabase/server';
import { getAllPosts } from '../content/posts';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let base = process.env.NEXT_PUBLIC_SITE_URL || '';
  try {
    const supabase = createAnonServerClient();
    const { data, error } = await supabase
      .from('sections')
      .select('data')
      .eq('id', 'settings')
      .single();
    const canonical = (!error && data?.data?.canonicalUrl) ? (data.data.canonicalUrl as string) : undefined;
    if (canonical) base = canonical.replace(/\/$/, '');
  } catch {}
  if (!base) base = 'https://example.com';

  const urls: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: 'monthly', priority: 1.0 },
  ];
  // Try blog posts from Supabase
  try {
    const supabase = createAnonServerClient();
    const { data } = await supabase.from('posts').select('slug,published').eq('published', true);
    const slugs: string[] = Array.isArray(data) && data.length > 0 ? data.map((p: any) => p.slug as string) : getAllPosts().map((p) => p.slug);
    for (const slug of slugs) urls.push({ url: `${base}/blog/${slug}`, changeFrequency: 'weekly', priority: 0.6 });
  } catch {
    for (const p of getAllPosts()) urls.push({ url: `${base}/blog/${p.slug}`, changeFrequency: 'weekly', priority: 0.6 });
  }
  return urls;
}
