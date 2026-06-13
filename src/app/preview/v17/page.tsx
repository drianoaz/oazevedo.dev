import Link from 'next/link';
import { getBlogPostsMeta } from '@/app/blog/utils';

export default function HomeV17() {
  const posts = getBlogPostsMeta();
  const [hero, ...rest] = posts;

  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      {/* Hero post — enormous */}
      {hero && (
        <Link
          href={`/blog/${hero.slug}`}
          className="group mb-12 block border-b border-stone-800 pb-12"
        >
          <h2
            className="font-black leading-none text-stone-800 transition-colors group-hover:text-stone-100"
            style={{ fontSize: 'clamp(3rem, 10vw, 8rem)' }}
          >
            {hero.metadata.title}
          </h2>
          <div className="mt-4 flex gap-4 font-mono text-xs text-stone-600">
            <time dateTime={hero.metadata.publishedAt}>
              {hero.metadata.publishedAt.split('-').reverse().join('/')}
            </time>
            <span>{Math.ceil(hero.readingTime.minutes)} min de leitura</span>
          </div>
        </Link>
      )}

      {/* Remaining — compact */}
      {rest.length > 0 && (
        <ul className="space-y-3">
          {rest.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                className="group flex items-center gap-4"
              >
                <span className="flex-1 text-sm text-stone-500 transition-colors group-hover:text-stone-200">
                  {post.metadata.title}
                </span>
                <time
                  dateTime={post.metadata.publishedAt}
                  className="shrink-0 font-mono text-xs text-stone-700"
                >
                  {post.metadata.publishedAt.split('-').reverse().join('/')}
                </time>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
