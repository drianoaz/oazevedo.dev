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
import emoji from 'remark-emoji';
import remarkFlexibleToc, { TocItem } from 'remark-flexible-toc';
import remarkGfm from 'remark-gfm';
import readingTime from 'remark-reading-time';
import { transformerCodeBlock } from '@/lib/shiki/transformer-code-block';
import { transformerMetaDiff } from '@/lib/shiki/transformer-meta-diff';

function getMDXFiles(dir: string) {
  if (!fs.existsSync(dir)) {
    return [];
  }

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

      validateMetadata(file, mdxSource.frontmatter);

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

function validateMetadata(file: string, metadata: Partial<Metadata>) {
  for (const field of ['title', 'summary', 'publishedAt'] as const) {
    if (!metadata[field]) {
      throw new Error(`${file}: missing frontmatter field "${field}"`);
    }
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(metadata.publishedAt))) {
    throw new Error(`${file}: "publishedAt" must be in the YYYY-MM-DD format`);
  }

  if (metadata.draft !== undefined && typeof metadata.draft !== 'boolean') {
    throw new Error(`${file}: "draft" must be true or false`);
  }
}

export async function getBlogPosts() {
  const dir =
    process.env.BLOG_POSTS_DIR ??
    path.join(process.cwd(), 'src', 'app', 'blog', 'posts');
  const posts = await getMDXData(dir);

  return posts
    .filter((post) => {
      return process.env.NODE_ENV !== 'production' || !post.metadata.draft;
    })
    .sort((a, b) => {
      return b.metadata.publishedAt.localeCompare(a.metadata.publishedAt);
    });
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
  draft?: boolean;
};

function serializeMDX(source: string) {
  const options: EvaluateOptions = {
    mdxOptions: {
      remarkPlugins: [
        remarkGfm,
        readingTime,
        emoji,
        [remarkFlexibleToc, { maxDepth: 3 }],
      ],
      rehypePlugins: [
        [
          rehypeShiki,
          {
            themes: {
              dark: 'dark-plus',
            },
            defaultColor: 'dark',
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
