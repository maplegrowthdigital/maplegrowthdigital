import React from 'react';

type Block =
  | { type: 'h'; level: number; text: string }
  | { type: 'p'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] }
  | { type: 'blockquote'; text: string }
  | { type: 'code'; lang?: string; code: string }
  | { type: 'hr' };

export function parse(md: string): Block[] {
  const lines = md.replace(/\r\n?/g, '\n').split('\n');
  const blocks: Block[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { i++; continue; }

    // Fenced code block ```lang
    if (/^\s*```/.test(line)) {
      const m = /^\s*```\s*([a-zA-Z0-9_-]+)?\s*$/.exec(line);
      const lang = m?.[1];
      i++;
      const buf: string[] = [];
      while (i < lines.length && !/^\s*```\s*$/.test(lines[i])) {
        buf.push(lines[i]);
        i++;
      }
      // skip closing ``` if present
      if (i < lines.length && /^\s*```\s*$/.test(lines[i])) i++;
      blocks.push({ type: 'code', lang, code: buf.join('\n') });
      continue;
    }

    // Heading: # .. ######
    const h = /^(#{1,6})\s+(.*)$/.exec(line);
    if (h) {
      blocks.push({ type: 'h', level: h[1].length, text: h[2].trim() });
      i++; continue;
    }

    // Horizontal rule
    if (/^\s*---\s*$/.test(line)) { blocks.push({ type: 'hr' }); i++; continue; }

    // Unordered list
    if (/^\s*[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*[-*]\s+/, '').trim());
        i++;
      }
      blocks.push({ type: 'ul', items });
      continue;
    }

    // Ordered list (1. ...)
    if (/^\s*\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*\d+\.\s+/, '').trim());
        i++;
      }
      blocks.push({ type: 'ol', items });
      continue;
    }

    // Blockquote (> )
    if (/^\s*>\s?/.test(line)) {
      const parts: string[] = [];
      while (i < lines.length && /^\s*>\s?/.test(lines[i])) {
        parts.push(lines[i].replace(/^\s*>\s?/, ''));
        i++;
      }
      blocks.push({ type: 'blockquote', text: parts.join(' ').trim() });
      continue;
    }

    // Paragraph (collect until blank or next block)
    const ps: string[] = [line];
    i++;
    while (i < lines.length && lines[i].trim() && !/^(#{1,6})\s+/.test(lines[i]) && !/^\s*[-*]\s+/.test(lines[i]) && !/^\s*---\s*$/.test(lines[i])) {
      ps.push(lines[i]);
      i++;
    }
    blocks.push({ type: 'p', text: ps.join(' ').trim() });
  }
  return blocks;
}

export function renderInline(text: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  // Images ![alt](url) | Links [text](url) | Strong **bold** | Code `code`
  const regex = /(\!\[[^\]]*\]\([^\)]+\)|\[[^\]]+\]\([^\)]+\)|\*\*[^*]+\*\*|`[^`]+`)/g;
  let lastIndex = 0; let m: RegExpExecArray | null;
  while ((m = regex.exec(text))) {
    if (m.index > lastIndex) nodes.push(text.slice(lastIndex, m.index));
    const token = m[0];
    if (token.startsWith('![')) {
      const im = /^!\[([^\]]*)\]\(([^\)]+)\)$/.exec(token);
      if (im) nodes.push(<img key={nodes.length} src={im[2]} alt={im[1] || ''} />);
    } else if (token.startsWith('[')) {
      const lm = /^\[([^\]]+)\]\(([^\)]+)\)$/.exec(token);
      if (lm) {
        const linkText = lm[1];
        const href = lm[2];
        nodes.push(
          <a
            key={nodes.length}
            href={href}
            target="_blank"
            rel="noreferrer"
            aria-label={`${linkText} (opens in a new tab)`}
          >
            {linkText}
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        );
      }
    } else if (token.startsWith('**')) nodes.push(<strong key={nodes.length}>{token.slice(2, -2)}</strong>);
    else if (token.startsWith('`')) nodes.push(<code key={nodes.length}>{token.slice(1, -1)}</code>);
    lastIndex = m.index + token.length;
  }
  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return nodes;
}

export function slugify(text: string): string {
  return (text || '')
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function extractToc(md: string): { level: number; text: string; id: string }[] {
  return parse(md)
    .filter((b): b is Extract<Block, { type: 'h' }> => b.type === 'h' && (b as any).level >= 2 && (b as any).level <= 3)
    .map((h) => ({ level: h.level, text: h.text, id: slugify(h.text) }));
}

export function Markdown({ content }: { content: string }) {
  const blocks = parse(content);
  return (
    <div className="article-content">
      {blocks.map((b, idx) => {
        if (b.type === 'h') {
          const Comp = (`h${Math.min(6, Math.max(1, b.level))}` as unknown) as keyof JSX.IntrinsicElements;
          const id = slugify(b.text);
          return <Comp key={idx} id={id}>{renderInline(b.text)}</Comp>;
        }
        if (b.type === 'p') return <p key={idx}>{renderInline(b.text)}</p>;
        if (b.type === 'ul') return (
          <ul key={idx}>
            {b.items.map((it, i) => <li key={i}>{renderInline(it)}</li>)}
          </ul>
        );
        if (b.type === 'ol') return (
          <ol key={idx}>
            {b.items.map((it, i) => <li key={i}>{renderInline(it)}</li>)}
          </ol>
        );
        if (b.type === 'blockquote') return (
          <blockquote key={idx}>{renderInline(b.text)}</blockquote>
        );
        if (b.type === 'code') return (
          <pre key={idx} className="code-block"><code className={b.lang ? `language-${b.lang}` : undefined}>{b.code}</code></pre>
        );
        return <hr key={idx} />;
      })}
    </div>
  );
}
