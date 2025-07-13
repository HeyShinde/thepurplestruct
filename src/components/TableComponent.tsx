'use client';

import React from 'react';
import { motion } from 'framer-motion';
import ProcessedText from './ProcessedText';

interface TableRow {
    cells: string[];
}

interface TableValue {
    headers: string[];
    rows: TableRow[];
    caption?: string;
}

// Table component for rendering Sanity tables
const TableComponent: React.FC<{ value: TableValue }> = ({ value }) => {
    const { headers = [], rows = [], caption } = value;
    
    return (
        <motion.div 
            className="my-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
        >
            <div className="relative max-w-full">
                {/* Container with gradient border */}
                <div className="relative bg-gradient-to-br from-zinc-900/95 to-zinc-800/95 rounded-xl p-0.5 shadow-lg">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-transparent to-purple-500/20 rounded-xl blur-lg"></div>
                    <div className="relative bg-zinc-900/90 rounded-lg overflow-hidden">
                        {/* Table wrapper with horizontal scroll */}
                        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-purple-500/20 scrollbar-track-transparent">
                            <table className="w-full border-collapse">
                                {headers.length > 0 && (
                                    <thead>
                                        <tr className="bg-gradient-to-r from-purple-900/40 to-purple-800/40">
                                            {headers.map((header: string, index: number) => (
                                                <motion.th 
                                                    key={index}
                                                    className="px-2 py-2 md:px-4 md:py-3 text-left font-semibold text-purple-200 border-b border-purple-700/30 text-xs md:text-sm"
                                                    initial={{ opacity: 0, x: -20 }}
                                                    whileInView={{ opacity: 1, x: 0 }}
                                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                                    viewport={{ once: true }}
                                                >
                                                    <div className="flex items-center space-x-1 md:space-x-2">
                                                        <span><ProcessedText text={header} minimal /></span>
                                                        <div className="w-0.5 h-0.5 md:w-1 md:h-1 bg-purple-400/50 rounded-full flex-shrink-0"></div>
                                                    </div>
                                                </motion.th>
                                            ))}
                                        </tr>
                                    </thead>
                                )}
                                <tbody>
                                    {rows.map((row: TableRow, rowIndex: number) => (
                                        <motion.tr 
                                            key={rowIndex}
                                            className={`
                                                transition-all duration-200 hover:bg-purple-900/20 group
                                                ${rowIndex % 2 === 0 ? 'bg-zinc-800/30' : 'bg-zinc-800/10'}
                                                ${rowIndex === rows.length - 1 ? 'border-b-0' : 'border-b border-purple-700/10'}
                                            `}
                                            initial={{ opacity: 0, y: 10 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3, delay: rowIndex * 0.05 }}
                                            viewport={{ once: true }}
                                            whileHover={{ scale: 1.005 }}
                                        >
                                            {row.cells?.map((cell: string, cellIndex: number) => (
                                                <td 
                                                    key={cellIndex}
                                                    className="px-2 py-2 md:px-4 md:py-3 text-neutral-200 text-xs md:text-sm group-hover:text-white transition-colors"
                                                >
                                                    <div className="flex items-center">
                                                        <span><ProcessedText text={cell} minimal /></span>
                                                    </div>
                                                </td>
                                            ))}
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        
                        {/* Caption */}
                        {caption && (
                            <motion.div 
                                className="px-3 py-2 md:px-4 md:py-3 border-t border-purple-700/20 bg-zinc-800/20"
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                transition={{ duration: 0.3, delay: 0.2 }}
                                viewport={{ once: true }}
                            >
                                <p className="text-center text-xs md:text-sm text-purple-400/70 italic">
                                    <ProcessedText text={caption} minimal />
                                </p>
                            </motion.div>
                        )}
                    </div>
                </div>
                
                {/* Decorative elements - smaller and less prominent */}
                <motion.div 
                    className="absolute -top-1 -left-1 w-2 h-2 md:w-3 md:h-3 bg-purple-500/20 rounded-full blur-sm"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                ></motion.div>
                <motion.div 
                    className="absolute -bottom-1 -right-1 w-3 h-3 md:w-4 md:h-4 bg-purple-500/15 rounded-full blur-sm"
                    animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.3, 0.15] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                ></motion.div>
            </div>
        </motion.div>
    );
};

export default TableComponent; 