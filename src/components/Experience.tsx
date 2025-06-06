"use client"
import React, { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { client } from "@/sanity/lib/client";
import { FaGripfire } from "react-icons/fa";
import Link from "next/link";

const TimelineDot = () => (
  <div className="absolute left-0 top-0 -translate-x-1/2 w-4 h-4 rounded-full bg-gradient-to-r from-purple-400 to-purple-600 border-2 border-black" />
);

const TimelineLine = () => (
  <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-400/50 to-purple-600/50" />
);

const ExperienceCard = ({ date, title, description, skills, achievements, responsibilities }: {
  date?: string;
  title: string;
  description: string;
  skills: { name: string; icon: string }[];
  achievements: string[];
  responsibilities: {
    title: string;
    description: string;
    impact: string;
  }[];
}) => {
  // Format date as 'Month Year'
  let displayDate = '';
  if (date) {
    const d = new Date(date);
    displayDate = d.toLocaleString('default', { month: 'long', year: 'numeric' });
  }
  return (
    <div className="flex justify-start pt-10 md:pt-40 md:gap-10">
      <div className="sticky flex flex-col md:flex-row z-40 items-center top-40 self-start max-w-xs lg:max-w-sm md:w-full">
        <div className="h-10 absolute left-3 md:left-3 w-10 rounded-full bg-black flex items-center justify-center">
          <div className="h-4 w-4 rounded-full bg-purple-400 border-2 border-black" />
        </div>
        <div className="hidden md:block md:pl-20">
          <h3 className="text-5xl font-bold text-purple-400 mb-2">
            {displayDate}
          </h3>
          <h4 className="text-2xl font-bold text-purple-400/80">
            {title}
          </h4>
        </div>
      </div>

      <div className="relative pl-20 pr-4 md:pl-4 w-full">
        <div className="md:hidden block mb-4">
          <h3 className="text-2xl font-bold text-purple-400 mb-2">
            {displayDate}
          </h3>
          <h4 className="text-xl font-bold text-purple-400/80">
            {title}
          </h4>
        </div>
        <div className="relative group -mx-4 md:mx-0">
          <div className="relative bg-black/80 backdrop-blur-sm rounded-lg p-4 md:p-6 w-full">
            <div className="absolute -inset-[1px] rounded-lg bg-gradient-to-r from-purple-400/0 via-purple-400/80 to-purple-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                 style={{
                   backgroundSize: '200% 100%',
                   animation: 'gradientMove 3s linear infinite',
                   mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                   maskComposite: 'exclude',
                   padding: '1px',
                 }} />
            <div className="absolute -inset-[1px] rounded-lg" 
                 style={{
                   background: 'linear-gradient(90deg, transparent 0%, rgba(168, 85, 247, 0.5) 50%, transparent 100%)',
                   backgroundSize: '200% 100%',
                   animation: 'gradientMove 3s linear infinite',
                   mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                   maskComposite: 'exclude',
                   padding: '1px',
                 }} />
            <div className="relative z-10">
              <p className="text-neutral-300 mb-6">{description}</p>
              
              {/* Skills Section */}
              <div className="mb-6">
                <h5 className="text-purple-400/80 font-semibold mb-3">Key Skills & Technologies</h5>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, idx) => (
                    <span key={idx} className="px-3 py-1 rounded-full bg-purple-400/10 text-purple-400/80 text-sm border border-purple-400/20 flex items-center gap-1">
                      {skill.icon && <img src={skill.icon} alt={skill.name} className="w-4 h-4" />}
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Achievements Section */}
              <div className="mb-6">
                <h5 className="text-purple-400/80 font-semibold mb-3">Key Achievements</h5>
                <ul className="space-y-2">
                  {achievements.map((achievement, idx) => (
                    <li key={idx} className="text-neutral-300 flex items-start">
                      <FaGripfire className="text-purple-400 mr-2 mt-1 flex-shrink-0" />
                      {achievement}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Key Responsibilities Section */}
              <div>
                <h5 className="text-purple-400/80 font-semibold mb-3">Key Responsibilities</h5>
                <div className="space-y-4">
                  {responsibilities.map((responsibility, idx) => (
                    <div key={idx} className="p-4 rounded-lg bg-black/40 border border-purple-400/10">
                      <h6 className="text-purple-400/90 font-medium mb-2">{responsibility.title}</h6>
                      <p className="text-neutral-300 text-sm mb-2">{responsibility.description}</p>
                      <p className="text-purple-400/60 text-sm italic">Impact: {responsibility.impact}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const BackgroundEffect = () => {
  const icons = [
    'tensorflow',
    'SageMaker',
    'pytorch',
    'python',
    'jupyter',
    'javascript',
    'docker',
    'cursor',
    'azure',
    'aws'
  ];

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes gradientMove {
        0% {
          background-position: 200% 0;
        }
        100% {
          background-position: -200% 0;
        }
      }
      @keyframes diagonalGradient {
        0% {
          background-position: 0% 0%;
        }
        100% {
          background-position: 200% 200%;
        }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Fixed angles for initial render
  const fixedAngles = [
    0, 45, 90, 135, 180, 225, 270, 315,
    30, 60, 120, 150
  ];

  // Fixed positions for data points
  const fixedPositions = [
    { top: '10%', left: '10%' },
    { top: '20%', left: '20%' },
    { top: '30%', left: '30%' },
    { top: '40%', left: '40%' },
    { top: '50%', left: '50%' },
    { top: '60%', left: '60%' },
    { top: '70%', left: '70%' },
    { top: '80%', left: '80%' },
    { top: '90%', left: '90%' },
    { top: '15%', left: '85%' },
    { top: '25%', left: '75%' },
    { top: '35%', left: '65%' },
    { top: '45%', left: '55%' },
    { top: '55%', left: '45%' },
    { top: '65%', left: '35%' },
    { top: '75%', left: '25%' },
    { top: '85%', left: '15%' },
    { top: '95%', left: '5%' },
    { top: '5%', left: '95%' },
    { top: '15%', left: '85%' },
    { top: '25%', left: '75%' },
    { top: '35%', left: '65%' },
    { top: '45%', left: '55%' },
    { top: '55%', left: '45%' },
    { top: '65%', left: '35%' }
  ];

  // Purple color filter for icons
  const purpleFilter = 'brightness(0) saturate(100%) invert(39%) sepia(57%) saturate(1234%) hue-rotate(230deg) brightness(89%) contrast(101%)';

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Neural Network Nodes */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={`node-${i}`}
          className="absolute w-4 h-4 rounded-full bg-purple-400/50 border-2 border-purple-500/70"
          style={{
            top: `${10 + i * 6}%`,
            left: `${5 + i * 7}%`,
            boxShadow: '0 0 20px rgba(168, 85, 247, 0.5)',
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.7, 0.5],
            y: [0, -15, 0],
          }}
          transition={{
            duration: 3,
            delay: i * 0.2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* ML Framework Icons */}
      {icons.map((icon, i) => (
        <motion.div
          key={`framework-${i}`}
          className="absolute"
          style={{
            top: `${15 + i * 8}%`,
            left: `${5 + (i % 3) * 30}%`,
          }}
        >
          <motion.img
            src={`/icons/${icon}.svg`}
            alt={`${icon} Icon`}
            className="w-12 h-12 opacity-50"
            style={{
              filter: purpleFilter
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
              rotate: [0, 5, 0],
              y: [0, -10, 0],
            }}
            transition={{
              duration: 4,
              delay: i * 0.2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      ))}

      {/* Neural Connections */}
      {fixedAngles.map((angle, i) => (
        <motion.div
          key={`connection-${i}`}
          className="absolute h-[2px] bg-gradient-to-r from-transparent via-purple-400/90 to-transparent"
          style={{
            top: `${15 + i * 5}%`,
            left: '0%',
            right: '0%',
            transform: `rotate(${angle}deg)`,
            filter: 'blur(0.5px)',
            boxShadow: '0 0 8px rgba(168, 85, 247, 0.5)',
          }}
          animate={{
            scaleX: [1, 1.2, 1],
            opacity: [0.6, 0.8, 0.6],
            rotate: [angle, angle + 10, angle],
          }}
          transition={{
            duration: 3,
            delay: i * 0.1,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Data Points */}
      {fixedPositions.map((pos, i) => (
        <motion.div
          key={`data-${i}`}
          className="absolute w-2 h-2 rounded-full bg-purple-400/60"
          style={{
            top: pos.top,
            left: pos.left,
          }}
          animate={{
            y: [0, -20, 0],
            x: [0, 15, 0],
            opacity: [0.5, 0.7, 0.5],
          }}
          transition={{
            duration: 3,
            delay: i * 0.1,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* AI Processing Waves */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`wave-${i}`}
          className="absolute"
          style={{
            top: `${30 + i * 8}%`,
            left: `${20 + i * 10}%`,
          }}
        >
          <svg width="60" height="20" viewBox="0 0 60 20">
            <path
              d="M0 10 Q15 0, 30 10 T60 10"
              stroke="rgba(168, 85, 247, 0.5)"
              strokeWidth="2"
              fill="none"
            />
            <motion.circle
              cx="30"
              cy="10"
              r="2"
              fill="rgba(168, 85, 247, 0.7)"
              animate={{
                cx: [0, 60, 0],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 4,
                delay: i * 0.3,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          </svg>
        </motion.div>
      ))}

      {/* Additional Icons in Different Positions */}
      {icons.map((icon, i) => (
        <motion.div
          key={`additional-${i}`}
          className="absolute"
          style={{
            top: `${60 + i * 6}%`,
            right: `${5 + (i % 3) * 30}%`,
          }}
        >
          <motion.img
            src={`/icons/${icon}.svg`}
            alt={`${icon} Icon`}
            className="w-8 h-8 opacity-40"
            style={{
              filter: purpleFilter
            }}
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.2, 0.4, 0.2],
              rotate: [0, 360],
            }}
            transition={{
              duration: 8,
              delay: i * 0.3,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </motion.div>
      ))}
    </div>
  );
};

export function Experience({ displayLimit }: { displayLimit?: number } = {}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsWrapperRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  const [experiences, setExperiences] = useState<any[]>([]);

  useEffect(() => {
    async function fetchExperiences() {
      const data = await client.fetch(`*[_type == "experience"] {
        date,
        title,
        description,
        skills,
        achievements,
        responsibilities
      }`);
      // Sort by date descending
      data.sort((a: any, b: any) => {
        if (a.date && b.date) {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        } else if (a.date) {
          return -1;
        } else if (b.date) {
          return 1;
        } else {
          return 0;
        }
      });
      setExperiences(data);
    }
    fetchExperiences();
  }, []);

  useEffect(() => {
    if (cardsWrapperRef.current) {
      const rect = cardsWrapperRef.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [experiences]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  // Limit experiences if displayLimit is provided
  const displayedExperiences = displayLimit ? experiences.slice(0, displayLimit) : experiences;
  const showFullButton = displayLimit && experiences.length > displayLimit;

  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      <BackgroundEffect />
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent mb-4">
            Experience
          </h2>
          <p className="text-neutral-300 text-lg">
            A journey through innovation in Machine Learning
          </p>
        </motion.div>
        <div ref={containerRef} className="relative">
          {/* Timeline Line - behind the cards */}
          <div
            style={{
              height: height + "px",
            }}
            className="absolute md:left-8 left-8 top-0 z-0 overflow-hidden w-[2px] bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-neutral-200 dark:via-neutral-700 to-transparent to-[99%] [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)]"
          >
            <motion.div
              style={{
                height: heightTransform,
                opacity: opacityTransform,
              }}
              className="absolute inset-x-0 top-0 w-[2px] bg-gradient-to-t from-purple-500 via-blue-500 to-transparent from-[0%] via-[10%] rounded-full"
            />
          </div>
          {/* Cards Wrapper */}
          <div ref={cardsWrapperRef} className="relative z-10">
            {displayedExperiences.map((exp, index) => (
              <ExperienceCard key={index} {...exp} />
            ))}
          </div>
          {/* Show Full Experience Button at the end of the line, outside the line container */}
          {showFullButton && (
            <div
              className="absolute left-8 md:left-8 z-30"
              style={{ bottom: '-2.5rem', width: '260px', height: '70px' }}
            >
              <Link
                href="/experience"
                className="w-full h-full flex items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500/60 via-purple-400/40 to-blue-500/40 backdrop-blur-md border-4 border-transparent [background-clip:padding-box] relative shadow-2xl group"
                style={{
                  boxShadow: '0 4px 32px 0 rgba(168,85,247,0.25), 0 1.5px 0 0 #fff inset',
                }}
              >
                <span className="text-white font-bold text-lg drop-shadow-lg tracking-wide pr-2">
                  Show Full Experience
                </span>
                <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="ml-1 text-purple-200 group-hover:text-white transition-colors duration-200">
                  <path d="M7 14h14M15 10l6 4-6 4"/>
                </svg>
                <span className="absolute inset-0 rounded-2xl pointer-events-none border-4 border-transparent group-hover:border-purple-400 group-hover:shadow-[0_0_24px_4px_rgba(168,85,247,0.5)] transition-all duration-200" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
