import Link from 'next/link';
import { getBlogPostsMeta } from '@/app/blog/utils';

const PALETTE = [
  { dot: 'bg-violet-400', date: 'text-violet-400' },
  { dot: 'bg-sky-400', date: 'text-sky-400' },
  { dot: 'bg-emerald-400', date: 'text-emerald-400' },
  { dot: 'bg-amber-400', date: 'text-amber-400' },
  { dot: 'bg-rose-400', date: 'text-rose-400' },
];

export default function HomeV6() {
  const posts = getBlogPostsMeta();

  return (
    <main className="mx-auto max-w-2xl px-4 py-16">
      <header className="mb-14">
        <h1 className="text-2xl font-bold text-stone-100">Adriano de Azevedo</h1>
        <p className="mt-1 text-sm text-stone-500">Frontend Developer</p>
      </header>

      <ul className="space-y-7">
        {posts.map((post, i) => {
          const { dot, date } = PALETTE[i % PALETTE.length];
          return (
            <li key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                className="group flex items-center gap-4"
              >
                <span
                  className={`size-2 shrink-0 rounded-full transition-all duration-300 group-hover:scale-150 ${dot}`}
                />
                <span className="flex-1 text-stone-300 transition-colors group-hover:text-white">
                  {post.metadata.title}
                </span>
                <time
                  dateTime={post.metadata.publishedAt}
                  className={`shrink-0 font-mono text-xs ${date}`}
                >
                  {post.metadata.publishedAt.split('-').reverse().join('/')}
                </time>
              </Link>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
