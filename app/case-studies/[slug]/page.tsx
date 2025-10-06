import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "../../../components/Container";
import { BreadcrumbSchema } from "../../../components/BreadcrumbSchema";
import {
  generateCaseStudyPageSchema,
  mapCaseStudyData,
} from "../../../content/page-schemas";
import { generateBreadcrumbSchema } from "../../../lib/breadcrumbs";
import nundleData from "../../../content/case-study-nundle.json";
import caseStudiesData from "../../../content/case-studies.json";

type Props = { params: { slug: string } };

export async function generateStaticParams() {
  // Generate paths for all case studies
  return caseStudiesData.allCaseStudies.items.map((caseStudy) => ({
    slug: caseStudy.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // For now, using Nundle case study data as template
  // In a real app, you'd load the correct case study data based on slug
  return {
    title: nundleData.seo.title,
    description: nundleData.seo.description,
    keywords: nundleData.seo.keywords,
    alternates: {
      canonical: nundleData.seo.canonical,
    },
    openGraph: {
      title: nundleData.seo.title,
      description: nundleData.seo.description,
      url: nundleData.seo.canonical,
      type: "article",
    },
  };
}

export default function CaseStudyPage({ params }: Props) {
  // For now, only showing Nundle case study. In a real app, you'd load based on slug
  if (params.slug !== "nundle-inland-nsw-tourism") {
    return notFound();
  }

  const breadcrumbSchema = generateBreadcrumbSchema(
    `/case-studies/${params.slug}`,
    nundleData.hero.title
  );

  // Get case study data for schema
  const caseStudyItem = caseStudiesData.allCaseStudies.items.find(
    (cs) => cs.slug === params.slug
  );
  if (!caseStudyItem) return notFound();

  const caseStudyData = mapCaseStudyData(caseStudyItem);
  const caseStudySchemas = generateCaseStudyPageSchema(caseStudyData);

  return (
    <>
      {/* Schema markup */}
      <BreadcrumbSchema schema={breadcrumbSchema} />
      {caseStudySchemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <main className="bg-white text-gray-900 dark:bg-neutral-950 dark:text-gray-100">
        {/* Hero Section */}
        <section
          id={nundleData.hero.id}
          role={nundleData.hero.role as any}
          aria-label={nundleData.hero.ariaLabel}
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
                    href="/case-studies"
                    className="hover:text-gray-900 dark:hover:text-gray-200"
                  >
                    Case Studies
                  </Link>
                </li>
                <li aria-hidden>›</li>
                <li className="text-gray-900 dark:text-gray-100 truncate max-w-[40vw] sm:max-w-none">
                  {nundleData.hero.title}
                </li>
              </ol>
            </nav>

            <div className="mt-8 grid gap-12 lg:grid-cols-2 lg:items-center">
              <div>
                <div className="mb-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-brand-500/10 px-3 py-1 text-sm font-medium text-brand-500">
                    {nundleData.hero.client.industry}
                  </span>
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                    Case Study
                  </span>
                </div>

                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                  {nundleData.hero.title}
                </h1>
                <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
                  {nundleData.hero.subhead}
                </p>
                <p className="mt-6 text-lg text-gray-700 dark:text-gray-300">
                  {nundleData.hero.body}
                </p>

                {/* Stats */}
                <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {nundleData.hero.results.map((result, index) => (
                    <div key={index} className="text-center">
                      <div className="text-2xl font-bold text-brand-500 sm:text-3xl">
                        {result.value}
                      </div>
                      <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        {result.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <Image
                  src={nundleData.hero.image}
                  alt={nundleData.hero.title}
                  width={600}
                  height={400}
                  className="rounded-2xl shadow-lg"
                />
              </div>
            </div>
          </Container>
        </section>

        {/* Overview Section */}
        <section
          id={nundleData.overview.id}
          role={nundleData.overview.role as any}
          aria-label={nundleData.overview.ariaLabel}
          className="py-16"
        >
          <Container>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-center">
              {nundleData.overview.title}
            </h2>

            <div className="mt-12 grid gap-12 lg:grid-cols-2">
              {/* Challenge */}
              <div className="rounded-2xl border border-red-200 bg-red-50/50 p-8 dark:border-red-800 dark:bg-red-900/20">
                <h3 className="text-xl font-semibold text-red-800 dark:text-red-300">
                  {nundleData.overview.challenge.title}
                </h3>
                <p className="mt-4 text-gray-700 dark:text-gray-300">
                  {nundleData.overview.challenge.description}
                </p>
                <ul className="mt-6 space-y-2">
                  {nundleData.overview.challenge.keyIssues.map(
                    (issue, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400"
                      >
                        <div className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-red-500" />
                        {issue}
                      </li>
                    )
                  )}
                </ul>
              </div>

              {/* Solution */}
              <div className="rounded-2xl border border-green-200 bg-green-50/50 p-8 dark:border-green-800 dark:bg-green-900/20">
                <h3 className="text-xl font-semibold text-green-800 dark:text-green-300">
                  {nundleData.overview.solution.title}
                </h3>
                <p className="mt-4 text-gray-700 dark:text-gray-300">
                  {nundleData.overview.solution.description}
                </p>
                <ul className="mt-6 space-y-2">
                  {nundleData.overview.solution.approach.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400"
                    >
                      <div className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-green-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Container>
        </section>

        {/* Services Section */}
        <section
          id={nundleData.services.id}
          role={nundleData.services.role as any}
          aria-label={nundleData.services.ariaLabel}
          className="bg-gray-50 py-16 dark:bg-neutral-900"
        >
          <Container>
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {nundleData.services.title}
              </h2>
            </div>

            <div className="mt-12 grid gap-8 lg:grid-cols-3">
              {nundleData.services.items.map((service, index) => (
                <div
                  key={index}
                  className="rounded-2xl bg-white p-6 shadow-sm dark:bg-neutral-800"
                >
                  <h3 className="text-lg font-semibold text-brand-500">
                    {service.service}
                  </h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-300">
                    {service.description}
                  </p>
                  <div className="mt-4">
                    <h4 className="text-sm font-semibold">Key Deliverables:</h4>
                    <ul className="mt-2 space-y-1">
                      {service.deliverables.map((deliverable, delIndex) => (
                        <li
                          key={delIndex}
                          className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400"
                        >
                          <div className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-500" />
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
          id={nundleData.results.id}
          role={nundleData.results.role as any}
          aria-label={nundleData.results.ariaLabel}
          className="py-16"
        >
          <Container>
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {nundleData.results.title}
              </h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                {nundleData.results.subtitle}
              </p>
            </div>

            <div className="mt-12 space-y-12">
              {nundleData.results.metrics.map((category, categoryIndex) => (
                <div key={categoryIndex}>
                  <h3 className="text-xl font-semibold text-center mb-6">
                    {category.category}
                  </h3>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {category.results.map((result, index) => (
                      <div
                        key={index}
                        className="rounded-2xl border border-gray-200 p-6 text-center dark:border-gray-800"
                      >
                        <div className="text-3xl font-bold text-brand-500">
                          {result.value}
                        </div>
                        <div className="mt-1 text-sm text-green-600 font-medium">
                          {result.change}
                        </div>
                        <div className="mt-2 text-lg font-semibold">
                          {result.metric}
                        </div>
                        <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
                          {result.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* Testimonial Section */}
        <section
          id={nundleData.testimonial.id}
          role={nundleData.testimonial.role as any}
          aria-label={nundleData.testimonial.ariaLabel}
          className="bg-gray-50 py-16 dark:bg-neutral-900"
        >
          <Container>
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {nundleData.testimonial.title}
              </h2>
            </div>

            <div className="mt-12 mx-auto max-w-4xl">
              {/* Main Testimonial */}
              <div className="rounded-3xl bg-white p-8 shadow-lg dark:bg-neutral-800">
                <blockquote className="text-xl font-medium text-gray-900 dark:text-gray-100">
                  "{nundleData.testimonial.quote}"
                </blockquote>
                <div className="mt-6 flex items-center gap-4">
                  {nundleData.testimonial.image && (
                    <Image
                      src={nundleData.testimonial.image}
                      alt={nundleData.testimonial.author}
                      width={60}
                      height={60}
                      className="rounded-full"
                    />
                  )}
                  <div>
                    <p className="font-semibold">
                      {nundleData.testimonial.author}
                    </p>
                    <p className="text-gray-500">
                      {nundleData.testimonial.role},{" "}
                      {nundleData.testimonial.company}
                    </p>
                  </div>
                </div>
              </div>

              {/* Additional Quotes */}
              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                {nundleData.testimonial.additionalQuotes.map((quote, index) => (
                  <div
                    key={index}
                    className="rounded-2xl bg-white p-6 shadow-sm dark:bg-neutral-800"
                  >
                    <blockquote className="text-gray-700 dark:text-gray-300">
                      "{quote.quote}"
                    </blockquote>
                    <div className="mt-3">
                      <p className="font-medium text-sm">{quote.author}</p>
                      <p className="text-gray-500 text-xs">{quote.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </section>

        {/* Key Learnings Section */}
        <section
          id={nundleData.learnings.id}
          role={nundleData.learnings.role as any}
          aria-label={nundleData.learnings.ariaLabel}
          className="py-16"
        >
          <Container>
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {nundleData.learnings.title}
              </h2>
            </div>

            <div className="mt-12 grid gap-8 sm:grid-cols-2">
              {nundleData.learnings.insights.map((insight, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-gray-200 p-6 dark:border-gray-800"
                >
                  <h3 className="text-lg font-semibold">{insight.title}</h3>
                  <p className="mt-3 text-gray-600 dark:text-gray-300">
                    {insight.description}
                  </p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* Timeline Section */}
        <section
          id={nundleData.timeline.id}
          role={nundleData.timeline.role as any}
          aria-label={nundleData.timeline.ariaLabel}
          className="bg-gray-50 py-16 dark:bg-neutral-900"
        >
          <Container>
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {nundleData.timeline.title}
              </h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                {nundleData.timeline.duration} project timeline
              </p>
            </div>

            <div className="mt-12 space-y-8">
              {nundleData.timeline.phases.map((phase, index) => (
                <div key={index} className="grid gap-6 lg:grid-cols-3">
                  <div className="lg:col-span-1">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-500 text-sm font-bold text-white">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="font-semibold">{phase.phase}</h3>
                        <p className="text-sm text-gray-500">
                          {phase.duration}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-2">
                    <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-neutral-800">
                      <ul className="space-y-2">
                        {phase.activities.map((activity, actIndex) => (
                          <li
                            key={actIndex}
                            className="flex items-start gap-2 text-sm"
                          >
                            <div className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-500" />
                            {activity}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* CTA Section */}
        <section
          id={nundleData.cta.id}
          role={nundleData.cta.role as any}
          aria-label={nundleData.cta.ariaLabel}
          className="py-16"
        >
          <Container>
            <div className="rounded-3xl bg-brand-500 px-6 py-12 text-center text-white sm:px-12">
              <h2 className="text-3xl font-bold sm:text-4xl">
                {nundleData.cta.title}
              </h2>
              <p className="mt-4 text-lg text-brand-100">
                {nundleData.cta.body}
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Link
                  href={nundleData.cta.primaryCta.href}
                  className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 text-base font-semibold text-brand-500 shadow-sm hover:bg-gray-50"
                  aria-label={nundleData.cta.primaryCta.ariaLabel}
                >
                  {nundleData.cta.primaryCta.label}
                </Link>
                <Link
                  href={nundleData.cta.secondaryCta.href}
                  className="inline-flex items-center justify-center rounded-lg border-2 border-white px-6 py-3 text-base font-semibold text-white hover:bg-white hover:text-brand-500"
                  aria-label={nundleData.cta.secondaryCta.ariaLabel}
                >
                  {nundleData.cta.secondaryCta.label}
                </Link>
              </div>
            </div>
          </Container>
        </section>
      </main>
    </>
  );
}
