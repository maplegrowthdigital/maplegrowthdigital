"use client";
import { motion } from "framer-motion";
import { Container } from "./Container";
import { site } from "../content/site";

function SocialIcon({ label }: { label: string }) {
  const l = label.toLowerCase();
  const common = {
    width: 16,
    height: 16,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  if (l.includes("instagram")) {
    return (
      <svg {...common}>
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    );
  }
  if (l.includes("linkedin")) {
    return (
      <svg {...common}>
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    );
  }
  if (l.includes("twitter") || l === "x") {
    return (
      <svg {...common}>
        <path d="M22 5.8c-.7.3-1.4.5-2.2.6.8-.5 1.3-1.2 1.6-2.1-.8.5-1.7.8-2.6 1-1.6-1.8-4.7-.7-4.7 1.9 0 .3 0 .6.1.9-3.6-.2-6.8-1.9-8.9-4.7-.4.7-.6 1.5-.6 2.3 0 1.5.8 2.8 2 3.6-.6 0-1.2-.2-1.7-.5v.1c0 2.1 1.5 3.8 3.5 4.2-.4.1-.8.2-1.2.2-.3 0-.6 0-.9-.1.6 1.8 2.3 3.1 4.3 3.1-1.6 1.3-3.6 2-5.7 2-.4 0-.8 0-1.2-.1 2.1 1.3 4.5 2.1 7.1 2.1 8.5 0 13.2-7.2 12.9-13.6.8-.6 1.4-1.2 1.9-2z" />
      </svg>
    );
  }
  if (l.includes("facebook")) {
    return (
      <svg {...common}>
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    );
  }
  if (l.includes("youtube")) {
    return (
      <svg {...common}>
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-2C18.88 4 12 4 12 4s-6.88 0-8.59.42a2.78 2.78 0 0 0-2 1.95A29 29 0 0 0 1 12a29 29 0 0 0 .41 5.58 2.78 2.78 0 0 0 2 1.95C5.12 20 12 20 12 20s6.88 0 8.59-.42a2.78 2.78 0 0 0 1.95-2A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
        <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
      </svg>
    );
  }
  // fallback globe
  return (
    <svg {...common}>
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

export function Contact({ contact }: { contact?: typeof site.contact }) {
  const content = contact ?? site.contact;
  const container = { hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } } } as const;
  const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } } } as const;
  return (
    <section
      id="contact"
      className="relative overflow-hidden py-24 border-t border-gray-100 dark:border-gray-800"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-1/2 bg-gradient-to-b from-brand-500/5 to-transparent dark:from-brand-500/10" />
      <Container>
        <div className="grid items-start gap-12 lg:grid-cols-2">
          <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}>
            <motion.h2 variants={item} className="text-3xl font-semibold tracking-tight sm:text-4xl">Tell me about your project</motion.h2>
            <motion.p variants={item} className="mt-4 text-gray-600 dark:text-gray-300">We’ll get back within 1–2 business days.</motion.p>
            <motion.div variants={item} className="mt-8 card p-6 shadow-sm">
              <form className="grid gap-4">
                <div className="grid gap-2">
                  <label className="text-sm text-gray-700 dark:text-gray-300">
                    Name
                  </label>
                  <input
                    className="rounded-lg border border-gray-300 px-4 py-3 dark:bg-neutral-900 dark:border-gray-700 dark:text-gray-100"
                    placeholder="Name"
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm text-gray-700 dark:text-gray-300">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="rounded-lg border border-gray-300 px-4 py-3 dark:bg-neutral-900 dark:border-gray-700 dark:text-gray-100"
                    placeholder="Email Address"
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm text-gray-700 dark:text-gray-300">
                    Contact Number
                  </label>
                  <input
                    className="rounded-lg border border-gray-300 px-4 py-3 dark:bg-neutral-900 dark:border-gray-700 dark:text-gray-100"
                    placeholder="Contact Number"
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm text-gray-700 dark:text-gray-300">
                    Tell me about your project
                  </label>
                  <textarea
                    rows={6}
                    className="rounded-lg border border-gray-300 px-4 py-3 dark:bg-neutral-900 dark:border-gray-700 dark:text-gray-100"
                    placeholder="Tell me about your project"
                  />
                </div>
                <motion.div variants={item}>
                  <button type="submit" className="btn-primary w-full">Send</button>
                </motion.div>
              </form>
            </motion.div>
          </motion.div>
          <motion.aside variants={item} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} className="rounded-2xl bg-white border border-gray-200 p-6 dark:border-gray-800 dark:bg-transparent">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Contact details
            </div>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500/10 text-brand-500">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 4h16v16H4z" />
                    <path d="M22 6l-10 7L2 6" />
                  </svg>
                </span>
                <div>
                  <dt className="text-gray-600 dark:text-white">Email</dt>
                  <dd className="font-medium text-gray-900 dark:text-gray-400">
                    <a href={`mailto:${content.email}`}>
                      {content.email}
                    </a>
                  </dd>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500/10 text-brand-500">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.62-3.07 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.6 12.6 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.6 12.6 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </span>
                <div>
                  <dt className="text-gray-600 dark:text-white">Phone</dt>
                  <dd className="font-medium text-gray-900 dark:text-gray-400">
                    <a href={`tel:${content.phone.replace(/\s/g, "")}`}>
                      {content.phone}
                    </a>
                  </dd>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500/10 text-brand-500">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17.657 16.657A8 8 0 1 1 21 12" />
                    <path d="M16 9v6" />
                    <path d="M12 11v2" />
                    <path d="M8 8v8" />
                  </svg>
                </span>
                <div>
                  <dt className="text-gray-600 dark:text-white">Location</dt>
                  <dd className="font-medium text-gray-900 dark:text-gray-400">
                    {content.location}
                  </dd>
                </div>
              </div>
            </div>

            <div className="mt-6 h-px w-full bg-gray-200 dark:bg-gray-800" />
            <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
              Socials
            </div>
            <div className="mt-3 flex flex-wrap gap-3">
              {content.socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  className="chip gap-2"
                  aria-label={s.label}
                >
                  <SocialIcon label={s.label} />
                  <span className="dark:text-white">{s.label}</span>
                </a>
              ))}
            </div>

            <motion.div variants={item} className="mt-8">
              <a
                href={site.tidycal}
                target="_blank"
                rel="noreferrer"
                className="btn-secondary dark:text-white"
              >
                Book a 30‑min chat
              </a>
            </motion.div>
          </motion.aside>
        </div>
      </Container>
    </section>
  );
}
