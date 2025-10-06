"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Container } from "../../components/Container";
import { ShapesBackdrop } from "../../components/ShapesBackdrop";
import { Icon } from "../../components/Icon";
import { PageBanner } from "../../components/PageBanner";
import { Services } from "../../components/Services";
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

      {/* Team Section */}
      <section
        id={aboutData.team.id}
        role={aboutData.team.role as any}
        aria-label={aboutData.team.ariaLabel}
        className="relative bg-gradient-to-b from-gray-50 to-white py-20 dark:from-neutral-900 dark:to-neutral-950 sm:py-28"
      >
        <Container>
          <div className="text-center">
            <div className="inline-flex items-center rounded-full bg-gradient-to-r from-purple-500/10 to-brand-500/10 px-4 py-2 text-sm font-medium text-purple-600 ring-1 ring-inset ring-purple-500/20 dark:text-purple-400">
              Meet the Team
            </div>
            <h2 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              {aboutData.team.title}
            </h2>
            <p className="mt-6 text-xl text-gray-600 dark:text-gray-300">
              {aboutData.team.subtitle}
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {aboutData.team.members.map((member, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-3xl bg-white p-8 shadow-lg transition-all hover:shadow-xl hover:shadow-brand-500/10 dark:bg-neutral-800"
              >
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 via-transparent to-purple-500/5 opacity-0 transition-opacity group-hover:opacity-100" />

                <div className="relative">
                  {/* Profile Section */}
                  <div className="text-center">
                    {member.image && (
                      <div className="relative mx-auto mb-6 w-fit">
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-brand-500/20 to-purple-500/20 blur-md" />
                        <Image
                          src={member.image}
                          alt={member.name}
                          width={120}
                          height={120}
                          className="relative rounded-full ring-4 ring-white shadow-lg dark:ring-neutral-700"
                        />
                        {/* Status indicator */}
                        <div className="absolute bottom-2 right-2 h-6 w-6 rounded-full bg-green-500 ring-2 ring-white dark:ring-neutral-800">
                          <div className="flex h-full w-full items-center justify-center">
                            <svg
                              className="h-3 w-3 text-white"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                    )}

                    <h3 className="text-xl font-semibold">{member.name}</h3>
                    <p className="mt-2 text-brand-500 font-medium">
                      {member.title}
                    </p>
                  </div>

                  {/* Bio */}
                  <blockquote className="mt-6 text-center text-gray-600 dark:text-gray-300 italic">
                    "{member.bio}"
                  </blockquote>

                  {/* Expertise Tags */}
                  <div className="mt-6 flex flex-wrap justify-center gap-2">
                    {member.expertise.map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="rounded-full bg-gradient-to-r from-brand-500/10 to-purple-500/10 px-3 py-1 text-xs font-medium text-brand-600 ring-1 ring-inset ring-brand-500/20 dark:text-brand-400"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Social Links */}
                  <div className="mt-8 flex justify-center gap-4">
                    {member.linkedin && (
                      <Link
                        href={member.linkedin}
                        className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-600 transition-all hover:bg-blue-500 hover:text-white hover:shadow-lg dark:bg-neutral-700 dark:text-gray-400 dark:hover:bg-blue-500"
                        aria-label={`${member.name} LinkedIn profile`}
                      >
                        <svg
                          className="h-5 w-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </Link>
                    )}
                    {member.email && (
                      <Link
                        href={`mailto:${member.email}`}
                        className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-600 transition-all hover:bg-brand-500 hover:text-white hover:shadow-lg dark:bg-neutral-700 dark:text-gray-400 dark:hover:bg-brand-500"
                        aria-label={`Email ${member.name}`}
                      >
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

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
            label: "Name",
            type: "text",
            required: true,
            placeholder: "Name",
          },
          {
            name: "email",
            label: "Email Address",
            type: "email",
            required: true,
            placeholder: "Email Address",
          },
          {
            name: "phone",
            label: "Contact Number",
            type: "tel",
            required: false,
            placeholder: "Contact Number",
          },
          {
            name: "message",
            label: "Tell me about your project",
            type: "textarea",
            required: true,
            placeholder: "Tell me about your project",
            rows: 6,
          },
        ]}
        submitLabel="Send"
        submitAriaLabel="Send message"
        contactDetails={{
          email: "connect@maplegrowthdigital.ca",
          phone: "+1 (431) 726-1578",
          location: "Canada",
          socials: [
            {
              platform: "Instagram",
              href: "#",
              ariaLabel: "Follow on Instagram",
            },
            {
              platform: "LinkedIn",
              href: "#",
              ariaLabel: "Follow on LinkedIn",
            },
          ],
        }}
      />
    </>
  );
}
