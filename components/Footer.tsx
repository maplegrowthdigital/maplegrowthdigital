import { Container } from "./Container";
import { site } from "../content/site";
import { BackToTop } from "./BackToTop";

function SocialIcon({ icon }: { icon: string }) {
  const iconClass = "w-[18px] h-[18px]";
  const commonProps = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (icon.toLowerCase()) {
    case "instagram":
      return (
        <svg className={iconClass} {...commonProps}>
          <rect x="2" y="2" width="20" height="20" rx="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      );
    case "linkedin":
      return (
        <svg className={iconClass} {...commonProps}>
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
          <rect x="2" y="9" width="4" height="12" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      );
    case "email":
      return (
        <svg className={iconClass} {...commonProps}>
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="M22 6l-10 7L2 6" />
        </svg>
      );
    case "twitter":
      return (
        <svg className={iconClass} {...commonProps}>
          <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
        </svg>
      );
    case "facebook":
      return (
        <svg className={iconClass} {...commonProps}>
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      );
    case "youtube":
      return (
        <svg className={iconClass} {...commonProps}>
          <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
          <polygon points="9.75,15.02 15.5,11.75 9.75,8.48" />
        </svg>
      );
    default:
      return (
        <svg className={iconClass} {...commonProps}>
          <circle cx="12" cy="12" r="10" />
          <path d="M8 14s1.5 2 4 2 4-2 4-2" />
          <line x1="9" y1="9" x2="9.01" y2="9" />
          <line x1="15" y1="9" x2="15.01" y2="9" />
        </svg>
      );
  }
}

export function Footer({ footerData }: { footerData?: any }) {
  const companyName = footerData?.companyName || "Your Agency";
  const companyDescription =
    footerData?.companyDescription ||
    "Professional web solutions for growing businesses.";
  const copyrightText = footerData?.copyrightText || "Your Agency";

  const footerLinks = Array.isArray(footerData?.footerLinks)
    ? footerData.footerLinks
    : [
        { href: "#services", label: "Services" },
        { href: "#process", label: "Process" },
        { href: "#case-studies", label: "Case Studies" },
        { href: "#about", label: "About" },
        { href: "#contact", label: "Contact" },
      ];

  const socialLinks = Array.isArray(footerData?.socialLinks)
    ? footerData.socialLinks
    : [
        { href: "#", label: "Instagram", icon: "instagram" },
        { href: "#", label: "LinkedIn", icon: "linkedin" },
        { href: "#", label: "Email", icon: "email" },
      ];

  return (
    <footer className="bg-gray-900 text-white border-t-2 border-brand-500">
      <Container className="pt-14 pb-28 md:pb-14">
        <div className="grid gap-10 sm:grid-cols-3">
          <div>
            <div className="text-lg font-semibold">{companyName}</div>
            <p className="mt-2 text-sm text-white/70">{companyDescription}</p>
          </div>
          <nav className="grid grid-cols-2 gap-2 text-sm">
            {footerLinks.map((link: any, i: number) => (
              <a
                key={i}
                href={link.href}
                className="text-white/80 hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="space-y-3 text-sm">
            {footerData?.contact?.email && (
              <div className="flex items-center gap-2 text-white/80">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 4h16v16H4z" />
                  <path d="M22 6l-10 7L2 6" />
                </svg>
                <a
                  href={`mailto:${footerData.contact.email}`}
                  className="hover:text-white"
                >
                  {footerData.contact.email}
                </a>
              </div>
            )}
            {footerData?.contact?.phone && (
              <div className="flex items-center gap-2 text-white/80">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.62-3.07 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.6 12.6 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.6 12.6 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <a
                  href={`tel:${footerData.contact.phone.replace(/\s/g, "")}`}
                  className="hover:text-white"
                >
                  {footerData.contact.phone}
                </a>
              </div>
            )}
            {footerData?.contact?.socials &&
              Array.isArray(footerData.contact.socials) &&
              footerData.contact.socials.length > 0 && (
                <div className="flex items-center gap-4">
                  {footerData.contact.socials.map((social: any, i: number) => (
                    <a
                      key={i}
                      href={social.href}
                      aria-label={social.label}
                      className="text-white/80 hover:text-white"
                    >
                      <SocialIcon icon={social.label.toLowerCase()} />
                    </a>
                  ))}
                </div>
              )}
          </div>
        </div>
        <div className="mt-10 border-t border-white/10 pt-6 text-xs text-white/60 flex items-center justify-between">
          <p>
            {copyrightText} ©2012-{new Date().getFullYear()}
          </p>
          <BackToTop className="hover:text-white" />
        </div>
      </Container>
    </footer>
  );
}
