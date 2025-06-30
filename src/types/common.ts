import type { PortableTextBlock } from '@portabletext/types';

export interface SanityImage {
    _type: 'image';
    asset: {
        _ref: string;
        _type: 'reference';
    };
    alt?: string;
}

export interface SanitySlug {
    _type: 'slug';
    current: string;
}

export interface SanityFile {
    _type: 'file';
    asset: {
        _ref: string;
        _type: 'reference';
    };
}

export type PortableText = PortableTextBlock[]; 