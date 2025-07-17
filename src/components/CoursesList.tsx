import Link from 'next/link'
import { CourseCard } from './CourseCard';
import React from "react";

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
  isMainPage?: boolean;
}

export function CoursesList({ courses, displayLimit, showTitle = true, isMainPage = false }: CoursesListProps) {
    const displayedCourses = displayLimit ? courses.slice(0, displayLimit) : courses;
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-950 to-black py-24 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20" style={{
        backgroundImage: `url('/themes/projects-background.svg')`,
        backgroundSize: '220px 220px'
      }}></div>

      <div className="container mx-auto px-4 relative z-10">
        {showTitle && (
                    <div
            className="text-center mb-16"
          >
                        {isMainPage ? (
                          <h1 className="font-heading text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent mb-4">
                            Courses
                          </h1>
                        ) : (
                          <h2 className="font-heading text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent mb-4">
                            Courses
                          </h2>
                        )}
                    </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {displayedCourses.map((course) => (
                        <CourseCard course={course} key={course._id} />
                    ))}
          {/* "View All Courses" button */}
          {displayLimit !== undefined && courses.length > displayLimit && (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 flex items-center justify-center">
              <div className="w-full h-full rounded-xl relative group flex items-center justify-center">
                  <Link href="/blog">
                      <button
                          className="relative inline-flex h-[48px] w-[16rem] overflow-hidden rounded-2xl p-[2px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
                      >
                          <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                          <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-2xl bg-white px-6 py-2 text-lg font-semibold text-purple-700 backdrop-blur-3xl">
                                View All Blogs
                    <svg
                        width="28"
                        height="28"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="ml-1"
                    >
                      <path d="M7 14h14M15 10l6 4-6 4" />
                    </svg>
                    </span>
                      </button>
                  </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 