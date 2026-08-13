/**
 * Service-hub FAQ — single source for both the rendered accordion
 * (components/services/ServicesFaq.tsx) and the FAQPage JSON-LD
 * (app/services/page.tsx).
 *
 * Lives in a plain module, NOT in the "use client" component: exports from a
 * client module become client references, and a Server Component can't map
 * over them. Keeping the data here lets both sides import the same array, so
 * the visible copy and the structured data cannot drift — Google requires
 * them to match.
 *
 * These questions are service-level; they must not duplicate the homepage FAQ
 * in components/FAQ.tsx.
 */
export interface FaqItem {
  q: string;
  a: string;
}

export const SERVICES_FAQ: FaqItem[] = [
  {
    q: "Can we hire you for just one service?",
    a: "Yes. Plenty of engagements start with a single piece of work — an SEO audit, a landing page, one paid campaign. The Starter plan and fixed-scope sprints exist for exactly that. Nothing obliges you to buy a bundle you don't need.",
  },
  {
    q: "Who actually does the work?",
    a: "We scope the work, set the strategy, and run the engagement in-house — that part is always us, and you'll have a named contact from day one. For deep engineering we bring in long-standing partners: Growmintech builds mobile apps and e-commerce, Blue Vineyard handles custom software and platforms, Dark Blue Technologies covers managed IT and security. We tell you which parts they're building, and we stay accountable for the result either way.",
  },
  {
    q: "What if we're not sure which service we need?",
    a: "That's normal, and it's what the first call is for. Most people arrive with a problem — leads have dried up, the site doesn't convert, nobody can find us — not a shopping list. We'll tell you what we'd prioritise and what we'd leave alone for now, even when that means recommending less work than you expected.",
  },
  {
    q: "Can you work alongside our existing team or agency?",
    a: "Yes, and it's common. We often handle one channel while an in-house team runs the rest, or take on the technical work another agency isn't set up for. We'll agree who owns what before kickoff so nothing falls between the two of us.",
  },
  {
    q: "How soon will we see results?",
    a: "It depends on the channel, and we'd rather set the expectation than promise a number. Paid media can show signal within weeks because you're buying traffic immediately. SEO, content, and brand work are slower — realistically a few months before movement means anything. We agree the metrics before kickoff and report against them every sprint, including when they're flat.",
  },
];
