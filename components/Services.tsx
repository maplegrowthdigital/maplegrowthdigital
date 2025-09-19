"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { Container } from "./Container";
import { site } from "../content/site";
import { ShapesBackdrop } from "./ShapesBackdrop";

function ServiceIcon({ title }: { title: string }) {
  const cls = "h-5 w-5";
  const common = {
    stroke: "currentColor",
    strokeWidth: 2,
    fill: "none",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  const t = title.toLowerCase();
  if (t.includes("design")) {
    return (
      <svg viewBox="0 0 24 24" className={cls} {...common}>
        <path d="M14 3l7 7-7 7-7-7 7-7z" />
        <path d="M5 19h14" />
      </svg>
    );
  }
  if (t.includes("develop")) {
    return (
      <svg viewBox="0 0 24 24" className={cls} {...common}>
        <path d="M8 9l-4 3 4 3" />
        <path d="M16 9l4 3-4 3" />
        <path d="M12 8v8" />
      </svg>
    );
  }
  if (t.includes("product")) {
    return (
      <svg viewBox="0 0 24 24" className={cls} {...common}>
        <path d="M21 16V8l-9-5-9 5v8l9 5 9-5z" />
        <path d="M3 8l9 5 9-5" />
        <path d="M12 13v8" />
      </svg>
    );
  }
  if (t.includes("podcast") || t.includes("content")) {
    return (
      <svg viewBox="0 0 24 24" className={cls} {...common}>
        <rect x="9" y="3" width="6" height="11" rx="3" />
        <path d="M12 14v7" />
        <path d="M8 21h8" />
      </svg>
    );
  }
  if (t.includes("commerce") || t.includes("shopify")) {
    return (
      <svg viewBox="0 0 24 24" className={cls} {...common}>
        <path d="M6 6h15l-1.5 9h-12z" />
        <path d="M6 6l-2-2" />
        <circle cx="9" cy="20" r="1" />
        <circle cx="18" cy="20" r="1" />
      </svg>
    );
  }
  if (t.includes("seo") || t.includes("analytic")) {
    return (
      <svg viewBox="0 0 24 24" className={cls} {...common}>
        <path d="M3 3v18h18" />
        <path d="M7 15l3-3 3 2 4-6" />
      </svg>
    );
  }
  // default: wrench/tool
  return (
    <svg viewBox="0 0 24 24" className={cls} {...common}>
      <path d="M14.7 6.3a4 4 0 1 0-5.4 5.4l-6 6 3 3 6-6a4 4 0 0 0 5.4-5.4z" />
    </svg>
  );
}

export function Services({ services }: { services?: typeof site.services }) {
  const content = services ?? site.services;
  const cta = content.cta ?? {
    label: "Book a call",
    href: site.tidycal,
    target: "_blank",
  };
  const ctaTarget =
    cta.target || (cta.href && cta.href.startsWith("http") ? "_blank" : undefined);
  const ctaRel = ctaTarget === "_blank" ? "noreferrer" : undefined;

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
      id="services"
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
            {cta?.href && cta?.label && (
              <motion.div
                variants={item}
                className="mt-8 flex flex-wrap items-center gap-3"
              >
                <a
                  href={cta.href}
                  target={ctaTarget}
                  rel={ctaRel}
                  className="btn-cta transition-transform duration-300 hover:-translate-y-0.5"
                >
                  {cta.label}
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
            )}
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
                    src="/images/services-graphic.webp"
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
          {content.items.map((s) => (
            <motion.div
              key={s.title}
              variants={item}
              whileHover={{ y: -4 }}
              className="card group p-6 transition hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-brand-500/10 text-brand-500">
                  <ServiceIcon title={s.title} />
                </div>
                <h3 className="font-semibold">{s.title}</h3>
              </div>
              <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
                {s.description}
              </p>
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
