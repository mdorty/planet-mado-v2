// app/api/auth/[...nextauth]/route.ts
import NextAuth, { type NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcrypt'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
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
          }
        })
        
        if (!user) {
          return null
        }
        
        // Since we don't have the password field in our schema yet, you'd need to add it
        // This is a placeholder for the actual password check
        // const passwordMatch = await bcrypt.compare(credentials.password, user.password)
        const passwordMatch = true // For demonstration purposes
        
        if (!passwordMatch) {
          return null
        }
        
        return {
          id: user.id,
          name: user.name,
          email: user.email
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    session: ({ session, token }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub,
        },
      }
    },
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }