"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "@/hooks/use-outside-click";
import "@/styles/projects.css";
import { CardContainer, CardItem } from "@/components/ui/3d-card";
import { urlFor } from "@/sanity/lib/image";
import { FaGripfire } from "react-icons/fa";
import Image from "next/image";

// Type definitions
interface TechStackItem {
  name: string;
  icon: string;
}

interface Project {
  title: string;
  description: string;
  src?: string;
  ctaLink: string;
  ctaText: string;
  longDescription?: string;
  bulletPoints?: string[];
  techStack?: TechStackItem[];
}

interface ProjectCard extends Project {
  src: string; // Required after processing
}

interface ProjectsClientProps {
  projects: Project[];
  displayLimit?: number;
  isMainPage?: boolean;
}

export function ProjectsClient({
  projects: initialProjects,
  displayLimit,
  isMainPage = false,
}: ProjectsClientProps) {
  const [cards, setCards] = useState<ProjectCard[]>([]);
  const [active, setActive] = useState<ProjectCard | null>(null);
  const id = useId();
  const ref = useRef<HTMLDivElement>(null!);

  useEffect(() => {
    setCards(
      initialProjects.map((item: Project) => ({
        ...item,
        src: item.src ? urlFor(item.src).width(1000).height(1000).url() : "",
      }))
    );
  }, [initialProjects]);

  // Handle URL hash for direct project opening
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = decodeURIComponent(window.location.hash.slice(1));
      if (hash && cards.length > 0) {
        const projectToOpen = cards.find(card => card.title === hash);
        if (projectToOpen) {
          setActive(projectToOpen);
        }
      }
    }
  }, [cards]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActive(null);
      }
    }

    if (active) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-950 to-black py-24 relative overflow-hidden">
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `url("/themes/projects-background.svg")`,
          backgroundSize: "220px 220px",
        }}
      ></div>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm h-full w-full z-10"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active ? (
          <div className="fixed inset-0 flex items-center justify-center z-[100] p-4 md:p-8">
            {active && (
              <motion.div
                layoutId={`card-${active.title}-${id}`}
                ref={ref}
                className="w-full max-w-4xl h-full md:h-auto md:max-h-[90vh] flex flex-col md:flex-row bg-[#101010] sm:rounded-2xl overflow-hidden relative"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                  duration: 0.3,
                }}
              >
                <motion.button
                  key={`button-${active.title}-${id}`}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="absolute top-4 right-4 text-white bg-black/50 backdrop-blur-sm rounded-full h-8 w-8 flex items-center justify-center z-20 hover:bg-black/70 transition-colors"
                  onClick={() => setActive(null)}
                >
                  <CloseIcon />
                </motion.button>
                
                <div className="md:w-2/5 flex flex-col">
                  {active && (
                    <motion.div
                      layoutId={`image-${active.title}-${id}`}
                      className="h-60 md:h-auto flex-shrink-0"
                    >
                      <Image
                        width={600}
                        height={600}
                        src={active.src}
                        alt={active.title}
                        className="w-full h-full object-cover md:rounded-tl-2xl"
                      />
                    </motion.div>
                  )}
                   <div className="p-6 md:p-8 flex flex-col flex-grow justify-between bg-[#1a1a1a] md:rounded-bl-2xl">
                      {/* Tech Stack */}
                      {active.techStack && active.techStack.length > 0 && (
                        <div className="mt-0">
                          <h4 className="font-semibold text-neutral-200 mb-3">
                            Tech Stack
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {active.techStack.map(
                              (tech: TechStackItem, idx: number) => (
                                <span
                                  key={idx}
                                  className="px-3 py-1 rounded-full bg-purple-400/10 text-purple-400/90 text-xs md:text-sm border border-purple-400/20 flex items-center gap-2"
                                >
                                  {tech.icon && (
                                    <Image
                                      src={tech.icon}
                                      alt={tech.name}
                                      width={16}
                                      height={16}
                                      className="w-4 h-4"
                                    />
                                  )}
                                  {tech.name}
                                </span>
                              )
                            )}
                          </div>
                        </div>
                      )}
                      
                      {/* CTA Button */}
                      {active && (
                        <motion.a
                          layout
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.3 }}
                          href={active.ctaLink}
                          target="_blank"
                          className="mt-8 px-6 py-3 self-start text-sm md:text-base rounded-lg font-bold bg-purple-600 hover:bg-purple-700 text-white transition-colors flex items-center gap-2"
                        >
                          {active.ctaText}
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                        </motion.a>
                      )}
                   </div>
                </div>


                <div className="md:w-3/5 flex flex-col flex-grow overflow-hidden">
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    className="flex flex-col flex-grow p-6 md:p-8 text-white overflow-y-auto [scrollbar-width:thin] [scrollbar-color:#4f4f4f_#101010]"
                  >
                    {active && (
                      <motion.h3
                        layoutId={`title-${active.title}-${id}`}
                        className="font-bold text-2xl md:text-3xl text-purple-400"
                      >
                        {active.title}
                      </motion.h3>
                    )}
                    {active && (
                      <motion.p
                        layoutId={`description-${active.description}-${id}`}
                        className="text-purple-400/80 text-sm md:text-base mt-1"
                      >
                        {active.description}
                      </motion.p>
                    )}

                    <div className="h-px bg-white/10 my-6"></div>

                    {/* Detailed Description */}
                    {active.longDescription && (
                      <p className="text-neutral-300 text-sm md:text-base leading-relaxed">
                        {active.longDescription}
                      </p>
                    )}

                    {/* Bullet Points */}
                    {active.bulletPoints && active.bulletPoints.length > 0 && (
                      <ul className="list-none mt-4 flex flex-col gap-2">
                        {active.bulletPoints.map(
                          (point: string, idx: number) => (
                            <li
                              key={idx}
                              className="text-neutral-300 text-sm md:text-base leading-relaxed flex items-start gap-3"
                            >
                              <FaGripfire className="text-purple-400 mt-1 flex-shrink-0" />
                              <span>{point}</span>
                            </li>
                          )
                        )}
                      </ul>
                    )}
                  </motion.div>
                </div>
              </motion.div>
            )}
          </div>
        ) : null}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        {isMainPage ? (
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent mt-16">
            Projects
          </h1>
        ) : (
          <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent mt-16">
            Projects
          </h2>
        )}
      </motion.div>

      <div className="max-w-5xl mx-auto w-full px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {cards.slice(0, displayLimit).map((card) => {
            return (
              <div
                key={card.title}
                className="col-span-1"
                onClick={() => setActive(card)}
              >
                <CardContainer className="inter-var py-0">
                  <div className="w-full h-full rounded-xl relative group">
                    <div className="relative backdrop-blur-sm rounded-lg p-6 md:p-8 w-full">
                      <div className="relative z-10">
                        <CardItem
                          translateZ="50"
                          className="text-2xl font-bold text-purple-400"
                        >
                          {card.title}
                        </CardItem>
                        <CardItem
                          as="p"
                          translateZ="60"
                          className="text-purple-400/80 text-sm max-w-sm mt-3"
                        >
                          {card.description}
                        </CardItem>
                        <CardItem
                          translateZ="100"
                          rotateX={20}
                          rotateZ={-10}
                          className="w-full mt-6"
                        >
                          <Image
                            src={card.src}
                            height="1000"
                            width="1000"
                            className="h-72 w-full object-cover rounded-xl group-hover/card:shadow-xl"
                            alt={card.title}
                          />
                        </CardItem>
                        <div className="flex justify-between items-center mt-6">
                          <CardItem
                            translateZ={20}
                            translateX={-40}
                            as="a"
                            href={card.ctaLink}
                            target="_blank"
                            className="px-5 py-2.5 rounded-xl text-sm font-normal text-purple-400 hover:text-purple-300 transition-colors"
                          >
                            {card.ctaText} →
                          </CardItem>
                          <CardItem
                            translateZ={20}
                            translateX={40}
                            as="button"
                            onClick={(e: React.MouseEvent) => {
                              e.stopPropagation();
                              setActive(card);
                            }}
                            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold transition-colors"
                          >
                            View Details
                          </CardItem>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContainer>
              </div>
            );
          })}
          {/* "View All Projects" button */}
          {displayLimit !== undefined && cards.length > displayLimit && (
            <div className="col-span-1 md:col-span-2 lg:col-span-2 flex items-center justify-center">
              <CardContainer className="inter-var py-0 w-full h-full">
                <div className="w-full h-full rounded-xl relative group flex items-center justify-center">
                  <a
                    href="/projects"
                    className="w-[260px] h-[70px] flex items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500/60 via-purple-400/40 to-blue-500/40 backdrop-blur-md border-4 border-transparent [background-clip:padding-box] relative shadow-2xl group"
                    style={{
                      boxShadow:
                        "0 4px 32px 0 rgba(168,85,247,0.25), 0 1.5px 0 0 #fff inset",
                    }}
                  >
                    <span className="text-white font-bold text-lg drop-shadow-lg tracking-wide pr-2">
                      View All Projects
                    </span>
                    <svg
                      width="28"
                      height="28"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="ml-1 text-purple-200 group-hover:text-white transition-colors duration-200"
                    >
                      <path d="M7 14h14M15 10l6 4-6 4" />
                    </svg>
                    <span className="absolute inset-0 rounded-2xl pointer-events-none border-4 border-transparent group-hover:border-purple-400 group-hover:shadow-[0_0_24px_4px_rgba(168,85,247,0.5)] transition-all duration-200" />
                  </a>
                </div>
              </CardContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export const CloseIcon = () => {
  return (
    <motion.svg
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.05 } }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  );
};