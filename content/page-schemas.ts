import type {
  WithContext,
  AboutPage,
  CollectionPage,
  ItemList,
  Service,
  ContactPage,
  Article,
  Person,
  CreativeWork,
  ListItem,
  Offer,
  OfferCatalog,
  Thing,
} from "schema-dts";

// Types for our schema generators
export interface ServiceData {
  slug: string;
  title: string;
  description: string;
  serviceType: string;
  bullets: string[];
  icon: string;
}

export interface CaseStudyData {
  slug: string;
  title: string;
  category: string;
  summary: string;
  image: string;
  results: string[];
  link?: string;
  datePublished?: string;
}

export interface TeamMemberData {
  name: string;
  title: string;
  image?: string;
  description?: string;
}

// Base URL constant
const BASE_URL = "https://www.maplegrowthdigital.ca";

/**
 * About Page Schema Generator
 */
export function generateAboutPageSchema(
  teamMembers?: TeamMemberData[]
): WithContext<AboutPage | Person>[] {
  const schemas: WithContext<AboutPage | Person>[] = [];

  // About Page Schema
  const aboutPageSchema: WithContext<AboutPage> = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": `${BASE_URL}/about#webpage`,
    name: "About MapleGrowth Digital",
    description:
      "Learn about our Canadian growth marketing agency dedicated to small business digital marketing. Our cross-disciplinary team ships strategy, creative, and engineering under one roof.",
    url: `${BASE_URL}/about`,
    mainEntity: {
      "@id": `${BASE_URL}/#organization`,
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: BASE_URL,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "About",
        },
      ],
    },
  };

  schemas.push(aboutPageSchema);

  // Team Member Schemas
  if (teamMembers) {
    teamMembers.forEach((member, index) => {
      const personSchema: WithContext<Person> = {
        "@context": "https://schema.org",
        "@type": "Person",
        "@id": `${BASE_URL}/about#person-${index + 1}`,
        name: member.name,
        jobTitle: member.title,
        worksFor: {
          "@id": `${BASE_URL}/#organization`,
        },
        ...(member.image && {
          image: {
            "@type": "ImageObject",
            url: `${BASE_URL}${member.image}`,
          },
        }),
        ...(member.description && { description: member.description }),
      };

      schemas.push(personSchema);
    });
  }

  return schemas;
}

/**
 * Services Collection Page Schema
 */
export function generateServicesPageSchema(
  services: ServiceData[]
): WithContext<CollectionPage> {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${BASE_URL}/services#webpage`,
    name: "Digital Marketing Services",
    description:
      "Comprehensive digital marketing services that drive growth. From SEO and PPC to web development and brand strategy.",
    url: `${BASE_URL}/services`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: services.length,
      itemListElement: services.map((service, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Service",
          "@id": `${BASE_URL}/services/${service.slug}#service`,
          name: service.title,
          description: service.description,
          serviceType: service.serviceType,
          url: `${BASE_URL}/services/${service.slug}`,
        },
      })),
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: BASE_URL,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Services",
        },
      ],
    },
  };
}

/**
 * Individual Service Page Schema
 */
export function generateServicePageSchema(
  service: ServiceData
): WithContext<Service> {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${BASE_URL}/services/${service.slug}#service`,
    name: service.title,
    description: service.description,
    serviceType: service.serviceType,
    url: `${BASE_URL}/services/${service.slug}`,
    provider: {
      "@id": `${BASE_URL}/#agency`,
    },
    areaServed: [
      {
        "@type": "Country",
        name: "Canada",
      },
      {
        "@type": "Country",
        name: "United States",
      },
    ],
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      seller: {
        "@id": `${BASE_URL}/#agency`,
      },
    },
    serviceOutput: {
      "@type": "Thing",
      name: `${service.title} Results`,
      description: `Professional ${service.title.toLowerCase()} services that drive measurable business growth`,
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `${service.title} Services`,
      itemListElement: service.bullets.map((bullet, index) => ({
        "@type": "Offer",
        position: index + 1,
        itemOffered: {
          "@type": "Service",
          name: bullet,
          provider: {
            "@id": `${BASE_URL}/#agency`,
          },
        },
      })),
    },
  };
}

/**
 * Case Studies Collection Page Schema
 */
export function generateCaseStudiesPageSchema(
  caseStudies: CaseStudyData[]
): WithContext<CollectionPage> {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${BASE_URL}/case-studies#webpage`,
    name: "Case Studies",
    description:
      "How our internet marketing services turn strategy into measurable growth. Real results from real clients.",
    url: `${BASE_URL}/case-studies`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: caseStudies.length,
      itemListElement: caseStudies.map((caseStudy, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Article",
          "@id": `${BASE_URL}/case-studies/${caseStudy.slug}#article`,
          headline: caseStudy.title,
          description: caseStudy.summary,
          url: `${BASE_URL}/case-studies/${caseStudy.slug}`,
          image: `${BASE_URL}${caseStudy.image}`,
          author: {
            "@id": `${BASE_URL}/#organization`,
          },
        },
      })),
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: BASE_URL,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Case Studies",
        },
      ],
    },
  };
}

/**
 * Individual Case Study Page Schema
 */
export function generateCaseStudyPageSchema(
  caseStudy: CaseStudyData
): WithContext<Article | CreativeWork>[] {
  const currentDate =
    caseStudy.datePublished || new Date().toISOString().split("T")[0];

  const articleSchema: WithContext<Article> = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${BASE_URL}/case-studies/${caseStudy.slug}#article`,
    headline: caseStudy.title,
    description: caseStudy.summary,
    image: `${BASE_URL}${caseStudy.image}`,
    author: {
      "@id": `${BASE_URL}/#organization`,
    },
    publisher: {
      "@id": `${BASE_URL}/#organization`,
    },
    datePublished: currentDate,
    dateModified: currentDate,
    url: `${BASE_URL}/case-studies/${caseStudy.slug}`,
    about: {
      "@type": "Thing",
      name: `${caseStudy.category} Case Study`,
      description: `Digital marketing case study in ${caseStudy.category.toLowerCase()}`,
    },
    keywords: [
      "Digital Marketing Case Study",
      caseStudy.category,
      "Marketing Results",
      "Growth Marketing",
      "Canadian Digital Agency",
    ],
    mainEntity: {
      "@id": `${BASE_URL}/case-studies/${caseStudy.slug}#casestudy`,
    },
  };

  const creativeWorkSchema: WithContext<CreativeWork> = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": `${BASE_URL}/case-studies/${caseStudy.slug}#casestudy`,
    name: `${caseStudy.title} - Marketing Campaign`,
    description: `Digital marketing campaign case study: ${caseStudy.summary}`,
    creator: {
      "@id": `${BASE_URL}/#organization`,
    },
    dateCreated: currentDate,
    keywords: [caseStudy.category, "Digital Marketing", "Case Study"],
    about: {
      "@type": "Thing",
      name: caseStudy.category,
      description: `Marketing campaign in ${caseStudy.category.toLowerCase()}`,
    },
  };

  return [articleSchema, creativeWorkSchema];
}

/**
 * Contact Page Schema
 */
export function generateContactPageSchema(): WithContext<ContactPage> {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "@id": `${BASE_URL}/contact#webpage`,
    name: "Contact MapleGrowth Digital",
    description:
      "Get in touch with our digital marketing team. Book a strategy call or send us a message about your growth marketing needs.",
    url: `${BASE_URL}/contact`,
    mainEntity: {
      "@id": `${BASE_URL}/#agency`,
    },
    significantLink: [
      "tel:+14317261578",
      "mailto:hello@maplegrowthdigital.ca",
      "https://tidycal.com/maplegrowthdigital/strategy-call",
    ],
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: BASE_URL,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Contact",
        },
      ],
    },
  };
}

/**
 * Utility function to convert service data from data.json format
 */
export function mapServiceData(serviceItem: any): ServiceData {
  // Map service titles to slugs and service types
  const serviceMapping: Record<string, { slug: string; serviceType: string }> =
    {
      "SEO & Analytics": {
        slug: "seo-analytics",
        serviceType: "Search Engine Optimization",
      },
      "PPC & Paid Media": {
        slug: "ppc-paid-media",
        serviceType: "Pay Per Click Advertising",
      },
      "Web Design & Development": {
        slug: "web-design-development",
        serviceType: "Web Development",
      },
      "Content & Email": {
        slug: "content-email",
        serviceType: "Content Marketing",
      },
      "Brand & Creative": {
        slug: "brand-creative",
        serviceType: "Brand Development",
      },
      "Growth Strategy": {
        slug: "growth-strategy",
        serviceType: "Marketing Strategy",
      },
    };

  const mapping = serviceMapping[serviceItem.title];

  return {
    slug:
      mapping?.slug ||
      serviceItem.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    title: serviceItem.title,
    description: serviceItem.description,
    serviceType: mapping?.serviceType || "Digital Marketing Service",
    bullets: serviceItem.bullets || [],
    icon: serviceItem.icon,
  };
}

/**
 * Utility function to convert case study data from data.json format
 */
export function mapCaseStudyData(caseStudyItem: any): CaseStudyData {
  return {
    slug: caseStudyItem.slug,
    title: caseStudyItem.title,
    category: caseStudyItem.category,
    summary: caseStudyItem.summary,
    image: caseStudyItem.image,
    results: caseStudyItem.results || [],
    link: caseStudyItem.link,
    datePublished: caseStudyItem.datePublished,
  };
}
