"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { Container } from "./Container";
type CTA = {
  label: string;
  href: string;
  target?: string;
};

export function About({ about }: { about?: any }) {
  const content = about || {};
  const primaryCta: CTA = {
    label: "Book a strategy call",
    href: "https://tidycal.com/maplegrowthdigital/strategy-call",
    target: "_blank",
  };
  const secondaryCta: CTA = {
    label: "Learn More",
    href: "/about",
  };
  const primaryTarget =
    primaryCta.target ||
    (primaryCta.href && primaryCta.href.startsWith("http")
      ? "_blank"
      : undefined);
  const primaryRel = primaryTarget === "_blank" ? "noreferrer" : undefined;
  const secondaryTarget =
    secondaryCta.target ||
    (secondaryCta.href && secondaryCta.href.startsWith("http")
      ? "_blank"
      : undefined);
  const secondaryRel = secondaryTarget === "_blank" ? "noreferrer" : undefined;
  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
  } as const;
  const item = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  } as const;
  return (
    <section
      id={content.id || "about"}
      role={content.role || "region"}
      aria-label={content.ariaLabel || "About"}
      className="overflow-hidden py-24 border-t border-gray-100 dark:border-gray-800"
    >
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="relative">
            <div className="pointer-events-none absolute -left-8 -top-8 h-40 w-40 rounded-full bg-brand-500/15 blur-3xl anim-float-y" />
            <div className="pointer-events-none absolute -right-10 bottom-6 h-28 w-28 rounded-full bg-brand-500/10 blur-2xl anim-float-x anim-delay-1000" />
            <div className="pointer-events-none absolute -left-10 bottom-10 h-16 w-16 rotate-12 rounded-xl border-2 border-brand-500/20 anim-spin-slow" />
            <div className="pointer-events-none absolute left-12 -bottom-8 h-10 w-10 rounded-full bg-brand-500/20 blur-md anim-float-y anim-delay-1500" />
            <div className="pointer-events-none absolute right-1/3 -top-6 h-8 w-8 rounded-full border-2 border-brand-500/30 anim-float-x anim-delay-500" />
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              viewport={{ once: true, amount: 0.3 }}
              className="relative overflow-hidden rounded-3xl border border-gray-200 shadow-sm dark:border-gray-800"
            >
              <div className="relative aspect-[16/16] bg-gray-50 dark:bg-neutral-900">
                <Image
                  src={content.photo}
                  alt={content.ceoName ?? "Team"}
                  fill
                  className="object-cover"
                />
              </div>
            </motion.div>
          </div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            className="max-w-xl"
          >
            <motion.span variants={item} className="chip-brand">
              About
            </motion.span>
            <motion.h2
              variants={item}
              className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl"
            >
              {content.title}
            </motion.h2>
            <motion.p
              variants={item}
              className="mt-4 text-gray-700 dark:text-gray-300 text-lg"
            >
              {content.body}
            </motion.p>

            <motion.ul
              variants={container}
              className="mt-6 grid gap-3 sm:grid-cols-2 text-sm text-gray-700 dark:text-gray-300"
            >
              {(content.highlights || []).map((h: string) => (
                <motion.li
                  key={h}
                  variants={item}
                  className="flex items-start gap-3"
                >
                  <span className="mt-1 inline-block h-2 w-2 rounded-full bg-brand-500" />
                  <span>{h}</span>
                </motion.li>
              ))}
            </motion.ul>

            {content.ceoNote && (
              <motion.blockquote
                variants={item}
                className="mt-8 rounded-2xl border border-gray-200 bg-white/60 p-5 italic text-gray-800 backdrop-blur dark:border-gray-800 dark:bg-white/5 dark:text-gray-200"
              >
                “{content.ceoNote}”
                <footer className="mt-3 text-sm not-italic text-gray-600 dark:text-gray-400">
                  — {content.ceoName}, {content.ceoTitle}
                </footer>
              </motion.blockquote>
            )}

            <motion.div variants={item} className="mt-8 flex flex-wrap gap-3">
              {primaryCta?.href && primaryCta?.label && (
                <a
                  href={primaryCta.href}
                  target={primaryTarget}
                  rel={primaryRel}
                  className="btn-cta"
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
              {secondaryCta?.href && secondaryCta?.label && (
                <a
                  href={secondaryCta.href}
                  target={secondaryTarget}
                  rel={secondaryRel}
                  className="btn-secondary"
                >
                  {secondaryCta.label}
                </a>
              )}
            </motion.div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
