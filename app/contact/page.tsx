"use client";
import Image from "next/image";
import Link from "next/link";
import { Container } from "../../components/Container";
import { PageBanner } from "../../components/PageBanner";
import { Icon } from "../../components/Icon";
import { ContactForm } from "../../components/ContactForm";
import { BreadcrumbSchema } from "../../components/BreadcrumbSchema";
import { motion } from "framer-motion";
import { generateContactPageSchema } from "../../content/page-schemas";
import { generateBreadcrumbSchema } from "../../lib/breadcrumbs";
import contactData from "../../content/contact.json";

export default function ContactPage() {
  const breadcrumbSchema = generateBreadcrumbSchema("/contact");
  const contactSchema = generateContactPageSchema();

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
  } as const;
  const item = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  } as const;

  return (
    <>
      {/* Schema markup */}
      <BreadcrumbSchema schema={breadcrumbSchema} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />

      {/* Page Banner */}
      <PageBanner
        title={contactData.hero.title}
        subtitle={contactData.hero.body}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
      />

      <main className="bg-white text-gray-900 dark:bg-neutral-950 dark:text-gray-100">
        {/* Contact Methods */}
        <section
          id={contactData.contact.id}
          role={contactData.contact.role as any}
          aria-label={contactData.contact.ariaLabel}
          className="py-16"
        >
          <Container>
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {contactData.contact.title}
              </h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                {contactData.contact.subtitle}
              </p>
            </div>

            <div className="mt-12 grid gap-8 sm:grid-cols-3">
              {contactData.contact.methods.map((method, index) => (
                <div
                  key={index}
                  className={`rounded-2xl p-6 text-center transition-all hover:shadow-lg ${
                    method.featured
                      ? "border-2 border-brand-500 bg-brand-500/5"
                      : "border border-gray-200 bg-white dark:border-gray-800 dark:bg-neutral-800"
                  }`}
                >
                  {method.featured && (
                    <div className="mb-4">
                      <span className="rounded-full bg-brand-500 px-3 py-1 text-sm font-semibold text-white">
                        Recommended
                      </span>
                    </div>
                  )}

                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-500/10 text-brand-500">
                    {method.type === "strategy-call" && (
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect
                          x="3"
                          y="4"
                          width="18"
                          height="18"
                          rx="2"
                          ry="2"
                        ></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                    )}
                    {method.type === "email" && <Icon name="mail" size={24} />}
                    {method.type === "phone" && <Icon name="phone" size={24} />}
                  </div>

                  <h3 className="mt-4 text-lg font-semibold">{method.title}</h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-300">
                    {method.description}
                  </p>

                  {method.value && (
                    <p className="mt-3 font-mono text-sm text-gray-700 dark:text-gray-200">
                      {method.value}
                    </p>
                  )}

                  <div className="mt-6">
                    <Link
                      href={method.cta.href}
                      className={`inline-flex items-center justify-center rounded-lg px-6 py-3 text-base font-semibold shadow-sm transition-colors ${
                        method.featured
                          ? "bg-brand-500 text-white hover:bg-brand-600"
                          : "border border-gray-300 bg-white text-gray-900 hover:bg-gray-50 dark:border-gray-700 dark:bg-neutral-800 dark:text-gray-100 dark:hover:bg-neutral-700"
                      }`}
                      aria-label={method.cta.ariaLabel}
                    >
                      {method.cta.label}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* Contact Form - using reusable ContactForm component */}
        <ContactForm
          title={contactData.form.title}
          subtitle={contactData.form.subtitle}
          fields={contactData.form.fields}
          submitLabel={contactData.form.submitButton.label}
          submitAriaLabel={contactData.form.submitButton.ariaLabel}
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
          officeInfo={{
            street: contactData.office.address.street,
            city: contactData.office.address.city,
            province: contactData.office.address.province,
            postalCode: contactData.office.address.postalCode,
            country: contactData.office.address.country,
            weekdays: contactData.office.hours.weekdays,
            weekend: contactData.office.hours.weekend,
            note: contactData.office.note,
          }}
        />
      </main>
    </>
  );
}
