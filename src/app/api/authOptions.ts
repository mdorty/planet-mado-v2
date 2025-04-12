// src/app/api/authOptions.ts
import { type NextAuthOptions, DefaultSession } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { JWT } from 'next-auth/jwt'

// Extend Session type to include isAdmin
declare module 'next-auth' {
  interface Session extends DefaultSession {
    user?: {
      id: string
      isAdmin: boolean
    } & DefaultSession['user']
  }

  interface User {
    isAdmin: boolean
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.isAdmin = user.isAdmin
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.isAdmin = token.isAdmin as boolean
        session.user.id = token.sub as string
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      // Use token to determine admin status
      if (url.startsWith(baseUrl)) {
        const currentUrl = new URL(url)
        // If already redirecting to admin or dashboard, don't redirect again
        if (currentUrl.pathname === '/admin' || currentUrl.pathname === '/dashboard') {
          return url
        }
        
        // Get user from token
        const user = await prisma.user.findFirst({
          orderBy: { createdAt: 'desc' },
          select: {
            isAdmin: true
          }
        })
        
        if (user?.isAdmin) {
          return `${baseUrl}/admin`
        }
        return `${baseUrl}/dashboard`
      }
      return url
    }
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }
        
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          },
          select: {
            id: true,
            name: true,
            email: true,
            isAdmin: true,
            password: true
          }
        })
        
        if (!user) {
          return null
        }
        
        const passwordMatch = await bcrypt.compare(credentials.password, user.password)
        
        if (!passwordMatch) {
          return null
        }
        
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin
        }
      }
    })
  ]
} as NextAuthOptions