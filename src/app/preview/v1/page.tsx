import Link from 'next/link';
import { getBlogPostsMeta } from '@/app/blog/utils';

function fmtDate(s: string) {
  const [, m, d] = s.split('-');
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  return `${months[+m - 1]} ${d}`;
}

export default function HomeV1() {
  const posts = getBlogPostsMeta();

  return (
    <main className="flex justify-center px-4 py-16">
      <div className="w-full max-w-2xl">
        {/* Window chrome */}
        <div className="overflow-hidden rounded-xl border border-stone-700/60 shadow-2xl shadow-black/70">
          {/* Title bar */}
          <div className="flex items-center gap-3 bg-stone-800/80 px-4 py-3">
            <div className="flex gap-1.5">
              <span className="size-3 rounded-full bg-red-500/80" />
              <span className="size-3 rounded-full bg-yellow-400/80" />
              <span className="size-3 rounded-full bg-green-500/80" />
            </div>
            <span className="mx-auto font-mono text-xs text-stone-500">
              adriano@oazevedo — zsh
            </span>
          </div>

          {/* Terminal body */}
          <div className="bg-[#0d1117] p-7 font-mono text-sm leading-relaxed">
            {/* whoami */}
            <div className="flex items-center gap-2">
              <span className="text-emerald-400">❯</span>
              <span className="text-stone-400">whoami</span>
            </div>
            <div className="mt-2 mb-6 border-l-2 border-stone-700 pl-4">
              <p className="font-semibold text-white">Adriano de Azevedo</p>
              <p className="mt-0.5 text-stone-500">
                frontend developer &middot; typescript &middot; react &middot;
                web
              </p>
            </div>

            {/* ls posts */}
            <div className="flex items-center gap-2">
              <span className="text-emerald-400">❯</span>
              <span className="text-stone-400">
                ls <span className="text-sky-400">posts/</span>
              </span>
            </div>
            <ul className="mt-3 space-y-1.5">
              {posts.map((post) => (
                <li key={post.slug}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group flex items-baseline gap-3"
                  >
                    <time
                      dateTime={post.metadata.publishedAt}
                      className="w-14 shrink-0 text-xs text-stone-600"
                    >
                      {fmtDate(post.metadata.publishedAt)}
                    </time>
                    <span className="flex-1 text-emerald-300 transition-colors group-hover:text-white">
                      {post.metadata.title}
                    </span>
                    <span className="shrink-0 text-xs text-stone-600">
                      {Math.ceil(post.readingTime.minutes)}m
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

            {/* RSS */}
            <div className="mt-6 flex items-center gap-2">
              <span className="text-emerald-400">❯</span>
              <span className="text-stone-400">
                open{' '}
                <Link
                  href="/rss.xml"
                  className="text-sky-400 transition-colors hover:text-sky-200"
                >
                  rss.xml
                </Link>
              </span>
            </div>

            {/* Cursor */}
            <div className="mt-4 flex items-center gap-2">
              <span className="text-emerald-400">❯</span>
              <span className="cursor-blink inline-block h-4 w-2 bg-stone-300" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
