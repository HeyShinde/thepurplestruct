"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { FaBookmark } from "react-icons/fa";

interface Bookmark {
  id: string;
  postId: string;
  postTitle: string;
  createdAt: string;
}

export default function BookmarksPage() {
  const { data: session, status } = useSession();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) {
      fetch("/api/bookmarks")
        .then(res => res.json())
        .then(data => setBookmarks(data.bookmarks || []))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [session]);

  if (status === "loading" || loading) {
    return <div className="text-white text-center p-10">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-950 to-black py-12 relative overflow-hidden text-white">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent mb-4 flex items-center justify-center gap-3">
            <FaBookmark className="inline-block mb-1" /> My Bookmarks
          </h1>
          <p className="text-neutral-400">All your bookmarked blog posts in one place.</p>
        </div>
        {bookmarks.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-neutral-400 mb-4">You have not bookmarked any blog posts yet.</p>
            <Link href="/blog" className="mt-6 inline-block bg-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors">
              Explore Blog
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {bookmarks.map((bm) => (
              <Link href={`/blog/${bm.postId}`} key={bm.id} className="block">
                <div className="rounded-2xl overflow-hidden shadow-xl bg-white/5 border border-purple-400/20 hover:border-purple-400/40 transition-shadow duration-300 group p-6 h-full flex flex-col justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-purple-300 group-hover:text-purple-400 transition-colors mb-2 flex items-center gap-2">
                        {bm.postTitle}
                    </h2>
                    <p className="text-xs text-neutral-400 mb-4">Bookmarked on {new Date(bm.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className="text-purple-400 font-semibold mt-auto group-hover:underline">Read Post →</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 