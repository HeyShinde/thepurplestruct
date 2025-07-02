import { client } from '@/sanity/lib/client';

export async function GET() {
  const baseUrl = 'https://www.heyshinde.com';
  const posts = await client.fetch(`*[_type == "blog"]|order(publishedAt desc)[0...20]{ title, slug, excerpt, publishedAt, _updatedAt }`);

  const feed = {
    version: "https://jsonfeed.org/version/1",
    title: "HeyShinde Blog",
    home_page_url: `${baseUrl}/blog`,
    feed_url: `${baseUrl}/feed.json`,
    items: posts.map((post: any) => ({
      id: `${baseUrl}/blog/${post.slug.current}`,
      url: `${baseUrl}/blog/${post.slug.current}`,
      title: post.title,
      content_text: post.excerpt,
      date_published: new Date(post.publishedAt).toISOString(),
    })),
  };

  return new Response(JSON.stringify(feed, null, 2), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
} 