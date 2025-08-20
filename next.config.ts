import createMDX from '@next/mdx';
import rehypeShiki from '@shikijs/rehype';
import {
  transformerMetaHighlight,
  transformerMetaWordHighlight,
} from '@shikijs/transformers';
import { NextConfig } from 'next';
import remarkGfm from 'remark-gfm';
import { transformerCodeBlock } from '@/lib/shiki/transformer-code-block';
import { transformerMetaDiff } from '@/lib/shiki/transformer-meta-diff';

const nextConfig: NextConfig = {
  pageExtensions: ['md', 'mdx', 'ts', 'tsx'],
};

const withMDX = createMDX({
  extension: /\.(md|mdx)$/,
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      [
        rehypeShiki,
        {
          theme: 'dark-plus',
          inline: 'tailing-curly-colon',
          transformers: [
            transformerMetaDiff(),
            transformerMetaWordHighlight(),
            transformerMetaHighlight(),
            transformerCodeBlock(),
          ],
        },
      ],
    ],
  },
});

export default withMDX(nextConfig);
