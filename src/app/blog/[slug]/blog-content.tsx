'use client';

import { MDXClient } from 'next-mdx-remote-client';
import type { SerializeResult } from 'next-mdx-remote-client/serialize';
import { components } from '@/components/mdx';
import { TableOfContents } from '@/components/table-of-contents';
import { Frontmatter, Scope } from '../utils';

type ContentProps = {
  mdxSource: SerializeResult<Frontmatter, Scope>;
};

export function BlogContent({ mdxSource }: ContentProps) {
  if ('error' in mdxSource) {
    throw new Error(mdxSource.error.message, {
      cause: mdxSource.error,
    });
  }

  return (
    <div className="mx-auto md:grid md:grid-cols-[1fr_auto_1fr] md:items-start md:justify-end">
      <div className="max-md:hidden"></div>

      <article className="mx-auto prose prose-xl p-4 prose-invert">
        <MDXClient {...mdxSource} components={components} />
      </article>

      <TableOfContents toc={mdxSource.scope.toc ?? []} />
    </div>
  );
}
