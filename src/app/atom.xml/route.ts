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

  let xml = `<?xml version="1.0" encoding="utf-8"?>\n`;
  xml += `<feed xmlns="http://www.w3.org/2005/Atom">\n`;
  xml += `<title>ML x Dev by Shinde</title>\n<link href="${baseUrl}/blog"/>\n<icon>${baseUrl}/favicon.ico</icon>\n<updated>${new Date(posts[0]?.publishedAt || Date.now()).toISOString()}</updated>\n<id>${baseUrl}/atom.xml</id>\n`;
  xml += `<icon>https://www.heyshinde.com/favicon.ico</icon>\n`;

  posts.forEach((post) => {
    const url = `${baseUrl}/blog/${post.slug.current}`;
    const updated = post.publishedAt ? new Date(post.publishedAt).toISOString() : '';
    const published = post.publishedAt ? new Date(post.publishedAt).toISOString() : '';
    const author = post.author?.name ? {
      name: post.author.name,
      image: post.author.image ? urlFor(post.author.image).width(144).height(144).url() : undefined,
      bio: post.author.bio,
      socialLinks: post.author.socialLinks
    } : undefined;
    const categories = post.categories?.map(cat => `<category term="${cat.title}" />`).join('\n') || '';
    const excerpt = post.excerpt ? `<![CDATA[${post.excerpt}]]>` : '';
    const mainImageUrl = post.mainImage ? urlFor(post.mainImage).width(1200).height(630).url() : undefined;
    let content = renderHTMLContent(post.body ?? [], url, post.categories, author) ? `<![CDATA[${renderHTMLContent(post.body ?? [], url, post.categories, author)}]]>` : '';
    if (mainImageUrl) {
      content = `<![CDATA[<img src="${mainImageUrl}" alt="${post.title}" style="width:100%;max-width:1200px;height:auto;border-radius:16px;margin-bottom:1.5em;" />${content.replace('<![CDATA[','').replace(']]>','') }]]>`;
    }
    xml += `<entry>\n`;
    xml += `<title>${post.title}</title>\n`;
    xml += `<link href="${url}"/>\n`;
    xml += `<id>${url}</id>\n`;
    if (updated) xml += `<updated>${updated}</updated>\n`;
    if (published) xml += `<published>${published}</published>\n`;
    if (excerpt) xml += `<summary>${excerpt}</summary>\n`;
    if (content) xml += `<content type="html">${content}</content>\n`;
    if (author) xml += `<author><name>${author.name}</name><img src="${author.image}" alt="${author.name}" /></author>\n`;
    if (categories) xml += categories + '\n';
    xml += `</entry>\n`;
  });

  xml += `</feed>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/atom+xml',
    },
  });
} 