"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Container } from "../../components/Container";
import { ShapesBackdrop } from "../../components/ShapesBackdrop";
import { Icon } from "../../components/Icon";
import { PageBanner } from "../../components/PageBanner";
import { Services } from "../../components/Services";
import { TeamSection } from "../../components/TeamSection";
import { BookCall } from "../../components/BookCall";
import { ContactForm } from "../../components/ContactForm";
import { BreadcrumbSchema } from "../../components/BreadcrumbSchema";
import {
  generateAboutPageSchema,
  type TeamMemberData,
} from "../../content/page-schemas";
import { generateBreadcrumbSchema } from "../../lib/breadcrumbs";
import aboutData from "../../content/about.json";

export default function AboutPage() {
  const breadcrumbSchema = generateBreadcrumbSchema("/about");

  // Convert team data for schema
  const teamMembers: TeamMemberData[] = aboutData.team.members.map(
    (member) => ({
      name: member.name,
      title: member.title,
      image: member.image,
      description: member.bio,
    })
  );

  const aboutSchemas = generateAboutPageSchema(teamMembers);

  const container = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.12, delayChildren: 0.05 },
    },
  } as const;

  const item = {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  } as const;

  return (
    <>
      {/* Schema markup */}
      <BreadcrumbSchema schema={breadcrumbSchema} />
      {aboutSchemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      {/* Page Banner */}
      <PageBanner
        title={aboutData.hero.title}
        subtitle={aboutData.hero.body}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "About" }]}
      />

      {/* Company About Section - using your exact about component pattern */}
      <section
        id={aboutData.mission.id}
        role={aboutData.mission.role as any}
        aria-label={aboutData.mission.ariaLabel}
        className="overflow-hidden py-24 border-t border-gray-100 dark:border-gray-800"
      >
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="relative">
              <div className="pointer-events-none absolute -left-8 -top-8 h-40 w-40 rounded-full bg-brand-500/15 blur-3xl anim-float-y" />
              <div className="pointer-events-none absolute -right-10 bottom-6 h-28 w-28 rounded-full bg-brand-500/10 blur-2xl anim-float-x anim-delay-1000" />
              <div className="pointer-events-none absolute -left-10 bottom-10 h-16 w-16 rotate-12 rounded-xl border-2 border-brand-500/20 anim-spin-slow" />
              <div className="pointer-events-none absolute left-12 -bottom-8 h-10 w-10 rounded-full bg-brand-500/20 blur-md anim-float-y anim-delay-1500" />
              <div className="pointer-events-none absolute right-1/3 -top-6 h-8 w-8 rounded-full border-2 border-brand-500/30 anim-float-x anim-delay-500" />
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                viewport={{ once: true, amount: 0.3 }}
                className="relative overflow-hidden rounded-3xl border border-gray-200 shadow-sm dark:border-gray-800"
              >
                <div className="relative aspect-[16/16] bg-gray-50 dark:bg-neutral-900">
                  <Image
                    src="/images/services-graphic.webp"
                    alt="About MapleGrowth Digital"
                    fill
                    className="object-cover"
                  />
                </div>
              </motion.div>
            </div>

            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.4 }}
              className="max-w-xl"
            >
              <motion.span variants={item} className="chip-brand">
                About MapleGrowth Digital
              </motion.span>
              <motion.h2
                variants={item}
                className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl"
              >
                {aboutData.mission.title}
              </motion.h2>
              <motion.p
                variants={item}
                className="mt-4 text-gray-700 dark:text-gray-300 text-lg"
              >
                {aboutData.mission.body}
              </motion.p>

              <motion.ul
                variants={container}
                className="mt-6 grid gap-3 sm:grid-cols-1 text-sm text-gray-700 dark:text-gray-300"
              >
                {aboutData.mission.highlights.map((highlight, index) => (
                  <motion.li
                    key={index}
                    variants={item}
                    className="flex items-start gap-3"
                  >
                    <span className="mt-1 inline-block h-2 w-2 rounded-full bg-brand-500" />
                    <span>{highlight}</span>
                  </motion.li>
                ))}
              </motion.ul>

              <motion.div variants={item} className="mt-8 flex flex-wrap gap-3">
                <Link
                  href={aboutData.cta.primaryCta.href}
                  className="btn-cta"
                  aria-label={aboutData.cta.primaryCta.ariaLabel}
                >
                  {aboutData.cta.primaryCta.label}
                  <Icon name="arrow-right" size={16} className="ml-2" />
                </Link>
                <Link
                  href={aboutData.cta.secondaryCta.href}
                  className="btn-secondary"
                  aria-label={aboutData.cta.secondaryCta.ariaLabel}
                >
                  {aboutData.cta.secondaryCta.label}
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* Services Section - using your exact homepage Services component */}
      <Services
        services={{
          id: "services",
          role: "region",
          ariaLabel: "Digital marketing services",
          title: "Digital Marketing Services That Drive Growth",
          subtitle:
            "As a Canadian online marketing company, we help small businesses and scale-ups win with strategy, creativity, and technology.",
          note: "Every project — big or small — gets the same focus: fast performance, strong security, and mobile-ready experiences.",
          items: [
            {
              icon: "SEO",
              title: "SEO & Analytics",
              description:
                "Technical SEO, on-page optimization, content strategy, and analytics that compound results.",
              bullets: [
                "Local & national visibility",
                "Content roadmaps",
                "GA4 & dashboards",
              ],
              ariaLabel: "SEO and analytics service",
            },
            {
              icon: "PPC",
              title: "PPC & Paid Media",
              description:
                "ROI-first campaigns across Google, YouTube, and social. Built for fast, measurable growth.",
              bullets: [
                "Google Ads & Performance Max",
                "Retargeting",
                "Landing page CRO",
              ],
              ariaLabel: "PPC and paid media service",
            },
            {
              icon: "DEV",
              title: "Web Design & Development",
              description:
                "Conversion-focused, accessible websites engineered for speed, security, and scalability.",
              bullets: [
                "WordPress & Headless",
                "Shopify storefronts",
                "Core Web Vitals",
              ],
              ariaLabel: "Web design and development service",
            },
            {
              icon: "CONTENT",
              title: "Content & Email",
              description:
                "Editorial calendars, sales enablement content, and lifecycle email that nurtures demand.",
              bullets: [
                "Lead magnets & blogs",
                "Newsletters & flows",
                "CRM integrations",
              ],
              ariaLabel: "Content and email marketing service",
            },
            {
              icon: "BRAND",
              title: "Brand & Creative",
              description:
                "Brand systems, ad creative, and motion assets that boost recognition and conversion.",
              bullets: [
                "Visual identity",
                "Ad creative kits",
                "Video & motion",
              ],
              ariaLabel: "Brand and creative service",
            },
            {
              icon: "GROWTH",
              title: "Growth Strategy",
              description:
                "Positioning, messaging, and go-to-market plans tailored to small business digital marketing.",
              bullets: [
                "ICP & messaging",
                "Channel mix planning",
                "KPI frameworks",
              ],
              ariaLabel: "Growth strategy service",
            },
          ],
        }}
      />

      {/* Team Section - using reusable TeamSection component */}
      {/* <TeamSection
        title={aboutData.team.title}
        subtitle={aboutData.team.subtitle}
        members={aboutData.team.members}
        badgeText="Meet the Team"
      /> */}

      {/* Approach Section - using your exact services component pattern */}
      <section
        id={aboutData.approach.id}
        role={aboutData.approach.role as any}
        aria-label={aboutData.approach.ariaLabel}
        className="relative overflow-hidden py-24 border-t border-gray-100 dark:border-gray-800"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-1/2 bg-gradient-to-b from-brand-500/5 to-transparent dark:from-brand-500/10" />
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.4 }}
              className="max-w-xl"
            >
              <motion.span variants={item} className="chip-brand">
                {aboutData.approach.subtitle}
              </motion.span>
              <motion.h2
                variants={item}
                className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl"
              >
                {aboutData.approach.title}
              </motion.h2>
              <motion.p
                variants={item}
                className="mt-4 text-gray-600 dark:text-gray-300"
              >
                How we deliver growth-focused digital marketing through proven
                methodologies and transparent processes.
              </motion.p>
            </motion.div>
            <div className="hidden lg:block">
              <div className="relative">
                <ShapesBackdrop />
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                  viewport={{ once: true, amount: 0.4 }}
                  className="relative overflow-hidden rounded-2xl border border-gray-200 shadow-sm dark:border-gray-800"
                >
                  <div className="relative aspect-[4/3]">
                    <Image
                      src="/images/services-graphic.webp"
                      alt="Our approach to digital marketing"
                      fill
                      className="object-cover"
                    />
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-2"
          >
            {aboutData.approach.principles.map((principle, index) => (
              <motion.div
                key={principle.title}
                variants={item}
                whileHover={{ y: -4 }}
                className="card group p-6 transition hover:shadow-md"
                aria-label={principle.title}
              >
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-lg bg-brand-500/10 text-brand-500">
                    <Icon name="analytics" size={20} />
                  </div>
                  <h3 className="font-semibold">{principle.title}</h3>
                </div>
                <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
                  {principle.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </Container>
      </section>

      {/* Book Call Section - using your exact homepage BookCall component */}
      <BookCall
        book={{
          title: "Book a Strategy Call",
          paragraphs: [
            "If you're looking for a partner who cares about outcomes, let's talk. We'll review goals, channels, and quick wins for your next growth sprint.",
          ],
          cta: {
            label: "Book now",
            href: "https://tidycal.com/maplegrowthdigital/strategy-call",
            ariaLabel: "Open booking page for strategy call",
          },
        }}
      />

      {/* Contact Section - using reusable ContactForm component */}
      <ContactForm
        title="Tell me about your project"
        subtitle="We'll get back within 1–2 business days."
        fields={[
          {
            name: "name",
            label: "Full Name",
            type: "text",
            required: true,
            placeholder: "Your name",
          },
          {
            name: "email",
            label: "Email Address",
            type: "email",
            required: true,
            placeholder: "your@email.com",
          },
          {
            name: "company",
            label: "Company",
            type: "text",
            required: false,
            placeholder: "Your company name",
          },
          {
            name: "website",
            label: "Website",
            type: "url",
            required: false,
            placeholder: "https://yourwebsite.com",
          },
          {
            name: "services",
            label: "Services Interested In",
            type: "select",
            required: true,
            options: [
              { value: "", label: "Select services..." },
              { value: "seo", label: "SEO & Analytics" },
              { value: "ppc", label: "PPC & Paid Media" },
              { value: "web-dev", label: "Web Design & Development" },
              { value: "content", label: "Content & Email Marketing" },
              { value: "brand", label: "Brand & Creative" },
              { value: "strategy", label: "Growth Strategy" },
              { value: "multiple", label: "Multiple Services" },
              { value: "not-sure", label: "Not Sure - Need Consultation" },
            ],
          },
          {
            name: "budget",
            label: "Monthly Marketing Budget",
            type: "select",
            required: false,
            options: [
              { value: "", label: "Select budget range..." },
              { value: "under-2k", label: "Under $2,000" },
              { value: "2k-5k", label: "$2,000 - $5,000" },
              { value: "5k-10k", label: "$5,000 - $10,000" },
              { value: "10k-25k", label: "$10,000 - $25,000" },
              { value: "25k-plus", label: "$25,000+" },
              { value: "project-based", label: "One-time project" },
            ],
          },
          {
            name: "message",
            label: "Tell us about your project",
            type: "textarea",
            required: true,
            placeholder:
              "Describe your business goals, current challenges, and what you're hoping to achieve with digital marketing...",
            rows: 5,
          },
        ]}
        submitLabel="Send Message"
        submitAriaLabel="Send contact form message"
        contactDetails={{
          email: "hello@maplegrowthdigital.ca",
          phone: "+1 (431) 726-1578",
          location: "Canada",
          socials: [
            {
              platform: "Instagram",
              href: "https://www.instagram.com/maplegrowthdigital/",
              ariaLabel: "Follow MapleGrowth Digital on Instagram",
            },
            {
              platform: "YouTube",
              href: "https://youtube.com/@MapleGrowthDigital",
              ariaLabel: "Follow MapleGrowth Digital on YouTube",
            },
          ],
        }}
      />
    </>
  );
}
