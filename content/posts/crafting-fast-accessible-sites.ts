import { Post } from "../posts";

export const post: Post = {
  slug: "crafting-fast-accessible-sites",
  title: "Crafting Fast, Accessible Sites",
  date: "2024-06-12",
  author: "MapleGrowth Team",
  excerpt:
    "A practical checklist we use to ship performant, accessible websites without over‑engineering.",
  coverImage: "/images/accessible-sites.png",
  tags: ["performance", "a11y", "best-practices"],
  content: [
    "Performance starts with intent: minimal scripts, efficient images, and smart caching. We consider first‑load size before writing a single component.",
    "Accessibility is not a layer on top — it informs structure, color contrast, and focus from day one. We lint, test with keyboard, and audit landmarks early.",
    "Tooling helps, but most wins come from discipline: no hidden layout shifts, no blocking fonts, and keeping interactions obvious for everyone.",
  ],
  contentMd: `## Crafting Fast, Accessible Sites

Building a website that's both fast and accessible isn't about following a checklist—it's about building with **intention from the start**. Too often, performance and accessibility are treated as afterthoughts, added in after the design is done and the code is written. That approach rarely works.

At MapleGrowth Digital, we've learned that the best websites start with these principles baked into the foundation. Here's our practical approach to shipping sites that are both lightning-fast and accessible to everyone.

---

## 🎯 Performance Starts with Intent

Fast websites don't happen by accident. They're the result of deliberate decisions made throughout the development process.

**Key Performance Principles:**

* **Minimal JavaScript** – Every script adds weight. We ask: "Do we really need this?" before adding any library or framework.
* **Optimized Images** – Use modern formats like WebP and AVIF. Lazy load images below the fold. Serve responsive images sized for the viewport.
* **Smart Caching** – Set proper cache headers. Use CDNs for static assets. Consider service workers for offline experiences.
* **Critical CSS First** – Inline critical styles to avoid render-blocking. Defer non-essential CSS.

👉 **Real Talk:** Most performance problems come from adding things without measuring the cost. Before you add that new tracking script or animation library, check how it impacts your Core Web Vitals.

---

## ♿ Accessibility Isn't a Layer—It's a Foundation

You can't bolt accessibility onto a finished design. It needs to inform every decision from wireframes to final deployment.

**Building Accessibility In:**

* **Semantic HTML** – Use proper heading hierarchy (h1, h2, h3). Button elements for buttons, links for links. Don't make divs do everything.
* **Color Contrast** – Ensure text meets WCAG AA standards (4.5:1 for normal text, 3:1 for large). Test with real users who have visual impairments.
* **Keyboard Navigation** – Every interactive element should be reachable and usable via keyboard. Tab order should be logical. Focus states should be obvious.
* **ARIA When Needed** – Use ARIA labels and landmarks to help screen readers, but don't over-do it. HTML5 semantics cover most cases.
* **Form Labels** – Every input needs a label. Error messages should be clear and programmatically associated.

👉 **Pro Tip:** Install a keyboard-only testing routine. Disconnect your mouse for 10 minutes and try using your site. You'll find issues fast.

---

## 🛠️ Our Practical Checklist

Here's what we check on every project before launch:

### Performance Checks

- [ ] **First Contentful Paint under 1.8s** – Users see something meaningful quickly
- [ ] **Largest Contentful Paint under 2.5s** – Main content loads fast
- [ ] **Cumulative Layout Shift under 0.1** – No annoying jumps as page loads
- [ ] **Time to Interactive under 3.5s** – Page is fully usable quickly
- [ ] **Images optimized and lazy loaded** – Nothing heavier than needed
- [ ] **Fonts preloaded or system stacks** – No invisible text flash

### Accessibility Checks

- [ ] **All images have alt text** – Descriptive, not generic
- [ ] **Color contrast passes WCAG AA** – Tested with tools and real users
- [ ] **Keyboard navigation works** – Tab through entire site logically
- [ ] **Form labels are explicit** – Every input properly labeled
- [ ] **Heading hierarchy is logical** – No skipped levels
- [ ] **Focus indicators are visible** – Users can see where they are

---

## 🚫 Common Mistakes to Avoid

**Performance Pitfalls:**

1. **Loading entire libraries for one feature** – Import only what you need
2. **Ignoring bundle size** – Use webpack-bundle-analyzer or similar
3. **Not testing on slow connections** – Throttle your network in DevTools
4. **Relying on frameworks blindly** – Understand the cost of your tools

**Accessibility Pitfalls:**

1. **Using divs for everything** – Semantic HTML is your friend
2. **Hiding content with display: none** – Screen readers can't find it
3. **Forgetting mobile touch targets** – Buttons should be at least 44×44px
4. **Assuming everyone uses a mouse** – Keyboard and assistive tech matter

---

## 📊 Measuring What Matters

Tools are great, but they're not the whole story.

**Our Testing Stack:**

* **Lighthouse** – Quick automated checks for performance and accessibility
* **WebPageTest** – Deep performance analysis across real devices
* **axe DevTools** – Catches most accessibility issues in development
* **Real Users** – Nothing beats watching actual people use your site

👉 **Remember:** A 100 Lighthouse score doesn't mean your site is perfect. It means you've passed automated tests. Real user testing catches what tools miss.

---

## 🎨 Design Systems Help, But Discipline Wins

You don't need a fancy design system to build fast, accessible sites. You need **consistent patterns** and **disciplined execution**.

**What Actually Works:**

* **Component libraries** – Reuse tested, accessible components
* **Design tokens** – Consistent spacing, colors, and typography
* **Code reviews** – Catch performance and accessibility issues early
* **Automated testing** – Build checks into your CI/CD pipeline

But here's the truth: All the tooling in the world won't help if your team doesn't care. Make performance and accessibility part of your culture, not just your checklist.

---

## 🚀 The Bottom Line

Building fast, accessible websites isn't complicated—it's about **making the right choices consistently**.

Start with semantic HTML. Optimize your assets. Test with keyboards and screen readers. Measure performance on real devices and slow networks. Don't add complexity without understanding the cost.

Your users—all of them—will thank you for it. And bonus: Google will reward you with better rankings.

**Because at the end of the day, a website that works for everyone is a website that works better for everyone.**
`,
};
