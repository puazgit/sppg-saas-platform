import { NextResponse } from 'next/server'
import { auth } from '@/auth'

export default auth((req) => {
  const { pathname } = req.nextUrl
  const token = req.auth

  // Public routes yang tidak perlu authentication
  const publicRoutes = ['/', '/auth/signin', '/auth/error']
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))

  // API routes untuk auth
  if (pathname.startsWith('/api/auth')) {
    return NextResponse.next()
  }

  // Jika user sudah login dan mencoba akses signin, redirect ke dashboard
  if (token && pathname === '/auth/signin') {
    const userType = token.user?.userType as string
    const redirectUrl = userType === 'SPPG_USER' ? '/sppg' : '/superadmin'
    return NextResponse.redirect(new URL(redirectUrl, req.url))
  }

  // Jika tidak ada token dan bukan public route, redirect ke signin
  if (!token && !isPublicRoute) {
    return NextResponse.redirect(new URL('/auth/signin', req.url))
  }

  // Role-based route protection
  if (token?.user) {
    const userType = token.user.userType as string

    // Protect SuperAdmin routes
    if (pathname.startsWith('/superadmin') && userType !== 'SUPERADMIN') {
      return NextResponse.redirect(new URL('/sppg', req.url))
    }

    // Protect SPPG routes  
    if (pathname.startsWith('/sppg') && userType !== 'SPPG_USER') {
      return NextResponse.redirect(new URL('/superadmin', req.url))
    }

    // Redirect from generic dashboard to specific dashboard
    if (pathname === '/dashboard') {
      const redirectUrl = userType === 'SPPG_USER' ? '/sppg' : '/superadmin'
      return NextResponse.redirect(new URL(redirectUrl, req.url))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files) 
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$).*)',
  ],
}