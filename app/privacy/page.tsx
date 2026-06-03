import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — MapleGrowth Digital",
  description:
    "How MapleGrowth Digital collects, uses, and protects personal information from website visitors.",
  alternates: { canonical: "https://www.maplegrowthdigital.ca/privacy" },
  robots: { index: true, follow: true },
};

/**
 * Privacy Policy — live.
 *
 * Content is tailored to MapleGrowth Digital's actual data flows
 * (Resend audiences + transactional email, TidyCal bookings, Cloudflare
 * Turnstile, Upstash Redis IP logging, Vercel Analytics, GTM/GA optional,
 * localStorage for theme + cookie consent).
 *
 * When updating: bump `lastUpdated` and, if substantive, `effectiveDate`.
 */
export default function PrivacyPage() {
  const effectiveDate = "June 3, 2026";
  const lastUpdated = "June 3, 2026";

  return (
    <main className="legal-page">
      <article className="legal-page__inner">
        <header className="legal-page__head">
          <h1 className="legal-page__title">Privacy Policy</h1>
          <p className="legal-page__meta">
            Effective date: {effectiveDate} &nbsp;·&nbsp; Last updated:{" "}
            {lastUpdated}
          </p>
        </header>

        <nav className="legal-page__toc" aria-label="Table of contents">
          <h2>Contents</h2>
          <ol>
            <li><a href="#intro">1. About this policy</a></li>
            <li><a href="#collect">2. Information we collect</a></li>
            <li><a href="#use">3. How we use information</a></li>
            <li><a href="#legal-basis">4. Legal basis for processing</a></li>
            <li><a href="#share">5. Who we share with</a></li>
            <li><a href="#retention">6. How long we keep information</a></li>
            <li><a href="#transfers">7. International data transfers</a></li>
            <li><a href="#rights">8. Your rights</a></li>
            <li><a href="#cookies">9. Cookies and tracking</a></li>
            <li><a href="#children">10. Children&rsquo;s privacy</a></li>
            <li><a href="#security">11. Security</a></li>
            <li><a href="#changes">12. Changes to this policy</a></li>
            <li><a href="#contact">13. Contact us</a></li>
          </ol>
        </nav>

        <section id="intro">
          <h2>1. About this policy</h2>
          <p>
            MapleGrowth Digital (&ldquo;<strong>we</strong>&rdquo;,
            &ldquo;<strong>us</strong>&rdquo;,
            &ldquo;<strong>our</strong>&rdquo;) is a digital marketing agency
            based in Mississauga, Ontario, Canada. This policy describes how
            we collect, use, share, and protect personal information when you
            visit our website at{" "}
            <a href="https://www.maplegrowthdigital.ca">
              www.maplegrowthdigital.ca
            </a>{" "}
            and interact with our forms.
          </p>
          <p>
            This policy applies to our website only. Engagements with us as
            clients are governed by the separate agreements we sign with you.
          </p>
          <p>
            We aim to comply with the Personal Information Protection and
            Electronic Documents Act (PIPEDA), Quebec&rsquo;s Law 25 where
            applicable, Canada&rsquo;s Anti-Spam Legislation (CASL), the
            General Data Protection Regulation (GDPR) for EEA/UK visitors,
            and the California Consumer Privacy Act (CCPA/CPRA) for
            California residents.
          </p>
        </section>

        <section id="collect">
          <h2>2. Information we collect</h2>
          <h3>Information you provide</h3>
          <ul>
            <li>
              <strong>Newsletter signup</strong> — your email address (and
              optionally first name) when you subscribe to The Maple Brief.
            </li>
            <li>
              <strong>Configure-your-engagement wizard</strong> — your name,
              email address, business stage, primary goal, interested
              services, budget range, and any free-text notes you choose to
              include.
            </li>
            <li>
              <strong>Booking widget</strong> — your name, email, time zone,
              answers to any custom questions associated with the booking
              type, and the selected meeting time. Booking records are
              managed by our calendar provider, TidyCal.
            </li>
          </ul>
          <h3>Information collected automatically</h3>
          <ul>
            <li>
              <strong>IP address</strong> — temporarily logged by our rate
              limiter (Upstash Redis) to prevent abuse of our forms and
              booking endpoint.
            </li>
            <li>
              <strong>Browser and device data</strong> — user agent string,
              referring page, and pages you visit, used by our analytics
              provider (Vercel Analytics) in aggregated form.
            </li>
            <li>
              <strong>CAPTCHA challenge data</strong> — Cloudflare Turnstile
              evaluates browser characteristics and behaviour to distinguish
              humans from bots before our forms accept submissions.
            </li>
          </ul>
          <h3>Local browser storage</h3>
          <ul>
            <li>
              <strong>Theme preference</strong> (localStorage key{" "}
              <code>mgd:theme</code>) — remembers your light/dark choice.
            </li>
            <li>
              <strong>Cookie consent record</strong> (localStorage) — remembers
              your response to our cookie banner so we don&rsquo;t re-ask.
            </li>
            <li>
              <strong>Session UI state</strong> (sessionStorage) —
              dismissal of the sticky bottom CTA and similar non-tracking
              UI state.
            </li>
          </ul>
        </section>

        <section id="use">
          <h2>3. How we use information</h2>
          <ul>
            <li>To deliver The Maple Brief newsletter to subscribers.</li>
            <li>
              To respond to inquiries and prepare for booked calls or
              project conversations.
            </li>
            <li>To schedule, confirm, reschedule, or cancel meetings.</li>
            <li>
              To understand how our website is used (aggregated, anonymised
              traffic patterns) so we can improve it.
            </li>
            <li>
              To prevent abuse, spam, and fraud (rate limiting, CAPTCHA,
              honeypots).
            </li>
            <li>
              To comply with legal obligations and respond to lawful
              requests.
            </li>
          </ul>
        </section>

        <section id="legal-basis">
          <h2>4. Legal basis for processing (GDPR / UK GDPR)</h2>
          <p>If you are in the EEA or UK, our legal bases are:</p>
          <ul>
            <li>
              <strong>Consent</strong> — for the newsletter and any optional
              marketing communications. You can withdraw consent at any time.
            </li>
            <li>
              <strong>Contractual necessity</strong> — when you submit the
              wizard, ask for a quote, or book a meeting, we need your
              information to respond.
            </li>
            <li>
              <strong>Legitimate interests</strong> — for analytics, security,
              and abuse prevention. We balance these against your privacy
              rights.
            </li>
            <li>
              <strong>Legal obligation</strong> — when we must retain or
              disclose information by law.
            </li>
          </ul>
        </section>

        <section id="share">
          <h2>5. Who we share information with</h2>
          <p>
            We share personal information with the service providers we
            depend on to operate the website. Each is bound by their own
            privacy policy and (where applicable) data-processing terms.
          </p>
          <table className="legal-page__table">
            <thead>
              <tr>
                <th>Service</th>
                <th>What they receive</th>
                <th>Purpose</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Resend (US)</td>
                <td>Email address, optional name, wizard form payload</td>
                <td>Newsletter delivery + transactional email</td>
              </tr>
              <tr>
                <td>TidyCal (US)</td>
                <td>Name, email, booking-question answers, time zone</td>
                <td>Calendar booking + meeting confirmation</td>
              </tr>
              <tr>
                <td>Cloudflare Turnstile (US/global)</td>
                <td>Browser fingerprint, IP, behaviour signals</td>
                <td>CAPTCHA verification</td>
              </tr>
              <tr>
                <td>Upstash Redis (US/EU)</td>
                <td>IP address (hashed identifier)</td>
                <td>Rate limiting</td>
              </tr>
              <tr>
                <td>Vercel (US/global)</td>
                <td>Server logs, page views (anonymised)</td>
                <td>Hosting + privacy-friendly analytics</td>
              </tr>
              <tr>
                <td>Google Tag Manager + Analytics (US)</td>
                <td>
                  Page views, device data, cookies — only if you accept
                  optional cookies via our banner
                </td>
                <td>Additional analytics (optional, off by default)</td>
              </tr>
            </tbody>
          </table>
          <p>
            We do <strong>not</strong> sell personal information. We do not
            share information for cross-context behavioural advertising.
          </p>
        </section>

        <section id="retention">
          <h2>6. How long we keep information</h2>
          <ul>
            <li>
              <strong>Newsletter subscribers</strong> — until you unsubscribe
              or we close the audience.
            </li>
            <li>
              <strong>Wizard / inquiry submissions</strong> — up to 24 months
              after our last contact with you, unless a longer period is
              required to fulfil an obligation.
            </li>
            <li>
              <strong>Booking records</strong> — retained per TidyCal&rsquo;s
              policy, typically as long as the booking history is meaningful
              for accounting and follow-up.
            </li>
            <li>
              <strong>Rate-limit IP records</strong> — automatically expire
              within minutes to hours (sliding window).
            </li>
            <li>
              <strong>Server logs</strong> — typically 30 days, longer if
              needed for security investigation.
            </li>
          </ul>
        </section>

        <section id="transfers">
          <h2>7. International data transfers</h2>
          <p>
            Some of our service providers are based outside Canada
            (predominantly the United States). When we transfer your
            information internationally, we rely on the contractual
            commitments of those providers, including standard contractual
            clauses or equivalent safeguards where required by GDPR.
          </p>
        </section>

        <section id="rights">
          <h2>8. Your rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Know what personal information we hold about you.</li>
            <li>Access and request a copy of it.</li>
            <li>Correct inaccuracies.</li>
            <li>
              Request deletion (subject to legal exceptions, e.g. we may need
              to keep certain records to comply with tax or anti-spam laws).
            </li>
            <li>Withdraw consent at any time.</li>
            <li>Object to processing based on legitimate interests.</li>
            <li>Receive a portable copy of information you provided.</li>
            <li>
              Unsubscribe from the newsletter — one-click link in every email.
            </li>
            <li>
              File a complaint with the Office of the Privacy Commissioner of
              Canada (<a href="https://www.priv.gc.ca">priv.gc.ca</a>) or
              your local data protection authority.
            </li>
          </ul>
          <p>
            To exercise any of these rights, email{" "}
            <a href="mailto:info@maplegrowthdigital.ca">
              info@maplegrowthdigital.ca
            </a>
            . We will respond within 30 days.
          </p>
        </section>

        <section id="cookies">
          <h2>9. Cookies and tracking</h2>
          <p>
            Our site uses a small amount of local browser storage to
            remember your preferences. We do not set any third-party
            advertising cookies by default.
          </p>
          <ul>
            <li>
              <strong>Strictly necessary</strong> — theme preference, cookie
              consent record, session UI state. These do not require
              consent.
            </li>
            <li>
              <strong>Analytics</strong> — Vercel Analytics is cookieless.
              No personal identifier is stored on your device.
            </li>
            <li>
              <strong>Optional analytics</strong> — Google Tag Manager / GA
              cookies are only loaded if you accept optional cookies via our
              banner. You can revoke consent by clearing your browser data.
            </li>
            <li>
              <strong>CAPTCHA</strong> — Cloudflare Turnstile may set
              short-lived cookies to validate the challenge.
            </li>
          </ul>
        </section>

        <section id="children">
          <h2>10. Children&rsquo;s privacy</h2>
          <p>
            Our services are not directed at children under 13 (or 16 in
            certain jurisdictions). We do not knowingly collect personal
            information from children. If you believe we have, contact us
            and we will delete it.
          </p>
        </section>

        <section id="security">
          <h2>11. Security</h2>
          <p>
            We use HTTPS site-wide, modern security headers (HSTS, CSP,
            referrer policy, frame protection), CAPTCHA on public forms, and
            rate limiting to make abuse expensive. We restrict access to
            personal data to people who need it to do their jobs. No system
            is perfectly secure; we do our best.
          </p>
        </section>

        <section id="changes">
          <h2>12. Changes to this policy</h2>
          <p>
            We may update this policy from time to time. When we make
            material changes, we will update the &ldquo;Last updated&rdquo;
            date above and, where practical, give notice through the
            website. Continued use of the site after a change indicates your
            acceptance.
          </p>
        </section>

        <section id="contact">
          <h2>13. Contact us</h2>
          <p>
            Privacy questions, data requests, or concerns:
          </p>
          <p>
            <strong>MapleGrowth Digital</strong>
            <br />
            363 Lakeshore Rd E, Mississauga, ON L5G 1H7, Canada
            <br />
            <a href="mailto:info@maplegrowthdigital.ca">
              info@maplegrowthdigital.ca
            </a>
            <br />
            +1 (431) 726-1578
          </p>
        </section>

        <footer className="legal-page__foot">
          <p>
            See also our{" "}
            <Link href="/terms">Terms of Service</Link>.
          </p>
        </footer>
      </article>
    </main>
  );
}
