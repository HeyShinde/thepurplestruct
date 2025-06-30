import type { SanitySlug } from './common';

export interface Category {
    _id: string;
    _type: 'category';
    title: string;
    slug: SanitySlug;
    description?: string;
} 