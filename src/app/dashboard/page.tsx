"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { FaSpinner, FaExclamationTriangle } from "react-icons/fa"

interface Course {
  id: string
  title: string
  slug: string
  completedLessons: number
  totalLessons: number
}

interface DashboardStats {
  enrolledCourses: number
  completedLessons: number
  recentCourses: Course[]
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/dashboard/stats")
        if (!response.ok) {
          throw new Error("Failed to fetch stats")
        }
        const data = await response.json()
        setStats(data)
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error)
        setError("Could not load dashboard data.")
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <FaSpinner className="animate-spin text-4xl text-purple-400" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
        <FaExclamationTriangle className="text-4xl text-red-500 mb-4" />
        <p className="text-xl">{error}</p>
      </div>
    )
  }
  
  const totalLessonsInRecentCourses = stats?.recentCourses.reduce((acc, course) => acc + course.totalLessons, 0) || 0;
  const overallProgress = totalLessonsInRecentCourses > 0 ? Math.round((stats?.completedLessons || 0) / totalLessonsInRecentCourses * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-950 via-black to-black text-white">
      {/* Hero Section */}
      <div className="relative w-full overflow-hidden bg-gradient-to-b from-purple-900/80 to-black/90 py-14 px-4">
        <div className="container mx-auto">
          <h1 className="text-3xl md:text-5xl font-bold mb-2 text-white leading-tight">
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
            <p className="text-3xl md:text-4xl font-bold mt-2 text-white">{stats?.enrolledCourses || 0}</p>
            <p className="text-sm text-neutral-400 mt-1">Active courses in your library</p>
          </div>
          <div className="bg-white/5 p-6 rounded-2xl border border-purple-400/20 shadow-lg hover:border-purple-400/40 transition-colors">
            <h3 className="text-purple-400 text-sm font-medium uppercase tracking-wide">Completed Lessons</h3>
            <p className="text-3xl md:text-4xl font-bold mt-2 text-white">{stats?.completedLessons || 0}</p>
            <p className="text-sm text-neutral-400 mt-1">Lessons you've mastered</p>
          </div>
          <div className="bg-white/5 p-6 rounded-2xl border border-purple-400/20 shadow-lg hover:border-purple-400/40 transition-colors">
            <h3 className="text-purple-400 text-sm font-medium uppercase tracking-wide">Overall Progress</h3>
            <p className="text-3xl md:text-4xl font-bold mt-2 text-white">
              {overallProgress}%
            </p>
            <p className="text-sm text-neutral-400 mt-1">Of all enrolled courses</p>
          </div>
        </div>

        {/* Recent Courses */}
        <div className="bg-white/5 rounded-2xl border border-purple-400/20 shadow-lg overflow-hidden">
          <div className="p-6 border-b border-purple-400/20">
            <h2 className="text-xl md:text-2xl font-semibold text-purple-400">Recent Courses</h2>
          </div>
          <div className="p-6">
            {stats?.recentCourses && stats.recentCourses.length > 0 ? (
              <div className="space-y-6">
                {stats.recentCourses.map((course) => (
                  <div key={course.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 bg-black/40 rounded-xl border border-purple-400/10 hover:border-purple-400/30 transition-colors">
                    <div className="flex-1 w-full mb-4 md:mb-0">
                      <h3 className="font-semibold text-lg text-white">{course.title}</h3>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 mt-2">
                        <p className="text-sm text-neutral-400">
                          {course.completedLessons} of {course.totalLessons} lessons completed
                        </p>
                        <div className="w-full sm:w-32 h-2 bg-purple-900/50 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-purple-500 rounded-full"
                            style={{ 
                              width: `${course.totalLessons > 0 ? (course.completedLessons / course.totalLessons) * 100 : 0}%`
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <a
                      href={`/courses/${course.slug}`}
                      className="w-full md:w-auto ml-0 md:ml-4 px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors text-center"
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