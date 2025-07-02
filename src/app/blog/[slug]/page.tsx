import React from 'react';
import { client } from '@/sanity/lib/client';
import { Metadata } from 'next';
import BlogPostContent from '@/app/blog/[slug]/BlogPostContent';
import type { BlogPost } from '@/types/blog';
import { buildSeoData } from './seoHelpers';
import { notFound } from 'next/navigation';

async function getPost(slug: string) {
    // console.log('Fetching post with slug:', slug);
    const query = `*[_type == "blog" && slug.current == $slug][0] {
        _id,
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
        // console.log('Fetched post:', post);
        if (!post) {
            // console.log('No post found for slug:', slug);
            return null;
        }
        return post;
    } catch {
        // console.error('Error fetching post:', error);
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
    const { postUrl, imageUrl, seoFriendlyTitle } = buildSeoData(post);
    return {
        title: seoFriendlyTitle,
        description: post.excerpt,
        keywords: post.keywords || post.tags || [],
        alternates: {
            canonical: postUrl,
        },
        openGraph: {
            title: seoFriendlyTitle,
            description: post.excerpt,
            url: postUrl,
            images: [
                {
                    url: imageUrl,
                    width: 1200,
                    height: 630,
                    alt: seoFriendlyTitle,
                },
            ],
            type: 'article',
            publishedTime: post.publishedAt,
            modifiedTime: post.updatedAt || post.publishedAt,
            authors: [post.author.name],
        },
        twitter: {
            card: 'summary_large_image',
            title: seoFriendlyTitle,
            description: post.excerpt,
            images: [imageUrl],
        },
        // Note: JSON-LD is now injected in the page, not here
    };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = await getPost(slug);
    if (!post) return notFound();
    const { blogPostJsonLd, breadcrumbJsonLd } = buildSeoData(post);
    return (
        <>
            <BlogPostContent post={post} />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@graph": [blogPostJsonLd, breadcrumbJsonLd]
                    }),
                }}
            />
        </>
    );
}