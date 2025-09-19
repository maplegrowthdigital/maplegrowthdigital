"use client";
import { motion } from "framer-motion";
import { Container } from "./Container";
import { site } from "../content/site";
import { ShapesBackdrop } from "./ShapesBackdrop";

type CTA = {
  label: string;
  href: string;
  target?: string;
};

export function BookCall({ book }: { book?: typeof site.book }) {
  const content = book ?? site.book;
  const primaryCta: CTA =
    content.primaryCta ?? {
      label: "Book a call",
      href: site.tidycal,
      target: "_blank",
    };
  const secondaryCta: CTA =
    content.secondaryCta ?? {
      label: "See case studies",
      href: "#case-studies",
    };
  const tertiaryCta: CTA =
    content.tertiaryCta ?? {
      label: "Go to contact form",
      href: "#contact",
    };
  const primaryTarget =
    primaryCta.target ||
    (primaryCta.href && primaryCta.href.startsWith("http") ? "_blank" : undefined);
  const primaryRel = primaryTarget === "_blank" ? "noreferrer" : undefined;
  const secondaryTarget =
    secondaryCta.target ||
    (secondaryCta.href && secondaryCta.href.startsWith("http") ? "_blank" : undefined);
  const secondaryRel = secondaryTarget === "_blank" ? "noreferrer" : undefined;
  const tertiaryTarget =
    tertiaryCta.target ||
    (tertiaryCta.href && tertiaryCta.href.startsWith("http") ? "_blank" : undefined);
  const tertiaryRel = tertiaryTarget === "_blank" ? "noreferrer" : undefined;
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
      id="call"
      className="overflow-hidden py-24 border-t border-gray-100 dark:border-gray-800"
    >
      <Container>
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.3 }}
          className="relative overflow-hidden rounded-3xl border border-brand-500/30 bg-white px-6 py-10 text-gray-900 shadow-md sm:p-12 dark:bg-neutral-950 dark:text-gray-100"
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand-500/5 to-transparent" />
          <ShapesBackdrop />
          {/* Inner subtle shapes */}
          <div className="pointer-events-none absolute right-6 top-6 hidden sm:block">
            <div className="flex -translate-y-2 translate-x-1 rotate-12 gap-1 opacity-60">
              <span className="block h-2 w-2 rounded-full bg-brand-500/40 anim-float-y" />
              <span className="block h-2 w-2 rounded-full bg-brand-500/30 anim-float-y anim-delay-500" />
              <span className="block h-2 w-2 rounded-full bg-brand-500/20 anim-float-y anim-delay-1000" />
            </div>
          </div>
          <div className="pointer-events-none absolute -left-4 bottom-6 hidden sm:block">
            <div className="h-10 w-10 rounded-full border-2 border-brand-500/25 anim-spin-slow" />
          </div>
          <div className="pointer-events-none absolute left-1/3 -bottom-3 hidden sm:block">
            <div className="h-8 w-8 rotate-45 rounded-md border border-brand-500/20 anim-float-x anim-delay-1500" />
          </div>
          <div className="grid items-center gap-8 lg:grid-cols-3">
            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              className="lg:col-span-2"
            >
              <motion.span variants={item} className="chip-brand">
                Let’s talk
              </motion.span>
              <motion.h2
                variants={item}
                className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl"
              >
                {content.title}
              </motion.h2>
              <motion.ul variants={container} className="mt-6 grid gap-3">
                {content.paragraphs.map((p, i) => (
                  <motion.li
                    key={i}
                    variants={item}
                    className="inline-flex items-start gap-3 text-gray-800 dark:text-gray-200"
                  >
                    <span>{p}</span>
                  </motion.li>
                ))}
              </motion.ul>
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
            <motion.div
              variants={item}
              className="rounded-2xl border border-gray-200 bg-white/70 p-6 backdrop-blur dark:border-gray-800 dark:bg-white/5"
            >
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Prefer email?
              </div>
              <p className="mt-2 text-gray-800 dark:text-gray-200">
                Use the form below to tell us about your project.
              </p>
              {tertiaryCta?.href && tertiaryCta?.label && (
                <a
                  href={tertiaryCta.href}
                  target={tertiaryTarget}
                  rel={tertiaryRel}
                  className="mt-6 inline-flex btn-secondary"
                >
                  {tertiaryCta.label}
                </a>
              )}
              <div className="mt-6 grid grid-cols-2 gap-3 text-center text-xs text-gray-600 dark:text-gray-400">
                <div className="rounded-lg border border-gray-200 bg-white/70 px-3 py-2 dark:border-gray-800 dark:bg-white/5">
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">
                    30 min
                  </div>
                  <div>Initial chat</div>
                </div>
                <div className="rounded-lg border border-gray-200 bg-white/70 px-3 py-2 dark:border-gray-800 dark:bg-white/5">
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">
                    5 spots
                  </div>
                  <div>Active clients</div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
