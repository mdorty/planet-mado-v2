import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname

  // If it's not an admin path, don't do anything
  if (!path.startsWith('/admin')) {
    return NextResponse.next()
  }

  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    })

    // If the user is not logged in or not an admin, redirect to homepage
    if (!token || !token.isAdmin) {
      const url = new URL('/', request.url)
      return NextResponse.redirect(url)
    }

    return NextResponse.next()
  } catch (error) {
    // If there's any error, redirect to homepage for safety
    const url = new URL('/', request.url)
    return NextResponse.redirect(url)
  }
}

// Configure the middleware to run only on admin routes
export const config = {
  matcher: '/admin/:path*',
}
