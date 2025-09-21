import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from './src/lib/supabase/middleware'

// Define protected routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/profile',
  '/listings/create',
  '/listings/edit',
  '/settings',
]

// Define auth routes that should redirect if already logged in
const authRoutes = [
  '/auth/sign-in',
  '/auth/sign-up',
  '/auth/forgot-password',
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Update session first
  const supabaseResponse = await updateSession(request)
  
  // Check if user is authenticated by looking for user ID in headers
  const userId = supabaseResponse.headers.get('x-user-id')
  const isAuthenticated = !!userId
  
  // Handle protected routes
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    if (!isAuthenticated) {
      const signInUrl = new URL('/auth/sign-in', request.url)
      signInUrl.searchParams.set('redirectTo', pathname)
      return NextResponse.redirect(signInUrl)
    }
  }
  
  // Handle auth routes - redirect to home if already authenticated
  if (authRoutes.some(route => pathname.startsWith(route))) {
    if (isAuthenticated) {
      const redirectTo = request.nextUrl.searchParams.get('redirectTo') || '/'
      return NextResponse.redirect(new URL(redirectTo, request.url))
    }
  }
  
  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api routes
     */
    '/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
