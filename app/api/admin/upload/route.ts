import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs/promises';
import path from 'path';

export const runtime = 'nodejs';

// Simple in-memory rate limiter per IP
const WINDOW_MS = 60_000; // 1 minute
const LIMIT_POST = 15; // max uploads/min per IP
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

export async function POST(req: Request) {
  if (!allow(req, LIMIT_POST)) {
    return NextResponse.json({ ok: false, error: 'Rate limit exceeded' }, { status: 429 });
  }
  try {
    const form = await req.formData();
    const file = form.get('file') as File | null;
    if (!file) {
      return NextResponse.json({ ok: false, error: 'Missing file' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]+/g, '-')}`;

    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
      try {
        const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
        const bucket = 'uploads';
        const key = `admin/${filename}`;
        const { error: upErr } = await supabase.storage.from(bucket).upload(key, buffer, { contentType: file.type, upsert: true });
        if (upErr) throw upErr;
        const { data } = supabase.storage.from(bucket).getPublicUrl(key);
        const url = data.publicUrl || null;
        return NextResponse.json({ ok: true, url, path: key, bucket });
      } catch (e: any) {
        // fall through to local fs
      }
    }

    // In production without Supabase, do not attempt local writes (not persistent on serverless)
    if (process.env.NODE_ENV === 'production' && !(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY)) {
      return NextResponse.json(
        {
          ok: false,
          error:
            'Uploads are not configured for production. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY and create a public "uploads" bucket.',
        },
        { status: 500 }
      );
    }

    // Local filesystem fallback -> public/uploads (dev/local only)
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    try { await fs.mkdir(uploadsDir, { recursive: true }); } catch {}
    const outPath = path.join(uploadsDir, filename);
    await fs.writeFile(outPath, buffer);
    const publicUrl = `/uploads/${filename}`;
    return NextResponse.json({ ok: true, url: publicUrl });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'Upload failed' }, { status: 500 });
  }
}
