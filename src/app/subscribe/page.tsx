import React from 'react';
import SubscribeForm from '@/components/SubscribeForm';
import { NavBar } from '@/components/NavBar';

export default function SubscribePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-purple-950 via-black to-black">
      <NavBar />
      <main className="flex flex-1 flex-col items-center justify-center px-2 sm:px-4 py-8 sm:py-16">
  <div className="max-w-2xl w-full flex flex-col items-center bg-black/60 rounded-2xl shadow-lg p-4 sm:p-8 md:p-12">
    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-center bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
      Subscribe to the HeyShinde&apos;s Newsletter
    </h1>
    <p className="text-sm sm:text-base md:text-lg text-purple-200 mb-6 sm:mb-8 text-center max-w-xl">
    Fresh content. Open-source drops. Deep dives into ML, AI & engineering.
    </p>
    <div className="w-full">
      <SubscribeForm/>
    </div>
  </div>
</main>
    </div>
  );
} 