export interface SanityImage {
    asset: {
        _ref: string;
        _type: 'reference';
    };
    alt?: string;
}

export interface SocialIcon {
    platform: string;
    url: string;
    icon: SanityImage;
}

export interface Author {
    name: string;
    image: SanityImage | null;
    bio?: string;
    socialIcons?: SocialIcon[];
}

export interface BlogPost {
    title: string;
    slug: { current: string };
    author: Author;
    categories: { _id: string; title: string }[];
    tags: string[];
    mainImage: SanityImage;
    excerpt: string;
    body: Array<any>;
    publishedAt: string;
    updatedAt?: string;
    sidebarPromo?: {
        promoType?: "image" | "code";
        image?: SanityImage;
        imageLink?: string;
        altText?: string;
        code?: string;
    };
} 