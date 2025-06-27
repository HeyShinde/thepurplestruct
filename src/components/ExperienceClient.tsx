"use client"
import React, { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { FaGripfire } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";

const TimelineDot = () => (
  <div className="absolute left-0 top-0 -translate-x-1/2 w-4 h-4 rounded-full bg-gradient-to-r from-purple-400 to-purple-600 border-2 border-black" />
);

const TimelineLine = () => (
  <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-400/50 to-purple-600/50" />
);

const ExperienceCard = ({ date, title, company, description, skills, achievements, responsibilities }: {
  date?: string;
  title: string;
  company: string;
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
            <span className="block text-lg font-medium text-purple-300">{company}</span>
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
            <span className="block text-base font-medium text-purple-300">{company}</span>
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
                      {skill.icon && (
                        <Image 
                          src={skill.icon} 
                          alt={skill.name} 
                          width={16} 
                          height={16} 
                          className="w-4 h-4"
                          unoptimized={true}
                          onError={(e) => {
                            // Fallback to a default icon if the image fails to load
                            const target = e.target as HTMLImageElement;
                            target.src = '/icons/default-skill.svg';
                          }}
                        />
                      )}
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
              y: [0, -20, 0],
              rotate: [0, i % 2 === 0 ? 15 : -15, 0],
            }}
            transition={{
              duration: 4,
              delay: i * 0.3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      ))}

      {/* Data Lines */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={`line-${i}`}
          className="absolute h-px w-32 bg-gradient-to-r from-purple-400/0 via-purple-400/80 to-purple-400/0"
          style={{
            top: `${10 + i * 8}%`,
            left: `10%`,
            transformOrigin: 'left',
            transform: `rotate(${fixedAngles[i]}deg)`
          }}
          initial={{
            opacity: 0,
            scaleX: 0
          }}
          animate={{
            opacity: [0, 0.5, 0],
            scaleX: 1,
          }}
          transition={{
            duration: 5,
            delay: 2 + i * 0.4,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}

      {/* Data Points */}
      {fixedPositions.map((pos, i) => (
        <motion.div
          key={`point-${i}`}
          className="absolute w-2 h-2 rounded-full bg-purple-500"
          style={{
            top: pos.top,
            left: pos.left,
            boxShadow: '0 0 8px rgba(168, 85, 247, 0.7)',
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 2,
            delay: i * 0.1,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Diagonal Gradient Background */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(45deg, rgba(128, 0, 128, 0.05) 0%, rgba(128, 0, 128, 0) 50%, rgba(128, 0, 128, 0.05) 100%)',
        backgroundSize: '200% 200%',
        animation: 'diagonalGradient 10s ease infinite',
      }}/>
    </div>
  );
};

export function ExperienceClient({ experiences: initialExperiences, displayLimit, showBackground = true }: { experiences: any[], displayLimit?: number, showBackground?: boolean }) {
  const [experiences, setExperiences] = useState<any[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  useEffect(() => {
    setExperiences(initialExperiences);
  }, [initialExperiences]);

  const experiencesToDisplay = displayLimit ? experiences.slice(0, displayLimit) : experiences;

  return (
    <div className={showBackground ? "relative bg-gradient-to-b from-black via-purple-950 to-black text-white py-24" : "relative text-white py-24"}>
      {showBackground && <BackgroundEffect />}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
            Work Experience
          </h2>
          <p className="text-neutral-300 text-base md:text-lg mt-4">
            A timeline of my professional journey
          </p>
        </motion.div>
        <div ref={containerRef} className="relative">
          <TimelineLine />
          <div className="space-y-16 md:space-y-0">
            {experiencesToDisplay.map((experience: any, index: number) => (
              <ExperienceCard
                key={index}
                date={experience.date}
                title={experience.title}
                company={experience.company}
                description={experience.description}
                skills={experience.skills}
                achievements={experience.achievements}
                responsibilities={experience.responsibilities}
              />
            ))}
          </div>
        </div>
        {displayLimit && experiences.length > displayLimit && (
          <div className="mt-16 text-center">
            <Link href="/experience">
              <motion.div
                className="inline-block px-8 py-4 text-lg font-bold text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors duration-300 shadow-lg shadow-purple-500/50 cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View Full Timeline
              </motion.div>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
} 