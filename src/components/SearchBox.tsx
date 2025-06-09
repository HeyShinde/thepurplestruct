"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useDebounce } from "@/hooks/useDebounce";

type SearchResult = {
  _id: string;
  _type: "blog" | "course" | "project" | "research";
  title: string;
  slug?: string;
  url?: string;
};

function getResultLink(result: SearchResult): string {
  switch (result._type) {
    case "blog":
      return `/blog/${result.slug}`;
    case "course":
      return `/courses/${result.slug}`;
    case "project":
      return result.url || `/projects`;
    case "research":
      return result.url || "/research";
    default:
      return "#";
  }
}

export const SearchBox = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const debouncedQuery = useDebounce(query, 300);
  const searchBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchBoxRef.current &&
        !searchBoxRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (debouncedQuery) {
      setIsLoading(true);
      fetch(`/api/search?term=${debouncedQuery}`)
        .then((res) => res.json())
        .then((data) => {
          setResults(data);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setIsLoading(false);
        });
    } else {
      setResults([]);
    }
  }, [debouncedQuery]);

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
      setQuery("");
      setIsFocused(false);
    }
  };

  const handleResultClick = () => {
    setQuery("");
    setIsFocused(false);
  };

  return (
    <div className="relative w-full md:w-64" ref={searchBoxRef}>
      <form onSubmit={handleSearchSubmit} id="search-form" className="relative">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder="Search anything..."
          className="w-full bg-gray-100 dark:bg-gray-800/50 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 border border-gray-300 dark:border-gray-700 rounded-lg py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
        />
        <button
          type="submit"
          aria-label="Search"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-500"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>
      </form>

      {isFocused && query && (
        <div className="absolute top-full mt-2 w-full md:w-96 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg z-50 overflow-hidden right-0 md:right-auto">
          <ul className="divide-y divide-gray-200 dark:divide-gray-800">
            {isLoading && (
              <li className="px-4 py-3 text-gray-500 dark:text-gray-400">
                Searching...
              </li>
            )}
            {!isLoading && results.length === 0 && debouncedQuery && (
              <li className="px-4 py-3 text-gray-500 dark:text-gray-400">
                No results for `{debouncedQuery}`
              </li>
            )}
            {!isLoading &&
              results.map((result) => (
                <li key={result._id}>
                  <Link
                    href={getResultLink(result)}
                    onClick={handleResultClick}
                    className="block px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors duration-200 group"
                  >
                    <span className="text-xs uppercase font-mono tracking-widest text-purple-500 dark:text-purple-400">
                      {result._type}
                    </span>
                    <p className="font-semibold text-gray-800 dark:text-gray-200 group-hover:text-black dark:group-hover:text-white mt-1">
                      {result.title}
                    </p>
                  </Link>
                </li>
              ))}
            {results.length > 0 && (
              <li className="border-t border-gray-200 dark:border-gray-800">
                <button
                  type="submit"
                  form="search-form"
                  onClick={() => setIsFocused(false)}
                  className="block w-full text-left px-4 py-3 font-semibold text-purple-600 dark:text-purple-400 hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors duration-200"
                >
                  View all results for `{query}`
                </button>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};
