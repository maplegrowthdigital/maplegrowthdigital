"use client";

import { useEffect, useState } from "react";

const KEY = "mgd:cookie-consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(KEY);
    } catch {}

    if (!stored) {
      // Reveal a short moment after page settles
      const t = setTimeout(() => {
        setVisible(true);
        document.body.classList.add("has-cookie-banner");
      }, 1200);
      return () => clearTimeout(t);
    }
    if (stored === "accepted") {
      window.dispatchEvent(new CustomEvent("cookie:accepted"));
    }
  }, []);

  const set = (value: "accepted" | "declined") => {
    try {
      localStorage.setItem(KEY, value);
    } catch {}
    setVisible(false);
    document.body.classList.remove("has-cookie-banner");
    if (value === "accepted") {
      window.dispatchEvent(new CustomEvent("cookie:accepted"));
    }
  };

  return (
    <div
      className={`cookie-banner${visible ? " is-visible" : ""}`}
      role="dialog"
      aria-label="Cookie preferences"
      aria-hidden={!visible}
    >
      <div className="cookie-banner__copy">
        <strong>We use cookies.</strong>
        <span>
          A small set of cookies helps us understand how the site is used so we
          can make it better. You can opt out anytime.
        </span>
      </div>
      <div className="cookie-banner__actions">
        <button
          type="button"
          className="btn btn--ghost btn--small"
          onClick={() => set("declined")}
        >
          Decline
        </button>
        <button
          type="button"
          className="btn btn--primary btn--small"
          onClick={() => set("accepted")}
        >
          Accept
        </button>
      </div>
    </div>
  );
}
