"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { Container } from "./Container";
import { ShapesBackdrop } from "./ShapesBackdrop";

type CTA = {
  label: string;
  href: string;
  target?: string;
  ariaLabel?: string;
};

export function Hero({ hero }: { hero?: any }) {
  const content = hero || {};

  const primaryCta: CTA = content.cta || {
    label: "Book a strategy call",
    href: "https://tidycal.com/maplegrowthdigital/strategy-call",
    target: "_blank",
  };
  const primaryTarget =
    primaryCta.target ||
    (primaryCta.href && primaryCta.href.startsWith("http")
      ? "_blank"
      : undefined);
  const primaryRel = primaryTarget === "_blank" ? "noreferrer" : undefined;

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
    <section
      className="relative overflow-hidden pb-20 pt-24 sm:pt-32"
      id={content.id || "hero"}
      role={content.role || "region"}
      aria-label={content.ariaLabel || "Hero section"}
    >
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-brand-500/5 via-white to-white dark:via-neutral-950 dark:to-neutral-950" />
      <div className="pointer-events-none absolute right-[-8rem] top-[-6rem] -z-10 h-96 w-96 rounded-full bg-brand-500/30 blur-3xl dark:opacity-30" />
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
          >
            <motion.span variants={item} className="chip-brand">
              {content.subhead}
            </motion.span>
            <motion.h1
              variants={item}
              className="mt-4 text-5xl font-semibold tracking-tight sm:text-7xl"
            >
              {content.title}
            </motion.h1>
            <motion.p
              variants={item}
              className="mt-6 text-lg text-gray-600 dark:text-gray-300"
            >
              {content.body}
            </motion.p>
            <motion.div
              variants={item}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              {primaryCta?.href && primaryCta?.label && (
                <a
                  href={primaryCta.href}
                  target={primaryTarget}
                  rel={primaryRel}
                  className="btn-cta"
                  aria-label={primaryCta.ariaLabel || primaryCta.label}
                >
                  {primaryCta.label}
                  <svg
                    aria-hidden
                    className="ml-2 h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </a>
              )}
              <a
                href="#services"
                className="btn-secondary transition-transform duration-300 hover:-translate-y-0.5"
              >
                See What We Offer
                <svg
                  aria-hidden
                  className="ml-2 h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </a>
            </motion.div>
            <div className="mt-10 grid max-w-xl grid-cols-2 gap-4 sm:grid-cols-4">
              {(content.stats || []).map((s: any) => (
                <motion.div
                  key={s.label}
                  variants={item}
                  className="h-full rounded-xl border border-gray-200 bg-white/70 p-4 text-center backdrop-blur transition-transform duration-300 hover:-translate-y-0.5 dark:border-gray-800 dark:bg-white/5"
                >
                  <div className="text-xl font-semibold sm:text-2xl">
                    {s.value}
                  </div>
                  <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {s.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          <div className="relative">
            <ShapesBackdrop />
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
              viewport={{ once: true, amount: 0.4 }}
              className="relative overflow-hidden rounded-2xl border border-gray-200 shadow-sm transition-transform duration-700 will-change-transform hover:scale-[1.02] dark:border-gray-800"
            >
              <div className="relative aspect-[8/10] bg-white">
                <Image
                  src={content.image || "/images/hero.jpg"}
                  alt={content.title || "Hero image"}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </motion.div>
          </div>
        </div>
      </Container>
    </section>
  );
}
