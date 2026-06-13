import Link from 'next/link';
import { getBlogPostsMeta } from '@/app/blog/utils';

export default function HomeV12() {
  const posts = getBlogPostsMeta();

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 font-mono">
      <div className="mb-6 grid grid-cols-[auto_1fr_auto_auto] gap-x-6 border-b border-stone-800 pb-2 text-[0.6rem] uppercase tracking-widest text-stone-600">
        <span>#</span>
        <span>título</span>
        <span>data</span>
        <span>min</span>
      </div>
      <ul>
        {posts.map((post, i) => (
          <li key={post.slug} className="border-b border-stone-900/60">
            <Link
              href={`/blog/${post.slug}`}
              className="group grid grid-cols-[auto_1fr_auto_auto] items-center gap-x-6 py-2.5 text-xs"
            >
              <span className="text-stone-700">{String(i + 1).padStart(2, '0')}</span>
              <span className="truncate text-stone-300 transition-colors group-hover:text-white">
                {post.metadata.title}
              </span>
              <time dateTime={post.metadata.publishedAt} className="text-stone-600">
                {post.metadata.publishedAt.split('-').slice(0, 2).join('.')}
              </time>
              <span className="text-right text-stone-700">
                {Math.ceil(post.readingTime.minutes)}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
