import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/app/api/auth/authOptions"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user's enrollments and progress
    const enrollments = await prisma.enrollment.findMany({
      where: { userId: session.user.id },
      include: {
        course: true,
      },
    })

    const progress = await prisma.courseProgress.findMany({
      where: { userId: session.user.id },
    })

    // Calculate statistics
    const enrolledCourses = enrollments.length
    const completedLessons = progress.filter((p) => p.completed).length

    // Get recent courses with progress
    const recentCourses = await Promise.all(
      enrollments.slice(0, 5).map(async (enrollment) => {
        const courseProgress = await prisma.courseProgress.findMany({
          where: {
            userId: session.user.id,
            courseId: enrollment.courseId,
          },
        })

        return {
          id: enrollment.course.id,
          title: enrollment.course.title,
          slug: enrollment.course.slug,
          completedLessons: courseProgress.filter((p) => p.completed).length,
          totalLessons: courseProgress.length,
        }
      })
    )

    return NextResponse.json({
      enrolledCourses,
      completedLessons,
      recentCourses,
    })
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 }
    )
  }
} 