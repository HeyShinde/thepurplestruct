"use client";
import React from "react";
import classNames from "classnames";
import { motion } from "framer-motion";
import '@/app/globals.css';

interface Heading {
    level: number;
    text: string;
    id: string;
}

interface TableOfContentsProps {
    headings: Heading[];
}

const TableOfContents: React.FC<TableOfContentsProps> = ({ headings }) => {
    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            // Get the navbar height dynamically
            const navbar = document.querySelector('nav');
            const navbarHeight = navbar ? navbar.getBoundingClientRect().height : 80;
            
            // Add some padding for better visibility
            const padding = 20;
            const offset = navbarHeight + padding;
            
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            try {
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
            } catch (error) {
                // Fallback to instant scroll if smooth scroll fails
                window.scrollTo(0, offsetPosition);
            }
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative bg-black/40 backdrop-blur-sm rounded-lg border border-purple-400/20 hover:border-purple-400/40 transition-all duration-300 p-6 max-h-[50vh] overflow-y-auto"
        >
            <div className="absolute -inset-[1px] rounded-lg bg-gradient-to-r from-purple-400/0 via-purple-400/80 to-purple-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                    backgroundSize: '200% 100%',
                    animation: 'gradientMove 3s linear infinite',
                    mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    maskComposite: 'exclude',
                    padding: '1px',
                }} 
            />
            
            <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent font-heading">
                Table of Contents
            </h2>
            
            <ul className="space-y-3">
                {headings.map((heading, index) => (
                    <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className={classNames(
                            "group relative",
                            {
                                'ml-4': heading.level === 2,
                                'ml-8': heading.level === 3,
                                'ml-12': heading.level === 4,
                            }
                        )}
                    >
                        <div className="absolute -left-4 top-0 bottom-0 w-1 bg-purple-400/20 rounded-full group-hover:bg-purple-400/40 transition-colors duration-300" />
                        <a
                            href={`#${heading.id}`}
                            onClick={(e) => handleClick(e, heading.id)}
                            className={classNames(
                                "block py-2 px-4 rounded-lg text-purple-400/80 hover:text-purple-400 transition-colors duration-300 font-body",
                                "hover:bg-purple-400/10",
                                {
                                    'text-lg': heading.level === 2,
                                    'text-base': heading.level === 3,
                                    'text-sm': heading.level === 4,
                                }
                            )}
                        >
                            {heading.text}
                        </a>
                    </motion.li>
                ))}
            </ul>
        </motion.div>
    );
};

export default TableOfContents;