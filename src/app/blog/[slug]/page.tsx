import { notFound } from 'next/navigation';
import { getBlogPosts, serializeMDX } from '../utils';
import { BlogContent } from './blog-content';

export async function generateStaticParams() {
  const posts = await getBlogPosts();

  return posts.map((post) => {
    return {
      slug: post.slug,
    };
  });
}

type BlogProps = {
  params: Promise<{ slug: string }>;
};

export default async function Blog({ params }: BlogProps) {
  const { slug } = await params;
  const post = (await getBlogPosts()).find((post) => post.slug === slug);

  if (!post) {
    notFound();
  }

  const mdxSource = await serializeMDX(post.content);

  return <BlogContent mdxSource={mdxSource} />;
}
