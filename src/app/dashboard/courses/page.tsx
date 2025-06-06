"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useParams } from "next/navigation"

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
  const { data: session, status } = useSession()
  const [courses, setCourses] = useState<EnrolledCourse[]>([])
  const [loading, setLoading] = useState(true)
  const params = useParams()
  const slug = params?.slug

  const cardColors = [
    "bg-green-300", // first card (with stack/hover)
    "bg-blue-300",
    "bg-red-300",
    "bg-yellow-300",
  ];

  useEffect(() => {
    async function fetchCourses() {
      const res = await fetch("/api/dashboard/enrolled-courses")
      const data = await res.json()
      setCourses(data.courses)
      setLoading(false)
    }
    fetchCourses()
  }, [])

  if (loading) return <div>Loading...</div>

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-950 via-black to-black text-white">
      <h1 className="text-2xl font-bold mb-6 text-white">My Enrolled Courses</h1>
      {courses.length === 0 ? (
        <p className="text-neutral-400">You are not enrolled in any courses yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course, idx) => {
            // For the first card, add the stack and hover effect
            if (idx === 0) {
              return (
                <div key={course.id} className="relative group min-h-[280px]">
                  {/* Stacked effect */}
                  <div className="absolute top-2 left-2 w-full h-full border-2 border-black rounded-lg bg-green-200 z-0" />
                  <div className="absolute top-4 left-4 w-full h-full border-2 border-black rounded-lg bg-green-100 z-0" />
                  {/* Main card */}
                  <div className={`relative z-10 border-2 border-black rounded-lg bg-green-300 p-6 transition-transform duration-300 group-hover:-translate-y-2 group-hover:-translate-x-2`}>
                    {/* Arc text using SVG */}
                    <svg width="120" height="40" className="absolute -top-6 right-0">
                      <path id="curve" d="M10,30 Q60,0 110,30" fill="transparent"/>
                      <text width="120">
                        <textPath xlinkHref="#curve" startOffset="0" className="text-xs font-bold fill-black">
                          EXPLORE • LEARN MORE
                        </textPath>
                      </text>
                    </svg>
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                      <span className="text-xl">→</span> {course.title}
                    </h2>
                    <p className="mb-6 text-black font-medium">{course.description}</p>
                    <Link
                      href={`/courses/learn/${course.id}`}
                      className="block w-full border-2 border-black rounded bg-white text-black py-2 text-center font-semibold transition hover:bg-black hover:text-white"
                    >
                      LET'S GO
                    </Link>
                  </div>
                </div>
              );
            }

            // Other cards, just flat color
            return (
              <div
                key={course.id}
                className={`border-2 border-black rounded-lg p-6 min-h-[280px] flex flex-col justify-between ${cardColors[idx % cardColors.length]}`}
              >
                <h2 className="text-2xl font-bold mb-4">{course.title}</h2>
                <p className="mb-6 text-black font-medium">{course.description}</p>
                <Link
                  href={`/courses/learn/${course.id}`}
                  className="block w-full border-2 border-black rounded bg-white text-black py-2 text-center font-semibold transition hover:bg-black hover:text-white"
                >
                  LET'S GO
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  )
} 