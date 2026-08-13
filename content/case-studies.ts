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
import { caseStudy as voyamore } from "./case-studies/voyamore";
// Add more imports as you create them

// Combine all case studies into array
//
// Only add a study here when the client, the engagement, and every figure in
// it are real and you'd be comfortable with the client reading the page.
// Testimonials must be genuine and attributed with permission.
export const caseStudies: readonly CaseStudy[] = [
  voyamore,
  // Add more case studies here as you create them
];

export function getAllCaseStudies() {
  // Sorted newest first
  return [...caseStudies].sort((a, b) => (a.date < b.date ? 1 : -1));
}
