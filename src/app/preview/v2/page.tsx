import Link from 'next/link';
import { getBlogPostsMeta } from '@/app/blog/utils';

export default function HomeV2() {
  const posts = getBlogPostsMeta();
  const [featured, ...rest] = posts;

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      {/* Masthead */}
      <header className="pb-5 text-center">
        <p className="font-mono text-[0.65rem] tracking-[0.4em] text-stone-600 uppercase">
          Desenvolvimento &middot; {new Date().getFullYear()}
        </p>
        <h1 className="mt-2 text-6xl leading-none font-black tracking-tight text-stone-50 uppercase">
          O&nbsp;Azevedo
        </h1>
        <div className="mt-1 border-y-2 border-double border-stone-700 py-2 font-mono text-[0.65rem] text-stone-600">
          Est. 2024 &nbsp;·&nbsp; {posts.length} publicações &nbsp;·&nbsp;
          oazevedo.dev
        </div>
      </header>

      {/* Featured */}
      {featured && (
        <Link
          href={`/blog/${featured.slug}`}
          className="group mt-6 block border-t-2 border-stone-700 pt-6"
        >
          <p className="font-mono text-[0.65rem] tracking-widest text-stone-500 uppercase">
            Destaque
          </p>
          <h2 className="mt-2 text-3xl leading-snug font-bold text-stone-100 transition-colors group-hover:text-white">
            {featured.metadata.title}
          </h2>
          <p className="mt-3 max-w-lg leading-relaxed text-stone-400">
            {featured.metadata.summary}
          </p>
          <div className="mt-4 flex items-center gap-4 font-mono text-xs text-stone-600">
            <time dateTime={featured.metadata.publishedAt}>
              {featured.metadata.publishedAt.split('-').reverse().join('/')}
            </time>
            <span>
              {Math.ceil(featured.readingTime.minutes)} min de leitura
            </span>
          </div>
        </Link>
      )}

      {/* Remaining posts */}
      {rest.length > 0 && (
        <ul className="mt-8 border-t border-stone-800">
          {rest.map((post) => (
            <li key={post.slug} className="border-b border-stone-800/50">
              <Link
                href={`/blog/${post.slug}`}
                className="group flex items-start gap-5 py-5"
              >
                <time
                  dateTime={post.metadata.publishedAt}
                  className="w-20 shrink-0 pt-0.5 font-mono text-xs text-stone-600"
                >
                  {post.metadata.publishedAt.split('-').reverse().join('/')}
                </time>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-stone-200 transition-colors group-hover:text-white">
                    {post.metadata.title}
                  </h3>
                  <p className="mt-1 line-clamp-1 text-sm text-stone-500">
                    {post.metadata.summary}
                  </p>
                </div>
                <span className="shrink-0 pt-0.5 font-mono text-xs text-stone-600">
                  {Math.ceil(post.readingTime.minutes)}min
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
