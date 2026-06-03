"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

/**
 * CustomCursor — dot + ring cursor that follows the pointer.
 *
 * Mount this once per page that wants the effect (typically the homepage).
 * - Adds `body.mgd-cursor-on` so prototype.css can `cursor: none`.
 * - Skipped on touch devices and when `prefers-reduced-motion: reduce`.
 * - Ring lerp-follows the dot for a soft trail effect.
 * - Hover targets (`a, button, [data-magnetic]`) grow the ring.
 */
export function CustomCursor() {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
    const targets = "a, button, [data-magnetic], [data-service], [data-case], [data-insight]";
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
  }, []);

  return (
    <div ref={wrapRef} className="cursor" aria-hidden="true">
      <div className="cursor__dot" />
      <div className="cursor__ring" />
    </div>
  );
}
