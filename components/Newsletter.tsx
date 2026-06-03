"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { Turnstile } from "./global/Turnstile";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);
}

type State = "idle" | "submitting" | "success" | "error";

export function Newsletter() {
  const ref = useRef<HTMLElement>(null);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [state, setState] = useState<State>("idle");
  const [message, setMessage] = useState("");
  // Honeypot — bots will fill this; humans never see it (visually hidden).
  const [honeypot, setHoneypot] = useState("");
  // Cloudflare Turnstile token. Empty until widget verifies. We allow
  // submission with an empty token — the server allows it through when
  // TURNSTILE_SECRET_KEY isn't configured (local dev), and rejects when
  // it is (production with the env var set).
  const [turnstileToken, setTurnstileToken] = useState("");

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      const titleEl = ref.current?.querySelector<HTMLElement>(
        ".newsletter__title[data-split]"
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

      const reveals = ref.current?.querySelectorAll<HTMLElement>(
        '[data-reveal="up"]'
      );
      if (reveals) {
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
    },
    { scope: ref }
  );

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setState("error");
      setMessage("Please enter a valid email address.");
      return;
    }
    setState("submitting");
    setMessage("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: trimmed,
          firstName: firstName.trim() || undefined,
          honeypot,
          turnstileToken,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        alreadySubscribed?: boolean;
      };

      if (!res.ok) {
        setState("error");
        setMessage(data.error || "Something went wrong. Please try again.");
        return;
      }

      setState("success");
      setMessage(
        data.alreadySubscribed
          ? "You're already on the list — thanks!"
          : "Thanks — you're on the list."
      );
      setEmail("");
      setFirstName("");
      setTimeout(() => {
        setState("idle");
        setMessage("");
      }, 2800);
    } catch {
      setState("error");
      setMessage("Network error. Please try again in a moment.");
    }
  };

  const label =
    state === "submitting"
      ? "Subscribing…"
      : state === "success"
      ? "Subscribed ✓"
      : "Subscribe";

  return (
    <section ref={ref} className="newsletter" aria-label="Newsletter signup">
      <div className="newsletter__inner">
        <div className="newsletter__copy">
          <span className="section-label" data-reveal="up">
            <span className="dot" />
            <span>Newsletter</span>
          </span>
          <h2 className="newsletter__title" data-split>
            The Maple&nbsp;<em>Brief</em>.
          </h2>
          <p data-reveal="up" data-reveal-delay="0.2">
            Weekly tactics, not theory. One email, every Tuesday — actionable
            plays from active engagements. No fluff, unsubscribe in one click.
          </p>
        </div>
        <div className="newsletter__panel">
          <form
            className="newsletter__form"
            onSubmit={submit}
            noValidate
            aria-label="Subscribe to the Maple Brief"
          >
            {/* Honeypot — visually-hidden, tab-disabled. Bots auto-fill it;
                real users never touch it. Server rejects (silently accepts)
                if filled. */}
            <input
              type="text"
              name="company_url"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              style={{
                position: "absolute",
                left: "-9999px",
                width: "1px",
                height: "1px",
                opacity: 0,
                pointerEvents: "none",
              }}
            />

            <label htmlFor="newsletter-email" className="visually-hidden">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              name="email"
              placeholder="you@company.com"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              type="submit"
              className="newsletter__submit"
              disabled={state === "submitting"}
            >
              <span>{label}</span>
              <span className="btn__arrow" aria-hidden="true">→</span>
            </button>
          </form>
          {/* Sits OUTSIDE the pill form so the rounded background doesn't
              wrap the captcha widget. The Turnstile token is React state,
              so it doesn't need to be a child of <form>. */}
          <div className="newsletter__captcha">
            <Turnstile
              onVerify={setTurnstileToken}
              onExpire={() => setTurnstileToken("")}
              onError={() => setTurnstileToken("")}
            />
          </div>
          <p
            className={
              "newsletter__msg" +
              (state === "error" ? " is-error" : "") +
              (state === "success" ? " is-success" : "")
            }
            aria-live="polite"
          >
            {message}
          </p>
        </div>
      </div>
    </section>
  );
}
