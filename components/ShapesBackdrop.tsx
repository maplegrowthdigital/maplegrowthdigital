"use client";
import { useEffect, useRef, useState } from 'react';

type Props = { className?: string; intensity?: number };

export function ShapesBackdrop({ className = '', intensity = 16 }: Props) {
  const [pos, setPos] = useState({ x: 0, y: 0 }); // normalized -1..1
  const target = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1; // -1..1
      const ny = (e.clientY / window.innerHeight) * 2 - 1; // -1..1 (down positive)
      target.current.x = nx;
      target.current.y = ny;
      if (rafRef.current == null) {
        rafRef.current = requestAnimationFrame(() => {
          rafRef.current = null;
          setPos({ x: target.current.x, y: target.current.y });
        });
      }
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const t = (fx: number, fy?: number) => {
    const dx = pos.x * fx;
    const dy = pos.y * (fy ?? fx);
    return { transform: `translate3d(${dx}px, ${dy}px, 0)` } as const;
  };

  return (
    <div className={"pointer-events-none absolute inset-0 -z-10 " + className} aria-hidden>
      <div className="absolute -left-8 -top-8 h-40 w-40 rounded-full bg-brand-500/15 blur-3xl anim-float-y" style={t(intensity)} />
      <div className="absolute -right-10 bottom-6 h-28 w-28 rounded-full bg-brand-500/10 blur-2xl anim-float-x anim-delay-1000" style={t(intensity * 0.7)} />
      <div className="absolute -left-10 bottom-10 h-16 w-16 rotate-12 rounded-xl border-2 border-brand-500/20 anim-spin-slow" style={t(-intensity * 0.6)} />
      <div className="absolute left-12 -bottom-8 h-10 w-10 rounded-full bg-brand-500/20 blur-md anim-float-y anim-delay-1500" style={t(intensity * 0.5)} />
      <div className="absolute right-1/3 -top-6 h-8 w-8 rounded-full border-2 border-brand-500/30 anim-float-x anim-delay-500" style={t(-intensity * 0.4)} />
    </div>
  );
}
