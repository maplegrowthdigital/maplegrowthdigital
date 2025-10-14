"use client";
import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Container } from "./Container";

interface FormField {
  name: string;
  label: string;
  type: string;
  required: boolean;
  placeholder?: string;
  rows?: number;
  options?: { value: string; label: string }[];
}

interface ContactFormProps {
  title: string;
  subtitle: string;
  fields: FormField[];
  submitLabel: string;
  submitAriaLabel: string;
  contactDetails?: {
    email: string;
    phone: string;
    location: string;
    socials: { platform: string; href: string; ariaLabel: string }[];
  };
  officeInfo?: {
    street: string;
    city: string;
    province: string;
    postalCode: string;
    country: string;
    weekdays: string;
    weekend: string;
    note: string;
  };
}

export function ContactForm({
  title,
  subtitle,
  fields,
  submitLabel,
  submitAriaLabel,
  contactDetails,
  officeInfo,
}: ContactFormProps) {
  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
  } as const;
  const item = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  } as const;

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "loading") return;

    setStatus("loading");
    setFeedback(null);

    const formData = new FormData(event.currentTarget);
    const values: Record<string, string> = {};
    formData.forEach((value, key) => {
      if (typeof value === "string") {
        values[key] = value.trim();
      }
    });

    const context =
      typeof window !== "undefined"
        ? `${title} (${window.location.pathname})`
        : title;

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ values, context }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || "Failed to send message.");
      }

      setStatus("success");
      setFeedback("Thanks! Your message is on its way.");
      event.currentTarget.reset();
    } catch (error: unknown) {
      setStatus("error");
      setFeedback(
        error instanceof Error
          ? error.message
          : "We couldn't send your message. Please try again."
      );
    }
  };

  return (
    <section
      id="contact-form"
      className="relative overflow-hidden py-24 border-t border-gray-100 dark:border-gray-800"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-1/2 bg-gradient-to-b from-brand-500/5 to-transparent dark:from-brand-500/10" />
      <Container>
        <div className="grid items-start gap-12 lg:grid-cols-2">
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.h2
              variants={item}
              className="text-3xl font-semibold tracking-tight sm:text-4xl"
            >
              {title}
            </motion.h2>
            <motion.p
              variants={item}
              className="mt-4 text-gray-600 dark:text-gray-300"
            >
              {subtitle}
            </motion.p>
            <motion.div variants={item} className="mt-8 card p-6 shadow-sm">
              <form className="grid gap-4" onSubmit={handleSubmit}>
                {fields.map((field, index) => (
                  <div key={index} className="grid gap-2">
                    <label
                      htmlFor={field.name}
                      className="text-sm text-gray-700 dark:text-gray-300"
                    >
                      {field.label}
                      {field.required && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </label>

                    {field.type === "textarea" ? (
                      <textarea
                        id={field.name}
                        name={field.name}
                        required={field.required}
                        rows={field.rows}
                        placeholder={field.placeholder}
                        className="rounded-lg border border-gray-300 px-4 py-3 dark:bg-neutral-900 dark:border-gray-700 dark:text-gray-100"
                      />
                    ) : field.type === "select" ? (
                      <select
                        id={field.name}
                        name={field.name}
                        required={field.required}
                        className="rounded-lg border border-gray-300 px-4 py-3 dark:bg-neutral-900 dark:border-gray-700 dark:text-gray-100"
                      >
                        {field.options?.map((option, optIndex) => (
                          <option key={optIndex} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={field.type}
                        id={field.name}
                        name={field.name}
                        required={field.required}
                        placeholder={field.placeholder}
                        className="rounded-lg border border-gray-300 px-4 py-3 dark:bg-neutral-900 dark:border-gray-700 dark:text-gray-100"
                      />
                    )}
                  </div>
                ))}
                <motion.div variants={item}>
                  <button
                    type="submit"
                    className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed"
                    aria-label={submitAriaLabel}
                    disabled={status === "loading"}
                  >
                    {status === "loading" ? "Sending…" : submitLabel}
                  </button>
                </motion.div>
              </form>
              <div className="mt-4 text-sm" aria-live="polite" aria-atomic="true">
                {feedback && (
                  <p
                    className={
                      status === "error"
                        ? "text-red-600 dark:text-red-400"
                        : "text-emerald-600 dark:text-emerald-400"
                    }
                  >
                    {feedback}
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>

          <motion.aside
            variants={item}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="rounded-2xl bg-white border border-gray-200 p-6 dark:border-gray-800 dark:bg-transparent"
          >
            {contactDetails && (
              <>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Contact details
                </div>
                <dl
                  className="mt-4 space-y-3 text-sm"
                  aria-label="Contact details"
                >
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
                        role="presentation"
                        aria-hidden="true"
                      >
                        <path d="M4 4h16v16H4z" />
                        <path d="M22 6l-10 7L2 6" />
                      </svg>
                    </span>
                    <div>
                      <dt className="text-gray-600 dark:text-white">Email</dt>
                      <dd className="font-medium text-gray-900 dark:text-gray-400">
                        <a href={`mailto:${contactDetails.email}`}>
                          {contactDetails.email}
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
                        role="presentation"
                        aria-hidden="true"
                      >
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.62-3.07 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.6 12.6 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.6 12.6 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                    </span>
                    <div>
                      <dt className="text-gray-600 dark:text-white">Phone</dt>
                      <dd className="font-medium text-gray-900 dark:text-gray-400">
                        <a
                          href={`tel:${contactDetails.phone.replace(
                            /\s/g,
                            ""
                          )}`}
                        >
                          {contactDetails.phone}
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
                        role="presentation"
                        aria-hidden="true"
                      >
                        <path d="M17.657 16.657A8 8 0 1 1 21 12" />
                        <path d="M16 9v6" />
                        <path d="M12 11v2" />
                        <path d="M8 8v8" />
                      </svg>
                    </span>
                    <div>
                      <dt className="text-gray-600 dark:text-white">
                        Location
                      </dt>
                      <dd className="font-medium text-gray-900 dark:text-gray-400">
                        {contactDetails.location}
                      </dd>
                    </div>
                  </div>
                </dl>

                <div className="mt-6 h-px w-full bg-gray-200 dark:bg-gray-800" />
                <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
                  Socials
                </div>
                <div className="mt-3 flex flex-wrap gap-3">
                  {contactDetails.socials.map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      className="chip gap-2"
                      aria-label={social.ariaLabel}
                    >
                      <span className="dark:text-white">{social.platform}</span>
                    </a>
                  ))}
                </div>

                <motion.div variants={item} className="mt-8">
                  <a
                    href="https://tidycal.com/maplegrowthdigital/strategy-call"
                    target="_blank"
                    rel="noreferrer"
                    className="btn-secondary dark:text-white"
                    aria-label="Book a 30-minute chat (opens in a new tab)"
                  >
                    Book a 30‑min chat
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </motion.div>
              </>
            )}

            {officeInfo && (
              <motion.div variants={item} className="mt-8">
                <div className="mt-6">
                  <h3 className="font-semibold">Address:</h3>
                  <address className="mt-2 not-italic text-gray-600 dark:text-gray-300">
                    {officeInfo.street}
                    <br />
                    {officeInfo.city}, {officeInfo.province}{" "}
                    {officeInfo.postalCode}
                    <br />
                    {officeInfo.country}
                  </address>
                </div>

                <div className="mt-6">
                  <h3 className="font-semibold">Business Hours:</h3>
                  <div className="mt-2 text-gray-600 dark:text-gray-300">
                    <p>{officeInfo.weekdays}</p>
                    <p>{officeInfo.weekend}</p>
                  </div>
                </div>

                <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
                  {officeInfo.note}
                </p>
              </motion.div>
            )}
          </motion.aside>
        </div>
      </Container>
    </section>
  );
}
