"use client";

import Script from "next/script";
import { Container } from "./Container";

interface TidyCalEmbedProps {
  title?: string;
  subtitle?: string;
  path?: string;
}

export function TidyCalEmbed({
  title = "Book a strategy call",
  subtitle = "Pick a time that works for you. Calls are free and take about 30 minutes.",
  path = "maplegrowthdigital/strategy-call",
}: TidyCalEmbedProps) {
  return (
    <section
      id="contact-form"
      className="relative overflow-hidden py-24 border-t border-gray-100 dark:border-gray-800"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-1/2 bg-gradient-to-b from-brand-500/5 to-transparent dark:from-brand-500/10" />
      <Container>
        <div className="mx-auto max-w-3xl text-center mb-10">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-4 text-gray-600 dark:text-gray-300">{subtitle}</p>
          )}
        </div>
        <div className="mx-auto max-w-4xl">
          <div className="tidycal-embed" data-path={path} />
        </div>
      </Container>
      <Script
        id="tidycal-embed-script"
        src="https://asset-tidycal.b-cdn.net/js/embed.js"
        strategy="afterInteractive"
      />
    </section>
  );
}
