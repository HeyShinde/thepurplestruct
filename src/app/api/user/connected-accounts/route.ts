import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const accounts = await prisma.account.findMany({
      where: { userId: session.user.id },
      select: {
        provider: true,
      },
    });

    const connectedProviders = accounts.map((account) => account.provider);

    return NextResponse.json({ connectedProviders });
  } catch (error) {
    console.error("Error fetching connected accounts:", error);
    return NextResponse.json(
      { error: "Failed to fetch connected accounts" },
      { status: 500 }
    );
  }
} 