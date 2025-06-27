import React from 'react';
import type { PortableTextBlock } from '@portabletext/types';

interface SanityImage {
    asset: {
        _ref: string;
        _type: 'reference';
    };
    alt?: string;
}

interface SocialLink {
    platform: string;
    url: string;
}

interface Author {
    name: string;
    image: SanityImage | null;
    bio?: string;
    socialLinks?: SocialLink[];
}

interface BlogPost {
    title: string;
    slug: { current: string };
    author: Author;
    categories: { _id: string; title: string }[];
    tags: string[];
    mainImage: SanityImage;
    excerpt: string;
    body: PortableTextBlock[];
    publishedAt: string;
    updatedAt?: string;
    sidebarPromo?: {
        promoType?: "image" | "code";
        image?: SanityImage;
        imageLink?: string;
        altText?: string;
        code?: string;
    };
}

declare const BlogPostContent: React.FC<{ post: BlogPost | null }>;
export default BlogPostContent; 