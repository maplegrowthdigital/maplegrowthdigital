import type { Metadata } from "next";
import Link from "next/link";
import { config } from "../../content/config";
import { FOUNDER_LIST } from "../../content/founders";
import { nap } from "../../content/nap";

const ORIGIN = config.getCanonicalUrl().replace(/\/$/, "");
const PAGE_URL = `${ORIGIN}/editorial-standards`;

// Bump `lastReviewed` only when someone has actually re-read this page.
const published = "2026-08-15";
const lastReviewed = "2026-08-15";

export const metadata: Metadata = {
  title: "Editorial Standards: How We Create and Review Content | MapleGrowth",
  description:
    "Who writes and reviews what MapleGrowth Digital publishes, how we use AI tools, what a claim needs before it goes live, and how we handle corrections.",
  alternates: { canonical: PAGE_URL },
  robots: { index: true, follow: true },
};

/**
 * Editorial standards — a public statement of the rules we already work
 * to. Every blog post's AI-use disclosure links here. If the process
 * changes, this page changes with it; if this page says something we do
 * not actually do, that is a bug.
 */
export default function EditorialStandardsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${PAGE_URL}#page`,
        url: PAGE_URL,
        name: "Editorial standards",
        description: metadata.description,
        inLanguage: "en-CA",
        datePublished: published,
        dateModified: lastReviewed,
        isPartOf: { "@id": `${ORIGIN}/#website` },
        about: { "@id": `${ORIGIN}/#organization` },
        breadcrumb: { "@id": `${PAGE_URL}#breadcrumb` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${PAGE_URL}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${ORIGIN}/` },
          { "@type": "ListItem", position: 2, name: "Editorial standards", item: PAGE_URL },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="legal-page">
        <article className="legal-page__inner">
          <header className="legal-page__head">
            <h1 className="legal-page__title">How we create and review content</h1>
            <p className="legal-page__meta">
              Published {published} &nbsp;·&nbsp; Last reviewed {lastReviewed}
            </p>
          </header>

          <p>
            This page sets out how everything we publish gets made: who writes
            it, who checks it, how we use AI tools, what a number needs before it
            goes on a page, and what happens when we get something wrong. One
            rule sits underneath all of it: <strong>every public claim on this
            site has to be one we could evidence if you asked.</strong>
          </p>

          <nav className="legal-page__toc" aria-label="Table of contents">
            <h2>Contents</h2>
            <ol>
              <li><a href="#why">1. Why we publish this</a></li>
              <li><a href="#scope">2. What it covers</a></li>
              <li><a href="#readers">3. Who we write for</a></li>
              <li><a href="#who">4. Who writes and who reviews</a></li>
              <li><a href="#ai">5. How we use AI tools</a></li>
              <li><a href="#evidence">6. What a claim needs before it publishes</a></li>
              <li><a href="#wont">7. What we will not publish</a></li>
              <li><a href="#updates">8. How often we review what we publish</a></li>
              <li><a href="#corrections">9. Corrections</a></li>
              <li><a href="#relationships">10. Relationships and conflicts</a></li>
              <li><a href="#contact">11. Contact</a></li>
            </ol>
          </nav>

          <section id="why">
            <h2>1. Why we publish this</h2>
            <p>
              Marketing advice is cheap to produce and expensive to follow. If we
              suggest you change how you spend, or how you handle the people who
              contact you, you should be able to see where that advice came from
              and who stands behind it.
            </p>
            <p>
              There is a second reason. Anyone can now generate a confident page
              of marketing advice in a minute. Saying ours is different costs
              nothing. Publishing the rules we hold ourselves to, in enough
              detail that you can hold us to them, is the only version of that
              claim that means anything.
            </p>
          </section>

          <section id="scope">
            <h2>2. What it covers</h2>
            <p>
              Everything we publish under our own name: the guides on our blog,
              our case studies, our service and about pages, and anything we
              share on social media that is drawn from them.
            </p>
            <p>
              It does not cover work we produce for a client&rsquo;s own site
              under the client&rsquo;s name &mdash; that runs through the
              client&rsquo;s approval, not ours &mdash; or material a client
              supplies to us, such as a quote, which we attribute rather than
              verify line by line.
            </p>
          </section>

          <section id="readers">
            <h2>3. Who we write for</h2>
            <p>
              The person who owns or runs a small or growing business, not other
              marketers. That reader knows their business and has no reason to
              know what a crawl budget is or what changed in Google last
              quarter. So any industry term we use gets explained in the
              sentence it appears in. If you find a page of ours that breaks
              that rule, it is a mistake and we would like to hear about it.
            </p>
          </section>

          <section id="who">
            <h2>4. Who writes and who reviews</h2>
            <p>
              MapleGrowth Digital is run by its three co-founders, and they are
              the only people who appear as authors on this site:
            </p>
            <ul>
              {FOUNDER_LIST.map((f) => (
                <li key={f.key}>
                  <strong>{f.name}</strong> &mdash; {f.jobTitle}. {f.stance}
                  {f.extra ? ` ${f.extra}` : ""}
                </li>
              ))}
            </ul>
            <p>
              The author of a guide is the founder whose work it draws on.
              Where a second founder has reviewed it, their name appears on the
              page too. Every claim about a client, every number attached to a
              client&rsquo;s business, and every statement about what we have
              done is approved by Rohan T George before it publishes, and he is
              the person who says no when a draft claims more than the
              evidence supports.
            </p>
            <h3>What every guide shows</h3>
            <p>
              The name of the author, the name of the reviewer where there is
              one, the date it was published, the date it was last reviewed,
              a sentence stating how AI tools were used, and a link to this
              page. If a guide is missing those, it has not finished review.
            </p>
          </section>

          <section id="ai">
            <h2>5. How we use AI tools</h2>
            <p>
              We use AI tools, and we say so on every guide rather than only
              where you might wonder. Here is the division of labour, stated
              plainly:
            </p>
            <table className="legal-page__table">
              <thead>
                <tr>
                  <th>Stage</th>
                  <th>What an AI tool does</th>
                  <th>What a founder does</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Choosing the topic</td>
                  <td>Gathers the questions people actually search for</td>
                  <td>Decides which ones we know enough to answer honestly</td>
                </tr>
                <tr>
                  <td>Drafting</td>
                  <td>Structures the piece and drafts the prose</td>
                  <td>Supplies the facts, the prices, the examples, and the judgment</td>
                </tr>
                <tr>
                  <td>Editing</td>
                  <td>Checks readability and flags missing sections</td>
                  <td>Verifies every source and approves every claim</td>
                </tr>
                <tr>
                  <td>After publishing</td>
                  <td>Flags facts that may have gone stale</td>
                  <td>Decides what to update, and when</td>
                </tr>
              </tbody>
            </table>
            <p>
              One rule has no exceptions: <strong>no client fact, result,
              quotation, price, or credential is ever generated by a tool.</strong>{" "}
              A tool asked for a plausible number will produce a plausible
              number, and one invented figure would make every true one on
              this site worthless. When a guide says we saw something happen
              in real work, a founder saw it happen.
            </p>
          </section>

          <section id="evidence">
            <h2>6. What a claim needs before it publishes</h2>
            <ul>
              <li>
                <strong>A fact about how a platform works</strong> &mdash; the
                platform&rsquo;s own current documentation, linked, or a named
                and dated primary source.
              </li>
              <li>
                <strong>A statistic</strong> &mdash; a named, dated source you
                can open. It appears in the guide&rsquo;s references.
              </li>
              <li>
                <strong>A result from a client&rsquo;s business</strong> &mdash;
                the source system, the exact period it was measured over, and
                the client&rsquo;s written confirmation. It is shown with the
                period attached.
              </li>
              <li>
                <strong>A statement about a partner company</strong> &mdash;
                taken from the partner&rsquo;s own published material, not
                from our description of them.
              </li>
              <li>
                <strong>Our own prices and process</strong> &mdash; these are
                ours to state, and they match what we quote.
              </li>
              <li>
                <strong>Anything we cannot source</strong> &mdash; the sentence
                comes out.
              </li>
            </ul>
          </section>

          <section id="wont">
            <h2>7. What we will not publish</h2>
            <ul>
              <li>A testimonial or a case study from a client we did not have.</li>
              <li>A number we cannot trace to a system and a time period.</li>
              <li>
                A page written to cover a keyword variant of a question we have
                already answered.
              </li>
              <li>Work a partner did, described as ours.</li>
              <li>A recommendation we would not give a paying client.</li>
              <li>
                A prediction about what a platform will do next, written as if
                it were a fact.
              </li>
            </ul>
          </section>

          <section id="updates">
            <h2>8. How often we review what we publish</h2>
            <p>
              Guidance about search, advertising platforms, and AI tools goes
              stale faster than almost anything else a business reads. Guides
              that describe how a specific platform behaves are checked every
              quarter. Evergreen guides are checked at least once a year. A
              platform change, a change in a client engagement referenced on a
              page, or a reader telling us something is wrong each triggers a
              review outside that schedule.
            </p>
            <p>
              The &ldquo;last reviewed&rdquo; date on a page changes only when
              someone has actually re-read it. It does not change to make the
              page look fresh.
            </p>
          </section>

          <section id="corrections">
            <h2>9. Corrections</h2>
            <p>
              If we get a fact wrong, we correct it, note the correction at the
              foot of the page, and date it. We do not quietly change a
              published claim and leave the page looking as if it always said
              the new thing. Typographical fixes are not marked; everything
              else is.
            </p>
            <p>
              To report an error, email{" "}
              <a href={`mailto:${nap.email}`}>{nap.email}</a> with the page,
              the sentence, and what you believe is wrong. We reply within a
              few business days.
            </p>
          </section>

          <section id="relationships">
            <h2>10. Relationships and conflicts</h2>
            <p>
              We sell services connected to the channels and tools we write
              about, and our guidance is not conditioned on any of it. Where a
              guide recommends a specific tool or platform we have a commercial
              relationship with, the guide says so. We do not use affiliate
              links.
            </p>
            <p>
              We deliver some work with partner companies, and two of those
              relationships are close enough that you should know about them
              before reading anything we say about them: Growmintech, our
              engineering partner for apps and e-commerce, was founded by our
              co-founder Tom Boban; and Blue Vineyard, a software and platform
              partner, is where our co-founder Rohan T George also works. We
              disclose this on our <Link href="/about">About page</Link> and on
              the <Link href="/services">Services page</Link>, and we do not ask
              partners for reviews.
            </p>
          </section>

          <section id="contact">
            <h2>11. Contact</h2>
            <p>
              <strong>{nap.name}</strong>
              <br />
              <a href={`mailto:${nap.email}`}>{nap.email}</a>
            </p>
          </section>

          <footer className="legal-page__foot">
            <p>
              See also our <Link href="/privacy">Privacy Policy</Link> and{" "}
              <Link href="/terms">Terms of Service</Link>.
            </p>
          </footer>
        </article>
      </main>
    </>
  );
}
