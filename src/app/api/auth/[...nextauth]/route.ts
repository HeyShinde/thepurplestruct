import NextAuth, { DefaultSession, Session, User, Account, Profile } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
    } & DefaultSession['user']
  }
}

export const authOptions = {
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
    async signIn({ user, account, profile }: { user: User, account: Account | null, profile?: Profile }) {
      const cookieStore = await cookies()
      const isLoginAttempt = cookieStore.get('next-auth.login-attempt')

      if (isLoginAttempt) {
        // This is a sign-in attempt, so the user must exist.
        // Clean up cookie immediately
        cookieStore.delete('next-auth.login-attempt')

        if (!user.email) {
            // Can't check for user if email is not provided
            return false
        }
        const userExists = await prisma.user.findUnique({
          where: { email: user.email },
        })

        if (!userExists) {
          // Block sign-in if user does not exist
          return '/auth/signin?error=AccessDenied'
        }
      }
      // If it's not a login attempt (i.e., from the signup page),
      // we allow new user creation by returning true.
      return true
    },
    async session({ session, token }: { session: any; token: any }) {
      if (session?.user && token?.id) {
        session.user.id = token.id;
      }
      return session;
    },
    async jwt({ token, user }: { token: any; user: any }) {
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
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST } 