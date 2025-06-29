"use client"
import React, { useState } from "react";
import { BentoGrid, BentoGridItem } from "./ui/bento-grid";
import { urlFor } from "../sanity/lib/image"
import Image from "next/image";
import { motion } from "framer-motion";
import { CardContainer } from "@/components/ui/3d-card";
import Link from "next/link";
import { format } from "date-fns";
import type { BlogPost } from './BlogGrid';

// Helper function to truncate text
const truncateText = (text: string, maxLength: number = 150) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
};

interface BlogGridClientProps {
  posts: BlogPost[];
  displayLimit?: number;
  paddingTop?: string;
  title?: string;
  description?: string;
  isMainPage?: boolean;
}

const MotifSpeechBubble = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none"><ellipse cx="18" cy="16" rx="14" ry="10" fill="#a78bfa" fillOpacity="0.18"/><ellipse cx="18" cy="16" rx="12" ry="8" fill="#a78bfa" fillOpacity="0.25"/><ellipse cx="18" cy="16" rx="10" ry="6" fill="#fff" fillOpacity="0.12"/><path d="M12 28c2-2 4-2 6-2s4 0 6 2" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round"/></svg>
);
const MotifLightbulb = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><ellipse cx="16" cy="14" rx="10" ry="10" fill="#fff" fillOpacity="0.13"/><ellipse cx="16" cy="14" rx="8" ry="8" fill="#a78bfa" fillOpacity="0.22"/><path d="M16 24v4" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round"/><rect x="13" y="26" width="6" height="2" rx="1" fill="#a78bfa" fillOpacity="0.5"/></svg>
);
const MotifBook = () => (
  <svg width="38" height="32" viewBox="0 0 38 32" fill="none"><rect x="2" y="6" width="16" height="20" rx="3" fill="#a78bfa" fillOpacity="0.13"/><rect x="20" y="6" width="16" height="20" rx="3" fill="#a78bfa" fillOpacity="0.13"/><rect x="4" y="8" width="12" height="16" rx="2" fill="#fff" fillOpacity="0.13"/><rect x="22" y="8" width="12" height="16" rx="2" fill="#fff" fillOpacity="0.13"/></svg>
);
const MotifNote = () => (
  <svg width="28" height="36" viewBox="0 0 28 36" fill="none"><rect x="4" y="4" width="20" height="28" rx="3" fill="#a78bfa" fillOpacity="0.13"/><rect x="6" y="6" width="16" height="24" rx="2" fill="#fff" fillOpacity="0.13"/><path d="M8 12h12M8 16h8M8 20h10" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round"/></svg>
);
const MotifChat = () => (
  <svg width="34" height="34" viewBox="0 0 34 34" fill="none"><ellipse cx="17" cy="15" rx="13" ry="9" fill="#a78bfa" fillOpacity="0.13"/><ellipse cx="17" cy="15" rx="11" ry="7" fill="#fff" fillOpacity="0.13"/><ellipse cx="17" cy="15" rx="9" ry="5" fill="#a78bfa" fillOpacity="0.13"/><path d="M10 28c1.5-1.5 3-1.5 7-1.5s5.5 0 7 1.5" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round"/></svg>
);
const MotifQuestion = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><ellipse cx="16" cy="16" rx="12" ry="12" fill="#a78bfa" fillOpacity="0.13"/><ellipse cx="16" cy="16" rx="10" ry="10" fill="#fff" fillOpacity="0.13"/><path d="M16 22v2" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round"/><path d="M16 18c0-2 3-2 3-5a3 3 0 10-6 0" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round"/></svg>
);
const MotifPen = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><rect x="8" y="20" width="16" height="4" rx="2" fill="#a78bfa" fillOpacity="0.13"/><rect x="14" y="8" width="4" height="12" rx="2" fill="#a78bfa" fillOpacity="0.22"/><rect x="15" y="6" width="2" height="2" rx="1" fill="#fff" fillOpacity="0.22"/></svg>
);
const MotifGlobe = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none"><ellipse cx="18" cy="18" rx="14" ry="14" fill="#a78bfa" fillOpacity="0.13"/><ellipse cx="18" cy="18" rx="12" ry="12" fill="#fff" fillOpacity="0.13"/><ellipse cx="18" cy="18" rx="10" ry="10" fill="#a78bfa" fillOpacity="0.13"/><path d="M18 4v28M4 18h28" stroke="#a78bfa" strokeWidth="1.5"/><ellipse cx="18" cy="18" rx="7" ry="14" stroke="#a78bfa" strokeWidth="1.5"/></svg>
);
const MotifWifi = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><ellipse cx="16" cy="16" rx="14" ry="14" fill="#a78bfa" fillOpacity="0.13"/><ellipse cx="16" cy="16" rx="12" ry="12" fill="#fff" fillOpacity="0.13"/><path d="M8 20c2-2 6-2 8 0m-4 4c1-1 3-1 4 0" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round"/></svg>
);
const MotifEnvelope = () => (
  <svg width="36" height="28" viewBox="0 0 36 28" fill="none"><rect x="2" y="4" width="32" height="20" rx="4" fill="#a78bfa" fillOpacity="0.13"/><rect x="4" y="6" width="28" height="16" rx="2" fill="#fff" fillOpacity="0.13"/><path d="M4 6l14 10 14-10" stroke="#a78bfa" strokeWidth="1.5"/></svg>
);
const MotifClipboard = () => (
  <svg width="32" height="36" viewBox="0 0 32 36" fill="none"><rect x="6" y="8" width="20" height="24" rx="3" fill="#a78bfa" fillOpacity="0.13"/><rect x="10" y="4" width="12" height="6" rx="2" fill="#fff" fillOpacity="0.18"/><rect x="8" y="12" width="16" height="16" rx="2" fill="#fff" fillOpacity="0.13"/></svg>
);
const MotifStackPapers = () => (
  <svg width="38" height="32" viewBox="0 0 38 32" fill="none"><rect x="4" y="16" width="30" height="10" rx="2" fill="#a78bfa" fillOpacity="0.13"/><rect x="2" y="10" width="32" height="10" rx="2" fill="#fff" fillOpacity="0.13"/><rect x="6" y="4" width="28" height="10" rx="2" fill="#a78bfa" fillOpacity="0.13"/></svg>
);
const MotifLaptop = () => (
  <svg width="38" height="28" viewBox="0 0 38 28" fill="none"><rect x="6" y="6" width="26" height="12" rx="2" fill="#a78bfa" fillOpacity="0.13"/><rect x="2" y="20" width="34" height="4" rx="1" fill="#fff" fillOpacity="0.13"/><rect x="10" y="10" width="18" height="6" rx="1" fill="#fff" fillOpacity="0.13"/></svg>
);
const MotifMagnifier = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><ellipse cx="14" cy="14" rx="10" ry="10" fill="#a78bfa" fillOpacity="0.13"/><ellipse cx="14" cy="14" rx="8" ry="8" fill="#fff" fillOpacity="0.13"/><rect x="20" y="20" width="8" height="2" rx="1" transform="rotate(45 20 20)" fill="#a78bfa" fillOpacity="0.22"/></svg>
);
const MotifCalendar = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none"><rect x="4" y="8" width="28" height="22" rx="3" fill="#a78bfa" fillOpacity="0.13"/><rect x="8" y="12" width="20" height="14" rx="2" fill="#fff" fillOpacity="0.13"/><rect x="10" y="4" width="4" height="8" rx="2" fill="#a78bfa" fillOpacity="0.22"/><rect x="22" y="4" width="4" height="8" rx="2" fill="#a78bfa" fillOpacity="0.22"/></svg>
);
const MotifBrain = () => (
  <svg width="36" height="32" viewBox="0 0 36 32" fill="none"><ellipse cx="12" cy="16" rx="10" ry="12" fill="#a78bfa" fillOpacity="0.13"/><ellipse cx="24" cy="16" rx="10" ry="12" fill="#fff" fillOpacity="0.13"/><ellipse cx="18" cy="16" rx="8" ry="10" fill="#a78bfa" fillOpacity="0.13"/></svg>
);
const MotifStar = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><polygon points="16,4 20,14 31,14 22,20 25,30 16,24 7,30 10,20 1,14 12,14" fill="#a78bfa" fillOpacity="0.18"/></svg>
);
const MotifArrow = () => (
  <svg width="36" height="24" viewBox="0 0 36 24" fill="none"><path d="M4 12h28m0 0l-8-8m8 8l-8 8" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
);
// Typing effect motif (animated dots)
const MotifTyping = () => (
  <svg width="60" height="20" viewBox="0 0 60 20" fill="none">
    <circle cx="15" cy="10" r="4" fill="#a78bfa">
      <animate attributeName="opacity" values="0.3;1;0.3" dur="1.2s" repeatCount="indefinite" begin="0s"/>
    </circle>
    <circle cx="30" cy="10" r="4" fill="#a78bfa">
      <animate attributeName="opacity" values="0.3;1;0.3" dur="1.2s" repeatCount="indefinite" begin="0.4s"/>
    </circle>
    <circle cx="45" cy="10" r="4" fill="#a78bfa">
      <animate attributeName="opacity" values="0.3;1;0.3" dur="1.2s" repeatCount="indefinite" begin="0.8s"/>
    </circle>
  </svg>
);

const motifComponents = [
  MotifSpeechBubble,
  MotifLightbulb,
  MotifBook,
  MotifNote,
  MotifChat,
  MotifQuestion,
  MotifPen,
  MotifGlobe,
  MotifWifi,
  MotifEnvelope,
  MotifClipboard,
  MotifStackPapers,
  MotifLaptop,
  MotifMagnifier,
  MotifCalendar,
  MotifBrain,
  MotifStar,
  MotifArrow,
  MotifTyping,
];

const motifPositions = [
  { top: '10%', left: '8%' },
  { top: '20%', left: '70%' },
  { top: '35%', left: '30%' },
  { top: '50%', left: '80%' },
  { top: '65%', left: '15%' },
  { top: '78%', left: '60%' },
  { top: '15%', left: '50%' },
  { top: '40%', left: '60%' },
  { top: '60%', left: '35%' },
  { top: '80%', left: '75%' },
  { top: '12%', left: '40%' },
  { top: '30%', left: '85%' },
  { top: '55%', left: '10%' },
  { top: '70%', left: '50%' },
  { top: '85%', left: '30%' },
  { top: '25%', left: '20%' },
  { top: '45%', left: '75%' },
  { top: '60%', left: '80%' },
  { top: '88%', left: '50%' }, // Typing effect prominent
];

function MotifLayer() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {motifComponents.map((Motif, i) => (
        <motion.div
          key={`motif-${i}`}
          className="absolute"
          style={{ top: motifPositions[i].top, left: motifPositions[i].left }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4], y: [0, -10, 0] }}
          transition={{ duration: 6, delay: i * 0.3, repeat: Infinity, ease: "easeInOut" }}
        >
          <Motif />
        </motion.div>
      ))}
    </div>
  );
}

export function BlogGridClient({ posts, displayLimit, paddingTop, title, description, isMainPage = false }: BlogGridClientProps) {
  const [visibleItems, setVisibleItems] = useState(displayLimit ?? 7);

  const loadMore = () => {
    setVisibleItems(prev => prev + 7);
  };

  return (
    <div className={`min-h-screen ${displayLimit !== undefined ? 'bg-gradient-to-b from-black via-purple-950 to-black' : 'bg-gradient-to-b from-purple-950 to-black'} relative overflow-hidden`} style={{ paddingTop: paddingTop }}>
      <MotifLayer />

      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center pb-12 md:pb-20 px-4"
        >
          {isMainPage ? (
            <h1 className="text-3xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent md:mb-12">
              {title || 'Blog Posts'}
            </h1>
          ) : (
            <h2 className="text-3xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent md:mb-12">
              {title || 'Blog Posts'}
            </h2>
          )}
          <p className="text-neutral-300 text-base md:text-lg">
            {description || 'Exploring ideas and sharing knowledge'}
          </p>
        </motion.div>
        <div className="container mx-auto px-4">
    <div className="space-y-8">
      <BentoGrid className="">
        {posts.slice(0, visibleItems).map((post, i) => (
          <BentoGridItem
            key={post._id}
            title={<Link href={`/blog/${post.slug.current}`}><span className="text-purple-400 font-bold">{post.title}</span></Link>}
            description={<Link href={`/blog/${post.slug.current}`}><div className="hidden md:block text-white">{truncateText(post.excerpt)}</div></Link>}
            header={
              <div className="w-full h-full relative rounded-lg overflow-hidden">
                <Link href={`/blog/${post.slug.current}`}>
                {post.mainImage ? (
                  <Image
                    src={urlFor(post.mainImage).url()}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-neutral-900 flex items-center justify-center text-purple-400">
                    No Image
                  </div>
                )}
                </Link>
              </div>
            }
            icon={
              <div className="text-white text-sm">
                <Link href={`/blog/${post.slug.current}`}>
                {post.publishedAt ? format(new Date(post.publishedAt), 'MM/dd/yyyy') : 'No date'}
                </Link>
              </div>
            }
            className={
              `${i % 7 === 3 || i % 7 === 6 ? "md:col-span-2" : ""} bg-black/80 border border-purple-400/20 shadow-none`
            }
            layoutType={i % 7 === 3 ? 'header-left' : i % 7 === 6 ? 'header-right' : 'default'}
          />
        ))}
      </BentoGrid>
      
            {/* Show View All Blogs button if displayLimit is set and there are more posts */}
            {displayLimit !== undefined && posts.length > displayLimit && (
              <div className="col-span-1 md:col-span-2 lg:col-span-2 flex items-center justify-center">
                <CardContainer className="inter-var py-0 w-full h-full">
                  <div className="w-full h-full rounded-xl relative group flex items-center justify-center">
                    <Link
                      href="/blog"
                      className="w-[260px] h-[70px] flex items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500/60 via-purple-400/40 to-blue-500/40 backdrop-blur-md border-4 border-transparent [background-clip:padding-box] relative shadow-2xl group"
                      style={{
                        boxShadow: '0 4px 32px 0 rgba(168,85,247,0.25), 0 1.5px 0 0 #fff inset',
                      }}
                    >
                      <span className="text-white font-bold text-lg drop-shadow-lg tracking-wide pr-2">
                        View All Blogs
                      </span>
                      <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="ml-1 text-purple-200 group-hover:text-white transition-colors duration-200">
                        <path d="M7 14h14M15 10l6 4-6 4"/>
                      </svg>
                      <span className="absolute inset-0 rounded-2xl pointer-events-none border-4 border-transparent group-hover:border-purple-400 group-hover:shadow-[0_0_24px_4px_rgba(168,85,247,0.5)] transition-all duration-200" />
                    </Link>
                  </div>
                </CardContainer>
              </div>
            )}

            {/* Show Load More button if not using displayLimit and there are more posts */}
            {!displayLimit && visibleItems < posts.length && (
        <div className="flex justify-center">
          <button
            onClick={loadMore}
            className="px-6 py-2 bg-neutral-900 dark:bg-neutral-100 text-neutral-100 dark:text-neutral-900 rounded-lg hover:opacity-90 transition-opacity"
          >
            Load More
          </button>
        </div>
      )}
          </div>
        </div>
      </div>
    </div>
  );
} 