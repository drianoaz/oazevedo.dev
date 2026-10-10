import { Feed } from 'feed';
import { baseUrl, siteName } from '@/lib/constants';
import { getBlogPosts } from '../blog/utils';

export const dynamic = 'force-static';

export async function GET() {
  const feed = new Feed({
    title: `${siteName} - RSS Feed`,
    description: 'Artigos sobre desenvolvimento frontend moderno.',
    id: baseUrl,
    link: baseUrl,
    language: 'pt-BR',
    image: `${baseUrl}/og?title=${encodeURIComponent(siteName)}`,
    favicon: `${baseUrl}/icon.svg`,
    copyright: `Todos os direitos reservados ${new Date().getFullYear()}, Adriano de Azevedo`,
    author: {
      name: 'Adriano de Azevedo',
      email: 'contato@adriano.dev',
      link: baseUrl,
    },
  });

  const posts = await getBlogPosts();

  posts.forEach((post) => {
    feed.addItem({
      title: post.metadata.title,
      id: `${baseUrl}/blog/${post.slug}`,
      link: `${baseUrl}/blog/${post.slug}`,
      image: {
        url: `${baseUrl}/og?title=${encodeURIComponent(post.metadata.title)}`,
        type: 'image/png',
      },
      description: post.metadata.summary,
      date: new Date(post.metadata.publishedAt),
    });
  });

  return new Response(feed.rss2(), {
    headers: {
      'Content-Type': 'text/xml',
    },
  });
}
