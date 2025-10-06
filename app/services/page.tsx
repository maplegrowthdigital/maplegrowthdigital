"use client";
import Image from "next/image";
import Link from "next/link";
import { Container } from "../../components/Container";
import { ShapesBackdrop } from "../../components/ShapesBackdrop";
import { Icon } from "../../components/Icon";
import { PageBanner } from "../../components/PageBanner";
import { Process } from "../../components/Process";
import { BookCall } from "../../components/BookCall";
import { ContactForm } from "../../components/ContactForm";
import { BreadcrumbSchema } from "../../components/BreadcrumbSchema";
import { motion } from "framer-motion";
import {
  generateServicesPageSchema,
  mapServiceData,
} from "../../content/page-schemas";
import { generateBreadcrumbSchema } from "../../lib/breadcrumbs";
import servicesData from "../../content/services.json";

function ServiceIcon({ icon }: { icon: string }) {
  const iconMap: { [key: string]: string } = {
    SEO: "analytics",
    PPC: "ppc",
    DEV: "web-dev",
    CONTENT: "content",
    BRAND: "brand",
    GROWTH: "growth",
    DEFAULT: "search",
  };

  const iconName = iconMap[icon] || iconMap.DEFAULT;
  return <Icon name={iconName} size={20} />;
}

export default function ServicesPage() {
  const breadcrumbSchema = generateBreadcrumbSchema("/services");

  // Convert services data for schema
  const serviceData = servicesData.services.items.map(mapServiceData);
  const servicesSchema = generateServicesPageSchema(serviceData);

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesSchema) }}
      />

      {/* Page Banner */}
      <PageBanner
        title={servicesData.hero.title}
        subtitle={servicesData.hero.body}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Services" }]}
      />

      <main className="bg-white text-gray-900 dark:bg-neutral-950 dark:text-gray-100">
        {/* Why Our Services Work Section - using your exact services component pattern */}
        <section
          id={servicesData.intro.id}
          role={servicesData.intro.role as any}
          aria-label={servicesData.intro.ariaLabel}
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
                  Why Our Services Work
                </motion.span>
                <motion.h2
                  variants={item}
                  className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl"
                >
                  {servicesData.intro.title}
                </motion.h2>
                <motion.p
                  variants={item}
                  className="mt-4 text-gray-600 dark:text-gray-300"
                >
                  {servicesData.intro.body}
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
                        alt="Why our services work"
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
              {servicesData.intro.highlights.map((highlight, index) => (
                <motion.div
                  key={highlight}
                  variants={item}
                  whileHover={{ y: -4 }}
                  className="card group p-6 transition hover:shadow-md"
                  aria-label={highlight}
                >
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-lg bg-brand-500/10 text-brand-500">
                      <Icon name="analytics" size={20} />
                    </div>
                    <h3 className="font-semibold">{highlight}</h3>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </Container>
        </section>

        {/* Enhanced Services Grid */}
        <section
          id={servicesData.services.id}
          role={servicesData.services.role as any}
          aria-label={servicesData.services.ariaLabel}
          className="relative overflow-hidden py-24 border-t border-gray-100 dark:border-gray-800"
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-1/2 bg-gradient-to-b from-brand-500/5 to-transparent dark:from-brand-500/10" />
          <Container>
            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.4 }}
              className="text-center"
            >
              <motion.span variants={item} className="chip-brand">
                Our Services
              </motion.span>
              <motion.h2
                variants={item}
                className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl"
              >
                {servicesData.services.title}
              </motion.h2>
              <motion.p
                variants={item}
                className="mt-4 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
              >
                {servicesData.services.subtitle}
              </motion.p>
            </motion.div>

            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
            >
              {servicesData.services.items.map((service, index) => (
                <motion.div
                  key={index}
                  variants={item}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group relative overflow-hidden rounded-3xl bg-white p-8 shadow-lg transition-all hover:shadow-xl hover:shadow-brand-500/20 dark:bg-neutral-800"
                >
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

                  <div className="relative">
                    <div className="mb-6">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500/10 to-brand-500/5 group-hover:from-brand-500/20 group-hover:to-brand-500/10 transition-all">
                        <div className="text-brand-500 text-xl">
                          <ServiceIcon icon={service.icon || "DEFAULT"} />
                        </div>
                      </div>
                    </div>

                    <h3 className="text-xl font-semibold group-hover:text-brand-500 transition-colors">
                      {service.title}
                    </h3>
                    <p className="mt-3 text-gray-600 dark:text-gray-300 leading-relaxed">
                      {service.description}
                    </p>

                    <ul className="mt-6 space-y-3">
                      {service.bullets.map((bullet, bulletIndex) => (
                        <li
                          key={bulletIndex}
                          className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400"
                        >
                          <div className="h-2 w-2 rounded-full bg-brand-500 group-hover:bg-brand-600 transition-colors" />
                          {bullet}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-8 rounded-xl bg-gray-50/80 p-4 backdrop-blur dark:bg-neutral-900/50">
                      <p className="text-sm font-semibold text-brand-500">
                        {service.pricing}
                      </p>
                      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                        <strong>Includes:</strong>
                        <ul className="mt-2 space-y-1">
                          {service.deliverables
                            .slice(0, 2)
                            .map((deliverable, delIndex) => (
                              <li
                                key={delIndex}
                                className="flex items-center gap-2"
                              >
                                <div className="h-1 w-1 rounded-full bg-brand-500" />
                                {deliverable}
                              </li>
                            ))}
                          {service.deliverables.length > 2 && (
                            <li className="flex items-center gap-2">
                              <div className="h-1 w-1 rounded-full bg-brand-500" />
                              +{service.deliverables.length - 2} more
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Bottom accent line */}
                  <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-brand-500 to-brand-600 transition-all duration-500 group-hover:w-full" />
                </motion.div>
              ))}
            </motion.div>
          </Container>
        </section>

        {/* Process Section - using your exact homepage Process component */}
        <Process
          process={{
            title: servicesData.process.title,
            intro: servicesData.process.subtitle,
            steps: servicesData.process.steps.map((step) => ({
              title: step.title,
              description: step.description,
            })),
          }}
        />

        {/* Book Call Section - using your exact homepage BookCall component */}
        <BookCall
          book={{
            title: "Ready to Scale Your Business?",
            paragraphs: [
              "Let's discuss which services will drive the biggest impact for your business goals.",
            ],
            cta: {
              label: "Book a Strategy Call",
              href: "https://tidycal.com/maplegrowthdigital/strategy-call",
              ariaLabel: "Book a strategy call to discuss your service needs",
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
      </main>
    </>
  );
}
