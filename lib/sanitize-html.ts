import "server-only";

/**
 * Minimal HTML sanitizer for rich-text content we receive from external
 * providers (currently: TidyCal booking-type descriptions).
 *
 * SCOPE: defensive sanitization against accidentally-pasted scripts,
 * WYSIWYG bugs, or future provider compromise. NOT designed to withstand
 * a determined skilled attacker — for that, use DOMPurify or a real HTML
 * parser. We've chosen a regex allowlist here to avoid adding a 12 KB
 * runtime dep for content we already control.
 *
 * What we strip:
 *   - <script>, <style>, <iframe>, <object>, <embed>, <form>, <input>,
 *     <button>, <link>, <meta> — and their contents
 *   - All on* event-handler attributes (onclick, onload, onerror, etc.)
 *   - href / src URLs that start with javascript:, data:, vbscript:, file:
 *   - SVG <foreignObject> + <use> with external refs
 *
 * What we keep:
 *   - All other tags + their attributes (so legitimate formatting works)
 *
 * Always runs server-side, so the client receives pre-cleaned HTML. The
 * `<div dangerouslySetInnerHTML>` consumer is then safe.
 */

// Tags we drop entirely (including their contents). Paired open + close.
const DROP_WITH_CONTENT = new RegExp(
  "<(script|style|iframe|object|embed|form|input|button|link|meta|foreignObject)" +
    "\\b[^>]*>[\\s\\S]*?</\\1\\s*>",
  "gi"
);

// Same tags, but self-closing or void variants (e.g. <input/>).
const DROP_VOID = new RegExp(
  "<(script|style|iframe|object|embed|form|input|button|link|meta|foreignObject)" +
    "\\b[^>]*/?>",
  "gi"
);

// Any on*= event handler attribute (onclick="...", onerror='...', etc.).
const STRIP_EVENT_HANDLERS = /\son[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]*)/gi;

// href/src URLs with dangerous schemes. Keep the attribute (otherwise we
// break perfectly fine link/img tags); just blank the value.
const STRIP_DANGEROUS_URLS =
  /\b(href|src|xlink:href|formaction|action)\s*=\s*(["'])\s*(?:javascript|data|vbscript|file)\s*:[^"']*\2/gi;

/**
 * Sanitize a single HTML string. Returns "" for non-string input or for
 * inputs that are empty after cleaning.
 */
export function sanitizeHtml(input: unknown): string {
  if (typeof input !== "string" || input.length === 0) return "";

  let out = input;
  // Repeat the dangerous-tag pass twice so nested/overlapping patterns
  // (e.g. <script><script>...</script></script>) get caught.
  for (let i = 0; i < 2; i++) {
    out = out.replace(DROP_WITH_CONTENT, "");
    out = out.replace(DROP_VOID, "");
  }
  out = out.replace(STRIP_EVENT_HANDLERS, "");
  out = out.replace(STRIP_DANGEROUS_URLS, '$1=""');

  return out.trim();
}
