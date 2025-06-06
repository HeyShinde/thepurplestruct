import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";

export async function POST(req: Request) {
  const { token, password } = await req.json();
  if (!token || !password) return NextResponse.json({ error: "Token and password required" }, { status: 400 });

  const user = await prisma.user.findFirst({
    where: {
      resetToken: token,
      resetTokenExpiry: { gte: new Date() },
    },
  });
  if (!user) return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });

  const hashedPassword = await hash(password, 10);
  await prisma.user.update({
    where: { id: user.id },
    data: { hashedPassword, resetToken: null, resetTokenExpiry: null },
  });

  return NextResponse.json({ success: true });
}