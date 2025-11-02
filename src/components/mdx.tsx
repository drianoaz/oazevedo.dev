import type { MDXComponents } from 'next-mdx-remote-client';
import CodeBlock from './code-block';

export const components: MDXComponents = {
  pre: CodeBlock,
  table: (props: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="my-9 w-full overflow-x-auto">
      <table {...props} />
    </div>
  ),
};
