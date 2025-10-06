"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Container } from "./Container";
import { ShapesBackdrop } from "./ShapesBackdrop";
import { Icon } from "./Icon";
type CTA = {
  label: string;
  href: string;
  target?: string;
};

function StepIcon({ title }: { title: string }) {
  const t = title.toLowerCase();
  let iconName = "deploy"; // default

  if (t.includes("discover")) {
    iconName = "search";
  } else if (t.includes("design")) {
    iconName = "edit";
  } else if (t.includes("develop")) {
    iconName = "code";
  }

  return <Icon name={iconName} size={20} />;
}

export function Process({ process }: { process?: any }) {
  const [active, setActive] = useState(0);
  const primaryCta: CTA = {
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
  const content = process || {};
  const images = [
    "/images/Discovery%20&%20Research.webp",
    "/images/Strategy%20&%20Planning.webp",
    "/images/Execution%20&%20Creativity.webp",
    "/images/Results%20&%20Growth.webp",
  ];
  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
  } as const;
  const item = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  } as const;

  return (
    <section
      id="process"
      className="relative overflow-hidden py-24 border-t border-gray-100 dark:border-gray-800"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-1/2 bg-gradient-to-b from-brand-500/5 to-transparent dark:from-brand-500/10" />
      <Container>
        <div className="grid items-start gap-10 lg:grid-cols-2">
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.div variants={item} className="max-w-2xl">
              <span className="chip-brand">Process</span>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                {content.title}
              </h2>
              <p className="mt-4 text-gray-600 dark:text-gray-300">
                {content.intro}
              </p>
            </motion.div>

            <ol className="mt-8 space-y-4">
              {(content.steps || []).map((s: any, idx: number) => (
                <motion.li key={s.title} variants={item}>
                  <button
                    type="button"
                    onMouseEnter={() => setActive(idx)}
                    onFocus={() => setActive(idx)}
                    className={
                      "card w-full rounded-xl p-5 text-left transition hover:-translate-y-0.5 hover:shadow-md " +
                      (active === idx
                        ? "border-brand-500 ring-1 ring-brand-500/30"
                        : "")
                    }
                  >
                    <div className="flex items-start gap-3">
                      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-500/10 text-brand-500">
                        <StepIcon title={s.title} />
                      </div>
                      <div>
                        <h3 className="font-semibold">{s.title}</h3>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                          {s.description}
                        </p>
                      </div>
                    </div>
                  </button>
                </motion.li>
              ))}
            </ol>
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
            </motion.div>
          </motion.div>

          <div className="sticky top-24 hidden lg:block">
            <div className="relative">
              <ShapesBackdrop />
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                viewport={{ once: true, amount: 0.3 }}
                className="relative overflow-hidden rounded-2xl border border-gray-200 shadow-sm dark:border-gray-800"
              >
                <div className="relative aspect-[4/5] bg-gray-50 dark:bg-neutral-900">
                  {(content.steps || []).map((s: any, idx: number) => (
                    <div
                      key={s.title}
                      className={
                        "absolute inset-0 transition-opacity duration-500 " +
                        (active === idx ? "opacity-100" : "opacity-0")
                      }
                    >
                      <Image
                        src={images[idx % images.length]}
                        alt={s.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/30 to-transparent p-4 text-white">
                  <div className="text-sm">
                    {(content.steps || [])[active]?.title}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
