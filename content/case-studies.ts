// Case study type definition
export type CaseStudy = {
  slug: string;
  title: string;
  category: string;
  client: {
    name: string;
    industry: string;
    location: string;
    size: string;
  };
  summary: string;
  image: string;
  date: string; // ISO string format for sorting
  duration: string;
  services: string[];
  challenge: string;
  solution: string;
  results: {
    metric: string;
    value: string;
    description: string;
  }[];
  testimonial?: {
    quote: string;
    author: string;
    role: string;
    company: string;
  };
  content?: {
    overview?: string;
    approach?: string[];
    timeline?: {
      phase: string;
      duration: string;
      activities: string[];
    }[];
    keyLearnings?: string[];
    nextSteps?: string[];
  };
  seo?: {
    title: string;
    description: string;
    keywords: string[];
    canonical: string;
  };
};

// Import individual case studies
import { caseStudy as nundle } from "./case-studies/nundle-tourism";
import { caseStudy as lumiqraft } from "./case-studies/lumiqraft-publishing";
// Add more imports as you create them
// import { caseStudy as techflow } from "./case-studies/techflow-b2b-growth";
// import { caseStudy as aurora } from "./case-studies/aurora-skincare";
// import { caseStudy as liberty } from "./case-studies/liberty-it";

// Combine all case studies into array
export const caseStudies: readonly CaseStudy[] = [
  lumiqraft,
  nundle,
  // Add more case studies here as you create them
];

export function getAllCaseStudies() {
  // Sorted newest first
  return [...caseStudies].sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getCaseStudyBySlug(slug: string) {
  return caseStudies.find((cs) => cs.slug === slug);
}

// Helper to get case studies by category
export function getCaseStudiesByCategory(category: string) {
  return caseStudies.filter((cs) => cs.category.includes(category));
}

// Get all unique categories
export function getAllCategories() {
  const categories = new Set<string>();
  caseStudies.forEach((cs) => {
    cs.category.split(" / ").forEach((cat) => categories.add(cat.trim()));
  });
  return Array.from(categories).sort();
}
