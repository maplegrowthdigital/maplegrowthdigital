"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Container } from "./Container";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageBannerProps {
  title: string;
  subtitle?: string;
  breadcrumbs: BreadcrumbItem[];
  className?: string;
}

export function PageBanner({
  title,
  subtitle,
  breadcrumbs,
  className = "",
}: PageBannerProps) {
  const item = {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  } as const;

  return (
    <section
      className={`relative overflow-hidden pb-20 pt-24 sm:pt-32 ${className}`}
    >
      {/* Background Image with Black Overlay */}
      <div className="absolute inset-0 -z-20 bg-[url('/banner.webp')] bg-cover bg-center" />
      <div className="absolute inset-0 -z-10 bg-black/60" />

      <Container>
        <div className="text-center">
          {/* Centered Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex justify-center">
            <ol className="flex items-center gap-2 text-sm text-white/80">
              {breadcrumbs.map((crumb, index) => (
                <li key={index} className="flex items-center gap-2">
                  {crumb.href ? (
                    <Link
                      href={crumb.href}
                      className="hover:text-white transition-colors"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-white font-medium">
                      {crumb.label}
                    </span>
                  )}
                  {index < breadcrumbs.length - 1 && (
                    <span aria-hidden className="text-white/40">
                      ›
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>

          {/* Centered Title Section */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            className="mt-8"
          >
            <motion.h1
              variants={item}
              className="text-5xl font-semibold tracking-tight sm:text-7xl text-white"
            >
              {title}
            </motion.h1>
            {subtitle && (
              <motion.p
                variants={item}
                className="mt-6 text-lg text-white/80 max-w-2xl mx-auto"
              >
                {subtitle}
              </motion.p>
            )}
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
