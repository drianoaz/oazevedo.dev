import createMDX from '@next/mdx';
import rehypeShiki from '@shikijs/rehype';
import {
  transformerMetaHighlight,
  transformerMetaWordHighlight,
} from '@shikijs/transformers';
import rehypeExtractToc from '@stefanprobst/rehype-extract-toc';
import rehypeExtractTocExport from '@stefanprobst/rehype-extract-toc/mdx';
import { NextConfig } from 'next';
import rehypeSlug from 'rehype-slug';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
import { transformerCodeBlock } from '@/lib/shiki/transformer-code-block';
import { transformerMetaDiff } from '@/lib/shiki/transformer-meta-diff';

const nextConfig: NextConfig = {
  pageExtensions: ['md', 'mdx', 'ts', 'tsx'],
};

const withMDX = createMDX({
  extension: /\.(md|mdx)$/,
  options: {
    remarkPlugins: [remarkGfm, remarkFrontmatter, remarkMdxFrontmatter],
    rehypePlugins: [
      rehypeSlug,
      rehypeExtractToc,
      // rehypeExtractTocExport,
      [rehypeExtractTocExport, { name: 'customExportName' }],
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
