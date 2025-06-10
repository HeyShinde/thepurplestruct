"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "@/hooks/use-outside-click";
import "@/styles/projects.css";
import { CardContainer, CardItem } from "@/components/ui/3d-card";
import { urlFor } from "@/sanity/lib/image";
import { FaGripfire } from "react-icons/fa";
import Image from "next/image";

export function ProjectsClient({
  projects: initialProjects,
  displayLimit,
}: {
  projects: any[];
  displayLimit?: number;
}) {
  const [cards, setCards] = useState<any[]>([]);
  const [active, setActive] = useState<any | boolean | null>(null);
  const id = useId();
  const ref = useRef<HTMLDivElement>(null!);

  useEffect(() => {
    setCards(
      initialProjects.map((item: any) => ({
        ...item,
        src: item.src ? urlFor(item.src).width(1000).height(1000).url() : "",
      }))
    );
  }, [initialProjects]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActive(false);
      }
    }

    if (active && typeof active === "object") {
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
        {active && typeof active === "object" && (
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
        {active && typeof active === "object" ? (
          <div className="fixed inset-0 flex items-center justify-center z-[100] p-4">
            {active && typeof active === "object" && (
              <motion.button
                key={`button-${active.title}-${id}`}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="flex absolute top-2 right-2 lg:hidden items-center justify-center bg-white rounded-full h-6 w-6"
                style={{ zIndex: 120 }}
                onClick={() => setActive(null)}
              >
                <CloseIcon />
              </motion.button>
            )}
            {active && typeof active === "object" && (
              <motion.div
                layoutId={`card-${active.title}-${id}`}
                ref={ref}
                className="w-full max-w-[500px] h-full max-h-[95vh] md:max-h-[90%] flex flex-col bg-black sm:rounded-3xl overflow-hidden"
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
                {active && typeof active === "object" && (
                  <motion.div
                    layoutId={`image-${active.title}-${id}`}
                    className="h-80 lg:h-80 flex-shrink-0 z-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                  >
                    <Image
                      width={600}
                      height={400}
                      src={active.src}
                      alt={active.title}
                      className="w-full h-full object-cover object-top sm:rounded-tr-lg sm:rounded-tl-lg"
                    />
                  </motion.div>
                )}

                <div className="flex flex-col flex-grow overflow-hidden">
                  {/* Header area with title, description, and CTA button */}
                  {active && typeof active === "object" && (
                    <motion.div
                      className="flex justify-between items-start p-4 flex-shrink-0"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                    >
                      <div className="">
                        {active && typeof active === "object" && (
                          <motion.h3
                            layoutId={`title-${active.title}-${id}`}
                            className="font-medium text-purple-400 text-base"
                          >
                            {active.title}
                          </motion.h3>
                        )}
                        {active && typeof active === "object" && (
                          <motion.p
                            layoutId={`description-${active.description}-${id}`}
                            className="text-purple-400/80 text-base"
                          >
                            {active.description}
                          </motion.p>
                        )}
                      </div>

                      {active && typeof active === "object" && (
                        <motion.a
                          layout
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ duration: 0.2, delay: 0.3 }}
                          href={active.ctaLink}
                          target="_blank"
                          className="px-4 py-3 text-sm rounded-full font-bold bg-purple-600 hover:bg-purple-700 text-white transition-colors"
                        >
                          {active.ctaText}
                        </motion.a>
                      )}
                    </motion.div>
                  )}

                  {/* Scrollable detailed content area */}
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.3, delay: 0.4 }}
                    className="text-white text-xs md:text-sm lg:text-base flex-grow overflow-y-auto px-4 pb-10 flex flex-col items-start gap-4 [scrollbar-width:none] [-ms-overflow-style:none]"
                  >
                    {/* Detailed Description */}
                    {active.longDescription && (
                      <p className="text-sm md:text-base leading-relaxed">
                        {active.longDescription}
                      </p>
                    )}

                    {/* Bullet Points */}
                    {active.bulletPoints && active.bulletPoints.length > 0 && (
                      <ul className="list-none ml-4 flex flex-col gap-2">
                        {active.bulletPoints.map(
                          (point: string, idx: number) => (
                            <li
                              key={idx}
                              className="text-sm md:text-base leading-relaxed flex items-center gap-2"
                            >
                              <FaGripfire className="text-purple-400" />
                              {point}
                            </li>
                          )
                        )}
                      </ul>
                    )}

                    {/* Tech Stack Icons/Badges */}
                    {active.techStack && active.techStack.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-neutral-300 mb-2">
                          Tech Stack:
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {active.techStack.map(
                            (
                              tech: { name: string; icon: string },
                              idx: number
                            ) => (
                              <span
                                key={idx}
                                className="px-3 py-1 rounded-full bg-purple-400/10 text-purple-400/80 text-sm border border-purple-400/20 flex items-center gap-1"
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
        <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent mt-16">
          Projects
        </h2>
      </motion.div>

      <div className="max-w-5xl mx-auto w-full px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {cards.slice(0, displayLimit).map((card, index) => {
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
