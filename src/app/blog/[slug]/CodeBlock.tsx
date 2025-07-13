"use client";
import React, { useState, useEffect } from "react";
import { createHighlighter } from "shiki";

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
  python: "Python",
  c: "C",
  cpp: "C++",
  java: "Java",
  javascript: "JS",
  typescript: "TypeScript",
  jsx: "JSX",
  tsx: "TSX",
  html: "HTML",
  css: "CSS",
  json: "JSON",
  bash: "Bash",
  sql: "SQL",
  other: "Other",
};

const CodeBlock = ({ value }: { value: CodeBlockValue }) => {
  const { codes = [], showCopyButton = true } = value;
  const [selected, setSelected] = useState(0);
  const [html, setHtml] = useState("");

  const current = codes[selected] || { language: "", code: "" };

  const handleCopy = (e: React.MouseEvent<HTMLButtonElement>) => {
    navigator.clipboard.writeText(current.code).catch(() => {});
    const button = e.currentTarget;
    button.textContent = "Copied!";
    setTimeout(() => (button.textContent = "Copy"), 1500);
  };

  const getShikiLang = (language: string): string => {
    const map: Record<string, string> = {
      c: "c",
      cpp: "cpp",
      python: "python",
      java: "java",
      javascript: "javascript",
      typescript: "typescript",
      jsx: "jsx",
      tsx: "tsx",
      html: "html",
      css: "css",
      json: "json",
      bash: "bash",
      sql: "sql",
    };
    return map[language] || "txt";
  };

  useEffect(() => {
    (async () => {
      const highlighter = await createHighlighter({
        themes: ["catppuccin-macchiato"],
        langs: [
          "javascript",
          "typescript",
          "python",
          "cpp",
          "java",
          "bash",
          "json",
          "html",
          "css",
          "tsx",
          "jsx",
        ],
      });

      const htmlOutput = highlighter.codeToHtml(current.code, {
        lang: getShikiLang(current.language),
        theme: 'catppuccin-macchiato',
      }).replace(/background-color: #[0-9a-fA-F]{6};?/g, '');
  
      setHtml(htmlOutput);
    })();
  }, [current.code, current.language]);


  if (!codes.length) return null;

  return (
    <div className="relative my-6">
      <div className="relative bg-black/80 backdrop-blur-sm rounded-xl p-4">
        <div
          className="absolute -inset-[1px] rounded-xl bg-gradient-to-r from-purple-400/0 via-purple-400/80 to-purple-400/0"
          style={{
            backgroundSize: "200% 100%",
            animation: "gradientMove 3s linear infinite",
            mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            maskComposite: "exclude",
            padding: "1px",
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
                      className={`px-2 py-1 rounded text-xs font-mono transition-colors ${
                        selected === idx
                          ? "bg-purple-500/30 text-purple-200"
                          : "bg-purple-500/10 text-purple-400 hover:bg-purple-500/20"
                      }`}
                      onClick={() => setSelected(idx)}
                    >
                      {snippet.language === "other"
                        ? snippet.customLanguage || "Custom"
                        : languageLabels[snippet.language] ||
                          snippet.language ||
                          `Lang ${idx + 1}`}
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
          <div
            className="overflow-x-auto font-mono text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </div>
    </div>
  );
};

export default CodeBlock;
