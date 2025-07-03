import { client } from '@/sanity/lib/client';
import { NextResponse } from 'next/server';
import { renderHTMLContent } from '@/utils/feedRenderers';
import type { PortableTextBlock } from '@portabletext/types';
import { urlFor } from '@/sanity/lib/image';
import type { SanityImage } from '@/types/common';

type BlogPost = {
  title: string;
  slug: { current: string };
  excerpt?: string;
  body?: PortableTextBlock[];
  publishedAt?: string;
  _updatedAt?: string;
  mainImage?: SanityImage;
  author?: {
    name: string;
    image?: SanityImage;
    bio?: string;
    socialLinks?: { platform: string; url: string }[];
  };
  categories?: { title: string }[];
};
export async function GET() {
  const baseUrl = 'https://www.heyshinde.com';
  const posts: BlogPost[] = await client.fetch(`*[_type == "blog"]|order(publishedAt desc)[0...20]{ title, slug, excerpt, body, publishedAt, _updatedAt, mainImage, author->{name, image, bio, socialLinks}, categories[]->{title} }`);

  const items = posts.map((post) => {
    const url = `${baseUrl}/blog/${post.slug.current}`;
    const date_published = post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined;
    const author = post.author?.name ? {
      name: post.author.name,
      image: post.author.image ? urlFor(post.author.image).width(144).height(144).url() : undefined,
      bio: post.author.bio,
      socialLinks: post.author.socialLinks
    } : undefined;
    const tags = post.categories?.map(cat => cat.title) || undefined;
    const summary = post.excerpt || undefined;
    const mainImageUrl = post.mainImage ? urlFor(post.mainImage).width(1200).height(630).url() : undefined;
    let content_html = renderHTMLContent(post.body ?? [], url, post.categories, author) || undefined;
    if (mainImageUrl) {
      content_html = `<img src="${mainImageUrl}" alt="${post.title}" style="width:100%;max-width:1200px;height:auto;border-radius:16px;margin-bottom:1.5em;" />` + (content_html || '');
    }
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
    title: 'ML x Dev by Shinde',
    home_page_url: `${baseUrl}/blog`,
    feed_url: `${baseUrl}/feed.json`,
    favicon: `${baseUrl}/favicon.ico`,
    items,
  };

  return NextResponse.json(feed);
} 