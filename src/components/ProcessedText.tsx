'use client';

import React, { useEffect, useRef } from 'react';
import 'katex/dist/katex.min.css';
import katex from 'katex';

interface ProcessedTextProps {
    text: string;
}

const ProcessedText: React.FC<ProcessedTextProps> = ({ text }) => {
    const containerRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        if (containerRef.current) {
            const processText = (inputText: string) => {
                let result = inputText;
                
                // Process block math $...$ first
                result = result.replace(/\$\$([^$]+?)\$\$/g, () => {
                    const id = `katex-block-${Math.random().toString(36).substr(2, 9)}`;
                    return `<div class="my-6 flex justify-center">
                        <div class="relative group">
                            <div class="relative bg-black/80 backdrop-blur-sm rounded-lg p-4 w-full">
                                <div class="absolute -inset-[1px] rounded-lg bg-gradient-to-r from-purple-400/0 via-purple-400/80 to-purple-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style="background-size: 200% 100%; animation: gradientMove 3s linear infinite; mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); mask-composite: exclude; padding: 1px;"></div>
                                <div class="relative z-10" id="${id}"></div>
                            </div>
                        </div>
                    </div>`;
                });

                // Process inline math $...$
                result = result.replace(/\$([^$\n]+?)\$/g, () => {
                    const id = `katex-inline-${Math.random().toString(36).substr(2, 9)}`;
                    return `<span class="katex-inline" id="${id}"></span>`;
                });

                return result;
            };

            containerRef.current.innerHTML = processText(text);

            // Now render all the KaTeX expressions
            const blockMatches = text.match(/\$\$([^$]+?)\$\$/g);
            const inlineMatches = text.match(/\$([^$\n]+?)\$/g);

            if (blockMatches) {
                blockMatches.forEach((match, index) => {
                    const expression = match.replace(/\$\$/g, '');
                    const elements = containerRef.current?.querySelectorAll('[id^="katex-block-"]');
                    if (elements && elements[index]) {
                        try {
                            katex.render(expression.trim(), elements[index] as HTMLElement, {
                                throwOnError: false,
                                displayMode: true,
                            });
                        } catch {
                            (elements[index] as HTMLElement).textContent = match;
                        }
                    }
                });
            }

            if (inlineMatches) {
                inlineMatches.forEach((match, index) => {
                    const expression = match.replace(/\$/g, '');
                    const elements = containerRef.current?.querySelectorAll('[id^="katex-inline-"]');
                    if (elements && elements[index]) {
                        try {
                            katex.render(expression.trim(), elements[index] as HTMLElement, {
                                throwOnError: false,
                                displayMode: false,
                            });
                        } catch {
                            (elements[index] as HTMLElement).textContent = match;
                        }
                    }
                });
            }
        }
    }, [text]);

    return <span ref={containerRef} />;
};

export default ProcessedText;