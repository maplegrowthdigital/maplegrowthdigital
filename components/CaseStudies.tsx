"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { Container } from "./Container";
import { ShapesBackdrop } from "./ShapesBackdrop";
import { Icon } from "./Icon";

type CTA = {
  label: string;
  href: string;
  target?: string;
  ariaLabel?: string;
};

export function CaseStudies({ caseStudies }: { caseStudies?: any }) {
  const content = caseStudies || {};
  const getAriaLabel = (
    label?: string,
    ariaLabel?: string,
    opensInNewTab?: boolean
  ) => {
    const base = ariaLabel || label;
    if (opensInNewTab) {
      const fallback = base || label || "Open link";
      return `${fallback} (opens in a new tab)`;
    }
    return base;
  };
  const sectionCta: CTA = content.cta ?? {
    label: "Work with us",
    href: "#contact",
  };
  const sectionTarget =
    sectionCta.target ||
    (sectionCta.href && sectionCta.href.startsWith("http")
      ? "_blank"
      : undefined);
  const sectionRel = sectionTarget === "_blank" ? "noreferrer" : undefined;
  const sectionOpensNewTab = sectionTarget === "_blank";
  const sectionAriaLabel = getAriaLabel(
    sectionCta.label,
    sectionCta.ariaLabel,
    sectionOpensNewTab
  );
  const cs = content.items || [];
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
      id="case-studies"
      className="relative overflow-hidden py-24 border-t border-gray-100 dark:border-gray-800"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-1/2 bg-gradient-to-b from-brand-500/5 to-transparent dark:from-brand-500/10" />
      <Container>
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          className="mx-auto max-w-2xl text-center"
        >
          <motion.span variants={item} className="chip-brand">
            Case Studies
          </motion.span>
          <motion.h2
            variants={item}
            className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl"
          >
            {content.title}
          </motion.h2>
          <motion.p
            variants={item}
            className="mt-4 text-gray-600 dark:text-gray-300"
          >
            {content.intro}
          </motion.p>
        </motion.div>

        {cs.map((study: any, idx: number) => {
          const reverse = idx % 2 === 1;
          return (
            <motion.div
              key={study.slug}
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              className="mt-12 grid items-center gap-10 lg:grid-cols-2"
            >
              <motion.div
                variants={item}
                className={
                  (reverse ? "lg:order-2 " : "lg:order-1 ") + "relative"
                }
              >
                <ShapesBackdrop />
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                  viewport={{ once: true, amount: 0.3 }}
                  className="relative overflow-hidden rounded-3xl border border-gray-200 shadow-sm dark:border-gray-800"
                >
                  <div className="relative aspect-[4/3] bg-gray-50 dark:bg-neutral-900">
                    <Image
                      src={study.image}
                      alt={study.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </motion.div>
              </motion.div>
              <motion.div
                variants={item}
                className={reverse ? "lg:order-1" : "lg:order-2"}
              >
                <div className="max-w-xl">
                  <div className="chip">{study.category}</div>
                  <h3 className="mt-3 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
                    {study.title}
                  </h3>
                  <p className="mt-4 text-gray-700 dark:text-gray-300">
                    {study.summary}
                  </p>
                  <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                    {(study.results || []).map((r: string) => (
                      <li
                        key={r}
                        className="inline-flex items-center gap-2 rounded-lg border border-brand-500/30 bg-brand-500/10 px-3 py-2 text-sm text-brand-600 dark:text-brand-500"
                      >
                        <Icon name="check" size={16} />
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-7 flex flex-wrap gap-3">
                    <a href={study.link} className="btn-cta">
                      {study.linkLabel ?? "Read case study"}
                      <Icon name="arrow-right" size={16} className="ml-2" />
                    </a>
                    {sectionCta?.href && sectionCta?.label && (
                      <a
                        href={sectionCta.href}
                        target={sectionTarget}
                        rel={sectionRel}
                        className="btn-secondary"
                        aria-label={sectionAriaLabel}
                      >
                        {sectionCta.label}
                        {sectionOpensNewTab && (
                          <span className="sr-only"> (opens in a new tab)</span>
                        )}
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </Container>
    </section>
  );
}
