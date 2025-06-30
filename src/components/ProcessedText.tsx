'use client';
import React, { useEffect, useRef } from 'react';
import 'katex/dist/katex.min.css';
import katex from 'katex';

interface ProcessedTextProps {
    text: string;
    className?: string;
    minimal?: boolean;
}

const ProcessedText: React.FC<ProcessedTextProps> = ({ text, className = '', minimal = false }) => {
    const containerRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        if (containerRef.current && text) {
            const processText = (inputText: string) => {
                let result = inputText;
                const mathExpressions: { type: 'block' | 'inline', expression: string, id: string }[] = [];

                // Process block math $$...$$ first
                result = result.replace(/\$\$([^$]+?)\$\$/g, (match, expression) => {
                    const id = `katex-block-${Math.random().toString(36).substr(2, 9)}`;
                    mathExpressions.push({ type: 'block', expression: expression.trim(), id });
                    return `<div class="my-6 px-4 flex justify-center">
                        <div class="w-full max-w-full">
                            <div class="relative group">
                                <div class="pointer-events-none absolute inset-0 rounded-lg border-2 border-transparent animated-gradient-border" style="z-index:20; border-image: linear-gradient(90deg, #a78bfa00 0%, #a78bfa 50%, #a78bfa00 100%) 1;"></div>
                                <div class="katex-scroll-area">
                                    <div class="relative bg-black/80 backdrop-blur-sm rounded-lg p-4 min-w-fit z-10">
                                        <div class="relative z-10" id="${id}"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`;
                });

                // Process inline math $...$
                result = result.replace(/\$([^$\n]+?)\$/g, (match, expression) => {
                    const id = `katex-inline-${Math.random().toString(36).substr(2, 9)}`;
                    mathExpressions.push({ type: 'inline', expression: expression.trim(), id });
                    return `<span class="katex-inline break-words" id="${id}"></span>`;
                });

                return { html: result, expressions: mathExpressions };
            };

            const { html, expressions } = processText(text);
            containerRef.current.innerHTML = html;

            // Set initial opacity to 0 for smooth transition
            containerRef.current.style.opacity = '0';

            // Render all KaTeX expressions
            const renderPromises = expressions.map(({ type, expression, id }) => {
                return new Promise<void>((resolve) => {
                    const element = containerRef.current?.querySelector(`#${id}`);
                    if (element) {
                        try {
                            katex.render(expression, element as HTMLElement, {
                                throwOnError: false,
                                displayMode: type === 'block',
                                strict: false,
                                trust: true,
                                output: 'html',
                            });

                            // Remove background/border for minimal mode (inline math only)
                            if (minimal && type === 'inline') {
                                (element as HTMLElement).className = 'katex-inline';
                                (element as HTMLElement).setAttribute('style', 'background:none !important;border:none !important;padding:0 !important;');
                            }
                        } catch {
                            // console.warn('KaTeX rendering error:', error);
                            (element as HTMLElement).textContent = `$${expression}$`;
                        }
                    }
                    resolve();
                });
            });

            // Wait for all expressions to render, then fade in
            Promise.all(renderPromises).then(() => {
                if (containerRef.current) {
                    containerRef.current.style.transition = 'opacity 0.3s ease-in-out';
                    containerRef.current.style.opacity = '1';
                }
            });
        }
    }, [text, minimal]);

    return (
        <span 
            ref={containerRef} 
            className={className}
            style={{ 
                opacity: 0, // Start hidden
                minHeight: '1em' // Prevent layout shift
            }} 
        />
    );
};

export default ProcessedText;