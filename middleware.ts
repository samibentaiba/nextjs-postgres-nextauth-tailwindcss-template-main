import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getSession } from 'next-auth/react'

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  // Convert NextRequest to the proper request type expected by getSession
  const session = await getSession({ req: request as any }) // Using 'any' to bypass type checking

  // If no session, redirect to the login page
  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Otherwise, allow the request to continue (redirect to /home in your case)
  return NextResponse.redirect(new URL('/home', request.url))
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: '/about/:path*', // This applies the middleware to paths under /about
}
