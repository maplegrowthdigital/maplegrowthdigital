import { nap } from "./nap";
import { HOME_FAQ } from "./home-faq";

export const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["LocalBusiness", "ProfessionalService"],
      "@id": "https://maplegrowthdigital.ca/#agency",
      name: nap.name,
      legalName: nap.name,
      description:
        "Canadian digital marketing agency delivering SEO, PPC, content, and web design services for growth-focused small businesses and scale-ups.",
      url: "https://maplegrowthdigital.ca/",
      logo: {
        "@type": "ImageObject",
        url: "https://maplegrowthdigital.ca/mgd-logo.svg",
      },
      image: {
        "@type": "ImageObject",
        url: "https://maplegrowthdigital.ca/mgd-logo.svg",
      },
      telephone: nap.telephone,
      priceRange: "$$",
      address: {
        "@type": "PostalAddress",
        streetAddress: nap.streetAddress,
        addressLocality: nap.addressLocality,
        addressRegion: nap.addressRegion,
        postalCode: nap.postalCode,
        addressCountry: nap.addressCountry,
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
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          opens: "09:00",
          closes: "17:00",
        },
      ],
      contactPoint: [
        {
          "@type": "ContactPoint",
          telephone: nap.telephone,
          email: nap.email,
          contactType: "customer service",
          availableLanguage: ["English", "French"],
        },
      ],
      sameAs: [
        "https://www.linkedin.com/company/maplegrowthdigital",
        "https://www.instagram.com/maplegrowthdigital",
      ],
    },
    {
      "@type": "Organization",
      "@id": "https://maplegrowthdigital.ca/#organization",
      name: nap.name,
      legalName: nap.name,
      url: "https://maplegrowthdigital.ca/",
      logo: {
        "@type": "ImageObject",
        url: "https://maplegrowthdigital.ca/mgd-logo.svg",
      },
      image: {
        "@type": "ImageObject",
        url: "https://maplegrowthdigital.ca/mgd-logo.svg",
      },
      description:
        "Canadian digital marketing agency delivering SEO, PPC, content, and web design services for growth-focused small businesses and scale-ups.",
      slogan: "Smart Marketing. Measurable Growth.",
      foundingDate: "2014",
      numberOfEmployees: {
        "@type": "QuantitativeValue",
        value: "5-10",
      },
      address: {
        "@type": "PostalAddress",
        streetAddress: nap.streetAddress,
        addressLocality: nap.addressLocality,
        addressRegion: nap.addressRegion,
        postalCode: nap.postalCode,
        addressCountry: nap.addressCountry,
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
      contactPoint: [
        {
          "@type": "ContactPoint",
          telephone: nap.telephone,
          email: nap.email,
          contactType: "customer service",
          availableLanguage: ["English", "French"],
        },
      ],
      sameAs: [
        "https://www.linkedin.com/company/maplegrowthdigital",
        "https://www.instagram.com/maplegrowthdigital",
      ],
      founder: [
        { "@id": "https://maplegrowthdigital.ca/#rohan-t-george" },
        { "@id": "https://maplegrowthdigital.ca/#tom-boban" },
        { "@id": "https://maplegrowthdigital.ca/#thomas-thomas" },
      ],
    },
    // The three co-founders. These are real people — names and roles must
    // match the visible credits in components/about/AboutFounder.tsx exactly.
    // They live in the site-wide graph (not the About page) because they're a
    // property of the organisation, so Organization.founder above never points
    // at nodes that exist on only one route.
    {
      "@type": "Person",
      "@id": "https://maplegrowthdigital.ca/#rohan-t-george",
      name: "Rohan T George",
      jobTitle: "Co-founder — Strategy",
      worksFor: { "@id": "https://maplegrowthdigital.ca/#organization" },
      url: "https://maplegrowthdigital.ca/about",
    },
    {
      "@type": "Person",
      "@id": "https://maplegrowthdigital.ca/#tom-boban",
      name: "Tom Boban",
      jobTitle: "Co-founder — Engineering",
      worksFor: { "@id": "https://maplegrowthdigital.ca/#organization" },
      url: "https://maplegrowthdigital.ca/about",
    },
    {
      "@type": "Person",
      "@id": "https://maplegrowthdigital.ca/#thomas-thomas",
      name: "Thomas Thomas",
      jobTitle: "Co-founder — Delivery",
      worksFor: { "@id": "https://maplegrowthdigital.ca/#organization" },
      url: "https://maplegrowthdigital.ca/about",
    },
    {
      "@type": "Service",
      "@id": "https://maplegrowthdigital.ca/#service-seo-analytics",
      name: "SEO & Analytics",
      description:
        "Technical SEO, on-page optimization, content strategy, and analytics that compound results.",
      serviceType: "Search Engine Optimization",
      provider: { "@id": "https://maplegrowthdigital.ca/#agency" },
    },
    {
      "@type": "Service",
      "@id": "https://maplegrowthdigital.ca/#service-ppc-paid-media",
      name: "PPC & Paid Media",
      description:
        "ROI-first campaigns across Google, YouTube, and social. Built for fast, measurable growth.",
      serviceType: "Pay Per Click Advertising",
      provider: { "@id": "https://maplegrowthdigital.ca/#agency" },
    },
    {
      "@type": "Service",
      "@id": "https://maplegrowthdigital.ca/#service-web-design-development",
      name: "Web Design & Development",
      description:
        "Conversion-focused, accessible websites engineered for speed, security, and scalability.",
      serviceType: "Web Development",
      provider: { "@id": "https://maplegrowthdigital.ca/#agency" },
    },
    {
      "@type": "Service",
      "@id": "https://maplegrowthdigital.ca/#service-content-email",
      name: "Content & Email Marketing",
      description:
        "Editorial calendars, sales enablement content, and lifecycle email that nurtures demand.",
      serviceType: "Content Marketing",
      provider: { "@id": "https://maplegrowthdigital.ca/#agency" },
    },
    {
      "@type": "Service",
      "@id": "https://maplegrowthdigital.ca/#service-brand-creative",
      name: "Brand & Creative",
      description:
        "Brand systems, ad creative, and motion assets that boost recognition and conversion.",
      serviceType: "Brand Development",
      provider: { "@id": "https://maplegrowthdigital.ca/#agency" },
    },
    {
      "@type": "Service",
      "@id": "https://maplegrowthdigital.ca/#service-growth-strategy",
      name: "Growth Strategy",
      description:
        "Positioning, messaging, and go-to-market plans tailored to small business digital marketing.",
      serviceType: "Marketing Strategy",
      provider: { "@id": "https://maplegrowthdigital.ca/#agency" },
    },
    {
      "@type": "Service",
      "@id": "https://maplegrowthdigital.ca/#service-mobile-app",
      name: "Mobile App Development",
      description:
        "Native and cross-platform mobile apps, built with our engineering partner Growmintech — from concept to App Store launch.",
      serviceType: "Mobile App Development",
      provider: { "@id": "https://maplegrowthdigital.ca/#agency" },
    },
    {
      "@type": "Service",
      "@id": "https://maplegrowthdigital.ca/#service-ecommerce",
      name: "E-Commerce Store Development",
      description:
        "High-converting online stores on Shopify and headless commerce, built with our engineering partner Growmintech.",
      serviceType: "E-commerce Development",
      provider: { "@id": "https://maplegrowthdigital.ca/#agency" },
    },
    {
      "@type": "WebSite",
      "@id": "https://maplegrowthdigital.ca/#website",
      url: "https://maplegrowthdigital.ca/",
      name: "MapleGrowth Digital",
      publisher: { "@id": "https://maplegrowthdigital.ca/#agency" },
    },
    {
      // Built from the same array the homepage accordion renders
      // (content/home-faq.ts), so the visible copy and this structured
      // data cannot drift — Google requires them to match. Edit the
      // questions there, never here.
      "@type": "FAQPage",
      mainEntity: HOME_FAQ.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    },
  ],
} as const;
