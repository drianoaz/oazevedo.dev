import Link from 'next/link';
import { getBlogPostsMeta } from '@/app/blog/utils';

export default function HomeV11() {
  const posts = getBlogPostsMeta();

  return (
    <main className="mx-auto max-w-3xl px-4 py-20">
      <ul className="space-y-2">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/blog/${post.slug}`}
              className="group block text-4xl font-black leading-tight tracking-tight text-stone-700 transition-colors hover:text-white"
            >
              {post.metadata.title}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
