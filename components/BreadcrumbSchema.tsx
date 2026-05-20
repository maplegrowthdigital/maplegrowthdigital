import type { BreadcrumbSchema as BreadcrumbSchemaType } from "../lib/breadcrumbs";

interface BreadcrumbSchemaProps {
  schema: BreadcrumbSchemaType;
}

/**
 * Component to inject breadcrumb JSON-LD schema into the page head
 * SAFE: Schema data is serialized with JSON.stringify() from structured data
 */
export function BreadcrumbSchema({ schema }: BreadcrumbSchemaProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema),
      }}
    />
  );
}
