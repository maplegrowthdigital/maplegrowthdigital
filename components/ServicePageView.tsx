"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Container } from "./Container";
import type seoServiceData from "../content/service-seo-analytics.json";

type ServiceData = typeof seoServiceData;

type Props = {
  data: ServiceData;
  slug: string;
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

// Hand-picked Unsplash photos for service pages. Verified IDs.
// Hero cycles by slug so each service page gets a different hero photo.
const SLUG_IMAGERY: Record<
  string,
  { hero: string; problem: string; feature1: string; feature2: string }
> = {
  "generative-engine-optimization": {
    hero: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80",
    problem:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80",
    feature1:
      "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80",
    feature2:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1200&q=80",
  },
  "seo-analytics": {
    hero: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=80",
    problem:
      "https://images.unsplash.com/photo-1543286386-713bdd548da4?auto=format&fit=crop&w=1200&q=80",
    feature1:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    feature2:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
  },
};

const DEFAULT_IMAGERY = SLUG_IMAGERY["generative-engine-optimization"]!;

export function ServicePageView({ data, slug }: Props) {
  const imagery = SLUG_IMAGERY[slug] || DEFAULT_IMAGERY;

  return (
    <main className="bg-stone-50 text-gray-900 dark:bg-neutral-950 dark:text-gray-100">
      {/* ──────────────────────── HERO ──────────────────────── */}
      <section
        id={data.hero.id}
        role={data.hero.role as any}
        aria-label={data.hero.ariaLabel}
        className="bg-white dark:bg-neutral-950"
      >
        <Container>
          <nav
            aria-label="Breadcrumb"
            className="pt-8 text-xs text-gray-500 dark:text-gray-400"
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

          <div className="grid items-center gap-12 py-16 lg:grid-cols-12 lg:gap-16 lg:py-24">
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="show"
              className="lg:col-span-7"
            >
              <motion.h1
                variants={fadeUp}
                className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-[3.5rem] lg:leading-[1.05]"
              >
                {data.hero.title}
              </motion.h1>
              <motion.p
                variants={fadeUp}
                className="mt-6 max-w-xl text-lg text-gray-600 dark:text-gray-300"
              >
                {data.hero.subhead}
              </motion.p>
              <motion.p
                variants={fadeUp}
                className="mt-6 max-w-2xl text-base text-gray-600 dark:text-gray-400 leading-relaxed"
              >
                {data.hero.body}
              </motion.p>
              <motion.div
                variants={fadeUp}
                className="mt-10 flex flex-wrap items-center gap-4"
              >
                <Link
                  href={data.hero.cta.href}
                  className="group inline-flex items-center gap-2 rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-600"
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
                  className="inline-flex items-center gap-2 text-sm font-semibold text-gray-900 underline decoration-1 underline-offset-4 transition hover:text-brand-500 dark:text-gray-100"
                >
                  See pricing
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-5"
            >
              <div className="overflow-hidden rounded-3xl bg-gray-100 dark:bg-neutral-900">
                <img
                  src={imagery.hero}
                  alt={`Visual representation of ${data.hero.title.toLowerCase()}`}
                  loading="eager"
                  className="aspect-[4/5] h-full w-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* ──────────────────────── TRUST STRIP ──────────────────────── */}
      <section className="border-y border-gray-100 bg-white dark:border-gray-900 dark:bg-neutral-950">
        <Container>
          <motion.dl
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="grid grid-cols-2 gap-x-8 gap-y-10 py-12 sm:grid-cols-4"
          >
            {data.hero.stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={fadeUp}
                className="text-center sm:text-left"
              >
                <dd className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
                  {stat.value}
                </dd>
                <dt className="mt-2 text-xs font-medium uppercase tracking-[0.1em] text-gray-500 dark:text-gray-400">
                  {stat.label}
                </dt>
              </motion.div>
            ))}
          </motion.dl>
        </Container>
      </section>

      {/* ──────────────────────── PROBLEM / OPENING NARRATIVE ──────────────────────── */}
      <section className="py-20 sm:py-28">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              className="lg:col-span-6"
            >
              <motion.span
                variants={fadeUp}
                className="text-xs font-medium uppercase tracking-[0.15em] text-brand-500"
              >
                The shift
              </motion.span>
              <motion.h2
                variants={fadeUp}
                className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl"
              >
                Buyers ask AI now. Your site needs to answer.
              </motion.h2>
              <motion.p
                variants={fadeUp}
                className="mt-6 text-lg text-gray-600 dark:text-gray-300 leading-relaxed"
              >
                {data.overview.body}
              </motion.p>
              <motion.p
                variants={fadeUp}
                className="mt-4 text-base text-gray-600 dark:text-gray-400 leading-relaxed"
              >
                {data.overview.subtitle}
              </motion.p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true, amount: 0.3 }}
              className="lg:col-span-6"
            >
              <div className="overflow-hidden rounded-3xl">
                <img
                  src={imagery.problem}
                  alt="AI and search visualization"
                  loading="lazy"
                  className="aspect-[4/3] h-full w-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* ──────────────────────── FEATURES (ALTERNATING IMAGE/TEXT) ──────────────────────── */}
      <section className="border-y border-gray-100 bg-white py-20 dark:border-gray-900 dark:bg-neutral-950 sm:py-28">
        <Container>
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="max-w-2xl"
          >
            <motion.span
              variants={fadeUp}
              className="text-xs font-medium uppercase tracking-[0.15em] text-brand-500"
            >
              What's included
            </motion.span>
            <motion.h2
              variants={fadeUp}
              className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl"
            >
              {data.overview.title}
            </motion.h2>
          </motion.div>

          <div className="mt-16 space-y-20 sm:space-y-28">
            {data.overview.features.map((feature, index) => {
              const isReversed = index % 2 === 1;
              const featureImage =
                index < 2
                  ? imagery.feature1
                  : imagery.feature2;
              return (
                <div
                  key={index}
                  className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16"
                >
                  <motion.div
                    initial={{ opacity: 0, x: isReversed ? 30 : -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.8,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    viewport={{ once: true, amount: 0.3 }}
                    className={
                      "lg:col-span-6 " +
                      (isReversed ? "lg:order-2" : "lg:order-1")
                    }
                  >
                    <div className="overflow-hidden rounded-3xl">
                      <img
                        src={featureImage}
                        alt={feature.title}
                        loading="lazy"
                        className="aspect-[5/4] h-full w-full object-cover"
                      />
                    </div>
                  </motion.div>
                  <motion.div
                    variants={stagger}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.3 }}
                    className={
                      "lg:col-span-6 " +
                      (isReversed ? "lg:order-1" : "lg:order-2")
                    }
                  >
                    <motion.span
                      variants={fadeUp}
                      className="inline-block text-sm font-mono text-gray-400"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </motion.span>
                    <motion.h3
                      variants={fadeUp}
                      className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl"
                    >
                      {feature.title}
                    </motion.h3>
                    <motion.p
                      variants={fadeUp}
                      className="mt-4 text-base text-gray-600 dark:text-gray-300 leading-relaxed sm:text-lg"
                    >
                      {feature.description}
                    </motion.p>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ──────────────────────── PROCESS ──────────────────────── */}
      <section
        id={data.process.id}
        role={data.process.role as any}
        aria-label={data.process.ariaLabel}
        className="py-20 sm:py-28"
      >
        <Container>
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="max-w-2xl"
          >
            <motion.span
              variants={fadeUp}
              className="text-xs font-medium uppercase tracking-[0.15em] text-brand-500"
            >
              How we work
            </motion.span>
            <motion.h2
              variants={fadeUp}
              className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl"
            >
              {data.process.title}
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="mt-6 text-lg text-gray-600 dark:text-gray-300"
            >
              {data.process.subtitle}
            </motion.p>
          </motion.div>

          <motion.ol
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8"
          >
            {data.process.steps.map((step, index) => (
              <motion.li
                key={index}
                variants={fadeUp}
                className="border-t border-gray-200 pt-6 dark:border-gray-800"
              >
                <div className="flex items-baseline gap-3">
                  <span className="text-sm font-mono text-brand-500">
                    {step.number}
                  </span>
                  <span className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    {step.timeline}
                  </span>
                </div>
                <h3 className="mt-3 text-lg font-semibold tracking-tight">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {step.description}
                </p>
              </motion.li>
            ))}
          </motion.ol>
        </Container>
      </section>

      {/* ──────────────────────── RESULTS ──────────────────────── */}
      <section
        id={data.results.id}
        role={data.results.role as any}
        aria-label={data.results.ariaLabel}
        className="border-y border-gray-100 bg-white py-20 dark:border-gray-900 dark:bg-neutral-950 sm:py-28"
      >
        <Container>
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="max-w-2xl"
          >
            <motion.span
              variants={fadeUp}
              className="text-xs font-medium uppercase tracking-[0.15em] text-brand-500"
            >
              Outcomes
            </motion.span>
            <motion.h2
              variants={fadeUp}
              className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl"
            >
              {data.results.title}
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="mt-6 text-lg text-gray-600 dark:text-gray-300"
            >
              {data.results.subtitle}
            </motion.p>
          </motion.div>

          <motion.dl
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="mt-16 grid gap-x-12 gap-y-12 sm:grid-cols-2"
          >
            {data.results.outcomes.map((outcome, index) => (
              <motion.div key={index} variants={fadeUp}>
                <dd className="text-3xl font-semibold tracking-tight text-brand-500 sm:text-4xl">
                  {outcome.improvement}
                </dd>
                <dt className="mt-3 text-lg font-semibold tracking-tight text-gray-900 dark:text-white">
                  {outcome.metric}
                </dt>
                <p className="mt-2 max-w-md text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {outcome.description}
                </p>
                <p className="mt-3 text-xs text-gray-500 dark:text-gray-500">
                  Typical timeline: {outcome.timeframe}
                </p>
              </motion.div>
            ))}
          </motion.dl>
        </Container>
      </section>

      {/* ──────────────────────── PRICING ──────────────────────── */}
      <section
        id={data.pricing.id}
        role={data.pricing.role as any}
        aria-label={data.pricing.ariaLabel}
        className="py-20 sm:py-28"
      >
        <Container>
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="max-w-2xl"
          >
            <motion.span
              variants={fadeUp}
              className="text-xs font-medium uppercase tracking-[0.15em] text-brand-500"
            >
              Pricing
            </motion.span>
            <motion.h2
              variants={fadeUp}
              className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl"
            >
              {data.pricing.title}
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="mt-6 text-lg text-gray-600 dark:text-gray-300"
            >
              {data.pricing.subtitle}
            </motion.p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            className="mt-16 grid gap-6 lg:grid-cols-3"
          >
            {data.pricing.packages.map((pkg, index) => {
              const isPopular = "popular" in pkg && pkg.popular;
              return (
                <motion.div
                  key={index}
                  variants={fadeUp}
                  className={
                    "flex flex-col rounded-3xl border p-8 transition " +
                    (isPopular
                      ? "border-brand-500 bg-white shadow-lg shadow-brand-500/5 dark:bg-neutral-900"
                      : "border-gray-200 bg-white dark:border-gray-800 dark:bg-neutral-900")
                  }
                >
                  {isPopular && (
                    <span className="mb-4 inline-flex w-fit items-center rounded-full bg-brand-500/10 px-3 py-1 text-xs font-semibold text-brand-500">
                      Most chosen
                    </span>
                  )}
                  <h3 className="text-xl font-semibold tracking-tight">
                    {pkg.name}
                  </h3>
                  <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                    {pkg.description}
                  </p>

                  <div className="mt-6 flex items-baseline gap-1">
                    <span className="text-4xl font-semibold tracking-tight">
                      {pkg.price}
                    </span>
                    {pkg.period !== "pricing" && (
                      <span className="text-sm text-gray-500 dark:text-gray-500">
                        {pkg.period}
                      </span>
                    )}
                  </div>

                  <ul className="mt-8 flex-1 space-y-3 text-sm text-gray-700 dark:text-gray-300">
                    {pkg.features.map((feature, fi) => (
                      <li key={fi} className="flex items-start gap-3">
                        <svg
                          className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-500"
                          viewBox="0 0 16 16"
                          fill="none"
                          aria-hidden
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

                  <p className="mt-8 border-t border-gray-100 pt-6 text-xs text-gray-500 dark:border-gray-800 dark:text-gray-500">
                    <strong className="text-gray-700 dark:text-gray-300">
                      Best for:
                    </strong>{" "}
                    {pkg.bestFor}
                  </p>

                  <Link
                    href={data.cta.primaryCta.href}
                    className={
                      "mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition " +
                      (isPopular
                        ? "bg-brand-500 text-white hover:bg-brand-600"
                        : "border border-gray-300 text-gray-900 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-100 dark:hover:bg-neutral-800")
                    }
                  >
                    Get started
                    <span aria-hidden>→</span>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </Container>
      </section>

      {/* ──────────────────────── FAQ ──────────────────────── */}
      <section
        id={data.faq.id}
        role={data.faq.role as any}
        aria-label={data.faq.ariaLabel}
        className="border-y border-gray-100 bg-white py-20 dark:border-gray-900 dark:bg-neutral-950 sm:py-28"
      >
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              className="lg:col-span-4"
            >
              <motion.span
                variants={fadeUp}
                className="text-xs font-medium uppercase tracking-[0.15em] text-brand-500"
              >
                FAQ
              </motion.span>
              <motion.h2
                variants={fadeUp}
                className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl"
              >
                {data.faq.title}
              </motion.h2>
              <motion.p
                variants={fadeUp}
                className="mt-6 text-base text-gray-600 dark:text-gray-300 leading-relaxed"
              >
                Still have questions?{" "}
                <Link
                  href="/contact"
                  className="text-brand-500 underline decoration-1 underline-offset-4 hover:text-brand-600"
                >
                  Get in touch.
                </Link>
              </motion.p>
            </motion.div>

            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.1 }}
              className="lg:col-span-8"
            >
              <div className="divide-y divide-gray-200 dark:divide-gray-800">
                {data.faq.questions.map((faq, index) => (
                  <motion.details
                    key={index}
                    variants={fadeUp}
                    className="group py-5"
                    {...(index === 0 ? { open: true } : {})}
                  >
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-6">
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
                    <p className="mt-4 pr-10 text-gray-600 dark:text-gray-300 leading-relaxed">
                      {faq.answer}
                    </p>
                  </motion.details>
                ))}
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* ──────────────────────── CTA ──────────────────────── */}
      <section
        id={data.cta.id}
        role={data.cta.role as any}
        aria-label={data.cta.ariaLabel}
        className="py-20 sm:py-28"
      >
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true, amount: 0.3 }}
            className="overflow-hidden rounded-3xl bg-gray-900 px-6 py-16 text-center dark:bg-neutral-900 sm:px-12 sm:py-20"
          >
            <h2 className="mx-auto max-w-2xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              {data.cta.title}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-gray-300 sm:text-lg">
              {data.cta.body}
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
              <Link
                href={data.cta.primaryCta.href}
                className="group inline-flex items-center gap-2 rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-600"
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
                className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                aria-label={data.cta.secondaryCta.ariaLabel}
              >
                {data.cta.secondaryCta.label}
              </Link>
            </div>
          </motion.div>
        </Container>
      </section>
    </main>
  );
}
