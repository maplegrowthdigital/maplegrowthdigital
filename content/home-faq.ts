/**
 * Homepage FAQ — single source for both the rendered accordion
 * (components/FAQ.tsx) and the FAQPage JSON-LD in content/schema.ts.
 *
 * Same pattern as content/services-faq.ts: keeping the copy in one plain
 * module means the visible answers and the structured data are the same
 * array and cannot drift — Google requires them to match. Before this,
 * the two were hand-synced across separate files.
 *
 * Keep these homepage-level; service-specific questions live in
 * content/services-faq.ts.
 */
import type { FaqItem } from "./services-faq";

export const HOME_FAQ: FaqItem[] = [
  {
    q: "How long does a typical engagement last?",
    a: "It depends on the shape of the work. Sprints run 4–6 weeks for focused deliverables (audits, launches, redesigns). Retainers typically start at 3 months and run as long as we're earning our keep.",
  },
  {
    q: "Do you work with companies outside of Canada?",
    a: "Yes. We're proudly Canadian-based, but a good share of our active work is international — clients and partners across the US and Australia, and a founding team that spans Canada and India. We're remote-first and run engagements across four time zones at any given time.",
  },
  {
    q: "Do you require long-term contracts?",
    a: "No lock-ins. Retainers are month-to-month with a 30-day notice period. We'd rather earn your business every month than rely on a contract to keep you.",
  },
  {
    q: "How do you measure success?",
    a: "We agree on the metrics before kickoff and report against them every sprint. Common ones: pipeline created, qualified leads, organic sessions, MRR contribution, CAC, ROAS. If we can't tie the work to a number that matters to you, we shouldn't be doing it.",
  },
  {
    q: "Will I get a dedicated team?",
    a: "Yes. You'll have a named point of contact from day one, and you'll meet the specialists actually doing the work — including our delivery partners where they're involved. Direct contact (Slack, email, calls) runs for the duration of the engagement.",
  },
  {
    q: "How fast can we start?",
    a: "Usually within 1–2 weeks of signing. We keep deliberate slack in our schedule so new engagements don't wait on a queue. Urgent sprints can sometimes start within 48 hours.",
  },
  {
    q: "What's your pricing model?",
    a: "Four options: a small-business starter plan, fixed-scope sprints, monthly retainers, or custom engagements. Starter plans begin at $500/month, sprints at $1.5K, and retainers at $1K/month. We share specific scope and pricing on the discovery call — no surprises later.",
  },
];
