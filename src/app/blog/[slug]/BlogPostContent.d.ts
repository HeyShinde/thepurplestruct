import React from 'react';

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

interface BlogPost {
    title: string;
    slug: { current: string };
    author: Author;
    categories: { _id: string; title: string }[];
    tags: string[];
    mainImage: SanityImage;
    excerpt: string;
    body: Array<any>;
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