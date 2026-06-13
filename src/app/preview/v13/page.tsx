import Link from 'next/link';
import { getBlogPostsMeta } from '@/app/blog/utils';

function fmtDate(s: string) {
  const [, m, d] = s.split('-');
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return { month: months[+m - 1], day: d };
}

export default function HomeV13() {
  const posts = getBlogPostsMeta();

  return (
    <main className="mx-auto max-w-2xl px-4 py-16">
      <header className="mb-12">
        <h1 className="text-xl font-bold text-stone-100">Adriano de Azevedo</h1>
        <p className="mt-1 text-sm text-stone-500">Frontend Developer</p>
      </header>

      <ul className="relative pl-8">
        {/* Vertical line */}
        <span className="absolute left-3 top-2 h-[calc(100%-1rem)] w-px bg-stone-800" />

        {posts.map((post) => {
          const { month, day } = fmtDate(post.metadata.publishedAt);
          return (
            <li key={post.slug} className="relative mb-10 last:mb-0">
              {/* Node dot */}
              <span className="absolute -left-5 top-1.5 size-2.5 rounded-full border-2 border-stone-600 bg-stone-950" />
              {/* Date */}
              <time
                dateTime={post.metadata.publishedAt}
                className="block font-mono text-xs text-stone-600"
              >
                {month} {day}
              </time>
              {/* Title */}
              <Link
                href={`/blog/${post.slug}`}
                className="group mt-0.5 block font-semibold text-stone-200 transition-colors hover:text-white"
              >
                {post.metadata.title}
              </Link>
              <span className="mt-1 block font-mono text-xs text-stone-700">
                {Math.ceil(post.readingTime.minutes)} min
              </span>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
