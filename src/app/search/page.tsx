import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import Link from "next/link";
import { NavBar } from "@/components/NavBar";
import Footer from "@/components/Footer";

type SearchResult = {
  _id: string;
  _type: "blog" | "course" | "project" | "research";
  title: string;
  slug?: { current: string };
  excerpt?: string;
  description?: string;
  url?: string;
};

const searchQuery = groq`
  *[_type in ["blog", "course", "project", "research"] && (
    title match $term ||
    excerpt match $term ||
    description match $term ||
    keywords[] match $term
  )] {
    _id,
    _type,
    title,
    slug,
    excerpt,
    description,
    url
  }
`;

function getResultLink(result: SearchResult): string {
  switch (result._type) {
    case "blog":
      return `/blog/${result.slug?.current}`;
    case "course":
      return `/courses/${result.slug?.current}`;
    case "project":
      // Assuming projects have a direct URL or a slug-based one
      return result.url || `/projects/${result.slug?.current}`;
    case "research":
      return result.url || "#"; // Assuming research papers have a direct URL
    default:
      return "#";
  }
}

function getResultDescription(result: SearchResult): string {
  return result.excerpt || result.description || "No description available.";
}

// Define the searchParams type
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
    <div className="bg-black text-white min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-grow container mx-auto px-4 py-16 md:py-24">
        <h1 className="text-4xl md:text-5xl font-bold font-heading mb-2">
          Search Results
        </h1>
        <p className="text-lg text-gray-400 mb-8">
          {results.length > 0
            ? `Found ${results.length} result(s) for `
            : `No results found for `}
          <span className="font-bold text-purple-400">`{query}`</span>
        </p>
        <div className="space-y-6">
          {results.map((result) => (
            <div
              key={result._id}
              className="p-6 border border-gray-800 rounded-lg hover:bg-gray-900/50 transition-colors duration-200"
            >
              <Link href={getResultLink(result)}>
                <span className="text-xs uppercase font-mono tracking-widest text-purple-400">
                  {result._type}
                </span>
                <h3 className="text-2xl font-bold font-heading text-white mt-1 group-hover:underline">
                  {result.title}
                </h3>
                <p className="text-gray-400 mt-2 line-clamp-2">
                  {getResultDescription(result)}
                </p>
              </Link>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}