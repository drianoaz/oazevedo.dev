import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { baseUrl, siteName } from '@/lib/constants';
import { getBlogPosts } from '../utils';
import { BlogContent } from './blog-content';

export async function generateStaticParams() {
  const posts = await getBlogPosts();

  return posts.map((post) => {
    return {
      slug: post.slug,
    };
  });
}

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const post = (await getBlogPosts()).find((post) => {
    return post.slug === slug;
  });

  if (!post) {
    throw new Error('Post not found');
  }

  const {
    title,
    publishedAt: publishedTime,
    summary: description,
  } = post.metadata;

  const ogImage = `${baseUrl}/og?title=${encodeURIComponent(title)}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime,
      url: `${baseUrl}/blog/${post.slug}`,
      siteName,
      images: [
        {
          url: ogImage,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function Blog({ params }: Props) {
  const { slug } = await params;

  const post = (await getBlogPosts()).find((post) => {
    return post.slug === slug;
  });

  if (!post) {
    notFound();
  }

  return <BlogContent {...post} />;
}
