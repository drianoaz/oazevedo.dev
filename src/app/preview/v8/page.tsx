import Link from 'next/link';
import type { CSSProperties } from 'react';
import { getBlogPostsMeta } from '@/app/blog/utils';

export default function HomeV8() {
  const posts = getBlogPostsMeta();

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-16">
      {/* Aurora blobs */}
      <div
        className="aurora-blob h-96 w-96 bg-violet-700/30"
        style={
          {
            top: '-5rem',
            left: '-4rem',
            '--aurora-duration': '11s',
            '--aurora-delay': '0s',
          } as CSSProperties
        }
      />
      <div
        className="aurora-blob h-72 w-72 bg-cyan-700/25"
        style={
          {
            top: '40%',
            right: '10%',
            '--aurora-duration': '14s',
            '--aurora-delay': '3s',
          } as CSSProperties
        }
      />
      <div
        className="aurora-blob h-80 w-80 bg-emerald-700/20"
        style={
          {
            bottom: '5rem',
            left: '20%',
            '--aurora-duration': '9s',
            '--aurora-delay': '6s',
          } as CSSProperties
        }
      />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-2xl">
        <header className="mb-14">
          <h1 className="text-3xl font-bold text-white">Adriano de Azevedo</h1>
          <p className="mt-2 text-stone-400">Frontend Developer</p>
        </header>

        <ul className="space-y-5">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                className="group flex items-center gap-4 rounded-xl border border-white/5 bg-white/5 px-5 py-4 backdrop-blur-sm transition-all hover:border-white/15 hover:bg-white/10"
              >
                <div className="flex-1">
                  <h2 className="font-semibold text-stone-100 transition-colors group-hover:text-white">
                    {post.metadata.title}
                  </h2>
                  <time
                    dateTime={post.metadata.publishedAt}
                    className="mt-1 block font-mono text-xs text-stone-500"
                  >
                    {post.metadata.publishedAt.split('-').reverse().join('/')}
                  </time>
                </div>
                <span className="shrink-0 font-mono text-xs text-stone-600">
                  {Math.ceil(post.readingTime.minutes)}m
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
