import { client } from '@/sanity/lib/client';
import { MetadataRoute } from 'next';

type BlogSlug = {
    slug: {
        current: string;
    };
    updatedAt: string;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://developer.heyshinde.com';

    // Fetch all blog post slugs and their last update time
    const postSlugs: BlogSlug[] = await client.fetch(`*[_type == "blog"]{ "slug": slug, "updatedAt": _updatedAt }`);

    const postUrls = postSlugs.map((post) => ({
        url: `${baseUrl}/blog/${post.slug.current}`,
        lastModified: new Date(post.updatedAt).toISOString(),
        changeFrequency: 'weekly' as 'weekly',
        priority: 0.8,
    }));

    return [
        {
            url: baseUrl,
            lastModified: new Date().toISOString(),
            changeFrequency: 'yearly',
            priority: 1,
        },
        {
            url: `${baseUrl}/blog`,
            lastModified: new Date().toISOString(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        ...postUrls,
    ];
} 