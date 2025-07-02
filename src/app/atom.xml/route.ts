import { client } from '@/sanity/lib/client';

export async function GET() {
  const baseUrl = 'https://www.heyshinde.com';
  const posts = await client.fetch(`*[_type == "blog"]|order(publishedAt desc)[0...20]{ title, slug, excerpt, publishedAt, _updatedAt }`);

  let xml = `<?xml version="1.0" encoding="utf-8"?>\n`;
  xml += `<feed xmlns="http://www.w3.org/2005/Atom">\n`;
  xml += `<title>HeyShinde Blog</title>\n<link href="${baseUrl}/blog"/>\n<updated>${new Date(posts[0]?.publishedAt || Date.now()).toISOString()}</updated>\n<id>${baseUrl}/atom.xml</id>\n`;

  posts.forEach((post: any) => {
    xml += `<entry>\n`;
    xml += `<title>${post.title}</title>\n`;
    xml += `<link href="${baseUrl}/blog/${post.slug.current}"/>\n`;
    xml += `<id>${baseUrl}/blog/${post.slug.current}</id>\n`;
    xml += `<updated>${new Date(post.publishedAt).toISOString()}</updated>\n`;
    xml += `<summary><![CDATA[${post.excerpt}]]></summary>\n`;
    xml += `</entry>\n`;
  });

  xml += `</feed>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/atom+xml',
    },
  });
} 