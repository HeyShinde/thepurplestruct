import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/authOptions'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const courseId = searchParams.get('courseId')

  if (!courseId) {
    return NextResponse.json({ error: 'Missing courseId' }, { status: 400 })
  }

  try {
    const progress = await prisma.courseProgress.findMany({
      where: {
        userId: session.user.id,
        courseId: courseId,
      },
      select: {
        lessonId: true,
        completed: true,
      }
    })
    return NextResponse.json(progress)
  } catch {
    // console.error('Error fetching course progress:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { courseId, lessonId, completed } = await req.json()

  if (!courseId || !lessonId || typeof completed !== 'boolean') {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  try {
    const progress = await prisma.courseProgress.upsert({
      where: {
        userId_lessonId: {
          userId: session.user.id,
          lessonId,
        },
      },
      update: {
        completed,
      },
      create: {
        userId: session.user.id,
        courseId,
        lessonId,
        completed,
      },
    })
    return NextResponse.json(progress)
  } catch {
    // console.error('Error updating course progress:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
} 