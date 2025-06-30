import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import { NavBar } from "@/components/NavBar";
import Footer from "@/components/Footer";
import type { SearchResult } from "@/types/search";
import { SearchResultsClient } from "./SearchResultsClient";

const searchQuery = groq`
  *[_type in ["blog", "course", "project", "research"] && (
    title match $term ||
    excerpt match $term ||
    description match $term ||
    abstract match $term ||
    keywords[] match $term
  )] {
    _id,
    _type,
    title,
    slug,
    excerpt,
    description,
    abstract
  }
`;

export type SearchParamsType = Promise<{ q: string }>;

export default async function SearchPage({
  searchParams,
}: {
  searchParams: SearchParamsType;
}) {
  const { q: query = "" } = await searchParams;
  
  const results: SearchResult[] = await client.fetch(searchQuery, {
    term: `*${query}*`,
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-950 via-black to-black relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20" style={{
        backgroundImage: `url('/themes/projects-background.svg')`,
        backgroundSize: '220px 220px'
      }}></div>

      <NavBar />
      <SearchResultsClient results={results} query={query} />
      <Footer />
    </div>
  );
}