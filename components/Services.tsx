"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { Container } from "./Container";
import { Icon } from "./Icon";
import { ShapesBackdrop } from "./ShapesBackdrop";
type CTA = {
  label: string;
  href: string;
  target?: string;
};

function ServiceIcon({ icon }: { icon: string }) {
  const iconMap: { [key: string]: string } = {
    SEO: "analytics",
    PPC: "ppc",
    DEV: "web-dev",
    CONTENT: "content",
    BRAND: "brand",
    GROWTH: "growth",
    DEFAULT: "search",
  };

  const iconName = iconMap[icon] || iconMap.DEFAULT;
  return <Icon name={iconName} size={20} />;
}

export function Services({ services }: { services?: any }) {
  const content = services || {};
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
  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
  } as const;
  const item = {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  } as const;
  return (
    <section
      id={content.id || "services"}
      role={content.role || "region"}
      aria-label={content.ariaLabel || "Services"}
      className="relative overflow-hidden py-24 border-t border-gray-100 dark:border-gray-800"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-1/2 bg-gradient-to-b from-brand-500/5 to-transparent dark:from-brand-500/10" />
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            className="max-w-xl"
          >
            <motion.span variants={item} className="chip-brand">
              Services
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
              {content.subtitle}
            </motion.p>
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
          <div className="hidden lg:block">
            <div className="relative">
              <ShapesBackdrop />
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                viewport={{ once: true, amount: 0.4 }}
                className="relative overflow-hidden rounded-2xl border border-gray-200 shadow-sm dark:border-gray-800"
              >
                <div className="relative aspect-[4/3]">
                  <Image
                    src="/images/services-1.webp"
                    alt="Computer vector graphic"
                    fill
                    className="object-cover"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {(content.items || []).map((s: any) => (
            <motion.div
              key={s.title}
              variants={item}
              whileHover={{ y: -4 }}
              className="card group p-6 transition hover:shadow-md"
              aria-label={s.ariaLabel || s.title}
            >
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-brand-500/10 text-brand-500">
                  <ServiceIcon icon={s.icon || "DEFAULT"} />
                </div>
                <h3 className="font-semibold">{s.title}</h3>
              </div>
              <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
                {s.description}
              </p>
              {s.bullets &&
                Array.isArray(s.bullets) &&
                s.bullets.length > 0 && (
                  <ul className="mt-3 space-y-1 text-xs text-gray-500 dark:text-gray-400">
                    {s.bullets.map((bullet: string, i: number) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="h-1 w-1 rounded-full bg-brand-500"></span>
                        {bullet}
                      </li>
                    ))}
                  </ul>
                )}
            </motion.div>
          ))}
        </motion.div>
        {content.note && (
          <div className="mt-12">
            <div className="mx-auto max-w-3xl rounded-xl border border-brand-500/20 bg-white/70 px-5 py-4 text-center text-gray-700 backdrop-blur dark:border-brand-500/30 dark:bg-white/5 dark:text-gray-300">
              {content.note}
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}
