import { NextResponse } from 'next/server';
import { createAnonServerClient, createServiceServerClient } from '../../../../../utils/supabase/server';

const WINDOW_MS = 60_000;
const LIMIT_GET = 60;
const LIMIT_DELETE = 10;
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

export async function GET(_req: Request, { params }: { params: { slug: string } }) {
  try {
    // Admin route; use service client to bypass RLS
    const supabase = createServiceServerClient();
    const { data, error } = await supabase
      .from('posts')
      .select('slug,title,excerpt,content_md,cover_image,author,tags,date,published,audio_url')
      .eq('slug', params.slug)
      .single();
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 404 });
    return NextResponse.json({ ok: true, item: data });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'Failed to fetch' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { slug: string } }) {
  if (!allow(req, LIMIT_DELETE)) return NextResponse.json({ ok: false, error: 'Rate limit exceeded' }, { status: 429 });
  try {
    const supabase = createServiceServerClient();
    const { error } = await supabase.from('posts').delete().eq('slug', params.slug);
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'Failed to delete' }, { status: 500 });
  }
}
