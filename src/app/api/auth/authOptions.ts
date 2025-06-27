import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import type { JWT } from 'next-auth/jwt';
import type { User, Session } from 'next-auth';
import { NextAuthOptions } from 'next-auth'


export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  callbacks: {
    async signIn({ user }: { user: User }) {
      const cookieStore = await cookies();
      const isLoginAttempt = cookieStore.get('next-auth.login-attempt');
      if (isLoginAttempt) {
        cookieStore.delete('next-auth.login-attempt');
        if (!user.email) return false;
        const userExists = await prisma.user.findUnique({
          where: { email: user.email },
        });
        if (!userExists) {
          return '/auth/signin?error=AccessDenied';
        }
      }
      return true;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session?.user && token?.id && typeof token.id === 'string') {
        session.user.id = token.id;
      }
      return session;
    },
    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
  session: {
    strategy: 'jwt' as const,
  },
  pages: {
    signIn: '/auth/signin',
  },
  secret: process.env.NEXTAUTH_SECRET,
}; 