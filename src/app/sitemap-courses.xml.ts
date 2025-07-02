import { client } from '@/sanity/lib/client';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const baseUrl = 'https://www.heyshinde.com';
  const courseSlugs = await client.fetch(`*[_type == "course"]{ "slug": slug.current, "updatedAt": _updatedAt }`);

  res.setHeader('Content-Type', 'application/xml');
  res.write('<?xml version="1.0" encoding="UTF-8"?>\n');
  res.write('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n');

  courseSlugs.forEach((doc: any) => {
    if (doc.slug) {
      res.write(`  <url>\n`);
      res.write(`    <loc>${baseUrl}/courses/${doc.slug}</loc>\n`);
      res.write(`    <lastmod>${new Date(doc.updatedAt).toISOString()}</lastmod>\n`);
      res.write(`    <changefreq>weekly</changefreq>\n`);
      res.write(`    <priority>0.7</priority>\n`);
      res.write(`  </url>\n`);
    }
  });

  res.write('</urlset>');
  res.end();
} 