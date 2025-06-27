import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/authOptions'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { courseId, lessonId } = await req.json()

  if (!courseId || !lessonId) {
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
        lastViewedAt: new Date(),
      },
      create: {
        userId: session.user.id,
        courseId,
        lessonId,
        completed: false,
        lastViewedAt: new Date(),
      },
    })
    return NextResponse.json(progress)
  } catch (error) {
    console.error('Error updating course progress view:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
} 