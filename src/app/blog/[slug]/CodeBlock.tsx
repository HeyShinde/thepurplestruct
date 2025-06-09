"use client";

import React from 'react';

const CodeBlock = ({ value }: { value: { code: string; showCopyButton?: boolean } }) => {
    const handleCopy = (e: React.MouseEvent<HTMLButtonElement>) => {
        navigator.clipboard.writeText(value.code).catch(() => { });
        const button = e.currentTarget;
        button.textContent = "Copied!";
        setTimeout(() => (button.textContent = "Copy"), 1500);
    };

    return (
        <div className="relative my-6">
            <div className="relative bg-black/80 backdrop-blur-sm rounded-xl p-4 w-full">
                <div className="absolute -inset-[1px] rounded-xl bg-gradient-to-r from-purple-400/0 via-purple-400/80 to-purple-400/0"
                    style={{
                        backgroundSize: '200% 100%',
                        animation: 'gradientMove 3s linear infinite',
                        mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                        maskComposite: 'exclude',
                        padding: '1px',
                    }} />
                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        </div>
                        {value.showCopyButton && (
                            <button
                                className="font-body px-3 py-1 text-sm bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors"
                                onClick={handleCopy}
                            >
                                Copy
                            </button>
                        )}
                    </div>
                    <pre className="overflow-x-auto">
                        <code className="font-code text-sm text-purple-400">{value.code}</code>
                    </pre>
                </div>
            </div>
        </div>
    );
};

export default CodeBlock; 