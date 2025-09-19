"use client";

export function BackToTop({ className = '', label = 'Back to top ↑' }: { className?: string; label?: string }) {
  const onClick = () => {
    try {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      // Fallback
      window.scrollTo(0, 0);
    }
  };
  return (
    <button type="button" onClick={onClick} className={className} aria-label="Back to top">
      {label}
    </button>
  );
}

