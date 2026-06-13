import Link from 'next/link';
import { getBlogPostsMeta } from '@/app/blog/utils';

export default function HomeV7() {
  const posts = getBlogPostsMeta();

  return (
    <main className="mx-auto max-w-2xl px-4 py-16">
      <header className="mb-14">
        <h1 className="gradient-pan-text text-4xl font-black">
          Adriano de Azevedo
        </h1>
        <p className="mt-3 text-sm text-stone-500">Frontend Developer</p>
      </header>

      <ul className="space-y-8">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/blog/${post.slug}`}
              className="group relative block pb-2"
            >
              <h2 className="text-lg font-semibold text-stone-200 transition-colors group-hover:text-white">
                {post.metadata.title}
              </h2>
              <div className="mt-1 flex gap-3 font-mono text-xs text-stone-600">
                <time dateTime={post.metadata.publishedAt}>
                  {post.metadata.publishedAt.split('-').reverse().join('/')}
                </time>
                <span>{Math.ceil(post.readingTime.minutes)} min</span>
              </div>
              {/* Gradient underline that grows on hover */}
              <span className="absolute bottom-0 left-0 h-px w-0 bg-linear-to-r from-violet-400 via-sky-400 to-emerald-400 transition-[width] duration-500 group-hover:w-full" />
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
