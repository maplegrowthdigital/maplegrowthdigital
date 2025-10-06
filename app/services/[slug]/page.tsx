import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "../../../components/Container";
import { BreadcrumbSchema } from "../../../components/BreadcrumbSchema";
import {
  generateServicePageSchema,
  mapServiceData,
} from "../../../content/page-schemas";
import { generateBreadcrumbSchema } from "../../../lib/breadcrumbs";
import seoServiceData from "../../../content/service-seo-analytics.json";
import servicesData from "../../../content/services.json";

type Props = { params: { slug: string } };

export async function generateStaticParams() {
  // Generate paths for all services
  return servicesData.services.items.map((service) => ({
    slug: mapServiceData(service).slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // For now, using SEO service data as template
  // In a real app, you'd load the correct service data based on slug
  return {
    title: seoServiceData.seo.title,
    description: seoServiceData.seo.description,
    keywords: seoServiceData.seo.keywords,
    alternates: {
      canonical: seoServiceData.seo.canonical,
    },
    openGraph: {
      title: seoServiceData.seo.title,
      description: seoServiceData.seo.description,
      url: seoServiceData.seo.canonical,
      type: "website",
    },
  };
}

export default function ServicePage({ params }: Props) {
  // For now, only showing SEO service. In a real app, you'd load based on slug
  if (params.slug !== "seo-analytics") {
    return notFound();
  }

  const breadcrumbSchema = generateBreadcrumbSchema(
    `/services/${params.slug}`,
    seoServiceData.hero.title
  );

  // Get service data for schema
  const serviceItem = servicesData.services.items.find(
    (s) => mapServiceData(s).slug === params.slug
  );
  if (!serviceItem) return notFound();

  const serviceData = mapServiceData(serviceItem);
  const serviceSchema = generateServicePageSchema(serviceData);

  return (
    <>
      {/* Schema markup */}
      <BreadcrumbSchema schema={breadcrumbSchema} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />

      <main className="bg-white text-gray-900 dark:bg-neutral-950 dark:text-gray-100">
        {/* Hero Section */}
        <section
          id={seoServiceData.hero.id}
          role={seoServiceData.hero.role as any}
          aria-label={seoServiceData.hero.ariaLabel}
          className="relative overflow-hidden py-16 sm:py-24"
        >
          <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-brand-500/5 via-white to-white dark:via-neutral-950 dark:to-neutral-950" />
          <Container>
            <nav
              aria-label="Breadcrumb"
              className="text-xs text-gray-600 dark:text-gray-400"
            >
              <ol className="flex items-center gap-2">
                <li>
                  <Link
                    href="/"
                    className="hover:text-gray-900 dark:hover:text-gray-200"
                  >
                    Home
                  </Link>
                </li>
                <li aria-hidden>›</li>
                <li>
                  <Link
                    href="/services"
                    className="hover:text-gray-900 dark:hover:text-gray-200"
                  >
                    Services
                  </Link>
                </li>
                <li aria-hidden>›</li>
                <li className="text-gray-900 dark:text-gray-100 truncate">
                  {seoServiceData.hero.title}
                </li>
              </ol>
            </nav>

            <div className="mt-8 grid gap-12 lg:grid-cols-2 lg:items-center">
              <div>
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                  {seoServiceData.hero.title}
                </h1>
                <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
                  {seoServiceData.hero.subhead}
                </p>
                <p className="mt-6 text-lg text-gray-700 dark:text-gray-300">
                  {seoServiceData.hero.body}
                </p>

                {/* Stats */}
                <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {seoServiceData.hero.stats.map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="text-2xl font-bold text-brand-500 sm:text-3xl">
                        {stat.value}
                      </div>
                      <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8">
                  <Link
                    href={seoServiceData.hero.cta.href}
                    className="inline-flex items-center justify-center rounded-lg bg-brand-500 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-brand-600"
                    aria-label={seoServiceData.hero.cta.ariaLabel}
                  >
                    {seoServiceData.hero.cta.label}
                  </Link>
                </div>
              </div>

              {seoServiceData.hero.image && (
                <div className="relative">
                  <Image
                    src={seoServiceData.hero.image}
                    alt={seoServiceData.hero.title}
                    width={600}
                    height={400}
                    className="rounded-2xl shadow-lg"
                  />
                </div>
              )}
            </div>
          </Container>
        </section>

        {/* Overview Section */}
        <section
          id={seoServiceData.overview.id}
          role={seoServiceData.overview.role as any}
          aria-label={seoServiceData.overview.ariaLabel}
          className="py-16"
        >
          <Container>
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {seoServiceData.overview.title}
              </h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                {seoServiceData.overview.subtitle}
              </p>
              <p className="mt-6 text-lg text-gray-700 dark:text-gray-300">
                {seoServiceData.overview.body}
              </p>
            </div>

            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {seoServiceData.overview.features.map((feature, index) => (
                <div key={index} className="text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-500/10">
                    <div className="text-brand-500 text-2xl font-bold">
                      {feature.icon.toUpperCase().slice(0, 3)}
                    </div>
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* Process Section */}
        <section
          id={seoServiceData.process.id}
          role={seoServiceData.process.role as any}
          aria-label={seoServiceData.process.ariaLabel}
          className="bg-gray-50 py-16 dark:bg-neutral-900"
        >
          <Container>
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {seoServiceData.process.title}
              </h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                {seoServiceData.process.subtitle}
              </p>
            </div>

            <div className="mt-12 space-y-12">
              {seoServiceData.process.steps.map((step, index) => (
                <div
                  key={index}
                  className="grid gap-8 lg:grid-cols-2 lg:items-center"
                >
                  <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-500 text-xl font-bold text-white">
                        {step.number}
                      </div>
                      <h3 className="text-xl font-semibold">{step.title}</h3>
                    </div>
                    <p className="mt-4 text-gray-600 dark:text-gray-300">
                      {step.description}
                    </p>
                    <p className="mt-2 text-sm font-medium text-brand-500">
                      {step.timeline}
                    </p>
                  </div>

                  <div
                    className={`rounded-2xl bg-white p-6 shadow-sm dark:bg-neutral-800 ${
                      index % 2 === 1 ? "lg:order-1" : ""
                    }`}
                  >
                    <h4 className="font-semibold">Deliverables:</h4>
                    <ul className="mt-3 space-y-2">
                      {step.deliverables.map((deliverable, delIndex) => (
                        <li
                          key={delIndex}
                          className="flex items-center gap-2 text-sm"
                        >
                          <div className="h-1.5 w-1.5 rounded-full bg-brand-500" />
                          {deliverable}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* Results Section */}
        <section
          id={seoServiceData.results.id}
          role={seoServiceData.results.role as any}
          aria-label={seoServiceData.results.ariaLabel}
          className="py-16"
        >
          <Container>
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {seoServiceData.results.title}
              </h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                {seoServiceData.results.subtitle}
              </p>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {seoServiceData.results.outcomes.map((outcome, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-gray-200 p-6 text-center dark:border-gray-800"
                >
                  <div className="text-3xl font-bold text-brand-500">
                    {outcome.improvement}
                  </div>
                  <div className="mt-1 text-lg font-semibold">
                    {outcome.metric}
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    {outcome.timeframe}
                  </div>
                  <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
                    {outcome.description}
                  </p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* Pricing Section */}
        <section
          id={seoServiceData.pricing.id}
          role={seoServiceData.pricing.role as any}
          aria-label={seoServiceData.pricing.ariaLabel}
          className="bg-gray-50 py-16 dark:bg-neutral-900"
        >
          <Container>
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {seoServiceData.pricing.title}
              </h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                {seoServiceData.pricing.subtitle}
              </p>
            </div>

            <div className="mt-12 grid gap-8 lg:grid-cols-3">
              {seoServiceData.pricing.packages.map((pkg, index) => (
                <div
                  key={index}
                  className={`relative rounded-2xl p-8 shadow-sm ${
                    pkg.popular
                      ? "border-2 border-brand-500 bg-white dark:bg-neutral-800"
                      : "border border-gray-200 bg-white dark:border-gray-800 dark:bg-neutral-800"
                  }`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-brand-500 px-4 py-1 text-sm font-semibold text-white">
                      Most Popular
                    </div>
                  )}

                  <h3 className="text-xl font-semibold">{pkg.name}</h3>
                  <div className="mt-4">
                    <span className="text-3xl font-bold">{pkg.price}</span>
                    {pkg.period !== "pricing" && (
                      <span className="text-gray-500"> {pkg.period}</span>
                    )}
                  </div>
                  <p className="mt-4 text-gray-600 dark:text-gray-300">
                    {pkg.description}
                  </p>

                  <ul className="mt-6 space-y-3">
                    {pkg.features.map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className="flex items-center gap-2 text-sm"
                      >
                        <div className="h-1.5 w-1.5 rounded-full bg-brand-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 text-xs text-gray-500">
                    <strong>Best for:</strong> {pkg.bestFor}
                  </div>

                  <div className="mt-8">
                    <Link
                      href={seoServiceData.cta.primaryCta.href}
                      className={`inline-flex w-full items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold shadow-sm ${
                        pkg.popular
                          ? "bg-brand-500 text-white hover:bg-brand-600"
                          : "border border-gray-300 bg-white text-gray-900 hover:bg-gray-50 dark:border-gray-700 dark:bg-neutral-800 dark:text-gray-100 dark:hover:bg-neutral-700"
                      }`}
                    >
                      Get Started
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* FAQ Section */}
        <section
          id={seoServiceData.faq.id}
          role={seoServiceData.faq.role as any}
          aria-label={seoServiceData.faq.ariaLabel}
          className="py-16"
        >
          <Container>
            <div className="mx-auto max-w-3xl">
              <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  {seoServiceData.faq.title}
                </h2>
              </div>

              <div className="mt-12 space-y-6">
                {seoServiceData.faq.questions.map((faq, index) => (
                  <div
                    key={index}
                    className="rounded-2xl border border-gray-200 p-6 dark:border-gray-800"
                  >
                    <h3 className="font-semibold">{faq.question}</h3>
                    <p className="mt-3 text-gray-600 dark:text-gray-300">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </section>

        {/* CTA Section */}
        <section
          id={seoServiceData.cta.id}
          role={seoServiceData.cta.role as any}
          aria-label={seoServiceData.cta.ariaLabel}
          className="py-16"
        >
          <Container>
            <div className="rounded-3xl bg-brand-500 px-6 py-12 text-center text-white sm:px-12">
              <h2 className="text-3xl font-bold sm:text-4xl">
                {seoServiceData.cta.title}
              </h2>
              <p className="mt-4 text-lg text-brand-100">
                {seoServiceData.cta.body}
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Link
                  href={seoServiceData.cta.primaryCta.href}
                  className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 text-base font-semibold text-brand-500 shadow-sm hover:bg-gray-50"
                  aria-label={seoServiceData.cta.primaryCta.ariaLabel}
                >
                  {seoServiceData.cta.primaryCta.label}
                </Link>
                <Link
                  href={seoServiceData.cta.secondaryCta.href}
                  className="inline-flex items-center justify-center rounded-lg border-2 border-white px-6 py-3 text-base font-semibold text-white hover:bg-white hover:text-brand-500"
                  aria-label={seoServiceData.cta.secondaryCta.ariaLabel}
                >
                  {seoServiceData.cta.secondaryCta.label}
                </Link>
              </div>
            </div>
          </Container>
        </section>
      </main>
    </>
  );
}
