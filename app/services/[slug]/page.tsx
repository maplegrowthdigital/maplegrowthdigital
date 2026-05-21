import type { Metadata } from "next";
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
import geoServiceData from "../../../content/service-generative-engine-optimization.json";
import servicesData from "../../../content/services.json";

type Props = { params: { slug: string } };

// Map slug → full service data. Only slugs with a dedicated JSON file render.
const SERVICE_DATA_BY_SLUG: Record<string, typeof seoServiceData> = {
  "seo-analytics": seoServiceData,
  "generative-engine-optimization": geoServiceData,
};

export async function generateStaticParams() {
  return Object.keys(SERVICE_DATA_BY_SLUG).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = SERVICE_DATA_BY_SLUG[params.slug];
  if (!data) return {};

  return {
    title: data.seo.title,
    description: data.seo.description,
    keywords: data.seo.keywords,
    alternates: { canonical: data.seo.canonical },
    openGraph: {
      title: data.seo.title,
      description: data.seo.description,
      url: data.seo.canonical,
      type: "website",
    },
  };
}

export default function ServicePage({ params }: Props) {
  const data = SERVICE_DATA_BY_SLUG[params.slug];
  if (!data) return notFound();

  const breadcrumbSchema = generateBreadcrumbSchema(
    `/services/${params.slug}`,
    data.hero.title
  );

  const serviceItem = servicesData.services.items.find(
    (s) => mapServiceData(s).slug === params.slug
  );
  if (!serviceItem) return notFound();

  const serviceData = mapServiceData(serviceItem);
  const serviceSchema = generateServicePageSchema(serviceData);

  return (
    <>
      <BreadcrumbSchema schema={breadcrumbSchema} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />

      <main className="bg-white text-gray-900 dark:bg-neutral-950 dark:text-gray-100">
        {/* ────────────────────────────── HERO ────────────────────────────── */}
        <section
          id={data.hero.id}
          role={data.hero.role as any}
          aria-label={data.hero.ariaLabel}
          className="relative isolate overflow-hidden"
        >
          {/* Background orbs */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10"
          >
            <div className="absolute -top-32 -right-32 h-[560px] w-[560px] rounded-full bg-brand-500/10 blur-3xl dark:bg-brand-500/20" />
            <div className="absolute top-1/2 -left-40 h-[420px] w-[420px] -translate-y-1/2 rounded-full bg-brand-500/5 blur-3xl dark:bg-brand-500/10" />
          </div>

          <Container>
            <div className="pt-12 sm:pt-16">
              <nav
                aria-label="Breadcrumb"
                className="text-xs text-gray-500 dark:text-gray-400"
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
                    {data.hero.title}
                  </li>
                </ol>
              </nav>
            </div>

            <div className="grid gap-12 py-20 sm:py-28 lg:grid-cols-12 lg:items-center lg:gap-16">
              <div className="lg:col-span-7">
                <span className="inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/5 px-3 py-1 text-xs font-medium text-brand-500">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-500" />
                  Service
                </span>

                <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                  {data.hero.title}
                </h1>

                <p className="mt-6 max-w-xl text-lg text-gray-600 dark:text-gray-300">
                  {data.hero.subhead}
                </p>

                <p className="mt-8 max-w-2xl text-base text-gray-700 dark:text-gray-300 sm:text-lg leading-relaxed">
                  {data.hero.body}
                </p>

                <div className="mt-10 flex flex-wrap items-center gap-4">
                  <Link
                    href={data.hero.cta.href}
                    className="group inline-flex items-center gap-2 rounded-full bg-gray-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
                    aria-label={data.hero.cta.ariaLabel}
                  >
                    {data.hero.cta.label}
                    <span
                      aria-hidden
                      className="transition-transform group-hover:translate-x-0.5"
                    >
                      →
                    </span>
                  </Link>
                  <Link
                    href="#geo-pricing"
                    className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-900 transition hover:border-gray-400 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-100 dark:hover:border-gray-600 dark:hover:bg-neutral-900"
                  >
                    See pricing
                  </Link>
                </div>
              </div>

              {/* Quote-style preview card on the right */}
              <div className="lg:col-span-5">
                <div className="relative rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-neutral-900/60">
                  <div className="flex items-center gap-2 border-b border-gray-100 pb-4 dark:border-gray-800">
                    <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
                    <div className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                    <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
                    <span className="ml-2 text-xs text-gray-400">
                      AI search result
                    </span>
                  </div>
                  <p className="mt-4 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    <span className="text-brand-500 font-semibold">
                      Q.
                    </span>{" "}
                    {params.slug === "generative-engine-optimization"
                      ? "What is generative engine optimization?"
                      : "What does SEO and analytics include?"}
                  </p>
                  <div className="mt-3 rounded-xl bg-gray-50 p-4 text-sm text-gray-700 dark:bg-neutral-800 dark:text-gray-300 leading-relaxed">
                    <span className="text-xs font-semibold uppercase tracking-wide text-brand-500">
                      Cited source · maplegrowthdigital.ca
                    </span>
                    <p className="mt-2">{data.hero.body.split(".")[0]}.</p>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <span className="rounded-full bg-gray-100 px-2.5 py-1 dark:bg-neutral-800">
                      ChatGPT
                    </span>
                    <span className="rounded-full bg-gray-100 px-2.5 py-1 dark:bg-neutral-800">
                      Perplexity
                    </span>
                    <span className="rounded-full bg-gray-100 px-2.5 py-1 dark:bg-neutral-800">
                      Google AI Overviews
                    </span>
                    <span className="rounded-full bg-gray-100 px-2.5 py-1 dark:bg-neutral-800">
                      Gemini
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats band — typographic, no card backgrounds */}
            <div className="border-y border-gray-100 py-10 dark:border-gray-900">
              <dl className="grid grid-cols-2 gap-x-8 gap-y-8 sm:grid-cols-4">
                {data.hero.stats.map((stat, index) => (
                  <div key={index} className="text-center sm:text-left">
                    <dt className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      {stat.label}
                    </dt>
                    <dd className="mt-2 text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
                      {stat.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </Container>
        </section>

        {/* ────────────────────────────── OVERVIEW ────────────────────────────── */}
        <section
          id={data.overview.id}
          role={data.overview.role as any}
          aria-label={data.overview.ariaLabel}
          className="py-24 sm:py-32"
        >
          <Container>
            <div className="grid gap-16 lg:grid-cols-12 lg:gap-12">
              <div className="lg:col-span-5">
                <span className="text-sm font-semibold uppercase tracking-wide text-brand-500">
                  What's included
                </span>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                  {data.overview.title}
                </h2>
                <p className="mt-6 text-lg text-gray-600 dark:text-gray-300">
                  {data.overview.subtitle}
                </p>
                <p className="mt-4 text-gray-600 dark:text-gray-300 leading-relaxed">
                  {data.overview.body}
                </p>
              </div>

              <div className="lg:col-span-7">
                <ul className="divide-y divide-gray-100 dark:divide-gray-900">
                  {data.overview.features.map((feature, index) => (
                    <li
                      key={index}
                      className="group flex items-start gap-6 py-6 transition first:pt-0 last:pb-0"
                    >
                      <div className="mt-1 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-brand-500/5 text-sm font-bold text-brand-500 ring-1 ring-brand-500/10 transition group-hover:bg-brand-500 group-hover:text-white group-hover:ring-brand-500">
                        {String(index + 1).padStart(2, "0")}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold tracking-tight transition group-hover:text-brand-500">
                          {feature.title}
                        </h3>
                        <p className="mt-2 text-gray-600 dark:text-gray-300 leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Container>
        </section>

        {/* ────────────────────────────── PROCESS ────────────────────────────── */}
        <section
          id={data.process.id}
          role={data.process.role as any}
          aria-label={data.process.ariaLabel}
          className="relative border-y border-gray-100 bg-gray-50/50 py-24 sm:py-32 dark:border-gray-900 dark:bg-neutral-900/30"
        >
          <Container>
            <div className="mx-auto max-w-2xl text-center">
              <span className="text-sm font-semibold uppercase tracking-wide text-brand-500">
                Engagement
              </span>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                {data.process.title}
              </h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                {data.process.subtitle}
              </p>
            </div>

            <ol className="mx-auto mt-16 max-w-3xl space-y-12">
              {data.process.steps.map((step, index) => {
                const isLast = index === data.process.steps.length - 1;
                return (
                  <li key={index} className="relative pl-16 sm:pl-20">
                    {/* Connecting line */}
                    {!isLast && (
                      <span
                        aria-hidden
                        className="absolute left-6 top-14 -bottom-12 w-px bg-gradient-to-b from-brand-500/30 to-transparent sm:left-7"
                      />
                    )}

                    {/* Step circle */}
                    <span
                      aria-hidden
                      className="absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-full border border-brand-500/20 bg-white text-sm font-semibold text-brand-500 shadow-sm sm:h-14 sm:w-14 dark:bg-neutral-950"
                    >
                      {step.number}
                    </span>

                    <div className="pb-2">
                      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                        <h3 className="text-xl font-semibold tracking-tight">
                          {step.title}
                        </h3>
                        <span className="text-xs font-medium uppercase tracking-wide text-brand-500">
                          {step.timeline}
                        </span>
                      </div>
                      <p className="mt-3 text-gray-600 dark:text-gray-300 leading-relaxed">
                        {step.description}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {step.deliverables.map((deliverable, delIndex) => (
                          <span
                            key={delIndex}
                            className="inline-flex items-center rounded-full border border-gray-200 bg-white px-3 py-1 text-xs text-gray-700 dark:border-gray-800 dark:bg-neutral-900 dark:text-gray-300"
                          >
                            {deliverable}
                          </span>
                        ))}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          </Container>
        </section>

        {/* ────────────────────────────── RESULTS ────────────────────────────── */}
        <section
          id={data.results.id}
          role={data.results.role as any}
          aria-label={data.results.ariaLabel}
          className="py-24 sm:py-32"
        >
          <Container>
            <div className="mx-auto max-w-2xl text-center">
              <span className="text-sm font-semibold uppercase tracking-wide text-brand-500">
                Outcomes
              </span>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                {data.results.title}
              </h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                {data.results.subtitle}
              </p>
            </div>

            <dl className="mt-16 grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-12 lg:grid-cols-4 lg:gap-x-8">
              {data.results.outcomes.map((outcome, index) => (
                <div
                  key={index}
                  className="border-l-2 border-brand-500/20 pl-6 transition hover:border-brand-500"
                >
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {outcome.metric}
                  </dt>
                  <dd className="mt-2 text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
                    {outcome.improvement}
                  </dd>
                  <p className="mt-2 text-xs font-medium uppercase tracking-wide text-brand-500">
                    {outcome.timeframe}
                  </p>
                  <p className="mt-3 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    {outcome.description}
                  </p>
                </div>
              ))}
            </dl>
          </Container>
        </section>

        {/* ────────────────────────────── PRICING ────────────────────────────── */}
        <section
          id={data.pricing.id}
          role={data.pricing.role as any}
          aria-label={data.pricing.ariaLabel}
          className="border-y border-gray-100 bg-gray-50/50 py-24 sm:py-32 dark:border-gray-900 dark:bg-neutral-900/30"
        >
          <Container>
            <div className="mx-auto max-w-2xl text-center">
              <span className="text-sm font-semibold uppercase tracking-wide text-brand-500">
                Pricing
              </span>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                {data.pricing.title}
              </h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                {data.pricing.subtitle}
              </p>
            </div>

            <div className="mx-auto mt-16 grid max-w-5xl gap-6 lg:grid-cols-3">
              {data.pricing.packages.map((pkg, index) => {
                const isPopular = "popular" in pkg && pkg.popular;
                return (
                  <div
                    key={index}
                    className={
                      "relative flex flex-col rounded-3xl p-8 transition " +
                      (isPopular
                        ? "border-2 border-brand-500 bg-white shadow-xl shadow-brand-500/10 dark:bg-neutral-900"
                        : "border border-gray-200 bg-white hover:border-gray-300 hover:shadow-md dark:border-gray-800 dark:bg-neutral-900/60 dark:hover:border-gray-700")
                    }
                  >
                    {isPopular && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-500 px-4 py-1 text-xs font-semibold text-white shadow-sm">
                        Most popular
                      </span>
                    )}

                    <div>
                      <h3 className="text-lg font-semibold tracking-tight">
                        {pkg.name}
                      </h3>
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        {pkg.description}
                      </p>
                    </div>

                    <div className="mt-6 flex items-baseline gap-1">
                      <span className="text-4xl font-semibold tracking-tight">
                        {pkg.price}
                      </span>
                      {pkg.period !== "pricing" && (
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {pkg.period}
                        </span>
                      )}
                    </div>

                    <ul className="mt-8 flex-1 space-y-3 text-sm text-gray-700 dark:text-gray-300">
                      {pkg.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start gap-3">
                          <svg
                            className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-500"
                            viewBox="0 0 16 16"
                            fill="none"
                            aria-hidden="true"
                          >
                            <path
                              d="M3 8.5l3.5 3.5L13 4.5"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-8 border-t border-gray-100 pt-6 text-xs text-gray-500 dark:border-gray-800 dark:text-gray-400">
                      <strong className="text-gray-700 dark:text-gray-300">
                        Best for:
                      </strong>{" "}
                      {pkg.bestFor}
                    </div>

                    <Link
                      href={data.cta.primaryCta.href}
                      className={
                        "mt-6 inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition " +
                        (isPopular
                          ? "bg-brand-500 text-white hover:bg-brand-600"
                          : "border border-gray-300 text-gray-900 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-100 dark:hover:bg-neutral-800")
                      }
                    >
                      Get started
                    </Link>
                  </div>
                );
              })}
            </div>
          </Container>
        </section>

        {/* ────────────────────────────── FAQ ────────────────────────────── */}
        <section
          id={data.faq.id}
          role={data.faq.role as any}
          aria-label={data.faq.ariaLabel}
          className="py-24 sm:py-32"
        >
          <Container>
            <div className="mx-auto max-w-3xl">
              <div className="text-center">
                <span className="text-sm font-semibold uppercase tracking-wide text-brand-500">
                  Questions
                </span>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                  {data.faq.title}
                </h2>
              </div>

              <div className="mt-16 divide-y divide-gray-200 dark:divide-gray-800">
                {data.faq.questions.map((faq, index) => (
                  <details
                    key={index}
                    className="group py-6"
                    {...(index === 0 ? { open: true } : {})}
                  >
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-left">
                      <h3 className="text-base font-semibold tracking-tight transition group-hover:text-brand-500 sm:text-lg">
                        {faq.question}
                      </h3>
                      <span
                        aria-hidden
                        className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border border-gray-300 text-gray-500 transition group-open:rotate-45 group-open:border-brand-500 group-open:text-brand-500 dark:border-gray-700"
                      >
                        <svg
                          width="10"
                          height="10"
                          viewBox="0 0 10 10"
                          fill="none"
                        >
                          <path
                            d="M5 1v8M1 5h8"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                        </svg>
                      </span>
                    </summary>
                    <p className="mt-4 pr-12 text-gray-600 dark:text-gray-300 leading-relaxed">
                      {faq.answer}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </Container>
        </section>

        {/* ────────────────────────────── CTA ────────────────────────────── */}
        <section
          id={data.cta.id}
          role={data.cta.role as any}
          aria-label={data.cta.ariaLabel}
          className="pb-24 sm:pb-32"
        >
          <Container>
            <div className="relative isolate overflow-hidden rounded-3xl bg-gray-900 px-6 py-16 text-center sm:px-12 sm:py-20 dark:bg-neutral-900">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 -z-10"
              >
                <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-brand-500/30 blur-3xl" />
                <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-brand-500/20 blur-3xl" />
              </div>

              <h2 className="mx-auto max-w-2xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                {data.cta.title}
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-base text-gray-300 sm:text-lg">
                {data.cta.body}
              </p>

              <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
                <Link
                  href={data.cta.primaryCta.href}
                  className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-gray-900 shadow-sm transition hover:bg-gray-100"
                  aria-label={data.cta.primaryCta.ariaLabel}
                >
                  {data.cta.primaryCta.label}
                  <span
                    aria-hidden
                    className="transition-transform group-hover:translate-x-0.5"
                  >
                    →
                  </span>
                </Link>
                <Link
                  href={data.cta.secondaryCta.href}
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                  aria-label={data.cta.secondaryCta.ariaLabel}
                >
                  {data.cta.secondaryCta.label}
                </Link>
              </div>
            </div>
          </Container>
        </section>
      </main>
    </>
  );
}
