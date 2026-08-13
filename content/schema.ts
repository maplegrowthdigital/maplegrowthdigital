export const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["LocalBusiness", "ProfessionalService"],
      "@id": "https://maplegrowthdigital.ca/#agency",
      name: "MapleGrowth Digital",
      legalName: "MapleGrowth Digital",
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
          email: "info@maplegrowthdigital.ca",
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
      name: "MapleGrowth Digital",
      legalName: "MapleGrowth Digital",
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
          email: "info@maplegrowthdigital.ca",
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
      // IMPORTANT: these Q&As must mirror the visible FAQ in components/FAQ.tsx
      // verbatim — Google requires FAQPage structured data to match on-page
      // content. If you edit one, edit the other.
      "@type": "FAQPage",
      mainEntity: [
        {
          name: "How long does a typical engagement last?",
          "@type": "Question",
          acceptedAnswer: {
            text: "It depends on the shape of the work. Sprints run 4–6 weeks for focused deliverables (audits, launches, redesigns). Retainers typically start at 3 months and run as long as we're earning our keep — most clients stay 12+ months because the work compounds.",
            "@type": "Answer",
          },
        },
        {
          name: "Do you work with companies outside of Canada?",
          "@type": "Question",
          acceptedAnswer: {
            text: "Yes. We're proudly Canadian-based, but a good share of our active work is international — clients and partners across the US, Australia, and India. We're remote-first and run engagements across four time zones at any given time.",
            "@type": "Answer",
          },
        },
        {
          name: "Do you require long-term contracts?",
          "@type": "Question",
          acceptedAnswer: {
            text: "No lock-ins. Retainers are month-to-month with a 30-day notice period. We'd rather earn your business every month than rely on a contract to keep you.",
            "@type": "Answer",
          },
        },
        {
          name: "How do you measure success?",
          "@type": "Question",
          acceptedAnswer: {
            text: "We agree on the metrics before kickoff and report against them every sprint. Common ones: pipeline created, qualified leads, organic sessions, MRR contribution, CAC, ROAS. If we can't tie the work to a number that matters to you, we shouldn't be doing it.",
            "@type": "Answer",
          },
        },
        {
          name: "Will I get a dedicated team?",
          "@type": "Question",
          acceptedAnswer: {
            text: "Yes. Every engagement has a named team — usually a strategist, a designer, and an engineer at minimum. You'll meet them in week one and have direct contact (Slack, email, calls) for the duration of the engagement.",
            "@type": "Answer",
          },
        },
        {
          name: "How fast can we start?",
          "@type": "Question",
          acceptedAnswer: {
            text: "Usually within 1–2 weeks of signing. We intentionally keep ~15% capacity open so new engagements don't wait on a queue. Urgent sprints can sometimes start within 48 hours.",
            "@type": "Answer",
          },
        },
        {
          name: "What's your pricing model?",
          "@type": "Question",
          acceptedAnswer: {
            text: "Four options: a small-business starter plan, fixed-scope sprints, monthly retainers, or custom engagements. Starter plans begin at $500/month, sprints at $1.5K, and retainers at $1K/month. We share specific scope and pricing on the discovery call — no surprises later.",
            "@type": "Answer",
          },
        },
      ],
    },
  ],
} as const;
