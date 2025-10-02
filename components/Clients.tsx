"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Container } from "./Container";

export function Clients({
  clients,
  clientLogos,
}: {
  clients?: { title: string };
  clientLogos?: ReadonlyArray<{ src: string; alt: string }>;
}) {
  const heading = clients || { title: "Trusted by Teams Across Canada" };
  const logos: ReadonlyArray<{ src: string; alt: string }> = clientLogos || [];
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [dragging, setDragging] = useState(false);
  const startX = useRef(0);
  const startScroll = useRef(0);
  const pointerIdRef = useRef<number | null>(null);
  const hoverRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef<number | null>(null);
  const segmentRef = useRef<number>(0);

  const adjustLoop = () => {
    const el = scrollRef.current;
    const seg = segmentRef.current || 0;
    if (!el || seg === 0) return;
    if (el.scrollLeft >= seg * 2 - 1) {
      el.scrollLeft -= seg; // wrap back one segment
    } else if (el.scrollLeft <= 1) {
      el.scrollLeft += seg; // wrap forward one segment
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onPointerMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - startX.current;
      el.scrollLeft = startScroll.current - dx;
      adjustLoop();
    };
    const onPointerUp = (_e: PointerEvent) => {
      if (!dragging) return;
      setDragging(false);
      if (
        pointerIdRef.current != null &&
        el.hasPointerCapture?.(pointerIdRef.current)
      ) {
        try {
          el.releasePointerCapture(pointerIdRef.current);
        } catch {}
      }
      pointerIdRef.current = null;
    };
    const onPointerCancel = onPointerUp;
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerup", onPointerUp, { passive: true });
    window.addEventListener("pointercancel", onPointerCancel, {
      passive: true,
    });
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerCancel);
    };
  }, [dragging]);

  // Autoplay scroll with pause on hover/drag/hidden and reduced motion
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");

    const measure = () => {
      // We render 3 copies of the logos; one segment is a third of total scrollWidth
      segmentRef.current = el.scrollWidth / 3;
      if (el.scrollLeft === 0) {
        el.scrollLeft = segmentRef.current; // start centered for seamless loop
      }
    };
    measure();
    const onResize = () => measure();
    window.addEventListener("resize", onResize);

    const tick = (ts: number) => {
      if (document.visibilityState === "hidden") {
        lastTsRef.current = ts;
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      if (dragging || hoverRef.current || mql.matches) {
        lastTsRef.current = ts;
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      const last = lastTsRef.current ?? ts;
      const dt = ts - last;
      lastTsRef.current = ts;
      const speed = 0.05; // px per ms
      el.scrollLeft += dt * speed;
      adjustLoop();
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    const onEnter = () => {
      hoverRef.current = true;
    };
    const onLeave = () => {
      hoverRef.current = false;
    };
    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);
    const onVis = () => {
      lastTsRef.current = null;
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("resize", onResize);
    };
  }, [dragging]);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = scrollRef.current;
    if (!el) return;
    setDragging(true);
    startX.current = e.clientX;
    startScroll.current = el.scrollLeft;
    pointerIdRef.current = e.pointerId;
    el.setPointerCapture?.(e.pointerId);
  };

  return (
    <section
      id="clients"
      className="overflow-hidden py-20 border-t border-gray-100 dark:border-gray-800"
    >
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {heading.title}
          </h2>
        </div>
        <div className="relative mt-10">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white to-transparent dark:from-neutral-950" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white to-transparent dark:from-neutral-950" />
          <div
            ref={scrollRef}
            onPointerDown={onPointerDown}
            onScroll={adjustLoop}
            className={
              "no-scrollbar cursor-" +
              (dragging ? "grabbing" : "grab") +
              " overflow-x-auto select-none"
            }
            aria-label="Client logos carousel"
          >
            <div className="flex gap-16 px-4 py-2">
              {[...logos, ...logos, ...logos].map((logo, i) => (
                <div
                  key={i}
                  className="flex items-center justify-center opacity-80 transition hover:opacity-100"
                >
                  <div className="relative h-40 w-40 overflow-hidden rounded-full border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-neutral-900">
                    <Image
                      src={logo.src}
                      alt={logo.alt}
                      fill
                      className="object-contain p-6 grayscale hover:grayscale-0"
                      sizes="10rem"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
