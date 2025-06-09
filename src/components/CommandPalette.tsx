"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";
import {
  HomeIcon,
  DocumentTextIcon,
  FolderIcon,
  LinkIcon,
  UserIcon,
  AcademicCapIcon,
  QueueListIcon,
  // SunIcon, // Example for a new item
  // MoonIcon, // Example for a new item
} from "@heroicons/react/24/outline";

type SearchResult = {
  _id: string;
  _type: "blog" | "course" | "project" | "research";
  title: string;
  slug?: string;
  url?: string;
};

const pageLinks = [
  { name: "Home", href: "/", icon: HomeIcon },
  { name: "Projects", href: "/projects", icon: FolderIcon },
  { name: "Blog", href: "/blog", icon: DocumentTextIcon },
  { name: "About", href: "/#about", icon: UserIcon },
  { name: "Research", href: "/research", icon: AcademicCapIcon },
  { name: "Courses", href: "/courses", icon: QueueListIcon },
];

function getResultLink(result: SearchResult): string {
  switch (result._type) {
    case "blog":
      return result.slug ? `/blog/${result.slug}` : "/blog";
    case "course":
      return result.slug ? `/courses/${result.slug}` : "/courses";
    case "project":
      return result.url || "/projects";
    case "research":
      return result.url || "/research";
    default:
      return "/";
  }
}

export const CommandPalette = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (debouncedQuery) {
      setIsLoading(true);
      fetch(`/api/search?term=${encodeURIComponent(debouncedQuery)}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error("Search API failed");
          }
          return res.json();
        })
        .then((data) => {
          setSearchResults(data);
        })
        .catch((err) => {
          console.error(err);
          setSearchResults([]);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setSearchResults([]);
      setIsLoading(false);
    }
  }, [debouncedQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setOpen(false);
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const runCommand = useCallback(
    (command: () => unknown) => {
      setOpen(false);
      command();
    },
    [setOpen]
  );

  // Close on Escape key
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [setOpen]);

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      label="Global Command Menu"
      className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]"
      filter={() => 1}
    >
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="z-10 w-[90vw] max-w-[640px] rounded-2xl border border-gray-700 bg-black/80 text-white shadow-lg backdrop-blur-xl relative"
        ref={searchBoxRef}
      >
        
        <form onSubmit={handleSearchSubmit} className="relative">
          <Command.Input
            value={query}
            onValueChange={setQuery}
            placeholder="Search for content or navigate..."
            className="w-full bg-transparent px-6 py-5 text-lg placeholder-gray-500 focus:outline-none"
          />
          <button
            type="submit"
            aria-label="Search"
            className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500 hover:text-purple-500"
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
        <div className="border-t border-gray-800" />

        <Command.List className="max-h-[45vh] overflow-y-auto p-2">
          {searchResults.length > 0 && (
            <Command.Group heading="Search Results">
              {searchResults.map((result) => (
                <Command.Item
                  key={result._id}
                  onSelect={() =>
                    runCommand(() => router.push(getResultLink(result)))
                  }
                  className="flex cursor-pointer select-none items-center gap-3 rounded-lg px-4 py-3 text-gray-300 aria-selected:bg-purple-600/20 aria-selected:text-white"
                >
                  {result._type === "blog" && (
                    <DocumentTextIcon className="h-5 w-5" />
                  )}
                  {result._type === "course" && (
                    <QueueListIcon className="h-5 w-5" />
                  )}
                  {result._type === "project" && (
                    <FolderIcon className="h-5 w-5" />
                  )}
                  {result._type === "research" && (
                    <AcademicCapIcon className="h-5 w-5" />
                  )}
                  <div className="flex flex-col">
                    <span className="text-xs uppercase font-mono tracking-widest text-purple-500">
                      {result._type}
                    </span>
                    <span className="font-semibold">{result.title}</span>
                  </div>
                </Command.Item>
              ))}

              {query.trim() && (
                <Command.Item
                  onSelect={() => {
                    setOpen(false);
                    router.push(`/search?q=${encodeURIComponent(query)}`);
                  }}
                  className="flex cursor-pointer select-none items-center gap-3 rounded-lg px-4 py-3 text-gray-300 aria-selected:bg-purple-600/20 aria-selected:text-white border-t border-gray-800 mt-2"
                >
                  <LinkIcon className="h-5 w-5" />
                  <span className="font-semibold text-purple-400">
                    View all results for `{query}`
                  </span>
                </Command.Item>
              )}
            </Command.Group>
          )}
          {!query && (
            <>
              <Command.Group heading="Navigation">
                {pageLinks.map((link) => (
                  <Command.Item
                    key={link.href}
                    onSelect={() => runCommand(() => router.push(link.href))}
                    className="flex cursor-pointer select-none items-center gap-3 rounded-lg px-4 py-3 text-gray-300 aria-selected:bg-purple-600/20 aria-selected:text-white"
                  >
                    <link.icon className="h-5 w-5" />
                    <span>{link.name}</span>
                  </Command.Item>
                ))}
              </Command.Group>

              {/* <Command.Group heading="Theme">
                <Command.Item
                  onSelect={() => runCommand(() => console.log("Set Light"))}
                  className="flex cursor-pointer select-none items-center gap-3 rounded-lg px-4 py-3 text-gray-300 aria-selected:bg-purple-600/20 aria-selected:text-white"
                >
                  <SunIcon className="h-5 w-5" />
                  Set Theme to Light
                </Command.Item>
                <Command.Item
                  onSelect={() => runCommand(() => console.log("Set Dark"))}
                  className="flex cursor-pointer select-none items-center gap-3 rounded-lg px-4 py-3 text-gray-300 aria-selected:bg-purple-600/20 aria-selected:text-white"
                >
                  <MoonIcon className="h-5 w-5" />
                  Set Theme to Dark
                </Command.Item>
              </Command.Group> */}
            </>
          )}
        </Command.List>
      </div>
      </Command.Dialog>
  )
};