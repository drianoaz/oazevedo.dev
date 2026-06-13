import Link from 'next/link';
import { getBlogPostsMeta } from '@/app/blog/utils';

export default function HomeV19() {
  const posts = getBlogPostsMeta();

  return (
    <main className="min-h-screen bg-stone-50 px-4 py-16 text-stone-900">
      <div className="mx-auto max-w-2xl">
        <header className="mb-14">
          <h1 className="text-2xl font-bold">Adriano de Azevedo</h1>
          <p className="mt-1 text-sm text-stone-500">Frontend Developer</p>
        </header>

        <ul className="divide-y divide-stone-200">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                className="group flex items-center justify-between gap-6 py-5"
              >
                <div>
                  <h2 className="font-semibold text-stone-800 transition-colors group-hover:text-stone-950">
                    {post.metadata.title}
                  </h2>
                  <p className="mt-0.5 line-clamp-1 text-sm text-stone-400">
                    {post.metadata.summary}
                  </p>
                </div>
                <div className="shrink-0 text-right font-mono text-xs text-stone-400">
                  <time dateTime={post.metadata.publishedAt} className="block">
                    {post.metadata.publishedAt.split('-').reverse().join('/')}
                  </time>
                  <span>{Math.ceil(post.readingTime.minutes)} min</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
