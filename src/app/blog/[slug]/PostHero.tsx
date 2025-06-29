"use client";
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import type { BlogPost } from '@/types/blog';

type PostHeroProps = {
    title: string;
    processedTitle?: string; // Pre-processed LaTeX title from server
    categories: BlogPost['categories'];
    publishedAt: string;
    updatedAt?: string;
};

export default function PostHero({ title, processedTitle, categories, publishedAt, updatedAt }: PostHeroProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative mb-16"
        >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-purple-700/20 blur-3xl -z-10" />
            <div className="max-w-4xl mx-auto text-center">
                <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl mt-16 lg:mt-20 text-white leading-tight">
                    {processedTitle ? (
                        <span dangerouslySetInnerHTML={{ __html: processedTitle }} />
                    ) : (
                        title
                    )}
                </h1>
                <div className="flex items-center justify-center gap-3 mt-6 flex-wrap">
                    {(updatedAt || publishedAt) && (
                        <time
                            dateTime={new Date(updatedAt || publishedAt).toISOString()}
                            className="font-body px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-purple-500 to-purple-700 rounded-lg shadow-lg"
                        >
                            Last updated on {format(new Date(updatedAt || publishedAt), 'dd MMMM yyyy')}
                        </time>
                    )}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                        {categories?.map((category) => (
                            <Link key={category._id} href={`/blog/category/${category.slug}`}>
                                <span className="font-body px-4 py-2 text-sm font-medium text-purple-400 bg-purple-400/10 rounded-full hover:bg-purple-400/20 transition-colors cursor-pointer">
                                    {category.title}
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}