import Link from 'next/link';
import { getBlogPostsMeta } from '@/app/blog/utils';

const HUES = [270, 210, 155, 40, 330];

export default function HomeV10() {
  const posts = getBlogPostsMeta();

  return (
    <main className="mx-auto max-w-2xl px-4 py-16">
      <header className="mb-14">
        <h1 className="text-2xl font-bold text-stone-100">Adriano de Azevedo</h1>
        <p className="mt-1 text-sm text-stone-500">Frontend Developer</p>
      </header>

      <ul>
        {posts.map((post, i) => (
          <li key={post.slug} className="border-b border-stone-900 last:border-b-0">
            <Link
              href={`/blog/${post.slug}`}
              className="group flex items-center gap-5 py-5 transition-all"
            >
              {/* Color swatch that expands on hover */}
              <span
                className="h-8 w-1 shrink-0 rounded-full transition-all duration-300 group-hover:w-2"
                style={{
                  background: `hsl(${HUES[i % HUES.length]}, 70%, 60%)`,
                  boxShadow: `0 0 12px hsl(${HUES[i % HUES.length]}, 70%, 60%)`,
                  opacity: 0.7,
                }}
              />
              <span className="flex-1 text-stone-300 transition-colors group-hover:text-white">
                {post.metadata.title}
              </span>
              <div className="flex shrink-0 items-center gap-3 font-mono text-xs text-stone-600">
                <time dateTime={post.metadata.publishedAt}>
                  {post.metadata.publishedAt.split('-').reverse().join('/')}
                </time>
                <span>{Math.ceil(post.readingTime.minutes)}min</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
