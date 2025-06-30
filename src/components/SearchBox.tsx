"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useDebounce } from "@/hooks/useDebounce";
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

interface SearchBoxProps {
  variant?: "mobile" | "default";
}

export const SearchBox = ({ variant = "default" }: SearchBoxProps) => {
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
        .catch(() => {
          // console.error(err);
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
    <div className={`relative group ${variant === "mobile" ? "w-full" : ""}`} ref={searchBoxRef}>
      <form onSubmit={handleSearchSubmit} id="search-form" className="relative flex items-center">
        <button
          type="submit"
          aria-label="Search"
          className={`absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-purple-500 transition-colors z-10 ${variant === "mobile" ? "text-2xl" : ""}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={variant === "mobile" ? 28 : 20}
            height={variant === "mobile" ? 28 : 20}
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
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder="Search anything..."
          className={`w-full bg-gray-100 dark:bg-gray-800/50 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 ${variant === "mobile" ? "text-lg py-4 px-5 rounded-2xl shadow-xl border-2" : "rounded-lg py-2 pl-4 pr-10"} md:w-0 md:opacity-0 md:group-hover:w-full md:group-hover:opacity-100 md:group-focus-within:w-full md:group-focus-within:opacity-100 md:focus:w-full md:focus:opacity-100`}
          style={{ minWidth: '2.5rem' }}
        />
      </form>

      {isFocused && query && (
        <div className="absolute top-full mt-2 w-full max-w-md mx-auto bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-2xl z-50 overflow-hidden right-0 md:right-auto max-h-[50vh]">
          <ul className="divide-y divide-gray-200 dark:divide-gray-800 max-h-[50vh] overflow-y-auto px-2 py-2">
            {isLoading && (
              <li className="px-4 py-3 text-gray-500 dark:text-gray-400 text-center">
                Searching...
              </li>
            )}
            {!isLoading && results.length === 0 && debouncedQuery && (
              <li className="px-4 py-3 text-gray-500 dark:text-gray-400 text-center">
                No results for `{debouncedQuery}`
              </li>
            )}
            {!isLoading &&
              results.map((result) => (
                <li key={result._id} className="mb-2">
                  <Link
                    href={getResultLink(result)}
                    onClick={handleResultClick}
                    className="block bg-white dark:bg-gray-900 rounded-lg shadow-md px-4 py-3 hover:bg-purple-50 dark:hover:bg-gray-800 transition-colors duration-200"
                  >
                    <span className="text-xs uppercase font-mono tracking-widest text-purple-500 dark:text-purple-400">
                      {result._type}
                    </span>
                    <p className="font-semibold text-gray-800 dark:text-gray-200 mt-1 text-base">
                      {result.title}
                    </p>
                  </Link>
                </li>
              ))}
            {results.length > 0 && (
              <li className="border-t border-gray-200 dark:border-gray-800 mt-2">
                <Link
                  href={`/search?q=${encodeURIComponent(query)}`}
                  onClick={() => setIsFocused(false)}
                  className="block w-full text-center px-4 py-3 font-semibold text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-gray-800 transition-colors duration-200 rounded-lg"
                >
                  View all results for `{query}`
                </Link>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};
