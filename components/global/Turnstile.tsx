"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Cloudflare Turnstile widget — minimal React wrapper.
 *
 * Loads the Cloudflare API script once (deduplicated across mounts),
 * then explicit-renders the widget via `window.turnstile.render()`. The
 * `onVerify(token)` callback fires when Cloudflare issues a token.
 *
 * Theme follows the document's `[data-theme]` attribute so the widget
 * matches the rest of the site.
 *
 * Graceful no-op when NEXT_PUBLIC_TURNSTILE_SITE_KEY is unset (local
 * dev). The parent form treats absence-of-token as "skipped" and the
 * server allows it through (no secret → no verification, see
 * `lib/turnstile.ts`).
 */

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const SCRIPT_URL =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
const SCRIPT_ID = "cf-turnstile-api";

// Minimal type for the global Cloudflare exposes.
interface TurnstileApi {
  render: (
    container: HTMLElement,
    opts: {
      sitekey: string;
      callback?: (token: string) => void;
      "error-callback"?: () => void;
      "expired-callback"?: () => void;
      theme?: "light" | "dark" | "auto";
      size?: "normal" | "flexible" | "compact";
    }
  ) => string;
  remove: (widgetId: string) => void;
  reset: (widgetId?: string) => void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

// Module-level promise so all mounts share one script load.
let scriptPromise: Promise<void> | null = null;
function loadScript(): Promise<void> {
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise((resolve, reject) => {
    if (typeof document === "undefined") {
      reject(new Error("not in browser"));
      return;
    }
    if (document.getElementById(SCRIPT_ID)) {
      // Script already injected — wait for window.turnstile to appear.
      const poll = setInterval(() => {
        if (window.turnstile) {
          clearInterval(poll);
          resolve();
        }
      }, 50);
      setTimeout(() => clearInterval(poll), 10_000);
      return;
    }
    const el = document.createElement("script");
    el.id = SCRIPT_ID;
    el.src = SCRIPT_URL;
    el.async = true;
    el.defer = true;
    el.onload = () => resolve();
    el.onerror = () => reject(new Error("turnstile script failed to load"));
    document.head.appendChild(el);
  });
  return scriptPromise;
}

export interface TurnstileProps {
  onVerify: (token: string) => void;
  /** Called when the user's token expires (5 min default). */
  onExpire?: () => void;
  /** Called on any verification error. */
  onError?: () => void;
  /** Manual theme override. Default: read from document.documentElement. */
  theme?: "light" | "dark" | "auto";
}

export function Turnstile({ onVerify, onExpire, onError, theme }: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    if (!SITE_KEY) {
      // Dev mode without Cloudflare configured — render nothing visible,
      // parent will treat absent token as "skipped".
      setUnavailable(true);
      return;
    }
    let cancelled = false;

    loadScript()
      .then(() => {
        if (cancelled || !containerRef.current || !window.turnstile) return;
        const resolvedTheme =
          theme ??
          (typeof document !== "undefined" &&
          document.documentElement.dataset.theme === "light"
            ? "light"
            : "dark");
        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: SITE_KEY,
          callback: onVerify,
          "expired-callback": onExpire,
          "error-callback": onError,
          theme: resolvedTheme,
          size: "flexible",
        });
      })
      .catch(() => {
        if (!cancelled) setUnavailable(true);
      });

    return () => {
      cancelled = true;
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {
          /* widget already gone */
        }
        widgetIdRef.current = null;
      }
    };
    // Re-render if theme changes is fine — but we intentionally don't
    // re-render on callback identity changes (callers should memoise).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme]);

  if (unavailable) {
    // Nothing to render. The parent form's server-side verifier will
    // also accept missing tokens when the secret isn't configured.
    return null;
  }

  return <div className="cf-turnstile" ref={containerRef} />;
}
