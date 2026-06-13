import Link from 'next/link';
import { getBlogPostsMeta } from '@/app/blog/utils';

export default function HomeV5() {
  const posts = getBlogPostsMeta();

  return (
    <main className="mx-auto max-w-2xl px-4 py-16">
      {/* Hero */}
      <section className="border-b border-stone-800/60 pb-10">
        <h1 className="text-xl font-bold tracking-tight text-stone-100">
          Adriano de Azevedo
        </h1>
        <p className="mt-0.5 text-sm text-stone-500">Frontend Developer</p>
        <p className="mt-4 max-w-sm text-sm leading-relaxed text-stone-500">
          Construo experiências web com foco em performance e design. Escrevo
          sobre TypeScript, React e tudo que é interessante no frontend moderno.
        </p>
        <nav className="mt-5 flex items-center gap-5">
          <a
            href="mailto:contato@adriano.dev"
            className="text-xs text-stone-500 transition-colors hover:text-stone-200"
          >
            contato@adriano.dev
          </a>
          <Link
            href="/rss.xml"
            className="text-xs text-stone-500 transition-colors hover:text-stone-200"
          >
            RSS
          </Link>
        </nav>
      </section>

      {/* Writing */}
      <section className="mt-10">
        <h2 className="mb-6 text-[0.65rem] font-semibold tracking-widest text-stone-600 uppercase">
          Escrita
        </h2>
        <ul>
          {posts.map((post) => (
            <li key={post.slug} className="border-b border-stone-900">
              <Link
                href={`/blog/${post.slug}`}
                className="group flex items-center justify-between gap-6 py-4"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-stone-200 transition-colors group-hover:text-white">
                    {post.metadata.title}
                  </p>
                  <time
                    dateTime={post.metadata.publishedAt}
                    className="mt-0.5 block font-mono text-xs text-stone-600"
                  >
                    {post.metadata.publishedAt.split('-').reverse().join('/')}
                  </time>
                </div>
                <span className="shrink-0 rounded-full border border-stone-800 px-3 py-1 font-mono text-xs text-stone-600 transition-colors group-hover:border-stone-700 group-hover:text-stone-400">
                  {Math.ceil(post.readingTime.minutes)} min
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
