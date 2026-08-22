import Link from "next/link";
import { isValidElement, type ComponentProps, type ReactNode } from "react";
import { slugifyHeading } from "../../lib/post-format";

/**
 * Element overrides for post bodies. Kept deliberately small: internal
 * links go through next/link, external links open safely, tables get a
 * scroll wrapper so wide data never forces the page to scroll sideways,
 * and H2s get stable ids so the table of contents can link to them.
 */

/** Flatten React children to plain text (for heading ids). */
function textOf(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (isValidElement<{ children?: ReactNode }>(node)) return textOf(node.props.children);
  return "";
}

function H2({ children, ...rest }: ComponentProps<"h2">) {
  return (
    <h2 id={slugifyHeading(textOf(children))} {...rest}>
      {children}
    </h2>
  );
}

function A({ href = "", children, ...rest }: ComponentProps<"a">) {
  const internal = href.startsWith("/") || href.startsWith("#");
  if (internal) {
    return (
      <Link href={href} {...rest}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
      {children}
    </a>
  );
}

function Table({ children }: { children?: ReactNode }) {
  return (
    <div className="post__table">
      <table>{children}</table>
    </div>
  );
}

/** Short aside for a key point. Usage in MDX: <Note>…</Note> */
function Note({ children }: { children?: ReactNode }) {
  return <aside className="post__note">{children}</aside>;
}

export const mdxComponents = { h2: H2, a: A, table: Table, Note };
