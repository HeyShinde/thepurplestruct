"use client";
import { useSession, signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import React from "react";

const BookmarkButton = React.memo(function BookmarkButton({ postId, postTitle }: { postId: string, postTitle: string }) {
  const { data: session } = useSession();
  const [bookmarked, setBookmarked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (session && postId) {
      fetch(`/api/bookmarks?postId=${postId}`)
        .then(res => res.ok ? res.json() : Promise.resolve({ bookmarked: false }))
        .then(data => setBookmarked(data.bookmarked));
    }
  }, [session, postId]);

  const handleBookmark = async () => {
    if (!postId) return;
    if (!session) {
      setShowModal(true);
      return;
    }
    setLoading(true);
    const method = bookmarked ? "DELETE" : "POST";
    const res = await fetch("/api/bookmarks", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId, postTitle }),
    });
    if (res.ok) setBookmarked(!bookmarked);
    setLoading(false);
  };

  return (
    <>
      <button
        onClick={handleBookmark}
        disabled={loading}
        className="flex items-center justify-center w-12 h-12 bg-black/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-black/90 transition-colors duration-200 border border-purple-400/20 cursor-pointer"
        aria-label={session ? (bookmarked ? "Remove bookmark" : "Add bookmark") : "Log in to bookmark"}
        title={session ? (bookmarked ? "Remove bookmark" : "Add bookmark") : "Log in to bookmark"}
        type="button"
        onMouseEnter={() => { if (!session) setShowTooltip(true); }}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {bookmarked ? <FaBookmark className="text-purple-400" /> : <FaRegBookmark className="text-purple-400" />}
        {/* Tooltip */}
        {!session && showTooltip && (
          <span className="absolute left-14 top-1/2 -translate-y-1/2 bg-black text-white text-xs px-3 py-1 rounded shadow-lg z-20">
            Log in to bookmark
          </span>
        )}
      </button>
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-purple-900 via-black to-black rounded-2xl shadow-2xl p-8 max-w-xs w-full border border-purple-400/30 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-purple-400 hover:text-purple-200 text-xl"
              aria-label="Close"
            >
              &times;
            </button>
            <div className="flex flex-col items-center">
              <div className="bg-purple-600/20 rounded-full p-4 mb-4">
                <FaRegBookmark className="text-3xl text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-purple-300 mb-2 text-center">Log in to Bookmark</h3>
              <p className="text-neutral-300 mb-6 text-center text-sm">
                You need to be logged in to bookmark your favorite posts and access them later.
              </p>
              <button
                onClick={() => signIn()}
                className="w-full bg-gradient-to-r from-purple-500 to-purple-700 text-white font-semibold py-2 rounded-lg shadow hover:from-purple-600 hover:to-purple-800 transition-colors mb-2"
              >
                Log In / Sign Up
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="w-full text-purple-400 hover:text-purple-200 text-sm mt-1"
              >
                Maybe later
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
});

export default BookmarkButton; 