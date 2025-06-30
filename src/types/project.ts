import type { SanityImage } from './common';

export interface Tech {
    _key: string;
    name: string;
    icon?: string;
}

export interface Project {
    _id: string;
    _type: 'project';
    title: string;
    description: string;
    longDescription?: string;
    bulletPoints?: string[];
    techStack?: Tech[];
    src?: SanityImage;
    ctaText?: string;
    ctaLink?: string;
    keywords?: string[];
} 