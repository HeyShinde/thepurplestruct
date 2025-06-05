"use client";
import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { LinkPreview } from "@/components/ui/link-preview";
import { Vortex } from "@/components/ui/vortex";
import * as Collapsible from '@radix-ui/react-collapsible';
import { FaGripfire } from "react-icons/fa";
import { IoChevronDown } from "react-icons/io5";
import { useOutsideClick } from "@/hooks/use-outside-click";
import { CloseIcon } from "@/components/Projects"; // Reusing CloseIcon from Projects

// Define the type for research papers
interface ResearchPaper {
  title: string;
  url: string;
  doi?: string;
  authors: string;
  year: number;
  venue: string;
  abstract?: string;
  longDescription?: string; // Added long description field
  bulletPoints?: string[]; // Added bullet points field
}

// Example research papers data (replace with your actual data and add long descriptions/bullet points)
const researchPapers: ResearchPaper[] = [
  {
    title: "Revisiting the CMB homogeneity scale: low multipole alignments and effective field theory in string gas cosmology",
    url: "https://arxiv.org/abs/2306.00219",
    doi: "10.1016/j.jlist.2024.101135",
    authors: "Your Name, Co-author 1, Co-author 2",
    year: 2024,
    venue: "Conference/Journal Name",
    abstract: "A brief description of the research paper and its key findings...",
    longDescription: "This research paper delves into the cosmic microwave background (CMB) homogeneity scale... [Insert detailed long description here]",
    bulletPoints: [
      "Investigates low multipole alignments in CMB data.",
      "Applies effective field theory methods.",
      "Examines implications for string gas cosmology models.",
    ],
  },
  {
    title: "Another Example Research Paper",
    url: "https://example.com/another-paper",
    doi: "10.1234/example.2023.123",
    authors: "Your Name, Co-author A",
    year: 2023,
    venue: "Another Conference/Journal",
    abstract: "Abstract for the second paper...",
    longDescription: "Detailed long description for the second paper... [Insert detailed long description here]",
    bulletPoints: [
      "Key finding 1 of the second paper.",
      "Key finding 2 of the second paper.",
    ],
  },
  // Add more research papers here
];

// Component to display a single research paper card
const ResearchCard = ({ paper }: { paper: ResearchPaper }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative bg-black/80 backdrop-blur-sm rounded-lg p-4 md:p-6 w-full max-w-3xl mx-auto mb-8"
    >
      <div className="absolute -inset-[1px] rounded-lg bg-gradient-to-r from-purple-400/0 via-purple-400/80 to-purple-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
           style={{
             backgroundSize: '200% 100%',
             animation: 'gradientMove 3s linear infinite',
             mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
             maskComposite: 'exclude',
             padding: '1px',
           }} />
      <div className="relative z-10">
        <Collapsible.Root open={isOpen} onOpenChange={setIsOpen}>
          <div className="flex items-start justify-between">
            <div 
              className="flex-grow cursor-pointer"
              onClick={() => setIsOpen(!isOpen)}
            >
              <LinkPreview
                url={paper.url}
                className="text-xl font-semibold text-purple-400 hover:text-purple-300 transition-colors"
              >
                {paper.title}
              </LinkPreview>

              <p className="text-neutral-300 mt-2 text-sm">
                {paper.authors}
              </p>

              <div className="flex items-center gap-4 mt-2 text-sm">
                <span className="text-neutral-400">
                  {paper.venue} • {paper.year}
                </span>
              </div>
              {paper.doi && (
                <p className="text-sm mt-1 text-neutral-400">
                  <a
                    href={`https://doi.org/${paper.doi}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-400 hover:text-purple-300 transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    DOI: {paper.doi}
                  </a>
                </p>
              )}

              {paper.abstract && (
                <p className="text-neutral-400 mt-4 text-sm leading-relaxed">
                  {paper.abstract}
                </p>
              )}
            </div>
            <Collapsible.Trigger asChild>
              <button className="ml-4 p-2 rounded-full hover:bg-purple-500/10 transition-colors">
                <IoChevronDown 
                  className={`w-6 h-6 text-purple-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                />
              </button>
            </Collapsible.Trigger>
          </div>

          <Collapsible.Content
            className="mt-6 overflow-hidden transition-all duration-300 ease-in-out data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down"
          >
            {paper.longDescription && (
              <p className="text-sm md:text-base leading-relaxed mb-6 text-neutral-300">
                {paper.longDescription}
              </p>
            )}

            {paper.bulletPoints && paper.bulletPoints.length > 0 && (
              <div className="mb-6">
                <h4 className="font-semibold text-neutral-300 mb-3">Key Findings:</h4>
                <ul className="list-disc list-inside ml-4 flex flex-col gap-3 text-sm md:text-base leading-relaxed text-neutral-300">
                  {paper.bulletPoints.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <FaGripfire size={16} strokeWidth={1.5} fill="currentColor" className="text-purple-400 mt-1 flex-shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-6 pt-6 border-t border-neutral-700">
              <a
                href={paper.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-3 text-sm rounded-full font-bold bg-purple-600 hover:bg-purple-700 text-white"
              >
                View Paper
              </a>
            </div>
          </Collapsible.Content>
        </Collapsible.Root>
      </div>
    </motion.div>
  );
};

export function Research() {
  const [activePaper, setActivePaper] = useState<ResearchPaper | null>(null);
  const id = useId();
  const overlayRef = useRef<HTMLDivElement>(null!);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActivePaper(null);
      }
    }

    if (activePaper) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activePaper]);

  useOutsideClick(overlayRef, () => setActivePaper(null));

  return (
    <Vortex
      backgroundColor="black"
      className="flex items-center flex-col justify-start px-4 md:px-10 pt-16 pb-12 w-full"
      containerClassName="flex items-center flex-col justify-start min-h-screen bg-gradient-to-b from-black to-purple-950"
    >
      {/* Expanded Paper Overlay */}
      <AnimatePresence>
        {activePaper && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 h-full w-full z-50 flex items-center justify-center"
          >
            <motion.div
              layoutId={`research-card-${activePaper.title}-${id}`}
              ref={overlayRef}
              className="w-full max-w-3xl max-h-[90vh] flex flex-col bg-black rounded-lg overflow-hidden relative p-4 md:p-8"
              transition={{
                type: "spring",
                stiffness: 150,
                damping: 40,
              }}
            >
              {/* Close Button */}
              <motion.button
                key={`close-button-${activePaper.title}-${id}`}
                layout
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                exit={{
                  opacity: 0,
                  transition: {
                    duration: 0.05,
                  },
                }}
                className="flex absolute top-4 right-4 items-center justify-center bg-white rounded-full h-8 w-8 z-50"
                onClick={() => setActivePaper(null)}
              >
                <CloseIcon />
              </motion.button>

              {/* Expanded Content */}
              <div className="flex flex-col flex-grow overflow-y-auto p-4 md:p-6 text-white">
                <motion.h3
                  layoutId={`research-title-${activePaper.title}-${id}`}
                  className="font-bold text-xl md:text-2xl text-purple-400 mb-2"
                >
                  {activePaper.title}
                </motion.h3>
                <p className="text-neutral-300 text-xs md:text-sm mb-2">
                  {activePaper.authors} • {activePaper.venue} • {activePaper.year}
                </p>
                {activePaper.doi && (
                    <p className="text-xs md:text-sm mt-1 text-neutral-300">
                    <a
                      href={`https://doi.org/${activePaper.doi}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      DOI: {activePaper.doi}
                    </a>
                    </p>
                  )}

                {activePaper.longDescription && (
                  <motion.p
                    layoutId={`research-abstract-${activePaper.abstract}-${id}`}
                    className="text-sm md:text-base leading-relaxed mb-6"
                  >
                    {activePaper.longDescription}
                  </motion.p>
                )}

                {activePaper.bulletPoints && activePaper.bulletPoints.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-semibold text-neutral-300 mb-3">Key Findings:</h4>
                    <ul className="list-disc list-inside ml-4 flex flex-col gap-3 text-sm md:text-base leading-relaxed">
                      {activePaper.bulletPoints.map((point, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <FaGripfire size={16} strokeWidth={1.5} fill="currentColor" className="text-purple-400 mt-1 flex-shrink-0" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                 {/* Link to the paper */}
                <div className="mt-auto pt-6 border-t border-neutral-700">
                     <a
                        href={activePaper.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block px-6 py-3 text-sm rounded-full font-bold bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        View Paper
                      </a>
                 </div>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Research Section Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center pb-12 md:pb-20 px-4"
      >
        <h2 className="text-3xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent mb-8 md:mb-12">
          Research Publications
        </h2>
        <p className="text-neutral-300 text-base md:text-lg">
          Exploring the frontiers of AI and Machine Learning
        </p>
      </motion.div>

      {/* Spacer Div */}
      <div className="h-12 md:h-20"></div>

      {/* Container for research cards */}
      <div className="w-full max-w-4xl mx-auto relative z-10">
        {researchPapers.map((paper, index) => (
          <ResearchCard key={index} paper={paper} />
        ))}
      </div>
    </Vortex>
  );
}
