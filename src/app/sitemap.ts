import { getBlogPosts } from '@/app/blog/utils';
import { baseUrl } from '@/lib/constants';

export default async function sitemap() {
  const blogs = (await getBlogPosts()).map((post) => {
    return {
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.metadata.publishedAt,
    };
  });

  const routes = [''].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
  }));

  return [...routes, ...blogs];
}
