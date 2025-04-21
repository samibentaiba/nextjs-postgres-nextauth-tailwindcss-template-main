import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

const secret = process.env.NEXTAUTH_SECRET
const RATE_LIMIT_MAX = 10 // max requests
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute

// In-memory store for dev rate limiting
const ipRequestMap = new Map<string, { count: number; timestamp: number }>()

function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim()
  }
  // Fallback for localhost/dev
  return '127.0.0.1'
}

export async function middleware(request: NextRequest) {
  const ip = getClientIp(request)

  // DEV MODE RATE LIMITING
  if (process.env.NODE_ENV !== 'production') {
    const now = Date.now()
    const entry = ipRequestMap.get(ip)

    if (entry) {
      if (now - entry.timestamp < RATE_LIMIT_WINDOW) {
        if (entry.count >= RATE_LIMIT_MAX) {
          return new NextResponse(null, { status: 204 }) // Silent fail in dev
        }
        entry.count++
      } else {
        ipRequestMap.set(ip, { count: 1, timestamp: now })
      }
    } else {
      ipRequestMap.set(ip, { count: 1, timestamp: now })
    }
  }

  // AUTH CHECK
  const token = await getToken({ req: request, secret })

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

// Match both SSR pages and sensitive API routes
export const config = {
  matcher: [
    '/about/:path*',
    '/api/auth/forgot-password',
    '/api/auth/verify-reset-token',
  ],
}
