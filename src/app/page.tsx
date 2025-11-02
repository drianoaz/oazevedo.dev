import { CalendarIcon, ClockIcon } from 'lucide-react';
import Link from 'next/link';
import { Header } from '@/components/header';
import { getBlogPosts } from './blog/utils';

export default async function Home() {
  const posts = await getBlogPosts();

  return (
    <>
      <Header />
      <main className="mx-auto prose prose-xl space-y-20 px-4 py-12 prose-invert prose-h1:text-2xl">
        {posts.map((post) => {
          const { publishedAt } = post.metadata;
          return (
            <Link key={post.slug} href={`/blog/${post.slug}`}>
              <article>
                <h1>{post.metadata.title}</h1>

                <p className="text-left text-lg text-gray-300">
                  {post.metadata.summary}
                </p>
                <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                  {publishedAt && (
                    <time
                      dateTime={publishedAt}
                      className="flex items-center gap-2"
                    >
                      <CalendarIcon className="size-4" />
                      <span>{publishedAt.split('-').reverse().join('/')}</span>
                    </time>
                  )}

                  {post.scope.readingTime && (
                    <span className="flex items-center gap-2">
                      <ClockIcon className="size-4" />
                      <span>
                        {Math.round(post.scope.readingTime.minutes)} min. de
                        leitura
                      </span>
                    </span>
                  )}
                </div>
              </article>
            </Link>
          );
        })}
      </main>
    </>
  );
}
