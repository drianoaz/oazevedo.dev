import Link from 'next/link';
import { getBlogPostsMeta } from '@/app/blog/utils';

export default function HomeV3() {
  const posts = getBlogPostsMeta();

  return (
    <main className="mx-auto max-w-2xl px-4 py-20">
      {/* Header */}
      <div className="mb-14 flex items-baseline justify-between border-b border-stone-800 pb-6">
        <div>
          <h1 className="text-sm font-semibold tracking-[0.2em] text-stone-100 uppercase">
            Adriano de Azevedo
          </h1>
          <p className="mt-1 text-xs text-stone-600">Frontend Developer</p>
        </div>
        <span className="font-mono text-xs text-stone-700">
          {String(posts.length).padStart(2, '0')} posts
        </span>
      </div>

      {/* Posts */}
      <ul>
        {posts.map((post, i) => (
          <li key={post.slug} className="border-b border-stone-900/80">
            <Link
              href={`/blog/${post.slug}`}
              className="group flex items-end gap-3 py-5"
            >
              <span className="mb-0.5 w-5 shrink-0 font-mono text-xs text-stone-700">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="shrink-0 text-stone-200 transition-colors group-hover:text-white">
                {post.metadata.title}
              </span>
              {/* dot leader */}
              <span className="grow border-b border-dashed border-stone-800/70" />
              <time
                dateTime={post.metadata.publishedAt}
                className="shrink-0 font-mono text-xs text-stone-600"
              >
                {post.metadata.publishedAt.slice(0, 7).replace('-', '.')}
              </time>
              <span className="shrink-0 font-mono text-xs text-stone-700">
                {Math.ceil(post.readingTime.minutes)}m
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {/* Footer note */}
      <p className="mt-10 text-xs text-stone-700">
        <Link
          href="/rss.xml"
          className="transition-colors hover:text-stone-500"
        >
          RSS ↗
        </Link>
      </p>
    </main>
  );
}
