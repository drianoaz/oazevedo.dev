import Link from 'next/link';
import { getBlogPostsMeta } from '@/app/blog/utils';

export default function HomeV4() {
  const posts = getBlogPostsMeta();

  return (
    <main className="relative mx-auto max-w-3xl overflow-hidden px-4 py-16">
      {/* Background glow decoration */}
      <div className="pointer-events-none absolute -top-24 left-1/4 h-72 w-72 -translate-x-1/2 rounded-full bg-violet-900/25 blur-3xl" />
      <div className="pointer-events-none absolute -top-12 right-1/4 h-48 w-48 translate-x-1/2 rounded-full bg-cyan-900/20 blur-3xl" />

      {/* Hero */}
      <section className="relative mb-14">
        <h1 className="bg-gradient-to-r from-violet-400 via-fuchsia-300 to-cyan-400 bg-clip-text text-4xl font-bold text-transparent">
          Adriano de Azevedo
        </h1>
        <p className="mt-3 text-stone-400">
          Frontend developer &middot; TypeScript &middot; React &middot; Web
        </p>
      </section>

      {/* Cards grid */}
      <ul className="relative grid gap-4 sm:grid-cols-2">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/blog/${post.slug}`}
              className="group flex h-full flex-col rounded-2xl border border-stone-800/60 bg-stone-900/40 p-5 backdrop-blur-sm transition-all duration-300 hover:border-stone-600/60 hover:bg-stone-900/60 hover:shadow-lg hover:shadow-violet-950/30"
            >
              <h2 className="leading-snug font-semibold text-stone-100 transition-colors group-hover:text-white">
                {post.metadata.title}
              </h2>
              {post.metadata.summary && (
                <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-stone-500">
                  {post.metadata.summary}
                </p>
              )}
              <div className="mt-4 flex items-center justify-between border-t border-stone-800/50 pt-3 text-xs text-stone-600">
                <time dateTime={post.metadata.publishedAt}>
                  {post.metadata.publishedAt.split('-').reverse().join('/')}
                </time>
                <span className="rounded-full bg-stone-800/60 px-2.5 py-0.5 font-mono">
                  {Math.ceil(post.readingTime.minutes)} min
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
