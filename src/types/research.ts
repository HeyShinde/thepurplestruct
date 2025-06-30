export interface Research {
    _id: string;
    _type: 'research';
    title: string;
    url: string;
    doi?: string;
    authors: string;
    year: number;
    venue: string;
    abstract?: string;
    longDescription?: string;
    bulletPoints?: string[];
    keywords?: string[];
} 