import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { randomBytes } from "crypto";
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Get the base URL from environment or request headers
function getBaseUrl(req: Request) {
  // Check if we're in production
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  
  // Check if NEXTAUTH_URL is set
  if (process.env.NEXTAUTH_URL) {
    return process.env.NEXTAUTH_URL;
  }
  
  // Fallback to request headers
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  const host = req.headers.get('host') || 'localhost:3000';
  return `${protocol}://${host}`;
}

export async function POST(req: Request) {
  const { email } = await req.json();
  if (!email || typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    // Don't reveal user existence
    return NextResponse.json({ success: true });
  }

  const token = randomBytes(32).toString("hex");
  const expiry = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

  await prisma.user.update({
    where: { email },
    data: { resetToken: token, resetTokenExpiry: expiry },
  });

  const baseUrl = getBaseUrl(req);
  const resetUrl = `${baseUrl}/auth/reset/${token}`;
  
  try {
    await resend.emails.send({
      from: 'HeyShinde <noreply@heyshinde.com>',
      to: email,
      subject: 'Reset your password',
      html: `
        <h1>Reset Your Password</h1>
        <p>Click the link below to reset your password. This link will expire in 1 hour.</p>
        <a href="${resetUrl}">Reset Password</a>
        <p>If you didn't request this, you can safely ignore this email.</p>
      `,
    });
  } catch (error) {
    console.error('Failed to send reset email:', error);
    // Still return success to prevent email enumeration
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ success: true });
}