import { client } from '@/sanity/lib/client';
import { NextResponse } from 'next/server';
import { renderHTMLContent } from '@/utils/feedRenderers';
import type { PortableTextBlock } from '@portabletext/types';

type BlogPost = {
  title: string;
  slug: { current: string };
  excerpt?: string;
  body?: PortableTextBlock[];
  publishedAt?: string;
  _updatedAt?: string;
  author?: { name: string };
  categories?: { title: string }[];
};
export async function GET() {
  const baseUrl = 'https://www.heyshinde.com';
  const posts: BlogPost[] = await client.fetch(`*[_type == "blog"]|order(publishedAt desc)[0...20]{ title, slug, excerpt, body, publishedAt, _updatedAt, author->{name}, categories[]->{title} }`);

  const items = posts.map((post) => {
    const url = `${baseUrl}/blog/${post.slug.current}`;
    const date_published = post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined;
    const author = post.author?.name ? { name: post.author.name } : undefined;
    const tags = post.categories?.map(cat => cat.title) || undefined;
    const summary = post.excerpt || undefined;
    const content_html = renderHTMLContent(post.body ?? [], url, post.categories) || undefined;
    return {
      id: url,
      title: post.title,
      url,
      summary,
      content_html,
      date_published,
      ...(author && { author }),
      ...(tags && tags.length > 0 && { tags }),
    };
  });

  const feed = {
    version: 'https://jsonfeed.org/version/1',
    title: 'HeyShinde Blog',
    home_page_url: `${baseUrl}/blog`,
    feed_url: `${baseUrl}/feed.json`,
    favicon: `${baseUrl}/favicon.ico`,
    items,
  };

  return NextResponse.json(feed);
} 