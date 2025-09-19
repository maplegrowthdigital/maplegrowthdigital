import { Container } from './Container';

export function Belief({ title, quote }: { title: string; quote: string }) {
  return (
    <section className="relative overflow-hidden py-24 border-t border-gray-100 dark:border-gray-800">
      <Container>
        <div className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl border border-gray-200 bg-white/70 p-10 text-center backdrop-blur-sm shadow-sm dark:border-gray-800 dark:bg-white/5">
          <div className="pointer-events-none absolute -left-10 -top-10 h-56 w-56 rounded-full bg-brand-500/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-12 -right-12 h-64 w-64 rounded-full bg-brand-500/10 blur-3xl" />

          <span className="chip-brand">{title}</span>

          <div className="mx-auto mt-6 max-w-2xl">
            <svg
              aria-hidden
              className="mx-auto h-10 w-10 text-brand-500/60"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M7 7h5v5H7z" />
              <path d="M12 7h5v5h-5z" />
            </svg>
            <blockquote className="mt-4 text-2xl font-semibold leading-snug tracking-tight text-gray-900 italic dark:text-gray-100 sm:text-3xl">
              “{quote}”
            </blockquote>
          </div>

          <div className="mx-auto mt-8 h-px w-24 rounded bg-brand-500/40" />
        </div>
      </Container>
    </section>
  );
}
