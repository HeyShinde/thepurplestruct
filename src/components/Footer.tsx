"use client"
import React, { useState } from 'react';
import Link from 'next/link';
import { ContactModal } from "./ContactModal";

const Footer = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [isContactOpen, setIsContactOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('Subscribing...');

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          tags: ['source:ml-footer'],
          formId: '6593057'
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage('✅ Subscription successful! Check your email inbox or spam to confirm.');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(`❌ ${data.error || 'Something went wrong. Please try again.'}`);
      }
    } catch {
      setStatus('error');
      setMessage('❌ An error occurred. Please try again later.');
    }
  };

  return (
    <>
      <div className="fixed inset-0 w-full h-full bg-gradient-to-b from-black to-purple-950 -z-10" />
      {/* Contact Modal */}
      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
      <footer className="w-full pt-16 pb-4 px-4 md:px-12 lg:px-24 bg-gradient-to-b from-black to-purple-950 text-white font-sans  shadow-[0_0_40px_0_rgba(168,85,247,0.10)] relative overflow-hidden">
        {/* Newsletter Section */}
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:justify-between lg:items-start gap-12 border-b border-purple-400/20 pb-12">
          <div className="flex-1 min-w-[300px]">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">Never miss what&apos;s next</h2>
            <form onSubmit={handleSubmit} className="flex flex-row flex-wrap items-center gap-2 w-full">
              <input
                type="email"
                id="footer-newsletter-email"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className="flex-1 min-w-0 bg-transparent border-b-2 border-purple-400/40 py-2 px-0 text-base lg:text-xl placeholder-purple-300 focus:outline-none focus:border-purple-400 transition-colors text-purple-100 font-mono"
                required
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="flex items-center gap-2 text-base lg:text-lg font-mono tracking-wider bg-gradient-to-r from-purple-400 to-purple-600 text-white px-4 py-2 rounded-lg shadow-md hover:from-purple-500 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                <span className="text-xl md:text-2xl">↳</span> {status === 'loading' ? 'SENDING...' : 'SUBMIT'}
              </button>
            </form>
            {message && (
              <p className={`text-sm mt-4 font-mono ${status === 'success' ? 'text-green-400' : status === 'error' ? 'text-red-400' : 'text-purple-400/80'}`}>
                {message}
              </p>
            )}
            <p className="text-purple-400/80 text-sm mt-4 max-w-lg font-mono">
              By submitting your email, you&apos;ll be the first to know about upcoming updates for Made With Gsap. You can unsubscribe at any time.
            </p>
          </div>
          {/* Links Section */}
          <div className="w-full grid grid-cols-2 md:grid-cols-3 flex-1 flex-row justify-between gap-y-8 mt-8">
            {/* SOCIAL */}
            <div className="mb-8 min-w-[120px]">
              <p className="text-purple-400/80 font-bold font-mono mb-3 tracking-widest">SOCIAL</p>
              <ul className="space-y-3 font-mono text-sm lg:text-xs">
                <li><a href="https://www.x.com/heyshinde" className="hover:underline text-purple-400/80 hover:text-purple-400 transition-colors">X(TWITTER)</a></li>
                <li><a href="https://www.linkedin.com/in/heyshinde" className="hover:underline text-purple-400/80 hover:text-purple-400 transition-colors">LINKEDIN</a></li>
                <li><a href="https://github.com/heyshinde" className="hover:underline text-purple-400/80 hover:text-purple-400 transition-colors">GITHUB</a></li>
                <li><a href="https://www.instagram.com/heyshinde" className="hover:underline text-purple-400/80 hover:text-purple-400 transition-colors">INSTAGRAM</a></li>
              </ul>
            </div>
            {/* PAGES */}
            <div className="mb-8 min-w-[120px]">
              <p className="text-purple-400/80 font-bold font-mono mb-3 tracking-widest">PAGES</p>
              <ul className="space-y-3 font-mono text-sm lg:text-xs">
                <li><Link href="/" className="hover:underline text-purple-400/80 hover:text-purple-400 transition-colors">HOME</Link></li>
                <li><Link href="/projects" className="hover:underline text-purple-400/80 hover:text-purple-400 transition-colors">PROJECTS</Link></li>
                <li><Link href="/courses" className="hover:underline text-purple-400/80 hover:text-purple-400 transition-colors">COURSES</Link></li>
                <li><Link href="/blog" className="hover:underline text-purple-400/80 hover:text-purple-400 transition-colors">BLOG</Link></li>
              </ul>
            </div>
            <div className="mb-8 min-w-[120px]">
              <p className="text-purple-400/80 font-bold font-mono mb-3 tracking-widest">FEED</p>
              <ul className="space-y-3 font-mono text-sm lg:text-xs">
                  <li><Link href="/rss.xml" className="hover:underline text-purple-400/80 hover:text-purple-400 transition-colors">RSS</Link></li>
                  <li><Link href="/atom.xml" className="hover:underline text-purple-400/80 hover:text-purple-400 transition-colors">ATOM</Link></li>
                  <li><Link href="/feed.json" className="hover:underline text-purple-400/80 hover:text-purple-400 transition-colors">JSON</Link></li>
                </ul>
            </div>
            {/* CONTACT (spans full width on mobile, right column in grid) */}
            {/* <div className="mb-8 min-w-[120px]">
              <p className="text-purple-400/80 font-bold font-mono mb-3 tracking-widest">CONTACT</p>
              <ul className="space-y-3 font-mono text-sm lg:text-xs">
                <li><button onClick={() => setIsContactOpen(true)} className="hover:underline text-purple-400/80 hover:text-purple-400 transition-colors">REACH ME</button></li>
              </ul>
            </div> */}
          </div>
        </div>
        {/* Bottom Section */}
        <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row lg:items-end lg:justify-between mt-8">
          {/* Crafted with Code, Driven by Data.: full width and center on mobile, right on desktop */}
          <div className="w-full lg:w-auto order-1 lg:order-2 text-[clamp(1.5rem,8vw,3.5rem)] min-[1135px]:text-[clamp(1.5rem,8vw,4.2rem)] font-bold leading-none bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent font-sans tracking-tight text-center lg:text-right select-none mb-2 lg:mb-0">
          Crafted with Code, Driven by Data.
          </div>
          {/* Bottom row: left on desktop, full width on mobile */}
          <div className="w-full lg:w-auto order-2 lg:order-1 flex flex-row justify-between lg:justify-start items-center text-xs font-mono text-purple-400/80 gap-x-4 lg:gap-x-16 mb-2 lg:mb-0">
            <span>©2025</span>
            <Link href="/privacy" className="hover:underline hover:text-purple-400 transition-colors">PRIVACY</Link>
            <a href="mailto:hello@heyshinde.com" className="hover:underline hover:text-purple-400 transition-colors">EMAIL</a>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer; 