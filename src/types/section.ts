import type { Lesson } from './lesson';

export interface Section {
    _id: string;
    _type: 'section';
    title: string;
    order?: number;
    lessons?: Lesson[];
} 