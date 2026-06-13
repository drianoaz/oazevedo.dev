import Link from 'next/link';
import { getBlogPostsMeta } from '@/app/blog/utils';

export default function HomeV14() {
  const posts = getBlogPostsMeta();

  return (
    <main className="mx-auto max-w-2xl px-4 py-20">
      <header className="mb-16 border-b border-stone-800 pb-6">
        <h1 className="text-sm font-semibold uppercase tracking-[0.25em] text-stone-400">
          Adriano de Azevedo
        </h1>
        <p className="mt-1 text-xs uppercase tracking-widest text-stone-700">
          Índice de Publicações
        </p>
      </header>

      <ul>
        {posts.map((post, i) => (
          <li key={post.slug} className="border-b border-stone-900/50">
            <Link
              href={`/blog/${post.slug}`}
              className="group flex items-end gap-2 py-4"
            >
              <span className="w-6 shrink-0 font-mono text-xs text-stone-700">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="shrink-0 text-sm text-stone-300 transition-colors group-hover:text-white">
                {post.metadata.title}
              </span>
              {/* dot leader */}
              <span className="grow border-b border-dotted border-stone-800/60" />
              <span className="shrink-0 font-mono text-xs text-stone-600">
                {Math.ceil(post.readingTime.minutes)}min
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
