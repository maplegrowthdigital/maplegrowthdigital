"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "mgd:theme";
type Theme = "light" | "dark";

function readTheme(): Theme {
  if (typeof document === "undefined") return "dark";
  return (document.documentElement.dataset.theme as Theme) || "dark";
}

/**
 * ThemeToggle — sun/moon button.
 *
 * Initial theme is set by the inline preload script in layout.tsx
 * (no flash). This component:
 *   - Syncs displayed icon to the live `data-theme` attribute
 *   - On click, flips theme and persists to localStorage
 *   - Listens to OS preference changes when user hasn't picked manually
 */
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");

  // Mount: pick up whatever the preload script set
  useEffect(() => {
    setTheme(readTheme());
  }, []);

  // Apply changes to DOM + storage
  const apply = (next: Theme, persist = true) => {
    document.documentElement.dataset.theme = next;
    setTheme(next);
    if (persist) {
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {}
    }
  };

  // System preference change — only follow if user hasn't chosen manually
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: light)");
    const onChange = (e: MediaQueryListEvent) => {
      let stored: string | null = null;
      try {
        stored = localStorage.getItem(STORAGE_KEY);
      } catch {}
      if (!stored) apply(e.matches ? "light" : "dark", false);
    };
    if (mq.addEventListener) mq.addEventListener("change", onChange);
    else mq.addListener(onChange);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", onChange);
      else mq.removeListener(onChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={() => apply(theme === "light" ? "dark" : "light")}
      aria-label={
        theme === "light" ? "Switch to dark theme" : "Switch to light theme"
      }
      title="Toggle color theme"
    >
      <svg
        className="theme-toggle__icon theme-toggle__icon--sun"
        viewBox="0 0 24 24"
        width="16"
        height="16"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="4" fill="currentColor" />
        <path
          d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1l2.1-2.1M17 7l2.1-2.1"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
      <svg
        className="theme-toggle__icon theme-toggle__icon--moon"
        viewBox="0 0 24 24"
        width="16"
        height="16"
        aria-hidden="true"
      >
        <path
          d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z"
          fill="currentColor"
        />
      </svg>
    </button>
  );
}
