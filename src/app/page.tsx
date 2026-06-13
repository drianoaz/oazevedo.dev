import Link from 'next/link';
import { getBlogPostsMeta } from './blog/utils';

const MONTHS = [
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

function formatDate(publishedAt: string) {
  const [, month, day] = publishedAt.split('-');
  return `${MONTHS[parseInt(month) - 1]} ${day}`;
}

export default function Home() {
  const posts = getBlogPostsMeta();

  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <section>
        <h1 className="text-3xl font-bold text-stone-100">
          Adriano de Azevedo
        </h1>
        <p className="mt-4 max-w-lg leading-relaxed text-stone-400">
          Desenvolvedor frontend. Aqui escrevo sobre JavaScript, TypeScript,
          React e tudo mais que acho interessante no desenvolvimento web.
        </p>
      </section>

      <section className="mt-16 font-mono text-sm">
        <p className="mb-4 flex items-center gap-2 select-none">
          <span className="text-green-400">adriano</span>
          <span className="text-stone-600">~/posts</span>
          <span className="text-stone-500">$</span>
          <span className="text-stone-300">ls -l</span>
        </p>

        <ul className="space-y-1">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                className="group flex items-baseline gap-4"
              >
                <time
                  dateTime={post.metadata.publishedAt}
                  className="w-14 shrink-0 text-stone-600"
                >
                  {formatDate(post.metadata.publishedAt)}
                </time>
                <span className="flex-1 text-stone-300 transition-colors group-hover:text-white">
                  {post.metadata.title}
                </span>
                <span className="shrink-0 text-stone-600">
                  {Math.ceil(post.readingTime.minutes)}min
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
