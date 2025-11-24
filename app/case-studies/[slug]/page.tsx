import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "../../../components/Container";
import { BreadcrumbSchema } from "../../../components/BreadcrumbSchema";
import { generateBreadcrumbSchema } from "../../../lib/breadcrumbs";
import {
  getCaseStudyBySlug,
  getAllCaseStudies,
} from "../../../content/case-studies";

type Props = { params: { slug: string } };

export async function generateStaticParams() {
  const caseStudies = getAllCaseStudies();
  return caseStudies.map((cs) => ({
    slug: cs.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const caseStudy = getCaseStudyBySlug(params.slug);
  if (!caseStudy) return {};

  const seo = caseStudy.seo || {
    title: `${caseStudy.title} Case Study — MapleGrowth Digital`,
    description: caseStudy.summary,
    keywords: [],
    canonical: `https://www.maplegrowthdigital.ca/case-studies/${caseStudy.slug}`,
  };

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    alternates: {
      canonical: seo.canonical,
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: seo.canonical,
      type: "article",
      images: caseStudy.image ? [{ url: caseStudy.image }] : undefined,
    },
  };
}

export default function CaseStudyPage({ params }: Props) {
  const caseStudy = getCaseStudyBySlug(params.slug);

  if (!caseStudy) {
    return notFound();
  }

  const breadcrumbSchema = generateBreadcrumbSchema(
    `/case-studies/${params.slug}`,
    caseStudy.title
  );

  return (
    <>
      {/* Schema markup */}
      <BreadcrumbSchema schema={breadcrumbSchema} />

      <main className="bg-white text-gray-900 dark:bg-neutral-950 dark:text-gray-100">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-16 sm:py-24">
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
                <li className="truncate max-w-[40vw] text-gray-900 dark:text-gray-100 sm:max-w-none">
                  {caseStudy.title}
                </li>
              </ol>
            </nav>

            <div className="mt-8 grid gap-12 lg:grid-cols-2 lg:items-center">
              <div>
                <div className="mb-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-brand-500/10 px-3 py-1 text-sm font-medium text-brand-500">
                    {caseStudy.category}
                  </span>
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                    {caseStudy.duration}
                  </span>
                </div>

                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                  {caseStudy.title}
                </h1>
                <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
                  {caseStudy.summary}
                </p>

                {/* Client Info */}
                <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-500">Client</div>
                    <div className="font-medium">{caseStudy.client.name}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Industry</div>
                    <div className="font-medium">
                      {caseStudy.client.industry}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500">Location</div>
                    <div className="font-medium">
                      {caseStudy.client.location}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500">Duration</div>
                    <div className="font-medium">{caseStudy.duration}</div>
                  </div>
                </div>

                {/* Services */}
                <div className="mt-6 flex flex-wrap gap-2">
                  {caseStudy.services.map((service, index) => (
                    <span
                      key={index}
                      className="rounded-full border border-brand-500/20 bg-brand-500/5 px-3 py-1 text-xs font-medium text-brand-600 dark:text-brand-400"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>

              <div className="relative">
                <Image
                  src={caseStudy.image}
                  alt={caseStudy.title}
                  width={600}
                  height={400}
                  className="rounded-2xl shadow-lg"
                />
              </div>
            </div>
          </Container>
        </section>

        {/* Challenge & Solution */}
        <section className="py-16">
          <Container>
            <div className="grid gap-12 lg:grid-cols-2">
              {/* Challenge */}
              <div className="rounded-2xl border border-red-200 bg-red-50/50 p-8 dark:border-red-800 dark:bg-red-900/20">
                <h2 className="text-2xl font-semibold text-red-800 dark:text-red-300">
                  The Challenge
                </h2>
                <p className="mt-4 text-gray-700 dark:text-gray-300">
                  {caseStudy.challenge}
                </p>
              </div>

              {/* Solution */}
              <div className="rounded-2xl border border-green-200 bg-green-50/50 p-8 dark:border-green-800 dark:bg-green-900/20">
                <h2 className="text-2xl font-semibold text-green-800 dark:text-green-300">
                  Our Solution
                </h2>
                <p className="mt-4 text-gray-700 dark:text-gray-300">
                  {caseStudy.solution}
                </p>
              </div>
            </div>
          </Container>
        </section>

        {/* Results */}
        <section className="bg-gray-50 py-16 dark:bg-neutral-900">
          <Container>
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Results & Impact
              </h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                Measurable business outcomes
              </p>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {caseStudy.results.map((result, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm dark:border-gray-800 dark:bg-neutral-800"
                >
                  <div className="text-3xl font-bold text-brand-500">
                    {result.value}
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
          </Container>
        </section>

        {/* Approach (if available) */}
        {caseStudy.content?.approach && (
          <section className="py-16">
            <Container>
              <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  Our Approach
                </h2>
              </div>

              <div className="mx-auto mt-12 max-w-3xl">
                <ul className="space-y-3">
                  {caseStudy.content.approach.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 text-lg text-gray-700 dark:text-gray-300"
                    >
                      <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-brand-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Container>
          </section>
        )}

        {/* Timeline (if available) */}
        {caseStudy.content?.timeline && (
          <section className="bg-gray-50 py-16 dark:bg-neutral-900">
            <Container>
              <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  Project Timeline
                </h2>
              </div>

              <div className="mt-12 space-y-8">
                {caseStudy.content.timeline.map((phase, index) => (
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
        )}

        {/* Testimonial (if available) */}
        {caseStudy.testimonial && (
          <section className="py-16">
            <Container>
              <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  Client Testimonial
                </h2>
              </div>

              <div className="mx-auto mt-12 max-w-4xl">
                <div className="rounded-3xl bg-gray-50 p-8 dark:bg-neutral-900">
                  <blockquote className="text-xl font-medium text-gray-900 dark:text-gray-100">
                    "{caseStudy.testimonial.quote}"
                  </blockquote>
                  <div className="mt-6">
                    <p className="font-semibold">
                      {caseStudy.testimonial.author}
                    </p>
                    <p className="text-gray-500">
                      {caseStudy.testimonial.role},{" "}
                      {caseStudy.testimonial.company}
                    </p>
                  </div>
                </div>
              </div>
            </Container>
          </section>
        )}

        {/* Key Learnings (if available) */}
        {caseStudy.content?.keyLearnings && (
          <section className="bg-gray-50 py-16 dark:bg-neutral-900">
            <Container>
              <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  Key Learnings
                </h2>
              </div>

              <div className="mx-auto mt-12 max-w-3xl space-y-4">
                {caseStudy.content.keyLearnings.map((learning, index) => (
                  <div
                    key={index}
                    className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-neutral-800"
                  >
                    <p className="text-gray-700 dark:text-gray-300">
                      {learning}
                    </p>
                  </div>
                ))}
              </div>
            </Container>
          </section>
        )}

        {/* CTA Section */}
        <section className="py-16">
          <Container>
            <div className="rounded-3xl bg-brand-500 px-6 py-12 text-center text-white sm:px-12">
              <h2 className="text-3xl font-bold sm:text-4xl">
                Ready for Similar Results?
              </h2>
              <p className="mt-4 text-lg text-brand-100">
                See how we can drive measurable growth for your business with
                our proven strategies.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Link
                  href="https://tidycal.com/maplegrowthdigital/strategy-call"
                  className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 text-base font-semibold text-brand-500 shadow-sm hover:bg-gray-50"
                >
                  Book Strategy Call
                </Link>
                <Link
                  href="/case-studies"
                  className="inline-flex items-center justify-center rounded-lg border-2 border-white px-6 py-3 text-base font-semibold text-white hover:bg-white hover:text-brand-500"
                >
                  View More Case Studies
                </Link>
              </div>
            </div>
          </Container>
        </section>
      </main>
    </>
  );
}
