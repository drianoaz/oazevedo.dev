import Link from 'next/link';
import { getBlogPostsMeta } from '@/app/blog/utils';

const SIZES = ['text-4xl', 'text-3xl', 'text-2xl', 'text-xl', 'text-base'];
const WEIGHTS = ['font-black', 'font-bold', 'font-semibold', 'font-medium', 'font-normal'];

export default function HomeV20() {
  const posts = getBlogPostsMeta();

  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <ul className="space-y-6">
        {posts.map((post, i) => {
          const size = SIZES[Math.min(i, SIZES.length - 1)];
          const weight = WEIGHTS[Math.min(i, WEIGHTS.length - 1)];
          const opacity = i === 0 ? 'text-stone-100' : i === 1 ? 'text-stone-200' : i === 2 ? 'text-stone-400' : i === 3 ? 'text-stone-600' : 'text-stone-700';
          return (
            <li key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                className={`group flex items-baseline gap-4 transition-colors hover:text-white ${size} ${weight} ${opacity}`}
              >
                <span className="flex-1 leading-tight">{post.metadata.title}</span>
                <time
                  dateTime={post.metadata.publishedAt}
                  className="shrink-0 font-mono text-xs text-stone-700"
                >
                  {post.metadata.publishedAt.split('-').slice(1).join('.')}
                </time>
              </Link>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
