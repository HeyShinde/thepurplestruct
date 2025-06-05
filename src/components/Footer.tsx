import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full pt-16 pb-4 px-4 md:px-12 lg:px-24 bg-[#0000] text-white font-sans"> 
      {/* Newsletter Section */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:justify-between md:items-start gap-12 border-b border-[#222] pb-12">
        <div className="flex-1 min-w-[300px]">
          <h2 className="text-4xl md:text-5xl font-medium mb-6 leading-tight">Never miss what's next</h2>
          <form className="flex flex-row items-center gap-2 w-full max-w-xl">
            <input
              type="email"
              placeholder="Your email"
              className="w-full bg-transparent border-b border-[#444] py-2 px-0 text-base md:text-xl placeholder-gray-300 focus:outline-none focus:border-white transition-colors"
            />
            <button
              type="submit"
              className="flex items-center gap-2 text-base md:text-lg font-mono tracking-wider"
            >
              <span className="text-xl md:text-2xl">↳</span> SUBMIT
            </button>
          </form>
          <p className="text-gray-400 text-sm mt-4 max-w-lg">
            By submitting your email, you'll be the first to know about upcoming updates for Made With Gsap. You can unsubscribe at any time.
          </p>
        </div>
        {/* Links Section */}
        <div className="flex-1 w-full grid grid-cols-2 md:flex md:flex-row md:justify-between gap-y-8 gap-x-4 mt-8 md:mt-0">
          {/* SOCIAL */}
          <div className="mb-8 md:mb-0 min-w-[120px] flex-1">
            <h4 className="text-gray-400 font-mono mb-3 tracking-widest">SOCIAL</h4>
            <ul className="space-y-1 font-mono text-sm md:text-xs">
              <li><a href="#" className="hover:underline">X(TWITTER)</a></li>
              <li><a href="#" className="hover:underline">INSTAGRAM</a></li>
              <li><a href="#" className="hover:underline">BLUESKY</a></li>
              <li><a href="#" className="hover:underline">LINKEDIN</a></li>
            </ul>
          </div>
          {/* PAGES */}
          <div className="mb-8 md:mb-0 min-w-[120px] flex-1">
            <h4 className="text-gray-400 font-mono mb-3 tracking-widest">PAGES</h4>
            <ul className="space-y-1 font-mono text-sm md:text-xs">
              <li><a href="#" className="hover:underline">HOME</a></li>
              <li><a href="#" className="hover:underline">COLLECTION</a></li>
              <li><a href="#" className="hover:underline">FAQ</a></li>
              <li><a href="#" className="hover:underline">PRICING</a></li>
            </ul>
          </div>
          {/* CONTACT (spans full width on mobile, right column in grid) */}
          <div className="col-span-2 md:col-span-1 mb-0 md:mb-0 min-w-[120px] flex-1">
            <h4 className="text-gray-400 font-mono mb-3 tracking-widest">CONTACT</h4>
            <ul className="space-y-1 font-mono text-sm md:text-xs">
              <li><a href="#" className="hover:underline">REACH  US</a></li>
            </ul>
          </div>
        </div>
      </div>
      {/* Bottom Section */}
      <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row md:items-end md:justify-between mt-8">
        {/* Made With Gsap: full width and center on mobile, right on desktop */}
        <div className="w-full md:w-auto order-1 md:order-2 text-[clamp(2.5rem,8vw,5.5rem)] font-medium leading-none text-white font-sans tracking-tight text-center md:text-right select-none mb-2 md:mb-0">
          Made With Gsap
        </div>
        {/* Bottom row: left on desktop, full width on mobile */}
        <div className="w-full md:w-auto order-2 md:order-1 flex flex-row justify-between md:justify-start items-center text-xs font-mono text-gray-300 gap-x-4 md:gap-x-16 mb-2 md:mb-0">
          <span>2025©</span>
          <a href="#" className="hover:underline">PERMISSIONS & TERMS</a>
          <a href="#" className="hover:underline">PRIVACY POLICY</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 