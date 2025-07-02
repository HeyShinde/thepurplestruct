import { client } from '@/sanity/lib/client';

type BlogPost = { slug: string; updatedAt?: string; };
type Category = { slug: string; updatedAt?: string; };

export async function GET() {
  const baseUrl = 'https://www.heyshinde.com';
  const postSlugs: BlogPost[] = await client.fetch(`*[_type == "blog"]{ "slug": slug.current, "updatedAt": _updatedAt }`);
  const categorySlugs: Category[] = await client.fetch(`*[_type == "category"]{ "slug": slug.current, "updatedAt": _updatedAt }`);

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  postSlugs.forEach((doc) => {
    if (doc.slug) {
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}/blog/${doc.slug}</loc>\n`;
      xml += `    <lastmod>${new Date(doc.updatedAt ?? '').toISOString()}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.8</priority>\n`;
      xml += `  </url>\n`;
    }
  });
  categorySlugs.forEach((doc) => {
    if (doc.slug) {
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}/blog/category/${doc.slug}</loc>\n`;
      xml += `    <lastmod>${new Date(doc.updatedAt ?? '').toISOString()}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.6</priority>\n`;
      xml += `  </url>\n`;
    }
  });

  xml += '</urlset>';

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
} 