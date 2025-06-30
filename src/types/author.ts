import type { SanityImage, SanitySlug } from './common';

export interface SocialLink {
    platform: 'linkedin' | 'github' | 'kaggle' | 'codersrank' | 'x';
    url: string;
    _key: string;
}

export interface Author {
    _id: string;
    _type: 'author';
    name: string;
    slug: SanitySlug;
    image?: SanityImage;
    bio?: string;
    socialLinks?: SocialLink[];
} 