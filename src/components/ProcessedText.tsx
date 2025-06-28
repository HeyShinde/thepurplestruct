'use client';
import React, { useEffect, useRef } from 'react';
import 'katex/dist/katex.min.css';
import katex from 'katex';

interface ProcessedTextProps {
    text: string;
    className?: string;
}

const ProcessedText: React.FC<ProcessedTextProps> = ({ text, className = '' }) => {
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
                result = result.replace(/\$([^$\n]+?)\$/g, (match, expression) => {
                    const id = `katex-inline-${Math.random().toString(36).substr(2, 9)}`;
                    mathExpressions.push({ type: 'inline', expression: expression.trim(), id });
                    return `<span class="katex-inline" id="${id}"></span>`;
                });

                return { html: result, expressions: mathExpressions };
            };

            const { html, expressions } = processText(text);
            containerRef.current.innerHTML = html;

            // Render all KaTeX expressions
            expressions.forEach(({ type, expression, id }) => {
                const element = containerRef.current?.querySelector(`#${id}`);
                if (element) {
                    try {
                        katex.render(expression, element as HTMLElement, {
                            throwOnError: false,
                            displayMode: type === 'block',
                            strict: false,
                            trust: true
                        });
                    } catch (error) {
                        console.warn('KaTeX rendering error:', error);
                        (element as HTMLElement).textContent = `$${expression}$`;
                    }
                }
            });
        }
    }, [text]);

    return <span ref={containerRef} className={className} />;
};

export default ProcessedText;