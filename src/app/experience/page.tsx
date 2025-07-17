import { Experience } from "@/components/Experience";
import Footer from "@/components/Footer";
import { NavBar } from "@/components/NavBar";
import { client } from "@/sanity/lib/client";
import { Metadata } from "next";

interface Experience {
  title: string;
  description: string;
  url: string;
}

export async function generateMetadata(): Promise<Metadata> {
  const experiences = await client.fetch(`*[_type == "experience"]{
    title,
    description,
    "url": "/experience"
  }`);

  const itemListElement = experiences.map((exp: Experience, index: number) => ({
    "@type": "ListItem",
    "position": index + 1,
    "item": {
      "@type": "JobPosting",
      "title": exp.title,
      "description": exp.description,
      "url": exp.url
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
        item: 'https://www.thepurplestruct.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Experience',
        item: 'https://www.thepurplestruct.com/experience',
      },
    ],
  };

  return {
    title: "Work Experience | HeyShinde - Shinde Aditya's Professional Journey",
    description: "Explore Shinde Aditya's timeline in AI, ML, and software development—featuring career milestones, achievements, and technical expertise.",
    openGraph: {
      title: "Work Experience | HeyShinde - Shinde Aditya's Professional Journey",
      description: "Explore Shinde Aditya's timeline in AI, ML, and software development—featuring career milestones, achievements, and technical expertise.",
    },
    other: {
      'application-ld+json': JSON.stringify([jsonLd, breadcrumbJsonLd]),
    }
  };
}

export default function ExperiencePage() {
  return (
    <div>
      <NavBar />
      <main>
        <Experience isMainPage={true} />
      </main>
      <Footer />
    </div>
  );
} 