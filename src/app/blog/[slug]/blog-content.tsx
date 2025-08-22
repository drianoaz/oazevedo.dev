'use client';

import { MDXClient } from 'next-mdx-remote-client';
import type { SerializeResult } from 'next-mdx-remote-client/serialize';
import { components } from '@/components/mdx';

type ContentProps = {
  mdxSource: SerializeResult;
};

export function BlogContent({ mdxSource }: ContentProps) {
  if ('error' in mdxSource) {
    throw new Error(mdxSource.error.message, {
      cause: mdxSource.error,
    });
  }

  return (
    <article className="mx-auto prose prose-xl px-4 py-12 prose-invert">
      <MDXClient {...mdxSource} components={components} />
    </article>
  );
}
