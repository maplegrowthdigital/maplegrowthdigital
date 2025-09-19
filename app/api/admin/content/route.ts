import { NextResponse } from 'next/server';
import { createAnonServerClient, createServiceServerClient } from '../../../../utils/supabase/server';
import { site as fallback } from '../../../../content/site';

// Simple in-memory rate limiter per IP
const WINDOW_MS = 60_000; // 1 minute
const LIMIT_GET = 60; // max 60 GET/min per IP
const LIMIT_POST = 20; // max 20 POST/min per IP
const hits = new Map<string, number[]>();

function getIp(req: Request): string {
  const h = (req.headers.get('x-forwarded-for') || '').split(',')[0].trim();
  return h || (req.headers.get('x-real-ip') || '') || 'unknown';
}
function allow(req: Request, limit: number): boolean {
  const ip = getIp(req);
  const now = Date.now();
  const arr = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  if (arr.length >= limit) return false;
  arr.push(now);
  hits.set(ip, arr);
  return true;
}

export async function GET(req: Request) {
  // rate limit GET
  if (!allow(req, LIMIT_GET)) {
    return NextResponse.json({ ok: false, error: 'Rate limit exceeded' }, { status: 429 });
  }
  try {
    const supabase = createAnonServerClient();
    const { data, error } = await supabase.from('sections').select('id, data');
    if (error) throw error;
    if (!data || data.length === 0) {
      return NextResponse.json(fallback);
    }
    const obj: any = {};
    for (const row of data) obj[row.id] = row.data ?? null;
    return NextResponse.json(obj);
  } catch (e) {
    // Fallback to static content if DB not reachable
    return NextResponse.json(fallback);
  }
}

export async function POST(req: Request) {
  if (!allow(req, LIMIT_POST)) {
    return NextResponse.json({ ok: false, error: 'Rate limit exceeded' }, { status: 429 });
  }
  try {
    const body = await req.json();
    const { section, data } = body || {};
    if (!section) return NextResponse.json({ ok: false, error: 'Missing section' }, { status: 400 });
    const supabase = createServiceServerClient();
    const { error } = await supabase
      .from('sections')
      .upsert({ id: section, data, updated_at: new Date().toISOString() }, { onConflict: 'id' });
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'Invalid JSON' }, { status: 400 });
  }
}
