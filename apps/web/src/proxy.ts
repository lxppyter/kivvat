import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function proxy(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // 1. SKIP STATIC FILES & INTERNALS
  // Strict check to ensure we don't intercept Next.js chunks, CSS, images, etc.
  if (
    pathname.startsWith('/_next') || 
    pathname.startsWith('/api') || 
    pathname.startsWith('/static') || 
    pathname.includes('.') // Skip any file with extension (css, js, png, ico, etc.)
  ) {
    return NextResponse.next();
  }

  // 2. DEFINE PUBLIC ROUTES
  // These routes can be accessed without a token
  const publicRoutes = ['/login', '/register', '/', '/contact', '/legal'];
  // This logic handles dynamic routes better than exact match
  const isPublicRoute = 
      publicRoutes.some(path => pathname === path) || 
      pathname.startsWith('/audit/access/') ||
      pathname.startsWith('/public/policy/') ||
      pathname.startsWith('/public/portal/');

  // 3. AUTHENTICATION LOGIC
  if (token) {
    // Scenario A: User HAS Token
    // Prevent access to Login/Register pages, redirect to Dashboard
    if (pathname === '/login' || pathname === '/register') {
      const url = request.nextUrl.clone();
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }
  } else {
    // Scenario B: User DOES NOT HAVE Token
    // Block access to private routes, redirect to Login
    if (!isPublicRoute) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  // Matcher allows us to filter which paths the proxy runs on.
  // We exclude common static paths here as a first line of defense.
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
