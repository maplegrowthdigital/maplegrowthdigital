import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Container } from "../../components/Container";
import { BreadcrumbSchema } from "../../components/BreadcrumbSchema";
import {
  generateCaseStudiesPageSchema,
  mapCaseStudyData,
} from "../../content/page-schemas";
import { generateBreadcrumbSchema } from "../../lib/breadcrumbs";
import caseStudiesData from "../../content/case-studies.json";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: caseStudiesData.seo.title,
    description: caseStudiesData.seo.description,
    keywords: caseStudiesData.seo.keywords,
    alternates: {
      canonical: caseStudiesData.seo.canonical,
    },
    openGraph: {
      title: caseStudiesData.seo.title,
      description: caseStudiesData.seo.description,
      url: caseStudiesData.seo.canonical,
      type: "website",
    },
  };
}

export default function CaseStudiesPage() {
  const breadcrumbSchema = generateBreadcrumbSchema("/case-studies");

  // Convert case study data for schema
  const caseStudyData =
    caseStudiesData.allCaseStudies.items.map(mapCaseStudyData);
  const caseStudiesSchema = generateCaseStudiesPageSchema(caseStudyData);

  return (
    <>
      {/* Schema markup */}
      <BreadcrumbSchema schema={breadcrumbSchema} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(caseStudiesSchema) }}
      />

      <main className="bg-white text-gray-900 dark:bg-neutral-950 dark:text-gray-100">
        {/* Hero Section */}
        <section
          id={caseStudiesData.hero.id}
          role={caseStudiesData.hero.role as any}
          aria-label={caseStudiesData.hero.ariaLabel}
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
                <li className="text-gray-900 dark:text-gray-100">
                  Case Studies
                </li>
              </ol>
            </nav>

            <div className="mt-8 text-center">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                {caseStudiesData.hero.title}
              </h1>
              <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
                {caseStudiesData.hero.subhead}
              </p>
              <p className="mt-6 text-lg text-gray-700 dark:text-gray-300">
                {caseStudiesData.hero.body}
              </p>

              {/* Stats */}
              <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {caseStudiesData.hero.stats.map((stat, index) => (
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
            </div>
          </Container>
        </section>

        {/* Intro Section */}
        <section
          id={caseStudiesData.intro.id}
          role={caseStudiesData.intro.role as any}
          aria-label={caseStudiesData.intro.ariaLabel}
          className="py-16"
        >
          <Container>
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {caseStudiesData.intro.title}
              </h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                {caseStudiesData.intro.subtitle}
              </p>
              <p className="mt-6 text-lg text-gray-700 dark:text-gray-300">
                {caseStudiesData.intro.body}
              </p>
            </div>
          </Container>
        </section>

        {/* Featured Case Study */}
        <section
          id={caseStudiesData.featured.id}
          role={caseStudiesData.featured.role as any}
          aria-label={caseStudiesData.featured.ariaLabel}
          className="bg-gray-50 py-16 dark:bg-neutral-900"
        >
          <Container>
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {caseStudiesData.featured.title}
              </h2>
            </div>

            <div className="mt-12 overflow-hidden rounded-3xl bg-white shadow-lg dark:bg-neutral-800">
              <div className="grid lg:grid-cols-2">
                <div className="relative aspect-[4/3] lg:aspect-auto">
                  <Image
                    src={caseStudiesData.featured.caseStudy.image}
                    alt={caseStudiesData.featured.caseStudy.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-8 lg:p-12">
                  <div className="mb-4 flex flex-wrap gap-2">
                    <span className="rounded-full bg-brand-500/10 px-3 py-1 text-xs font-medium text-brand-500">
                      {caseStudiesData.featured.caseStudy.category}
                    </span>
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                      {caseStudiesData.featured.caseStudy.duration}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold">
                    {caseStudiesData.featured.caseStudy.title}
                  </h3>
                  <p className="mt-4 text-gray-600 dark:text-gray-300">
                    {caseStudiesData.featured.caseStudy.challenge}
                  </p>

                  {/* Key Results */}
                  <div className="mt-6 grid gap-4 sm:grid-cols-3">
                    {caseStudiesData.featured.caseStudy.results.map(
                      (result, index) => (
                        <div key={index} className="text-center">
                          <div className="text-xl font-bold text-brand-500">
                            {result.value}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {result.metric}
                          </div>
                        </div>
                      )
                    )}
                  </div>

                  <div className="mt-8">
                    <Link
                      href={`/case-studies/${caseStudiesData.featured.caseStudy.slug}`}
                      className="inline-flex items-center justify-center rounded-lg bg-brand-500 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-brand-600"
                    >
                      Read Full Case Study
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* All Case Studies */}
        <section
          id={caseStudiesData.allCaseStudies.id}
          role={caseStudiesData.allCaseStudies.role as any}
          aria-label={caseStudiesData.allCaseStudies.ariaLabel}
          className="py-16"
        >
          <Container>
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {caseStudiesData.allCaseStudies.title}
              </h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                {caseStudiesData.allCaseStudies.subtitle}
              </p>
            </div>

            {/* Filters */}
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {caseStudiesData.allCaseStudies.filters.map((filter, index) => (
                <button
                  key={index}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    index === 0
                      ? "bg-brand-500 text-white"
                      : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-neutral-800 dark:text-gray-300 dark:hover:bg-neutral-700"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Case Studies Grid */}
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {caseStudiesData.allCaseStudies.items.map((caseStudy, index) => (
                <article
                  key={index}
                  className="group overflow-hidden rounded-2xl bg-white shadow-sm transition-all hover:shadow-lg dark:bg-neutral-800"
                >
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={caseStudy.image}
                      alt={caseStudy.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-gray-900 backdrop-blur-sm">
                        {caseStudy.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="mb-3 flex flex-wrap gap-2">
                      {caseStudy.services.map((service, serviceIndex) => (
                        <span
                          key={serviceIndex}
                          className="rounded-full bg-brand-500/10 px-2 py-1 text-xs font-medium text-brand-500"
                        >
                          {service}
                        </span>
                      ))}
                    </div>

                    <h3 className="text-lg font-semibold">
                      <Link
                        href={caseStudy.link}
                        className="hover:text-brand-500"
                      >
                        {caseStudy.title}
                      </Link>
                    </h3>
                    <p className="mt-2 text-gray-600 dark:text-gray-300 text-sm">
                      {caseStudy.summary}
                    </p>

                    {/* Results */}
                    <div className="mt-4 space-y-1">
                      {caseStudy.results
                        .slice(0, 2)
                        .map((result, resultIndex) => (
                          <div
                            key={resultIndex}
                            className="flex items-center gap-2 text-xs text-gray-500"
                          >
                            <div className="h-1 w-1 rounded-full bg-brand-500" />
                            {result}
                          </div>
                        ))}
                    </div>

                    <div className="mt-6 flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {caseStudy.duration}
                      </span>
                      <Link
                        href={caseStudy.link}
                        className="text-sm font-medium text-brand-500 hover:underline"
                      >
                        Read Case Study →
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </Container>
        </section>

        {/* Industries Section */}
        <section
          id={caseStudiesData.industries.id}
          role={caseStudiesData.industries.role as any}
          aria-label={caseStudiesData.industries.ariaLabel}
          className="bg-gray-50 py-16 dark:bg-neutral-900"
        >
          <Container>
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {caseStudiesData.industries.title}
              </h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                {caseStudiesData.industries.subtitle}
              </p>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {caseStudiesData.industries.sectors.map((sector, index) => (
                <div
                  key={index}
                  className="rounded-2xl bg-white p-6 text-center shadow-sm dark:bg-neutral-800"
                >
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-500/10 text-2xl">
                    {sector.icon.toUpperCase().slice(0, 2)}
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">{sector.name}</h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-300 text-sm">
                    {sector.description}
                  </p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* Process Section */}
        <section
          id={caseStudiesData.process.id}
          role={caseStudiesData.process.role as any}
          aria-label={caseStudiesData.process.ariaLabel}
          className="py-16"
        >
          <Container>
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {caseStudiesData.process.title}
              </h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                {caseStudiesData.process.subtitle}
              </p>
            </div>

            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {caseStudiesData.process.steps.map((step, index) => (
                <div key={index} className="text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-500 text-2xl font-bold text-white">
                    {index + 1}
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-300">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* CTA Section */}
        <section
          id={caseStudiesData.cta.id}
          role={caseStudiesData.cta.role as any}
          aria-label={caseStudiesData.cta.ariaLabel}
          className="py-16"
        >
          <Container>
            <div className="rounded-3xl bg-brand-500 px-6 py-12 text-center text-white sm:px-12">
              <h2 className="text-3xl font-bold sm:text-4xl">
                {caseStudiesData.cta.title}
              </h2>
              <p className="mt-4 text-lg text-brand-100">
                {caseStudiesData.cta.body}
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Link
                  href={caseStudiesData.cta.primaryCta.href}
                  className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 text-base font-semibold text-brand-500 shadow-sm hover:bg-gray-50"
                  aria-label={caseStudiesData.cta.primaryCta.ariaLabel}
                >
                  {caseStudiesData.cta.primaryCta.label}
                </Link>
                <Link
                  href={caseStudiesData.cta.secondaryCta.href}
                  className="inline-flex items-center justify-center rounded-lg border-2 border-white px-6 py-3 text-base font-semibold text-white hover:bg-white hover:text-brand-500"
                  aria-label={caseStudiesData.cta.secondaryCta.ariaLabel}
                >
                  {caseStudiesData.cta.secondaryCta.label}
                </Link>
              </div>
            </div>
          </Container>
        </section>
      </main>
    </>
  );
}
