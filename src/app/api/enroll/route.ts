import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"
import { client as sanityClient } from '@/sanity/lib/client'
import { groq } from 'next-sanity'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { courseId } = await req.json()
  if (!courseId) {
    return NextResponse.json({ error: "Missing courseId" }, { status: 400 })
  }

  // Check if course exists in DB
  let dbCourse = await prisma.course.findUnique({ where: { id: courseId } })
  if (!dbCourse) {
    // Fetch from Sanity
    const sanityCourse = await sanityClient.fetch(groq`*[_type == "course" && _id == $courseId][0]{
      _id,
      title,
      description,
      "imageUrl": image.asset->url,
      slug,
      price
    }`, { courseId })
    if (!sanityCourse) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }
    // Create in DB
    dbCourse = await prisma.course.create({
      data: {
        id: sanityCourse._id,
        title: sanityCourse.title,
        description: sanityCourse.description || '',
        slug: sanityCourse.slug?.current || '',
        price: sanityCourse.price || 0,
        image: sanityCourse.imageUrl || '',
      },
    })
  }

  // Check if already enrolled
  const existing = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: session.user.id,
        courseId,
      },
    },
  })
  if (existing) {
    return NextResponse.json({ message: "Already enrolled" }, { status: 200 })
  }

  // Create enrollment
  const enrollment = await prisma.enrollment.create({
    data: {
      userId: session.user.id,
      courseId,
    },
  })

  return NextResponse.json({ message: "Enrolled successfully", enrollment }, { status: 201 })
} 