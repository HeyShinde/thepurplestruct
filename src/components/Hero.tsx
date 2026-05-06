"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react";

const systemFontStack = "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif";

const Hero = () => {
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    // Swap to Rubik Glitch and glitch effect after first paint
    const timeout = setTimeout(() => setGlitch(true), 1200); // 1.2s after mount
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="relative w-screen overflow-hidden overflow-x-hidden bg-linear-to-b from-purple-500 to-black">
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-size-[32px_32px] opacity-50" />
      <div className="relative z-10 flex items-center max-w-7xl mx-auto px-4 pt-[calc(var(--navbar-height,80px)+2rem)] pb-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left column - Text Content */}
          <div className="flex flex-col justify-center space-y-4">
            <p
              className="font-heading uppercase"
              style={{ fontSize: 'var(--font-size-xl)' }}
            >
              Between code and chaos,
            </p>
            <h1
              className={`uppercase${glitch ? " font-glitch glitch-effect" : ""}`}
              style={{ fontSize: 'var(--font-size-5xl)', fontFamily: glitch ? undefined : systemFontStack, transition: "font-family 0.2s" }}
            >
              there&apos;s clarity.
            </h1>
            <h2
              className="font-heading uppercase"
              style={{ fontSize: 'var(--font-size-2xl)' }}
            >
              I am Aditya
              <span className="block text-yellow-400 font-semibold">and I engineer it with machine learning.</span>
            </h2>
          </div>

          {/* Right column - Neural Network Visualization */}
          <div className="relative flex items-center justify-center h-[500px] lg:h-full">
            <motion.svg
              width="100%"
              height="100%"
              viewBox="0 0 400 450"
              initial="hidden"
              animate="visible"
              className="text-purple-400"
            >
              {/* Input Layer */}
              <motion.g>
                {[0, 1, 2, 3, 4].map((node, index) => (
                  <motion.g key={`input-${index}`}>
                    <motion.circle
                      cx={60}
                      cy={80 + index * 60}
                      r="8"
                      fill="currentColor"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        duration: 0.5,
                        delay: index * 0.1,
                      }}
                    />
                  </motion.g>
                ))}
              </motion.g>

              {/* Hidden Layer 1 */}
              <motion.g>
                {[0, 1, 2, 3, 4, 5].map((node, nodeIndex) => (
                  <motion.g key={`hidden1-${node}`}>
                    <motion.circle
                      cx={160}
                      cy={60 + node * 50}
                      r="8"
                      fill="currentColor"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        duration: 0.5,
                        delay: 0.5 + nodeIndex * 0.1,
                      }}
                    />
                  </motion.g>
                ))}
              </motion.g>

              {/* Hidden Layer 2 */}
              <motion.g>
                {[0, 1, 2, 3, 4, 5].map((node, nodeIndex) => (
                  <motion.g key={`hidden2-${node}`}>
                    <motion.circle
                      cx={260}
                      cy={60 + node * 50}
                      r="8"
                      fill="currentColor"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        duration: 0.5,
                        delay: 1.0 + nodeIndex * 0.1,
                      }}
                    />
                  </motion.g>
                ))}
              </motion.g>

              {/* Output Layer */}
              <motion.g>
                {[0, 1, 2, 3].map((node, nodeIndex) => (
                  <motion.g key={`output-${node}`}>
                    <motion.circle
                      cx={360}
                      cy={100 + node * 60}
                      r="8"
                      fill="currentColor"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        duration: 0.5,
                        delay: 1.5 + nodeIndex * 0.1,
                      }}
                    />
                  </motion.g>
                ))}
              </motion.g>

              {/* Connections - Input to Hidden 1 */}
              {[0, 1, 2, 3, 4].map((inputNode) => (
                [0, 1, 2, 3, 4, 5].map((hiddenNode) => (
                  <motion.line
                    key={`input-connection-${inputNode}-${hiddenNode}`}
                    x1={68}
                    y1={80 + inputNode * 60}
                    x2={152}
                    y2={60 + hiddenNode * 50}
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeOpacity="0.2"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.2 }}
                    transition={{
                      duration: 0.8,
                      delay: 0.2 + inputNode * 0.1,
                    }}
                  />
                ))
              ))}

              {/* Connections - Hidden 1 to Hidden 2 */}
              {[0, 1, 2, 3, 4, 5].map((node) => (
                [0, 1, 2, 3, 4, 5].map((nextNode) => (
                  <motion.line
                    key={`hidden-connection-${node}-${nextNode}`}
                    x1={168}
                    y1={60 + node * 50}
                    x2={252}
                    y2={60 + nextNode * 50}
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeOpacity="0.2"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.2 }}
                    transition={{
                      duration: 0.8,
                      delay: 0.7 + node * 0.1,
                    }}
                  />
                ))
              ))}

              {/* Connections - Hidden 2 to Output */}
              {[0, 1, 2, 3, 4, 5].map((hiddenNode) => (
                [0, 1, 2, 3].map((outputNode) => (
                  <motion.line
                    key={`output-connection-${hiddenNode}-${outputNode}`}
                    x1={268}
                    y1={60 + hiddenNode * 50}
                    x2={352}
                    y2={100 + outputNode * 60}
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeOpacity="0.2"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.2 }}
                    transition={{
                      duration: 0.8,
                      delay: 1.2 + hiddenNode * 0.1,
                    }}
                  />
                ))
              ))}

              {/* Multiple Data Flow Animations */}
              {[0, 1, 2, 3, 4].map((inputNode) => (
                [0, 1, 2, 3, 4, 5].map((hidden1Node) => (
                  [0, 1, 2, 3, 4, 5].map((hidden2Node) => (
                    [0, 1, 2, 3].map((outputNode) => (
                      <motion.circle
                        key={`flow-${inputNode}-${hidden1Node}-${hidden2Node}-${outputNode}`}
                        r={3}
                        fill="#ffffff"
                        initial={{
                          opacity: 0,
                          cx: 60 + (inputNode ?? 0) * 0,
                          cy: 80 + (inputNode ?? 0) * 60,
                        }}
                        animate={{
                          opacity: [0, 0.8, 0.8, 0.8, 0],
                          cx: [
                            60 + (inputNode ?? 0) * 0,
                            160 + (hidden1Node ?? 0) * 0,
                            260 + (hidden2Node ?? 0) * 0,
                            360 + (outputNode ?? 0) * 0,
                            360 + (outputNode ?? 0) * 0,
                          ],
                          cy: [
                            80 + (inputNode ?? 0) * 60,
                            60 + (hidden1Node ?? 0) * 50,
                            60 + (hidden2Node ?? 0) * 50,
                            100 + (outputNode ?? 0) * 60,
                            100 + (outputNode ?? 0) * 60,
                          ],
                        }}
                        transition={{
                          duration: 15,
                          repeat: Infinity,
                          repeatDelay: 2,
                          times: [0, 0.25, 0.5, 0.75, 1],
                          delay: 0,
                          ease: "easeInOut",
                        }}
                      />
                    ))
                  ))
                ))
              ))}

              {/* Layer Activation Indicators */}
              <motion.g>
                {/* Input Layer Activation */}
                <motion.rect
                  x={40}
                  y={50}
                  width={40}
                  height={300}
                  fill="none"
                  stroke="#A855F7"
                  strokeWidth="2"
                  strokeOpacity="0.3"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: [0, 0.3, 0, 0, 0],
                  }}
                  transition={{
                    duration: 15,
                    repeat: Infinity,
                    repeatDelay: 2,
                    times: [0, 0.1, 0.25, 0.25, 1],
                  }}
                />

                {/* Hidden Layer 1 Activation */}
                <motion.rect
                  x={140}
                  y={30}
                  width={40}
                  height={300}
                  fill="none"
                  stroke="#A855F7"
                  strokeWidth="2"
                  strokeOpacity="0.3"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: [0, 0, 0.3, 0, 0],
                  }}
                  transition={{
                    duration: 15,
                    repeat: Infinity,
                    repeatDelay: 2,
                    times: [0, 0.25, 0.3, 0.5, 0.5],
                  }}
                />

                {/* Hidden Layer 2 Activation */}
                <motion.rect
                  x={240}
                  y={30}
                  width={40}
                  height={300}
                  fill="none"
                  stroke="#A855F7"
                  strokeWidth="2"
                  strokeOpacity="0.3"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: [0, 0, 0, 0.3, 0],
                  }}
                  transition={{
                    duration: 15,
                    repeat: Infinity,
                    repeatDelay: 2,
                    times: [0, 0.5, 0.55, 0.75, 0.75],
                  }}
                />

                {/* Output Layer Activation */}
                <motion.rect
                  x={340}
                  y={70}
                  width={40}
                  height={300}
                  fill="none"
                  stroke="#A855F7"
                  strokeWidth="2"
                  strokeOpacity="0.3"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: [0, 0, 0, 0, 0.3],
                  }}
                  transition={{
                    duration: 15,
                    repeat: Infinity,
                    repeatDelay: 2,
                    times: [0, 0.75, 0.8, 1, 1],
                  }}
                />
              </motion.g>

              {/* Layer Processing Times */}
              <motion.g>
                <motion.text
                  x="200"
                  y="350"
                  textAnchor="middle"
                  fill="#A855F7"
                  fontSize="12"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: [0, 0.8, 0.8, 0, 0],
                  }}
                  transition={{
                    duration: 15,
                    repeat: Infinity,
                    repeatDelay: 2,
                    times: [0, 0.1, 0.25, 0.25, 1],
                  }}
                >
                  Input Layer Processing
                </motion.text>
                <motion.text
                  x="200"
                  y="370"
                  textAnchor="middle"
                  fill="#A855F7"
                  fontSize="12"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: [0, 0, 0.8, 0.8, 0],
                  }}
                  transition={{
                    duration: 15,
                    repeat: Infinity,
                    repeatDelay: 2,
                    times: [0, 0.25, 0.3, 0.5, 0.5],
                  }}
                >
                  Hidden Layer 1 Processing
                </motion.text>
                <motion.text
                  x="200"
                  y="390"
                  textAnchor="middle"
                  fill="#A855F7"
                  fontSize="12"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: [0, 0, 0.8, 0.8, 0],
                  }}
                  transition={{
                    duration: 15,
                    repeat: Infinity,
                    repeatDelay: 2,
                    times: [0, 0.5, 0.55, 0.75, 0.75],
                  }}
                >
                  Hidden Layer 2 Processing
                </motion.text>
                <motion.text
                  x="200"
                  y="410"
                  textAnchor="middle"
                  fill="#A855F7"
                  fontSize="12"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: [0, 0, 0.8, 0.8, 0],
                  }}
                  transition={{
                    duration: 15,
                    repeat: Infinity,
                    repeatDelay: 2,
                    times: [0, 0.75, 0.8, 1, 1],
                  }}
                >
                  Output Layer
                </motion.text>
              </motion.g>
            </motion.svg>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero
