import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service — MapleGrowth Digital",
  description:
    "The terms that govern your use of the MapleGrowth Digital website and its forms.",
  // Non-www — www redirects here, so a www canonical would contradict itself.
  alternates: { canonical: "https://maplegrowthdigital.ca/terms" },
  robots: { index: true, follow: true },
};

/**
 * Terms of Service — live.
 *
 * Governs USE OF THE WEBSITE only. Client engagements operate under
 * separate signed agreements. Tailored to MGD operations (informational
 * site + forms + scheduling).
 *
 * When updating: bump `lastUpdated` and, if substantive, `effectiveDate`.
 */
export default function TermsPage() {
  const effectiveDate = "June 3, 2026";
  const lastUpdated = "June 3, 2026";

  return (
    <main className="legal-page">
      <article className="legal-page__inner">
        <header className="legal-page__head">
          <h1 className="legal-page__title">Terms of Service</h1>
          <p className="legal-page__meta">
            Effective date: {effectiveDate} &nbsp;·&nbsp; Last updated:{" "}
            {lastUpdated}
          </p>
        </header>

        <nav className="legal-page__toc" aria-label="Table of contents">
          <h2>Contents</h2>
          <ol>
            <li><a href="#agreement">1. Agreement to these terms</a></li>
            <li><a href="#service">2. About this website</a></li>
            <li><a href="#eligibility">3. Eligibility</a></li>
            <li><a href="#acceptable-use">4. Acceptable use</a></li>
            <li><a href="#ip">5. Intellectual property</a></li>
            <li><a href="#submissions">6. Your submissions</a></li>
            <li><a href="#third-parties">7. Third-party services</a></li>
            <li><a href="#disclaimer">8. Disclaimer</a></li>
            <li><a href="#liability">9. Limitation of liability</a></li>
            <li><a href="#indemnification">10. Indemnification</a></li>
            <li><a href="#termination">11. Termination</a></li>
            <li><a href="#law">12. Governing law and disputes</a></li>
            <li><a href="#changes">13. Changes to these terms</a></li>
            <li><a href="#contact">14. Contact</a></li>
          </ol>
        </nav>

        <section id="agreement">
          <h2>1. Agreement to these terms</h2>
          <p>
            These Terms of Service (&ldquo;<strong>Terms</strong>&rdquo;)
            govern your access to and use of the MapleGrowth Digital
            website at{" "}
            <a href="https://maplegrowthdigital.ca">
              maplegrowthdigital.ca
            </a>{" "}
            (the &ldquo;<strong>Site</strong>&rdquo;), provided by
            MapleGrowth Digital (&ldquo;<strong>we</strong>&rdquo;,
            &ldquo;<strong>us</strong>&rdquo;,
            &ldquo;<strong>our</strong>&rdquo;), based in Mississauga,
            Ontario, Canada.
          </p>
          <p>
            By accessing or using the Site, you agree to be bound by these
            Terms. If you do not agree, please do not use the Site.
          </p>
          <p>
            <strong>Note:</strong> These Terms govern use of the Site. Our
            client engagements (services, retainers, deliverables) operate
            under separate signed agreements. Nothing on this Site
            constitutes an offer to perform services or a binding
            contractual commitment by us.
          </p>
        </section>

        <section id="service">
          <h2>2. About this website</h2>
          <p>
            The Site provides general information about our services, an
            email newsletter, a configuration-style intake wizard, and a
            calendar booking interface for scheduling introductory
            conversations.
          </p>
          <p>
            Content on the Site is general in nature and does not
            constitute professional, legal, financial, or marketing advice
            for your specific situation.
          </p>
        </section>

        <section id="eligibility">
          <h2>3. Eligibility</h2>
          <p>
            You must be at least 18 years of age (or the age of majority in
            your jurisdiction) and capable of entering into a binding
            contract to use the Site. By using the Site, you represent and
            warrant that you meet these requirements.
          </p>
        </section>

        <section id="acceptable-use">
          <h2>4. Acceptable use</h2>
          <p>You agree not to:</p>
          <ul>
            <li>
              Use the Site for any unlawful purpose or in any way that
              violates these Terms.
            </li>
            <li>
              Attempt to access, probe, or scan the Site or its services
              other than in accordance with their normal published function.
            </li>
            <li>
              Scrape, crawl, or harvest data from the Site using automated
              means, except for legitimate search-engine indexing in
              accordance with our <code>robots.txt</code>.
            </li>
            <li>
              Submit content that is false, misleading, defamatory,
              harassing, abusive, infringing, malicious, or otherwise
              objectionable.
            </li>
            <li>
              Use the Site&rsquo;s forms or booking interface to send spam
              or impersonate another person.
            </li>
            <li>
              Interfere with the Site&rsquo;s security features, including
              rate limits, CAPTCHAs, or honeypot protections.
            </li>
            <li>
              Reverse engineer or attempt to extract our source code, except
              to the limited extent applicable law expressly permits.
            </li>
          </ul>
          <p>
            We reserve the right to suspend or terminate access from any
            person or IP address that violates these provisions.
          </p>
        </section>

        <section id="ip">
          <h2>5. Intellectual property</h2>
          <p>
            All content on the Site — including text, graphics, logos, the
            MapleGrowth Digital name and brand, design system, code, and
            arrangement — is owned by us or our licensors and protected by
            Canadian and international copyright, trademark, and other
            intellectual-property laws.
          </p>
          <p>
            We grant you a limited, revocable, non-exclusive,
            non-transferable licence to access and view the Site for your
            personal, non-commercial use. You may not reproduce, modify,
            distribute, or create derivative works of any Site content
            without our prior written permission.
          </p>
        </section>

        <section id="submissions">
          <h2>6. Your submissions</h2>
          <p>
            When you submit information through our forms (newsletter,
            wizard, booking), you retain ownership of the content you
            submit. By submitting, you grant us a non-exclusive,
            worldwide, royalty-free licence to use that information to
            respond to your inquiry, deliver requested services, and
            maintain internal records.
          </p>
          <p>
            You represent and warrant that you have the right to submit any
            information you provide and that doing so does not violate any
            third-party rights or applicable law.
          </p>
        </section>

        <section id="third-parties">
          <h2>7. Third-party services</h2>
          <p>
            We use third-party providers to operate parts of the Site
            (calendar bookings, email delivery, CAPTCHA, analytics, hosting,
            rate limiting). Your interactions with those services are
            governed by their own terms and privacy policies, and we are
            not responsible for their conduct or availability.
          </p>
          <p>
            The Site may link to third-party websites. We do not endorse,
            and are not responsible for, the content or practices of any
            linked sites.
          </p>
        </section>

        <section id="disclaimer">
          <h2>8. Disclaimer</h2>
          <p>
            THE SITE IS PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS
            AVAILABLE&rdquo; WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR
            IMPLIED. TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, WE
            DISCLAIM ALL WARRANTIES, INCLUDING IMPLIED WARRANTIES OF
            MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE,
            NON-INFRINGEMENT, AND COURSE OF DEALING.
          </p>
          <p>
            We do not warrant that the Site will be uninterrupted, error-free,
            timely, accurate, complete, secure, or free of viruses or
            harmful components. Use of the Site is at your own risk.
          </p>
        </section>

        <section id="liability">
          <h2>9. Limitation of liability</h2>
          <p>
            TO THE FULLEST EXTENT PERMITTED BY LAW, IN NO EVENT SHALL WE OR
            OUR OFFICERS, DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE FOR ANY
            INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE
            DAMAGES, INCLUDING LOST PROFITS, LOST DATA, OR LOSS OF BUSINESS,
            ARISING OUT OF OR IN CONNECTION WITH YOUR USE OF THE SITE, EVEN
            IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
          </p>
          <p>
            OUR TOTAL CUMULATIVE LIABILITY ARISING FROM OR RELATED TO THESE
            TERMS OR THE SITE SHALL NOT EXCEED ONE HUNDRED CANADIAN DOLLARS
            (CAD $100).
          </p>
          <p>
            Some jurisdictions do not allow the exclusion or limitation of
            certain damages. In those jurisdictions, our liability is
            limited to the maximum extent permitted by law.
          </p>
        </section>

        <section id="indemnification">
          <h2>10. Indemnification</h2>
          <p>
            You agree to indemnify, defend, and hold harmless MapleGrowth
            Digital and our officers, directors, employees, and agents from
            and against any claims, liabilities, damages, losses, and
            expenses (including reasonable legal fees) arising out of or in
            connection with: (a) your use of or access to the Site;
            (b) your violation of these Terms; or (c) your violation of any
            third-party right, including any intellectual-property or
            privacy right.
          </p>
        </section>

        <section id="termination">
          <h2>11. Termination</h2>
          <p>
            We may suspend or terminate your access to the Site at any
            time, with or without notice, for any reason, including for
            violation of these Terms. Sections of these Terms that by their
            nature should survive termination shall survive (including,
            without limitation, intellectual property, disclaimers,
            limitation of liability, and indemnification).
          </p>
        </section>

        <section id="law">
          <h2>12. Governing law and disputes</h2>
          <p>
            These Terms are governed by the laws of the Province of Ontario
            and the federal laws of Canada applicable in Ontario, without
            regard to conflict-of-laws principles. Any dispute arising out
            of or in connection with these Terms shall be brought
            exclusively in the courts located in Ontario, Canada, and you
            consent to the personal jurisdiction of those courts.
          </p>
        </section>

        <section id="changes">
          <h2>13. Changes to these terms</h2>
          <p>
            We may modify these Terms from time to time. When we do, we
            will update the &ldquo;Last updated&rdquo; date above and,
            where material, provide notice through the Site. Continued use
            of the Site after a change means you accept the updated Terms.
          </p>
        </section>

        <section id="contact">
          <h2>14. Contact</h2>
          <p>Questions about these Terms:</p>
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
            <Link href="/privacy">Privacy Policy</Link>.
          </p>
        </footer>
      </article>
    </main>
  );
}
