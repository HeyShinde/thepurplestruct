import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/authOptions"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user?.id) {
    return NextResponse.json({ enrolled: false }, { status: 200 })
  }

  const courseId = req.nextUrl.searchParams.get('courseId')
  if (!courseId) {
    return NextResponse.json({ error: "Missing courseId" }, { status: 400 })
  }

  // Check if enrolled
  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: session.user.id,
        courseId,
      },
    },
  })

  return NextResponse.json({ enrolled: !!enrollment }, { status: 200 })
} 