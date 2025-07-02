import { client } from '@/sanity/lib/client';

type BlogPost = {
  title: string;
  slug: { current: string };
  excerpt?: string;
  publishedAt?: string;
  _updatedAt?: string;
};

export async function GET() {
  const baseUrl = 'https://www.heyshinde.com';
  const posts: BlogPost[] = await client.fetch(
    `*[_type == "blog"]|order(publishedAt desc)[0...20]{ title, slug, excerpt, publishedAt, _updatedAt }`
  );

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<rss version="2.0">\n<channel>\n`;
  xml += `<title>HeyShinde Blog</title>\n<link>${baseUrl}/blog</link>\n<description>Latest posts from HeyShinde</description>\n`;

  posts.forEach((post) => {
    xml += `<item>\n`;
    xml += `<title>${post.title}</title>\n`;
    xml += `<link>${baseUrl}/blog/${post.slug.current}</link>\n`;
    xml += `<description><![CDATA[${post.excerpt}]]></description>\n`;
    xml += `<pubDate>${new Date(post.publishedAt ?? '').toUTCString()}</pubDate>\n`;
    xml += `<guid>${baseUrl}/blog/${post.slug.current}</guid>\n`;
    xml += `</item>\n`;
  });

  xml += `</channel>\n</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml',
    },
  });
} 