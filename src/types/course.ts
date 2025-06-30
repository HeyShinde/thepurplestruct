import type { Author } from './author';
import type { Section } from './section';
import type { SanityImage, SanitySlug } from './common';

export type EducationalLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
export type Language = 'en-US' | 'es';
export type CourseMode = 'online' | 'self-paced' | 'distance learning';

export interface Course {
    _id: string;
    _type: 'course';
    title: string;
    slug: SanitySlug;
    description?: string;
    price?: number;
    isFree?: boolean;
    image?: SanityImage;
    keywords?: string[];
    sections?: Section[];
    tutor?: Author;
    whatYouWillLearn?: string[];
    requirements?: string[];
    badges?: string[];
    educationalLevel?: EducationalLevel;
    courseCode?: string;
    availableLanguage?: Language;
    courseMode?: CourseMode[];
    educationalCredentialAwarded?: string;
} 