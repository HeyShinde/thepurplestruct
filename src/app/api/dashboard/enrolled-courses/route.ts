import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Get all enrollments for the user
  const enrollments = await prisma.enrollment.findMany({
    where: { userId: session.user.id },
    include: {
      course: true,
    },
  })

  // For each course, get progress
  const courses = await Promise.all(
    enrollments.map(async (enrollment) => {
      const course = enrollment.course
      
      const courseProgress = await prisma.courseProgress.findMany({
        where: {
          userId: session.user.id,
          courseId: course.id,
        },
      })
      
      const completedLessons = courseProgress.filter((p) => p.completed).length
      const totalLessons = courseProgress.length
      
      return {
        id: course.id,
        title: course.title,
        image: course.image,
        description: course.description,
        slug: course.slug,
        completedLessons,
        totalLessons,
      }
    })
  )

  return NextResponse.json({ courses })
} 