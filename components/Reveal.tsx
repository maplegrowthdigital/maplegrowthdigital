"use client";
import { useEffect, useRef } from 'react';

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number; // ms
};

export function Reveal({ children, className = '', delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect reduced motion
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.classList.add('reveal-in');
      el.classList.remove('reveal-hidden');
      return;
    }

    el.classList.add('reveal-anim', 'reveal-hidden');
    if (delay) (el.style as any).transitionDelay = `${delay}ms`;

    const show = () => {
      // Give the browser 2 frames to paint the hidden state before revealing
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          el.classList.add('reveal-in');
          el.classList.remove('reveal-hidden');
        });
      });
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            show();
            io.unobserve(el);
          }
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.01 }
    );
    io.observe(el);

    // If already in view at mount, trigger once to ensure first-paint animation
    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    if (rect.top < vh && rect.bottom > 0) show();
    return () => io.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
