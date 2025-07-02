import { client } from '@/sanity/lib/client';
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

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/">\n<channel>\n`;
  xml += `<title>HeyShinde Blog</title>\n<link>${baseUrl}/blog</link>\n<image>\n<url>${baseUrl}/favicon.ico</url>\n<title>HeyShinde Blog</title>\n<link>${baseUrl}/blog</link>\n</image>\n<description>Latest posts from HeyShinde</description>\n`;
  xml += `<icon>https://www.heyshinde.com/favicon.ico</icon>\n`;

  posts.forEach((post) => {
    const url = `${baseUrl}/blog/${post.slug.current}`;
    const pubDate = post.publishedAt ? new Date(post.publishedAt).toUTCString() : '';
    const author = post.author?.name ? `<author>${post.author.name}</author>\n` : '';
    const categories = post.categories?.map(cat => `<category>${cat.title}</category>`).join('\n') || '';
    const excerpt = post.excerpt ? `<![CDATA[${post.excerpt}]]>` : '';
    const content = renderHTMLContent(post.body ?? [], url, post.categories) ? `<![CDATA[${renderHTMLContent(post.body ?? [], url, post.categories)}]]>` : '';
    xml += `<item>\n`;
    xml += `<title>${post.title}</title>\n`;
    xml += `<link>${url}</link>\n`;
    xml += `<guid isPermaLink="true">${url}</guid>\n`;
    if (excerpt) xml += `<description>${excerpt}</description>\n`;
    if (content) xml += `<content:encoded>${content}</content:encoded>\n`;
    if (pubDate) xml += `<pubDate>${pubDate}</pubDate>\n`;
    if (author) xml += author;
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