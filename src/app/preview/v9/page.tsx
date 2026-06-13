import Link from 'next/link';
import { getBlogPostsMeta } from '@/app/blog/utils';

export default function HomeV9() {
  const posts = getBlogPostsMeta();

  return (
    <main
      className="min-h-screen px-4 py-16 font-mono"
      style={{ background: '#030a05' }}
    >
      <div className="mx-auto max-w-2xl">
        <header className="mb-10">
          <p
            className="text-xs opacity-50"
            style={{ color: '#00ff41' }}
          >
            root@adriano:~ #
          </p>
          <h1
            className="mt-1 text-xl font-bold"
            style={{
              color: '#00ff41',
              textShadow: '0 0 20px #00ff41',
            }}
          >
            blog --list
          </h1>
        </header>

        <ul className="space-y-2">
          {posts.map((post, i) => (
            <li key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                className="group flex items-baseline gap-4 py-1.5"
              >
                <span
                  className="w-5 shrink-0 text-xs"
                  style={{ color: '#005c1a' }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span
                  className="flex-1 text-sm transition-all"
                  style={{
                    color: '#00cc34',
                    textShadow: '0 0 6px #00cc3440',
                  }}
                >
                  <span className="transition-[text-shadow] group-hover:text-white">
                    {post.metadata.title}
                  </span>
                </span>
                <time
                  dateTime={post.metadata.publishedAt}
                  className="shrink-0 text-xs"
                  style={{ color: '#004d15' }}
                >
                  {post.metadata.publishedAt.split('-').reverse().join('/')}
                </time>
              </Link>
            </li>
          ))}
        </ul>

        <p
          className="mt-8 flex items-center gap-2 text-xs"
          style={{ color: '#005c1a' }}
        >
          <span style={{ color: '#00ff41' }}>$</span>
          <span className="cursor-blink inline-block h-3.5 w-2" style={{ background: '#00ff41' }} />
        </p>
      </div>
    </main>
  );
}
