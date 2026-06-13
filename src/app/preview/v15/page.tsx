import Link from 'next/link';
import { getBlogPostsMeta } from '@/app/blog/utils';

function fmtDate(s: string) {
  const [, m, d] = s.split('-');
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${months[+m - 1]} ${d}`;
}

export default function HomeV15() {
  const posts = getBlogPostsMeta();

  return (
    <main className="mx-auto max-w-2xl px-4 py-16 font-mono">
      <div className="mb-8">
        <p className="text-xs text-stone-600">adriano@oazevedo</p>
        <p className="mt-0.5 text-sm text-stone-400">
          ~/posts<span className="cursor-blink ml-0.5 inline-block h-4 w-2 translate-y-0.5 bg-stone-400" />
        </p>
      </div>

      <ul className="space-y-1 text-sm">
        {posts.map((post, i) => {
          const isLast = i === posts.length - 1;
          const prefix = isLast ? '└──' : '├──';
          return (
            <li key={post.slug} className="flex items-baseline gap-3">
              <span className="shrink-0 text-stone-700">{prefix}</span>
              <Link
                href={`/blog/${post.slug}`}
                className="group flex flex-1 items-baseline gap-3"
              >
                <span className="text-emerald-400 transition-colors group-hover:text-white">
                  {post.slug}.mdx
                </span>
                <span className="grow border-b border-dotted border-stone-800/50" />
                <time
                  dateTime={post.metadata.publishedAt}
                  className="shrink-0 text-xs text-stone-600"
                >
                  {fmtDate(post.metadata.publishedAt)}
                </time>
              </Link>
            </li>
          );
        })}
      </ul>

      <p className="mt-6 text-xs text-stone-700">
        {posts.length} files &middot;{' '}
        {posts.reduce((s, p) => s + Math.ceil(p.readingTime.minutes), 0)} min total
      </p>
    </main>
  );
}
