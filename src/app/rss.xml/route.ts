import { client } from '@/sanity/lib/client';
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

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/">\n<channel>\n`;
  xml += `<title>ML x Dev by Shinde</title>\n<link>${baseUrl}/blog</link>\n<image>\n<url>${baseUrl}/favicon.ico</url>\n<title>HeyShinde Blog</title>\n<link>${baseUrl}/blog</link>\n</image>\n<description>Latest posts from HeyShinde</description>\n`;
  xml += `<icon>https://www.heyshinde.com/favicon.ico</icon>\n`;

  posts.forEach((post) => {
    const url = `${baseUrl}/blog/${post.slug.current}`;
    const pubDate = post.publishedAt ? new Date(post.publishedAt).toUTCString() : '';
    const author = post.author?.name ? {
      name: post.author.name,
      image: post.author.image ? urlFor(post.author.image).width(144).height(144).url() : undefined,
      bio: post.author.bio,
      socialLinks: post.author.socialLinks
    } : undefined;
    const categories = post.categories?.map(cat => `<category>${cat.title}</category>`).join('\n') || '';
    const excerpt = post.excerpt ? `<![CDATA[${post.excerpt}]]>` : '';
    const mainImageUrl = post.mainImage ? urlFor(post.mainImage).width(1200).height(630).url() : undefined;
    let content = renderHTMLContent(post.body ?? [], url, post.categories, author) ? `<![CDATA[${renderHTMLContent(post.body ?? [], url, post.categories, author)}]]>` : '';
    if (mainImageUrl) {
      content = `<![CDATA[<img src="${mainImageUrl}" alt="${post.title}" style="width:100%;max-width:1200px;height:auto;border-radius:16px;margin-bottom:1.5em;" />${content.replace('<![CDATA[','').replace(']]>','') }]]>`;
    }
    xml += `<item>\n`;
    xml += `<title>${post.title}</title>\n`;
    xml += `<link>${url}</link>\n`;
    xml += `<guid isPermaLink="true">${url}</guid>\n`;
    if (excerpt) xml += `<description>${excerpt}</description>\n`;
    if (content) xml += `<content:encoded>${content}</content:encoded>\n`;
    if (pubDate) xml += `<pubDate>${pubDate}</pubDate>\n`;
    if (author) xml += `<author>${author.name}</author>\n`;
    if (categories) xml += categories + '\n';
    xml += `</item>\n`;
  });

  xml += `</channel>\n</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml',
    },
  });
} 