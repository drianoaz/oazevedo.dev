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

function parseFrontmatter(source: string): Metadata {
  const match = source.match(/^---\n([\s\S]+?)\n---/);
  if (!match) {
    return { title: '', summary: '', publishedAt: '' };
  }

  const result: Record<string, string> = {};
  match[1].split('\n').forEach((line) => {
    const colon = line.indexOf(':');
    if (colon === -1) {
      return;
    }
    const key = line.slice(0, colon).trim();
    let value = line.slice(colon + 1).trim();
    if (/^['"]/.test(value)) {
      value = value.slice(1, -1);
    }
    result[key] = value;
  });

  return result as Metadata;
}

function estimateReadingTime(source: string) {
  const content = source.replace(/^---[\s\S]+?---/, '');
  const words = content.trim().split(/\s+/).length;
  const minutes = words / 200;
  return { minutes, words };
}

export function getBlogPostsMeta() {
  const dir = path.join(process.cwd(), 'src', 'app', 'blog', 'posts');
  return getMDXFiles(dir)
    .map((file) => {
      const source = readMDXFile(path.join(dir, file));
      const slug = path.basename(file, path.extname(file));
      const metadata = parseFrontmatter(source);
      const readingTime = estimateReadingTime(source);
      return { slug, metadata, readingTime };
    })
    .sort(
      (a, b) =>
        new Date(b.metadata.publishedAt).getTime() -
        new Date(a.metadata.publishedAt).getTime(),
    );
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
