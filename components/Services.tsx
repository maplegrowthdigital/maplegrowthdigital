"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { Container } from "./Container";
import { ShapesBackdrop } from "./ShapesBackdrop";

function ServiceIcon({ icon }: { icon: string }) {
  const cls = "h-5 w-5";
  const common = {
    stroke: "currentColor",
    strokeWidth: 2,
    fill: "none",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (icon) {
    case "SEO":
      return (
        <svg viewBox="0 0 24 24" className={cls} {...common}>
          <path d="M3 3v18h18" />
          <path d="M7 15l3-3 3 2 4-6" />
        </svg>
      );
    case "PPC":
      return (
        <svg viewBox="0 0 24 24" className={cls} {...common}>
          <path d="M12 2L22 7l-10 5L2 7l10-5z" />
          <path d="M12 17l10-5" />
          <path d="M12 17l-10-5" />
        </svg>
      );
    case "DEV":
      return (
        <svg viewBox="0 0 24 24" className={cls} {...common}>
          <path d="M8 9l-4 3 4 3" />
          <path d="M16 9l4 3-4 3" />
          <path d="M12 8v8" />
        </svg>
      );
    case "CONTENT":
      return (
        <svg viewBox="0 0 24 24" className={cls} {...common}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <path d="M14 2v6h6" />
          <path d="M16 13H8" />
          <path d="M16 17H8" />
        </svg>
      );
    case "BRAND":
      return (
        <svg viewBox="0 0 24 24" className={cls} {...common}>
          <path d="M14 3l7 7-7 7-7-7 7-7z" />
          <path d="M5 19h14" />
        </svg>
      );
    case "GROWTH":
      return (
        <svg viewBox="0 0 24 24" className={cls} {...common}>
          <path d="M3 12l9-9 9 9" />
          <path d="M12 3v18" />
          <path d="M8 21h8" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" className={cls} {...common}>
          <path d="M14.7 6.3a4 4 0 1 0-5.4 5.4l-6 6 3 3 6-6a4 4 0 0 0 5.4-5.4z" />
        </svg>
      );
  }
}

export function Services({ services }: { services?: any }) {
  const content = services || {};
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
