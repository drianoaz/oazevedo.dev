import type { MDXComponents } from 'next-mdx-remote-client';
import CodeBlock from './code-block';

export const components: MDXComponents = {
  pre: CodeBlock,
};
