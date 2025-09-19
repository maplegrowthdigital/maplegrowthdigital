import Link from 'next/link';
import { Container } from './Container';

type Item = { slug: string; title: string };

export function BlogNav({ prev, next }: { prev?: Item; next?: Item }) {
  return (
    <section className="border-t border-gray-100 py-8 dark:border-gray-800">
      <Container>
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex gap-3 text-sm">
            <Link href="/blog" className="btn-secondary">← Back to Blog</Link>
            <Link href="/" className="btn-secondary">Home</Link>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            {prev && (
              <Link
                href={`/blog/${prev.slug}`}
                className="btn-secondary w-full justify-between sm:w-auto"
                title={prev.title}
              >
                ← Previous
              </Link>
            )}
            {next && (
              <Link
                href={`/blog/${next.slug}`}
                className="btn-primary w-full justify-between sm:w-auto"
                title={next.title}
              >
                Next →
              </Link>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}

