import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://www.thepurplestruct.com';

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

    return staticUrls;
} 