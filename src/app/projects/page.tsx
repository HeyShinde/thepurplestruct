import { Projects } from '@/components/Projects'
import { NavBar } from '@/components/NavBar'
import  Footer  from '@/components/Footer'
import { client } from "@/sanity/lib/client";
import { Metadata } from "next";

type Project = {
  title: string;
  description: string;
  url: string;
};

export async function generateMetadata(): Promise<Metadata> {
  const projects = await client.fetch(`*[_type == "project"]{
    title,
    description,
    "url": ctaLink
  }`);

  const itemListElement = projects.map((project: Project, index: number) => ({
    "@type": "ListItem",
    "position": index + 1,
    "item": {
      "@type": "CreativeWork",
      "name": project.title,
      "description": project.description,
      "url": project.url
    }
  }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": itemListElement
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.heyshinde.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Projects',
        item: 'https://www.heyshinde.com/projects',
      },
    ],
  };

  return {
    title: "Projects | HeyShinde - Shinde Aditya's Portfolio",
    description: "Explore a curated collection of projects by Shinde Aditya (HeyShinde) in machine learning, AI, and software engineering.",
    openGraph: {
      title: "Projects | HeyShinde - Shinde Aditya's Portfolio",
      description: "Explore a curated collection of projects by Shinde Aditya (HeyShinde) in machine learning, AI, and software engineering.",
    },
    other: {
      'application-ld+json': JSON.stringify([jsonLd, breadcrumbJsonLd]),
    },
    alternates: {
      canonical: "/projects",
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function ProjectsPage() {
  return (
    <div>
      <NavBar />
      <main>
        <Projects isMainPage={true} />
      </main>
      <Footer />
    </div>
  )
} 