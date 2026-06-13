import Link from 'next/link';
import { getBlogPostsMeta } from '@/app/blog/utils';

export default function HomeV18() {
  const posts = getBlogPostsMeta();

  return (
    <main className="min-h-[calc(100vh-8rem)] lg:grid lg:grid-cols-[20rem_1fr]">
      {/* Left panel — bio */}
      <aside className="flex flex-col justify-center border-b border-stone-800 px-8 py-12 lg:border-b-0 lg:border-r lg:py-16">
        <div>
          <h1 className="text-xl font-bold text-stone-100">
            Adriano de Azevedo
          </h1>
          <p className="mt-2 text-sm text-stone-500">Frontend Developer</p>
          <p className="mt-4 text-sm leading-relaxed text-stone-600">
            Escrevo sobre JavaScript, TypeScript, React e desenvolvimento web
            moderno.
          </p>
          <a
            href="mailto:contato@adriano.dev"
            className="mt-6 block text-xs text-stone-600 transition-colors hover:text-stone-300"
          >
            contato@adriano.dev
          </a>
          <Link
            href="/rss.xml"
            className="mt-2 block text-xs text-stone-600 transition-colors hover:text-stone-300"
          >
            RSS Feed
          </Link>
        </div>
      </aside>

      {/* Right panel — posts */}
      <div className="flex flex-col justify-center px-8 py-12 lg:py-16">
        <p className="mb-8 font-mono text-xs uppercase tracking-widest text-stone-600">
          Publicações
        </p>
        <ul className="space-y-7">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                className="group block"
              >
                <h2 className="font-semibold text-stone-200 transition-colors group-hover:text-white">
                  {post.metadata.title}
                </h2>
                <p className="mt-1 line-clamp-1 text-sm text-stone-500">
                  {post.metadata.summary}
                </p>
                <div className="mt-2 flex gap-3 font-mono text-xs text-stone-700">
                  <time dateTime={post.metadata.publishedAt}>
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
