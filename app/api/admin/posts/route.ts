import { NextResponse } from 'next/server';
import { createAnonServerClient, createServiceServerClient } from '../../../../utils/supabase/server';

// In-memory rate limit per IP (simple best-effort)
const WINDOW_MS = 60_000;
const LIMIT_GET = 60;
const LIMIT_POST = 20;
const hits = new Map<string, number[]>();
function ip(req: Request) {
  const h = (req.headers.get('x-forwarded-for') || '').split(',')[0].trim();
  return h || (req.headers.get('x-real-ip') || '') || 'unknown';
}
function allow(req: Request, limit: number) {
  const key = ip(req);
  const now = Date.now();
  const arr = (hits.get(key) || []).filter((t) => now - t < WINDOW_MS);
  if (arr.length >= limit) return false;
  arr.push(now); hits.set(key, arr); return true;
}

export async function GET(req: Request) {
  if (!allow(req, LIMIT_GET)) return NextResponse.json({ ok: false, error: 'Rate limit exceeded' }, { status: 429 });
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q') || '';
    const published = searchParams.get('published');
    const limit = Math.min(parseInt(searchParams.get('limit') || '50', 10) || 50, 200);
    const offset = parseInt(searchParams.get('offset') || '0', 10) || 0;
    // Admin route is protected by Basic Auth in middleware; use service client to bypass RLS
    const supabase = createServiceServerClient();
    // Select all columns to avoid errors if schema evolves
    let query = supabase.from('posts').select('*').order('date', { ascending: false }).range(offset, offset + limit - 1);
    if (published === 'true') query = query.eq('published', true);
    if (published === 'false') query = query.eq('published', false);
    if (q) query = query.ilike('title', `%${q}%`);
    const { data, error } = await query;
    if (error) {
      const msg = String(error?.message || '');
      // If table doesn't exist yet, return empty list so Admin UI can still load
      if (/relation .* does not exist/i.test(msg) || /not exist/i.test(msg)) {
        return NextResponse.json({ ok: true, items: [] });
      }
      throw error;
    }
    return NextResponse.json({ ok: true, items: data || [] });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'Failed to fetch posts' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!allow(req, LIMIT_POST)) return NextResponse.json({ ok: false, error: 'Rate limit exceeded' }, { status: 429 });
  try {
    const body = await req.json();
    const { slug, title, excerpt, content_md, cover_image, author, tags, date, published, audio_url } = body || {};
    if (!slug || !title) return NextResponse.json({ ok: false, error: 'Missing slug or title' }, { status: 400 });
    const supabase = createServiceServerClient();
    const { error } = await supabase.from('posts').upsert({
      slug,
      title,
      excerpt: excerpt ?? null,
      content_md: content_md ?? null,
      cover_image: cover_image ?? null,
      author: author ?? null,
      tags: Array.isArray(tags) ? tags : null,
      date: date ?? new Date().toISOString(),
      published: !!published,
      audio_url: audio_url ?? null,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'slug' });
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'Invalid JSON' }, { status: 400 });
  }
}
