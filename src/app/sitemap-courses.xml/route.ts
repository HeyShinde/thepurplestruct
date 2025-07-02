import { client } from '@/sanity/lib/client';

type Course = { slug: string; updatedAt?: string; };

export async function GET() {
  const baseUrl = 'https://www.heyshinde.com';
  const courseSlugs: Course[] = await client.fetch(`*[_type == "course"]{ "slug": slug.current, "updatedAt": _updatedAt }`);

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  courseSlugs.forEach((doc) => {
    if (doc.slug) {
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}/courses/${doc.slug}</loc>\n`;
      xml += `    <lastmod>${new Date(doc.updatedAt ?? '').toISOString()}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.7</priority>\n`;
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