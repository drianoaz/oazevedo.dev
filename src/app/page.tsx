import Link from 'next/link';
import { getBlogPosts } from './blog/utils';

export default async function Home() {
  const posts = await getBlogPosts();

  return (
    <section className="mx-auto prose prose-xl w-full max-w-3xl px-4 py-12 prose-invert xl:col-start-2 xl:w-[65ch] xl:max-w-none">
      {posts.length === 0 ? (
        <p>Nenhum post publicado ainda.</p>
      ) : (
        <ul className="list-none p-0">
          {posts.map(({ slug, metadata }) => (
            <li key={slug} className="p-0">
              <h2 className="mb-2">
                <Link href={`/blog/${slug}`} className="no-underline">
                  {metadata.title}
                </Link>
                {metadata.draft && (
                  <span className="ml-3 align-middle text-sm font-normal text-amber-400">
                    Rascunho
                  </span>
                )}
              </h2>
              <time
                dateTime={metadata.publishedAt}
                className="text-sm text-gray-400"
              >
                {metadata.publishedAt.split('-').reverse().join('/')}
              </time>
              <p className="mt-2 text-gray-300">{metadata.summary}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
