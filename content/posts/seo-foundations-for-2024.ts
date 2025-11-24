import { Post } from "../posts";

export const post: Post = {
  slug: "seo-foundations-for-2024",
  title: "SEO Foundations for 2024",
  date: "2024-02-10",
  author: "MapleGrowth Team",
  excerpt:
    "A no‑nonsense overview of the technical SEO essentials we include on every project.",
  coverImage: "/images/project-1.svg",
  tags: ["seo", "analytics"],
  content: [
    "Indexing is table stakes: correct robots.txt, a sitemap, and consistent canonicals prevent duplicate content headaches.",
    "Performance and Core Web Vitals still matter. Fast pages get crawled more often and rank better, all else equal.",
    "Content quality wins in the long run. Structure pages for people first, then annotate with clean metadata and JSON‑LD where it helps.",
  ],
  contentMd: `## SEO Foundations for 2024

Search Engine Optimization isn't magic—it's a series of practical decisions that help search engines understand and value your content. But there's a lot of noise out there. Secret tricks, guaranteed rankings, "one weird tip" that will supposedly transform your traffic overnight.

Here's the reality: **SEO is mostly about doing the fundamentals well, consistently**. No shortcuts, no hacks—just solid technical implementation, quality content, and patience.

At MapleGrowth Digital, we've worked on enough projects to know what actually moves the needle. Here's our no-nonsense guide to the SEO essentials that matter in 2024.

---

## 🎯 Indexing: The Basics Nobody Talks About

Before Google can rank you, it needs to find and understand your content. Sounds obvious, but you'd be surprised how many sites get this wrong.

### Robots.txt

Your robots.txt file tells search engines what they can and can't crawl. Get it wrong, and you might accidentally block your entire site from search results.

**What to check:**

* Don't block important pages or resources (CSS, JavaScript)
* Use it to prevent indexing of admin pages, duplicate content, or staging sites
* Test it with Google Search Console's robots.txt Tester

👉 **Common mistake:** Accidentally leaving a "Disallow: /" from development that blocks everything.

### XML Sitemap

Think of your sitemap as a roadmap for search engines. It tells them which pages exist and how they're related.

**Best practices:**

* Include all important pages (not 404s or redirected URLs)
* Update automatically when content changes
* Submit to Google Search Console and Bing Webmaster Tools
* Keep it under 50,000 URLs per sitemap file

**Example sitemap structure:**

\`\`\`xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://example.com/page</loc>
    <lastmod>2024-02-10</lastmod>
    <priority>0.8</priority>
  </url>
</urlset>
\`\`\`

### Canonical URLs

Canonicals prevent duplicate content issues by telling search engines which version of a page is the "main" one.

**Use canonicals for:**

* Product pages accessible via multiple URLs
* Blog posts syndicated to other sites
* Pages with URL parameters (sorting, filtering, pagination)
* HTTP vs HTTPS versions
* www vs non-www versions

👉 **Pro tip:** Every page should have a self-referencing canonical, even if it's the only version.

---

## ⚡ Core Web Vitals: Speed Still Matters

Google officially made page speed a ranking factor years ago. With Core Web Vitals, they're doubling down.

### The Three Metrics That Matter

**1. Largest Contentful Paint (LCP)**
- **Target:** Under 2.5 seconds
- **What it measures:** How long until main content loads
- **How to improve:** Optimize images, use CDN, improve server response times

**2. First Input Delay (FID) / Interaction to Next Paint (INP)**
- **Target:** Under 100ms (FID) or 200ms (INP)
- **What it measures:** How quickly page responds to user interactions
- **How to improve:** Minimize JavaScript, break up long tasks, use web workers

**3. Cumulative Layout Shift (CLS)**
- **Target:** Under 0.1
- **What it measures:** Visual stability (how much content jumps around)
- **How to improve:** Set image dimensions, reserve space for ads, avoid inserting content above existing content

### Why This Matters

Fast pages get crawled more frequently. They rank better. They convert better. Users don't bounce as quickly. It's not just an SEO thing—it's a business thing.

👉 **Reality check:** Don't obsess over perfect scores. Focus on real user experience. A 90 is often good enough.

---

## 📝 Content Quality: The Long Game

All the technical optimization in the world won't help if your content doesn't provide value. Google's algorithms are sophisticated enough to recognize quality.

### What Makes Quality Content?

**E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness):**

* **Experience** – Have you actually done what you're writing about?
* **Expertise** – Do you know what you're talking about?
* **Authoritativeness** – Are you recognized as a credible source?
* **Trustworthiness** – Is your information accurate and unbiased?

### Content Structure Best Practices

**1. Write for Humans First**
- Clear, conversational language
- Break up long paragraphs
- Use bullet points and lists
- Include relevant examples

**2. Use Proper Heading Hierarchy**
\`\`\`html
<h1>Main Page Title</h1>
  <h2>Section Heading</h2>
    <h3>Subsection</h3>
    <h3>Another Subsection</h3>
  <h2>Another Section</h2>
\`\`\`

**3. Answer User Questions**
- Research "People Also Ask" queries
- Address common objections
- Provide actionable takeaways
- Include examples and use cases

---

## 🏷️ Metadata: Small Details, Big Impact

Clean metadata helps search engines and users understand what your pages are about.

### Title Tags

**Best practices:**

* Keep under 60 characters
* Include primary keyword naturally
* Make it compelling (users need to click)
* Unique for every page

**Good:** "SEO Foundations for 2024 | MapleGrowth Digital"  
**Bad:** "Home - MapleGrowth Digital - SEO Agency - Canada"

### Meta Descriptions

**Best practices:**

* 150-160 characters
* Include a call-to-action
* Summarize page content
* Don't stuff keywords

**Example:**  
"Learn the essential SEO fundamentals that actually work in 2024. From technical basics to content strategy—no fluff, just practical advice."

### Open Graph & Twitter Cards

Make your content look good when shared on social media:

\`\`\`html
<meta property="og:title" content="SEO Foundations for 2024" />
<meta property="og:description" content="A no-nonsense guide..." />
<meta property="og:image" content="https://example.com/image.jpg" />
<meta name="twitter:card" content="summary_large_image" />
\`\`\`

---

## 🔍 Structured Data: Help Search Engines Understand

Schema.org markup (JSON-LD) helps search engines understand your content context, potentially earning rich results in search.

### Common Schema Types

**For Business Sites:**
\`\`\`json
{
  "@type": "LocalBusiness",
  "name": "Your Business",
  "address": { ... },
  "telephone": "+1-xxx-xxx-xxxx",
  "openingHours": "Mo-Fr 09:00-17:00"
}
\`\`\`

**For Blog Posts:**
\`\`\`json
{
  "@type": "Article",
  "headline": "Your Title",
  "author": "Author Name",
  "datePublished": "2024-02-10",
  "image": "article-image.jpg"
}
\`\`\`

**For Products:**
\`\`\`json
{
  "@type": "Product",
  "name": "Product Name",
  "offers": {
    "@type": "Offer",
    "price": "99.99",
    "priceCurrency": "USD"
  }
}
\`\`\`

👉 **Tip:** Use Google's Rich Results Test to validate your markup before deploying.

---

## 🔗 Internal Linking: The Underrated Strategy

Internal links help search engines discover content and understand site structure. They also keep users engaged longer.

**Internal Linking Best Practices:**

* Link from high-authority pages to newer content
* Use descriptive anchor text (not "click here")
* Create topic clusters around pillar content
* Fix broken internal links regularly
* Don't overdo it—3-5 contextual links per page is plenty

**Example:** Instead of "Learn more about [SEO here]," use "Our guide to [technical SEO foundations] covers this in detail."

---

## 📊 Analytics: Measure What Matters

You can't improve what you don't measure. Set up proper tracking from day one.

### Essential Tools

**Google Search Console:**
* Monitor indexing status
* See which queries drive traffic
* Identify crawl errors
* Submit sitemaps

**Google Analytics 4:**
* Track user behavior and conversions
* Understand content performance
* Monitor traffic sources
* Set up custom events

**Performance Monitoring:**
* PageSpeed Insights
* Chrome UX Report
* WebPageTest
* Lighthouse CI

---

## ✅ SEO Checklist: Don't Launch Without These

Before any site goes live, we verify:

### Technical SEO

- [ ] Robots.txt configured correctly
- [ ] XML sitemap generated and submitted
- [ ] Canonical tags on all pages
- [ ] HTTPS enabled (SSL certificate)
- [ ] 404 pages return correct status codes
- [ ] Redirects set up for moved/deleted pages
- [ ] Mobile-responsive design
- [ ] Core Web Vitals passing

### On-Page SEO

- [ ] Unique title tags for every page
- [ ] Meta descriptions for key pages
- [ ] Proper heading hierarchy (H1, H2, H3)
- [ ] Alt text on all images
- [ ] Internal linking strategy implemented
- [ ] Schema markup added where relevant
- [ ] Open Graph tags for social sharing

### Content SEO

- [ ] Target keyword research completed
- [ ] Content optimized for user intent
- [ ] Quality content (no thin pages)
- [ ] Regular publishing schedule
- [ ] Content updated and refreshed

---

## 🚀 Common SEO Mistakes to Avoid

**1. Keyword Stuffing**
- ❌ "Best SEO agency best SEO services best SEO company"
- ✅ Natural language that happens to include relevant terms

**2. Ignoring Mobile Users**
- Most traffic is mobile now. If your site isn't mobile-friendly, you're invisible to half your audience.

**3. Buying Links**
- Google's algorithms are smart. Paid link schemes get caught and penalized.

**4. Neglecting Technical Issues**
- Broken links, slow pages, and crawl errors hurt you even if your content is great.

**5. Expecting Overnight Results**
- SEO takes 3-6 months to show meaningful results. It's a marathon, not a sprint.

---

## 🎯 The Bottom Line

SEO in 2024 isn't about gaming the system or finding loopholes. It's about building a solid foundation that serves both users and search engines.

**The fundamentals that matter:**

1. **Make sure search engines can find and crawl your content**
2. **Build fast, mobile-friendly pages**
3. **Create genuinely helpful content**
4. **Use clean metadata and structured data**
5. **Monitor performance and iterate**

Do these things consistently, and you'll outperform 80% of websites out there. Not because you've discovered some secret—but because most sites don't do the basics well.

**Start with the fundamentals. Master them. Then optimize from there.**
`,
};
