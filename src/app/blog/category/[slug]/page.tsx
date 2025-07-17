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

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategory(slug);
  
  if (!category) {
    return {
      title: "Category Not Found | The Purple Struct Blog",
    };
  }

  const pageUrl = `https://www.thepurplestruct.com/blog/category/${slug}`;
  const title = `${category.title} Articles | The Purple Struct`;
  const description = category.description || `Explore ${category.title} articles and insights from The Purple Struct's blog—covering Machine Learning, AI, and unique perspectives on technology.`;
  
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    'name': `${category.title} Category`,
    'url': pageUrl,
    'description': description,
    'isPartOf': {
      '@type': 'Blog',
      '@id': 'https://www.thepurplestruct.com/blog/#blog'
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

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await getCategory(slug);
  
  return (
    <div>
      <NavBar/>
      <main>
        <Suspense fallback={<div>Loading...</div>}>
          <BlogGrid 
            paddingTop="10rem"
            categorySlug={slug}
            title={`Category: ${category?.title || 'Posts'}`}
            description={category?.description}
            isMainPage={true}
          />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}