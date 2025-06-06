"use client";

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { CardContainer, CardBody, CardItem } from '@/components/ui/3d-card'

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

interface CoursesListProps {
  courses: Course[];
  displayLimit?: number;
  showTitle?: boolean;
}

export function CoursesList({ courses, displayLimit, showTitle = true }: CoursesListProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-950 to-black py-24 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20" style={{
        backgroundImage: `url('/themes/projects-background.svg')`,
        backgroundSize: '220px 220px'
      }}></div>

      <div className="container mx-auto px-4 relative z-10">
        {showTitle && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent mb-4">
              Courses
            </h1>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, index) => {
            if (displayLimit !== undefined && index >= displayLimit) return null;
            return (
              <div key={course._id} className="group relative cursor-pointer">
                <div className="rounded-2xl overflow-hidden shadow-xl bg-white transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl">
                  {/* Top image */}
                  <div className="relative h-64 w-full">
                    <Image
                      src={course.imageUrl}
                      alt={course.title || 'Course image'}
                      fill
                      style={{ objectFit: 'cover' }}
                      className="transition-all duration-300"
                    />
                  </div>
                  {/* Bottom white section */}
                  <div className="bg-white px-6 py-6 flex items-center justify-between">
                    <div>
                      <div className="text-xl font-extrabold uppercase tracking-wide text-gray-900">
                        {course.title}
                      </div>
                      <div className="text-gray-500 text-md mt-1">
                        {course.price === 0 ? 'FREE' : `$${course.price}`}
                      </div>
                    </div>
                  </div>
                  {/* Hover overlay for details */}
                  <div className="absolute inset-0 bg-white bg-opacity-95 flex flex-col justify-between p-8 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none group-hover:pointer-events-auto">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-xl font-extrabold uppercase tracking-wide text-gray-900">
                          {course.title}
                        </div>
                      </div>
                      <div className="text-purple-800 text-md mb-2">
                        {course.price === 0 ? 'FREE' : `$${course.price}`}
                      </div>
                      <div className="text-gray-700 font-semibold mb-4">
                        {course.lessons} LESSONS
                      </div>
                      <div className="border-b border-gray-200 my-4"></div>
                      <div className="text-gray-600 text-base mb-6">
                        {course.description.length > 180 ? course.description.slice(0, 180) + '...' : course.description}
                      </div>
                    </div>
                    <Link href={`/courses/${course.slug.current}`} className="text-purple-800 font-bold text-lg hover:underline">
                      View course
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
          {/* "View All Courses" button */}
          {displayLimit !== undefined && courses.length > displayLimit && (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 flex items-center justify-center">
              <div className="w-full h-full rounded-xl relative group flex items-center justify-center">
                <Link
                  href="/courses"
                  className="w-[260px] h-[70px] flex items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500/60 via-purple-400/40 to-blue-500/40 backdrop-blur-md border-4 border-transparent [background-clip:padding-box] relative shadow-2xl group"
                  style={{
                    boxShadow: '0 4px 32px 0 rgba(168,85,247,0.25), 0 1.5px 0 0 #fff inset',
                  }}
                >
                  <span className="text-white font-bold text-lg drop-shadow-lg tracking-wide pr-2">
                    View All Courses
                  </span>
                  <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="ml-1 text-purple-200 group-hover:text-white transition-colors duration-200">
                    <path d="M7 14h14M15 10l6 4-6 4"/>
                  </svg>
                  <span className="absolute inset-0 rounded-2xl pointer-events-none border-4 border-transparent group-hover:border-purple-400 group-hover:shadow-[0_0_24px_4px_rgba(168,85,247,0.5)] transition-all duration-200" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 