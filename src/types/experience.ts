export interface Skill {
    _key: string;
    name: string;
    icon?: string;
}

export interface Responsibility {
    _key: string;
    title: string;
    description: string;
    impact?: string;
}

export interface Experience {
    _id: string;
    _type: 'experience';
    date: string;
    title: string;
    company: string;
    description: string;
    skills?: Skill[];
    achievements?: string[];
    responsibilities?: Responsibility[];
    keywords?: string[];
} 