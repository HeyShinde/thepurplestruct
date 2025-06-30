"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import Link from "next/link"
import Image from 'next/image'
import { motion } from 'framer-motion'

interface EnrolledCourse {
  id: string
  title: string
  image: string
  description: string
  slug: string
  completedLessons: number
  totalLessons: number
}

export default function EnrolledCoursesPage() {
  const { data: session } = useSession()
  const [courses, setCourses] = useState<EnrolledCourse[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCourses() {
      if (session) {
        try {
          const res = await fetch("/api/dashboard/enrolled-courses")
          if (res.ok) {
            const data = await res.json()
            setCourses(data.courses)
          } else {
            // console.error("Failed to fetch courses")
          }
        } catch {
          // console.error("Error fetching courses:", error)
        } finally {
          setLoading(false)
        }
      }
      if (!session) {
        setLoading(false);
      }
    }
    fetchCourses()
  }, [session])

  if (loading) return <div className="text-white text-center p-10">Loading...</div>

  return (
    <div>
      {courses.length === 0 ? (
        <div className="min-h-screen bg-gradient-to-b from-purple-950 to-black py-24 relative overflow-hidden text-center">
            <div className="absolute inset-0 z-0 pointer-events-none opacity-20" style={{
                backgroundImage: `url('/themes/projects-background.svg')`,
                backgroundSize: '220px 220px'
            }}></div>
            <div className="container mx-auto px-4 relative z-10">
                <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent mb-4">
                My Courses
                </h1>
                <p className="text-neutral-400">You are not enrolled in any courses yet.</p>
                <Link href="/courses" className="mt-6 inline-block bg-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors">
                    Explore Courses
                </Link>
            </div>
        </div>
      ) : (
        <>
          <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent mb-4">
                My Courses
              </h1>
            </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => {
              const progress = course.totalLessons > 0 ? (course.completedLessons / course.totalLessons) * 100 : 0;
              return (
                <Link href={`/courses/learn/${course.id}`} key={course.id} className="block">
                  <motion.div
                    className="group relative cursor-pointer"
                    whileHover={{ y: -8 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <div className="rounded-2xl overflow-hidden shadow-xl bg-white transition-shadow duration-300 group-hover:shadow-2xl">
                      <div className="relative h-64 w-full overflow-hidden">
                        {course.image && (
                          <Image
                              src={course.image}
                              alt={course.title || 'Course image'}
                              fill
                              style={{ objectFit: 'cover' }}
                              className="transition-transform duration-300 ease-in-out group-hover:scale-105"
                          />
                        )}
                      </div>
                      <div className="bg-white px-6 py-6">
                        <div>
                          <div className="text-xl font-extrabold uppercase tracking-wide text-gray-900">
                            {course.title}
                          </div>
                          <div className="text-gray-500 text-md mt-2">
                             <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                <div className="bg-purple-600 h-2.5 rounded-full" style={{width: `${progress}%`}}></div>
                              </div>
                              <p className="text-right text-xs text-gray-400 mt-1">{Math.round(progress)}% Complete</p>
                          </div>
                        </div>
                      </div>
                      {/* Hover overlay for details */}
                      <div className="absolute inset-0 bg-white bg-opacity-95 flex flex-col justify-between p-8 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <div className="text-xl font-extrabold uppercase tracking-wide text-gray-900">
                              {course.title}
                            </div>
                          </div>
                          <div className="text-purple-800 text-md mb-2">
                            {course.completedLessons} / {course.totalLessons} Lessons Completed
                          </div>
                          <div className="border-b border-gray-200 my-4"></div>
                          <div className="text-gray-600 text-base mb-6">
                            {course.description && course.description.length > 180 ? course.description.slice(0, 180) + '...' : course.description}
                          </div>
                        </div>
                        <span className="text-purple-800 font-bold text-lg">
                          Continue course
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </>
      )}
    </div>
  )
} 