'use client';

import { CalendarIcon, ClockIcon } from 'lucide-react';
import { MDXClient } from 'next-mdx-remote-client';
import type { SerializeResult } from 'next-mdx-remote-client/serialize';
import { Header } from '@/components/header';
import { components } from '@/components/mdx';
import { TableOfContents } from '@/components/table-of-contents';
import { baseUrl } from '@/lib/constants';
import { Metadata, Scope } from '../utils';

type ContentProps = {
  mdxSource: SerializeResult<Metadata, Scope>;
  slug: string;
  metadata: Metadata;
  scope: Scope;
};

export function BlogContent({
  mdxSource,
  metadata,
  scope,
  slug,
}: ContentProps) {
  if ('error' in mdxSource) {
    throw new Error(mdxSource.error.message, {
      cause: mdxSource.error,
    });
  }

  const { title, summary, publishedAt } = metadata;

  return (
    <>
      <Header />
      <section className="mx-auto grid-cols-[1fr_auto_1fr] xl:grid">
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'BlogPosting',
              headline: title,
              datePublished: publishedAt,
              dateModified: publishedAt,
              description: summary,
              image: `${baseUrl}/og?title=${encodeURIComponent(title)}`,
              url: `${baseUrl}/blog/${slug}`,
              author: {
                '@type': 'Person',
                name: 'Adriano de Azevedo',
              },
            }),
          }}
        />
        <header className="col-start-2 col-end-3 mx-auto prose prose-xl w-full px-4 py-12 prose-invert">
          <h1>{title}</h1>
          {summary && (
            <p className="text-left text-lg text-gray-300">{summary}</p>
          )}
          <div className="flex flex-wrap gap-4 text-sm text-gray-400">
            {publishedAt && (
              <time dateTime={publishedAt} className="flex items-center gap-2">
                <CalendarIcon className="size-4" />
                <span>{publishedAt.split('-').reverse().join('/')}</span>
              </time>
            )}

            {scope.readingTime && (
              <span className="flex items-center gap-2">
                <ClockIcon className="size-4" />
                <span>
                  {Math.round(scope.readingTime.minutes)} min. de leitura
                </span>
              </span>
            )}
          </div>
        </header>

        <article className="col-start-2 row-start-2 mx-auto prose prose-xl w-full px-4 pb-4 prose-invert prose-table:my-0">
          <MDXClient {...mdxSource} components={components} />
        </article>

        <aside className="col-start-3 row-start-2">
          <TableOfContents toc={scope.toc ?? []} />
        </aside>
      </section>
    </>
  );
}
