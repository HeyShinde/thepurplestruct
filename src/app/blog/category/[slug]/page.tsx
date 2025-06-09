import { BlogGrid } from "@/components/BlogGrid";
import Footer from "@/components/Footer";
import { NavBar } from "@/components/NavBar";
import { Suspense } from "react";
import { Metadata } from 'next';
import { client } from '@/sanity/lib/client';

async function getCategory(slug: string) {
    const query = `*[_type == "category" && slug.current == $slug][0] {
        title,
        description
    }`;
    return client.fetch<{ title: string; description: string }>(query, { slug });
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const category = await getCategory(params.slug);

    if (!category) {
        return {
            title: "Category Not Found",
        };
    }

    const pageUrl = `https://www.heyshinde.com/blog/category/${params.slug}`;
    const title = `${category.title} | Blog`;
    const description = category.description || `Posts categorized under ${category.title}.`;

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        'name': `${category.title} Category`,
        'url': pageUrl,
        'description': description,
        'isPartOf': {
            '@type': 'Blog',
            '@id': 'https://www.heyshinde.com/blog/#blog'
        }
    };

    return {
        title: title,
        description: description,
        alternates: {
            canonical: pageUrl,
        },
        openGraph: {
            title: title,
            description: description,
            url: pageUrl,
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: title,
            description: description,
        },
        other: {
            "application/ld+json": JSON.stringify(jsonLd),
        }
    };
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const category = await getCategory(params.slug);

  return (
    <div>
      <NavBar/>
      <main>
        <Suspense fallback={<div>Loading...</div>}>
          <BlogGrid paddingTop="10rem"
            categorySlug={params.slug} 
            title={`Category: ${category?.title || 'Posts'}`}
            description={category?.description}
          />
        </Suspense>
      </main>
      <Footer />  
    </div>
  );
} 