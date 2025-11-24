"use client";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Container } from "../../components/Container";
import { PageBanner } from "../../components/PageBanner";
import { BookCall } from "../../components/BookCall";
import { ContactForm } from "../../components/ContactForm";
import { BreadcrumbSchema } from "../../components/BreadcrumbSchema";
import { generateBreadcrumbSchema } from "../../lib/breadcrumbs";
import { getAllCaseStudies } from "../../content/case-studies";

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

export default function CaseStudiesPage() {
  const breadcrumbSchema = generateBreadcrumbSchema("/case-studies");
  const allCaseStudies = getAllCaseStudies();

  return (
    <>
      {/* Schema markup */}
      <BreadcrumbSchema schema={breadcrumbSchema} />

      {/* Page Banner */}
      <PageBanner
        title="Case Studies"
        subtitle="Real results from real clients. See how our data-driven approach to digital marketing delivers sustainable growth for businesses across Canada and beyond."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Case Studies" }]}
      />

      {/* Intro Section */}
      <section className="overflow-hidden py-16 border-t border-gray-100 dark:border-gray-800">
        <Container>
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            className="mx-auto max-w-3xl text-center"
          >
            <motion.span variants={item} className="chip-brand">
              Our Work
            </motion.span>
            <motion.h2
              variants={item}
              className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl"
            >
              Results That Speak for Themselves
            </motion.h2>
            <motion.p
              variants={item}
              className="mt-4 text-lg text-gray-600 dark:text-gray-300"
            >
              Every case study represents a partnership focused on measurable
              business outcomes. These showcase real campaigns, real challenges,
              and real results.
            </motion.p>
          </motion.div>
        </Container>
      </section>

      {/* Case Studies Grid */}
      <section className="relative overflow-hidden py-16 border-t border-gray-100 dark:border-gray-800">
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-1/2 bg-gradient-to-b from-brand-500/5 to-transparent dark:from-brand-500/10" />
        <Container>
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
          >
            {allCaseStudies.map((caseStudy) => (
              <motion.article
                key={caseStudy.slug}
                variants={item}
                whileHover={{ y: -8, scale: 1.02 }}
                className="card group overflow-hidden transition hover:shadow-xl hover:shadow-brand-500/20"
              >
                <div className="relative aspect-[4/3]">
                  <Image
                    src={caseStudy.image}
                    alt={caseStudy.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-gray-900 backdrop-blur-sm">
                      {caseStudy.category}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="mb-3 flex flex-wrap gap-2">
                    {caseStudy.services.slice(0, 2).map((service, index) => (
                      <span
                        key={index}
                        className="rounded-full bg-brand-500/10 px-2 py-1 text-xs font-medium text-brand-500"
                      >
                        {service}
                      </span>
                    ))}
                  </div>

                  <h3 className="text-lg font-semibold">
                    <Link
                      href={`/case-studies/${caseStudy.slug}`}
                      className="hover:text-brand-500"
                    >
                      {caseStudy.title}
                    </Link>
                  </h3>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                    {caseStudy.summary}
                  </p>

                  {/* Key Results */}
                  <div className="mt-4 space-y-1">
                    {caseStudy.results.slice(0, 2).map((result, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 text-xs text-gray-500"
                      >
                        <div className="h-1 w-1 rounded-full bg-brand-500" />
                        <span className="font-medium text-brand-600 dark:text-brand-400">
                          {result.value}
                        </span>{" "}
                        {result.metric}
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {caseStudy.duration}
                    </span>
                    <Link
                      href={`/case-studies/${caseStudy.slug}`}
                      className="text-sm font-medium text-brand-500 hover:underline"
                    >
                      Read Case Study →
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </Container>
      </section>

      {/* Industries Section */}
      <section className="overflow-hidden py-24 border-t border-gray-100 dark:border-gray-800">
        <Container>
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            className="text-center"
          >
            <motion.span variants={item} className="chip-brand">
              Industries We Serve
            </motion.span>
            <motion.h2
              variants={item}
              className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl"
            >
              Specialized Expertise Across Sectors
            </motion.h2>
            <motion.p
              variants={item}
              className="mt-4 text-lg text-gray-600 dark:text-gray-300"
            >
              From e-commerce to B2B services, we bring industry-specific
              knowledge to every campaign.
            </motion.p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {[
              {
                name: "E-commerce & Retail",
                description:
                  "Conversion optimization, SEO, and PPC for online stores",
              },
              {
                name: "B2B Services",
                description:
                  "Lead generation and demand creation for service businesses",
              },
              {
                name: "Tourism & Hospitality",
                description: "Local SEO and destination marketing strategies",
              },
              {
                name: "Healthcare & Wellness",
                description: "Compliant marketing for healthcare providers",
              },
              {
                name: "Technology",
                description: "Growth marketing for SaaS and tech companies",
              },
              {
                name: "Professional Services",
                description: "Authority building and client acquisition",
              },
            ].map((sector, index) => (
              <motion.div
                key={index}
                variants={item}
                whileHover={{ y: -4 }}
                className="card p-6 text-center transition hover:shadow-md"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-500/10 text-xl font-bold text-brand-500">
                  {sector.name.charAt(0)}
                </div>
                <h3 className="mt-4 font-semibold">{sector.name}</h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  {sector.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </Container>
      </section>

      {/* Book Call Section */}
      <BookCall
        book={{
          title: "Ready to Write Your Success Story?",
          paragraphs: [
            "Let's discuss how we can deliver similar results for your business. Every great case study starts with a strategy call.",
          ],
          cta: {
            label: "Book Strategy Call",
            href: "https://tidycal.com/maplegrowthdigital/strategy-call",
            ariaLabel: "Book a strategy call to discuss your marketing goals",
          },
        }}
      />

      {/* Contact Form */}
      <ContactForm
        title="Tell us about your project"
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
            name: "message",
            label: "Tell us about your project",
            type: "textarea",
            required: true,
            placeholder:
              "Describe your business goals, current challenges, and what you're hoping to achieve...",
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
