# Case Studies

This directory contains individual case study files. Each case study is a separate TypeScript file that exports a `CaseStudy` object.

## How to Add a New Case Study

### 1. Create a New Case Study File

Create a new file in this directory with a descriptive slug name:

```
content/case-studies/your-case-study-slug.ts
```

### 2. Use This Template

Copy and paste this template into your new file:

```typescript
import { CaseStudy } from "../case-studies";

export const caseStudy: CaseStudy = {
  slug: "your-case-study-slug",
  title: "Client Name / Project Title",
  category: "Industry / Type",
  client: {
    name: "Company Name",
    industry: "Industry Type",
    location: "City, State/Province, Country",
    size: "Company size description",
  },
  summary: "One-sentence summary highlighting the main achievement or focus.",
  image: "/case/your-image.jpg",
  date: "2024-MM-DD", // ISO format for sorting
  duration: "6 months",
  services: ["SEO & Analytics", "PPC & Paid Media", "Web Development"],
  challenge:
    "Detailed description of the challenge the client faced. What problems were they trying to solve? What obstacles existed?",
  solution:
    "Description of the solution you provided. How did you approach the problem? What strategies did you implement?",
  results: [
    {
      metric: "Primary Metric Name",
      value: "300% increase",
      description:
        "Detailed explanation of this result and its business impact",
    },
    {
      metric: "Secondary Metric",
      value: "$500K",
      description: "What this metric means for the business",
    },
    {
      metric: "Third Metric",
      value: "180% growth",
      description: "Context around this achievement",
    },
  ],
  testimonial: {
    quote:
      "The testimonial quote from the client. Keep it authentic and specific.",
    author: "Person Name",
    role: "Their Job Title",
    company: "Company Name",
  },
  content: {
    overview: "Optional: A comprehensive overview of the project",
    approach: [
      "Step 1 of your approach",
      "Step 2 of your approach",
      "Step 3 of your approach",
      "Additional steps as needed",
    ],
    timeline: [
      {
        phase: "Discovery & Strategy",
        duration: "Month 1",
        activities: [
          "Specific activity 1",
          "Specific activity 2",
          "Specific activity 3",
        ],
      },
      {
        phase: "Implementation",
        duration: "Months 2-4",
        activities: ["Implementation activity 1", "Implementation activity 2"],
      },
      {
        phase: "Optimization",
        duration: "Months 5-6",
        activities: ["Optimization activity 1", "Optimization activity 2"],
      },
    ],
    keyLearnings: [
      "First key learning or insight from the project",
      "Second important lesson learned",
      "Third takeaway that could apply to other projects",
    ],
    nextSteps: [
      "Ongoing work item 1",
      "Future enhancement 2",
      "Long-term strategy 3",
    ],
  },
  seo: {
    title: "Case Study Title — MapleGrowth Digital | Industry Results",
    description: "How MapleGrowth Digital achieved [results] for [client]",
    keywords: ["relevant", "seo", "keywords", "for", "this", "case study"],
    canonical:
      "https://www.maplegrowthdigital.ca/case-studies/your-case-study-slug",
  },
};
```

### 3. Register the Case Study

Open `content/case-studies.ts` and add your new case study:

**Step 1:** Import your case study at the top:

```typescript
import { caseStudy as yourCaseStudy } from "./case-studies/your-case-study-slug";
```

**Step 2:** Add it to the case studies array:

```typescript
export const caseStudies: readonly CaseStudy[] = [
  nundle,
  yourCaseStudy, // Add here
];
```

### 4. Done!

Your case study will now appear automatically:

- On the `/case-studies` listing page
- At its own route: `/case-studies/your-case-study-slug`
- With proper SEO metadata and schema markup

## Case Study Object Properties

| Property               | Type     | Required | Description                                   |
| ---------------------- | -------- | -------- | --------------------------------------------- |
| `slug`                 | string   | ✅       | URL-friendly identifier                       |
| `title`                | string   | ✅       | Case study title                              |
| `category`             | string   | ✅       | Industry / Type (e.g., "Tourism / Community") |
| `client`               | object   | ✅       | Client information                            |
| `client.name`          | string   | ✅       | Company name                                  |
| `client.industry`      | string   | ✅       | Industry type                                 |
| `client.location`      | string   | ✅       | Geographic location                           |
| `client.size`          | string   | ✅       | Company size description                      |
| `summary`              | string   | ✅       | Brief one-sentence summary                    |
| `image`                | string   | ✅       | Path to hero image                            |
| `date`                 | string   | ✅       | ISO date (YYYY-MM-DD) for sorting             |
| `duration`             | string   | ✅       | Project duration (e.g., "12 months")          |
| `services`             | string[] | ✅       | Array of services provided                    |
| `challenge`            | string   | ✅       | Description of client's challenge             |
| `solution`             | string   | ✅       | Description of your solution                  |
| `results`              | array    | ✅       | Array of result objects (metric, value, desc) |
| `testimonial`          | object   | ❌       | Optional client testimonial                   |
| `content`              | object   | ❌       | Optional additional content sections          |
| `content.overview`     | string   | ❌       | Project overview                              |
| `content.approach`     | string[] | ❌       | Array of approach steps                       |
| `content.timeline`     | array    | ❌       | Project timeline with phases                  |
| `content.keyLearnings` | string[] | ❌       | Array of key learnings                        |
| `content.nextSteps`    | string[] | ❌       | Array of ongoing/future work                  |
| `seo`                  | object   | ❌       | SEO metadata (auto-generated if not provided) |

## Content Writing Tips

### Results Section

Your results should be:

- **Specific and measurable** - "180% increase" not "significant growth"
- **Business-focused** - Show revenue, conversions, ROI
- **Honest** - Real numbers build credibility
- **Contextualized** - Explain what the numbers mean

### Challenge Section

Good challenge descriptions:

- Explain the business problem, not just technical issues
- Provide context about the competitive landscape
- Mention constraints (budget, timeline, resources)
- Make it relatable to potential clients

### Solution Section

Effective solution descriptions:

- Focus on strategy, not just tactics
- Explain **why** you chose this approach
- Highlight what made this solution unique
- Connect actions to business outcomes

### Testimonials

Strong testimonials:

- Are specific about results
- Mention the experience of working together
- Come from decision-makers
- Feel authentic (not overly polished)

## Categories

Use consistent categories across case studies:

- **E-commerce / [Product Type]** - Online stores
- **B2B Services / [Industry]** - Business services
- **Tourism / Community** - Destination marketing
- **Healthcare / Wellness** - Medical/wellness services
- **Technology / [Type]** - SaaS, tech companies
- **Professional Services** - Law, accounting, consulting

## SEO Best Practices

1. **Title**: Include client industry and key result
2. **Description**: Highlight the main achievement
3. **Keywords**: Mix industry terms with marketing terms
4. **Canonical**: Always use full URL

## Image Guidelines

### Hero Images (`image` property)

- **Dimensions**: 1200x800px recommended
- **Format**: JPG or WebP
- **Location**: `/case/` directory
- **Content**: Project screenshot, location photo, or brand image

## Example Case Studies

Check out the existing case study for reference:

- `nundle-tourism.ts` - Complete example with all sections

This shows the full structure with all optional sections included.

## Need Help?

Refer to existing case study files as templates or check the main documentation for content management.
