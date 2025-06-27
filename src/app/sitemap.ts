import { client } from '@/sanity/lib/client';
import { MetadataRoute } from 'next';

type SanitySlug = {
    slug: {
        current: string;
    };
    updatedAt: string;
};

async function fetchSlugs(type: string): Promise<SanitySlug[]> {
    return client.fetch(`*[_type == "${type}"]{ "slug": slug, "updatedAt": _updatedAt }`);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://www.heyshinde.com';

    // 1. Fetch all dynamic routes
    const postSlugs = await fetchSlugs('blog');
    const courseSlugs = await fetchSlugs('course');
    const categorySlugs = await fetchSlugs('category');
    const projectSlugs = await fetchSlugs('project');
    const experienceSlugs = await fetchSlugs('experience');
    const researchSlugs = await fetchSlugs('research');

    // 2. Map dynamic routes to sitemap format
    const createUrls = (slugs: SanitySlug[], route: string, priority: number) => {
        return slugs
            .filter(doc => doc.slug && doc.slug.current)
            .map((doc) => ({
                url: `${baseUrl}/${route}/${doc.slug.current}`,
                lastModified: new Date(doc.updatedAt).toISOString(),
                changeFrequency: 'weekly' as const,
                priority,
            }));
    };
    
    const postUrls = createUrls(postSlugs, 'blog', 0.8);
    const courseUrls = createUrls(courseSlugs, 'courses', 0.7);
    const categoryUrls = createUrls(categorySlugs, 'blog/category', 0.6);
    const projectUrls = createUrls(projectSlugs, 'projects', 0.7);
    const experienceUrls = createUrls(experienceSlugs, 'experience', 0.7);
    const researchUrls = createUrls(researchSlugs, 'research', 0.7);

    // 3. Define static routes
    const staticUrls: MetadataRoute.Sitemap = [
        { url: baseUrl, lastModified: new Date().toISOString(), changeFrequency: 'monthly', priority: 1.0 },
        { url: `${baseUrl}/about`, lastModified: new Date().toISOString(), changeFrequency: 'yearly', priority: 0.8 },
        { url: `${baseUrl}/blog`, lastModified: new Date().toISOString(), changeFrequency: 'daily', priority: 0.9 },
        { url: `${baseUrl}/projects`, lastModified: new Date().toISOString(), changeFrequency: 'monthly', priority: 0.8 },
        { url: `${baseUrl}/experience`, lastModified: new Date().toISOString(), changeFrequency: 'monthly', priority: 0.8 },
        { url: `${baseUrl}/research`, lastModified: new Date().toISOString(), changeFrequency: 'monthly', priority: 0.8 },
        { url: `${baseUrl}/courses`, lastModified: new Date().toISOString(), changeFrequency: 'weekly', priority: 0.8 },
    ];

    // 4. Combine and return all URLs
    return [
        ...staticUrls,
        ...postUrls,
        ...courseUrls,
        ...categoryUrls,
        ...projectUrls,
        ...experienceUrls,
        ...researchUrls,
    ];
} 