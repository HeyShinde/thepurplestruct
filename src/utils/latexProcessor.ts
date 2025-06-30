// utils/latexProcessor.ts - Server-side LaTeX processing
import katex from 'katex';

export function processLatexSSR(text: string): string {
    if (!text) return '';
    
    let result = text;
    
    // Process block math $$...$$ first
    result = result.replace(/\$\$([^$]+?)\$\$/g, (match, expression) => {
        try {
            const rendered = katex.renderToString(expression.trim(), {
                throwOnError: false,
                displayMode: true,
                strict: false,
                trust: true,
                output: 'html',
            });
            return `<div class="my-6 px-4 flex justify-center">
                <div class="w-full max-w-full">
                    <div class="relative group">
                        <div class="katex-scroll-area">
                            <div class="relative bg-black/80 backdrop-blur-sm rounded-lg p-4 min-w-fit z-10">
                                ${rendered}
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
        } catch {
            // console.warn('KaTeX SSR error:', error);
            return match;
        }
    });
    
    // Process inline math $...$
    result = result.replace(/\$([^$\n]+?)\$/g, (match, expression) => {
        try {
            const rendered = katex.renderToString(expression.trim(), {
                throwOnError: false,
                displayMode: false,
                strict: false,
                trust: true,
                output: 'html',
            });
            return `<span class="katex-inline">${rendered}</span>`;
        } catch {
            // console.warn('KaTeX SSR error:', error);
            return match;
        }
    });
    
    return result;
}

export function containsLatex(text: string): boolean {
    return /\$.*?\$/.test(text);
}