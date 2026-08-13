import Link from "next/link";
import fallbackData from "../content/data.json";
import { nap, telHref } from "../content/nap";

// Single-page site — these mirror the header nav exactly.
// "Book a call" lives as its own CTA section, not in this destination list.
const sitemapLinks = [
  { href: "/#services", label: "Services" },
  { href: "/#work", label: "Work" },
  { href: "/#process", label: "Process" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/about", label: "About" },
];

export function Footer() {
  // Contact details come from content/nap.ts (see the address block below);
  // data.json still supplies the social links.
  const socials = (fallbackData.contact?.socials || []) as Array<{
    label: string;
    href: string;
  }>;

  return (
    <footer id="site-footer" className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__brand">
          {/* Same pattern as Header — two variants, one shown per theme. */}
          <img
            src="/mgd-logo.svg"
            alt="MapleGrowth Digital"
            width={302}
            height={60}
            className="site-footer__logo site-footer__logo--dark"
          />
          <img
            src="/mgd-logo-light.svg"
            alt=""
            width={302}
            height={60}
            className="site-footer__logo site-footer__logo--light"
            aria-hidden="true"
          />
          <p>A Canadian growth marketing agency.</p>
        </div>
        <div className="site-footer__cols">
          <div>
            <h4>Explore</h4>
            <ul>
              {sitemapLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Contact</h4>
            {/* Visible NAP. Must match the LocalBusiness structured data and
                the Google Business Profile exactly — all three read from
                content/nap.ts so they can't drift apart. */}
            <address className="site-footer__nap">
              <span className="site-footer__nap-name">{nap.name}</span>
              <span>{nap.streetAddress}</span>
              <span>
                {nap.addressLocality}, {nap.addressRegion} {nap.postalCode}
              </span>
              <span>{nap.addressCountry}</span>
              <a href={`mailto:${nap.email}`}>{nap.email}</a>
              <a href={telHref}>{nap.telephone}</a>
            </address>
          </div>
          <div>
            <h4>Social</h4>
            <ul>
              {socials.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noreferrer">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="site-footer__bottom">
        <span>
          © {new Date().getFullYear()} MapleGrowth Digital. All rights reserved.
        </span>
        <nav className="site-footer__legal" aria-label="Legal">
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
        </nav>
        <span>Made in Canada</span>
      </div>
    </footer>
  );
}
