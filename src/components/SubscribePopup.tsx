"use client";
import { useEffect, useState } from "react";
import SubscribeForm from "@/components/SubscribeForm";

const SUBSCRIBE_POPUP_KEY = "subscribe_popup_dismissed_until";
const SUBSCRIBE_POPUP_SUCCESS_KEY = "subscribe_popup_success";
const POPUP_DELAY = 20000; // 20 seconds
const POPUP_EXPIRY_DAYS = 7;

function shouldShowPopup() {
  // Only show on blog post pages
  if (typeof window !== "undefined" && !window.location.pathname.startsWith("/blog/")) return false;
  // Don't show if dismissed or subscribed in last 7 days
  const dismissedUntil = localStorage.getItem(SUBSCRIBE_POPUP_KEY);
  const subscribed = localStorage.getItem(SUBSCRIBE_POPUP_SUCCESS_KEY);
  const now = Date.now();
  if (subscribed) return false;
  if (dismissedUntil && now < parseInt(dismissedUntil, 10)) return false;
  return true;
}

export default function SubscribePopup() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!shouldShowPopup()) return;
    // Show after delay or scroll or exit intent
    const timer = setTimeout(() => setShow(true), POPUP_DELAY);

    const onScroll = () => {
      if (window.scrollY > window.innerHeight / 2) {
        setShow(true);
        window.removeEventListener("scroll", onScroll);
        clearTimeout(timer);
      }
    };
    window.addEventListener("scroll", onScroll);

    const onMouseLeave = (e: MouseEvent) => {
      if (e.clientY < 0) {
        setShow(true);
        window.removeEventListener("mouseleave", onMouseLeave);
        clearTimeout(timer);
      }
    };
    window.addEventListener("mouseleave", onMouseLeave);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mouseleave", onMouseLeave);
      clearTimeout(timer);
    };
  }, []);

  const handleClose = () => {
    setShow(false);
    // Set dismissed for 7 days
    const until = Date.now() + POPUP_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
    localStorage.setItem(SUBSCRIBE_POPUP_KEY, until.toString());
  };

  // Listen for successful subscribe (custom event from SubscribeForm)
  useEffect(() => {
    const handler = () => {
      setShow(false);
      localStorage.setItem(SUBSCRIBE_POPUP_SUCCESS_KEY, "1");
    };
    window.addEventListener("subscribe-success", handler);
    return () => window.removeEventListener("subscribe-success", handler);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-purple-900 via-black to-black rounded-2xl shadow-2xl p-8 max-w-lg w-full border border-purple-400/30 relative">
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-purple-400 hover:text-purple-200 text-xl"
          aria-label="Close"
        >
          &times;
        </button>
        <SubscribeForm
          title="Never miss what's next"
          description="Level up your stack with hand-picked AI & dev insights — we help you move faster."
          onSuccess={() => {
            // Dispatch event for popup to listen
            if (typeof window !== "undefined") {
              window.dispatchEvent(new Event("subscribe-success"));
            }
          }}
        />
      </div>
    </div>
  );
}