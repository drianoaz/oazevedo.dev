import type { MDXComponents } from 'mdx/types';
import CodeBlock from './components/ code-block';

const components: MDXComponents = {
  pre: CodeBlock,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
