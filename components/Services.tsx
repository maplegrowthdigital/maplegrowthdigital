"use client";

import Link from "next/link";
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { useModal } from "./global/ModalProvider";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);
}

interface ServiceItem {
  id: string;
  title: string;
  description: string;
  bullets: string[];
}

const DEFAULT_SERVICES: ServiceItem[] = [
  {
    id: "seo",
    title: "SEO & Analytics",
    description: "Technical SEO, on-page optimization, and analytics that compound results.",
    bullets: ["Local & national visibility", "Content roadmaps", "GA4 & dashboards"],
  },
  {
    id: "ppc",
    title: "PPC & Paid Media",
    description: "ROI-first campaigns across Google, YouTube, and social.",
    bullets: ["Google & Performance Max", "Retargeting", "Landing page CRO"],
  },
  {
    id: "web",
    title: "Web Design & Development",
    description: "Conversion-focused, accessible sites engineered for speed and scale.",
    bullets: ["WordPress & Headless", "Shopify storefronts", "Core Web Vitals"],
  },
  {
    id: "content",
    title: "Content & Email",
    description: "Editorial calendars and lifecycle email that nurture demand.",
    bullets: ["Lead magnets & blogs", "Newsletters & flows", "CRM integrations"],
  },
  {
    id: "brand",
    title: "Brand & Creative",
    description: "Brand systems, ad creative, and motion assets that lift recognition.",
    bullets: ["Visual identity", "Ad creative kits", "Video & motion"],
  },
  {
    id: "strategy",
    title: "Growth Strategy",
    description: "Positioning, messaging, and go-to-market plans tailored to your stage.",
    bullets: ["ICP & messaging", "Channel mix planning", "KPI frameworks"],
  },
  {
    id: "mobile-app",
    title: "Mobile App Development",
    description: "Native and cross-platform mobile apps, built with our engineering partner.",
    bullets: ["iOS & Android", "Cross-platform builds", "App Store launch"],
  },
  {
    id: "ecommerce",
    title: "E-Commerce Store Development",
    description: "High-converting online stores on Shopify and headless.",
    bullets: ["Shopify & headless", "Payments & checkout", "Conversion-optimized"],
  },
];

export interface ServicesProps {
  /**
   * Optional — accepts existing data.json `services` shape. Falls back to
   * prototype copy if the items aren't provided.
   */
  services?: {
    title?: string;
    subtitle?: string;
    items?: Array<{
      title: string;
      description?: string;
      bullets?: string[];
    }>;
  };
}

export function Services({ services }: ServicesProps) {
  const ref = useRef<HTMLElement>(null);
  const { open } = useModal();

  // Reconcile data.json shape with our internal shape; fall back to defaults
  const items: ServiceItem[] = (services?.items ?? []).length
    ? services!.items!.map((item, i) => ({
        id: DEFAULT_SERVICES[i]?.id ?? `service-${i}`,
        title: item.title,
        description: item.description || DEFAULT_SERVICES[i]?.description || "",
        bullets: item.bullets || DEFAULT_SERVICES[i]?.bullets || [],
      }))
    : DEFAULT_SERVICES;

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      // Split-text on the section title
      const titleEl = ref.current?.querySelector<HTMLElement>(
        ".section-title[data-split]"
      );
      if (titleEl && !prefersReduced) {
        const split = new SplitText(titleEl, {
          type: "lines,words",
          linesClass: "split-line",
        });
        gsap.set(split.words, { yPercent: 110, opacity: 0 });
        ScrollTrigger.create({
          trigger: titleEl,
          start: "top 82%",
          once: true,
          onEnter: () => {
            gsap.to(split.words, {
              yPercent: 0,
              opacity: 1,
              duration: 1.0,
              stagger: 0.03,
              ease: "expo.out",
            });
          },
        });
      }

      // Generic reveal-up on label + intro
      const reveals = ref.current?.querySelectorAll<HTMLElement>(
        '[data-reveal="up"]'
      );
      if (reveals && reveals.length > 0) {
        gsap.set(reveals, { opacity: 0, y: 28 });
        if (!prefersReduced) {
          reveals.forEach((el) => {
            ScrollTrigger.create({
              trigger: el,
              start: "top 88%",
              once: true,
              onEnter: () => {
                gsap.to(el, {
                  opacity: 1,
                  y: 0,
                  duration: 0.9,
                  delay: parseFloat(el.dataset.revealDelay || "0"),
                  ease: "expo.out",
                });
              },
            });
          });
        } else {
          gsap.set(reveals, { opacity: 1, y: 0 });
        }
      }

      // Cards stagger reveal on scroll
      const cards = ref.current?.querySelectorAll<HTMLElement>("[data-service]");
      if (cards && cards.length > 0 && !prefersReduced) {
        cards.forEach((el, i) => {
          gsap.from(el, {
            y: 60,
            opacity: 0,
            duration: 1,
            ease: "expo.out",
            delay: (i % 3) * 0.06,
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
            clearProps: "transform,opacity",
          });

          // Cursor-tracking spotlight (CSS variable per card)
          const onMove = (e: MouseEvent) => {
            const rect = el.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            el.style.setProperty("--mx", `${x}%`);
            el.style.setProperty("--my", `${y}%`);
          };
          el.addEventListener("mousemove", onMove);
        });
      }
    },
    { scope: ref }
  );

  // Card click → open service deep-dive modal.
  // Each card is now a real <button> inside <li> (see render below) so
  // Enter / Space activation is handled natively — no onKeyDown needed.
  const handleServiceClick = (id: string) => () => {
    open("service", { payload: { serviceId: id } });
  };

  return (
    <section ref={ref} className="services" id="services" aria-label="Services">
      <div className="section-head">
        <div className="section-label" data-reveal="up">
          <span className="dot" />
          <span>Services</span>
        </div>
        <h2 className="section-title" data-split>
          {services?.title ? (
            services.title
          ) : (
            <>
              Marketing services that&nbsp;<em>compound</em>.
            </>
          )}
        </h2>
        <p className="section-intro" data-reveal="up" data-reveal-delay="0.2">
          {services?.subtitle ??
            "Strategy, creative, and engineering under one roof — so the work that moves your numbers also moves with you."}
        </p>
      </div>

      <ol className="services__grid" role="list">
        {items.map((service, i) => (
          <li key={service.id}>
            <button
              type="button"
              className="service"
              data-service
              onClick={handleServiceClick(service.id)}
              aria-label={`${service.title} — view details`}
            >
              <span className="service__num">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="service__title">{service.title}</h3>
              <p className="service__desc">{service.description}</p>
              <ul className="service__bullets">
                {service.bullets.map((b, j) => (
                  <li key={j}>{b}</li>
                ))}
              </ul>
              <span className="service__arrow" aria-hidden="true">
                →
              </span>
            </button>
          </li>
        ))}
      </ol>

      {/* In-content link to the hub. The cards open modals rather than
          navigating, so without this the only internal links to /services
          come from the header and footer — which is thin for a page we want
          to rank. */}
      <div className="services__more" data-reveal="up">
        <Link href="/services" className="btn btn--link">
          <span>See how we deliver, and what each service includes</span>
        </Link>
      </div>
    </section>
  );
}
