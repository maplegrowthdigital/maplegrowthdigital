"use client";

import { useEffect } from "react";
import { gsap } from "gsap";

/**
 * MagneticButtons — applies a cursor-following pull to any element
 * with `data-magnetic`.
 *
 * Mount once per page that wants the effect (homepage).
 * - Skips touch devices and reduced-motion users.
 * - Re-scans DOM on every mount, plus listens for DOM changes via
 *   MutationObserver so dynamically-added [data-magnetic] elements
 *   (modals, etc.) are picked up.
 */
export function MagneticButtons() {
  useEffect(() => {
    const isTouch = window.matchMedia("(hover: none)").matches;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (isTouch || prefersReduced) return;

    type WiredEl = HTMLElement & { __mgdMagneticCleanup?: () => void };
    const wireUp = (el: WiredEl) => {
      if (el.__mgdMagneticCleanup) return;
      const strength = 0.35;
      const onMove = (e: MouseEvent) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - (rect.left + rect.width / 2);
        const y = e.clientY - (rect.top + rect.height / 2);
        gsap.to(el, {
          x: x * strength,
          y: y * strength,
          duration: 0.4,
          ease: "power3.out",
        });
      };
      const onLeave = () => {
        gsap.to(el, {
          x: 0,
          y: 0,
          duration: 0.6,
          ease: "elastic.out(1, 0.4)",
        });
      };
      el.addEventListener("mousemove", onMove);
      el.addEventListener("mouseleave", onLeave);
      el.__mgdMagneticCleanup = () => {
        el.removeEventListener("mousemove", onMove);
        el.removeEventListener("mouseleave", onLeave);
        delete el.__mgdMagneticCleanup;
      };
    };

    const scanAndWire = () => {
      document
        .querySelectorAll<HTMLElement>("[data-magnetic]")
        .forEach((el) => wireUp(el as WiredEl));
    };
    scanAndWire();

    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        m.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return;
          if (node.matches?.("[data-magnetic]")) wireUp(node as WiredEl);
          node
            .querySelectorAll?.<HTMLElement>("[data-magnetic]")
            .forEach((el) => wireUp(el as WiredEl));
        });
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      document
        .querySelectorAll<WiredEl>("[data-magnetic]")
        .forEach((el) => el.__mgdMagneticCleanup?.());
    };
  }, []);

  return null;
}
