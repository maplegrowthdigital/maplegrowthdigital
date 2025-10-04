export interface BreadcrumbItem {
  name: string;
  url: string;
  position: number;
}

export interface BreadcrumbSchema {
  "@context": "https://schema.org";
  "@type": "BreadcrumbList";
  itemListElement: Array<{
    "@type": "ListItem";
    position: number;
    name: string;
    item?: string;
  }>;
}

/**
 * Generate breadcrumb items from a URL path
 */
export function generateBreadcrumbs(
  pathname: string,
  pageTitle?: string
): BreadcrumbItem[] {
  const baseUrl = "https://www.maplegrowthdigital.ca";
  const breadcrumbs: BreadcrumbItem[] = [];

  // Always start with Home
  breadcrumbs.push({
    name: "Home",
    url: baseUrl,
    position: 1,
  });

  // Handle root path
  if (pathname === "/" || pathname === "") {
    return breadcrumbs;
  }

  // Split path and filter empty segments
  const pathSegments = pathname.split("/").filter(Boolean);

  // Build breadcrumbs from path segments
  let currentPath = "";

  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const isLast = index === pathSegments.length - 1;

    let segmentName = segment;

    // Convert common path segments to readable names
    switch (segment) {
      case "blog":
        segmentName = "Blog";
        break;
      case "services":
        segmentName = "Services";
        break;
      case "case-studies":
        segmentName = "Case Studies";
        break;
      case "about":
        segmentName = "About";
        break;
      case "contact":
        segmentName = "Contact";
        break;
      default:
        // For dynamic routes (like blog posts), use page title if provided
        if (isLast && pageTitle) {
          segmentName = pageTitle;
        } else {
          // Convert slug to readable format
          segmentName = segment
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
        }
    }

    breadcrumbs.push({
      name: segmentName,
      url: `${baseUrl}${currentPath}`,
      position: breadcrumbs.length + 1,
    });
  });

  return breadcrumbs;
}

/**
 * Convert breadcrumb items to JSON-LD schema
 */
export function breadcrumbsToSchema(
  breadcrumbs: BreadcrumbItem[]
): BreadcrumbSchema {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((breadcrumb, index) => {
      const isLast = index === breadcrumbs.length - 1;

      return {
        "@type": "ListItem",
        position: breadcrumb.position,
        name: breadcrumb.name,
        // Don't include item URL for the last breadcrumb (current page)
        ...(isLast ? {} : { item: breadcrumb.url }),
      };
    }),
  };
}

/**
 * Generate complete breadcrumb JSON-LD schema for a given path
 */
export function generateBreadcrumbSchema(
  pathname: string,
  pageTitle?: string
): BreadcrumbSchema {
  const breadcrumbs = generateBreadcrumbs(pathname, pageTitle);
  return breadcrumbsToSchema(breadcrumbs);
}

/**
 * Common breadcrumb configurations for specific pages
 */
export const breadcrumbConfigs = {
  home: () => generateBreadcrumbs("/"),
  blog: () => generateBreadcrumbs("/blog"),
  blogPost: (slug: string, title: string) =>
    generateBreadcrumbs(`/blog/${slug}`, title),
  services: () => generateBreadcrumbs("/services"),
  about: () => generateBreadcrumbs("/about"),
  contact: () => generateBreadcrumbs("/contact"),
} as const;
