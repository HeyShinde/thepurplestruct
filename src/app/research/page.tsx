import { Research } from "@/components/Research";
import Footer from "@/components/Footer";
import { NavBar } from "@/components/NavBar";
import { client } from "@/sanity/lib/client";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const papers = await client.fetch(`*[_type == "research"]{
    title,
    abstract,
    "url": url
  }`);

  const itemListElement = papers.map((paper: any, index: number) => ({
    "@type": "ListItem",
    "position": index + 1,
    "item": {
      "@type": "ScholarlyArticle",
      "name": paper.title,
      "description": paper.abstract,
      "url": paper.url
    }
  }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": itemListElement
  };

  return {
    title: "Research",
    description: "A collection of my research papers.",
    openGraph: {
      title: "Research",
      description: "A collection of my research papers.",
    },
    other: {
      'application-ld+json': JSON.stringify(jsonLd),
    }
  };
}

export default function ResearchPage() {
  return (
    <div>
      <NavBar />
      <main>
        <Research paddingTop="10rem" showTitle={false} reverse={true} />
      </main>
      <Footer />
    </div>
  );
} 