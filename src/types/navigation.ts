import type { SanitySlug } from './common';

export type ShowOn = 'both' | 'mobile' | 'desktop';

export interface NavItem {
    _key: string;
    title: string;
    href: string;
    show: ShowOn;
}

export interface Navigation {
    _id: string;
    _type: 'navigation';
    title: string;
    slug: SanitySlug;
    items?: NavItem[];
} 