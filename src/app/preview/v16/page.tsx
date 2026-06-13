import Link from 'next/link';
import { getBlogPostsMeta } from '@/app/blog/utils';

export default function HomeV16() {
  const posts = getBlogPostsMeta();

  return (
    <main className="flex min-h-[calc(100vh-8rem)] gap-0">
      {/* Rotated sidebar label */}
      <aside className="flex w-14 shrink-0 items-center justify-center border-r border-stone-800">
        <span
          className="select-none font-mono text-xs uppercase tracking-[0.35em] text-stone-700"
          style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
        >
          writing
        </span>
      </aside>

      {/* Posts */}
      <div className="flex flex-1 flex-col justify-center px-10 py-12">
        <header className="mb-10">
          <h1 className="text-xl font-bold text-stone-100">Adriano de Azevedo</h1>
          <p className="mt-1 text-sm text-stone-500">Frontend Developer</p>
        </header>

        <ul className="space-y-6">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                className="group flex items-baseline justify-between gap-6"
              >
                <span className="text-stone-200 transition-colors group-hover:text-white">
                  {post.metadata.title}
                </span>
                <time
                  dateTime={post.metadata.publishedAt}
                  className="shrink-0 font-mono text-xs text-stone-600"
                >
                  {post.metadata.publishedAt.split('-').reverse().join('/')}
                </time>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
