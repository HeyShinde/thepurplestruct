import type { Author } from './author';
import type { Category } from './category';
import type { PortableText, SanityImage, SanitySlug } from './common';

export interface SidebarPromo {
    title?: string;
    promoType?: 'image' | 'code';
    image?: SanityImage;
    imageLink?: string;
    altText?: string;
    code?: string;
    imageSource?: 'upload' | 'link';
    imageUrl?: string;
    sidebarRel?: 'follow' | 'nofollow' | 'sponsored' | 'ugc';
}

export interface BlogPost {
    _id: string;
    _type: 'blog';
    title: string;
    slug: SanitySlug;
    author: Author;
    categories: Category[];
    tags?: string[];
    keywords?: string[];
    mainImage: SanityImage;
    /**
     * Short summary of the post, used for meta description and SEO. Should be 150-160 chars.
     */
    excerpt: string;
    body: PortableText;
    wordCount?: number;
    publishedAt: string;
    updatedAt?: string;
    sidebarPromo?: SidebarPromo;
}

export type { SanityImage }; 