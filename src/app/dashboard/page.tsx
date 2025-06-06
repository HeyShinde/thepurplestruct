"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { prisma } from "@/lib/prisma"

interface DashboardStats {
  enrolledCourses: number
  completedLessons: number
  totalLessons: number
  recentCourses: any[]
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const [stats, setStats] = useState<DashboardStats>({
    enrolledCourses: 0,
    completedLessons: 0,
    totalLessons: 0,
    recentCourses: [],
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/dashboard/stats")
        const data = await response.json()
        setStats(data)
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error)
      }
    }

    fetchStats()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-950 via-black to-black text-white">
      {/* Hero Section */}
      <div className="relative w-full overflow-hidden bg-gradient-to-b from-purple-900/80 to-black/90 py-14 px-4">
        <div className="container mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 text-white leading-tight">
            Welcome back, {session?.user?.name}!
          </h1>
          <p className="text-lg text-neutral-300">Track your learning progress and continue your journey</p>
        </div>
      </div>

      <div className="container mx-auto py-10 px-4">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/5 p-6 rounded-2xl border border-purple-400/20 shadow-lg hover:border-purple-400/40 transition-colors">
            <h3 className="text-purple-400 text-sm font-medium uppercase tracking-wide">Enrolled Courses</h3>
            <p className="text-4xl font-bold mt-2 text-white">{stats.enrolledCourses}</p>
            <p className="text-sm text-neutral-400 mt-1">Active courses in your library</p>
          </div>
          <div className="bg-white/5 p-6 rounded-2xl border border-purple-400/20 shadow-lg hover:border-purple-400/40 transition-colors">
            <h3 className="text-purple-400 text-sm font-medium uppercase tracking-wide">Completed Lessons</h3>
            <p className="text-4xl font-bold mt-2 text-white">{stats.completedLessons}</p>
            <p className="text-sm text-neutral-400 mt-1">Lessons you've mastered</p>
          </div>
          <div className="bg-white/5 p-6 rounded-2xl border border-purple-400/20 shadow-lg hover:border-purple-400/40 transition-colors">
            <h3 className="text-purple-400 text-sm font-medium uppercase tracking-wide">Overall Progress</h3>
            <p className="text-4xl font-bold mt-2 text-white">
              {stats.totalLessons ? Math.round((stats.completedLessons / stats.totalLessons) * 100) : 0}%
            </p>
            <p className="text-sm text-neutral-400 mt-1">Of all enrolled courses</p>
          </div>
        </div>

        {/* Recent Courses */}
        <div className="bg-white/5 rounded-2xl border border-purple-400/20 shadow-lg overflow-hidden">
          <div className="p-6 border-b border-purple-400/20">
            <h2 className="text-2xl font-semibold text-purple-400">Recent Courses</h2>
          </div>
          <div className="p-6">
            {stats.recentCourses.length > 0 ? (
              <div className="space-y-6">
                {stats.recentCourses.map((course) => (
                  <div key={course.id} className="flex items-center justify-between p-4 bg-black/40 rounded-xl border border-purple-400/10 hover:border-purple-400/30 transition-colors">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-white">{course.title}</h3>
                      <div className="flex items-center gap-4 mt-2">
                        <p className="text-sm text-neutral-400">
                          {course.completedLessons} of {course.totalLessons} lessons completed
                        </p>
                        <div className="w-32 h-2 bg-purple-900/50 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-purple-500 rounded-full"
                            style={{ 
                              width: `${(course.completedLessons / course.totalLessons) * 100}%`
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <a
                      href={`/courses/${course.slug}`}
                      className="ml-4 px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
                    >
                      Continue Learning
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-neutral-400 mb-4">No courses enrolled yet.</p>
                <a 
                  href="/courses" 
                  className="inline-block px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
                >
                  Browse Courses
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 