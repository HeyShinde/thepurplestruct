import { BlogGrid } from "@/components/BlogGrid";
import Footer from "@/components/Footer";
import { NavBar } from "@/components/NavBar";
import { Suspense } from "react";
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const pageUrl = "https://developer.heyshinde.com/blog";
  const title = "Blog | Shinde Aditya";
  const description = "Explore articles on Machine Learning, MLOps, AI, and modern web development from Shinde Aditya's perspective.";

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': `${pageUrl}/#blog`,
    'name': 'HeyShinde Blog',
    'url': pageUrl,
    'publisher': {
      '@type': 'Person',
      '@id': 'https://developer.heyshinde.com/#person'
    },
    'description': description
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

export default function BlogPage() {
  return (
    <div>
      <NavBar/>
      <main>
        <Suspense fallback={<div>Loading...</div>}>
          <BlogGrid paddingTop="10rem" />
        </Suspense>
      </main>
      <Footer />  
    </div>
  );
} 