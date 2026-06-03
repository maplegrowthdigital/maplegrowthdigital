"use client";

import { useEffect, useRef } from "react";

/**
 * LeafCanvas — easter egg.
 *
 * Two triggers:
 *  1. User types `m-a-p-l-e` anywhere outside a form field.
 *  2. Anything dispatches `window.dispatchEvent(new CustomEvent("celebrate:burst"))`
 *     (used by booking confirmation, wizard submission, etc.)
 *
 * Renders ~90 colored "leaf" petals that fall + sway + rotate, then auto-cleans up.
 */
export function LeafCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const TRIGGER = "maple";
    let leaves: Array<{
      x: number;
      y: number;
      size: number;
      speed: number;
      sway: number;
      swaySpeed: number;
      rotation: number;
      rotationSpeed: number;
      color: string;
      opacity: number;
    }> = [];
    let rafId: number | null = null;
    let buffer = "";
    let bufferTimer: ReturnType<typeof setTimeout> | null = null;

    const sizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    sizeCanvas();
    window.addEventListener("resize", sizeCanvas);

    const makeLeaf = () => {
      const colors = ["#C62828", "#9e1f1f", "#e89393", "#d94f2a"];
      return {
        x: Math.random() * window.innerWidth,
        y: -40 - Math.random() * window.innerHeight * 0.5,
        size: 14 + Math.random() * 18,
        speed: 1 + Math.random() * 2.2,
        sway: Math.random() * Math.PI * 2,
        swaySpeed: 0.01 + Math.random() * 0.03,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.06,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: 0.7 + Math.random() * 0.3,
      };
    };

    const drawLeaf = (l: (typeof leaves)[number]) => {
      ctx.save();
      ctx.translate(l.x, l.y);
      ctx.rotate(l.rotation);
      ctx.globalAlpha = l.opacity;
      ctx.fillStyle = l.color;
      ctx.beginPath();
      const s = l.size;
      ctx.moveTo(0, -s);
      ctx.quadraticCurveTo(s * 0.55, -s * 0.25, 0, s);
      ctx.quadraticCurveTo(-s * 0.55, -s * 0.25, 0, -s);
      ctx.fill();
      ctx.beginPath();
      ctx.strokeStyle = "rgba(0,0,0,0.18)";
      ctx.lineWidth = 1.2;
      ctx.moveTo(0, 0);
      ctx.lineTo(0, s);
      ctx.stroke();
      ctx.restore();
    };

    const tick = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      leaves.forEach((l) => {
        l.sway += l.swaySpeed;
        l.x += Math.sin(l.sway) * 0.8;
        l.y += l.speed;
        l.rotation += l.rotationSpeed;
        drawLeaf(l);
      });
      leaves = leaves.filter((l) => l.y < window.innerHeight + 60);
      if (leaves.length > 0) {
        rafId = requestAnimationFrame(tick);
      } else {
        canvas.classList.remove("is-active");
        rafId = null;
      }
    };

    const burst = () => {
      const count = 90;
      for (let i = 0; i < count; i++) leaves.push(makeLeaf());
      canvas.classList.add("is-active");
      if (!rafId) rafId = requestAnimationFrame(tick);
    };

    const isTypingTarget = (el: EventTarget | null): boolean => {
      const node = el as HTMLElement | null;
      if (!node) return false;
      const tag = (node.tagName || "").toLowerCase();
      return (
        tag === "input" ||
        tag === "textarea" ||
        tag === "select" ||
        node.isContentEditable
      );
    };

    const onKey = (e: KeyboardEvent) => {
      if (isTypingTarget(e.target)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (!/^[a-z]$/i.test(e.key)) return;
      buffer = (buffer + e.key.toLowerCase()).slice(-TRIGGER.length);
      if (bufferTimer) clearTimeout(bufferTimer);
      bufferTimer = setTimeout(() => (buffer = ""), 2000);
      if (buffer === TRIGGER) {
        burst();
        buffer = "";
      }
    };
    document.addEventListener("keydown", onKey);
    window.addEventListener("celebrate:burst", burst as EventListener);

    return () => {
      window.removeEventListener("resize", sizeCanvas);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("celebrate:burst", burst as EventListener);
      if (rafId) cancelAnimationFrame(rafId);
      if (bufferTimer) clearTimeout(bufferTimer);
    };
  }, []);

  return <canvas ref={canvasRef} className="leaf-fall" aria-hidden="true" />;
}
