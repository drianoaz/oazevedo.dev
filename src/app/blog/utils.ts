import fs from 'fs';
import path from 'path';
import rehypeShiki from '@shikijs/rehype';
import {
  transformerMetaHighlight,
  transformerMetaWordHighlight,
} from '@shikijs/transformers';
import type { EvaluateOptions } from 'next-mdx-remote-client/rsc';
import { serialize } from 'next-mdx-remote-client/serialize';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';
import remarkFlexibleToc, { TocItem } from 'remark-flexible-toc';
import remarkGfm from 'remark-gfm';
import readingTime from 'remark-reading-time';
import { transformerCodeBlock } from '@/lib/shiki/transformer-code-block';
import { transformerMetaDiff } from '@/lib/shiki/transformer-meta-diff';

function getMDXFiles(dir: string) {
  return fs.readdirSync(dir).filter((file) => {
    return path.extname(file) === '.mdx';
  });
}

function readMDXFile(filePath: string) {
  return fs.readFileSync(filePath, 'utf-8');
}

async function getMDXData(dir: string) {
  const mdxFiles = getMDXFiles(dir);

  const posts = await Promise.all(
    mdxFiles.map(async (file) => {
      const content = readMDXFile(path.join(dir, file));
      const slug = path.basename(file, path.extname(file));
      const mdxSource = await serializeMDX(content);

      return {
        content,
        slug,
        mdxSource,
        metadata: mdxSource.frontmatter,
        scope: mdxSource.scope,
      };
    }),
  );

  return posts;
}

export function getBlogPosts() {
  return getMDXData(path.join(process.cwd(), 'src', 'app', 'blog', 'posts'));
}

export type Scope = {
  toc?: TocItem[];
  readingTime?: {
    text: string;
    minutes: number;
    time: number;
    words: number;
  };
};

export type Metadata = {
  title: string;
  summary: string;
  publishedAt: string;
};

function serializeMDX(source: string) {
  const options: EvaluateOptions = {
    mdxOptions: {
      remarkPlugins: [
        remarkGfm,
        [remarkFlexibleToc, { maxDepth: 3 }],
        readingTime,
      ],
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
        [rehypeSlug],
        [
          rehypeAutolinkHeadings,
          {
            behavior: 'wrap',
            headingProperties: {
              className: 'scroll-mt-6',
            },
            properties: {
              target: '_self',
              className: 'linked-heading no-underline',
            },
          },
        ],
      ],
    },
    parseFrontmatter: true,
    vfileDataIntoScope: ['toc', 'readingTime'],
  };

  return serialize<Metadata, Scope>({
    source,
    options,
  });
}
