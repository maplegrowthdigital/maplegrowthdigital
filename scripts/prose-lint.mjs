// Prose lint — enforces the voice rules in memory-bank/VOICE_GUIDE.md.
//
//   node scripts/prose-lint.mjs                 # lints content/posts/*.mdx
//   node scripts/prose-lint.mjs path/to/draft.md [more files]
//
// Errors (exit 1): banned words, banned phrases, false-contrast
// constructions, exclamation marks, self-reference.
// Warnings (exit 0): em-dash density, throat-clearing openers, uniform
// "**Bold:** explanation" bullet lists, watch-list words.

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const BANNED_WORDS = [
  "delve", "delves", "delving", "explore", "explores", "exploring", "navigate", "navigates",
  "navigating", "unleash", "unleashes", "elevate", "elevates", "elevating", "empower", "empowers",
  "empowering", "seamless", "seamlessly", "robust", "dynamic", "transformative", "revolutionary",
  "innovative", "cutting-edge", "meticulous", "meticulously", "intricate", "game-changer",
  "game-changing", "supercharge", "supercharges", "unlock", "unlocks", "unlocking", "harness",
  "harnesses", "harnessing", "streamline", "streamlines", "streamlining", "holistic", "synergy",
  "best-in-class", "world-class", "award-winning", "next-level", "turbocharge", "skyrocket",
  "effortless", "effortlessly", "comprehensive",
];
// "leverage" only as a verb; "crucial/vital/essential" when used as filler intensifiers.
const BANNED_PATTERNS = [
  [/\bleverag(e|es|ed|ing)\b/i, "leverage (verb) — say use"],
  [/\b(crucial|vital)\b/i, "crucial/vital — say why it matters instead"],
  [/\bessential (to|for)\b/i, "essential — say what happens without it"],
];
const BANNED_PHRASES = [
  "furthermore", "moreover", "in conclusion", "in summary", "to sum up",
  "it is important to note", "it's important to note", "it’s important to note",
  "it's worth noting", "it’s worth noting", "it is worth noting",
  "in today's", "in today’s", "in the realm of", "in the world of", "when it comes to",
  "at the end of the day", "that being said", "with that said", "let's dive", "let’s dive",
  "dive into", "deep dive", "as an ai", "as a language model", "i hope this helps",
  "in this article", "in this post", "in this guide", "this article will", "this guide will",
];
const FALSE_CONTRAST = [
  [/\bnot just\b[^.;:]{0,80}\b(but|it['’]s|it is)\b/i, "not just X, (but/it's) Y"],
  [/\bisn['’]t about\b[^.]{0,80}\bit['’]s about\b/i, "isn't about X; it's about Y"],
  [/\bit['’]s not\b[^.;:]{0,60},\s*it['’]s\b/i, "it's not X, it's Y"],
  [/\bnot only\b[^.;:]{0,80}\bbut( also)?\b/i, "not only X but (also) Y"],
  [/\bmore than just\b/i, "more than just X"],
  [/\bisn['’]t (just|simply|only)\b[^.]{0,60}\b(it['’]s|it is)\b/i, "isn't just X, it's Y"],
];
const THROAT_CLEARING = [
  /\bin today['’]s\b/i, /\bdigital (landscape|age|era|world)\b/i, /\bever-(evolving|changing)\b/i,
  /\bfast-paced\b/i, /\bin the (age|era) of\b/i, /\bnow more than ever\b/i,
];
const WATCH_WORDS = [
  "journey", "landscape", "ecosystem", "tailored", "bespoke", "leading", "premier", "passionate",
  "solutions", "empowerment", "utilize", "utilise",
];

function lintText(text, file) {
  const errors = [];
  const warnings = [];
  const lines = text.split(/\r?\n/);

  // --- line-level checks ---------------------------------------------------
  let inFrontmatter = false;
  lines.forEach((line, i) => {
    const n = i + 1;
    if (i === 0 && line.trim() === "---") { inFrontmatter = true; return; }
    if (inFrontmatter) { if (line.trim() === "---") inFrontmatter = false; /* still lint fm text */ }
    const low = line.toLowerCase();

    for (const w of BANNED_WORDS) {
      const re = new RegExp(`\\b${w.replace(/[-]/g, "\\-")}\\b`, "i");
      if (re.test(line)) errors.push(`${file}:${n}: banned word "${w}"`);
    }
    for (const [re, why] of BANNED_PATTERNS) {
      if (re.test(line)) errors.push(`${file}:${n}: ${why}`);
    }
    for (const p of BANNED_PHRASES) {
      if (low.includes(p)) errors.push(`${file}:${n}: banned phrase "${p}"`);
    }
    for (const [re, why] of FALSE_CONTRAST) {
      if (re.test(line)) errors.push(`${file}:${n}: false contrast — ${why}`);
    }
    if (/!/.test(line.replace(/!\[/g, "").replace(/!=/g, "")) && !/^\s*```/.test(line)) {
      // ignore markdown image syntax and code; flag prose exclamation marks
      if (/[a-z0-9)]!\s|!$/i.test(line)) errors.push(`${file}:${n}: exclamation mark`);
    }
    for (const w of WATCH_WORDS) {
      if (new RegExp(`\\b${w}\\b`, "i").test(line)) warnings.push(`${file}:${n}: watch word "${w}"`);
    }
  });

  // --- document-level checks ---------------------------------------------
  const body = text.replace(/^---[\s\S]*?---\s*/m, "");
  const words = body.split(/\s+/).filter(Boolean).length || 1;
  const emDashes = (body.match(/—/g) || []).length + (body.match(/\s--\s/g) || []).length;
  const per1k = (emDashes / words) * 1000;
  if (per1k > 1) warnings.push(`${file}: em-dash density ${per1k.toFixed(1)}/1k words (cap 1.0) — use commas, full stops, or parentheses`);
  // two em dashes in one paragraph
  body.split(/\n\s*\n/).forEach((para) => {
    if ((para.match(/—/g) || []).length >= 2) warnings.push(`${file}: two em dashes in one paragraph: "${para.slice(0, 60)}…"`);
  });

  // throat-clearing: check the first prose paragraph after headings/frontmatter
  const firstPara = body.split(/\n\s*\n/).map((p) => p.trim()).find((p) => p && !/^#|^<|^\||^-|^\d+\./.test(p)) || "";
  for (const re of THROAT_CLEARING) {
    if (re.test(firstPara)) warnings.push(`${file}: throat-clearing opener (${re}) — start with the reader's situation`);
  }

  // uniform bullets: 4+ consecutive "- **Term:** …" items
  let run = 0;
  lines.forEach((line, i) => {
    if (/^\s*[-*]\s+\*\*[^*]+\*\*:?\s/.test(line)) {
      run += 1;
      if (run === 4) warnings.push(`${file}:${i + 1}: uniform "**Bold:** explanation" bullet list — vary the items`);
    } else if (!/^\s*[-*]\s/.test(line) && line.trim() !== "") {
      run = 0;
    }
  });

  // summary-style closing: last prose paragraph starting like a wrap-up
  const paras = body.split(/\n\s*\n/).map((p) => p.trim()).filter((p) => p && !/^#|^<|^\||^```/.test(p));
  const last = paras[paras.length - 1] || "";
  if (/^(in short|to recap|overall|ultimately|in the end|the bottom line|to wrap up)/i.test(last)) {
    warnings.push(`${file}: closing paragraph reads as a summary — end on the advice instead`);
  }

  return { errors, warnings, words };
}

const args = process.argv.slice(2);
let files = args;
if (files.length === 0) {
  const dir = join(process.cwd(), "content", "posts");
  files = existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith(".mdx")).map((f) => join(dir, f)) : [];
}
if (files.length === 0) {
  console.log("prose-lint: nothing to lint");
  process.exit(0);
}

let totalErr = 0;
for (const f of files) {
  const { errors, warnings, words } = lintText(readFileSync(f, "utf8"), f);
  console.log(`\n${f}  (${words} words) — ${errors.length} error(s), ${warnings.length} warning(s)`);
  errors.forEach((e) => console.log("  ERROR  " + e));
  warnings.forEach((w) => console.log("  warn   " + w));
  totalErr += errors.length;
}
console.log(totalErr ? `\nprose-lint: ${totalErr} error(s)` : "\nprose-lint: clean");
process.exit(totalErr ? 1 : 0);
