import { NavBar } from "@/components/NavBar";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-purple-950 via-black to-black">
      <NavBar />
      <main className="flex-1 flex flex-col justify-center items-center w-full px-4 py-16">
        <h1 className="glitch text-7xl md:text-8xl font-bold text-white mb-4" data-text="404">404</h1>
        <h2 className="text-3xl md:text-4xl font-semibold text-purple-400 mb-4">Page Not Found</h2>
        <p className="text-lg text-neutral-300 mb-8 text-center max-w-xl">
          Oops! The page you are looking for does not exist or has been moved.
        </p>
        <Link href="/" className="inline-block px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-lg font-semibold shadow-md hover:from-purple-600 hover:to-purple-800 transition-all">
          Go to Homepage
        </Link>
      </main>
    </div>
  );
} 