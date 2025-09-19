import Image from 'next/image';
import { Container } from './Container';
import { site } from '../content/site';

export function Work() {
  return (
    <section id="work" className="py-24 border-t border-gray-100 dark:border-gray-800">
      <Container>
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">{site.work.title}</h2>
            <p className="mt-4 text-gray-600">{site.work.subtitle}</p>
          </div>
          <a href="#contact" className="hidden sm:inline-flex btn-secondary">Work with us</a>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {site.work.projects.map((p) => (
            <a key={p.title} href="#" className="group overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-brand-500">
              <div className="relative aspect-[4/3] bg-gray-100">
                <Image alt={p.title} src={p.image} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
              </div>
              <div className="p-4">
                <div className="text-sm text-gray-500">{p.category}</div>
                <div className="mt-1 font-semibold">{p.title}</div>
              </div>
            </a>
          ))}
        </div>
      </Container>
    </section>
  );
}
