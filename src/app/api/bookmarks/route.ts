import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/authOptions';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }
  const userId = session.user.id;
  const postId = req.nextUrl.searchParams.get('postId');
  if (postId) {
    // Check if bookmarked
    const bookmark = await prisma.bookmark.findUnique({
      where: { userId_postId: { userId, postId } },
    });
    return NextResponse.json({ bookmarked: !!bookmark });
  } else {
    // Get all bookmarks for user
    const bookmarks = await prisma.bookmark.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ bookmarks });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }
  const userId = session.user.id;
  const { postId, postTitle } = await req.json();
  if (!postId || !postTitle) {
    return NextResponse.json({ error: 'Missing postId or postTitle' }, { status: 400 });
  }
  await prisma.bookmark.upsert({
    where: { userId_postId: { userId, postId } },
    update: { postTitle },
    create: { userId, postId, postTitle },
  });
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }
  const userId = session.user.id;
  const { postId } = await req.json();
  if (!postId) {
    return NextResponse.json({ error: 'Missing postId' }, { status: 400 });
  }
  await prisma.bookmark.delete({
    where: { userId_postId: { userId, postId } },
  });
  return NextResponse.json({ success: true });
} 