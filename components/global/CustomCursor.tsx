"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { gsap } from "gsap";

/**
 * CustomCursor — dot + ring cursor that follows the pointer.
 *
 * Mount this once per page that wants the effect (typically the homepage).
 * - Portaled to <body> so it isn't trapped inside <main>'s z-index stacking
 *   context. (Modals portal to <body> at z-index 200; the cursor lives at
 *   z-index 9999, so it must share the body-level stacking context to render
 *   ABOVE an open modal — otherwise it vanishes behind it.)
 * - Adds `body.mgd-cursor-on` so prototype.css can `cursor: none`.
 * - Skipped on touch devices and when `prefers-reduced-motion: reduce`.
 * - Ring lerp-follows the dot for a soft trail effect.
 * - Hover targets (`a, button, [data-magnetic]`) grow the ring.
 */
export function CustomCursor() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  // Portal target (document.body) only exists on the client. Gate the render
  // + the effect on `mounted` so SSR doesn't touch `document`.
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;

    const isTouch = window.matchMedia("(hover: none)").matches;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (isTouch || prefersReduced) return;

    const cursor = wrapRef.current;
    if (!cursor) return;
    const dot = cursor.querySelector<HTMLDivElement>(".cursor__dot");
    const ring = cursor.querySelector<HTMLDivElement>(".cursor__ring");
    if (!dot || !ring) return;

    document.body.classList.add("mgd-cursor-on");

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ringPos = { x: pos.x, y: pos.y };

    const onMove = (e: MouseEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      gsap.set(dot, { x: pos.x, y: pos.y });
    };
    document.addEventListener("mousemove", onMove);

    const tick = () => {
      ringPos.x += (pos.x - ringPos.x) * 0.18;
      ringPos.y += (pos.y - ringPos.y) * 0.18;
      gsap.set(ring, { x: ringPos.x, y: ringPos.y });
    };
    gsap.ticker.add(tick);

    // Hover targets — grow the ring
    const targets =
      "a, button, [data-magnetic], [data-service], [data-case], [data-insight]";
    const onEnter = () => cursor.classList.add("is-hover");
    const onLeave = () => cursor.classList.remove("is-hover");
    const hoverEls = Array.from(document.querySelectorAll(targets));
    hoverEls.forEach((el) => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });

    return () => {
      document.removeEventListener("mousemove", onMove);
      gsap.ticker.remove(tick);
      hoverEls.forEach((el) => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
      });
      document.body.classList.remove("mgd-cursor-on");
    };
  }, [mounted]);

  if (!mounted) return null;

  return createPortal(
    <div ref={wrapRef} className="cursor" aria-hidden="true">
      <div className="cursor__dot" />
      <div className="cursor__ring" />
    </div>,
    document.body
  );
}
