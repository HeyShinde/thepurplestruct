"use client";

import React, { useState } from 'react';

interface CodeSnippet {
  language: string;
  customLanguage?: string;
  code: string;
}

interface CodeBlockValue {
  codes: CodeSnippet[];
  showCopyButton?: boolean;
}

const languageLabels: Record<string, string> = {
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  python: 'Python',
  go: 'Go',
  html: 'HTML',
  css: 'CSS',
  other: 'Other',
};

const CodeBlock = ({ value }: { value: CodeBlockValue }) => {
  const { codes = [], showCopyButton = true } = value;
  const [selected, setSelected] = useState(0);
  const current = codes[selected] || { language: '', code: '' };

  const handleCopy = (e: React.MouseEvent<HTMLButtonElement>) => {
    navigator.clipboard.writeText(current.code).catch(() => {});
    const button = e.currentTarget;
    button.textContent = "Copied!";
    setTimeout(() => (button.textContent = "Copy"), 1500);
  };

  if (!codes.length) return null;

  return (
    <div className="relative my-6">
      <div className="relative bg-black/80 backdrop-blur-sm rounded-xl p-4">
        <div className="absolute -inset-[1px] rounded-xl bg-gradient-to-r from-purple-400/0 via-purple-400/80 to-purple-400/0"
          style={{
            backgroundSize: '200% 100%',
            animation: 'gradientMove 3s linear infinite',
            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            maskComposite: 'exclude',
            padding: '1px',
          }}
        />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="flex items-center gap-2">
              {codes.length > 1 && (
                <div className="flex gap-1">
                  {codes.map((snippet, idx) => (
                    <button
                      key={idx}
                      className={`px-2 py-1 rounded text-xs font-mono transition-colors ${selected === idx ? 'bg-purple-500/30 text-purple-200' : 'bg-purple-500/10 text-purple-400 hover:bg-purple-500/20'}`}
                      onClick={() => setSelected(idx)}
                    >
                      {snippet.language === 'other' 
                        ? (snippet.customLanguage || 'Custom') 
                        : (languageLabels[snippet.language] || snippet.language || `Lang ${idx + 1}`)}
                    </button>
                  ))}
                </div>
              )}
              {showCopyButton && (
                <button
                  className="font-body px-3 py-1 text-sm bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors"
                  onClick={handleCopy}
                >
                  Copy
                </button>
              )}
            </div>
          </div>
          <pre className="overflow-x-auto">
            <code className="font-code text-sm text-purple-400">{current.code}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};

export default CodeBlock; 