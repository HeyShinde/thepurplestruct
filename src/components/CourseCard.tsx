"use client";

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface Course {
    _id: string;
    title: string;
    slug: {
        current: string;
    };
    description: string;
    price: number;
    imageUrl: string;
    lessons: number;
}

export function CourseCard({ course }: { course: Course }) {
    return (
        <Link href={`/courses/${course.slug.current}`} key={course._id} className="block">
            <motion.div
                className="group relative cursor-pointer"
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
                <div className="rounded-2xl overflow-hidden shadow-xl bg-white transition-shadow duration-300 group-hover:shadow-2xl">
                    {/* Top image */}
                    <div className="relative h-64 w-full overflow-hidden">
                        <Image
                            src={course.imageUrl}
                            alt={course.title || 'Course image'}
                            fill
                            style={{ objectFit: 'cover' }}
                            className="transition-transform duration-300 ease-in-out group-hover:scale-105"
                        />
                    </div>
                    {/* Bottom white section */}
                    <div className="bg-white px-6 py-6 flex items-center justify-between">
                        <div>
                            <div className="font-heading text-xl font-extrabold uppercase tracking-wide text-gray-900">
                                {course.title}
                            </div>
                            <div className="font-body text-gray-500 text-md mt-1">
                                {course.price === 0 ? 'FREE' : `$${course.price}`}
                            </div>
                        </div>
                    </div>
                    {/* Hover overlay for details */}
                    <div className="absolute inset-0 bg-white bg-opacity-95 flex flex-col justify-between p-8 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none">
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <div className="font-heading text-xl font-extrabold uppercase tracking-wide text-gray-900">
                                    {course.title}
                                </div>
                            </div>
                            <div className="font-body text-purple-800 text-md mb-2">
                                {course.price === 0 ? 'FREE' : `$${course.price}`}
                            </div>
                            <div className="font-body text-gray-700 font-semibold mb-4">
                                {course.lessons} LESSONS
                            </div>
                            <div className="border-b border-gray-200 my-4"></div>
                            <div className="font-body text-gray-600 text-base mb-6">
                                {course.description.length > 180 ? course.description.slice(0, 180) + '...' : course.description}
                            </div>
                        </div>
                        <span className="font-heading text-purple-800 font-bold text-lg">
                            View course
                        </span>
                    </div>
                </div>
            </motion.div>
        </Link>
    );
} 