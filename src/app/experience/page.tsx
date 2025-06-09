import { Experience } from "@/components/Experience";
import Footer from "@/components/Footer";
import { NavBar } from "@/components/NavBar";
import { client } from "@/sanity/lib/client";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const experiences = await client.fetch(`*[_type == "experience"]{
    title,
    description,
    "url": "/experience"
  }`);

  const itemListElement = experiences.map((exp: any, index: number) => ({
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

  return {
    title: "Experience",
    description: "A timeline of my professional journey.",
    openGraph: {
      title: "Experience",
      description: "A timeline of my professional journey.",
    },
    other: {
      'application-ld+json': JSON.stringify(jsonLd),
    }
  };
}

export default function ExperiencePage() {
  return (
    <div>
      <NavBar />
      <main>
        <Experience />
      </main>
      <Footer />
    </div>
  );
} 