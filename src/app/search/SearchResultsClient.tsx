"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { SearchResult } from "@/types/search";

function getResultLink(result: SearchResult): string {
    switch (result._type) {
      case "blog":
        return `/blog/${result.slug?.current}`;
      case "course":
        return `/courses/${result.slug?.current}`;
      case "project":
        return `/projects#${encodeURIComponent(result.title)}`;
      case "research":
        return `/research#${encodeURIComponent(result.title)}`;
      default:
        return "#";
    }
}
  
function getResultDescription(result: SearchResult): string {
    if (result._type === 'research') {
        return result.abstract || "No abstract available.";
    }
    return result.excerpt || result.description || "No description available.";
}

interface SearchResultsClientProps {
    results: SearchResult[];
    query: string;
}
  
export function SearchResultsClient({ results, query }: SearchResultsClientProps) {
    return (
        <main className="relative z-10 container mx-auto px-4 pt-[calc(var(--navbar-height,80px)+4rem)]">
            <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
            >
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent mb-4">
                Search Results
            </h1>
            <p className="text-lg text-neutral-300">
                {results.length > 0
                ? `Found ${results.length} result(s) for `
                : `No results found for `}
                <span className="font-mono text-purple-400">{query}</span>
            </p>
            </motion.div>
    
            <div className="max-w-4xl mx-auto space-y-6 pb-24">
            {results.map((result, index) => (
                <motion.div
                key={result._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative bg-black/40 backdrop-blur-sm rounded-lg border border-purple-400/20 hover:border-purple-400/40 transition-all duration-300 overflow-hidden"
                >
                <div className="absolute -inset-[1px] rounded-lg bg-gradient-to-r from-purple-400/0 via-purple-400/80 to-purple-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                    backgroundSize: '200% 100%',
                    animation: 'gradientMove 3s linear infinite',
                    mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    maskComposite: 'exclude',
                    padding: '1px',
                    }}
                />
                <Link href={getResultLink(result)} className="block p-6 relative">
                    <span className="text-xs uppercase font-mono tracking-widest text-purple-400">
                    {result._type}
                    </span>
                    <h2 className="text-2xl font-bold text-white mt-2 group-hover:text-purple-400 transition-colors">
                    {result.title}
                    </h2>
                    <p className="text-neutral-300 mt-2 line-clamp-2">
                    {getResultDescription(result)}
                    </p>
                </Link>
                </motion.div>
            ))}
            </div>
        </main>
    )
} 