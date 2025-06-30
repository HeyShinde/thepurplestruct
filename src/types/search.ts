export type SearchResult = {
    _id: string;
    _type: "blog" | "course" | "project" | "research";
    title: string;
    slug?: { current: string };
    excerpt?: string;
    description?: string;
    abstract?: string;
}; 