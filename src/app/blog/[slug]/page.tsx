import React from 'react';
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import { Metadata } from 'next';
import BlogPostContent from '@/app/blog/[slug]/BlogPostContent';
import type { BlogPost } from '@/types/blog';

interface SidebarPromo {
    promoType?: "image" | "code";
    image?: SanityImage;
    imageLink?: string;
    altText?: string;
    code?: string;
}

interface SanityImage {
    asset: {
        _ref: string;
        _type: 'reference';
    };
    alt?: string;
}

interface SocialIcon {
    platform: string;
    url: string;
    icon: SanityImage;
}

interface Author {
    name: string;
    image: SanityImage | null;
    bio?: string;
    socialIcons?: SocialIcon[];
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
            socialIcons[]{
                platform,
                url,
                icon
            }
        },
        categories[]->{
            _id,
            title
        },
        tags,
        mainImage,
        excerpt,
        body,
        publishedAt,
        updatedAt,
        sidebarPromo {
            promoType,
            image,
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

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const post = await getPost(params.slug);
    if (!post) {
        return {
            title: "Post Not Found",
            description: "The requested blog post could not be found.",
        };
    }

    return {
        title: post.title,
        description: post.excerpt,
        openGraph: {
            title: post.title,
            description: post.excerpt,
            images: [post.mainImage ? urlFor(post.mainImage).url() : ""],
        },
    };
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
    console.log('BlogPost component params:', params);
    const post = await getPost(params.slug);
    return <BlogPostContent post={post} />;
}