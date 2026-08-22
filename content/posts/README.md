# Blog posts

One `.mdx` file per post. The filename is the URL slug:
`how-much-does-seo-cost-in-canada.mdx` → `/blog/how-much-does-seo-cost-in-canada`.

## Frontmatter

```yaml
---
title: "How Much Does SEO Cost in Canada? Real 2026 Prices"   # ≤ 60 chars ideally
description: "What small businesses in Canada actually pay…"  # ≤ 155 chars — meta description AND list excerpt
date: "2026-08-19"          # YYYY-MM-DD, quoted. Future date = not published until then (redeploy that day)
updated: "2026-09-01"       # optional — shown as "Last reviewed"; bump only when someone re-read the post
author: rohan               # rohan | tom | thomas — becomes BlogPosting.author (Person node)
reviewer: tom               # optional — second founder who reviewed; becomes BlogPosting.reviewedBy
pillar: seo                 # seo | ppc | web | content | brand | strategy — links the post to its service
keyword: "how much does seo cost for a small business per month"  # the validated target from CONTENT_TOPIC_MAP.md
takeaways:                  # optional, ≤ 6 — rendered as the "Key takeaways" box and first TOC entry
  - "Most Canadian small businesses pay between $X and $Y a month for SEO."
  - "…"
sources:                    # optional — rendered as numbered References + BlogPosting.citation
  - title: "Google Search Central — How Search works"
    url: "https://developers.google.com/search/docs/fundamentals/how-search-works"
draft: true                 # optional — excluded from the build entirely
---
```

Invalid frontmatter fails the build on purpose (see `lib/posts.ts`).

## Body rules

- Headings start at `##` — the page supplies the `<h1>`. Every `##` gets
  an anchor id and appears in the "On this page" list automatically, so
  phrase H2s as the question the section answers and put the answer in the
  first sentence.
- Pipe tables, strikethrough, and task lists work (remark-gfm).
- `<Note>…</Note>` renders a highlighted aside.
- Internal links are plain `/paths`; external links open in a new tab.
- Link to the pillar's service anchor at least once in the body (the
  footer CTA also does it).
- Every statistic or platform fact gets a `sources` entry; every claim
  traces to `memory-bank/CONTENT_FACT_BANK.md` or a listed source. No
  invented numbers, examples, or quotes — see `/editorial-standards`.

## Workflow

Draft in `memory-bank/` (gitignored) → founder review → move here with
today's date (drop `draft`) → commit → deploy. The AI-use disclosure and
the byline render automatically from frontmatter.
