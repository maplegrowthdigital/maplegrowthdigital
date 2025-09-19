import fs from 'fs/promises';
import path from 'path';
import { site as fallback } from '../content/site';

const DATA_PATH = path.join(process.cwd(), 'content', 'data.json');

export async function loadContent() {
  try {
    const buf = await fs.readFile(DATA_PATH, 'utf8');
    return JSON.parse(buf);
  } catch {
    return fallback;
  }
}

export async function saveSection(section: string, data: any) {
  let current: any;
  try {
    const buf = await fs.readFile(DATA_PATH, 'utf8');
    current = JSON.parse(buf);
  } catch {
    current = fallback;
  }
  current[section] = data;
  try {
    await fs.writeFile(DATA_PATH, JSON.stringify(current, null, 2), 'utf8');
    return { ok: true };
  } catch (e: any) {
    return { ok: false, error: e?.message || 'Failed to write file (likely read-only on host)' };
  }
}

