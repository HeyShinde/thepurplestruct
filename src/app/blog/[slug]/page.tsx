import React from 'react';
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import { Metadata } from 'next';
import BlogPostContent from '@/app/blog/[slug]/BlogPostContent';
import type { BlogPost } from '@/types/blog';
import type { PortableTextBlock } from '@portabletext/types';

interface PortableTextChild {
  text: string;
}

function portableTextToPlainText(blocks: PortableTextBlock[]) {
    if (!blocks) {
      return '';
    }
    return blocks
      .filter(block => block._type === 'block' && block.children)
      .map(block => (block.children as PortableTextChild[]).map((child) => child.text).join(''))
      .join('\n\n');
}

async function getPost(slug: string) {
    console.log('Fetching post with slug:', slug);
    
    const query = `*[_type == "blog" && slug.current == $slug][0] {
        title,
        slug,
        author->{
            name,
            image,
            bio,
            socialLinks[]{
                platform,
                url
            }
        },
        categories[]->{
            _id,
            title,
            "slug": slug.current
        },
        tags,
        mainImage,
        excerpt,
        body,
        wordCount,
        publishedAt,
        updatedAt,
        keywords,
        sidebarPromo {
            promoType,
            imageSource,
            image,
            imageUrl,
            imageLink,
            altText,
            code
        }
    }`;

    try {
        const post = await client.fetch<BlogPost>(query, { slug });
        console.log('Fetched post:', post);
        
        if (!post) {
            console.log('No post found for slug:', slug);
            return null;
        }
        
        return post;
    } catch (error) {
        console.error('Error fetching post:', error);
        return null;
    }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const post = await getPost(slug);
    
    if (!post) {
        return {
            title: "Post Not Found",
            description: "The requested blog post could not be found.",
        };
    }

    const postUrl = `https://www.heyshinde.com/blog/${post.slug.current}`;
    const imageUrl = post.mainImage ? urlFor(post.mainImage).url() : "";
    const homePageUrl = "https://www.heyshinde.com";

    // Create SEO-friendly title by removing LaTeX syntax
    const seoFriendlyTitle = post.title.replace(/\$.*?\$/g, '').replace(/\s+/g, ' ').trim();

    const blogPostJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        '@id': `${postUrl}/#blogposting`,
        'isPartOf': {
            '@type': 'Blog',
            '@id': `${homePageUrl}/blog/#blog`,
            'name': 'HeyShinde Blog',
            'publisher': {
                '@id': `${homePageUrl}/#person`
            }
        },
        headline: seoFriendlyTitle, // Use SEO-friendly title for structured data
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
      '@context': 'https://schema.org',
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
          name: seoFriendlyTitle, // Use SEO-friendly title for breadcrumbs
          item: postUrl,
        },
      ],
    };

    return {
        title: seoFriendlyTitle, // Use SEO-friendly title for search results
        description: post.excerpt,
        keywords: post.keywords || post.tags || [],
        alternates: {
            canonical: postUrl,
        },
        openGraph: {
            title: seoFriendlyTitle, // Use SEO-friendly title for social sharing
            description: post.excerpt,
            url: postUrl,
            images: [
                {
                    url: imageUrl,
                    width: 1200,
                    height: 630,
                    alt: seoFriendlyTitle, // Use SEO-friendly title for alt text
                },
            ],
            type: 'article',
            publishedTime: post.publishedAt,
            modifiedTime: post.updatedAt || post.publishedAt,
            authors: [post.author.name],
        },
        twitter: {
            card: 'summary_large_image',
            title: seoFriendlyTitle, // Use SEO-friendly title for Twitter
            description: post.excerpt,
            images: [imageUrl],
        },
        other: {
            "application/ld+json": JSON.stringify([blogPostJsonLd, breadcrumbJsonLd]),
        }
    };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
    console.log('BlogPost component params:', params);
    const { slug } = await params;
    const post = await getPost(slug);
    return <BlogPostContent post={post} />;
}