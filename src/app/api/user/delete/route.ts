import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id;

    // Use a transaction to delete the user and all related data
    await prisma.$transaction([
      // First, delete records that have a foreign key to the user
      prisma.courseProgress.deleteMany({
        where: { userId },
      }),
      prisma.enrollment.deleteMany({
        where: { userId },
      }),
      // NextAuth related models should ideally have cascade deletes set in the schema,
      // but we can be explicit if needed. For now, focusing on what's breaking.
      
      // Finally, delete the user itself
      prisma.user.delete({
        where: { id: userId },
      }),
    ]);

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting account:", error)
    return NextResponse.json(
      { error: "Failed to delete account" },
      { status: 500 }
    )
  }
} 