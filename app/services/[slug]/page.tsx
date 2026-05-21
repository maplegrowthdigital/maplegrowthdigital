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

  const exampleQuery =
    params.slug === "generative-engine-optimization"
      ? "What is generative engine optimization?"
      : "What does SEO and analytics include?";

  return (
    <>
      <BreadcrumbSchema schema={breadcrumbSchema} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />

      <main className="bg-white text-gray-900 dark:bg-neutral-950 dark:text-gray-100">
        {/* ═══════════════════════════════════════════════════════════════
            HERO — committed crimson, display headline, asymmetric
            ═══════════════════════════════════════════════════════════════ */}
        <section
          id={data.hero.id}
          role={data.hero.role as any}
          aria-label={data.hero.ariaLabel}
          className="relative isolate overflow-hidden border-b border-gray-100 dark:border-gray-900"
        >
          <Container>
            <nav
              aria-label="Breadcrumb"
              className="pt-10 text-xs text-gray-500 dark:text-gray-400"
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
                <li aria-hidden>/</li>
                <li>
                  <Link
                    href="/services"
                    className="hover:text-gray-900 dark:hover:text-gray-200"
                  >
                    Services
                  </Link>
                </li>
                <li aria-hidden>/</li>
                <li className="text-gray-900 dark:text-gray-100 truncate">
                  {data.hero.title}
                </li>
              </ol>
            </nav>

            <div className="grid gap-x-12 gap-y-16 pb-12 pt-14 lg:grid-cols-12 lg:pb-16 lg:pt-20">
              <div className="lg:col-span-8">
                <h1
                  className="font-semibold tracking-tight"
                  style={{
                    fontSize: "clamp(2.5rem, 7vw, 6rem)",
                    lineHeight: 0.95,
                  }}
                >
                  {data.hero.title.split(" ").map((word, i, arr) => {
                    const isLast = i === arr.length - 1;
                    return (
                      <span key={i}>
                        {word}
                        {!isLast && " "}
                      </span>
                    );
                  })}
                </h1>

                <p
                  className="mt-8 max-w-2xl text-gray-700 dark:text-gray-300"
                  style={{ fontSize: "clamp(1.125rem, 1.4vw, 1.375rem)", lineHeight: 1.5 }}
                >
                  {data.hero.subhead}
                </p>

                <p className="mt-6 max-w-2xl text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                  {data.hero.body}
                </p>

                <div className="mt-10 flex flex-wrap items-center gap-3">
                  <Link
                    href={data.hero.cta.href}
                    className="group inline-flex items-center gap-2 bg-brand-500 px-7 py-4 text-sm font-semibold text-white transition hover:bg-brand-600"
                    aria-label={data.hero.cta.ariaLabel}
                  >
                    {data.hero.cta.label}
                    <span
                      aria-hidden
                      className="transition-transform group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </Link>
                  <Link
                    href="#geo-pricing"
                    className="inline-flex items-center gap-2 px-7 py-4 text-sm font-semibold text-gray-900 underline decoration-1 underline-offset-4 transition hover:text-brand-500 dark:text-gray-100"
                  >
                    See pricing
                  </Link>
                </div>
              </div>

              {/* AI search result preview — pushed wider, off the grid */}
              <aside className="lg:col-span-4 lg:pt-4">
                <div className="relative">
                  <div className="absolute -inset-2 bg-brand-500/10 blur-2xl" aria-hidden />
                  <div className="relative border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-neutral-900">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-3 dark:border-gray-800">
                      <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-brand-500">
                        Live in AI search
                      </span>
                      <div className="flex gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-brand-500/30" />
                        <span className="h-1.5 w-1.5 rounded-full bg-brand-500/60" />
                        <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
                      </div>
                    </div>
                    <p className="mt-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                      {exampleQuery}
                    </p>
                    <div className="mt-3 border-l-2 border-brand-500 pl-4 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      {data.hero.body.split(".")[0]}.
                    </div>
                    <div className="mt-4 text-[11px] uppercase tracking-wider text-gray-500 dark:text-gray-500">
                      Cited · maplegrowthdigital.ca
                    </div>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {["ChatGPT", "Perplexity", "AI Overviews", "Gemini"].map((p) => (
                        <span
                          key={p}
                          className="border border-gray-200 px-2 py-0.5 text-[10px] font-medium text-gray-600 dark:border-gray-800 dark:text-gray-400"
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </aside>
            </div>

            {/* Inline narrative stats — not a hero-metric grid */}
            <p className="border-t border-gray-100 py-10 text-base leading-relaxed text-gray-600 dark:border-gray-900 dark:text-gray-400 sm:text-lg">
              {data.hero.stats.map((stat, i, arr) => (
                <span key={i}>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {stat.value}
                  </span>{" "}
                  <span>{stat.label.toLowerCase()}</span>
                  {i < arr.length - 1 && (
                    <span className="mx-3 text-brand-500" aria-hidden>·</span>
                  )}
                </span>
              ))}
            </p>
          </Container>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            OVERVIEW — numbered editorial, big numerals carry the weight
            ═══════════════════════════════════════════════════════════════ */}
        <section
          id={data.overview.id}
          role={data.overview.role as any}
          aria-label={data.overview.ariaLabel}
          className="py-24 sm:py-32"
        >
          <Container>
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
              <header className="lg:col-span-5">
                <h2
                  className="font-semibold tracking-tight"
                  style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", lineHeight: 1.05 }}
                >
                  {data.overview.title}
                </h2>
                <p className="mt-6 text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                  {data.overview.body}
                </p>
              </header>

              <ol className="lg:col-span-7 lg:pt-2">
                {data.overview.features.map((feature, index) => (
                  <li
                    key={index}
                    className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 border-b border-gray-100 py-8 first:pt-0 last:border-b-0 dark:border-gray-900 sm:gap-x-10"
                  >
                    <div
                      className="font-semibold text-brand-500"
                      style={{ fontSize: "clamp(2rem, 3.5vw, 3rem)", lineHeight: 1 }}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </div>
                    <div className="self-center">
                      <h3 className="text-xl font-semibold tracking-tight sm:text-2xl">
                        {feature.title}
                      </h3>
                      <p className="mt-3 text-gray-600 dark:text-gray-400 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </Container>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            PROCESS — vertical rhythm, oversized step numerals
            ═══════════════════════════════════════════════════════════════ */}
        <section
          id={data.process.id}
          role={data.process.role as any}
          aria-label={data.process.ariaLabel}
          className="relative border-y border-gray-100 bg-gray-50/40 py-24 sm:py-32 dark:border-gray-900 dark:bg-neutral-950"
        >
          <Container>
            <div className="max-w-2xl">
              <h2
                className="font-semibold tracking-tight"
                style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", lineHeight: 1.05 }}
              >
                {data.process.title}
              </h2>
              <p className="mt-6 text-lg text-gray-600 dark:text-gray-400">
                {data.process.subtitle}
              </p>
            </div>

            <ol className="mt-20 space-y-20">
              {data.process.steps.map((step, index) => (
                <li
                  key={index}
                  className="grid gap-6 lg:grid-cols-12 lg:gap-12"
                >
                  <div className="lg:col-span-3">
                    <div
                      className="font-semibold text-brand-500"
                      style={{ fontSize: "clamp(3.5rem, 8vw, 7rem)", lineHeight: 0.9 }}
                    >
                      {step.number}
                    </div>
                    <div className="mt-3 text-xs font-medium uppercase tracking-[0.15em] text-gray-500 dark:text-gray-500">
                      {step.timeline}
                    </div>
                  </div>
                  <div className="lg:col-span-9">
                    <h3
                      className="font-semibold tracking-tight"
                      style={{ fontSize: "clamp(1.5rem, 2.2vw, 2rem)", lineHeight: 1.15 }}
                    >
                      {step.title}
                    </h3>
                    <p className="mt-4 max-w-2xl text-gray-600 dark:text-gray-400 leading-relaxed sm:text-lg">
                      {step.description}
                    </p>
                    <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-700 dark:text-gray-300">
                      {step.deliverables.map((deliverable, delIndex) => (
                        <li key={delIndex} className="flex items-baseline gap-2">
                          <span className="text-brand-500" aria-hidden>
                            +
                          </span>
                          {deliverable}
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              ))}
            </ol>
          </Container>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            RESULTS — typographic stats, no boxes, no side-stripes
            ═══════════════════════════════════════════════════════════════ */}
        <section
          id={data.results.id}
          role={data.results.role as any}
          aria-label={data.results.ariaLabel}
          className="py-24 sm:py-32"
        >
          <Container>
            <div className="max-w-2xl">
              <h2
                className="font-semibold tracking-tight"
                style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", lineHeight: 1.05 }}
              >
                {data.results.title}
              </h2>
              <p className="mt-6 text-lg text-gray-600 dark:text-gray-400">
                {data.results.subtitle}
              </p>
            </div>

            <dl className="mt-16 grid gap-x-12 gap-y-16 sm:grid-cols-2">
              {data.results.outcomes.map((outcome, index) => (
                <div key={index}>
                  <dd
                    className="font-semibold tracking-tight text-brand-500"
                    style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", lineHeight: 1 }}
                  >
                    {outcome.improvement}
                  </dd>
                  <dt className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
                    {outcome.metric}
                  </dt>
                  <p className="mt-3 max-w-md text-gray-600 dark:text-gray-400 leading-relaxed">
                    {outcome.description}
                  </p>
                  <p className="mt-3 text-xs font-medium uppercase tracking-[0.15em] text-gray-500">
                    Timeline · {outcome.timeframe}
                  </p>
                </div>
              ))}
            </dl>
          </Container>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            PRICING — varied weight, popular tier dominates
            ═══════════════════════════════════════════════════════════════ */}
        <section
          id={data.pricing.id}
          role={data.pricing.role as any}
          aria-label={data.pricing.ariaLabel}
          className="border-y border-gray-100 bg-gray-50/40 py-24 sm:py-32 dark:border-gray-900 dark:bg-neutral-950"
        >
          <Container>
            <div className="max-w-2xl">
              <h2
                className="font-semibold tracking-tight"
                style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", lineHeight: 1.05 }}
              >
                {data.pricing.title}
              </h2>
              <p className="mt-6 text-lg text-gray-600 dark:text-gray-400">
                {data.pricing.subtitle}
              </p>
            </div>

            <div className="mt-16 grid gap-6 lg:grid-cols-4">
              {data.pricing.packages.map((pkg, index) => {
                const isPopular = "popular" in pkg && pkg.popular;
                return (
                  <div
                    key={index}
                    className={
                      "flex flex-col p-8 " +
                      (isPopular
                        ? "bg-brand-500 text-white lg:col-span-2 lg:p-10"
                        : "border border-gray-200 bg-white dark:border-gray-800 dark:bg-neutral-900 lg:col-span-1")
                    }
                  >
                    {isPopular && (
                      <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-white/80">
                        Most chosen
                      </div>
                    )}
                    <h3
                      className={
                        "font-semibold tracking-tight " +
                        (isPopular ? "text-3xl sm:text-4xl" : "text-2xl")
                      }
                    >
                      {pkg.name}
                    </h3>
                    <p
                      className={
                        "mt-3 text-sm leading-relaxed " +
                        (isPopular
                          ? "text-white/90"
                          : "text-gray-600 dark:text-gray-400")
                      }
                    >
                      {pkg.description}
                    </p>

                    <div className="mt-8 flex items-baseline gap-1">
                      <span
                        className={
                          "font-semibold tracking-tight " +
                          (isPopular ? "text-5xl sm:text-6xl" : "text-4xl")
                        }
                      >
                        {pkg.price}
                      </span>
                      {pkg.period !== "pricing" && (
                        <span
                          className={
                            "text-sm " +
                            (isPopular
                              ? "text-white/80"
                              : "text-gray-500 dark:text-gray-500")
                          }
                        >
                          {pkg.period}
                        </span>
                      )}
                    </div>

                    <ul
                      className={
                        "mt-8 flex-1 space-y-3 text-sm " +
                        (isPopular ? "text-white/90" : "text-gray-700 dark:text-gray-300")
                      }
                    >
                      {pkg.features.map((feature, featureIndex) => (
                        <li
                          key={featureIndex}
                          className="flex items-start gap-3"
                        >
                          <span
                            aria-hidden
                            className={
                              "mt-1 flex-shrink-0 " +
                              (isPopular ? "text-white" : "text-brand-500")
                            }
                          >
                            +
                          </span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <div
                      className={
                        "mt-8 border-t pt-6 text-xs " +
                        (isPopular
                          ? "border-white/20 text-white/80"
                          : "border-gray-100 text-gray-500 dark:border-gray-800 dark:text-gray-500")
                      }
                    >
                      <span
                        className={
                          isPopular
                            ? "font-semibold text-white"
                            : "font-semibold text-gray-700 dark:text-gray-300"
                        }
                      >
                        Best for:
                      </span>{" "}
                      {pkg.bestFor}
                    </div>

                    <Link
                      href={data.cta.primaryCta.href}
                      className={
                        "mt-6 inline-flex items-center justify-between px-5 py-3 text-sm font-semibold transition " +
                        (isPopular
                          ? "bg-white text-brand-500 hover:bg-gray-100"
                          : "bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100")
                      }
                    >
                      Get started
                      <span aria-hidden>→</span>
                    </Link>
                  </div>
                );
              })}
            </div>
          </Container>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            FAQ — native accordion, generous spacing
            ═══════════════════════════════════════════════════════════════ */}
        <section
          id={data.faq.id}
          role={data.faq.role as any}
          aria-label={data.faq.ariaLabel}
          className="py-24 sm:py-32"
        >
          <Container>
            <div className="grid gap-16 lg:grid-cols-12 lg:gap-12">
              <div className="lg:col-span-4">
                <h2
                  className="font-semibold tracking-tight"
                  style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", lineHeight: 1.05 }}
                >
                  {data.faq.title}
                </h2>
                <p className="mt-6 text-gray-600 dark:text-gray-400 leading-relaxed">
                  Still have questions? <Link href="/contact" className="text-brand-500 underline decoration-1 underline-offset-4 hover:text-brand-600">Get in touch.</Link>
                </p>
              </div>

              <div className="lg:col-span-8">
                <div className="divide-y divide-gray-200 dark:divide-gray-800">
                  {data.faq.questions.map((faq, index) => (
                    <details
                      key={index}
                      className="group py-7"
                      {...(index === 0 ? { open: true } : {})}
                    >
                      <summary className="flex cursor-pointer list-none items-start justify-between gap-6">
                        <h3
                          className="font-semibold tracking-tight transition group-hover:text-brand-500"
                          style={{
                            fontSize: "clamp(1.125rem, 1.5vw, 1.5rem)",
                            lineHeight: 1.25,
                          }}
                        >
                          {faq.question}
                        </h3>
                        <span
                          aria-hidden
                          className="mt-1 flex h-7 w-7 flex-shrink-0 items-center justify-center border border-gray-300 text-gray-500 transition group-open:rotate-45 group-open:border-brand-500 group-open:bg-brand-500 group-open:text-white dark:border-gray-700"
                        >
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                            <path
                              d="M5 1v8M1 5h8"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                            />
                          </svg>
                        </span>
                      </summary>
                      <p className="mt-5 max-w-3xl pr-10 text-gray-600 dark:text-gray-400 leading-relaxed sm:text-lg">
                        {faq.answer}
                      </p>
                    </details>
                  ))}
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            CTA — drenched in crimson, committed
            ═══════════════════════════════════════════════════════════════ */}
        <section
          id={data.cta.id}
          role={data.cta.role as any}
          aria-label={data.cta.ariaLabel}
          className="bg-brand-500 text-white"
        >
          <Container>
            <div className="grid gap-12 py-20 sm:py-28 lg:grid-cols-12 lg:items-end lg:gap-16">
              <div className="lg:col-span-8">
                <h2
                  className="font-semibold tracking-tight"
                  style={{ fontSize: "clamp(2.25rem, 5vw, 4.5rem)", lineHeight: 1 }}
                >
                  {data.cta.title}
                </h2>
                <p className="mt-6 max-w-xl text-base text-white/90 sm:text-lg leading-relaxed">
                  {data.cta.body}
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row lg:col-span-4 lg:flex-col lg:items-stretch">
                <Link
                  href={data.cta.primaryCta.href}
                  className="group inline-flex items-center justify-between gap-2 bg-white px-6 py-4 text-sm font-semibold text-brand-500 transition hover:bg-gray-100"
                  aria-label={data.cta.primaryCta.ariaLabel}
                >
                  {data.cta.primaryCta.label}
                  <span
                    aria-hidden
                    className="transition-transform group-hover:translate-x-1"
                  >
                    →
                  </span>
                </Link>
                <Link
                  href={data.cta.secondaryCta.href}
                  className="inline-flex items-center justify-between gap-2 border border-white/30 px-6 py-4 text-sm font-semibold text-white transition hover:bg-white/10"
                  aria-label={data.cta.secondaryCta.ariaLabel}
                >
                  {data.cta.secondaryCta.label}
                  <span aria-hidden>→</span>
                </Link>
              </div>
            </div>
          </Container>
        </section>
      </main>
    </>
  );
}
