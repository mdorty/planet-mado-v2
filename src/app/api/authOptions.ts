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
      // Ensure the URL is absolute
      if (url.startsWith('/')) {
        url = `${baseUrl}${url}`
      }

      // Ensure baseUrl is properly formatted
      if (!baseUrl.endsWith('/')) {
        baseUrl = `${baseUrl}/`
      }

      // If URL is already absolute and matches baseUrl, or is a relative URL
      if (url.startsWith(baseUrl) || url.startsWith('/')) {
        const path = url.startsWith(baseUrl) ? url.slice(baseUrl.length) : url
        
        // If already redirecting to admin or dashboard, don't redirect again
        if (path === '/admin' || path === '/dashboard') {
          return url.startsWith('/') ? `${baseUrl}${path.slice(1)}` : url
        }
        
        // Get user from token
        const user = await prisma.user.findFirst({
          orderBy: { createdAt: 'desc' },
          select: {
            isAdmin: true
          }
        })
        
        return user?.isAdmin ? `${baseUrl}admin` : `${baseUrl}dashboard`
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
          console.log('Missing email or password');
          return null;
        }
        
        try {
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
          });
          
          if (!user) {
            console.log('User not found:', credentials.email);
            return null;
          }
          
          const passwordMatch = await bcrypt.compare(credentials.password, user.password);
          
          if (!passwordMatch) {
            console.log('Password mismatch for user:', credentials.email);
            return null;
          }
          
          console.log('Login successful for user:', credentials.email, 'isAdmin:', user.isAdmin);
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin
          };
        } catch (error) {
          console.error('Authorization error:', error);
          return null;
        }
      }
    })
  ]
} as NextAuthOptions