import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Array of paths that require authentication
const protectedPaths = [
  '/profile',
  '/bookings',
  '/admin',
];

// Array of paths that should be inaccessible when authenticated
const guestOnlyPaths = [
  '/login',
  '/signup',
];

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token');

  // Get the pathname of the request (e.g. /protected-route)
  const path = request.nextUrl.pathname;

  // Check if the path requires authentication
  const isProtectedPath = protectedPaths.some(prefix => path.startsWith(prefix));
  const isGuestOnlyPath = guestOnlyPaths.some(prefix => path.startsWith(prefix));

  // If the user is logged in and tries to access a guest-only path
  if (token && isGuestOnlyPath) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // If the path is protected and there's no token
  if (isProtectedPath && !token) {
    // Redirect to the login page
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};