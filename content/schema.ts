export const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["LocalBusiness", "ProfessionalService"],
      "@id": "https://www.maplegrowthdigital.ca/#agency",
      name: "MapleGrowth Digital",
      legalName: "MapleGrowth Digital",
      description:
        "Canadian digital marketing agency delivering SEO, PPC, content, and web design services for growth-focused small businesses and scale-ups.",
      url: "https://www.maplegrowthdigital.ca/",
      logo: {
        "@type": "ImageObject",
        url: "https://www.maplegrowthdigital.ca/maplegrowth-logo.svg",
      },
      image: {
        "@type": "ImageObject",
        url: "https://www.maplegrowthdigital.ca/maplegrowth-logo.svg",
      },
      telephone: "+1 (431) 726-1578",
      priceRange: "$$",
      address: {
        "@type": "PostalAddress",
        streetAddress: "363 Lakeshore Rd E",
        addressLocality: "Mississauga",
        addressRegion: "ON",
        postalCode: "L5G 1H7",
        addressCountry: "Canada",
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
          telephone: "+1 (431) 726-1578",
          email: "connect@maplegrowthdigital.ca",
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
      "@id": "https://www.maplegrowthdigital.ca/#organization",
      name: "MapleGrowth Digital",
      legalName: "MapleGrowth Digital",
      url: "https://www.maplegrowthdigital.ca/",
      logo: {
        "@type": "ImageObject",
        url: "https://www.maplegrowthdigital.ca/maplegrowth-logo.svg",
      },
      image: {
        "@type": "ImageObject",
        url: "https://www.maplegrowthdigital.ca/maplegrowth-logo.svg",
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
        streetAddress: "363 Lakeshore Rd E",
        addressLocality: "Mississauga",
        addressRegion: "ON",
        postalCode: "L5G 1H7",
        addressCountry: "Canada",
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
          telephone: "+1 (431) 726-1578",
          email: "connect@maplegrowthdigital.ca",
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
      "@type": "Service",
      "@id": "https://www.maplegrowthdigital.ca/services/seo-analytics#service",
      name: "SEO & Analytics",
      description:
        "Technical SEO, on-page optimization, content strategy, and analytics that compound results.",
      serviceType: "Search Engine Optimization",
      provider: { "@id": "https://www.maplegrowthdigital.ca/#agency" },
    },
    {
      "@type": "Service",
      "@id":
        "https://www.maplegrowthdigital.ca/services/ppc-paid-media#service",
      name: "PPC & Paid Media",
      description:
        "ROI-first campaigns across Google, YouTube, and social. Built for fast, measurable growth.",
      serviceType: "Pay Per Click Advertising",
      provider: { "@id": "https://www.maplegrowthdigital.ca/#agency" },
    },
    {
      "@type": "Service",
      "@id":
        "https://www.maplegrowthdigital.ca/services/web-design-development#service",
      name: "Web Design & Development",
      description:
        "Conversion-focused, accessible websites engineered for speed, security, and scalability.",
      serviceType: "Web Development",
      provider: { "@id": "https://www.maplegrowthdigital.ca/#agency" },
    },
    {
      "@type": "Service",
      "@id": "https://www.maplegrowthdigital.ca/services/content-email#service",
      name: "Content & Email Marketing",
      description:
        "Editorial calendars, sales enablement content, and lifecycle email that nurtures demand.",
      serviceType: "Content Marketing",
      provider: { "@id": "https://www.maplegrowthdigital.ca/#agency" },
    },
    {
      "@type": "Service",
      "@id":
        "https://www.maplegrowthdigital.ca/services/brand-creative#service",
      name: "Brand & Creative",
      description:
        "Brand systems, ad creative, and motion assets that boost recognition and conversion.",
      serviceType: "Brand Development",
      provider: { "@id": "https://www.maplegrowthdigital.ca/#agency" },
    },
    {
      "@type": "Service",
      "@id":
        "https://www.maplegrowthdigital.ca/services/growth-strategy#service",
      name: "Growth Strategy",
      description:
        "Positioning, messaging, and go-to-market plans tailored to small business digital marketing.",
      serviceType: "Marketing Strategy",
      provider: { "@id": "https://www.maplegrowthdigital.ca/#agency" },
    },
    {
      "@type": "WebSite",
      "@id": "https://www.maplegrowthdigital.ca/#website",
      url: "https://www.maplegrowthdigital.ca/",
      name: "MapleGrowth Digital",
      publisher: { "@id": "https://www.maplegrowthdigital.ca/#agency" },
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          name: "What services does MapleGrowth Digital offer?",
          "@type": "Question",
          acceptedAnswer: {
            text: "We provide web design and development, mobile app development, e-commerce solutions, SEO and analytics, branding, and content/podcast production.",
            "@type": "Answer",
          },
        },
        {
          name: "Do you only work with Canadian businesses?",
          "@type": "Question",
          acceptedAnswer: {
            text: "While we’re proudly Canadian and rooted in local values, we work with businesses across North America and beyond.",
            "@type": "Answer",
          },
        },
        {
          name: "How do you measure success for your clients?",
          "@type": "Question",
          acceptedAnswer: {
            text: "We track measurable outcomes such as conversions, lead generation, ROI, and long-term digital growth — not just vanity metrics like clicks.",
            "@type": "Answer",
          },
        },
        {
          name: "How much does a project cost?",
          "@type": "Question",
          acceptedAnswer: {
            text: "Pricing depends on scope, but we provide transparent quotes and clear timelines before starting any project. No hidden surprises.",
            "@type": "Answer",
          },
        },
        {
          name: "Do you offer ongoing support after launch?",
          "@type": "Question",
          acceptedAnswer: {
            text: "Yes. We provide ongoing maintenance, performance monitoring, and optimization to ensure your website or app continues to grow with your business.",
            "@type": "Answer",
          },
        },
        {
          name: "How is MapleGrowth Digital different from other agencies?",
          "@type": "Question",
          acceptedAnswer: {
            text: "We only take on a handful of clients at a time to ensure each project gets our full attention. Our approach blends creativity with data-driven strategy, rooted in Canadian values of trust and integrity.",
            "@type": "Answer",
          },
        },
        {
          name: "How can I get started?",
          "@type": "Question",
          acceptedAnswer: {
            text: "The best way is to book a free strategy call with us. We’ll learn about your goals and suggest a tailored plan for growth.",
            "@type": "Answer",
          },
        },
      ],
    },
  ],
} as const;
