import { client } from '@/sanity/lib/client';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const baseUrl = 'https://www.heyshinde.com';
  const postSlugs = await client.fetch(`*[_type == "blog"]{ "slug": slug.current, "updatedAt": _updatedAt }`);
  const categorySlugs = await client.fetch(`*[_type == "category"]{ "slug": slug.current, "updatedAt": _updatedAt }`);

  res.setHeader('Content-Type', 'application/xml');
  res.write('<?xml version="1.0" encoding="UTF-8"?>\n');
  res.write('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n');

  postSlugs.forEach((doc: any) => {
    if (doc.slug) {
      res.write(`  <url>\n`);
      res.write(`    <loc>${baseUrl}/blog/${doc.slug}</loc>\n`);
      res.write(`    <lastmod>${new Date(doc.updatedAt).toISOString()}</lastmod>\n`);
      res.write(`    <changefreq>weekly</changefreq>\n`);
      res.write(`    <priority>0.8</priority>\n`);
      res.write(`  </url>\n`);
    }
  });
  categorySlugs.forEach((doc: any) => {
    if (doc.slug) {
      res.write(`  <url>\n`);
      res.write(`    <loc>${baseUrl}/blog/category/${doc.slug}</loc>\n`);
      res.write(`    <lastmod>${new Date(doc.updatedAt).toISOString()}</lastmod>\n`);
      res.write(`    <changefreq>weekly</changefreq>\n`);
      res.write(`    <priority>0.6</priority>\n`);
      res.write(`  </url>\n`);
    }
  });

  res.write('</urlset>');
  res.end();
} 