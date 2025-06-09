import { Projects } from '@/components/Projects'
import { NavBar } from '@/components/NavBar'
import  Footer  from '@/components/Footer'
import { client } from "@/sanity/lib/client";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const projects = await client.fetch(`*[_type == "project"]{
    title,
    description,
    "url": ctaLink
  }`);

  const itemListElement = projects.map((project: any, index: number) => ({
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

  return {
    title: "Projects",
    description: "A collection of my projects.",
    openGraph: {
      title: "Projects",
      description: "A collection of my projects.",
    },
    other: {
      'application-ld+json': JSON.stringify(jsonLd),
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
        <Projects />
      </main>
      <Footer />
    </div>
  )
} 