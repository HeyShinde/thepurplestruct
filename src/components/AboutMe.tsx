"use client";
import React from "react";
import { ContainerScroll } from "./ui/container-scroll-animation";
import { motion } from "framer-motion";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { FaDownload, FaHandSparkles, FaTerminal, FaCode, FaMicrochip, FaDatabase, FaCodeBranch, FaServer } from "react-icons/fa";
import Image from "next/image";

const BackgroundMotif = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Modern grid pattern */}
      <div className="absolute inset-0 opacity-50">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(to right, rgba(168,85,247,0.2) 1px, transparent 1px),
                           linear-gradient(to bottom, rgba(168,85,247,0.2) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }} />
      </div>

      {/* Animated diagonal lines */}
      <div className="absolute inset-0 opacity-60">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={`diagonal-${i}`}
            className="absolute h-[2px] bg-gradient-to-r from-transparent via-purple-400 to-transparent shadow-[0_0_15px_rgba(168,85,247,0.5)]"
            style={{
              top: `${20 + i * 20}%`,
              left: '-10%',
              right: '-10%',
              transform: 'rotate(45deg)',
            }}
            animate={{
              scaleX: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 3,
              delay: i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Floating geometric shapes */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`shape-${i}`}
          className="absolute"
          style={{
            top: `${30 + i * 20}%`,
            left: `${20 + i * 25}%`,
          }}
        >
          <motion.div
            className="w-16 h-16 border-2 border-purple-400/50 shadow-[0_0_20px_rgba(168,85,247,0.3)]"
            style={{
              transform: 'rotate(45deg)',
            }}
            animate={{
              rotate: [0, 360],
              scale: [1, 1.1, 1],
              opacity: [0.4, 0.7, 0.4],
            }}
            transition={{
              duration: 8,
              delay: i * 0.5,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </motion.div>
      ))}

      {/* Modern nodes with connections */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={`node-${i}`}
          className="absolute"
          style={{
            top: `${25 + i * 15}%`,
            left: `${15 + i * 20}%`,
          }}
        >
          <motion.div
            className="w-3 h-3 rounded-full bg-purple-400/70 shadow-[0_0_15px_rgba(168,85,247,0.6)]"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.6, 0.9, 0.6],
            }}
            transition={{
              duration: 2,
              delay: i * 0.3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          {/* Connection lines */}
          <motion.div
            className="absolute w-24 h-[2px] bg-gradient-to-r from-purple-400/60 to-transparent shadow-[0_0_10px_rgba(168,85,247,0.4)]"
            style={{
              top: '50%',
              left: '100%',
              transform: 'translateY(-50%)',
            }}
            animate={{
              scaleX: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 2,
              delay: i * 0.3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      ))}

      {/* Animated circles */}
      {[...Array(2)].map((_, i) => (
        <motion.div
          key={`circle-${i}`}
          className="absolute"
          style={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <motion.div
            className="w-[300px] h-[300px] rounded-full border-2 border-purple-400/40 shadow-[0_0_30px_rgba(168,85,247,0.2)]"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 4,
              delay: i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      ))}

      {/* Floating particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute w-2 h-2 rounded-full bg-purple-400/60 shadow-[0_0_10px_rgba(168,85,247,0.5)]"
          style={{
            top: `${10 + i * 10}%`,
            left: `${5 + i * 12}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 3,
            delay: i * 0.2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

export function AboutMe() {
  return (
    <div className="relative bg-black overflow-hidden">
      <BackgroundMotif />
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col overflow-hidden">
          <ContainerScroll
            titleComponent={
              <>
                <span className="font-heading text-4xl md:text-[6rem] font-bold mt-1 leading-none bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                About Me
                </span>
              </>
            }
          >
            <Image
              src={`/images/profile-img.webp`}
              alt="hero"
              height={720}
              width={1400}
              className="mx-auto rounded-2xl object-cover h-full object-[20%_center]"
              draggable={false}
            />
          </ContainerScroll>
        </div>

        <div className="flex flex-col justify-center space-y-8 px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <Card className="p-0 bg-black/40 backdrop-blur-sm border-purple-400/20 hover:border-purple-400/40 transition-all duration-300 overflow-hidden">
              {/* Terminal Header */}
              <div className="bg-purple-900/50 px-4 py-2 flex items-center gap-2 border-b border-purple-400/20">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
                  <div className="w-3 h-3 rounded-full bg-green-400/80" />
                </div>
                <FaTerminal className="w-4 h-4 text-purple-400 ml-2" />
                <span className="text-purple-400 text-sm font-code">terminal@ml-engineer</span>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <FaHandSparkles className="w-6 h-6 text-purple-400" />
                  <h2 className="font-code text-4xl md:text-[2rem] font-bold leading-tight bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                    ML Engineer & AI Researcher
                  </h2>
                </div>
                
                <div className="space-y-6">
                  <div className="relative">
                    <div className="absolute -left-4 top-0 bottom-0 w-1 bg-purple-400/20 rounded-full" />
                    <p className="font-body text-lg md:text-xl font-medium text-purple-400 pl-4 italic">
                      Building the future of AI, one model at a time.
                    </p>
                  </div>
                  
                  <div className="space-y-4 text-gray-300">
                    <div className="flex items-start gap-2">
                      <span className="text-purple-400">&gt;</span>
                      <p className="font-body text-base md:text-lg leading-relaxed">
                        As an aspiring Machine Learning Engineer, I specialize in developing and deploying Large Language Models (LLMs) and building agentic AI systems. My expertise spans across ML Ops, CI/CD pipelines, and scalable model deployment architectures.
                      </p>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <span className="text-purple-400">&gt;</span>
                      <p className="font-body text-base md:text-lg leading-relaxed">
                        My technical toolkit includes deep learning frameworks, vector databases, and modern ML infrastructure. I'm particularly interested in fine-tuning LLMs, implementing RAG systems, and developing autonomous AI agents that can solve complex tasks.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-6 pt-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      <Badge variant="outline" className="font-body bg-purple-400/10 text-purple-400 border-purple-400/20 hover:bg-purple-400/20 flex items-center gap-2">
                        <FaMicrochip className="w-3 h-3" /> LLMs
                      </Badge>
                      <Badge variant="outline" className="font-body bg-purple-400/10 text-purple-400 border-purple-400/20 hover:bg-purple-400/20 flex items-center gap-2">
                        <FaServer className="w-3 h-3" /> MLOps
                      </Badge>
                      <Badge variant="outline" className="font-body bg-purple-400/10 text-purple-400 border-purple-400/20 hover:bg-purple-400/20 flex items-center gap-2">
                        <FaCode className="w-3 h-3" /> Deep Learning
                      </Badge>
                      <Badge variant="outline" className="font-body bg-purple-400/10 text-purple-400 border-purple-400/20 hover:bg-purple-400/20 flex items-center gap-2">
                        <FaCodeBranch className="w-3 h-3" /> CI/CD
                      </Badge>
                      <Badge variant="outline" className="font-body bg-purple-400/10 text-purple-400 border-purple-400/20 hover:bg-purple-400/20 flex items-center gap-2">
                        <FaDatabase className="w-3 h-3" /> Vector DB
                      </Badge>
                      <Badge variant="outline" className="font-body bg-purple-400/10 text-purple-400 border-purple-400/20 hover:bg-purple-400/20 flex items-center gap-2">
                        <FaMicrochip className="w-3 h-3" /> RAG
                      </Badge>
                    </div>

                    <Button
                      onClick={() => window.open('/resume.pdf', '_blank')}
                      className="w-full md:w-auto bg-gradient-to-r from-purple-400 to-purple-600 text-white hover:from-purple-500 hover:to-purple-700 transition-all duration-300 group font-body"
                    >
                      <FaDownload className="mr-2 h-4 w-4 group-hover:translate-y-[-2px] transition-transform" />
                      Download Resume
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}