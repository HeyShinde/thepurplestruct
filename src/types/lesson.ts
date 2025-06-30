import type { PortableText } from './common';

export interface Lesson {
    _id: string;
    _type: 'lesson';
    title: string;
    content?: PortableText;
    videoUrl?: string;
    duration?: number;
    order?: number;
} 