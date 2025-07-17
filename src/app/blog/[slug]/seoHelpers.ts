import { urlFor } from '@/sanity/lib/image';
import type { BlogPost } from '@/types/blog';
import type { PortableTextBlock } from '@portabletext/types';

interface PortableTextChild {
  text: string;
}

export function portableTextToPlainText(blocks: PortableTextBlock[]) {
  if (!blocks) {
    return '';
  }
  return blocks
    .filter(block => block._type === 'block' && block.children)
    .map(block => (block.children as PortableTextChild[]).map((child) => child.text).join(''))
    .join('\n\n');
}

export function buildSeoData(post: BlogPost) {
  const postUrl = `https://www.thepurplestruct.com/blog/${post.slug.current}`;
  const imageUrl = post.mainImage ? urlFor(post.mainImage).url() : "";
  const homePageUrl = "https://www.thepurplestruct.com";
  const seoFriendlyTitle = post.title.replace(/\$.*?\$/g, '').replace(/\s+/g, ' ').trim();

  const blogPostJsonLd = {
    '@type': 'BlogPosting',
    '@id': `${postUrl}/#blogposting`,
    'isPartOf': {
      '@type': 'Blog',
      '@id': `${homePageUrl}/blog/#blog`,
      'name': 'The Purple Struct Blog',
      'publisher': {
        '@id': `${homePageUrl}/#person`
      }
    },
    headline: seoFriendlyTitle,
    description: post.excerpt,
    articleBody: portableTextToPlainText(post.body),
    wordCount: post.wordCount,
    keywords: post.keywords || post.tags || [],
    about: post.categories?.map(cat => ({ '@type': 'Thing', name: cat.title })) || [],
    image: {
      '@type': 'ImageObject',
      url: imageUrl,
      width: 1200,
      height: 630
    },
    author: {
      '@type': 'Person',
      '@id': `${homePageUrl}/#person`,
      name: post.author.name,
    },
    publisher: {
      '@id': `${homePageUrl}/#person`
    },
    url: postUrl,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
  };

  const breadcrumbJsonLd = {
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: homePageUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: `${homePageUrl}/blog`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: seoFriendlyTitle,
        item: postUrl,
      },
    ],
  };

  return {
    postUrl,
    imageUrl,
    homePageUrl,
    seoFriendlyTitle,
    blogPostJsonLd,
    breadcrumbJsonLd,
  };
} 